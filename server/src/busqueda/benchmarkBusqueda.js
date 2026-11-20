/**
 * benchmarkBusqueda.js  —  AA2-U2, issue #10
 * ---------------------------------------------------------------
 * Prueba de estrés que compara la búsqueda SECUENCIAL O(n) con la
 * búsqueda BINARIA O(log n), en dos lugares:
 *   1) En memoria: los registros están en un arreglo de JavaScript.
 *   2) En archivo indexado: los registros están en un archivo .jsonl
 *      en el disco y existe un índice clave -> posición (offset).
 *
 * Para cada volumen de datos (1 000, 50 000 y 500 000 registros) mide:
 *   - Tiempo promedio por búsqueda (ms), con performance.now().
 *   - Comparaciones promedio por búsqueda (cuántas veces se comparó
 *     la clave buscada con un registro).
 *   - CPU promedio por búsqueda (µs), con process.cpuUsage().
 *     Node no mide "ciclos de CPU" directamente; el tiempo de CPU
 *     usado por el proceso es la aproximación más cercana.
 *
 * Ejecución (desde la raíz del repositorio):
 *   node --expose-gc server/src/busqueda/benchmarkBusqueda.js
 *
 * Resultado: tabla en consola + archivo resultados_busqueda.csv
 * ---------------------------------------------------------------
 */

// performance.now(): reloj de alta precisión, en milisegundos.
import { performance } from 'node:perf_hooks';
// Funciones para escribir archivos en el disco.
import { writeFileSync, mkdirSync } from 'node:fs';
// Utilidades para armar rutas de carpetas y archivos.
import { dirname, resolve, join } from 'node:path';
// Convierte la URL de este archivo en una ruta normal del sistema.
import { fileURLToPath } from 'node:url';
// Carpeta temporal del sistema operativo (para los .jsonl de prueba).
import { tmpdir } from 'node:os';
// MergeSort del AA1: ordena SIN usar .sort() (requisito del curso).
import { mergeSort } from '../ordenamiento/MergeSort.js';

// ---------------------------------------------------------------
// 1. CONFIGURACIÓN DE LA PRUEBA
// ---------------------------------------------------------------

// Volúmenes de datos que pide el enunciado.
const VOLUMENES = [1000, 50000, 500000];

// Cuántas búsquedas se hacen por método y volumen.
// La secuencial en ARCHIVO recorre el archivo completo en cada
// búsqueda, por eso se hacen menos (si no, tardaría horas).
// Igual se reporta el PROMEDIO por búsqueda, que sí es comparable.
const BUSQUEDAS_MEMORIA = 1000;
const BUSQUEDAS_ARCHIVO_BINARIA = 1000;
const BUSQUEDAS_ARCHIVO_SECUENCIAL = 30;

// Porcentaje de claves que NO existen (peor caso de la búsqueda).
const PORCENTAJE_INEXISTENTES = 0.2;

// Semilla: con la misma semilla siempre salen los mismos datos,
// así cualquier integrante puede repetir el experimento.
const SEMILLA = 2026;

// Carpeta de este archivo y raíz del repositorio (3 niveles arriba).
const DIRECTORIO_ACTUAL = dirname(fileURLToPath(import.meta.url));
const RAIZ_REPO = resolve(DIRECTORIO_ACTUAL, '..', '..', '..');
const RUTA_CSV = join(RAIZ_REPO, 'resultados_busqueda.csv');

// Los archivos .jsonl se crean en la carpeta temporal del sistema,
// para no llenar el repositorio con archivos grandes.
const CARPETA_DATOS = join(tmpdir(), 'situ-busqueda-aa2');

// ---------------------------------------------------------------
// 2. CARGA "SEGURA" DE LAS FUNCIONES DEL EQUIPO
// ---------------------------------------------------------------

/**
 * Intenta importar una función desde un archivo del equipo.
 * Si el archivo o la función todavía no existen, devuelve null
 * en vez de detener todo el programa.
 */
