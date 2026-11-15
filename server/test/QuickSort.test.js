import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickSort } from '../src/ordenamiento/QuickSort.js';

const asc = (a, b) => a - b;

test('maneja arreglos vacíos y de un solo elemento', () => {
  assert.deepEqual(quickSort([], asc), []);
  assert.deepEqual(quickSort([42], asc), [42]);
});

test('ordena arreglos con elementos repetidos', () => {
  assert.deepEqual(quickSort([5, 2, 5, 1, 2, 5, 1], asc), [1, 1, 2, 2, 5, 5, 5]);
});

test('mantiene el orden en arreglos ya ordenados e invertidos', () => {
  assert.deepEqual(quickSort([1, 2, 3, 4, 5, 6], asc), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(quickSort([6, 5, 4, 3, 2, 1], asc), [1, 2, 3, 4, 5, 6]);
});

test('ordena registros de telemetría por múltiples criterios', () => {
  const tramas = [
    { unidadId: 10, velocidad: 35.5, ts: 2000 },
    { unidadId: 3, velocidad: 12.0, ts: 1000 },
    { unidadId: 7, velocidad: 35.5, ts: 1500 },
  ];

  // Ordenar por velocidad ascendente y desempatar por ts ascendente
  quickSort(tramas, (a, b) => (a.velocidad - b.velocidad) || (a.ts - b.ts));
  assert.deepEqual(tramas.map((t) => t.unidadId), [3, 7, 10]);
});

test('ordena 100 000 registros con muchos valores repetidos sin desbordar la pila', () => {
  const registros = Array.from({ length: 100_000 }, (_, i) => ({
    unidadId: i + 1,
    rutaId: i % 4, // Solo 4 rutas posibles (alta repetición)
  }));

  quickSort(registros, (a, b) => a.rutaId - b.rutaId);

  for (let i = 1; i < registros.length; i++) {
    assert.ok(registros[i - 1].rutaId <= registros[i].rutaId);
  }
});