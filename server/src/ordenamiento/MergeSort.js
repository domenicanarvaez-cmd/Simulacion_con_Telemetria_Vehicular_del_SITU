/**
 * MergeSort implementado desde cero (sin Array.prototype.sort ni otros
 * métodos nativos de ordenamiento).
 *
 * Complejidad: tiempo O(n log n), memoria O(n) por los arreglos auxiliares.
 * Es estable: elementos que empatan conservan su orden original.
 */

/**
 * @param {Array} arreglo      Elementos a ordenar.
 * @param {(a, b) => number} comparador  Negativo si a va antes que b,
 *                             0 si empatan, positivo si b va antes que a.
 * @returns {Array} Arreglo nuevo ordenado (no modifica el original).
 */
export function mergeSort(arreglo, comparador) {
  // 1. Caso base: si arreglo.length <= 1, devolver una copia.
  // 2. Dividir: calcular el punto medio y partir en izquierda y derecha.
  // 3. Conquistar: ordenar cada mitad con llamadas recursivas.
  // 4. Combinar: devolver mezclar(izquierda, derecha, comparador).
    throw new Error('Pendiente de implementar');
}

function mezclar(izquierda, derecha, comparador) {
  // - Dos índices, i (izquierda) y j (derecha), y un arreglo resultado.
  // - Mientras queden elementos en ambas mitades, tomar el menor según el comparador.
  // - En caso de empate, tomar el de la izquierda (esto garantiza estabilidad).
  // - Al terminar, copiar lo que sobre de la mitad que no se agotó.
    throw new Error('Pendiente de implementar');
}