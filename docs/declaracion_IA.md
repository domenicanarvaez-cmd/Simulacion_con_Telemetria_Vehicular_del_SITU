# Declaración de uso de IA

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