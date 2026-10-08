# Chat dedicado del Project — handoff

Nombre sugerido del chat:
**AI Race Gazette — Automation & Newsroom**

## Objetivo

Operar y mejorar la automatización que mantiene AI Race Gazette al día sin usar Codex, Work ni una API de pago durante las actualizaciones editoriales rutinarias.

## Fuente de verdad

Repositorio:
`cookiecodespy/cookiecodespy.github.io`

Carpeta:
`ai-race-gazette/`

Leer antes de actuar:
- `source/docs/gazette-v1-standard.md`
- `source/docs/article-v2-schema.md`
- `source/docs/image-policy.md`
- `source/docs/visual-desk.md`
- `source/visual/asset-manifest.json`
- `source/docs/automation-operations.md`
- `source/AGENTS.md`
- `source/docs/editorial-policy.md`
- `source/docs/content-model.md`
- `source/docs/scheduled-task.md`
- `source/docs/roadmap.md`
- `data/news.json`

## Estado de la automatización

La tarea de ChatGPT está configurada para revisar el ecosistema cada hora.

Regla central:
**si no hay una novedad material y verificable, no hacer commit y no tocar updatedAt.**

La tarea puede descubrir compañías nuevas. El frontend genera sus filtros automáticamente desde `article.company`.

## Qué sí puede hacer automáticamente

- investigar novedades recientes;
- verificar fuentes;
- añadir artículos;
- corregir artículos existentes;
- añadir nuevas compañías mediante datos;
- actualizar RSS;
- mantener sincronizados publicado y espejo;
- actualizar cobertura histórica cuando una investigación específica lo justifique.

## Qué no debe hacer automáticamente

- rediseñar la web;
- modificar CSS/React por una noticia;
- hardcodear compañías;
- borrar histórico;
- inventar contenido para llenar fechas;
- publicar rumores como hechos;
- usar Codex, Work o una API de pago como parte del ciclo normal.

## Trabajo histórico

Crear un segundo chat del Project:
**AI Race Gazette — Historical Backfill**

Usarlo para investigaciones profundas en cinco lotes:
1. 1–7 septiembre
2. 8–14 septiembre
3. 15–21 septiembre
4. 22–30 septiembre
5. 1 octubre–hoy

Cada lote debe terminar con revisión, deduplicación, actualización de `history-coverage.json` y publicación.


## Profundidad editorial

Leer también `source/docs/article-depth.md`. Las páginas internas deben funcionar como artículos/informes completos, no como briefings extendidos. Automation & Newsroom debe publicar piezas suficientemente desarrolladas, y Historical Backfill debe enriquecer artículos existentes demasiado breves al revisar cada bloque histórico.


## Reporter V2

Reporter V2 es el estándar de publicación desde el 7 de octubre de 2026. Las noticias nuevas no deben recrear el formato breve legacy. La automatización debe respetar el núcleo obligatorio de `article-v2-schema.md`.

Si una escritura automática es bloqueada por aprobación/seguridad, seguir `automation-operations.md` y devolver un paquete de publicación pendiente en vez de reintentar en bucle.


## Visual Desk

El sistema visual es un carril separado del ciclo horario:
- manifest: `source/visual/asset-manifest.json`;
- cola: `source/visual/image-queue.json`;
- política/flujo: `source/docs/visual-desk.md`.

Newsroom puede usar únicamente assets registrados y puede dejar `imageBrief` + `needs-specific-art`, pero no modifica assets durante el run horario.

Historical Backfill añade briefs cuando corresponda; la producción de arte específico se hace fuera de esos dos carriles.

## Actualización posterior a recuperación — 8 oct 2026

Si se reanuda el proyecto tras un fallo del chat, **NO** repetir las publicaciones de la conversación. Primero leer `source/docs/recovery-after-interruption.md`, `source/docs/audit-recovery-2026-10-08.md`, `source/ops/backlog.json` y `source/docs/master-checklist.md`; verificar `main` y workflows.

**Estado auditado:** 71 artículos (24 Reporter V2, 47 legacy) de 25 compañías; 38 jornadas registradas, 0 cerradas con Backbone v1 (20 parciales y 18 pendientes), 5 assets, 1 hero específico, cola visual 71/71. El hero genérico aparece en 46 artículos. La cifra es instantánea: consultar GitHub para el estado vivo.

**Automatización:** una sola Scheduled Task Gazette por hora, original antigua deshabilitada. Separadamente, GitHub Actions valida contenidos, compila/frontend, sincroniza la cola de Visual Desk al modificarse noticias y ejecuta smoke diario del sitio público. Los workflows GitHub no son Scheduled Tasks adicionales de ChatGPT.

