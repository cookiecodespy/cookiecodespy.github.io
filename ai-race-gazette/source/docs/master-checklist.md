# AI Race Gazette — checklist maestro de cierre

> Tablero generado desde `source/ops/backlog.json`, la cola persistente y fuente de verdad. Todo hallazgo nuevo debe incorporarse a esa cola.

## Línea base de apertura

Fecha: 2026-10-08. La línea base es histórica, no el contador en vivo.
Artículos: 53 (5 Reporter V2; 48 legacy).
Jornadas iniciales: 37 (7 cerradas; 30 abiertas).

## Fases y tareas verificables

### P05 — 8–14 septiembre: reconstrucción Reporter V2 (in_progress)

**Gate:** Cada fecha auditada por fuentes + categorías + segunda pasada y artículos extensos

- [x] **H-SEP08-IMAGES25** (P0, done): ChatGPT Images 2.5: informe Reporter V2.
  - Cierre: V2, fuente primaria, mirrors, RSS y coverage
  - Commit: 5bc6358c50002d6dee4db567494665f7fc9d014f
- [x] **H-SEP08-MISTRAL** (P0, done): Mistral: ronda Serie D por €3.000 millones.
  - Cierre: Publicar V2 con términos atribuidos, fuentes oficiales y contexto competitivo
  - Fuente: https://mistral.ai/news/mistral-makes-sovereign-open-weight-ai-to-frontier/
- [x] **H-SEP10-GPTLIVE** (P0, done): OpenAI: GPT-Live-1 API y evaluación de voz.
  - Cierre: Publicar V2 técnico y precio/estado correctamente atribuidos
  - Fuente: https://openai.com/index/introducing-gpt-live-1-in-the-api/
- [x] **H-SEP09-FORTRAN** (P1, done): Investigar Mistral: agentes para Fortran.
  - Cierre: Evaluar materialidad, fecha y fuentes; publicar V2 o descartar con motivo
  - Fuente: https://mistral.ai/news/legacy-code-modernization/
- [x] **H-SEP10-CLOUDERA** (P1, done): Investigar alianza Mistral–Cloudera.
  - Cierre: Confirmar efectos técnicos y fecha, publicar V2 o descartar con motivo
  - Fuente: https://mistral.ai/news/mistral-x-cloudera/
- [ ] **H-0814-SOURCES** (P0, in_progress): Barrido oficial, emergentes y categorías 8–14.
  - Cierre: Registro por día/fuente/sector, candidatos y descartes sin inventar métricas
- [ ] **H-0814-GOOGLE** (P0, in_progress): Revisar Google/DeepMind día a día 8–14.
  - Cierre: Comprobar novedades relevantes, fechas y completar matriz
  - Fuente: https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai
- [x] **H-SEP10-LEGACY** (P1, done): Enriquecer Gemini para Windows.
  - Cierre: Conservar id/eventKey, recuperar fuentes y publicar informe Reporter V2
  - Fuente: https://blog.google/innovation-and-ai/products/gemini-app/gemini-app-now-on-windows/
- [ ] **H-0814-GATE** (P0, blocked): Cerrar estados 8–14 con doble auditoría.
  - Cierre: Todos los candidatos resueltos, evidencia de dos pasadas, cobertura y RSS consistentes
- [ ] **H-GOOGLE-SEP09-AIPLANS** (P1, queued): Evaluar Google AI plans: nuevas herramientas y acceso.
  - Cierre: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
  - Fuente: https://blog.google/products-and-platforms/products/google-one/fall-2026-ai-plan-updates/
- [x] **H-GOOGLE-SEP14-DATAFLOW** (P1, done): Evaluar Google Cloud Dataflow con GPU Blackwell.
  - Cierre: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
  - Fuente: https://cloud.google.com/blog/products/data-analytics/new-dataflow-features-to-enable-large-scale-ai-workloads/
- [ ] **H-GOOGLE-SEP09-GARTNER** (P1, cancelled): Evaluar reconocimiento Gartner Google Gemini Enterprise.
  - Cierre: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
  - Motivo de descarte: Reconocimiento en ranking de proveedor; el anuncio no introduce una capacidad técnica nueva ni disponibilidad material. Conservado como contexto, no pieza independiente.
  - Fuente: https://cloud.google.com/blog/products/ai-machine-learning/google-is-a-leader-in-2026-gartner-magic-quadrant-for-enterprise-ai-assistants
- [x] **H-GOOGLE-SEP08-GTIG** (P0, done): Google GTIG: informe de amenazas con agentes (8 Sep).
  - Cierre: Informe Reporter V2 extenso, fuente oficial, recomendaciones defensivas y fecha correcta.
  - Fuente: https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai
- [ ] **H-GOOGLE-DEEPMIND-0814** (P1, queued): Segunda revisión de Google DeepMind 8–14 septiembre.
  - Cierre: Revisar todas las fechas en blogs, papers y repositorios DeepMind, registrar materialidad/duplicados y descartar con justificación.
  - Fuente: https://deepmind.google/discover/blog/
- [x] **H-GOOGLE-SEP14-BIGQUERY** (P0, done): BigQuery anuncia seis funciones de análisis aumentado para agentes.
  - Cierre: Verificar fuentes originales, fecha, claims y publicar Reporter V2 profundo con evidencias.
  - Fuente: https://cloud.google.com/blog/products/data-analytics/bigquery-augmented-analytics-tvfs
