import { crearGenerador, generarRegistros } from '../ordenamiento/generador.js';

// Mezcla un arreglo con Fisher-Yates (modifica el arreglo recibido).
function mezclar(arreglo, aleatorio) {
    for (let i = arreglo.length - 1; i > 0; i--) {
        const j = Math.floor(aleatorio() * (i + 1));
        [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
    }
    return arreglo;
}

/**
 * Genera registros de telemetría con unidadId únicos y en orden aleatorio.
 * La misma semilla produce siempre el mismo resultado.
 */
export function generarRegistrosDesordenados(cantidad, semilla) {
    const registros = generarRegistros(cantidad, semilla);
    // Otra semilla para la mezcla, para no repetir la secuencia de generarRegistros.
    return mezclar(registros, crearGenerador(semilla + 1));
}