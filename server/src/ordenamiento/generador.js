// Generador de números pseudoaleatorios reproducibles.
export function crearGenerador(semilla) {
    let estado = semilla >>> 0;

    return function () {
        estado = (Math.imul(1664525, estado) + 1013904223) >>> 0;
        return estado / 4294967296;
    };
}

// Genera registros de telemetría.
export function generarRegistros(cantidad, semilla) {
    const aleatorio = crearGenerador(semilla);

    return Array.from({ length: cantidad }, (_, i) => ({
        unidadId: i + 1,
        velocidad: Number((aleatorio() * 120).toFixed(2)),
        ts: Math.floor(aleatorio() * 1000000)
    }));
}
