/**
 * Búsqueda secuencial (lineal): recorre el arreglo elemento por elemento,
 * de principio a fin, hasta encontrar la clave buscada.
 * No requiere que el arreglo esté ordenado.
 *
 * @param {Array} arreglo - Datos donde se busca. Pueden ser valores simples
 *   (números, textos) u objetos.
 * @param {*} clave - Valor que se quiere encontrar.
 * @param {string} [campo] - Nombre de la propiedad a comparar cuando el
 *   arreglo contiene objetos (por ejemplo "id"). Si se omite, se compara
 *   el elemento completo.
 * @returns {{indice: number, comparaciones: number}} Objeto con la posición
 *   donde se encontró la clave (-1 si no existe) y la cantidad de
 *   comparaciones realizadas, que sirve para medir el costo de la búsqueda.
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