import assert from "node:assert";
import { busquedaSecuencial } from "./busquedaSecuencial.js";

const datos = [{ id: 10 }, { id: 20 }, { id: 30 }, { id: 40 }, { id: 50 }];

assert.deepStrictEqual(busquedaSecuencial(datos, 10, "id"), { indice: 0, comparaciones: 1 });
assert.deepStrictEqual(busquedaSecuencial(datos, 30, "id"), { indice: 2, comparaciones: 3 });
assert.deepStrictEqual(busquedaSecuencial(datos, 50, "id"), { indice: 4, comparaciones: 5 });
assert.deepStrictEqual(busquedaSecuencial(datos, 99, "id"), { indice: -1, comparaciones: 5 });
assert.deepStrictEqual(busquedaSecuencial([], 1, "id"), { indice: -1, comparaciones: 0 });

console.log("Todas las pruebas pasaron");