# AI Race Gazette — Auditoría y recuperación tras interrupción

**Fecha:** 8 de octubre de 2026. **Ámbito:** `ai-race-gazette/` y sus workflows específicos.
**Método:** inspección de `main` y GitHub Actions, sin confiar en mensajes de chat incompletos.

## 1. Estado hallado al recuperar el trabajo

- `main`: `76dbf05860afd81cc03706ca228e6a72c4fa82f4`.
- Archivo: 71 noticias, 24 Reporter V2, 47 artículos legacy, 25 compañías.
- 38 días registrados (1 sep–8 oct): 0 complete, 20 partial y 18 pending.
- 5 ilustraciones registradas; 1 específico por noticia. `hero.webp` usado en 46 artículos.
- Visual queue: 71 de 71 historias. Dos JSON espejo idénticos y dos RSS idénticos.
- Newsroom horaria activa; antigua tarea Gazette deshabilitada.
- `main` contenía las noticias y commits de la pasada interrumpida, incluido Habitat y MAPL‑EMIT. No se perdieron esos cambios.

## 2. Cambios efectivamente introducidos en la recuperación

1. Generador determinista de `docs/master-checklist.md` a partir de `ops/backlog.json`. CI valida coincidencia exacta, en lugar de solo buscar IDs.
2. Corrección y cinco pruebas de `scripts/refresh_visual_queue.py`, preservando `completedAt`, `completedAssetId`, `producedBy` y notas de revisión, distinguiendo arte aprobado de fallback.
3. Workflow `Sync AI Race Gazette Visual Queue`: actualización al cambiar noticias, lectura de último `main`, tres reintentos seguros ante colisión, validación estricta, no commits si no hay cambios. Ejecutó un sync real de 71 historias en commit `ae56c124`.
4. Corrección de `scripts/live-qa.mjs`: elimina expectativas fijas de 15 noticias; verifica web publicada, JSON, RSS, portada, noticia, créditos/fuente, imagen real y responsive móvil.
5. Workflow de smoke público diario y bajo petición. Primer run verde, con evidencia de escritorio/móvil.
6. Comprobación de que no se publique un bundle de frontend compilado contra una versión anterior si los inputs cambian durante CI.
7. Validación RSS más estricta: compara título, resumen, enlace de fuente y fecha de cada artículo con el JSON; cuatro pruebas negativas/positivas.
8. Procedimiento de recuperación de chat interrumpido en `docs/recovery-after-interruption.md`, integrado a `AGENTS.md` y coordinación.

## 3. Evidencia CI / despliegue

- Checklist, frontend, pruebas de datos y compilación: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798281532 — success.
- Sitio público real, Chromium escritorio/móvil, JSON/RSS: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798281530 — success.
- RSS semántico y validación editorial: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798463907 — success.
- Sincronización real de Visual Desk: https://github.com/cookiecodespy/cookiecodespy.github.io/actions/runs/37798603043 — success.

## 4. Bloqueadores que siguen abiertos

**Editorial — P0:** ningún día tiene todavía evidencia completa de cierre Backbone v1. No debemos llamar completo a septiembre ni a octubre. Hay 18 días `pending` y 20 `partial`. La fase 5, del 8 al 14 de septiembre, sigue abierta, especialmente DeepMind, 12/13, investigación inversa y candidatos no resueltos.

**Profundidad — P0:** 47 artículos legacy requieren ampliación Reporter V2 basada en fuentes; no inventar texto para inflar longitud.

**Visual — P0/P1:** solo una imagen específica y el mismo hero en 46 historias. Se requieren arte de grabado original por titular y QA de créditos/uso.

**Automatización — P0:** el run de Visual Sync funcionó, pero falta observar su disparo por una noticia horaria nueva. No se ha demostrado todavía el flujo completo de publicaciones desatendidas Newsroom, tres corridas sucesivas, colisión entre dos escritores ni ejercicio real de rollback.

**Producto — P1:** previews sociales por artículo, SEO específico, revisión manual de accesibilidad, contraste/performance y más pruebas de navegador. El smoke actual confirma funcionamiento básico, no una auditoría WCAG completa.

## 5. Decisión de trabajo

La fase siguiente sigue siendo P05. Priorizar artículos reales y auditoría con fuentes (8–14 sep), luego P06, P07, P08, P09 y P10. El checklist es un gate de salida; nunca cerrar por estética o cantidad de commits. Los nuevos hallazgos deben quedar en `ops/backlog.json` con estado, prioridad, evidencia y criterio de aceptación.

## 6. Protocolo de seguimiento

Al reanudar, leer `main`/CI/backlog primero. No repetir commits ya realizados. Separar resultados efectivamente desplegados de mejoras instaladas sin ejecución comprobada. Cada cierre incluye HEAD, estado de archivos, tests, auditoría de fuentes y tareas nuevas o reprogramadas.
