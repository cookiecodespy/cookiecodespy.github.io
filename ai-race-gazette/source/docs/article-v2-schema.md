# AI Race Gazette — Article V2 schema

Article V2 amplía el esquema actual sin romper compatibilidad.

## Compatibilidad transitoria

Hasta desplegar el frontend V2, todo artículo conserva los campos legacy actuales además de los campos nuevos.

Campo recomendado:
- `articleVersion: 2`

## Núcleo obligatorio de Reporter V2

Cuando `articleVersion: 2` esté presente, la validación exige:
- al menos 500 palabras de contenido editorial total;
- `quickTakeaways` con al menos 3 puntos;
- `executiveSummary`;
- `finalSummary`;
- todos los campos legacy requeridos durante la migración.

Los demás campos V2 se usan cuando aportan valor y existe evidencia suficiente. No inventar curiosidades, consejos, comparaciones, precios o datos técnicos para completar una plantilla.

## Campos nuevos opcionales

### `quickTakeaways`
Array de 3–6 frases. “En 30 segundos”.

### `sections`
Array de objetos:
- `heading`: título de sección;
- `paragraphs`: array de párrafos;
- `kind`: opcional: `report`, `technical`, `context`, `competition`, `analysis`, `practical`.

No insertar HTML arbitrario.

### `technicalDetails`
Array de objetos `{label, value, note?}`.
Solo datos verificables o claims atribuidos.

### `availability`
Objeto opcional con texto estructurado:
- `status`;
- `platforms[]`;
- `regions[]`;
- `requirements[]`;
- `notes[]`.

### `pricing`
Array `{label, value, note?}`.
No inventar precios faltantes.

### `timeline`
Array `{date, label, description?}`.
Usar fechas comprobadas.

### `comparisons`
Array de objetos `{subject, comparison, basis, caveat?}`.
Nunca afirmar superioridad sin una base identificable.

### `limitations`
Array de límites, incertidumbres o información aún no comprobada.

### `practicalAdvice`
Consejos accionables para el lector. Deben derivarse de los hechos y estar claramente presentados como orientación editorial, no como garantías.

### `usefulFacts`
Datos prácticos: ID de API, requisitos, regiones, contexto, formatos, fechas de retiro, etc.

### `curiosities`
Curiosidades verificadas y relevantes. Prohibido inventar trivia.

### `executiveSummary`
Resumen editorial de 1–3 párrafos para lectores que quieren la conclusión.

### `finalSummary`
Cierre del informe con la lectura esencial y lo que cambia en la cronología.

### `media`
Array de objetos:
- `type`: `editorial-illustration`, `diagram`, `official-image`;
- `src`;
- `alt`;
- `credit`;
- `caption?`;
- `placement?`.

La imagen legacy `image` sigue siendo portada/hero.

### `imageBrief`
Brief opcional para el Visual Desk cuando se requiere una ilustración específica.

### `imageStatus`
Uno de:
- `specific`;
- `library`;
- `needs-specific-art`.

### `sources`
Array opcional ampliado de fuentes. Se mantiene `source` como fuente primaria y `relatedSources` por compatibilidad.

## Campos legacy requeridos durante la migración

`id`, `eventKey`, `date`, `coveredAt`, `company`, `product`, `title`, `summary`, `tags`, `image`, `imageAlt`, `imageCredit`, `source`, `verifiedAt`, `body`, `keyPoints`, `analysis`, `watch`.

## Migración

Los 48 artículos existentes al 2026-10-07 son válidos como base factual pero no cumplen todavía Reporter V2. La migración se hace por lotes y conserva id/eventKey.

El frontend V2 debe renderizar campos nuevos cuando existan y degradar limpiamente al formato legacy cuando no existan.
