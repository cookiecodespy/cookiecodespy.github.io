# AI Race Gazette — checklist maestro de cierre

**Apertura:** 8 de octubre de 2026. **Cola persistente:** `../ops/backlog.json`.

Este documento resume los gates de cierre; el JSON guarda cada pendiente con ID único, prioridad, fase, dueño, evidencia y criterio de aceptación. **Cualquier descubrimiento posterior se añade a esa cola**. No eliminar tareas ni afirmar `done` sin commit/prueba/fuente. No cerrar fechas sin doble revisión. La tarea horaria solo lee este tablero; Historical Backfill y Product/QA gestionan los pendientes.

## Estado inicial (instantánea, no contador en vivo)

- 53 artículos: 5 Reporter V2 y 48 legacy.
- 37 fechas registradas de 1 Sep a 7 Oct; 7 cerradas y 30 por cerrar.
- 5 imágenes registradas; una imagen específica publicada.
- Newsroom horaria habilitada; publicación desatendida todavía requiere demostración.

## Fases restantes

### 5. 8–14 septiembre: reconstrucción Reporter V2 — EN CURSO
**Gate:** Cada fecha auditada por fuentes + categorías + segunda pasada y artículos extensos

- [x] **H-SEP08-IMAGES25** (P0, done): ChatGPT Images 2.5: informe Reporter V2. V2, fuente primaria, mirrors, RSS y coverage.
- [ ] **H-SEP08-MISTRAL** (P0, queued): Mistral: ronda Serie D por €3.000 millones. Publicar V2 con términos atribuidos, fuentes oficiales y contexto competitivo.
- [ ] **H-SEP10-GPTLIVE** (P0, queued): OpenAI: GPT-Live-1 API y evaluación de voz. Publicar V2 técnico y precio/estado correctamente atribuidos.
- [ ] **H-SEP09-FORTRAN** (P1, queued): Investigar Mistral: agentes para Fortran. Evaluar materialidad, fecha y fuentes; publicar V2 o descartar con motivo.
- [ ] **H-SEP10-CLOUDERA** (P1, queued): Investigar alianza Mistral–Cloudera. Confirmar efectos técnicos y fecha, publicar V2 o descartar con motivo.
- [ ] **H-0814-SOURCES** (P0, in_progress): Barrido oficial, emergentes y categorías 8–14. Registro por día/fuente/sector, candidatos y descartes sin inventar métricas.
- [ ] **H-0814-GOOGLE** (P0, queued): Revisar Google/DeepMind día a día 8–14. Comprobar novedades relevantes, fechas y completar matriz.
- [ ] **H-SEP10-LEGACY** (P1, queued): Enriquecer Gemini para Windows. Conservar id/eventKey, recuperar fuentes y publicar informe Reporter V2.
- [ ] **H-0814-GATE** (P0, blocked): Cerrar estados 8–14 con doble auditoría. Todos los candidatos resueltos, evidencia de dos pasadas, cobertura y RSS consistentes.

### 6. 15–21 septiembre: reconstrucción Reporter V2 — PENDIENTE
**Gate:** Siete días revisados con documentación, artículos V2 y cierre verificable

- [ ] **H-1521-GATE** (P0, queued): Reconstruir 15–21 septiembre. Siete fechas complete/reviewed-no-material-news con evidencia y Reporter V2.

### 7. 22–30 septiembre: reconstrucción y legacy — PENDIENTE
**Gate:** Nueve fechas cerradas con fuentes y piezas antiguas enriquecidas

- [ ] **H-2230-GATE** (P0, queued): Reconstruir 22–30 septiembre. Nueve fechas cerradas y artículos previos enriquecidos.

### 8. Octubre hasta la fecha y Newsroom continua — PENDIENTE
**Gate:** Octubre al día, fechas sin huecos y publicación horaria realmente operativa

- [ ] **H-OCT-GATE** (P0, queued): Completar 1 octubre hasta fecha actual. Jornadas reales cerradas, sin inventar noticias ni fechas futuras.
- [ ] **OPS-NEWSROOM** (P0, queued): Probar publicación desatendida de Scheduled Task. Demostrar commit horario autónomo o documentar aprobación pendiente.
- [ ] **OPS-DAYCONTINUITY** (P1, queued): Cerrar huecos de ledger en días nuevos sin noticias. Calendario al día incluso cuando la tarea horaria hace no-op.

### 9. Enriquecimiento de legacy y Visual Desk — PENDIENTE
**Gate:** 48 piezas legacy ampliadas o excepcionadas y arte editorial con QA

- [ ] **ED-LEGACY48** (P0, queued): Enriquecer 48 artículos legacy. V2 verificado sin relleno, id/eventKey estables y fuentes.
- [ ] **VIS-PREMIUM** (P1, queued): Crear lote visual periódico de grabados específicos. Disminuir el fallback repetido, resolver P0 de imagen y mantener créditos.
- [ ] **VIS-GENERATION** (P1, queued): Explorar generación automática por noticia con QA. Pipeline de imágenes, permisos y costes probados antes de activar.

### 10. Segunda auditoría y lanzamiento v1.0 — PENDIENTE
**Gate:** Cobertura inversa, fuentes, fechas, diseño, SEO, accesibilidad, CI y automatización revisados

- [ ] **QA-REVERSE** (P0, queued): Segunda pasada por empresa/tema y replay 1–7 Sep. No omisiones materiales conocidas; fechas, rumores y claims auditados.
- [ ] **QA-WEB** (P1, queued): QA UX, móvil, SEO social, RSS, accesibilidad. Browser QA y enlaces/previews comprobados.
- [ ] **QA-LAUNCH** (P0, blocked): Aprobar lanzamiento Gazette v1.0. Gates P05–P10 con evidencias y excepciones explícitas.

## Protocolo obligatorio para la cola

1. Cada hallazgo nuevo usa un ID inmutable, fase, prioridad P0/P1/P2, lane, estado, aceptación y evidencia URL/commit.
2. Registrar primero los candidatos verificados como `queued`; publicar solo después de verificar fecha y relevancia. Las pistas no verificadas son tareas de investigación.
3. No duplicar tareas por el mismo evento/eventKey ni duplicar noticias en news.json.
4. Al publicar, refetch de main, reconciliar por id/eventKey y preservar Newsroom; actualizar mirrors y RSS juntos.
5. Solo marcar tareas `done` con evidenciaCommit/verificación equivalente; cancelación requiere motivo.
6. Una fecha `complete` exige revisión de fuentes + descubrimiento abierto + pasada inversa con evidencia auditada.
7. Informar en cada cierre: estado antes/después, commits, controles de CI, pendientes nuevos y siguiente gate.

## Nota de producto

No retrasar cobertura real por cambios cosméticos. Una edición por día significa un día revisado, no una noticia inventada por fecha. Reporter V2 y Visual Desk permanecen como estándares de publicación.
