# Evidencia editorial — NASA-IBM Lunar Foundation Model

**Jornada investigada:** 2026-09-10. **Estado:** Reporter V2 propuesto, sin cierre de fecha.

## Cronología

- 2026-09-08: envío inicial del artículo metodológico a arXiv, **no** equivalencia automática al lanzamiento abierto. https://arxiv.org/abs/2609.13283
- 2026-09-10: IBM anuncia liberación del modelo y dataset. https://newsroom.ibm.com/2026-09-10-ibm-and-nasa-release-open-source-ai-model-to-support-lunar-exploration
- 2026-09-10: NASA anuncia publicación de pesos, GitHub, datasets y benchmarks. https://science.nasa.gov/science-research/artificial-intelligence-lunar-foundation-model/
- 2026-09-10: IBM Research contextualiza arquitectura, benchmarks y casos de uso. https://research.ibm.com/blog/nasa-ibm-lunar-foundation-model

## Artefactos primarios

- Model card, licencia, método y **limitaciones explícitas**: https://huggingface.co/nasa-ibm-ai4science/NASA-IBM-Lunar-Foundation-Model
- Código reproducible: https://github.com/NASA-IMPACT/NASA-IBM-Lunar-Foundation-Model
- Paper: https://arxiv.org/abs/2609.13283

## Hechos vs. claims / seguridad científica

- Disponible como checkpoint Apache-2.0 con código público, integrado en TerraTorch.
- SomBench reúne observaciones lunares en múltiples resoluciones y numerosas capas: **no confundir** más de 30 capas de dataset con 11 modalidades del entrenamiento.
- La cifra destacada por IBM de **hasta 22 % menos RMSE** en prospectividad de hielo es resultado de los autores en tarea concreta, no clasificación científica general.
- **Crítico:** prospectividad de hielo es predicción respecto a un mapa inferido, **no detección física de hielo**.
- **Crítico:** el model card excluye decisiones operacionales sobre certificación de aterrizaje, riesgo y navegación geodésica; no atribuir capacidades que no tiene.
- Comparativas de segmentación/cráteres varían según escala y muestran diferencias pequeñas en algunos escenarios.

## Publicación

- `id`: `ibm-nasa-lunar-foundation-model-open-release-2026-09-10`
- `eventKey`: `ibm-nasa-lunar-foundation-model-open-source-2026-09-10`
- Se conserva 2026-09-10 como `partial`; completar fuentes, candidatos y pasada inversa antes de cierre.
- Pendiente Visual Desk para portada específica del evento (actual fallback registrado, creditado).
