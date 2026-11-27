/**
 * Heap.js  —  AA3-U2, issue #12
 */
export class Heap {
    // Arreglo privado (#) donde vive el árbol. 
    #elementos = [];

    // Función que decide qué elemento tiene más prioridad.
    #comparador;

    /**
     * @param {(a, b) => number} comparador - Negativo si "a" debe salir
     *   antes que "b". Si no se pasa, se usa MinHeap numérico.
     */
    constructor(comparador = (a, b) => a - b) {
        // Se valida que realmente sea una función, para evitar errores raros después.
        if (typeof comparador !== 'function') {
            throw new TypeError('El comparador debe ser una función (a, b) => número');
        }
        this.#comparador = comparador;
    }

    /**
     * Cantidad de elementos guardados en el heap.  O(1)
     * @returns {number}
     */
    tamano() {
        return this.#elementos.length;
    }

    /**
     * Indica si el heap no tiene elementos.  O(1)
     * @returns {boolean}
     */
    estaVacio() {
        return this.#elementos.length === 0;
    }

    /**
     * Devuelve el elemento de mayor prioridad SIN sacarlo (peek).  O(1)
     * @returns {*} La raíz, o undefined si el heap está vacío.
     */
    verRaiz() {
        // La raíz siempre está en la posición 0 del arreglo.
        return this.#elementos[0];
    }

    /**
     * Agrega un elemento y lo acomoda en su lugar.  O(log n)
     * @param {*} valor - Elemento a insertar.
     */
    insertar(valor) {
        // 1) Se coloca al final del arreglo: la siguiente hoja libre del árbol.
        this.#elementos.push(valor);
        // 2) Se hace "subir" hasta que su padre tenga más prioridad que él.
        this.#subir(this.#elementos.length - 1);
    }

    /**
     * Saca y devuelve el elemento de mayor prioridad (la raíz).  O(log n)
     * @returns {*} El elemento extraído, o undefined si el heap está vacío.
     */
    extraer() {
        // Caso borde: no hay nada que extraer.
        if (this.estaVacio()) {
            return undefined;
        }

        // Se guarda la raíz, que es lo que vamos a devolver.
        const raiz = this.#elementos[0];

        // Se quita el ÚLTIMO elemento del arreglo (pop es O(1)).
        const ultimo = this.#elementos.pop();

        // Si quedaban elementos, el último pasa a ocupar la raíz
        // y se hace "bajar" hasta su lugar correcto.
        if (this.#elementos.length > 0) {
            this.#elementos[0] = ultimo;
            this.#bajar(0);
        }

        return raiz;
    }

    /**
     * Devuelve una COPIA del arreglo interno (útil para pruebas y para
     * mostrar el heap en la defensa). Modificar la copia no afecta al heap.
     * @returns {Array}
     */
    aArreglo() {
        // Copia manual con un bucle (sin métodos de ordenamiento).
        const copia = new Array(this.#elementos.length);
        for (let i = 0; i < this.#elementos.length; i++) {
            copia[i] = this.#elementos[i];
        }
        return copia;
    }

    // -----------------------------------------------------------
    // Métodos internos (privados)
    // -----------------------------------------------------------

    /**
     * Heapify-up: mientras el elemento en "i" tenga más prioridad que
     * su padre, se intercambian. Termina en la raíz o cuando ya está bien.
     */
    #subir(i) {
        while (i > 0) {
            // Posición del padre según la fórmula del arreglo.
            const padre = Math.floor((i - 1) / 2);

            // Si el hijo NO tiene más prioridad que el padre, ya está en su lugar.
            if (this.#comparador(this.#elementos[i], this.#elementos[padre]) >= 0) {
                break;
            }

            // Si tiene más prioridad, sube un nivel.
            this.#intercambiar(i, padre);
            i = padre;
        }
    }

    /**
     * Heapify-down: mientras algún hijo tenga más prioridad que el
     * elemento en "i", se intercambia con el hijo de MÁS prioridad.
     */
    #bajar(i) {
        const n = this.#elementos.length;

        while (true) {
            const izquierdo = 2 * i + 1;   // posición del hijo izquierdo
            const derecho = 2 * i + 2;     // posición del hijo derecho
            let mejor = i;                 // suponemos que el padre es el de más prioridad

            // ¿El hijo izquierdo existe y tiene más prioridad que el "mejor"?
            if (izquierdo < n && this.#comparador(this.#elementos[izquierdo], this.#elementos[mejor]) < 0) {
                mejor = izquierdo;
            }
            // ¿El hijo derecho existe y tiene más prioridad que el "mejor"?
            if (derecho < n && this.#comparador(this.#elementos[derecho], this.#elementos[mejor]) < 0) {
                mejor = derecho;
            }

            // Si el padre sigue siendo el mejor, la propiedad del heap se cumple.
            if (mejor === i) {
                break;
            }

            // Si no, baja un nivel cambiándose con el hijo de más prioridad.
            this.#intercambiar(i, mejor);
            i = mejor;
        }
    }

    /**
     * Intercambia dos posiciones del arreglo interno.
     */
    #intercambiar(a, b) {
        const temporal = this.#elementos[a];
        this.#elementos[a] = this.#elementos[b];
        this.#elementos[b] = temporal;
    }
}
