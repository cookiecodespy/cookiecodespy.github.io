# Política editorial

- Resúmenes en español, originales y asistidos por IA. Fuentes oficiales al final de cada artículo.
- Fecha de cobertura separada de fecha de publicación de la fuente. No presentar una cobertura posterior como lanzamiento de ese día.
- Leer las fuentes y comprobar fechas, nombres, disponibilidad, precio y cifras. Atribuir los benchmarks a su autor. Diferenciar anuncios, preview, beta, despliegue gradual y disponibilidad general.
- Análisis separado de hechos. Sin citas inventadas, rankings sin metodología ni imágenes sintéticas presentadas como fotografías.
- No llenar el calendario con noticias ficticias. El prototipo de septiembre/octubre se conserva como referencia de diseño, fuera del archivo verificado.
- Cada noticia es independiente, con URL estable, contexto, puntos clave, fuente y fecha de comprobación.
- Correcciones mediante cambios versionados. Una corrección sustancial debe registrar la explicación y fecha en el artículo.
- Toda imagen generada debe tener crédito visible. Fotografías externas requieren permiso/licencia y atribución.
- Mantener imágenes WebP, fuentes locales, paginación y contenido sin HTML arbitrario.

## Descubrimiento de nuevas compañías

La cobertura no se limita a una lista fija de laboratorios. Cada revisión debe buscar también actores emergentes en modelos, chips, agentes, voz, robótica, infraestructura, investigación, herramientas de desarrollo y open source.

Una compañía nueva se incorpora cuando existe una novedad material y verificable, no para completar un catálogo. El campo `company` debe usar un nombre canónico y consistente. El frontend genera los filtros automáticamente desde los artículos, por lo que el primer artículo de una compañía nueva crea su filtro sin cambios de interfaz.

Dar prioridad a fuentes primarias. Si una historia material solo está documentada por un medio de alta reputación, puede cubrirse como reporte y debe distinguir claramente hechos confirmados de información no confirmada.

## Rumores y reportes

No presentar rumores como hechos. Un reporte no confirmado solo merece publicación cuando puede cambiar de forma material la lectura de la carrera de la IA y existe una fuente pública de alta reputación. Debe estar rotulado explícitamente como reporte/rumor en el título, el resumen y las etiquetas, y actualizarse o corregirse si aparece confirmación posterior.

## Archivo histórico pendiente

El archivo parte el 1 de septiembre de 2026 y continúa día a día. Al corte del 7 de octubre hay 48 artículos verificados en 14 fechas; el bloque 1–7 de septiembre reúne 36 artículos y está marcado `complete` con auditoría documentada. El resto del período sigue parcial o pendiente.

Cada fecha debe terminar como `complete` o `reviewed-no-material-news` solo después de una revisión equivalente. Nunca inventar titulares para llenar un día. Ver `content-model.md`, `history-coverage.json` y `gazette-v1-standard.md`.


## Profundidad de los artículos

La portada resume; la página interna desarrolla. Reporter V2 es el estándar. Una noticia estándar suele quedar en 900–1.600 palabras, una noticia mayor en 1.500–2.500 y un informe excepcional puede superar 2.000–3.500 cuando la evidencia lo justifique. Una actualización menor puede ser de 500–800. Son rangos orientativos, nunca relleno obligatorio. No alargar con relleno ni especulación.

Cada pieza debe ampliar sustancialmente el resumen e incluir, cuando aplique: qué pasó, qué cambia, detalles técnicos, disponibilidad/precio, antecedentes, impacto competitivo, limitaciones, análisis editorial, qué seguir y fuentes. Ver `article-depth.md`.


## Consejos, curiosidades y utilidad

Los artículos pueden incluir consejos, datos útiles y curiosidades, pero deben cumplir:
- consejos como orientación editorial, no promesas;
- curiosidades verificadas y relevantes;
- datos útiles concretos y comprobables;
- ninguna trivia inventada;
- análisis/opinión separados visual y semánticamente de los hechos.

Ver `docs/gazette-v1-standard.md`.
