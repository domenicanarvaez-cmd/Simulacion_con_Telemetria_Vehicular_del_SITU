# Declaración de uso de IA

**Proyecto:** Simulación con Telemetría Vehicular del SITU
**Componente:** Algoritmo de ordenamiento Merge Sort (`server/src/ordenamiento/MergeSort.js`)
**Herramienta utilizada:** Claude (Anthropic)

## Alcance del uso

La implementación de `mergeSort` fue escrita por mí. Usé la IA como apoyo para tres tareas: revisar mi función, generar el archivo de pruebas y redactar la explicación de complejidad. También la usé para diagnosticar un error de importación en las pruebas. Revisé y probé todo lo generado antes de incluirlo en el proyecto.

## Prompts utilizados

### 1. Revisión de la función

**Prompt:**

> esta es mi funcion revisala:
>
> *(se adjuntó el código de `mergeSort` y su función auxiliar `mezclar`)*

**Uso del resultado:** revisión de mi implementación. El código del algoritmo es de mi autoría.

### 2. Generación de pruebas

**Prompt:**

> crea el archivo test para probar mi funcion

**Uso del resultado:** se generó `server/test/MergeSort.test.js` con pruebas para casos límite, el contrato de la función (no modifica el original, devuelve un arreglo nuevo), el comparador externo, la estabilidad y arreglos aleatorios y grandes.

### 3. Explicación de complejidad

**Prompt:**

> Redactar el párrafo de Big-O: O(n log n) tiempo, O(n) memoria en un archivo.md

**Uso del resultado:** párrafo de análisis de complejidad (tiempo O(n log n), memoria O(n)) en un archivo `.md`.

### 4. Corrección de un error en las pruebas

**Prompt:**

> *(se adjuntó el proyecto en `.zip` y el error `ERR_MODULE_NOT_FOUND` de `node --test server/test/MergeSort.test.js`)* arregla el error

**Uso del resultado:** la IA identificó que los archivos `mergeSort.js` y `MergeSort.test.js` estaban intercambiados y que la diferencia de mayúsculas en el nombre del archivo rompía la importación en Linux. Con su ayuda recuperé la implementación desde git y reubiqué la suite de pruebas.

## Responsabilidad

Soy responsable del contenido final entregado. Entiendo el funcionamiento del algoritmo y verifiqué que las pruebas pasan.
---

## Apoyo de IA en el desarrollo del Benchmark

**Componente:** Benchmark de algoritmos de ordenamiento (`server/src/ordenamiento/benchmark.js`).

**Herramienta utilizada:** ChatGPT (OpenAI).

### Alcance del uso

Utilicé ChatGPT como apoyo para organizar el desarrollo de mi actividad, resolver dudas sobre Git y GitHub y comprender cómo realizar la comparación entre MergeSort y QuickSort. También me ayudó a estructurar el benchmark y entender las mediciones de tiempo y memoria. Después ejecuté el programa, revisé el archivo CSV y comprobé los resultados obtenidos.

### Responsabilidad

Soy responsable del trabajo realizado en mi actividad. Revisé el funcionamiento del benchmark, ejecuté las mediciones y comprobé que las pruebas del proyecto finalizaran correctamente. También revisé los resultados para comprender las diferencias entre ambos algoritmos.

---

## AA1-U2 #4 – Comparadores multicriterio y demo

**Herramienta:** Claude (Anthropic)

| Prompt | Para qué lo usé |Cómo validé el código|
|---|---|---|
|Cómo desarrollar comparadores por un criterio y multicriterio utilizando datos de telemetría vehicular, como ruta, velocidad y timestamp|Adapté los comparadores a los campos reales del dataset, realicé pruebas de ordenamiento y mostré los primeros 10 registros antes y después de ordenar|Ejecuté `demo.js` con el MergeSort y el QuickSort reales del equipo y revisé en consola que, después de ordenar, las filas quedan agrupadas por `rutaId` y con `ts` ascendente dentro de cada ruta. En la revisión se detectó que `porVelocidad` devolvía `undefined` por tener llaves sin `return`. Lo corregí y lo probé con un arreglo desordenado (30, 10, 20), que ahora sale ordenado como 10, 20, 30.|
**Proyecto:** Simulación con Telemetría Vehicular del SITU  
**Componente:** Algoritmo de ordenamiento QuickSort (`server/src/ordenamiento/QuickSort.js`)  
**Herramienta utilizada:** Gemini (Google)

