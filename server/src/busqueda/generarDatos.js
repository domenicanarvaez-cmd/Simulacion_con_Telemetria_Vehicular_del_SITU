/**
 * Genera datos.jsonl con registros de telemetría ordenados por unidadId.
 *
 * node src/busqueda/generarDatos.js [cantidad] [ruta] [semilla]
 */
import { generarRegistrosDesordenados } from './generarDesordenados.js';
import { guardarOrdenados } from './almacenamientoOrdenado.js';

const cantidad = Number(process.argv[2]) || 1000;
const ruta = process.argv[3] || 'datos.jsonl';
const semilla = Number(process.argv[4]) || 42;

const registros = generarRegistrosDesordenados(cantidad, semilla);
const indice = guardarOrdenados(registros, ruta);

console.log(`Archivo generado: ${ruta}`);
console.log(`Registros: ${indice.length} | semilla: ${semilla}`);
console.log('Primeras entradas del índice:', indice.slice(0, 3));