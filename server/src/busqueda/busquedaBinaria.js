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