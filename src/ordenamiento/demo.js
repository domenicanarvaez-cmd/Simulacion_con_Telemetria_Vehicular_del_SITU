import { construirRedLoja, lineaDeUnidad} from '../../shared/redLoja.js';
import { porRutaYTs } from './comparadores.js';
//mergeSort  // ACTIVAR CUANDO ESTE LISTO
//quickSort // ACTIVAR CUANDO ESTE LISTO


const mergeSort = (arr, cmp) => [...arr].sort(cmp); //CAMBIAR
const quickSort = (arr, cmp) => [...arr].sort(cmp); //CAMBIAR

const nLineas = construirRedLoja().lineas.length;
const base = Date.now();
const datos = Array.from({ length: 200 }, (_, i) => ({ 
    unidadId: i + 1,
    rutaId: lineaDeUnidad(i + 1, nLineas),
    lat: -3.99 + Math.random() * 0.03,
    lng: -79.2 + Math.random() * 0.03,
    velocidad: Number((Math.random() * 50).toFixed(2)),
    ts: base + Math.floor(Math.random() * 60000),
}));

const usaQuick = process.argv[2] === 'quick';
const algoritmo = usaQuick ? quickSort : mergeSort;
const nombre = usaQuick ? 'quickSort' : 'mergeSort';

console.log(`ANTES DE ORDENAR (${nombre})`);
console.table(datos.slice(0, 10));

const ordenados = algoritmo([...datos], porRutaYTs);
console.log(`DESPUES DE ORDENAR (${nombre})`);
console.table(ordenados.slice(0, 10));