**Tests confirmados:** compilación y pruebas https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798281532; smoke Chromium web pública/móvil https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798281530; validador semántico RSS https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798463907; sincronización real Visual Desk https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798603043.

**Pendiente:** reauditoría profunda por fecha (P05–P08), migración 47 legacy y biblioteca visual (P09), publicación desatendida Newsroom y pruebas de colisión/rollback, SEO social/UX/accesibilidad, verificación final (P10). No declarar septiembre completo ni Gazette v1.0.


## Checkpoint editorial posterior — 8 oct 2026, segundo chat

**Nuevo punto de continuidad:** trabajar desde `main`; comprobar datos antes de abrir ramas o repetir noticias. Las cifras previas de este documento son fotografías históricas, no el estado vivo.

**Estado verificado tras PR #2 y PR #3:** 74 artículos, 27 Reporter V2, 47 legacy, 38 jornadas (20 partial, 18 pending, 0 completas según Backbone v1); ambos JSON idénticos, ambos RSS idénticos con 74 items y orden cronológico inverso, 0 IDs/eventKeys duplicados, 74 entradas en cola visual sincronizada. El 10 de septiembre contiene 5 noticias, sigue `partial` a falta de segunda auditoría.

**Publicaciones de esta continuación:**
- Agents API, anuncio y beta pública del 10 Sep; fuente https://openai.com/index/introducing-the-agents-api/ ; merge `8ad0b7107e6c05807b290eebc70a45685d73d44a`, PR https://github.com/cookiecodespy/cookiecodespy.github.io/pull/2 .
- NASA–IBM Lunar Foundation Model, pesos/código abiertos anunciados el 10 Sep (paper subido el 8): https://science.nasa.gov/science-research/artificial-intelligence-lunar-foundation-model/ ; merge `b4c80ed1a2e9416c51f53a718965a19a47fbfd30`, PR https://github.com/cookiecodespy/cookiecodespy.github.io/pull/3 . No equiparar prospectividad de hielo con detección física.
- PR #3 agregó test de regresión que exige RSS ordenado según fecha e ID; evita que un backfill histórico aparezca antes de las noticias recientes.
- CI previo a fusión: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37801874068 y https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37805538700, ambos success. La condición de publicación desatendida por Scheduled Task aún no se ha demostrado end-to-end.

**Siguiente gate:** terminar H-SEP12-13, H-0814-GOOGLE, H-0814-SOURCES; segunda pasada por compañías y categorías, resolver candidatos, documentar descartes y después cerrar P05. Luego P06–P07 (resto de septiembre), P08 (octubre + ejecución horaria real), P09 (legacy+Visual Desk), P10 (QA/SEO/accesibilidad/v1.0). No prometer fechas fijas ni declarar completo sin evidencia.

**Riesgo automatización:** un commit autónomo independiente `87d682f62efaea4a46a968f9eae8d9cba7f542b1` con historia Upscale AI Token Fabric sigue divergente respecto a `main` (no confundir commit preparado con artículo publicado); investigar reconciliación/contenido y probar al menos una ejecución horaria que publique en `main` sin interacción.

## Ronda adicional fase 5 — 8 octubre 2026 (13 septiembre)

- Historial real verificado con fuente primaria: `https://huggingface.co/internlm/Intern-S2-397B`, `https://huggingface.co/internlm/Intern-S2-397B/commits/main` y `https://github.com/InternLM/Intern-S1`. La noticia registra disponibilidad de **pesos del checkpoint completo el 13 Sep**, no la preview de la familia.
- Reporter V2 publicado con 1.343 palabras de secciones en `internlm-intern-s2-397b-open-weights-2026-09-13`; PR #4 https://github.com/cookiecodespy/cookiecodespy.github.io/pull/4 ; merge `24f43300323f677e8cd979a4c8a1e0072532f462`.
- Evidencia de candidatos mal fechados y de la primera auditoría del 12–13: `source/docs/evidence-2026-09-12-13-round2.md`. No trasladar anuncios de 7, 9, 10, 11 septiembre o 1 octubre al 12/13 por notas secundarias. Iris-mini/pro sigue candidato pendiente de verificar primera fecha de pesos.
- Validación de PR #4: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37807910802 — success.
- Estado al merge: **75 noticias, 28 Reporter V2, 47 legacy**. 38 fechas: 21 partial, 17 pending, **0 jornadas cerradas**. El 13 Sep tiene 1 noticia y queda partial; el 12 Sep sigue pending.
- Al cerrar ronda, comprobar que Visual Desk actualice la cola del nuevo artículo (puede tardar en reflejarse después del merge) y no confundir sync de imágenes con automatización horaria autónoma.
- **Automation:** una sola tarea horaria AI Race Gazette Newsroom habilitada. La prueba de una publicación 100 % autónoma en main continúa pendiente; un commit divergente de Upscale AI Token Fabric necesita reconciliación segura. No declarar automatización end-to-end hasta observar publicación desatendida, 3 corridas, colisión y rollback.
- **Siguiente prioridad:** reabrir 12 Sep por fuente/categoría, verificar primer release de pesos AllSpark Iris del 13, completar Google/DeepMind 8–14 y pasar auditoría inversa de todo P05. Seguir con P06 15–21, P07 22–30, P08 octubre/automation, P09 legacy/visual, P10 QA/v1.0. Las cifras son snapshot; siempre releer main.