## Alcance del uso

Usé la IA como apoyo para comprender el flujo de trabajo colaborativo en GitHub (Issues, ramas y Pull Requests), estructurar la implementación de `quickSort` con selección de pivote por mediana de tres, generar la suite de pruebas unitarias, redactar el análisis de complejidad Big-O y diagnosticar un error al intentar ejecutar las pruebas con Jest en lugar del corredor nativo de Node.js. Revisé, adapté y probé todo el código antes de incluirlo en el repositorio.

### 1. Comprensión del flujo de GitHub y estructura del módulo
**Prompt: 

> Tu tarea es explicarme que como funciona la asignación de tareas, ISSUES, PULL REQUEST en GitHub. (Se adjuntó la captura de pantalla de la actividad asignada a mi persona)

**Uso del resultado:** Orientación sobre la creación de una rama independiente para el Issue `#3`, ubicación del módulo dentro de `server/src/ordenamiento/` y definición del esqueleto inicial con comentarios JSDoc.

### 2. Implementación de QuickSort con mediana de tres
**Prompt:**
> Explicame la lógica general para crear un `QuickSort.js` sin usar `.sort()`, con función comparadora, partición (Lomuto o Hoare) y selección de pivote por mediana de tres. 

**Uso del resultado:** Se implementó `server/src/ordenamiento/QuickSort.js` con partición de Lomuto y selección de pivote mediante mediana de tres para evitar la degradación cuadrática en arreglos ordenados o invertidos, usando como base las ideas dadas por la IA

### 3. Generación de pruebas unitarias y análisis de complejidad Big-O
**Prompt:**
> Dime los elementos necesarios que debe tener las pruebas unitarias para casos borde (vacío, repetidos, ya ordenado, múltiples criterios) y la redacción del análisis de complejidad Big-O en un archivo `.md`.

**Uso del resultado:** Se crearon `server/test/QuickSort.test.js` utilizando el módulo nativo `node:test` y `server/src/ordenamiento/QuickSort-BigO.md` detallando la complejidad temporal promedio $\Theta(n \log n)$, peor caso $O(n^2)$ y complejidad espacial $O(\log n)$.

## Responsabilidad

Soy responsable del contenido final entregado. Entiendo el funcionamiento del algoritmo QuickSort, su partición, la estrategia de mediana de tres y verifiqué que todas las pruebas unitarias pasan correctamente.

---

## Uso de ChatGPT en la actividad de Benchmark

**Herramienta utilizada:** ChatGPT (OpenAI)

**Componente:** Benchmark de tiempos y memoria
(`server/src/ordenamiento/benchmark.js`).

### Prompts utilizados

#### 1. Orientación inicial sobre la actividad

**Prompt:**

> hoy tengo que hacer una nueva actividad de mi grupo de trabajo y me asignaron esta al git hub, no se donde estaria el archivo y atambien no seria mejor si lo trabajo directamente en git hub? o no es recomendable?

**Material de contexto:** Se adjuntó una captura del Issue #5 de GitHub con las instrucciones de la actividad.

**Uso del resultado:** Se utilizó ChatGPT para comprender las instrucciones, identificar dónde trabajar dentro del repositorio y decidir cómo organizar el trabajo mediante Git y GitHub.

#### 2. Revisión de ramas y avances del equipo

**Prompt:**

> en branch solo me sale main deful, listo creo que ya hicieron su parte pero no estoy seguro como puedo revisar

**Uso del resultado:** Se utilizó ChatGPT para consultar cómo revisar las ramas del repositorio, comprobar el estado de los Pull Requests y verificar los avances de los compañeros.

#### 3. Fusión de ramas en GitHub (prompt reconstruido)

**Prompt:**

> ¿Cómo puedo fusionar mi rama de trabajo `feat/benchmark-ordenamiento` con la rama `feature/modulo-ordenamiento` en GitHub, evitando conflictos y asegurándome de integrar correctamente los cambios?

**Uso del resultado:** Se utilizó ChatGPT para recibir orientación sobre el proceso de integración de ramas y la resolución de posibles conflictos en GitHub.

