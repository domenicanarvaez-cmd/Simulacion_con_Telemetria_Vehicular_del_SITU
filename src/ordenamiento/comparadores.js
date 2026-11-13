// UN CRITERIO

export const porVelocidad = (a, b) => { a.velocidad - b.velocidad };

//MULTICRITERIO: POR RUTA Y SI EMPATAN POR timestamp

export const porRutaYTs = (a, b) => (a.rutaId - b.rutaId) || (a.ts - b.ts);