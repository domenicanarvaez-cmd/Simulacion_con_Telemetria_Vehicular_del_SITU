# Análisis crítico de sostenibilidad

La búsqueda secuencial tiene complejidad O(n): en el peor caso examina los n elementos. Cada comparación consume ciclos de CPU, por lo que un mayor número de comparaciones implica mayor carga de procesamiento y mayor consumo energético. Estudios experimentales sobre algoritmos clásicos muestran que la elección del algoritmo y de su implementación produce diferencias significativas en la energía consumida [2], y que optimizar estas decisiones puede reducir ese consumo [1]. Por ello, estructuras ordenadas con búsqueda binaria, que reducen las comparaciones de O(n) a O(log n), disminuyen la carga de CPU y, en consecuencia, la energía. En sistemas que procesan datos de forma continua, como la telemetría del SITU, este ahorro se acumula. Sin embargo, con volúmenes pequeños la diferencia es despreciable y el costo de ordenar o indexar puede superar el beneficio, por lo que la decisión debe ser crítica y no automática.

## Referencias

[1] A. Brownlee, N. Burles, and J. Swan, "Search-based energy optimization of some ubiquitous algorithms," IEEE Trans. Emerg. Topics Comput. Intell., vol. 1, no. 3, pp. 188–201, Jun. 2017, doi: 10.1109/TETCI.2017.2699193.

[2] M. Rashid, L. Ardito, and M. Torchiano, "Energy consumption analysis of algorithms implementations," in Proc. ACM/IEEE Int. Symp. Empirical Softw. Eng. Meas. (ESEM), Beijing, China, Oct. 2015, pp. 82–85, doi: 10.1109/ESEM.2015.7321198.