import { test } from "node:test";
import assert from "node:assert/strict";
import { busquedaSecuencial } from "../src/busqueda/busquedaSecuencial.js";

// Datos de ejemplo: arreglo de objetos con un campo "id"
const datos = [{ id: 10 }, { id: 20 }, { id: 30 }, { id: 40 }, { id: 50 }];

test("encuentra el primer elemento con 1 comparación (mejor caso)", () => {
  assert.deepStrictEqual(busquedaSecuencial(datos, 10, "id"), {
    indice: 0,
    comparaciones: 1,
  });
});

test("encuentra un elemento del medio", () => {
  assert.deepStrictEqual(busquedaSecuencial(datos, 30, "id"), {
    indice: 2,
    comparaciones: 3,
  });
});

test("encuentra el último elemento con 5 comparaciones", () => {
  assert.deepStrictEqual(busquedaSecuencial(datos, 50, "id"), {
    indice: 4,
    comparaciones: 5,
  });
});

test("devuelve -1 si el elemento no existe (peor caso)", () => {
  assert.deepStrictEqual(busquedaSecuencial(datos, 99, "id"), {
    indice: -1,
    comparaciones: 5,
  });
});

test("devuelve -1 con 0 comparaciones en un arreglo vacío", () => {
  assert.deepStrictEqual(busquedaSecuencial([], 1, "id"), {
    indice: -1,
    comparaciones: 0,
  });
});

test("funciona con valores simples sin indicar campo", () => {
  assert.deepStrictEqual(busquedaSecuencial([4, 8, 15, 16], 15), {
    indice: 2,
    comparaciones: 3,
  });
});