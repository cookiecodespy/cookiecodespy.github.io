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
