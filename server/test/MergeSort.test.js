import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeSort } from '../src/ordenamiento/MergeSort.js';

// Comparadores externos usados en las pruebas.
const ascendente = (a, b) => a - b;
const descendente = (a, b) => b - a;

// --- Ayudantes de verificación (no usan .sort) ---------------------------

/** ¿Cada elemento es menor o igual que el siguiente según el comparador? */
function estaOrdenado(arreglo, comparador) {
  for (let i = 1; i < arreglo.length; i++) {
    if (comparador(arreglo[i - 1], arreglo[i]) > 0) return false;
  }
  return true;
}

/** ¿Ambos arreglos tienen exactamente los mismos elementos (con repeticiones)? */
function mismosElementos(a, b) {
  if (a.length !== b.length) return false;
  const conteo = new Map();
  for (const x of a) conteo.set(x, (conteo.get(x) ?? 0) + 1);
  for (const x of b) {
    if (!conteo.has(x)) return false;
    conteo.set(x, conteo.get(x) - 1);
  }
  return [...conteo.values()].every((n) => n === 0);
}

/** Generador pseudoaleatorio con semilla: las pruebas son reproducibles. */
function aleatorio(semilla) {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// --- Casos de la issue ----------------------------------------------------

test('arreglo vacío devuelve un arreglo vacío', () => {
  assert.deepEqual(mergeSort([], ascendente), []);
});

test('un solo elemento devuelve el mismo elemento', () => {
  assert.deepEqual(mergeSort([7], ascendente), [7]);
});

test('arreglo ya ordenado se mantiene igual', () => {
  assert.deepEqual(mergeSort([1, 2, 3, 4, 5], ascendente), [1, 2, 3, 4, 5]);
});

test('arreglo invertido queda ordenado', () => {
  assert.deepEqual(mergeSort([5, 4, 3, 2, 1], ascendente), [1, 2, 3, 4, 5]);
});

// --- Otros casos límite ---------------------------------------------------

test('funciona con dos elementos desordenados', () => {
  assert.deepEqual(mergeSort([2, 1], ascendente), [1, 2]);
});

test('funciona con longitud par e impar', () => {
  assert.deepEqual(mergeSort([3, 1, 2], ascendente), [1, 2, 3]);
  assert.deepEqual(mergeSort([4, 3, 2, 1], ascendente), [1, 2, 3, 4]);
});

test('ordena arreglos con valores repetidos', () => {
  assert.deepEqual(mergeSort([3, 1, 3, 2, 1, 2], ascendente), [1, 1, 2, 2, 3, 3]);
});

test('arreglo con todos los elementos iguales', () => {
  assert.deepEqual(mergeSort([4, 4, 4, 4], ascendente), [4, 4, 4, 4]);
});

test('ordena negativos y decimales', () => {
  assert.deepEqual(
    mergeSort([0.5, -2, 10, -2.5, 0], ascendente),
    [-2.5, -2, 0, 0.5, 10],
  );
});

// --- Contrato de la función ----------------------------------------------

test('no modifica el arreglo original', () => {
  const original = [3, 1, 2];
  mergeSort(original, ascendente);
  assert.deepEqual(original, [3, 1, 2]);
});

test('devuelve un arreglo nuevo, incluso con 0 o 1 elemento', () => {
  const uno = [1];
  const vacio = [];
  assert.notEqual(mergeSort(uno, ascendente), uno);
  assert.notEqual(mergeSort(vacio, ascendente), vacio);
});

test('usa el comparador recibido', () => {
  let llamadas = 0;
  const espia = (a, b) => {
    llamadas++;
    return a - b;
  };
  mergeSort([2, 1], espia);
  assert.ok(llamadas > 0);
});

// --- El comparador externo cambia el criterio ----------------------------

test('orden descendente cambiando solo el comparador', () => {
  assert.deepEqual(mergeSort([1, 3, 2], descendente), [3, 2, 1]);
});

test('ordena cadenas con un comparador de texto', () => {
  const nombres = ['Maria', 'Ana', 'Luis', 'Carlos'];
  const porTexto = (a, b) => a.localeCompare(b);
  assert.deepEqual(mergeSort(nombres, porTexto), ['Ana', 'Carlos', 'Luis', 'Maria']);
});

test('ordena registros por múltiples criterios (edad y luego nombre)', () => {
  const datos = [
    { nombre: 'Zoe', edad: 20 },
    { nombre: 'Ana', edad: 20 },
    { nombre: 'Mia', edad: 18 },
  ];
  const porEdadYNombre = (x, y) => x.edad - y.edad || x.nombre.localeCompare(y.nombre);
  const nombres = mergeSort(datos, porEdadYNombre).map((d) => d.nombre);
  assert.deepEqual(nombres, ['Mia', 'Ana', 'Zoe']);
});

// --- Estabilidad ----------------------------------------------------------

test('es estable: los empatados conservan su orden original', () => {
  const datos = [
    { id: 'A', edad: 20 },
    { id: 'B', edad: 18 },
    { id: 'C', edad: 20 },
    { id: 'D', edad: 18 },
    { id: 'E', edad: 20 },
    { id: 'F', edad: 19 },
  ];
  const ids = mergeSort(datos, (x, y) => x.edad - y.edad).map((d) => d.id);
  assert.deepEqual(ids, ['B', 'D', 'F', 'A', 'C', 'E']);
});

// --- Arreglos grandes y aleatorios ---------------------------------------

test('arreglos aleatorios: quedan ordenados y con los mismos elementos', () => {
  const azar = aleatorio(42);
  for (let intento = 0; intento < 200; intento++) {
    const n = Math.floor(azar() * 150);
    const arreglo = Array.from({ length: n }, () => Math.floor(azar() * 40));
    const resultado = mergeSort(arreglo, ascendente);
    assert.ok(estaOrdenado(resultado, ascendente));
    assert.ok(mismosElementos(resultado, arreglo));
  }
});

test('muestra grande de 100 000 elementos', () => {
  const azar = aleatorio(7);
  const arreglo = Array.from({ length: 100000 }, () => azar());
  const resultado = mergeSort(arreglo, ascendente);
  assert.equal(resultado.length, arreglo.length);
  assert.ok(estaOrdenado(resultado, ascendente));
});