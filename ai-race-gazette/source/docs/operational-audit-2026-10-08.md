# Auditoría operativa de AI Race Gazette — 8 de octubre 2026

## Alcance y principio
Revisión del estado real de GitHub, integridad técnica, procesos horarios y reconstrucción histórica. No se confunde éxito de CI con exhaustividad de noticias.

## Evidencia comprobada
- Al inicio de esta pasada: 71 artículos, 24 Reporter V2, 47 legacy; 38 jornadas documentadas (20 parciales, 18 pendientes), ninguna cerrada bajo la última auditoría. Los conteos históricos deben actualizarse desde el archivo, no de este informe.
- 54 tareas en backlog al iniciar, 14 completadas con evidencia, tres en curso, dos bloqueadas y una descartada.
- La automatización horaria AI Race Gazette Newsroom está habilitada; la automatización anterior para Gazette permanece deshabilitada.
- Workflow Build AI Race Gazette tuvo éxito para el commit inicial observado. Posteriormente se añadieron workflows de validación de contenido, sincronización visual y smoke público, así como protección de build obsoleto.
- El 11 de septiembre se publicó GPT-Rosalind como cambio de disponibilidad mediante el artículo `openai-gpt-rosalind-trusted-access-global-2026-09-11`. Fuente oficial: https://openai.com/index/introducing-gpt-rosalind/.
- El próximo candidato oficial a investigar y publicar es retiro planificado de custom GPTs y migración a plugins: https://help.openai.com/en/articles/6825453-chatgpt-release-notes. No inferir fecha universal de retirada.
- Google AI plans 9 Sep debe comprobarse contra anuncios originales de sus funciones; no publicar un resumen de novedades antiguas como un evento artificial.

## Brechas que bloquean v1.0
1. Ningún día actual está cerrado con el estándar Backbone completo; se exige investigación de fuentes, discovery abierto y segunda pasada por jornada.
2. Persisten artículos legacy sin la profundidad Reporter V2.
3. Solo una ilustración es específica por historia; el resto se apoya principalmente en cuatro imágenes reutilizadas, con briefs/cola separada.
4. La publicación autónoma desde Scheduled Task debe demostrarse mediante una corrida real con escritura exitosa; enabled por sí solo no significa publicación garantizada.
5. La experiencia social/SEO por artículo, visual desktop/mobile y recuperación de errores deben superar un gate final de QA; una SPA con hash routes puede limitar previews específicos en plataformas externas.

## Ruta priorizada
Fase P05: completar 8–14 Sep incluyendo oportunidades de OpenAI, Google/DeepMind y emergentes; no cerrar sin fuente primaria y audit trail.
Fases P06–P08: completar del 15 Sep al 8 Oct con auditorías de fecha.
Fase P09: enriquecer legacy y ampliar arte específico sin inventar imágenes documentales.
Fase P10: segunda pasada independiente por actores/categorías, revisión de enlaces, permisos, seguridad, smoke público, accesibilidad y lanzamiento v1.0.

## Protocolo
Cada hallazgo nuevo se agrega a `source/ops/backlog.json` y se refleja mediante regeneración determinista del checklist. Un commit de backfill debe preservar artículos concurrentes de Newsroom y mantener espejos JSON/RSS/calendario. Nunca declarar cierre por apariencia visual o porque haya un titular en una fecha.
