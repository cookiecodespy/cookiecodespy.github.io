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
