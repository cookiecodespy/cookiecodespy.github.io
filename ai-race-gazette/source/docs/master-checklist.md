# AI Race Gazette — checklist maestro de cierre

> Archivo generado desde `source/ops/backlog.json`. Edita la cola, no las casillas de esta página. Regenera con `python3 scripts/refresh_master_checklist.py`.

## Línea base histórica (no métricas vivas)

- Apertura: 2026-10-08.
- Archivo inicial: 53 artículos, 5 Reporter V2 y 48 legacy.
- Calendario inicial: 37 jornadas, 7 cerradas y 30 abiertas.
- Commit base: `5bc6358c50002d6dee4db567494665f7fc9d014f`.

## Progreso de la cola

- 6 fases; 54 tareas; 14 completadas; 3 en curso; 36 pendientes o bloqueadas; 1 descartadas con razón.

## P05 — 8–14 septiembre: reconstrucción Reporter V2

**Estado:** in_progress. **Gate:** Cada fecha auditada por fuentes + categorías + segunda pasada y artículos extensos

- [x] **H-SEP08-IMAGES25** · P0 · done — ChatGPT Images 2.5: informe Reporter V2
  - Criterio: V2, fuente primaria, mirrors, RSS y coverage
  - Commit: `5bc6358c50002d6dee4db567494665f7fc9d014f`
- [x] **H-SEP08-MISTRAL** · P0 · done — Mistral: ronda Serie D por €3.000 millones
  - Criterio: Publicar V2 con términos atribuidos, fuentes oficiales y contexto competitivo
  - Evidencia: https://mistral.ai/news/mistral-makes-sovereign-open-weight-ai-to-frontier/
- [x] **H-SEP10-GPTLIVE** · P0 · done — OpenAI: GPT-Live-1 API y evaluación de voz
  - Criterio: Publicar V2 técnico y precio/estado correctamente atribuidos
  - Evidencia: https://openai.com/index/introducing-gpt-live-1-in-the-api/
- [x] **H-SEP09-FORTRAN** · P1 · done — Investigar Mistral: agentes para Fortran
  - Criterio: Evaluar materialidad, fecha y fuentes; publicar V2 o descartar con motivo
  - Evidencia: https://mistral.ai/news/legacy-code-modernization/
- [x] **H-SEP10-CLOUDERA** · P1 · done — Investigar alianza Mistral–Cloudera
  - Criterio: Confirmar efectos técnicos y fecha, publicar V2 o descartar con motivo
  - Evidencia: https://mistral.ai/news/mistral-x-cloudera/
- [ ] **H-0814-SOURCES** · P0 · in_progress — Barrido oficial, emergentes y categorías 8–14
  - Criterio: Registro por día/fuente/sector, candidatos y descartes sin inventar métricas
- [ ] **H-0814-GOOGLE** · P0 · in_progress — Revisar Google/DeepMind día a día 8–14
  - Criterio: Comprobar novedades relevantes, fechas y completar matriz
  - Evidencia: https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai
- [x] **H-SEP10-LEGACY** · P1 · done — Enriquecer Gemini para Windows
  - Criterio: Conservar id/eventKey, recuperar fuentes y publicar informe Reporter V2
  - Evidencia: https://blog.google/innovation-and-ai/products/gemini-app/gemini-app-now-on-windows/
- [ ] **H-0814-GATE** · P0 · blocked — Cerrar estados 8–14 con doble auditoría
  - Criterio: Todos los candidatos resueltos, evidencia de dos pasadas, cobertura y RSS consistentes
  - Depende de: H-0814-SOURCES, H-0814-GOOGLE, H-SEP08-MISTRAL, H-SEP10-GPTLIVE
- [ ] **H-GOOGLE-SEP09-AIPLANS** · P1 · queued — Evaluar Google AI plans: nuevas herramientas y acceso
  - Criterio: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
  - Fecha investigada: 2026-09-09
- [x] **H-GOOGLE-SEP14-DATAFLOW** · P1 · done — Evaluar Google Cloud Dataflow con GPU Blackwell
  - Criterio: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
  - Fecha investigada: 2026-09-14
  - Evidencia: https://cloud.google.com/blog/products/data-analytics/new-dataflow-features-to-enable-large-scale-ai-workloads/
