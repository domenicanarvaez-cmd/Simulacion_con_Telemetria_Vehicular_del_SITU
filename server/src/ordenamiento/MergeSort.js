/**
 * Ordena un arreglo mediante Merge Sort.
 *
 * @param {Array} arreglo - Arreglo que se desea ordenar.
 * @param {(a, b) => number} comparador - Función externa que determina
 * el orden de los elementos.
 * @returns {Array} Un nuevo arreglo ordenado.
 */
export function mergeSort(arreglo, comparador) {

    // Caso base
    if (arreglo.length <= 1) {
        return arreglo.slice();
    }

    // Dividir
    const mitad = Math.ceil(arreglo.length / 2);

    const izquierda = arreglo.slice(0, mitad);
    const derecha = arreglo.slice(mitad);

    // Conquistar: ordenar recursivamente
    const sortedIzquierda = mergeSort(izquierda, comparador);
    const sortedDerecha = mergeSort(derecha, comparador);

    // Combinar
    return mezclar(sortedIzquierda, sortedDerecha, comparador);
}

function mezclar(izquierda, derecha, comparador) {

    const resultado = [];

    let i = 0;
    let j = 0;

    // Comparar los elementos de ambas mitades
    while (i < izquierda.length && j < derecha.length) {

        if (comparador(izquierda[i], derecha[j]) <= 0) {
            resultado.push(izquierda[i]);
            i++;
        } else {
            resultado.push(derecha[j]);
            j++;
        }
    }

    // Agregar los elementos restantes
    while (i < izquierda.length) {
        resultado.push(izquierda[i]);
        i++;
    }

    while (j < derecha.length) {
        resultado.push(derecha[j]);
        j++;
    }

    return resultado;
}
