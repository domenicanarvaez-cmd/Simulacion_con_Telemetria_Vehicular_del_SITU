import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ColaPrioridad } from '../src/heap/ColaPrioridad.js';
import { BufferCircular } from '../src/BufferCircular.js';

test('CP-HEAP-01 (borde): cola vacía devuelve undefined y extraerTopK devuelve []', () => {
    const cola = new ColaPrioridad();
    assert.equal(cola.estaVacia(), true);
    assert.equal(cola.tamano(), 0);
    assert.equal(cola.siguiente(), undefined);
    assert.equal(cola.desencolar(), undefined);
    assert.deepEqual(cola.extraerTopK(5), []);
});

test('CP-HEAP-02 (normal): prioriza el registro con mayor retraso', () => {
    const cola = new ColaPrioridad();
    cola.encolar({ unidadId: 10, retraso: 4, ts: 1000 });
    cola.encolar({ unidadId: 25, retraso: 18, ts: 1005 });
    cola.encolar({ unidadId: 7, retraso: 9, ts: 1002 });

    assert.equal(cola.siguiente().unidadId, 25);
    assert.equal(cola.desencolar().unidadId, 25);
    assert.equal(cola.desencolar().unidadId, 7);
    assert.equal(cola.desencolar().unidadId, 10);
});

test('CP-HEAP-03 (borde): desempata por mayor nivelAlerta y luego por trama más antigua (ts)', () => {
    const cola = new ColaPrioridad();
    cola.encolar({ unidadId: 1, retraso: 10, nivelAlerta: 1, ts: 2000 });
    cola.encolar({ unidadId: 2, retraso: 10, nivelAlerta: 3, ts: 3000 });
    cola.encolar({ unidadId: 3, retraso: 10, nivelAlerta: 3, ts: 1500 });

    assert.deepEqual(
        cola.extraerTopK(3).map((r) => r.unidadId),
        [3, 2, 1]
    );
});

test('CP-HEAP-04 (normal): ingesta tramas desde BufferCircular clonando los objetos reutilizados', () => {
    const buffer = new BufferCircular(5);
    buffer.escribir({ unidadId: 101, lat: -3.99, lng: -79.2, velocidad: 30, ts: 100 }); // retraso 1
    buffer.escribir({ unidadId: 102, lat: -3.99, lng: -79.2, velocidad: 0, ts: 101 });  // detenida -> retraso 10
    buffer.escribir({ unidadId: 103, lat: -3.99, lng: -79.2, velocidad: 65, ts: 102 }); // exceso -> retraso 5

    const cola = new ColaPrioridad();
    const total = cola.ingestarDesdeBuffer(buffer);

    assert.equal(total, 3);
    assert.equal(buffer.estaVacio(), true);
    assert.deepEqual(
        cola.extraerTopK(3).map((r) => r.unidadId),
        [102, 103, 101]
    );
});

test('CP-HEAP-05 (error): rechaza entradas nulas o k negativo', () => {
    const cola = new ColaPrioridad();
    assert.throws(() => cola.encolar(null), TypeError);
    assert.throws(() => cola.extraerTopK(-1), RangeError);
});