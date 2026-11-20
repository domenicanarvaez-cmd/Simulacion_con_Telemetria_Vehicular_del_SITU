import { writeFileSync } from 'node:fs';
import { mergeSort } from '../ordenamiento/MergeSort.js';

// Criterio de orden y clave del índice: unidadId.
export const porUnidadId = (a, b) => a.unidadId - b.unidadId;

/**
 * Ordena los registros con mergeSort, los guarda en un archivo JSONL
 * (un registro por línea) y construye el índice clave -> posición.
 *
 * @param {Array} registros - Registros a guardar (pueden venir desordenados).
 * @param {string} rutaArchivo - Ruta del archivo .jsonl que se crea.
 * @returns {Array<{clave:number, offset:number, longitud:number}>}
 *          Índice ordenado por clave. `offset` es el byte donde empieza
 *          la línea y `longitud` cuántos bytes ocupa (incluye el '\n').
 */
export function guardarOrdenados(registros, rutaArchivo) {
    const ordenados = mergeSort(registros, porUnidadId);

    const indice = [];
    const lineas = [];
    let offset = 0;

    for (const registro of ordenados) {
        const linea = JSON.stringify(registro) + '\n';
        // Bytes, no caracteres: Buffer.byteLength cuenta bien aunque haya tildes.
        const longitud = Buffer.byteLength(linea, 'utf8');

        indice.push({ clave: registro.unidadId, offset, longitud });
        lineas.push(linea);
        offset += longitud;
    }

    writeFileSync(rutaArchivo, lineas.join(''), 'utf8');
    return indice;
}