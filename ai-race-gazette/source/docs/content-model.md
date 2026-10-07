# Cómo organiza las noticias AI Race Gazette

La unidad de publicación es una novedad relevante, no una empresa ni un día. Cada artículo conserva un id y eventKey estable. El título identifica la novedad; fecha, compañía y producto permiten encontrarla. Puede haber cualquier número de artículos de una empresa el mismo día.

Ejemplo: OpenAI publica tres funciones y Anthropic dos el 7 de octubre. Se crean cinco noticias, cada una con su portada, resumen, desarrollo, imagen editorial y fuente. El filtro de ese día muestra las cinco; el de OpenAI muestra tres. La página de edición reúne todas las noticias de la fecha y cada artículo enlaza a ella.

## Separar o agrupar

- Separar productos, modelos o funciones con utilidad, disponibilidad o implicaciones distintas, aunque compartan anuncio y URL fuente. Fable y Mythos son artículos distintos porque sus condiciones de acceso difieren.
- Agrupar ajustes pequeños del mismo producto en una actualización. No convertir cada bullet de un changelog en noticia.
- Una nueva fase de disponibilidad del mismo lanzamiento actualiza su artículo, conserva URL y registra una nota con fecha. Si cambia sustancialmente el producto o su uso, puede ser un evento nuevo enlazado al anterior.
- Una segunda fuente sobre un evento existente enriquece el artículo; no crea una copia.

## Fechas y archivo

`date` es la fecha del anuncio cuando se ha confirmado. Si se desconoce, se usa la fecha de cobertura con nota explícita. `source.publishedAt` es la fecha comprobada de la fuente; `coveredAt` indica cuándo escribimos la cobertura; `verifiedAt` registra la revisión. Corregir una fecha no cambia el id ni rompe enlaces.

El archivo solicitado abarca 1 de septiembre–7 de octubre de 2026. `docs/history-candidates.json` conserva las 37 jornadas de la maqueta como pistas. `docs/history-coverage.json` registra el estado de cada fecha. Publicar uno o varios artículos no demuestra que una jornada esté completa.

No confundir una fecha pendiente con un día sin novedades. Un día solo puede declararse revisado sin noticias cuando existe evidencia de las fuentes y el período consultado.

## Estados históricos

- `pending`: no revisado suficientemente.
- `partial`: hay contenido verificado, pero la revisión no es exhaustiva.
- `complete`: el conjunto relevante de fuentes y actores fue revisado.
- `reviewed-no-material-news`: la jornada se revisó y no se encontró una novedad material publicable.

## Actualización viva

La tarea horaria está activa. Investiga novedades desde la última revisión y vuelve a consultar al menos las últimas 48 horas para descubrir anuncios tardíos.

Identifica eventos antes de escribir. Mantén IDs y enlaces, registra correcciones y regenera los datos/RSS publicados solo cuando exista un cambio material. El frontend carga `news.json` dinámicamente, así que una actualización editorial rutinaria no necesita recompilar React.

Si la investigación falla, no avances el estado de revisión. No limites la cantidad de noticias para llenar una cuota ni elimines las antiguas. Mostrar 12 inicialmente y cargar 12 más conserva velocidad con archivos grandes.

## Escritura concurrente

Automation & Newsroom y Historical Backfill pueden trabajar al mismo tiempo. Antes de publicar, ambos deben leer la versión más reciente de `main`, reconciliar por `id` y `eventKey` y preservar cualquier artículo nuevo añadido por el otro proceso.

Ver `docs/coordination.md`.


## Profundidad y longitud

La tarjeta de portada es un resumen; el artículo completo debe aportar contexto adicional real. No se considera suficiente repetir el resumen en tres párrafos.

Usar Reporter V2 como referencia:
- breve material: 500–800 palabras;
- noticia estándar: 900–1.600;
- noticia mayor: 1.500–2.500;
- informe excepcional: 2.000–3.500+ cuando exista evidencia suficiente.

Historical Backfill debe también enriquecer artículos existentes que sean demasiado breves dentro del bloque que está auditando. Mantener `id` y `eventKey` al ampliarlos.

Ver `docs/article-depth.md`.


## Article V2

El estándar definitivo está en `docs/gazette-v1-standard.md` y el esquema ampliado en `docs/article-v2-schema.md`.

Durante la migración se conservan los campos legacy para compatibilidad con el frontend actual. Los campos V2 son aditivos. Los artículos futuros deben nacer con Reporter V2 para evitar crear una nueva deuda de piezas breves.


## Ledger diario público

El JSON editorial incluye `dailyCoverage`, sincronizado con `docs/history-coverage.json`. El frontend lo usa para distinguir `pending`, `partial`, `complete` y `reviewed-no-material-news`.

`verifiedArticles` debe coincidir con los artículos publicados para la fecha. Toda publicación que cambie una fecha debe reconciliar ambos ledgers.
