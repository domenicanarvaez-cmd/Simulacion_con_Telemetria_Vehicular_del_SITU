# Declaración de uso de IA

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/feat/quicksort
