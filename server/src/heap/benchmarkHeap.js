/**
 * Compara extraer los k registros más urgentes usando ColaPrioridad (Heap)
 * frente a ordenar todo el arreglo con mergeSort (AA1) y tomar los k primeros.
 *
 * Ejecutar desde la raíz del repositorio:
 *   node --expose-gc server/src/heap/benchmarkHeap.js
 */
import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ColaPrioridad, comparadorUrgenciaSITU } from './ColaPrioridad.js';
import { mergeSort } from '../ordenamiento/MergeSort.js';
import { crearGenerador } from '../ordenamiento/generador.js';

const VOLUMENES = [1000, 50000, 500000];
const K_URGENTES = 10;
const REPETICIONES = 5;
const SEMILLA = 2026;

const DIRECTORIO_ACTUAL = dirname(fileURLToPath(import.meta.url));
const RAIZ_REPO = resolve(DIRECTORIO_ACTUAL, '..', '..', '..');
const RUTA_CSV = join(RAIZ_REPO, 'resultados_heap.csv');

function generarTelemetriaUrgencias(cantidad, semilla) {
    const aleatorio = crearGenerador(semilla);
    const registros = new Array(cantidad);
    for (let i = 0; i < cantidad; i++) {
        registros[i] = {
            unidadId: (i % 234) + 1,
            rutaId: 1 + Math.floor(aleatorio() * 4),
            retraso: Number((aleatorio() * 30).toFixed(2)),
            nivelAlerta: Math.floor(aleatorio() * 4),
            ts: 1763500000000 + i * 100,
        };
    }
    return registros;
}

function medir(fn) {
    if (typeof globalThis.gc === 'function') globalThis.gc();
    const memAntes = process.memoryUsage().heapUsed;
    const t0 = performance.now();
    const resultado = fn();
    const t1 = performance.now();
    const memDespues = process.memoryUsage().heapUsed;

    return {
        resultado,
        tiempoMs: t1 - t0,
        heapDeltaBytes: Math.max(0, memDespues - memAntes),
    };
}

// Calentamiento JIT
const muestra = generarTelemetriaUrgencias(200, 99);
{
    const c = new ColaPrioridad();
    for (const r of muestra) c.encolar(r);
    c.extraerTopK(K_URGENTES);
    mergeSort(muestra, comparadorUrgenciaSITU).slice(0, K_URGENTES);
}

const filas = [];

for (const n of VOLUMENES) {
    console.log(`Ejecutando benchmark para n = ${n.toLocaleString('es')} (k = ${K_URGENTES})...`);
    let sumaTiempoHeap = 0, sumaMemHeap = 0;
    let sumaTiempoMerge = 0, sumaMemMerge = 0;

    for (let rep = 1; rep <= REPETICIONES; rep++) {
        const datos = generarTelemetriaUrgencias(n, SEMILLA + n + rep);

        const mHeap = medir(() => {
            const cola = new ColaPrioridad();
            for (let i = 0; i < datos.length; i++) {
                cola.encolar(datos[i]);
            }
            return cola.extraerTopK(K_URGENTES);
        });

        const mMerge = medir(() => {
            const ordenados = mergeSort(datos, comparadorUrgenciaSITU);
            return ordenados.slice(0, K_URGENTES);
        });

        // Verificar que ambos métodos obtienen exactamente las mismas k prioridades
        if (mHeap.resultado[0].retraso !== mMerge.resultado[0].retraso) {
            throw new Error('Discrepancia en el elemento más urgente entre Heap y MergeSort');
        }

        sumaTiempoHeap += mHeap.tiempoMs;
        sumaMemHeap += mHeap.heapDeltaBytes;
        sumaTiempoMerge += mMerge.tiempoMs;
        sumaMemMerge += mMerge.heapDeltaBytes;
    }

    filas.push({
        registros: n,
        k: K_URGENTES,
        metodo: 'ColaPrioridad (Heap)',
        tiempoMs: sumaTiempoHeap / REPETICIONES,
        heapMB: sumaMemHeap / REPETICIONES / (1024 * 1024),
    });

    filas.push({
        registros: n,
        k: K_URGENTES,
        metodo: 'MergeSort completo',
        tiempoMs: sumaTiempoMerge / REPETICIONES,
        heapMB: sumaMemMerge / REPETICIONES / (1024 * 1024),
    });
}

console.log('\nRESUMEN BENCHMARK HEAP vs MERGESORT (Top-10 más urgentes)');
console.table(filas.map((f) => ({
    Registros: f.registros,
    K: f.k,
    Metodo: f.metodo,
    'Tiempo prom. (ms)': Number(f.tiempoMs.toFixed(4)),
    'Delta Heap (MB)': Number(f.heapMB.toFixed(4)),
})));

const encabezado = 'registros,k,metodo,tiempo_promedio_ms,heap_delta_mb';
const contenidoCSV = [
    encabezado,
    ...filas.map((f) => `${f.registros},${f.k},"${f.metodo}",${f.tiempoMs.toFixed(6)},${f.heapMB.toFixed(6)}`),
].join('\n') + '\n';

writeFileSync(RUTA_CSV, contenidoCSV, 'utf8');
console.log(`CSV guardado en: ${RUTA_CSV}`);