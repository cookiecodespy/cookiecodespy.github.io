# Incidencia Newsroom: publicación huérfana por rama divergente

**Fecha:** 2026-10-08. **Tipo:** incidencia operativa de publicación automatizada, resuelta manualmente mediante PR de reconciliación; automatización autónoma end-to-end **no** certificada.

## Evidencia observada

- Commit `87d682f62efaea4a46a968f9eae8d9cba7f542b1`, `gazette: publish Upscale AI Token Fabric Reporter V2 (2026-10-08)`, fue creado por la tarea horaria y contiene una noticia y los espejos JSON/RSS/coverage.
- Al inspeccionarlo, `main` no incluía el `eventKey` `upscale-ai-token-fabric-heterogeneous-network-2026-10-08`. Comparación GitHub: historial `diverged` (commit huérfano no integrado).
- Fuente primaria https://upscale.com/blogs/upscale-introduces-token-fabric-the-industrys-most-comprehensive-standards-based-networking-portfolio-for-ai-factories , fechado el 8 oct; detalle de anuncio: SkyFabriX 115,2 Tbps anunciados, SkyOS, SkyCMD y Spectrum-X. Acceso temprano actual, disponibilidad general prevista inicio de 2027. Reuters: https://www.reuters.com/business/nvidia-backed-upscale-ai-launches-platform-connect-chips-rival-suppliers-2026-10-08/
- La versión recuperada mantiene `id`, `eventKey` y reportaje Reporter V2 (~1.296 palabras seccionales) del commit original; el `source` pasa al comunicado oficial específico en vez de una nota distribuida. No se hace cherry-pick del JSON antiguo, que sobrescribiría nuevas noticias históricas de `main`.

## Procedimiento de recuperación

1. Revisar **main** y deduplicar por `eventKey`; abortar si el evento ya fue publicado.
2. Trasplantar solo el artículo validado sobre el último dataset de main y conservar las noticias posteriores.
3. Actualizar espejos JSON y RSS, conteos públicos e históricos, y extender el audit ledger del 7 al 8 octubre.
4. Exigir pruebas de PR (consistencia, estructura, RSS, esquema) antes de merge. Después verificar commit y cola visual.

## Riesgo abierto y criterio de cierre

La tarea horaria se ejecuta, pero no queda demostrado que pueda publicar de forma **desatendida** sobre `main`. Investigar si el conector GitHub escribe en SHA desactualizado, si existen aprobaciones pendientes y cómo expone errores de conflicto. No editar ni relajar su mandato de no-op; no desactivar la tarea por un fallo de publicación.

Para cerrar el incidente de automatización: ejecutar al menos una publicación real en `main` desde tarea horaria sin ayuda, verificar espejos y web, además de una corrida no-op, prueba de colisión y recuperación/rollback. La recuperación manual de este commit no cumple esa puerta.