- [ ] **H-GOOGLE-SEP09-GARTNER** · P1 · cancelled — Evaluar reconocimiento Gartner Google Gemini Enterprise
  - Criterio: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
  - Fecha investigada: 2026-09-09
  - Motivo de descarte: Reconocimiento en ranking de proveedor; el anuncio no introduce una capacidad técnica nueva ni disponibilidad material. Conservado como contexto, no pieza independiente.
- [x] **H-GOOGLE-SEP08-GTIG** · P0 · done — Google GTIG: informe de amenazas con agentes (8 Sep)
  - Criterio: Informe Reporter V2 extenso, fuente oficial, recomendaciones defensivas y fecha correcta.
  - Evidencia: https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai
- [ ] **H-GOOGLE-DEEPMIND-0814** · P1 · queued — Segunda revisión de Google DeepMind 8–14 septiembre
  - Criterio: Revisar todas las fechas en blogs, papers y repositorios DeepMind, registrar materialidad/duplicados y descartar con justificación.
- [x] **H-GOOGLE-SEP14-BIGQUERY** · P0 · done — BigQuery anuncia seis funciones de análisis aumentado para agentes
  - Criterio: Verificar fuentes originales, fecha, claims y publicar Reporter V2 profundo con evidencias.
  - Fecha investigada: 2026-09-14
  - Evidencia: https://cloud.google.com/blog/products/data-analytics/bigquery-augmented-analytics-tvfs
- [x] **H-GOOGLE-SEP09-MAPL** · P0 · done — MAPL‑EMIT publicado en fecha original del 1 de septiembre
  - Criterio: Verificar fuentes originales, fecha, claims y publicar Reporter V2 profundo con evidencias.
  - Fecha investigada: 2026-09-01
  - Evidencia: https://research.google/blog/mapping-global-methane-emissions-from-space-with-deep-learning/
- [x] **H-OPENAI-SEP11-HABITAT** · P0 · done — OpenAI Habitat: escalado y migración Python-Rust
  - Criterio: Revisar anuncio oficial y su cambio material, publicar V2 si corresponde; deduplicar y documentar estado de acceso.
  - Fecha investigada: 2026-09-11
  - Evidencia: https://openai.com/index/scaling-storage-one-billion-users-part-one/
- [ ] **H-OPENAI-SEP11-ROSALIND** · P0 · queued — GPT‑Rosalind sale de preview para organizaciones elegibles
  - Criterio: Revisar anuncio oficial y su cambio material, publicar V2 si corresponde; deduplicar y documentar estado de acceso.
  - Fecha investigada: 2026-09-11
- [ ] **H-OPENAI-SEP11-GPT-MIGRATION** · P0 · queued — ChatGPT anuncia retiro futuro de custom GPTs y migración a plugins
  - Criterio: Revisar anuncio oficial y su cambio material, publicar V2 si corresponde; deduplicar y documentar estado de acceso.
  - Fecha investigada: 2026-09-11
- [ ] **H-SEP12-13** · P0 · queued — Cobertura exhaustiva del 12 y 13 de septiembre
  - Criterio: Fuentes por día, discovery abierto y pasada inversa; publicar V2 o registrar sin novedades con evidencia.
- [ ] **H-SEP08-11-REVERSE** · P0 · queued — Segunda pasada por compañías del 8 al 11 septiembre
  - Criterio: Revisar laboratorios, startups, open source, chips, modelos, seguridad y producto; resolver pendientes.
- [ ] **H-SEP14-REVERSE** · P0 · queued — Segunda pasada del 14 septiembre después de BigQuery y Dataflow
  - Criterio: Confirmar otros anuncios relevantes del día y registrar revisados/descartes antes de cerrar.

## P06 — 15–21 septiembre: reconstrucción Reporter V2

**Estado:** queued. **Gate:** Siete días revisados con documentación, artículos V2 y cierre verificable

- [ ] **H-1521-GATE** · P0 · queued — Reconstruir 15–21 septiembre
  - Criterio: Siete fechas complete/reviewed-no-material-news con evidencia y Reporter V2

## P07 — 22–30 septiembre: reconstrucción y legacy

**Estado:** queued. **Gate:** Nueve fechas cerradas con fuentes y piezas antiguas enriquecidas

- [ ] **H-2230-GATE** · P0 · queued — Reconstruir 22–30 septiembre
  - Criterio: Nueve fechas cerradas y artículos previos enriquecidos

## P08 — Octubre hasta la fecha y Newsroom continua

