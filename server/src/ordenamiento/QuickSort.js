/**
 * Algoritmo de ordenamiento QuickSort implementado desde cero (sin usar .sort()).
 *
 * Utiliza selección de pivote por mediana de tres y partición en tres vías
 * (Dutch National Flag: menores, iguales y mayores que el pivote). Esto evita
 * la degradación cuadrática y el desbordamiento de pila (Stack Overflow) cuando
 * existen miles de registros con claves repetidas (ej. ordenar 100 000 tramas
 * por lineaId/rutaId).
 *
 * Complejidad temporal:
 *  - Caso promedio: O(n log n)
 *  - Arreglos con claves repetidas / iguales: O(n)
 *  - Peor caso: O(n²)
 * Complejidad espacial: O(log n) en promedio por la pila de recursión.
 */

/**
 * Ordena un arreglo in-place utilizando QuickSort de 3 vías y lo devuelve.
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

  quickSort3Vias(arreglo, 0, arreglo.length - 1, comparador);
  return arreglo;
}

/**
 * Ordena recursivamente el subarreglo entre `inicio` y `fin` mediante
 * partición en tres vías (Dutch National Flag).
 */
function quickSort3Vias(arreglo, inicio, fin, comparador) {
  if (inicio >= fin) return;

  // Selección de pivote por mediana de tres y colocación en `inicio`
  elegirPivoteMedianaDeTres(arreglo, inicio, fin, comparador);
  const pivote = arreglo[inicio];

  // Invariante de Dijkstra (Dutch National Flag):
  //   arreglo[inicio .. lt - 1] < pivote
  //   arreglo[lt .. i - 1]      === pivote
  //   arreglo[i .. gt]          sin examinar
  //   arreglo[gt + 1 .. fin]    > pivote
  let lt = inicio;
  let i = inicio + 1;
  let gt = fin;

  while (i <= gt) {
    const cmp = comparador(arreglo[i], pivote);
    if (cmp < 0) {
      intercambiar(arreglo, lt, i);
      lt++;
      i++;
    } else if (cmp > 0) {
      intercambiar(arreglo, i, gt);
      gt--;
    } else {
      i++;
    }
  }

  // Los elementos en [lt .. gt] ya son iguales al pivote y no se vuelven a tocar.
  quickSort3Vias(arreglo, inicio, lt - 1, comparador);
  quickSort3Vias(arreglo, gt + 1, fin, comparador);
}

/**
 * Ordena inicio, centro y fin, y deja la mediana en `inicio` para usarla como pivote.
 */
function elegirPivoteMedianaDeTres(arreglo, inicio, fin, comparador) {
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
  // La mediana está en `fin`; la movemos a `inicio` como pivote.
  intercambiar(arreglo, inicio, fin);
}

function intercambiar(arreglo, i, j) {
  const temp = arreglo[i];
  arreglo[i] = arreglo[j];
  arreglo[j] = temp;
}