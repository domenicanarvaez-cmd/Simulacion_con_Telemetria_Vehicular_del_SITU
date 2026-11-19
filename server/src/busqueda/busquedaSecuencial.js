import { readFileSync } from "node:fs";

/**
 * Lee un archivo JSONL (un objeto JSON por línea) y devuelve un arreglo de objetos.
 *
 * @param {string} rutaArchivo - Ruta del archivo (por ejemplo "./telemetria.jsonl").
 * @returns {Array<Object>} Arreglo con los registros del archivo.
 */
export function leerJSONL(rutaArchivo) {
  const contenido = readFileSync(rutaArchivo, "utf-8");

  return contenido
    .split("\n")
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0) // ignora líneas vacías
    .map((linea, i) => {
      try {
        return JSON.parse(linea);
      } catch {
        throw new Error(`Línea ${i + 1} no es un JSON válido: ${linea}`);
      }
    });
}

/**
 * Búsqueda secuencial (lineal): recorre el arreglo elemento por elemento,
 * de principio a fin, hasta encontrar la clave buscada.
 * No requiere que el arreglo esté ordenado.
 *
 * @param {Array} arreglo - Datos donde se busca (valores simples u objetos).
 * @param {*} clave - Valor que se quiere encontrar.
 * @param {string} [campo] - Propiedad a comparar cuando el arreglo contiene
 *   objetos (por ejemplo "unidadId"). Si se omite, se compara el elemento completo.
 * @returns {{indice: number, comparaciones: number}} Posición donde se encontró
 *   la clave (-1 si no existe) y cantidad de comparaciones realizadas.
 */
export function busquedaSecuencial(arreglo, clave, campo) {
  // Contador de comparaciones, usado luego para analizar el rendimiento
  let comparaciones = 0;

  
  for (let i = 0; i < arreglo.length; i++) {
    comparaciones++;

    // Si se indicó un campo, se compara esa propiedad del objeto;
    // si no, se compara directamente el elemento
    const valor = campo !== undefined ? arreglo[i][campo] : arreglo[i];

    if (valor === clave) {
      // Lo encontró: devuelve su posición y cuántas comparaciones hizo
      return { indice: i, comparaciones };
    }
  }
  
  // Recorrió todo el arreglo sin encontrarlo: el peor caso, n comparaciones
  return { indice: -1, comparaciones };
}

/**
 * Busca una clave dentro de un archivo JSONL.
 * Combina la lectura del archivo con la búsqueda secuencial.
 *
 * @param {string} rutaArchivo - Ruta del archivo JSONL.
 * @param {*} clave - Valor a buscar.
 * @param {string} campo - Propiedad a comparar ("unidadId", "velocidad" o "ts").
 * @returns {{indice: number, comparaciones: number, registro: Object|null}}
 */
export function buscarEnArchivo(rutaArchivo, clave, campo) {
  const datos = leerJSONL(rutaArchivo);
  const { indice, comparaciones } = busquedaSecuencial(datos, clave, campo);

  return {
    indice,
    comparaciones,
    registro: indice !== -1 ? datos[indice] : null,
  };
}