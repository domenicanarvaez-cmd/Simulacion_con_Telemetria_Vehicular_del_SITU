# Arquitectura y métricas consolidadas (AA3-U2)

## 1. Arquitectura del sistema

El simulador de telemetría vehicular del SITU procesa tramas de las unidades de transporte de Loja mediante seis módulos conectados en secuencia (Figura 1, `arquitectura_sistema.png`):

1. **Ingesta** (`simulator/index.js` y `server/src/ingesta.js`): el simulador genera las tramas de telemetría y `ingesta.js` las recibe. `validacion.js` verifica que sean correctas antes de procesarlas.
2. **BufferCircular** (`server/src/BufferCircular.js`): almacena las tramas más recientes en una estructura de capacidad fija. Insertar y consultar cuesta O(1), y cuando se llena sobrescribe el dato más antiguo, por lo que la memoria se mantiene acotada.
3. **Ordenación (AA1)** (`MergeSort.js`, `QuickSort.js`, `benchmark.js` y `comparadores.js`): ordena las tramas con comparadores configurables y permite comparar el rendimiento de ambos algoritmos.
4. **Búsqueda (AA2)** (`busquedaSecuencial.js`): localiza tramas o unidades específicas recorriendo los datos en O(n), sin exigir orden previo.
5. **Heap (AA3)** (`server/src/heap/Heap.js` y `ColaPrioridad.js`): `Heap.js` es un montículo binario con comparador configurable (mínimo o máximo) y `ColaPrioridad.js` lo usa para priorizar los registros más urgentes del SITU. Insertar y extraer cuestan O(log n) y ver la raíz O(1).
6. **Dashboard** (`Metricas.js` y la interfaz web): presenta las métricas y los resultados al usuario.

El BufferCircular acota la memoria, y las etapas siguientes trabajan sobre ese conjunto limitado. El heap permite obtener los elementos más urgentes sin reordenar todo el conjunto cada vez que llega un dato nuevo.

Como apoyo, el sistema incluye `SeguimientoFlota.js`, el gestor de escenarios con su pila (`GestorEscenarios.js` y `Pila.js`), los módulos de rutas (`Grafo.js`, `EvaluadorRutas.js`, `AcumuladorTramos.js`, `Lineas.js`, `emisiones.js`, `MonticuloMin.js`) y utilidades compartidas (`ListaDoble.js`, `geo.js`, `redLoja.js`).

*Figura 1. Arquitectura del simulador de telemetría vehicular del SITU.*

## 2. Métricas consolidadas

### 2.1 AA1: Ordenación

Resultados de `benchmark.js` (tiempo y variación de memoria heap promedio).

| Algoritmo | Registros (n) | Tiempo promedio (ms) | Delta heap promedio (MB) | Complejidad teórica |
|---|---|---|---|---|
| MergeSort | 1 000 | 0.657 | 0.188 | O(n log n) |
| QuickSort | 1 000 | 0.592 | 0.071 | O(n log n) promedio, O(n²) peor caso |
| MergeSort | 10 000 | 4.068 | 1.439 | O(n log n) |
| QuickSort | 10 000 | 1.258 | 0.0004 | O(n log n) promedio, O(n²) peor caso |
| MergeSort | 100 000 | 44.476 | −4.147 | O(n log n) |
| QuickSort | 100 000 | 15.827 | 0.0004 | O(n log n) promedio, O(n²) peor caso |

**Interpretación:**

- **Tiempo:** con 1 000 registros ambos algoritmos son casi iguales (0.657 ms frente a 0.592 ms). Al crecer n, QuickSort es más rápido: con 10 000 registros MergeSort tarda unas 3.2 veces más, y con 100 000 unas 2.8 veces más.
- **Crecimiento:** al multiplicar n por 10 entre 10 000 y 100 000, el tiempo de MergeSort se multiplicó por 10.9 y el de QuickSort por 12.6. Ambos crecen de forma cercana a n log n, como predice la teoría.
- **Memoria:** MergeSort consume más memoria porque crea arreglos auxiliares al mezclar, mientras que el delta de QuickSort es casi nulo, lo que es coherente con una partición sobre el mismo arreglo. El valor negativo de MergeSort con 100 000 registros (−4.147 MB) no significa que ahorre memoria: se debe a que el recolector de basura liberó memoria durante la medición.
- **Conclusión:** para el volumen de telemetría de este proyecto, QuickSort es la mejor opción en tiempo y memoria. MergeSort tiene la ventaja de garantizar O(n log n) en el peor caso y de ser estable, y QuickSort puede degradarse a O(n²) con datos mal distribuidos.

*Los tiempos corresponden a una sola máquina y pueden variar entre ejecuciones.*

### 2.2 AA2: Búsqueda secuencial

Resultados de `benchmarkBusqueda.js` (100 repeticiones por caso, arreglo de objetos buscados por `id`).