async function cargarFuncion(rutaRelativa, nombreFuncion) {
    try {
        // import() dinámico: carga el módulo en tiempo de ejecución.
        const modulo = await import(rutaRelativa);
        // Si el módulo existe pero no exporta esa función, es null.
        return typeof modulo[nombreFuncion] === 'function' ? modulo[nombreFuncion] : null;
    } catch {
        // El archivo no existe todavía: se avisará más adelante.
        return null;
    }
}

// Búsqueda secuencial en memoria (Jahir, issue #7).
// Contrato: busquedaSecuencial(arreglo, clave, campo) -> { indice, comparaciones }
const busquedaSecuencial = await cargarFuncion('./busquedaSecuencial.js', 'busquedaSecuencial');

// Búsqueda binaria en memoria (Galo, issue #8).
// Contrato: busquedaBinaria(arregloOrdenado, clave, campo) -> { indice, comparaciones }
const busquedaBinaria = await cargarFuncion('./busquedaBinaria.js', 'busquedaBinaria');

// Guardar ordenados + construir índice (José, issue #9).
// Contrato: guardarOrdenados(registros, rutaArchivo) -> [{ clave, offset, longitud }]
const guardarOrdenados = await cargarFuncion('./almacenamientoOrdenado.js', 'guardarOrdenados');

// Búsquedas sobre el archivo indexado (José, issue #9).
// Contrato: buscarSecuencialEnArchivo(rutaArchivo, clave) -> { registro, comparaciones }
// Contrato: buscarBinariaEnIndice(rutaArchivo, indice, clave) -> { registro, comparaciones }
const buscarSecuencialEnArchivo = await cargarFuncion('./busquedaSecuencial.js', 'buscarEnArchivo');
const buscarBinariaEnIndice = await cargarFuncion('./busquedaBinaria.js', 'buscarBinariaEnArchivo');
// ---------------------------------------------------------------
// 3. GENERACIÓN DE DATOS DE TELEMETRÍA
// ---------------------------------------------------------------

/**
 * Generador de números pseudoaleatorios con semilla (método
 * congruencial lineal). Devuelve números entre 0 y 1 que se repiten
 * igual cada vez que se usa la misma semilla.
 */
function crearGenerador(semilla) {
    let estado = semilla >>> 0;               // entero sin signo de 32 bits
    return function () {
        // Fórmula del generador: estado = a * estado + c (mod 2^32)
        estado = (Math.imul(1664525, estado) + 1013904223) >>> 0;
        return estado / 4294967296;           // se lleva al rango [0, 1)
    };
}

/**
 * Crea "cantidad" registros del SITU con unidadId únicos (1..cantidad)
 * y luego los DESORDENA, para que el paso de ordenamiento sea real.
 */
function generarRegistros(cantidad, semilla) {
    const aleatorio = crearGenerador(semilla);
    const registros = new Array(cantidad);    // arreglo de tamaño fijo

    for (let i = 0; i < cantidad; i++) {
        registros[i] = {
            unidadId: i + 1,                                  // clave única
            rutaId: 1 + Math.floor(aleatorio() * 12),         // línea del SITU
            velocidad: Number((aleatorio() * 60).toFixed(2)), // km/h
            ts: 1763500000000 + Math.floor(aleatorio() * 86400000) // marca de tiempo
        };
    }

    // Mezcla de Fisher-Yates: intercambia cada posición con otra al azar.
    for (let i = cantidad - 1; i > 0; i--) {
        const j = Math.floor(aleatorio() * (i + 1));
        const temporal = registros[i];
        registros[i] = registros[j];
        registros[j] = temporal;
    }
    return registros;
}

/**
 * Elige las claves que se van a buscar: la mayoría existen
 * (entre 1 y n) y un porcentaje NO existe (mayores que n),
 * para incluir el peor caso de cada búsqueda.
 */