## Nueva ronda P05 + rescate Newsroom — 8 octubre 2026

**Estado observado de `main` tras PR #5 y #6:** **78 artículos, 31 Reporter V2 y 47 legacy**; 38 fechas desde 1 Sep a 8 Oct (21 `partial`, 17 `pending`, ninguna certificada como `complete`). Espejos JSON/RSS exactos, 78 RSS items, sin `id`/`eventKey` duplicados, `history-coverage` sincronizado y 78/78 entradas Visual Desk actualizadas. La cobertura auditada se amplió a Oct 8 mediante row propia; no implica segunda pasada ni cierre del día.

**Artículos integrados en esta ronda:**

- 9 Sep — **Cohere North Small Translate 1.0**, modelo de traducción MoE 218B/25B, acceso API limitado gratuito y pesos de uso **no comercial**; changelog original Sep 9, blog extendido Sep 10. Reporter V2 (1.040 palabras de secciones): `cohere-north-small-translate-open-weights-2026-09-09`.
- 10 Sep — **Cognition SWE-2**, refuerzo para agentes de programación y disponibilidad inicial en Devin Desktop/CLI, benchmarks atribuidos y límites de Terminal-Bench 4: `cognition-swe-2-coding-agent-model-2026-09-10`, Reporter V2 (1.207 palabras de secciones).
- 8 Oct — **Upscale Token Fabric**, rescatado del commit autónomo divergente `87d682f62efaea4a46a968f9eae8d9cba7f542b1` sin arrastrar su JSON/RSS antiguos sobre main: `upscale-ai-token-fabric-2026`, Reporter V2 (~1.296 palabras seccionales). Fuente oficial original del 8 Oct; **early access** actual y GA solo prevista a inicios 2027.

**PR y evidencias:**

- https://github.com/cookiecodespy/cookiecodespy.github.io/pull/5 (merge `dcf9c0f04e09b55fd52985720e542c0cf8031181`), validación GitHub Actions `37808999244` **success**. Fuentes en `source/docs/evidence-cohere-cognition-2026-09-09-10.md`.
- https://github.com/cookiecodespy/cookiecodespy.github.io/pull/6 (merge `9c8ddfa5205363917a03cfaf4d81cb3c47f7607b`), validación GitHub Actions `37809437922` **success**. Incidencia en `source/docs/newsroom-divergent-commit-2026-10-08.md`.

**Estado real automatización:** rescatar manualmente un commit de Newsroom **no** equivale a publicación autónoma certificada. La tarea horaria queda activada; falta comprobar una publicación desatendida `main`, un no-op real, colisión/control de SHA, alerta de aprobación y rollback. Mantener solo una tarea de Gazette.

**Siguiente ronda:** bloque de origen Sep 12 sigue `pending`, Sep 13 `partial`; el historial oficial Hugging Face Iris-mini muestra commit `Iris release` de 2 Sep, aunque notas secundarias dicen 13 Sep. No inventar fecha de lanzamiento hasta verificar qué se liberó cuándo. Resolver primero Google/DeepMind 8–14 y actores emergentes, registrar segunda pasada de P05, después P06 15–21, P07 22–30, P08 1–8 Oct y automatización, P09 47 legacy/arte, P10 auditoría total y v1.0.

**Plazos:** no anunciar fecha cerrada hasta inventariar eventos faltantes y superar gates. La única definición válida de septiembre completo es treinta fechas auditadas con segundo barrido, publicación de novedades materiales y evidencia de omisiones/descartes. Se conserva contenido significativo de octubre hasta fecha de corte pero tampoco tiene cierre exhaustivo.