**Nota:** El tercer prompt fue reconstruido a partir de la actividad realizada; no corresponde a una transcripción literal del mensaje original.

---

## AA1-U2 #6 – Integración y revisión (Domenica Narvaez)

**Herramienta:** Claude (Anthropic)

| Prompt | Para qué lo usé | Cómo validé |
|---|---|---|
| "Ayúdame a repartir esta tarea en GitHub Projects para 5 integrantes" | Organizar los issues, ramas, fechas y el tablero AA_U2 | Creé los issues #2 a #6 y asigné un responsable a cada uno |
| "Revisa el repositorio y dime qué falta" | Revisar el código integrado del equipo | Se detectaron 3 problemas (QuickSort sin unir, `porVelocidad` sin `return`, desbordamiento de pila con datos repetidos); pedí las correcciones y verifiqué cada una |
| "Dime cómo unir las ramas y resolver los conflictos" | Integrar las ramas en `feature/modulo-ordenamiento` | Resolví los conflictos de `QuickSort.js` y `declaracion_IA.md` y comprobé que no quedaran marcas de conflicto |

**Validación final:** en la rama de integración ejecuté `npm test` (59 pruebas aprobadas, 0 fallidas), la demo con MergeSort y QuickSort, y el benchmark con `--expose-gc`. Verifiqué que el módulo no usa `.sort()`.

---

## AA2-U2 – Búsqueda secuencial (Jahir Campoverde)

**Herramienta:** Claude (Anthropic)

| Prompt | Para qué lo usé | Cómo validé |
|---|---|---|
| Compartí el issue y consulté cómo realizar la búsqueda secuencial | Entender cómo implementar la función y realizar las pruebas solicitadas | Ejecuté node pruebas.js y comprobé los cuatro casos |
| Consulté cómo relacionar la búsqueda secuencial con la sostenibilidad | Tener una idea de cómo explicar el consumo de recursos y buscar referencias | Verifiqué los autores y el DOI de las referencias en IEEE Xplore y leí los resúmenes |
| Pregunté cómo subir mis cambios a GitHub | Recordar los pasos para trabajar con ramas, commits y Pull Requests | Ejecuté los comandos en mi terminal y revisé el PR en GitHub |

**Responsabilidad:** Revisé, adapté y comprobé el trabajo realizado. Soy responsable del código y del contenido que entrego.

---

## AA2-U2 – Almacén ordenado e índice (guardar registros y construir el índice)

**Responsable:** @Danilrox
**Herramienta:** Claude (Anthropic)
**Componente:** `server/src/busqueda/` (`generarDesordenados.js`, `AlmacenOrdenado.js`), `server/src/ordenamiento/generador.js` y `server/test/AlmacenOrdenado.test.js`.
**Tareas del issue cubiertas:** guardar los registros ordenados en `datos.jsonl` y construir el índice clave → posición (offset). La búsqueda secuencial, la binaria y el retorno de `{ registro, comparaciones }` corresponden a otros integrantes.

### Alcance del uso

Usé la IA para entender el enunciado y el proyecto, planificar la tarea y escribir el código de mi parte: el generador de registros con `unidadId` desordenados (mezcla Fisher-Yates con semilla), la función `guardarOrdenados` (ordena con el `mergeSort` del equipo, escribe el JSONL y devuelve el índice) y sus pruebas. El `mergeSort` y el generador original (`crearGenerador`, `generarRegistros`) ya eran del equipo; solo moví el generador a `generador.js` para poder reutilizarlo sin ejecutar el benchmark.

### Prompts utilizados

