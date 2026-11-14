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