**Estado:** queued. **Gate:** Octubre al día; publicación programada verificada; controles editoriales automáticos, concurrencia y rollback probados.

- [ ] **H-OCT-GATE** · P0 · queued — Completar 1 octubre hasta fecha actual
  - Criterio: Jornadas reales cerradas, sin inventar noticias ni fechas futuras
- [ ] **OPS-NEWSROOM** · P0 · queued — Probar publicación desatendida de Scheduled Task
  - Criterio: Demostrar commit horario autónomo o documentar aprobación pendiente
- [ ] **OPS-DAYCONTINUITY** · P1 · queued — Cerrar huecos de ledger en días nuevos sin noticias
  - Criterio: Calendario al día incluso cuando la tarea horaria hace no-op
- [x] **OPS-CONTENT-CI** · P0 · done — Validación CI de cambios solo editoriales
  - Criterio: Workflow separado verifica ambos JSON, ambos RSS, fechas, eventKeys, conteos y reglas editoriales con ejecución real.
  - Evidencia: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37795004760
- [ ] **OPS-LIVE-CHECKLIST** · P0 · in_progress — Generar y verificar checklist desde JSON
  - Criterio: Un solo JSON gobierna casillas, estados, razones y progreso; script determinista y comprobación --check en CI.
- [ ] **OPS-RUN-PROOF** · P0 · queued — Demostrar tres ejecuciones reales de Newsroom horario
  - Criterio: Verificar al menos tres ejecuciones consecutivas, no-op silencioso y publicación autorizada cuando aparezca un evento.
- [ ] **OPS-CONCURRENCY-TEST** · P0 · queued — Prueba de colisión Newsroom y Backfill
  - Criterio: Simular dos writers, comprobar SHA conflict/rebase y ausencia de pérdida o duplicación en JSON/RSS.
- [ ] **OPS-ROLLBACK-DRILL** · P1 · queued — Ensayar rollback y restauración de datos/arte
  - Criterio: Documentar y ensayar restauración desde Git con evidencia, sin afectar la raíz de cookiecodespy.github.io.

## P09 — Enriquecimiento de legacy y Visual Desk

**Estado:** queued. **Gate:** Artículos legacy enriquecidos o exceptuados con evidencia; ilustraciones específicas de titulares importantes y estándares visuales.

- [ ] **ED-LEGACY48** · P0 · queued — Migrar todos los artículos legacy restantes a Reporter V2
  - Criterio: Cero artículos legacy sin excepción editorial documentada; la línea base tenía 48, ahora quedan 47. Preservar ids y verificar fuentes.
- [ ] **VIS-PREMIUM** · P1 · queued — Crear lote visual periódico de grabados específicos
  - Criterio: Disminuir el fallback repetido, resolver P0 de imagen y mantener créditos
- [ ] **VIS-GENERATION** · P1 · queued — Explorar generación automática por noticia con QA
  - Criterio: Pipeline de imágenes, permisos y costes probados antes de activar
- [ ] **VIS-P0-ORIGINALS** · P0 · queued — Lote de grabados específicos para reportajes prioritarios
  - Criterio: Resolver briefs P0 con WebP originales, credit/alt y prueba visual; reducir las 46 reutilizaciones hero.
- [ ] **VIS-REUSE-RULES** · P1 · queued — Política cuantificada de reutilización visual
  - Criterio: Definir presupuesto visual, tipos de grabado, niveles de especificidad y umbral de repetición con QA.
- [ ] **ED-LEGACY-BATCH** · P0 · queued — Migración Reporter V2 por lotes de artículos antiguos
  - Criterio: Cerrar historias legacy por semana/actor, revisar fuentes y no alterar identificadores ni inventar contenido.
- [ ] **VIS-AUTO-QUEUE-REFRESH** · P1 · queued — Sincronizar cola visual tras publicaciones Newsroom
  - Criterio: Refrescar image-queue y asset-manifest automáticamente, sin pisar noticias ni commits vacíos y con tres ejecuciones validadas.

## P10 — Segunda auditoría y lanzamiento v1.0

**Estado:** queued. **Gate:** Segunda auditoría histórica por fecha y empresa, QA factual, social/SEO, accesibilidad y release gate sin tareas P0 pendientes.

- [ ] **QA-REVERSE** · P0 · queued — Segunda pasada por empresa/tema y replay 1–7 Sep
  - Criterio: No omisiones materiales conocidas; fechas, rumores y claims auditados
