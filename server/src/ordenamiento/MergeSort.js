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
    if (arreglo.length <= 1) return arreglo.slice();

  // 2. Dividir: calcular el punto medio y partir en izquierda y derecha.
    let mitad = Math.ceil(arreglo.length / 2);
    let izquierda = arreglo.slice(0, mitad);
    let derecha = arreglo.slice(mitad);

  // 3. Conquistar: ordenar cada mitad con llamadas recursivas.
    let sorted_izquierda = mergeSort(izquierda, comparador);
    let sorted_derecha = mergeSort(derecha, comparador);

  // 4. Combinar: devolver mezclar(izquierda, derecha, comparador).
    return mezclar(sorted_izquierda, sorted_derecha, comparador);
    // throw new Error('Pendiente de implementar');
}

function mezclar(izquierda, derecha, comparador) {
    let arr_resultado = [];
    while (izquierda.length > 0 && derecha.length > 0){
        if (izquierda[0] > derecha[0]) {
            arr_resultado.push(derecha[0]);
            derecha.shift();
        }
        else {
            arr_resultado.push(izquierda[0]);
            izquierda.shift();
        }
    }

    while (izquierda.length > 0){
        arr_resultado.push(izquierda[0]);
        izquierda.shift();
    }

    while (derecha.length > 0){
        arr_resultado.push(derecha[0]);
        derecha.shift();
    }

    return arr_resultado;
}