# AI Race Gazette — checklist maestro de cierre

**Fuente de verdad:** `../ops/backlog.json`. La instantánea de apertura no se actualiza con cada publicación.

## Línea base de apertura

53 artículos, 5 Reporter V2, 48 legacy; 7 de 37 jornadas cerradas. Estas cifras son históricas, no el estado actual.

## Fases y tareas

### P05 — 8–14 septiembre: reconstrucción Reporter V2 (in_progress)

**Criterio de cierre:** Cada fecha auditada por fuentes + categorías + segunda pasada y artículos extensos

- [x] **H-SEP08-IMAGES25** (P0, done): ChatGPT Images 2.5: informe Reporter V2.
  - Aceptación: V2, fuente primaria, mirrors, RSS y coverage
  - Commit: 5bc6358c50002d6dee4db567494665f7fc9d014f
- [x] **H-SEP08-MISTRAL** (P0, done): Mistral: ronda Serie D por €3.000 millones.
  - Aceptación: Publicar V2 con términos atribuidos, fuentes oficiales y contexto competitivo
  - Evidencia: https://mistral.ai/news/mistral-makes-sovereign-open-weight-ai-to-frontier/
- [x] **H-SEP10-GPTLIVE** (P0, done): OpenAI: GPT-Live-1 API y evaluación de voz.
  - Aceptación: Publicar V2 técnico y precio/estado correctamente atribuidos
  - Evidencia: https://openai.com/index/introducing-gpt-live-1-in-the-api/
- [x] **H-SEP09-FORTRAN** (P1, done): Investigar Mistral: agentes para Fortran.
  - Aceptación: Evaluar materialidad, fecha y fuentes; publicar V2 o descartar con motivo
  - Evidencia: https://mistral.ai/news/legacy-code-modernization/
- [x] **H-SEP10-CLOUDERA** (P1, done): Investigar alianza Mistral–Cloudera.
  - Aceptación: Confirmar efectos técnicos y fecha, publicar V2 o descartar con motivo
  - Evidencia: https://mistral.ai/news/mistral-x-cloudera/
- [ ] **H-0814-SOURCES** (P0, in_progress): Barrido oficial, emergentes y categorías 8–14.
  - Aceptación: Registro por día/fuente/sector, candidatos y descartes sin inventar métricas
- [ ] **H-0814-GOOGLE** (P0, in_progress): Revisar Google/DeepMind día a día 8–14.
  - Aceptación: Comprobar novedades relevantes, fechas y completar matriz
  - Evidencia: https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai
- [x] **H-SEP10-LEGACY** (P1, done): Enriquecer Gemini para Windows.
  - Aceptación: Conservar id/eventKey, recuperar fuentes y publicar informe Reporter V2
- [ ] **H-0814-GATE** (P0, blocked): Cerrar estados 8–14 con doble auditoría.
  - Aceptación: Todos los candidatos resueltos, evidencia de dos pasadas, cobertura y RSS consistentes
- [ ] **H-GOOGLE-SEP09-AIPLANS** (P1, queued): Evaluar Google AI plans: nuevas herramientas y acceso.
  - Aceptación: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
- [x] **H-GOOGLE-SEP14-DATAFLOW** (P1, done): Evaluar Google Cloud Dataflow con GPU Blackwell.
  - Aceptación: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
- [ ] **H-GOOGLE-SEP09-GARTNER** (P1, cancelled): Evaluar reconocimiento Gartner Google Gemini Enterprise.
  - Aceptación: Verificar fecha, independencia, materialidad, duplicados y fuentes; publicar Reporter V2 o descartar documentando la decisión.
  - Descartado: Reconocimiento en ranking de proveedor; el anuncio no introduce una capacidad técnica nueva ni disponibilidad material. Conservado como contexto, no pieza independiente.
- [x] **H-GOOGLE-SEP08-GTIG** (P0, done): Google GTIG: informe de amenazas con agentes (8 Sep).
  - Aceptación: Informe Reporter V2 extenso, fuente oficial, recomendaciones defensivas y fecha correcta.
  - Evidencia: https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai
