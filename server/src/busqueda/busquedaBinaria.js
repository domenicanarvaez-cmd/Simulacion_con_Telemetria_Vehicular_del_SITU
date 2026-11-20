import { openSync, readSync, closeSync } from "node:fs";
import { leerJSONL } from "./busquedaSecuencial.js";

/**
 * Búsqueda binaria iterativa.
 *
 * Requiere que el arreglo esté ordenado de menor a mayor.
 *
 * @param {Array} arregloOrdenado - Arreglo previamente ordenado.
 * @param {*} clave - Valor que se desea encontrar.
 * @param {string} [campo] - Propiedad que se compara cuando hay objetos.
 * @returns {{indice: number, comparaciones: number}}
 */
export function busquedaBinaria(arregloOrdenado, clave, campo) {
  let izquierda = 0;
  let derecha = arregloOrdenado.length - 1;
  let comparaciones = 0;

  while (izquierda <= derecha) {
    const medio = Math.floor((izquierda + derecha) / 2);

    const valor =
      campo !== undefined
        ? arregloOrdenado[medio][campo]
        : arregloOrdenado[medio];

    comparaciones++;

    if (valor === clave) {
      return { indice: medio, comparaciones };
    }

    if (valor < clave) {
      izquierda = medio + 1;
    } else {
      derecha = medio - 1;
    }
  }

  return { indice: -1, comparaciones };
}

/**
 * Reconstruye el índice clave -> posición leyendo el archivo JSONL.
 * Útil cuando el índice ya no está en memoria. Supone que el archivo
 * está ordenado por la clave y escrito como JSON.stringify(registro) + "\n".
 *
 * @param {string} rutaArchivo - Ruta del archivo JSONL.
 * @param {string} [campo="unidadId"] - Propiedad usada como clave.
 * @returns {Array<{clave:number, offset:number, longitud:number}>}
 */
export function construirIndice(rutaArchivo, campo = "unidadId") {
  const indice = [];
  let offset = 0;

  for (const registro of leerJSONL(rutaArchivo)) {
    const longitud = Buffer.byteLength(JSON.stringify(registro) + "\n", "utf8");
    indice.push({ clave: registro[campo], offset, longitud });
    offset += longitud;
  }

  return indice;
}

/**
 * Búsqueda binaria sobre un archivo JSONL. Busca la clave en el índice
 * (usando busquedaBinaria) y, si existe, lee del archivo solo ese registro
 * con readSync en su posición.
 *
 * @param {string} rutaArchivo - Ruta del archivo JSONL.
 * @param {Array<{clave:number, offset:number, longitud:number}>} indice
 *   Índice ordenado por clave.
 * @param {number} clave - Valor a buscar.
 * @returns {{registro: Object|null, comparaciones: number}}
 */
export function buscarBinariaEnArchivo(rutaArchivo, indice, clave) {
  const { indice: posicion, comparaciones } = busquedaBinaria(indice, clave, "clave");

  if (posicion === -1) {
    return { registro: null, comparaciones };
  }

  const { offset, longitud } = indice[posicion];
  const buffer = Buffer.alloc(longitud);
  const fd = openSync(rutaArchivo, "r");
  try {
    readSync(fd, buffer, 0, longitud, offset);
  } finally {
    closeSync(fd);
  }

  return { registro: JSON.parse(buffer.toString("utf8")), comparaciones };
}