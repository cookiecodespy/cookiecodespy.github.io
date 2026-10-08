# AI Race Gazette — coordinación entre chats y automatización

Fecha: 2026-10-07.

## Objetivo

Evitar que el chat de actualización viva, el chat de reconstrucción histórica y cualquier tarea programada se pisen entre sí al escribir en GitHub.

## Carriles de trabajo

### 1. Automation & Newsroom
Responsable de:
- noticias recientes;
- ventana móvil de al menos 48 horas;
- correcciones y cambios materiales de disponibilidad;
- RSS;
- incidencias de la tarea horaria.

No debe hacer reconstrucción histórica masiva ni rediseños.

### 2. Historical Backfill
Responsable de:
- completar 2026-09-01 → 2026-10-07 por bloques;
- verificar fuentes y fechas históricas;
- actualizar `history-coverage.json`;
- añadir noticias históricas reales faltantes.

No debe modificar layout, CSS o bundle.

### 3. Arquitectura / QA
Responsable de:
- reglas de coordinación;
- validaciones;
- integridad del esquema;
- rendimiento, SEO y calidad general;
- cambios de código deliberados fuera del ciclo editorial rutinario.

### 4. Visual Desk
Responsable de:
- asset manifest;
- cola de ilustraciones;
- generación/selección y QA del arte;
- créditos y alt text;
- sustitución de fallbacks por arte específico.

Visual Desk no cambia hechos, fuentes, ids o eventKeys. Antes de actualizar un artículo para sustituir su imagen, vuelve a leer `main` y modifica únicamente los campos visuales necesarios.

## Protocolo de escritura segura

Toda operación que vaya a modificar `news.json` debe:

1. Leer la versión más reciente de `main` justo antes de preparar el cambio.
2. Construir el cambio como un merge sobre esa versión, nunca sobre una copia antigua del archivo.
3. Deduplicar por `id` y `eventKey`.
4. Preservar todos los artículos que ya existan en `main`.
5. Si otro proceso cambió `main` antes del commit, volver a leer, reconciliar y reintentar. No forzar una sobrescritura.
6. Si dos procesos modifican el mismo `eventKey` de manera incompatible, abortar esa publicación concreta y reportar el conflicto.
7. Mantener los dos JSON idénticos y los dos RSS idénticos después de cada publicación.

## Separación temporal

- Automation & Newsroom prioriza actualidad y las últimas 48 horas.
- Historical Backfill trabaja el archivo anterior al presente y no debe reinterpretar noticias recientes que ya estén siendo manejadas por Newsroom salvo para corregir evidencia histórica.
- Una noticia descubierta durante el backfill con fecha reciente debe deduplicarse contra `main` antes de publicarse.

## Regla de no sobrescritura

Nunca reemplazar `data/news.json` usando una copia tomada al inicio de una investigación larga sin volver a consultar `main`.

Esto es especialmente importante porque el backfill puede durar bastante mientras la tarea horaria publica novedades nuevas.

## Estado de una fecha histórica

- `pending`: todavía no revisada suficientemente.
- `partial`: existen artículos verificados pero no hay evidencia de cobertura exhaustiva.
- `complete`: el bloque y las fuentes relevantes fueron revisados y existe evidencia suficiente para considerar la jornada cubierta.
- `reviewed-no-material-news`: día revisado con evidencia suficiente y sin novedades materiales encontradas.

No marcar `complete` únicamente porque exista al menos una noticia.
