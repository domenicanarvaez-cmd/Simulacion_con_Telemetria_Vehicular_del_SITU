import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync, openSync, readSync, closeSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { guardarOrdenados } from "../src/busqueda/almacenamientoOrdenado.js";
import { generarRegistrosDesordenados } from "../src/busqueda/generarDesordenados.js";

const N = 200;
let carpeta, ruta, original, copiaOriginal, indice;

before(() => {
    carpeta = mkdtempSync(join(tmpdir(), "almacen-"));
    ruta = join(carpeta, "datos.jsonl");
    original = generarRegistrosDesordenados(N, 42);
    copiaOriginal = structuredClone(original);
    indice = guardarOrdenados(original, ruta);
});
after(() => rmSync(carpeta, { recursive: true, force: true }));

test("el archivo tiene un registro por línea y queda ordenado por unidadId", () => {
    const lineas = readFileSync(ruta, "utf8").split("\n").filter(Boolean);
    assert.equal(lineas.length, N);

    const ids = lineas.map((l) => JSON.parse(l).unidadId);
    for (let i = 1; i < ids.length; i++) {
    assert.ok(ids[i - 1] < ids[i], `fuera de orden en la línea ${i + 1}`);
    }
});

test("el índice tiene una entrada por registro y está ordenado por clave", () => {
    assert.equal(indice.length, N);
    for (let i = 1; i < indice.length; i++) {
    assert.ok(indice[i - 1].clave < indice[i].clave);
    }
});

test("el índice es contiguo: cada offset empieza donde termina la línea anterior", () => {
    assert.equal(indice[0].offset, 0);
    for (let i = 1; i < indice.length; i++) {
    assert.equal(indice[i].offset, indice[i - 1].offset + indice[i - 1].longitud);
    }
});

test("leer con readSync en el offset devuelve el registro con la misma clave", () => {
    const fd = openSync(ruta, "r");
    try {
        for (const { clave, offset, longitud } of indice) {
        const buffer = Buffer.alloc(longitud);
        readSync(fd, buffer, 0, longitud, offset);
        assert.equal(JSON.parse(buffer.toString("utf8")).unidadId, clave);
        }
    } finally {
        closeSync(fd);
    }
});

test("no modifica el arreglo original", () => {
    assert.deepEqual(original, copiaOriginal);
});