function generarClaves(cantidadClaves, n, semilla) {
    const aleatorio = crearGenerador(semilla);
    const claves = new Array(cantidadClaves);

    for (let i = 0; i < cantidadClaves; i++) {
        const noExiste = aleatorio() < PORCENTAJE_INEXISTENTES;
        claves[i] = noExiste
            ? n + 1 + Math.floor(aleatorio() * n)   // clave fuera del rango: no está
            : 1 + Math.floor(aleatorio() * n);      // clave dentro del rango: sí está
    }
    return claves;
}

// Comparador para ordenar por unidadId (la clave de búsqueda).
const porUnidadId = (a, b) => a.unidadId - b.unidadId;

// ---------------------------------------------------------------
// 4. MEDICIÓN DE UN MÉTODO DE BÚSQUEDA
// ---------------------------------------------------------------

/**
 * Ejecuta "buscar" con cada clave y mide el promedio de tiempo,
 * comparaciones y CPU por búsqueda.
 * "buscar" es una función que recibe una clave y devuelve un
 * objeto con la propiedad "comparaciones".
 */
function medir(buscar, claves) {
    // Limpia la memoria antes de medir (solo si se usó --expose-gc),
    // para que el recolector de basura no interrumpa la medición.
    if (global.gc) global.gc();

    let totalComparaciones = 0;

    // Calentamiento: unas búsquedas sin medir, para que V8 compile
    // el código antes de empezar a cronometrar (compilación JIT).
    for (let i = 0; i < Math.min(5, claves.length); i++) buscar(claves[i]);

    const cpuInicio = process.cpuUsage();   // CPU usada hasta ahora (µs)
    const inicio = performance.now();       // hora de inicio (ms)

    for (const clave of claves) {
        const resultado = buscar(clave);
        totalComparaciones += resultado.comparaciones;
    }

    const tiempoTotal = performance.now() - inicio;   // ms transcurridos
    const cpu = process.cpuUsage(cpuInicio);          // CPU usada desde cpuInicio

    return {
        tiempoMs: tiempoTotal / claves.length,                    // promedio por búsqueda
        comparaciones: totalComparaciones / claves.length,        // promedio por búsqueda
        cpuUs: (cpu.user + cpu.system) / claves.length            // promedio por búsqueda
    };
}

// ---------------------------------------------------------------
// 5. PROGRAMA PRINCIPAL
// ---------------------------------------------------------------

// Avisos sobre las partes que todavía no están en el repositorio.
const faltantes = [];
if (!busquedaSecuencial) faltantes.push('busquedaSecuencial.js (issue #7)');
if (!busquedaBinaria) faltantes.push('busquedaBinaria.js (issue #8)');
if (!guardarOrdenados || !buscarSecuencialEnArchivo || !buscarBinariaEnIndice) {
    faltantes.push('almacenamientoOrdenado.js / busquedaArchivo.js (issue #9)');
}
if (faltantes.length > 0) {
    console.log('AVISO: todavía faltan estas partes; sus métodos se saltan:');
    for (const f of faltantes) console.log('  - ' + f);
    console.log('');
}
if (!global.gc) {
    console.log('AVISO: ejecuta con --expose-gc para mediciones más estables.\n');
}

// Crea la carpeta temporal para los archivos .jsonl (si no existe).
mkdirSync(CARPETA_DATOS, { recursive: true });

const filas = [];   // aquí se guardan todos los resultados

