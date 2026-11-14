---
tipo: analisis
tema: complejidad de MergeSort
issue: "[AA1-U2] Implementar MergeSort desde cero #2"
tags: [mergesort, big-o, estructura-de-datos]
---

# Análisis de complejidad de MergeSort

## 1. Párrafo para la entrega (borrador)

> **Complejidad temporal.** MergeSort tiene una complejidad temporal de **O(n log n)** en el mejor, el promedio y el peor caso. El algoritmo divide el arreglo por la mitad de forma recursiva hasta obtener subarreglos de cero o un elemento, lo que genera aproximadamente log₂ n niveles de recursión; en cada nivel, la operación de mezcla recorre en total los n elementos una sola vez, con costo lineal. Esto se expresa con la recurrencia T(n) = 2·T(n/2) + O(n), cuya solución es O(n log n). Como el costo no depende del orden inicial de los datos, no existe un caso degenerado como el de QuickSort, cuyo peor caso es O(n²).
>
> **Complejidad espacial.** La implementación requiere **O(n)** de memoria auxiliar: cada llamada crea copias de las mitades con `slice` y la mezcla construye un arreglo resultado nuevo, de modo que en cualquier momento hay vivos del orden de n elementos adicionales, más una pila de recursión de profundidad O(log n). Al crear arreglos nuevos en cada nivel, la memoria total reservada durante la ejecución es O(n log n), pero el recolector de basura la libera progresivamente y el máximo simultáneo se mantiene en O(n). Además, al tomar el elemento de la izquierda en caso de empate, el algoritmo es **estable**.

### Versión corta (si piden pocas líneas)

> MergeSort es O(n log n) en tiempo en todos los casos: se divide el arreglo en log n niveles y en cada uno se mezclan n elementos. Usa O(n) de memoria auxiliar por los arreglos temporales de la mezcla, y es estable.

---

## 2. De dónde sale cada resultado (para entenderlo y defenderlo)

### 2.1 Tiempo: O(n log n)

Ejemplo con n = 8. Cada fila es un nivel de la recursión:

| Nivel | Subarreglos | Tamaño de cada uno | Elementos que se mezclan en total |
|---|---|---|---|
| 0 | 1 | 8 | 8 |
| 1 | 2 | 4 | 8 |
| 2 | 4 | 2 | 8 |
| 3 | 8 | 1 | (caso base, sin mezcla) |

- Hay **log₂ 8 = 3** niveles de mezcla.
- En cada nivel se procesan **8 = n** elementos.
- Trabajo total ≈ n × log₂ n = 8 × 3 = 24.

La recurrencia lo resume: se hacen **dos** llamadas sobre **mitades** y luego una mezcla **lineal**:

```
T(n) = 2·T(n/2) + O(n)   →   O(n log n)
```

Por el teorema maestro: a = 2, b = 2 y f(n) = n coincide con n^(log₂ 2) = n, que da Θ(n log n).

**Mejor, promedio y peor caso son iguales**, porque la división siempre es por la mitad y la mezcla siempre recorre todos los elementos, sin importar si el arreglo venía ordenado, invertido o al azar.

### 2.2 Memoria: O(n)

Se distinguen tres cosas:

| Concepto | Valor | Por qué |
|---|---|---|
| Memoria auxiliar viva en un instante | **O(n)** | Las mitades creadas con `slice` y el arreglo `resultado` de la mezcla suman del orden de n (n + n/2 + n/4 + ... < 2n) |
| Profundidad de la pila de recursión | **O(log n)** | Cada llamada divide a la mitad; la pila crece hasta log₂ n niveles |
| Memoria total reservada durante toda la ejecución | O(n log n) | Cada nivel crea arreglos nuevos, pero el recolector de basura libera los anteriores |

La respuesta correcta a "¿cuánta memoria usa?" es **O(n) auxiliar**, porque lo que cuenta es el máximo simultáneo, no la suma de todo lo reservado.

> Una variante más eficiente reutiliza **un único arreglo auxiliar** de tamaño n en lugar de crear copias con `slice`. Sigue siendo O(n) de espacio, pero evita reservar memoria O(n log n) en total.

### 2.3 Comparación con QuickSort (útil para tu siguiente tarea)

| | MergeSort | QuickSort |
|---|---|---|
| Tiempo, mejor y promedio | O(n log n) | O(n log n) |
| Tiempo, peor caso | **O(n log n)** | O(n²) |
| Memoria auxiliar | O(n) | O(log n) (pila de recursión, si es en el lugar) |
| Estable | Sí | No (en la versión habitual) |

---

## 3. Preguntas de defensa

1. **¿Por qué O(n log n)?** Porque hay log n niveles de división y en cada nivel la mezcla recorre n elementos.
2. **¿Por qué el peor caso no empeora?** Porque la división siempre es por la mitad y no depende del orden de los datos.
3. **¿Por qué O(n) de memoria?** Por los arreglos temporales de las mitades y del resultado de la mezcla.
4. **¿Y la pila de recursión?** Tiene profundidad log n, que es menor que n y no cambia el orden de la memoria.
5. **¿Qué mejora tendría QuickSort frente a MergeSort?** Usa menos memoria auxiliar (en el lugar); a cambio puede degradarse a O(n²).
6. **¿Cómo se comprobaría con medidas?** Midiendo el tiempo con n, 2n, 4n...: debe crecer algo más que el doble en cada duplicación (el benchmark de la issue AA1).

---

## 4. Antes de entregarlo

- [ ] Reescribe el párrafo **con tus palabras**, usando esta explicación (sección 2) como apoyo. Debes poder defender cada frase.
- [ ] Comprueba cada afirmación contra tu código: ¿usa `slice`? ¿toma el de la izquierda en empate (`<= 0`)?
- [ ] Contrasta con el benchmark de tiempos cuando lo tengas.
- [ ] Registra en `docs/declaracion_IA.md` que usaste ayuda de IA para este análisis (qué pediste y cómo lo usaste).

---

## 5. Tarjetas de repaso (Spaced Repetition)

```markdown
¿Cuál es la complejidad temporal de MergeSort y en qué casos? :: O(n log n) en el mejor, el promedio y el peor caso.
¿Cuál es la recurrencia de MergeSort? :: T(n) = 2·T(n/2) + O(n), que resuelve a O(n log n).
¿Por qué hay log n niveles? :: Porque el arreglo se divide por la mitad hasta llegar a tamaño 1.
¿Por qué cada nivel cuesta O(n)? :: Porque la mezcla de todos los subarreglos de ese nivel recorre los n elementos una vez.
¿Cuánta memoria auxiliar usa MergeSort? :: O(n): las mitades y el arreglo resultado de la mezcla; más una pila de recursión de profundidad O(log n).
¿Por qué la memoria total reservada es O(n log n) pero se dice O(n)? :: Cada nivel crea arreglos nuevos (slice), pero el recolector libera los anteriores; el máximo simultáneo es O(n).
¿Qué ventaja de tiempo tiene MergeSort sobre QuickSort? :: Su peor caso es O(n log n); el de QuickSort es O(n²).
¿Qué ventaja de memoria tiene QuickSort sobre MergeSort? :: Usa O(log n) de pila en lugar de O(n) de arreglos auxiliares (si ordena en el lugar).
```