- [x] **H-GOOGLE-SEP09-MAPL** (P0, done): MAPL‑EMIT publicado en fecha original del 1 de septiembre.
  - Cierre: Verificar fuentes originales, fecha, claims y publicar Reporter V2 profundo con evidencias.
  - Fuente: https://research.google/blog/mapping-global-methane-emissions-from-space-with-deep-learning/
- [x] **H-OPENAI-SEP11-HABITAT** (P0, done): OpenAI Habitat: escalado y migración Python-Rust.
  - Cierre: Revisar anuncio oficial y su cambio material, publicar V2 si corresponde; deduplicar y documentar estado de acceso.
  - Fuente: https://openai.com/index/scaling-storage-one-billion-users-part-one/
- [ ] **H-OPENAI-SEP11-ROSALIND** (P0, queued): GPT‑Rosalind sale de preview para organizaciones elegibles.
  - Cierre: Revisar anuncio oficial y su cambio material, publicar V2 si corresponde; deduplicar y documentar estado de acceso.
  - Fuente: https://openai.com/index/introducing-gpt-rosalind/
- [ ] **H-OPENAI-SEP11-GPT-MIGRATION** (P0, queued): ChatGPT anuncia retiro futuro de custom GPTs y migración a plugins.
  - Cierre: Revisar anuncio oficial y su cambio material, publicar V2 si corresponde; deduplicar y documentar estado de acceso.
  - Fuente: https://help.openai.com/en/articles/6825453-chatgpt-release-notes

### P06 — 15–21 septiembre: reconstrucción Reporter V2 (queued)

**Gate:** Siete días revisados con documentación, artículos V2 y cierre verificable

- [ ] **H-1521-GATE** (P0, queued): Reconstruir 15–21 septiembre.
  - Cierre: Siete fechas complete/reviewed-no-material-news con evidencia y Reporter V2

### P07 — 22–30 septiembre: reconstrucción y legacy (queued)

**Gate:** Nueve fechas cerradas con fuentes y piezas antiguas enriquecidas

- [ ] **H-2230-GATE** (P0, queued): Reconstruir 22–30 septiembre.
  - Cierre: Nueve fechas cerradas y artículos previos enriquecidos

### P08 — Octubre hasta la fecha y Newsroom continua (queued)

**Gate:** Octubre al día, fechas sin huecos y publicación horaria realmente operativa

- [ ] **H-OCT-GATE** (P0, queued): Completar 1 octubre hasta fecha actual.
  - Cierre: Jornadas reales cerradas, sin inventar noticias ni fechas futuras
- [ ] **OPS-NEWSROOM** (P0, queued): Probar publicación desatendida de Scheduled Task.
  - Cierre: Demostrar commit horario autónomo o documentar aprobación pendiente
- [ ] **OPS-DAYCONTINUITY** (P1, queued): Cerrar huecos de ledger en días nuevos sin noticias.
  - Cierre: Calendario al día incluso cuando la tarea horaria hace no-op

### P09 — Enriquecimiento de legacy y Visual Desk (queued)

**Gate:** 48 piezas legacy ampliadas o excepcionadas y arte editorial con QA

- [ ] **ED-LEGACY48** (P0, queued): Enriquecer 48 artículos legacy.
  - Cierre: V2 verificado sin relleno, id/eventKey estables y fuentes
- [ ] **VIS-PREMIUM** (P1, queued): Crear lote visual periódico de grabados específicos.
  - Cierre: Disminuir el fallback repetido, resolver P0 de imagen y mantener créditos
- [ ] **VIS-GENERATION** (P1, queued): Explorar generación automática por noticia con QA.
  - Cierre: Pipeline de imágenes, permisos y costes probados antes de activar

### P10 — Segunda auditoría y lanzamiento v1.0 (queued)

**Gate:** Cobertura inversa, fuentes, fechas, diseño, SEO, accesibilidad, CI y automatización revisados

- [ ] **QA-REVERSE** (P0, queued): Segunda pasada por empresa/tema y replay 1–7 Sep.
  - Cierre: No omisiones materiales conocidas; fechas, rumores y claims auditados
- [ ] **QA-WEB** (P1, queued): QA UX, móvil, SEO social, RSS, accesibilidad.
  - Cierre: Browser QA y enlaces/previews comprobados
- [ ] **QA-LAUNCH** (P0, blocked): Aprobar lanzamiento Gazette v1.0.
  - Cierre: Gates P05–P10 con evidencias y excepciones explícitas
- [ ] **QA-SEP01-REOPEN** (P0, queued): Reauditar 1 Sep por omisión de MAPL‑EMIT tras cierre legacy.
  - Cierre: Rehacer checklist completo y segunda pasada de 1 Sep, resolver omisiones y volver a cerrar el día solo con evidencia.
  - Fuente: https://research.google/blog/mapping-global-methane-emissions-from-space-with-deep-learning/

## Protocolo para descubrimientos posteriores

Registrar todos los candidatos, fallas, omisiones, mejoras de producto y hallazgos con ID estable, fase, prioridad, evidencia, responsable, estado y criterio de cierre en `ops/backlog.json`. Mantener los rechazos con razón. Nunca declarar una jornada completa por tener noticias publicadas sin revisar las fuentes y la pasada inversa.

## Resumen del backlog

- Fases: 6.
- Tareas: 31.
- Done: 11.
- In progress: 2.
- Queued/blocked: 17.
- Cancelled (con justificación): 1.