| Prompt | Para qué lo usé | Cómo validé |
|---|---|---|
| "la tarea me pide guardar los registros ordenados, pero no se a que registros se refiere" *(se adjuntó la captura del issue y el `.zip` del proyecto)* | Entender qué son los registros: las tramas de telemetría `{ unidadId, lat, lng, velocidad, ts }` | Lo contrasté con `docs/contrato.md` y con `benchmark.js` |
| "no ecuentro el archivo demo.js" | Ubicar el archivo (`src/ordenamiento/`, en la raíz, no en `server/`) | Lo abrí en el repositorio |
| "en que se basa merge para ordenarlos>" y "si esta usando el metodo MergeSort que creamos??" | Entender cómo ordena Merge Sort (dividir, conquistar y combinar, más el comparador) y confirmar que el proyecto usa nuestro `mergeSort` y no `.sort()` | Revisé `MergeSort.js` y los `import` de `benchmark.js` y `demo.js` |
| "ahora dame el plan que debo hacer para realizar mi tarea asignada" | Obtener el plan paso a paso de la tarea | Lo comparé con las casillas del issue |
| "que es la clave del indice" | Entender qué es la clave del índice y por qué se eligió `unidadId` (única y es el mismo criterio de orden) | Lo comprobé con el índice generado, que queda ordenado por `unidadId` |
| "ya exporte esas 2 funciones, que hago" | Resolver cómo reutilizar `crearGenerador` y `generarRegistros`. La IA advirtió que importar `benchmark.js` ejecuta el benchmark completo y sobrescribe `resultados.csv` | Moví las funciones a `generador.js` e importé desde ahí |
| "que es fs" | Entender el módulo `fs` de Node (`writeFileSync`, `openSync`, `readSync`, `closeSync`) | Lo apliqué en `guardarOrdenados` y en las pruebas |
| "realiza eso" *(sobre el paso 1 del plan: generar registros con ids desordenados)* | Generar `generarDesordenados.js`. `generarRegistros` crea ids ya ordenados, por eso se mezclan con Fisher-Yates y una semilla distinta | Se probó que los ids son únicos, que el resultado es reproducible con la misma semilla y que `mergeSort` los deja ordenados |
| "tengo esto:" *(se pegó el código de `generarDesordenados.js`)* | Confirmar el archivo y continuar con los pasos de guardar y construir el índice. La IA generó `AlmacenOrdenado.js` | Se probó con 1 000 registros: cada `offset` del índice, leído con `readSync`, devuelve el registro con la misma clave |
| "la busqueda binaria y secuencial deben hacerla mis otros 2 companeros" | Acotar mi parte a las dos primeras tareas del issue. La IA generó `AlmacenOrdenado.test.js` y el contrato de entrega (formato de `datos.jsonl` e índice) para mis compañeros | Las 5 pruebas pasan: archivo ordenado, índice contiguo y ordenado, offsets correctos con `readSync` y arreglo original sin modificar |
| "hasta ahora que nomas tengo echo de las tareas" *(se adjuntó la captura del issue)* | Revisar el avance contra las casillas del issue | Lo comparé con el estado del issue |
| "dame los promts que utilizados y ponlos en la declaracion de IA" | Redactar esta sección | La revisé contra el historial de la conversación |

**Validación final:** ejecuté `npm test` en `server/` y comprobé que las pruebas de `AlmacenOrdenado.test.js` pasan junto con las del resto del proyecto. Verifiqué que `datos.jsonl` no se sube al repositorio (`.gitignore`) y que `benchmark.js` ya no define el generador, sino que lo importa de `generador.js`.

### Responsabilidad

Soy responsable de mi parte entregada. Entiendo cómo se ordenan los registros, cómo se calcula el offset en bytes (`Buffer.byteLength`, no la cantidad de caracteres) y cómo el índice permite leer un solo registro con `readSync`.


---

## AA2-U2 #10 – Generador de datos y benchmark de estrés (Domenica Narvaez)

**Herramienta:** Claude (Anthropic)

| Prompt | Para qué lo usé | Cómo validé |
|---|---|---|
| "Revisa el repo y dime qué ya hay hecho del AA2" | Conocer el avance del equipo y definir los nombres de las funciones que usa el benchmark (contrato) | Comparé lo que me dijo con las ramas y los issues en GitHub |
| "Revisa mi `benchmarkBusqueda.js` y corrige lo que este mal" | Correciones en `benchmarkBusqueda.js` para el issue #10: datos con semilla, ordenamiento con nuestro MergeSort, 1 000 claves de búsqueda (20 % inexistentes) y medición de tiempo, comparaciones y CPU | Lo ejecuté nuevamente con `node --expose-gc` y comprobé que, cuando faltan partes del equipo, avisa y las salta sin detenerse | 

**Responsabilidad:** Revisé y entiendo el funcionamiento del benchmark. Soy responsable del contenido que entrego.