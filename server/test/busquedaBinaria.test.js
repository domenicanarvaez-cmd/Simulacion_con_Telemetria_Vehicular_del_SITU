import { test } from "node:test";
import assert from "node:assert/strict";
import { busquedaBinaria } from "../src/busqueda/busquedaBinaria.js";
import { mergeSort } from "../src/ordenamiento/MergeSort.js";
import { generarRegistrosDesordenados } from "../src/busqueda/generarDesordenados.js";

// Datos ordenados de ejemplo.
const datos = [
  { id: 10 },
  { id: 20 },
  { id: 30 },
  { id: 40 },
  { id: 50 },
];

test("encuentra el primer elemento", () => {
  assert.deepStrictEqual(busquedaBinaria(datos, 10, "id"), {
    indice: 0,
    comparaciones: 2,
  });
});

test("encuentra un elemento del medio", () => {
  assert.deepStrictEqual(busquedaBinaria(datos, 30, "id"), {
    indice: 2,
    comparaciones: 1,
  });
});

test("encuentra el último elemento", () => {
  assert.deepStrictEqual(busquedaBinaria(datos, 50, "id"), {
    indice: 4,
    comparaciones: 3,
  });
});

test("devuelve -1 si el elemento no existe", () => {
  assert.deepStrictEqual(busquedaBinaria(datos, 99, "id"), {
    indice: -1,
    comparaciones: 3,
  });
});

test("devuelve -1 con 0 comparaciones en un arreglo vacío", () => {
  assert.deepStrictEqual(busquedaBinaria([], 1, "id"), {
    indice: -1,
    comparaciones: 0,
  });
});

test("funciona con valores simples sin indicar campo", () => {
  assert.deepStrictEqual(busquedaBinaria([4, 8, 15, 16], 15), {
    indice: 2,
    comparaciones: 2,
  });
});

test("busca registros ordenados previamente con MergeSort", () => {
  // Genera 20 registros inicialmente desordenados.
  const registros = generarRegistrosDesordenados(20, 42);

  // Comprueba que los datos inicialmente estén desordenados.
  const estaDesordenado = registros.some(
    (registro, i) =>
      i > 0 && registros[i - 1].unidadId > registro.unidadId
  );

  assert.ok(estaDesordenado);

  // Ordena los registros utilizando MergeSort del AA1.
  const ordenados = mergeSort(
    registros,
    (a, b) => a.unidadId - b.unidadId
  );

  // Comprueba que estén ordenados de menor a mayor.
  for (let i = 1; i < ordenados.length; i++) {
    assert.ok(ordenados[i - 1].unidadId <= ordenados[i].unidadId);
  }

  // Busca la unidadId 10 mediante búsqueda binaria.
  const resultado = busquedaBinaria(ordenados, 10, "unidadId");

  assert.deepStrictEqual(resultado, {
    indice: 9,
    comparaciones: 1,
  });
});