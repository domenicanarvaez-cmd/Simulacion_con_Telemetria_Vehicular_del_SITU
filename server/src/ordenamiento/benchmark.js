/**
 * Benchmark de MergeSort y QuickSort.
 *
 * Compara el tiempo de ejecución y la variación de memoria
 * utilizando registros de telemetría.
 *
 * Se realizan 5 repeticiones para cada tamaño:
 * 1.000, 10.000 y 100.000 registros.
 */

import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeSort } from './MergeSort.js';
import { quickSort } from './QuickSort.js';

// Configuración del benchmark
const TAMANOS = [1000, 10000, 100000];
const REPETICIONES = 5;

const DIRECTORIO_ACTUAL = dirname(fileURLToPath(import.meta.url));
const RUTA_CSV = resolve(DIRECTORIO_ACTUAL, '../../../resultados.csv');

// Comparador: velocidad, fecha y unidad.
function compararTelemetria(a, b) {
    return (a.velocidad - b.velocidad)
        || (a.ts - b.ts)
        || (a.unidadId - b.unidadId);
}

// Generador de números pseudoaleatorios reproducibles.
function crearGenerador(semilla) {
    let estado = semilla >>> 0;

    return function () {
        estado = (Math.imul(1664525, estado) + 1013904223) >>> 0;
        return estado / 4294967296;
    };
}

// Genera registros de telemetría.
function generarRegistros(cantidad, semilla) {
    const aleatorio = crearGenerador(semilla);

    return Array.from({ length: cantidad }, (_, i) => ({
        unidadId: i + 1,
        velocidad: Number((aleatorio() * 120).toFixed(2)),
        ts: Math.floor(aleatorio() * 1000000)
    }));
}

// Comprueba que el resultado esté ordenado.
function estaOrdenado(arreglo, comparador) {
    for (let i = 1; i < arreglo.length; i++) {
        if (comparador(arreglo[i - 1], arreglo[i]) > 0) {
            return false;
        }
    }

    return true;
}

// Mide tiempo y memoria de un algoritmo.
function medir(nombre, algoritmo, datosOriginales, repeticion) {

    // Cada algoritmo recibe una copia independiente.
    const copia = datosOriginales.map(registro => ({ ...registro }));

    // Reduce el ruido de mediciones anteriores cuando está disponible.
    if (typeof globalThis.gc === 'function') {
        globalThis.gc();
    }

    // Memoria antes de ordenar.
    const memoriaAntes = process.memoryUsage().heapUsed;

    // Inicio de la medición del tiempo.
    const inicio = performance.now();

    const resultado = algoritmo(copia, compararTelemetria);

    // Fin de la medición del tiempo.
    const fin = performance.now();

    // Memoria después de ordenar.
    const memoriaDespues = process.memoryUsage().heapUsed;

    // Comprobamos que el algoritmo haya ordenado correctamente.
    if (!Array.isArray(resultado) ||
        resultado.length !== datosOriginales.length ||
        !estaOrdenado(resultado, compararTelemetria)) {
        throw new Error(`${nombre} no ordenó correctamente los registros.`);
    }

    return {
        algoritmo: nombre,
        tamano: datosOriginales.length,
        repeticion,
        tiempoMs: fin - inicio,
        heapDeltaBytes: memoriaDespues - memoriaAntes
    };
}

// Calcula los promedios de las mediciones.
function calcularPromedio(mediciones, propiedad) {
    const suma = mediciones.reduce(
        (total, medicion) => total + medicion[propiedad],
        0
    );

    return suma / mediciones.length;
}

// Ejecuta todas las pruebas.
function ejecutarBenchmark() {
    const mediciones = [];

    // Prueba de calentamiento fuera de las mediciones.
    const muestra = generarRegistros(100, 12345);
    mergeSort(muestra, compararTelemetria);
    quickSort(muestra.map(registro => ({ ...registro })), compararTelemetria);

    for (const tamano of TAMANOS) {
        console.log(`\nProcesando ${tamano} registros...`);

        for (let repeticion = 1; repeticion <= REPETICIONES; repeticion++) {

            // Ambos algoritmos reciben los mismos datos originales.
            const datos = generarRegistros(
                tamano,
                tamano + repeticion * 1000
            );

            let resultadoMerge;
            let resultadoQuick;

            // Alternamos el orden para reducir posibles sesgos.
            if (repeticion % 2 === 1) {
                resultadoMerge = medir(
                    'MergeSort', mergeSort, datos, repeticion
                );

                resultadoQuick = medir(
                    'QuickSort', quickSort, datos, repeticion
                );
            } else {
                resultadoQuick = medir(
                    'QuickSort', quickSort, datos, repeticion
                );

                resultadoMerge = medir(
                    'MergeSort', mergeSort, datos, repeticion
                );
            }

            mediciones.push(resultadoMerge, resultadoQuick);
        }
    }

    guardarResultados(mediciones);
}

// Guarda los resultados individuales y los promedios en CSV.
function guardarResultados(mediciones) {
    const filas = [
        'algoritmo,tamano,repeticion,tiempo_ms,heap_delta_bytes,heap_delta_mb'
    ];

    const resumen = [];

    for (const tamano of TAMANOS) {
        for (const nombre of ['MergeSort', 'QuickSort']) {

            const grupo = mediciones.filter(
                m => m.tamano === tamano && m.algoritmo === nombre
            );

            const promedioTiempo = calcularPromedio(grupo, 'tiempoMs');
            const promedioMemoria = calcularPromedio(grupo, 'heapDeltaBytes');

            // Guardamos las cinco mediciones individuales.
            for (const m of grupo) {
                filas.push([
                    m.algoritmo,
                    m.tamano,
                    m.repeticion,
                    m.tiempoMs.toFixed(4),
                    m.heapDeltaBytes,
                    (m.heapDeltaBytes / (1024 * 1024)).toFixed(6)
                ].join(','));
            }

            // Guardamos también la fila del promedio.
            filas.push([
                nombre,
                tamano,
                'PROMEDIO',
                promedioTiempo.toFixed(4),
                promedioMemoria.toFixed(2),
                (promedioMemoria / (1024 * 1024)).toFixed(6)
            ].join(','));

            resumen.push({
                algoritmo: nombre,
                registros: tamano,
                tiempoMs: promedioTiempo,
                memoriaMB: promedioMemoria / (1024 * 1024)
            });
        }
    }

    writeFileSync(RUTA_CSV, filas.join('\n') + '\n', 'utf8');

    console.log('\nRESUMEN DEL BENCHMARK');
    console.table(resumen.map(r => ({
        Algoritmo: r.algoritmo,
        Registros: r.registros,
        'Tiempo promedio (ms)': Number(r.tiempoMs.toFixed(4)),
        'Delta heap promedio (MB)': Number(r.memoriaMB.toFixed(6))
    })));

    console.log(`\nResultados guardados en: ${RUTA_CSV}`);
}

// Ejecutamos el benchmark.
ejecutarBenchmark();