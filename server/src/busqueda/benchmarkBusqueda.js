import { busquedaSecuencial } from './busquedaSecuencial.js';

const tamanos = [1000, 10000, 100000];
const repeticiones = 100;
const filas = [];

for (const n of tamanos) {
  const arreglo = Array.from({ length: n }, (_, i) => ({ id: i }));
  const casos = [
    { caso: 'Mejor (primer elemento)', clave: 0 },
    { caso: 'Promedio (elemento central)', clave: Math.floor(n / 2) },
    { caso: 'Peor (no existe)', clave: -1 },
  ];

  for (const { caso, clave } of casos) {
    let comparaciones = 0;
    const inicio = performance.now();
    for (let r = 0; r < repeticiones; r++) {
      comparaciones = busquedaSecuencial(arreglo, clave, 'id').comparaciones;
    }
    const tiempo = (performance.now() - inicio) / repeticiones;
    filas.push({ n, caso, comparaciones, 'tiempo promedio (ms)': Number(tiempo.toFixed(4)) });
  }
}

console.table(filas);