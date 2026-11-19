export function busquedaSecuencial(arreglo, clave, campo) {
  let comparaciones = 0;
  for (let i = 0; i < arreglo.length; i++) {
    comparaciones++;
    const valor = campo !== undefined ? arreglo[i][campo] : arreglo[i];
    if (valor === clave) {
      return { indice: i, comparaciones };
    }
  }
  return { indice: -1, comparaciones };
}