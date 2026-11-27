/**
 * Cola de prioridad sobre Heap binario para despachar alertas y unidades
 * críticas del SITU (mayor retraso o severidad primero).
 */
import { Heap } from './Heap.js';

/**
 * Comparador por defecto para registros de telemetría del SITU:
 * 1) Mayor retraso (minutos) primero.
 * 2) En caso de empate, mayor nivel de alerta / severidad primero.
 * 3) En caso de empate, la trama más antigua (menor ts) primero.
 */
export function comparadorUrgenciaSITU(a, b) {
    const retrasoA = a.retraso ?? 0;
    const retrasoB = b.retraso ?? 0;
    if (retrasoB !== retrasoA) return retrasoB - retrasoA;

    const alertaA = a.nivelAlerta ?? 0;
    const alertaB = b.nivelAlerta ?? 0;
    if (alertaB !== alertaA) return alertaB - alertaA;

    return (a.ts ?? 0) - (b.ts ?? 0);
}

export class ColaPrioridad {
    #heap;

    /**
     * @param {(a: object, b: object) => number} [comparador=comparadorUrgenciaSITU]
     */
    constructor(comparador = comparadorUrgenciaSITU) {
        this.#heap = new Heap(comparador);
    }

    /** Inserta un registro en la cola de prioridad. O(log n) */
    encolar(registro) {
        if (!registro || typeof registro !== 'object') {
            throw new TypeError('El registro debe ser un objeto válido');
        }
        this.#heap.insertar(registro);
    }

    /** Extrae y devuelve el registro más urgente. O(log n) */
    desencolar() {
        return this.#heap.extraer();
    }

    /** Consulta el registro más urgente sin extraerlo. O(1) */
    siguiente() {
        return this.#heap.verRaiz();
    }

    tamano() {
        return this.#heap.tamano();
    }

    estaVacia() {
        return this.#heap.estaVacio();
    }

    /**
     * Extrae los k registros más urgentes en orden de prioridad. O(k log n)
     * @param {number} k
     * @returns {object[]}
     */
    extraerTopK(k) {
        if (!Number.isInteger(k) || k < 0) {
            throw new RangeError('k debe ser un entero mayor o igual a 0');
        }
        const limite = Math.min(k, this.tamano());
        const urgentes = new Array(limite);
        for (let i = 0; i < limite; i++) {
            urgentes[i] = this.desencolar();
        }
        return urgentes;
    }

    /**
     * Conecta la cola de prioridad con el flujo del proyecto:
     * drena tramas del BufferCircular y las encola evaluando alertas
     * (por ejemplo, velocidad excesiva > 50 km/h o unidad detenida = 0 km/h).
     *
     * @param {import('../BufferCircular.js').BufferCircular} buffer
     * @param {(trama: object) => number} [calcularRetraso]
     * @returns {number} Cantidad de tramas encoladas.
     */
    ingestarDesdeBuffer(buffer, calcularRetraso = (t) => (t.velocidad === 0 ? 10 : t.velocidad > 50 ? 5 : 1)) {
        let procesadas = 0;
        for (let t = buffer.leer(); t !== null; t = buffer.leer()) {
            // BufferCircular.leer() reutiliza el objeto de salida, por eso se clona
            const registro = {
                unidadId: t.unidadId,
                lat: t.lat,
                lng: t.lng,
                velocidad: t.velocidad,
                ts: t.ts,
                retraso: calcularRetraso(t),
            };
            this.encolar(registro);
            procesadas++;
        }
        return procesadas;
    }
}