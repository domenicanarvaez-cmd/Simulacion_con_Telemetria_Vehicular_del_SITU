# Análisis de Complejidad — QuickSort

## Complejidad Temporal

- **Caso promedio — $\Theta(n \log n)$:** En cada llamada recursiva, la partición divide el arreglo en dos subarreglos de tamaño proporcional (cercanos a $n/2$ gracias a la selección de pivote por **mediana de tres**). Esto genera un árbol de recursión de profundidad $\log_2 n$, y en cada nivel se realizan $O(n)$ comparaciones durante la partición, resultando en $O(n \log n)$.
- **Mejor caso — $\Omega(n \log n)$:** Ocurre cuando el pivote seleccionado divide el arreglo exactamente en dos mitades iguales en cada paso.
- **Peor caso — $O(n^2)$:** Ocurre si en cada partición el pivote elegido resulta ser el elemento mínimo o máximo del subarreglo (generando particiones de tamaño $n - 1$ y $0$). Aunque la mediana de tres elimina este comportamiento en arreglos ya ordenados o invertidos, sigue siendo teóricamente posible con distribuciones adversarias.

## Complejidad Espacial

- **Caso promedio — $O(\log n)$:** El ordenamiento se realiza *in-place* sobre el arreglo original sin reservar memoria auxiliar proporcional a $n$; el único espacio adicional corresponde a los marcos de la pila de llamadas recursivas.
- **Peor caso — $O(n)$:** Si el árbol de recursión degenera en una cadena lineal desbalanceada.