| Registros (n) | Caso | Comparaciones | Tiempo promedio (ms) | Complejidad teórica |
|---|---|---|---|---|
| 1 000 | Mejor (primer elemento) | 1 | 0.0005 | O(1) |
| 1 000 | Promedio (elemento central) | 501 | 0.0059 | O(n) |
| 1 000 | Peor (no existe) | 1 000 | 0.0042 | O(n) |
| 10 000 | Mejor (primer elemento) | 1 | 0.0001 | O(1) |
| 10 000 | Promedio (elemento central) | 5 001 | 0.0103 | O(n) |
| 10 000 | Peor (no existe) | 10 000 | 0.0154 | O(n) |
| 100 000 | Mejor (primer elemento) | 1 | ≈ 0 | O(1) |
| 100 000 | Promedio (elemento central) | 50 001 | 0.0671 | O(n) |
| 100 000 | Peor (no existe) | 100 000 | 0.1350 | O(n) |

**Interpretación:**

- **Comparaciones:** coinciden exactamente con la teoría. En el mejor caso se hace una sola comparación, en el caso central unas n/2 y en el peor caso n, porque se recorre todo el arreglo sin encontrar la clave. Esto confirma que la búsqueda secuencial es O(n).
- **Tiempo:** crece con n, pero no de forma perfectamente proporcional. En el peor caso pasó de 0.0154 ms (n = 10 000) a 0.1350 ms (n = 100 000), unas 8.8 veces más para un tamaño 10 veces mayor. Los tiempos son tan pequeños (milésimas de milisegundo) que el ruido de la medición y la optimización del motor de JavaScript los afectan. Por eso, con n = 1 000, el caso promedio (0.0059 ms) salió más lento que el peor caso (0.0042 ms).
- **Mejor caso:** el tiempo es prácticamente cero porque solo se compara el primer elemento, sin importar el tamaño del arreglo.
- **Conclusión:** para este proyecto la búsqueda secuencial es suficiente, pues incluso con 100 000 registros el peor caso tarda alrededor de 0.14 ms. Su ventaja es que no exige datos ordenados, lo que encaja con tramas que llegan continuamente al BufferCircular. Si el volumen creciera mucho, convendría ordenar los datos y usar búsqueda binaria, que es O(log n).

*Los tiempos corresponden a una sola máquina y pueden variar entre ejecuciones.*

### 2.3 AA3: Heap (ColaPrioridad) frente a MergeSort completo

Resultados de `benchmarkHeap.js`: obtener los k = 10 elementos más urgentes con el heap, frente a ordenar todo el arreglo con MergeSort.

| Registros (n) | k | Método | Tiempo promedio (ms) | Delta heap promedio (MB) |
|---|---|---|---|---|
| 1 000 | 10 | ColaPrioridad (Heap) | 0.737 | 0.145 |
| 1 000 | 10 | MergeSort completo | 0.785 | 0.701 |
| 50 000 | 10 | ColaPrioridad (Heap) | 6.532 | 1.296 |
| 50 000 | 10 | MergeSort completo | 30.780 | 5.598 |
| 500 000 | 10 | ColaPrioridad (Heap) | 50.346 | 13.309 |
| 500 000 | 10 | MergeSort completo | 448.335 | 73.257 |

**Interpretación:**

- **Tiempo:** con 1 000 registros ambos métodos son casi iguales (0.737 ms frente a 0.785 ms). A medida que n crece, el heap gana cada vez más: con 50 000 registros MergeSort tarda unas 4.7 veces más, y con 500 000 unas 8.9 veces más (448.3 ms frente a 50.3 ms).
- **Crecimiento:** entre 50 000 y 500 000 registros (n × 10), el tiempo del heap se multiplicó por 7.7 y el de MergeSort por 14.6. Ambos métodos tienen un costo teórico de O(n log n) cuando los datos se insertan de uno en uno, pero el heap evita ordenar todo el arreglo: solo extrae los k = 10 elementos más urgentes, con un costo de O(log n) por extracción.
- **Memoria:** el heap usa menos memoria en todos los tamaños. Con 500 000 registros, MergeSort necesita unas 5.5 veces más (73.257 MB frente a 13.309 MB), porque crea arreglos auxiliares al mezclar.
- **Conclusión:** para priorizar registros urgentes (por ejemplo, los buses con mayor retraso o las alertas más críticas) no hace falta ordenar todos los datos. Si los datos llegan uno a uno, como la telemetría en tiempo real, cada llegada cuesta O(log n) y consultar el más urgente es O(1), sin reordenar todo. Ordenar todo solo conviene cuando se necesita la lista completa ordenada.

*Los tiempos corresponden a una sola máquina y pueden variar entre ejecuciones.*

### 2.4 Lectura conjunta

| Etapa | Costo dominante | Cuándo conviene |
|---|---|---|
| BufferCircular | O(1) por trama | Siempre, para acotar la memoria |
| Ordenación (AA1) | O(n log n); QuickSort fue unas 2.8 veces más rápido con 100 000 registros | Cuando se necesita la lista completa ordenada |
| Búsqueda (AA2) | O(n); 100 000 comparaciones en el peor caso (0.135 ms) | Datos sin orden y volumen moderado |
| Heap (AA3) | O(log n) por inserción y por extracción; O(1) para ver la raíz | Cuando los datos llegan de uno en uno y solo se necesitan los k elementos más urgentes |

## 3. Referencias

Ver `docs/referencias_IEEE.md`.