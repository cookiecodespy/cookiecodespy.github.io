# AI Race Gazette — avance fase 5, 8 de octubre de 2026

## Nuevos informes y correcciones

- Google Dataflow GPU Blackwell y Pause/Resume (14 Sep): https://cloud.google.com/blog/products/data-analytics/new-dataflow-features-to-enable-large-scale-ai-workloads/
- Google BigQuery: seis TVF de análisis aumentado para agentes (14 Sep): https://cloud.google.com/blog/products/data-analytics/bigquery-augmented-analytics-tvfs
- OpenAI Habitat: escalado y migración Python-Rust (11 Sep): https://openai.com/index/scaling-storage-one-billion-users-part-one/
- Gemini Windows: ampliación Reporter V2 del artículo legacy del 10 Sep, sin cambiar ID ni eventKey: https://blog.google/innovation-and-ai/products/gemini-app/gemini-app-now-on-windows/

## Corrección de procedencia: MAPL-EMIT

El resumen de Google del 9 Sep deriva del reporte técnico original publicado el 1 Sep. El estudio se publicó en PNAS en septiembre. Se registró una única noticia con fecha original 1 Sep y se reabrió el estado legacy complete para reauditoría.
https://research.google/blog/mapping-global-methane-emissions-from-space-with-deep-learning/
https://pubmed.ncbi.nlm.nih.gov/42679027/

## Investigación pendiente del 11 Sep

- GPT-Rosalind sale de research preview hacia organizaciones elegibles mediante trusted-access, no acceso universal: https://openai.com/index/introducing-gpt-rosalind/
- Cambio planificado de custom GPTs hacia plugins; no se ha ejecutado aún el retiro: https://help.openai.com/en/articles/6825453-chatgpt-release-notes

## Gates sin cerrar

Las jornadas 8–14 Sep no están completamente auditadas: faltan fuentes emergentes, DeepMind, 12 y 13 Sep, revisión por categorías, candidatos y pasada inversa. Ningún estado debe pasar a complete sin evidencia. El 1 Sep debe reauditarse por omisión detectada.


## Reanudación tras Main Chat saturado — auditoría de fuentes (8 oct 2026)

**Estado:** descubrimiento preliminar verificable, NO segunda pasada completa. No cambiar `dailyCoverage` ni marcar 12–13 Sep como `complete` o `reviewed-no-material-news` con esta evidencia. Los artículos/estados en producción permanecen intactos.

### Nuevos candidatos materiales, con fecha original comprobada

1. **10 Sep — OpenAI Agents API, public beta (prioridad P0).** No aparece como evento propio entre los 72 artículos observados. Anuncio primario: https://openai.com/index/introducing-the-agents-api/ . Confirmación adicional de la cuenta de anuncios de desarrolladores: https://community.openai.com/t/introducing-the-agents-api-and-hosted-sandboxes/1396481 . Diferencia editorial: no es GPT-Live-1 ni una extensión de Codex para consumidores. Ofrece harness gestionado, ejecución duradera, context compaction, búsqueda de herramientas, subagentes y sandboxes alojados o de terceros. Precio: beta abierta a desarrolladores; sin cargo adicional por la API de agentes, pero tokens/herramientas se cobran y los contenedores alojados tienen tarifa separada. **Siguiente acción:** investigar detalles, costes separados y redactar Reporter V2 independiente con fecha 10 Sep, deduplicando contra `main`.
2. **10 Sep — NASA / IBM Lunar Foundation Model (prioridad P0).** Anuncio simultáneo de NASA e IBM, ambos fechados 10 Sep: https://science.nasa.gov/science-research/artificial-intelligence-lunar-foundation-model/ y https://newsroom.ibm.com/2026-09-10-ibm-and-nasa-release-open-source-ai-model-to-support-lunar-exploration . Modelo científico abierto para observaciones lunares, con más de 30 capas espaciales integradas; los resultados cuantitativos son claims de los autores, no benchmark externo. **Siguiente acción:** verificar repositorio/model card y documento técnico; publicar Reporter V2 si no está duplicado.
3. **10 Sep — Xiaomi-CocktailASR-1 (candidato P1).** El artículo técnico primario es del 10 Sep: https://arxiv.org/abs/2609.11274 y el repositorio de pesos es https://huggingface.co/Ease3/Xiaomi-CocktailASR-1 . Aunque resúmenes del 12 Sep lo citan, **no asignar artificialmente 12 Sep al evento**. Investigar fecha efectiva de disponibilidad del checkpoint, condiciones de licencia y si amerita noticia independiente.

### 12 y 13 Sep — primera pasada, sin cierre

- Se inspeccionaron búsquedas fechadas en OpenAI, Anthropic, Google/DeepMind, Meta, NVIDIA, Mistral y Hugging Face junto con discovery abierto de startups, papers y pesos abiertos. **Esta consulta exploratoria no equivale a revisión exhaustiva de todos los canales**; la doble pasada y el registro por fuente/categoría siguen pendientes bajo `H-SEP12-13`, `H-0814-SOURCES` y `H-GOOGLE-DEEPMIND-0814`.
- **13 Sep, World Labs Atlas:** el podcast sobre Atlas es del 13 Sep (https://a16z.com/podcast/world-models-robotics-and-the-future-of-3d-ai/) pero **el lanzamiento original se publicó 1 Sep** (https://www.worldlabs.ai/blog/atlas). Usarlo como pista de reauditoría del 1 Sep, no reanunciar lanzamiento el 13.
- **12 Sep, Yandex AliceAI-Foundation-80B-A3B-Base:** aparece en una cronología agregada como 12 Sep, pero el anuncio corporativo verificable es del **21 Sep**: https://www.yandex.com/company/news/2026-09-21 . No registrar el lanzamiento el 12 sin evidencia primaria temporal que permita resolver la discrepancia.
- **13 Sep, nota de a16z sobre World Labs:** es contenido editorial/podcast, no evidencia de un modelo nuevo publicado ese día.
- **13 Sep, financiación de robótica citada en medios secundarios:** varias piezas comentan rondas anteriores o negociaciones no cerradas; no convertir en noticias confirmadas sin documento original con fecha y condiciones.

### Próximo gate verificable

Revisar las fuentes oficiales restantes y los repositorios open-weight fechados, categorizar candidatos y descartes por día, abrir y verificar fuentes primarias, publicar los eventos materiales con Reporter V2, ejecutar pasada inversa y solo entonces actualizar el ledger público e histórico. La investigación aquí consignada amplía la evidencia de `H-0814-SOURCES`; **no cierra ninguna tarea ni cambia el número de noticias**.
