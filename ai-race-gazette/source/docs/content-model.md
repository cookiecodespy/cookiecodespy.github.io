# Cómo organiza las noticias AI Race Gazette

La unidad de publicación es una novedad relevante, no una empresa ni un día. Cada artículo conserva un id y eventKey estable. El título identifica la novedad; fecha, compañía y producto permiten encontrarla. Puede haber cualquier número de artículos de una empresa el mismo día.

Ejemplo: OpenAI publica tres funciones y Anthropic dos el 7 de octubre. Se crean cinco noticias, cada una con su portada, resumen, desarrollo, imagen editorial y fuente. El filtro de ese día muestra las cinco; el de OpenAI muestra tres. La página de edición reúne todas las noticias de la fecha y cada artículo enlaza a ella.

## Separar o agrupar

- Separar productos, modelos o funciones con utilidad, disponibilidad o implicaciones distintas, aunque compartan anuncio y URL fuente. Fable y Mythos son artículos distintos porque sus condiciones de acceso difieren.
- Agrupar ajustes pequeños del mismo producto en una actualización. No convertir cada bullet de un changelog en noticia.
- Una nueva fase de disponibilidad del mismo lanzamiento actualiza su artículo, conserva URL y registra una nota con fecha. Si cambia sustancialmente el producto o su uso, puede ser un evento nuevo enlazado al anterior.
- Una segunda fuente sobre un evento existente enriquece el artículo; no crea una copia.

## Fechas y archivo

date es la fecha del anuncio cuando se ha confirmado. Si se desconoce, se usa la fecha de cobertura con nota explícita. source.publishedAt es la fecha comprobada de la fuente; coveredAt indica cuándo escribimos la cobertura; verifiedAt registra la revisión. Corregir una fecha no cambia el id ni rompe enlaces.

El archivo solicitado abarca 1 de septiembre–7 de octubre de 2026. docs/history-candidates.json conserva las 37 jornadas de la maqueta como pistas. docs/history-coverage.json registra por fecha pending o partial. Ningún día está marcado completo: publicar uno o varios artículos no demuestra que hayamos revisado todas las fuentes de todas las empresas.

No confundir una fecha pendiente con un día sin novedades. Un día solo puede declararse revisado sin noticias cuando existe un registro de las fuentes y el período consultado. El archivo público muestra su alcance parcial.

## Actualización diaria

Investigar el intervalo desde la última revisión y volver a consultar al menos las últimas 48 horas para descubrir anuncios tardíos. Identificar eventos antes de escribir. Mantener IDs y enlaces, registrar correcciones, validar, regenerar RSS, compilar y publicar. Si la investigación falla, no avanzar el estado de revisión. No limitar la cantidad de noticias para llenar una cuota ni eliminar las antiguas. Mostrar 12 inicialmente y cargar 12 más conserva velocidad con archivos grandes.

La tarea recurrente todavía necesita activación; su prompt está en scheduled-task.md. Este documento define el comportamiento editorial de esa tarea.
