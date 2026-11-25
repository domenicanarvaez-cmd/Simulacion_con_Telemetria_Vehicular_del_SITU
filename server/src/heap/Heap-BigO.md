---
tipo: analisis
tema: complejidad del Heap (montículo binario)
issue: "[AA3-U2] Implementar Heap desde cero #12"
tags: [heap, monticulo, cola-de-prioridad, big-o]
---

# Análisis de complejidad del Heap

## Párrafo para el informe

> El Heap se implementó como un **montículo binario** almacenado en un arreglo: para el elemento en la posición *i*, su padre está en ⌊(i − 1)/2⌋ y sus hijos en 2i + 1 y 2i + 2. Como el árbol se llena nivel por nivel, siempre es casi completo y su altura es ⌊log₂ n⌋. **Insertar** coloca el elemento al final y lo hace subir (*heapify-up*) intercambiándolo con su padre mientras tenga más prioridad; como mucho recorre la altura del árbol, por lo que cuesta **O(log n)**. **Extraer** devuelve la raíz, mueve el último elemento a la raíz y lo hace bajar (*heapify-down*) intercambiándolo con el hijo de más prioridad; también recorre como mucho la altura: **O(log n)**. **Ver la raíz** solo lee la posición 0: **O(1)**. El espacio es **O(n)** para el arreglo y **O(1)** adicional, porque los métodos son iterativos y no usan recursión. El comparador permite usar la misma clase como MinHeap o como MaxHeap.

## Tabla resumen

| Operación | Complejidad | Por qué |
|---|---|---|
| `insertar` | O(log n) | El elemento sube como máximo la altura del árbol (⌊log₂ n⌋ niveles) |
| `extraer` | O(log n) | El elemento movido a la raíz baja como máximo la altura |
| `verRaiz` | O(1) | La raíz siempre está en la posición 0 |
| `tamano`, `estaVacio` | O(1) | Solo leen la longitud del arreglo |
| Espacio | O(n) | Un arreglo con los n elementos; sin recursión |

## Ejemplo numérico (para la defensa)

Con 500 000 elementos, la altura es ⌊log₂ 500 000⌋ = 18. Insertar o extraer hace como máximo unos 18 intercambios, mientras que buscar el mínimo en un arreglo desordenado exigiría revisar los 500 000 elementos.

## Heap frente a ordenar todo

Para obtener los **k** elementos más urgentes, ordenar todo con MergeSort cuesta O(n log n). Con un Heap: insertar los n elementos cuesta O(n log n) en total, pero si los datos llegan uno a uno (como la telemetría en tiempo real) cada llegada cuesta solo O(log n) y la consulta del más urgente es O(1), sin reordenar todo cada vez.
