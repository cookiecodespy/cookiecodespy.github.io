# AI Race Gazette — roadmap operativo

Fecha de corte: 2026-10-07.

## Estado general

### Terminado
- Frontend Article V2 implementado: lectura rápida, secciones, detalles técnicos, precio/disponibilidad, cronología, consejos, datos útiles, curiosidades, limitaciones, análisis editorial, resumen final y fuentes; conserva fallback legacy.
- CI de Gazette con tests Node/Python, validación editorial, build, Sites tests y Browser QA responsive.
- Ledger `dailyCoverage` expuesto en el JSON público para distinguir días completos, parciales, pendientes o revisados sin novedades.
- Metadatos SEO/OpenGraph/Twitter genéricos y metadatos dinámicos en navegación cliente.
- Estándar editorial/producto v1.0, esquema Article V2, política visual y runbook de automatización documentados.
- Sitio público en GitHub Pages.
- Home con vista portadas y vista lista.
- Búsqueda y filtros combinables por compañía, tema, mes y día.
- Artículos individuales existentes con contexto, puntos clave, análisis y fuente oficial; migración a Reporter V2 pendiente.
- RSS público.
- Datos editoriales desacoplados del frontend mediante `data/news.json`.
- Filtros de compañías generados dinámicamente desde `article.company`.
- Soporte para nuevas compañías sin tocar React ni hardcodear categorías.
- Política editorial, modelo de contenido y validación de ids/eventKey.
- Automatización de ChatGPT + GitHub configurada para revisar novedades cada hora.
- La automatización rutinaria no debe invocar Codex, Work ni una API de pago.
- Protocolo de coordinación para evitar sobrescrituras entre Newsroom y Historical Backfill.
- Reconstrucción histórica 1–7 septiembre auditada, deduplicada y marcada como completa con evidencia en `docs/history-audit-2026-09-01-07.md`.

### Funcionando parcialmente
- Archivo histórico desde 2026-09-01.
- Hay noticias verificadas en varias fechas, pero la cobertura todavía es parcial.
- Algunas fechas de la maqueta antigua solo son pistas de investigación y no pueden publicarse sin volver a verificarlas.

### Falta
- Completar la cobertura real y verificable del 8–30 de septiembre de 2026.
- Completar el tramo 1–7 de octubre de 2026 y continuar día a día.
- Segunda pasada de auditoría para detectar omisiones, duplicados y fechas incorrectas.
- Migrar las piezas legacy existentes a Reporter V2; el frontend Article V2 ya está desplegado.
- Pulido visual/editorial final antes de declarar la versión 1.0.
- Revisar metadatos sociales/SEO y presentación al compartir enlaces.
- Resolver o diseñar un flujo explícito de aprobación para escrituras GitHub rechazadas durante Scheduled Tasks.

## Qué estamos haciendo ahora

Operación en dos carriles:

### A. Actualización viva
La tarea programada revisa cada hora noticias nuevas y solo publica cuando existe una novedad material o una corrección real. Si no hay nada nuevo, no crea commits ni altera `updatedAt`.

La cobertura no se limita a las grandes compañías. Debe descubrir actores emergentes de modelos, chips, agentes, voz, robótica, infraestructura, investigación, herramientas y open source.

### B. Reconstrucción histórica
El histórico no se debe completar automáticamente rellenando huecos. Se hará mediante investigaciones profundas por bloques, con fuentes verificadas.

Ambos carriles siguen `docs/coordination.md` para que una investigación larga no sobrescriba noticias añadidas mientras tanto.

## Plan de reconstrucción histórica

Trabajar por lotes para mantener calidad y trazabilidad:

1. 1–7 septiembre
2. 8–14 septiembre
3. 15–21 septiembre
4. 22–30 septiembre
5. 1 octubre–hoy

Para cada bloque:
- revisar fuentes oficiales de las compañías principales;
- hacer discovery de startups y actores emergentes;
- buscar anuncios técnicos, modelos, productos, APIs, chips, agentes, infraestructura, financiación material y open source;
- separar hechos confirmados de reportes/rumores;
- verificar fecha original del anuncio;
- deduplicar contra `eventKey` existentes;
- redactar artículos individuales;
- actualizar `history-coverage.json`;
- publicar solo después de una segunda revisión.

Una fecha no se marca como completa solo porque tenga artículos. Debe existir evidencia de que el período y las fuentes relevantes fueron revisados.

## Criterio para versión 1.0

La v1.0 se considera lista cuando:
- la experiencia móvil y desktop no tiene errores de navegación visibles;
- portadas, filtros, artículos y RSS funcionan;
- el histórico solicitado está auditado;
- las fuentes oficiales abren correctamente;
- no hay contenido ficticio heredado de la maqueta;
- la automatización puede añadir compañías nuevas sin cambios de frontend;
- la tarea horaria no genera commits vacíos;
- no existen sobrescrituras entre flujos concurrentes;
- el diseño se mantiene protegido de cambios editoriales rutinarios.

## Después del backfill

Backlog, no requisito de la v1.0:
- radar interno de compañías emergentes;
- mejores imágenes editoriales específicas por compañía;
- ranking/indicadores de actividad por empresa;
- digest diario/semanal derivado del mismo archivo;
- automatización de previews sociales.

## Próximo paso inmediato

Antes de ampliar agresivamente el backfill, usar Reporter V2 para no crear más deuda editorial. **Historical Backfill** continúa con 8–14 de septiembre pero debe enriquecer los artículos heredados del bloque que audita. **Automation & Newsroom** continúa en paralelo con actualidad usando Reporter V2 desde el nacimiento.

No mezclar rediseños grandes con actualizaciones automáticas de noticias.