- [ ] **QA-WEB** · P1 · queued — QA UX, móvil, SEO social, RSS, accesibilidad
  - Criterio: Browser QA y enlaces/previews comprobados
- [ ] **QA-LAUNCH** · P0 · blocked — Aprobar lanzamiento Gazette v1.0
  - Criterio: Gates P05–P10 con evidencias y excepciones explícitas
  - Depende de: H-0814-GATE, H-1521-GATE, H-2230-GATE, H-OCT-GATE, ED-LEGACY48, QA-REVERSE
- [ ] **QA-SEP01-REOPEN** · P0 · queued — Reauditar 1 Sep por omisión de MAPL‑EMIT tras cierre legacy
  - Criterio: Rehacer checklist completo y segunda pasada de 1 Sep, resolver omisiones y volver a cerrar el día solo con evidencia.
  - Fecha investigada: 2026-09-01
- [ ] **QA-SEP02-07-REOPEN** · P0 · queued — Volver a auditar del 2 al 7 de septiembre
  - Criterio: Registrar fuentes, categorías, discovery y pasada inversa por fecha; cerrar solo con evidencias verificadas.
- [ ] **QA-CLAIMS-SAMPLING** · P0 · queued — Auditoría cruzada de fechas, precios, disponibilidad y fuentes
  - Criterio: Reabrir las fuentes del archivo completo, contrastar claims del proveedor, registrar errores y correcciones.
- [ ] **QA-EVENT-DEDUP** · P1 · queued — Revisar eventos distintos con una misma URL
  - Criterio: Evaluar duplicados semánticos en historias con fuente principal común sin fusionar eventos verdaderamente independientes.
- [ ] **QA-HTTP-SMOKE** · P0 · queued — Smoke tests públicos de artículos, RSS e imágenes
  - Criterio: Comprobar HTTP 200, assets, navegación móvil y RSS desplegado tras publicación; incluir URLs concretas.
- [ ] **QA-SEO-PREVIEW** · P1 · queued — Auditar SEO y tarjetas al compartir artículos
  - Criterio: Revisar metadatos disponibles a crawlers sin JavaScript, canonical, sitemap, OG y previews por artículo.
- [ ] **QA-A11Y** · P1 · queued — Auditar contraste, teclado, lectores de pantalla y responsive
  - Criterio: Pruebas de focus, landmarks, alt, tamaños móviles y correcciones de accesibilidad comprobadas.
- [ ] **QA-RELEASE-GATE** · P0 · queued — Validación final de release v1.0 sin P0 abiertos
  - Criterio: Firmar criterios editorial, histórico, visual, SEO, automatización y CI antes de declarar producto acabado.
  - Depende de: QA-LAUNCH
- [x] **QA-READTIME-REGRESSION** · P1 · done — Reparar tiempo de lectura real en Reporter V2
  - Criterio: Cómputo correcto de palabras con secciones V2, más dos pruebas y CI verde sin alterar el estilo.
  - Commit: `85e4144be915c44138a6dda572bc22176c42948d`
  - Evidencia: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37795939872
- [x] **QA-COVERAGE-HARDGATE** · P0 · done — Impedir cierres diarios sin auditoría Backbone v1
  - Criterio: Bloquear cierre sin doble pasada, cero candidatos abiertos, fuentes/categorías revisadas y documento verificable; CI verde.
  - Commit: `d16846fd56558b8bb29be5191f968ff0316ddc80`
  - Evidencia: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37796206364
- [ ] **QA-MAJOR-STORY-CORROBORATION** · P1 · queued — Revisar reportajes mayores que citan una sola fuente
  - Criterio: Reabrir fuentes primarias, validar claims y usar documentación o corroboración externa donde exista; no fabricar una segunda fuente.
- [ ] **QA-EDITORIAL-METRICS-LIVE** · P1 · queued — Panel interno verificable de avance y frescura
  - Criterio: Generar métricas verificables de artículos, legacy, días registrados/auditados, última publicación y trabajo pendiente desde JSON de main.

## Reglas para nuevas tareas

Toda tarea descubierta se agrega a `source/ops/backlog.json` con ID estable, fase, prioridad, dueño, evidencia y criterio de aceptación. No se borra historial ni se marca `done` sin evidencia. Un día con noticias no se considera completo sin doble revisión documentada. Concurrencia: releer `main` y deduplicar por `eventKey` antes de escribir.
