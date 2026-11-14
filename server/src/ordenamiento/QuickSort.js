/**
 * Algoritmo de ordenamiento QuickSort implementado desde cero (sin usar .sort()).
 *
 * Ordena registros estructurados de telemetría según cualquier criterio definido
 * por una función comparadora. Utiliza selección de pivote por mediana de tres
 * para evitar la degradación cuadrática en arreglos ya ordenados o casi ordenados.
 *
 * Complejidad temporal:
 *  - Caso promedio: O(n log n)
 *  - Peor caso: O(n²)
 * Complejidad espacial: O(log n) en promedio por la pila de recursión.
 */

/**
 * Ordena un arreglo in-place utilizando QuickSort y lo devuelve.
 *
 * @template T
 * @param {T[]} arreglo  Arreglo de elementos o registros estructurados a ordenar.
 * @param {(a: T, b: T) => number} comparador  Función comparadora:
 *   - < 0 si `a` debe ir antes que `b`
 *   - > 0 si `b` debe ir antes que `a`
 *   - 0 si son equivalentes
 * @returns {T[]} El arreglo ordenado.
 */
export function quickSort(arreglo, comparador) {
  if (!Array.isArray(arreglo)) {
    throw new TypeError('El primer argumento debe ser un arreglo');
  }
  if (typeof comparador !== 'function') {
    throw new TypeError('Se requiere una función comparadora válida');
  }
  if (arreglo.length <= 1) return arreglo;

  quickSortRecursivo(arreglo, 0, arreglo.length - 1, comparador);
  return arreglo;
}

/**
 * Ordena recursivamente el subarreglo entre los índices `inicio` y `fin`.
 */
function quickSortRecursivo(arreglo, inicio, fin, comparador) {
  if (inicio >= fin) return;

  const indicePivote = particionarLomuto(arreglo, inicio, fin, comparador);
  quickSortRecursivo(arreglo, inicio, indicePivote - 1, comparador);
  quickSortRecursivo(arreglo, indicePivote + 1, fin, comparador);
}

/**
 * Elige el pivote mediante mediana de tres (inicio, centro y fin),
 * ordena esos tres elementos y coloca el pivote en `fin` para Lomuto.
 */
function prepararPivoteMedianaDeTres(arreglo, inicio, fin, comparador) {
  const medio = (inicio + fin) >> 1;

  if (comparador(arreglo[medio], arreglo[inicio]) < 0) {
    intercambiar(arreglo, inicio, medio);
  }
  if (comparador(arreglo[fin], arreglo[inicio]) < 0) {
    intercambiar(arreglo, inicio, fin);
  }
  if (comparador(arreglo[medio], arreglo[fin]) < 0) {
    intercambiar(arreglo, medio, fin);
  }
  // Ahora arreglo[inicio] <= arreglo[fin] <= arreglo[medio].
  // arreglo[fin] contiene la mediana y queda listo como pivote al final.
}

/**
 * Partición de Lomuto utilizando mediana de tres como pivote.
 */
function particionarLomuto(arreglo, inicio, fin, comparador) {
  prepararPivoteMedianaDeTres(arreglo, inicio, fin, comparador);
  const pivote = arreglo[fin];
  let i = inicio;

  for (let j = inicio; j < fin; j++) {
    if (comparador(arreglo[j], pivote) <= 0) {
      intercambiar(arreglo, i, j);
      i++;
    }
  }
  intercambiar(arreglo, i, fin);
  return i;
}

function intercambiar(arreglo, i, j) {
  const temp = arreglo[i];
  arreglo[i] = arreglo[j];
  arreglo[j] = temp;
}