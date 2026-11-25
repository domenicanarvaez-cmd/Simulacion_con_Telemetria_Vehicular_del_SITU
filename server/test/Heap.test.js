// Pruebas del Heap (AA3-U2, issue #12) con el corredor nativo de Node.
// Se ejecutan con:  npm test   (desde la carpeta server/)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Heap } from '../src/heap/Heap.js';

/**
 * Función de ayuda: revisa que el arreglo interno cumpla la
 * PROPIEDAD DEL HEAP (ningún hijo tiene más prioridad que su padre).
 */
function cumplePropiedad(heap, comparador) {
    const arr = heap.aArreglo();
    for (let i = 1; i < arr.length; i++) {
        const padre = Math.floor((i - 1) / 2);
        // Si un hijo tiene más prioridad que su padre, la propiedad se rompe.
        if (comparador(arr[i], arr[padre]) < 0) return false;
    }
    return true;
}

/**
 * Función de ayuda: extrae todos los elementos en orden de salida.
 */
function extraerTodo(heap) {
    const salida = [];
    while (!heap.estaVacio()) salida.push(heap.extraer());
    return salida;
}

// ---------- Casos borde ----------

test('heap vacío: extraer y verRaiz devuelven undefined', () => {
    const heap = new Heap();
    assert.equal(heap.estaVacio(), true);
    assert.equal(heap.tamano(), 0);
    assert.equal(heap.extraer(), undefined);
    assert.equal(heap.verRaiz(), undefined);
});

test('heap con un solo elemento', () => {
    const heap = new Heap();
    heap.insertar(42);
    assert.equal(heap.verRaiz(), 42);     // mirar no lo saca
    assert.equal(heap.tamano(), 1);
    assert.equal(heap.extraer(), 42);
    assert.equal(heap.estaVacio(), true);
});

test('comparador inválido lanza error', () => {
    assert.throws(() => new Heap('no soy una función'), TypeError);
});

// ---------- Funcionamiento normal ----------

test('MinHeap: extrae de menor a mayor', () => {
    const heap = new Heap();                       // MinHeap por defecto
    for (const v of [5, 3, 8, 1, 9, 2]) heap.insertar(v);
    assert.equal(heap.verRaiz(), 1);
    assert.deepEqual(extraerTodo(heap), [1, 2, 3, 5, 8, 9]);
});

test('MaxHeap: extrae de mayor a menor', () => {
    const heap = new Heap((a, b) => b - a);        // comparador invertido
    for (const v of [5, 3, 8, 1, 9, 2]) heap.insertar(v);
    assert.equal(heap.verRaiz(), 9);
    assert.deepEqual(extraerTodo(heap), [9, 8, 5, 3, 2, 1]);
});

test('prioridades repetidas: todas salen y en orden correcto', () => {
    const heap = new Heap();
    for (const v of [4, 1, 4, 1, 4, 1]) heap.insertar(v);
    assert.deepEqual(extraerTodo(heap), [1, 1, 1, 4, 4, 4]);
});

test('insertar después de extraer mantiene la propiedad del heap', () => {
    const comparador = (a, b) => a - b;
    const heap = new Heap(comparador);
    for (const v of [10, 20, 30]) heap.insertar(v);
    assert.equal(heap.extraer(), 10);
    heap.insertar(5);
    heap.insertar(25);
    assert.equal(cumplePropiedad(heap, comparador), true);
    assert.deepEqual(extraerTodo(heap), [5, 20, 25, 30]);
});

// ---------- Datos del proyecto SITU ----------

test('registros de telemetría: sale primero el bus con MÁS retraso', () => {
    // MaxHeap por el campo "retraso" (minutos).
    const heap = new Heap((a, b) => b.retraso - a.retraso);
    heap.insertar({ unidadId: 101, rutaId: 2, retraso: 3 });
    heap.insertar({ unidadId: 102, rutaId: 5, retraso: 12 });
    heap.insertar({ unidadId: 103, rutaId: 2, retraso: 7 });
    assert.equal(heap.extraer().unidadId, 102);   // 12 min
    assert.equal(heap.extraer().unidadId, 103);   // 7 min
    assert.equal(heap.extraer().unidadId, 101);   // 3 min
});

test('aArreglo devuelve una copia: cambiarla no daña el heap', () => {
    const heap = new Heap();
    for (const v of [3, 1, 2]) heap.insertar(v);
    const copia = heap.aArreglo();
    copia[0] = 999;
    assert.equal(heap.verRaiz(), 1);
});

// ---------- Volumen ----------

test('100 000 elementos: la propiedad se cumple y salen ordenados', () => {
    const comparador = (a, b) => a - b;
    const heap = new Heap(comparador);
    // Números pseudoaleatorios con semilla (siempre los mismos).
    let semilla = 12345;
    for (let i = 0; i < 100000; i++) {
        semilla = (Math.imul(1664525, semilla) + 1013904223) >>> 0;
        heap.insertar(semilla % 1000);              // muchos valores repetidos
    }
    assert.equal(heap.tamano(), 100000);
    assert.equal(cumplePropiedad(heap, comparador), true);

    // Cada valor extraído debe ser >= al anterior.
    let anterior = -Infinity;
    while (!heap.estaVacio()) {
        const actual = heap.extraer();
        assert.ok(actual >= anterior);
        anterior = actual;
    }
});
