# Fase 5 — evidencia Sep 9 Cohere y Sep 10 Cognition

**Corte:** 2026-10-08. **Tipo:** dos reportajes Reporter V2 basados en fuentes oficiales. **Estado:** publicación preparada, jornadas no cerradas.

## Cohere — North Small Translate 1.0 (fecha 9 septiembre)

- Nota del lanzamiento **9 Sep**: https://docs.cohere.com/changelog/north-small-translate-1-0
- Blog técnico corporativo **10 Sep**: https://cohere.com/blog/north-small-translate
- Especificaciones, API y rate limits: https://docs.cohere.com/docs/north-small-translate-1.0
- Fichas de pesos/licencias/requisitos: https://huggingface.co/CohereLabs/North-Small-Translate-1.0 y https://huggingface.co/CohereLabs/North-Small-Translate-1.0-fp8

**Decisión:** publicar evento de disponibilidad el **9 Sep**, no crear otra pieza por la explicación editorial del día 10. Modelo MoE **218B totales /25B activos**, 16K de contexto, formatos BF16/FP8/W4A16, API Chat V2 con uso gratuito limitado y **pesos CC BY-NC 4.0 solo no comercial**. La divulgación de 83.6 WMT26 es *claim* de Cohere, no ranking independiente; no compararlo sin metodología.

**ID** `cohere-north-small-translate-open-weights-2026-09-09`; **eventKey** `cohere-north-small-translate-1-0-release-2026-09-09`.

## Cognition — SWE-2 (fecha 10 septiembre)

- Anuncio de Cognition **10 Sep**: https://cognition.com/blog/swe-2
- Tabla de benchmarks y revisiones: https://cognition.com/frontiercode
- Archivo de publicaciones de Cognition para fecha: https://cognition.com/blog

**Decisión:** noticia fechada el **10 Sep** por lanzamiento Devin Desktop/CLI y rollout Web/Fusion. Fuerte evidencia primaria de entrenamiento RL desde Kimi K3, 50.0% FrontierCode 1.1 Main frente a 42.0% SWE-1.7, 73.0% DeepSWE 1.1 vs. 37.7%; también **27.3% Terminal-Bench 4** como límite importante. Costos y ahorros son internos y relativos a setup del benchmark; no confundir con precio fijo del modelo ni afirmar pesos públicos.

**ID** `cognition-swe-2-coding-agent-model-2026-09-10`; **eventKey** `cognition-swe-2-devin-coding-model-launch-2026-09-10`.

## Investigación adicional del día 12/13: Iris

- Investigadores de AllSpark: https://github.com/AllSpark-Research/Iris
- Model card e historial inicial de Iris-mini: https://huggingface.co/AllSpark-Research/Iris-mini/commits/main

**Alerta:** el historial del checkpoint Iris-mini muestra el commit `1ec3716` *Iris release* con fecha indicada **2 Sep**, mientras que algunas publicaciones secundarias fechan el anuncio de pesos en **13 Sep**. Por eso **no se publica como lanzamiento del 13** hasta demostrar cuál fue la primera disponibilidad completa del par mini/pro y del harness. Revisar git commits iniciales, snapshot de archivos por fecha y calendario de anuncio oficial. Esta diferencia puede representar repositorio preparado antes del anuncio, pero no asumirlo.

## Gates

- Mantener Sep 9 y Sep 10 `partial`; todavía requieren barrido del source registry, Google/DeepMind y segunda auditoría por categorías.
- Sep 12 sin cierre: no atribuir noticias de otros días para llenar el hueco.
- No marcar P05 completa hasta fuentes oficiales, discovery abierto, candidatos resueltos y segunda pasada independientes.
