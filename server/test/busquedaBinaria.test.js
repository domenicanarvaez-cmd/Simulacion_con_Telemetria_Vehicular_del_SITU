import { test } from "node:test";
import assert from "node:assert/strict";
import { busquedaBinaria } from "../src/busqueda/busquedaBinaria.js";

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