- [ ] **H-GOOGLE-DEEPMIND-0814** (P1, queued): Segunda revisión de Google DeepMind 8–14 septiembre.
  - Aceptación: Revisar todas las fechas en blogs, papers y repositorios DeepMind, registrar materialidad/duplicados y descartar con justificación.

- [x] **H-GOOGLE-SEP14-BIGQUERY** (P0, done): BigQuery anuncia seis funciones de análisis aumentado para agentes. Verificar fuentes originales, fecha, claims y publicar Reporter V2 profundo con evidencias..
- [ ] **H-GOOGLE-SEP09-MAPL** (P0, queued): Google y NASA/JPL: MAPL-EMIT detecta emisiones de metano. Verificar fuentes originales, fecha, claims y publicar Reporter V2 profundo con evidencias..
### P06 — 15–21 septiembre: reconstrucción Reporter V2 (queued)

**Criterio de cierre:** Siete días revisados con documentación, artículos V2 y cierre verificable

- [ ] **H-1521-GATE** (P0, queued): Reconstruir 15–21 septiembre.
  - Aceptación: Siete fechas complete/reviewed-no-material-news con evidencia y Reporter V2

### P07 — 22–30 septiembre: reconstrucción y legacy (queued)

**Criterio de cierre:** Nueve fechas cerradas con fuentes y piezas antiguas enriquecidas

- [ ] **H-2230-GATE** (P0, queued): Reconstruir 22–30 septiembre.
  - Aceptación: Nueve fechas cerradas y artículos previos enriquecidos

### P08 — Octubre hasta la fecha y Newsroom continua (queued)

**Criterio de cierre:** Octubre al día, fechas sin huecos y publicación horaria realmente operativa

- [ ] **H-OCT-GATE** (P0, queued): Completar 1 octubre hasta fecha actual.
  - Aceptación: Jornadas reales cerradas, sin inventar noticias ni fechas futuras
- [ ] **OPS-NEWSROOM** (P0, queued): Probar publicación desatendida de Scheduled Task.
  - Aceptación: Demostrar commit horario autónomo o documentar aprobación pendiente
- [ ] **OPS-DAYCONTINUITY** (P1, queued): Cerrar huecos de ledger en días nuevos sin noticias.
  - Aceptación: Calendario al día incluso cuando la tarea horaria hace no-op

### P09 — Enriquecimiento de legacy y Visual Desk (queued)

**Criterio de cierre:** 48 piezas legacy ampliadas o excepcionadas y arte editorial con QA

- [ ] **ED-LEGACY48** (P0, queued): Enriquecer 48 artículos legacy.
  - Aceptación: V2 verificado sin relleno, id/eventKey estables y fuentes
- [ ] **VIS-PREMIUM** (P1, queued): Crear lote visual periódico de grabados específicos.
  - Aceptación: Disminuir el fallback repetido, resolver P0 de imagen y mantener créditos
- [ ] **VIS-GENERATION** (P1, queued): Explorar generación automática por noticia con QA.
  - Aceptación: Pipeline de imágenes, permisos y costes probados antes de activar

### P10 — Segunda auditoría y lanzamiento v1.0 (queued)

**Criterio de cierre:** Cobertura inversa, fuentes, fechas, diseño, SEO, accesibilidad, CI y automatización revisados

- [ ] **QA-REVERSE** (P0, queued): Segunda pasada por empresa/tema y replay 1–7 Sep.
  - Aceptación: No omisiones materiales conocidas; fechas, rumores y claims auditados
- [ ] **QA-WEB** (P1, queued): QA UX, móvil, SEO social, RSS, accesibilidad.
  - Aceptación: Browser QA y enlaces/previews comprobados
- [ ] **QA-LAUNCH** (P0, blocked): Aprobar lanzamiento Gazette v1.0.
  - Aceptación: Gates P05–P10 con evidencias y excepciones explícitas

## Regla de cola

Registrar todo descubrimiento nuevo en el JSON con identificador estable, fuente, estado, prioridad, responsable y aceptación. No eliminar pendientes ni marcar días completos por tener un titular. Las tareas no se cierran sin evidencia; las descartadas mantienen explicación.

## Resumen de gestión

- Fases restantes: 6
- Tareas en la cola: 25
- Terminadas: 6
- En curso: 2
- Pendientes o bloqueadas: 16
- Descartadas con motivo: 1