for (const n of VOLUMENES) {
    console.log(`Preparando ${n} registros...`);

    // 1) Generar los registros desordenados.
    const registros = generarRegistros(n, SEMILLA + n);

    // 2) Ordenarlos con el MergeSort del AA1 (la binaria lo necesita).
    const ordenados = mergeSort(registros, porUnidadId);

    // 3) Elegir las claves a buscar (las mismas para todos los métodos).
    const claves = generarClaves(BUSQUEDAS_MEMORIA, n, SEMILLA * 7 + n);

    // Peores casos teóricos, para comparar con lo medido.
    const teoricoSecuencial = n;                              // O(n)
    const teoricoBinaria = Math.floor(Math.log2(n)) + 1;      // O(log n)

    // Función auxiliar para guardar una fila de resultados.
    const agregar = (lugar, metodo, busquedas, teorico, m) => {
        filas.push({ n, lugar, metodo, busquedas, teorico, ...m });
    };

    // --- En memoria ---
    if (busquedaSecuencial) {
        const m = medir((c) => busquedaSecuencial(ordenados, c, 'unidadId'), claves);
        agregar('Memoria', 'Secuencial', claves.length, teoricoSecuencial, m);
    }
    if (busquedaBinaria) {
        const m = medir((c) => busquedaBinaria(ordenados, c, 'unidadId'), claves);
        agregar('Memoria', 'Binaria', claves.length, teoricoBinaria, m);
    }

    // --- En archivo indexado ---
    if (guardarOrdenados && buscarSecuencialEnArchivo && buscarBinariaEnIndice) {
        const rutaArchivo = join(CARPETA_DATOS, `datos_${n}.jsonl`);
        // Guarda el archivo y obtiene el índice clave -> offset.
        const indice = guardarOrdenados(registros, rutaArchivo);

        // Secuencial en archivo: menos búsquedas porque cada una lee todo.
        const clavesSec = claves.slice(0, BUSQUEDAS_ARCHIVO_SECUENCIAL);
        const ms = medir((c) => buscarSecuencialEnArchivo(rutaArchivo, c, 'unidadId'), clavesSec);
        agregar('Archivo', 'Secuencial', clavesSec.length, teoricoSecuencial, ms);

        const clavesBin = claves.slice(0, BUSQUEDAS_ARCHIVO_BINARIA);
        const mb = medir((c) => buscarBinariaEnIndice(rutaArchivo, indice, c), clavesBin);
        agregar('Archivo', 'Binaria', clavesBin.length, teoricoBinaria, mb);
    }
}

// ---------------------------------------------------------------
// 6. RESULTADOS: CONSOLA Y CSV
// ---------------------------------------------------------------

console.log('\nRESUMEN DEL BENCHMARK DE BÚSQUEDA (promedios por búsqueda)');
console.table(filas.map((f) => ({
    Registros: f.n,
    Lugar: f.lugar,
    Metodo: f.metodo,
    Busquedas: f.busquedas,
    'Tiempo (ms)': Number(f.tiempoMs.toFixed(5)),
    Comparaciones: Number(f.comparaciones.toFixed(1)),
    'Peor caso teorico': f.teorico,
    'CPU (µs)': Number(f.cpuUs.toFixed(2))
})));

// Factor de ahorro: cuántas veces más rápida es la binaria que la
// secuencial en el mismo lugar y volumen.
console.log('Ahorro de la búsqueda binaria frente a la secuencial:');
for (const n of VOLUMENES) {
    for (const lugar of ['Memoria', 'Archivo']) {
        const sec = filas.find((f) => f.n === n && f.lugar === lugar && f.metodo === 'Secuencial');
        const bin = filas.find((f) => f.n === n && f.lugar === lugar && f.metodo === 'Binaria');
        if (sec && bin) {
            console.log(`  ${lugar}, n=${n}: ${(sec.tiempoMs / bin.tiempoMs).toFixed(1)} veces menos tiempo, ` +
                `${(sec.comparaciones / bin.comparaciones).toFixed(1)} veces menos comparaciones`);
        }
    }
}

// Construye el CSV: una fila de encabezados y una fila por medición.
const encabezado = 'registros,lugar,metodo,busquedas,tiempo_promedio_ms,comparaciones_promedio,peor_caso_teorico,cpu_promedio_us';
const lineas = filas.map((f) => [
    f.n, f.lugar, f.metodo, f.busquedas,
    f.tiempoMs.toFixed(6), f.comparaciones.toFixed(2), f.teorico, f.cpuUs.toFixed(3)
].join(','));
writeFileSync(RUTA_CSV, [encabezado, ...lineas].join('\n') + '\n', 'utf8');

console.log(`\nResultados guardados en: ${RUTA_CSV}`);