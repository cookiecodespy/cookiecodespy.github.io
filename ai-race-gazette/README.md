# AI Race Gazette

AI Race Gazette es una hemeroteca pública en español sobre la carrera de la inteligencia artificial y la tecnología. Combina una interfaz inspirada en prensa impresa con un archivo verificable, artículos enlazables, fuentes primarias y análisis editorial separado de los hechos.

Sitio: https://cookiecodespy.github.io/ai-race-gazette/

## Producto

- Portadas individuales y vista lista; ambas abren una página completa por noticia.
- Búsqueda sin distinción de acentos y filtros combinables por compañía, tema, mes y día.
- Compañías y temas derivados dinámicamente de los datos: un actor nuevo puede aparecer sin modificar React.
- Ediciones diarias y ledger de cobertura para distinguir jornadas completas, parciales, pendientes o revisadas sin novedades materiales.
- Reporter V2 para informes largos: lectura rápida, desarrollo, datos técnicos, disponibilidad/precio, cronología, análisis editorial, consejos, datos útiles, curiosidades verificadas, limitaciones, resumen final y fuentes cuando corresponda.
- RSS, diseño responsive, navegación por teclado, impresión y URLs compartibles por artículo/edición.
- Ilustraciones editoriales con crédito; nunca se presentan imágenes generadas como fotografía documental.

## Código

El sitio publicado es estático en GitHub Pages. El código reproducible vive en `source/`: React/Vite para la interfaz y Python estándar para validación editorial, RSS y QA. No necesita una API de IA de pago para el ciclo editorial normal.

Comprobaciones locales:

```bash
npm ci
npm test
python3 -m unittest tests/editorial_test.py
python3 scripts/editorial.py --validate-only
python3 scripts/quality-audit.py
npm run build
npm run test:sites
```

El workflow `.github/workflows/build-ai-race-gazette.yml` ejecuta tests Node/Python, validación editorial, build, pruebas del worker, QA en Chromium y publica el frontend compilado cuando cambia el código fuente.

## Automatización

La tarea **AI Race Gazette Newsroom** se ejecuta cada hora mediante ChatGPT + GitHub. No usa Codex, Work ni una API de pago como parte del ciclo editorial rutinario.

Reglas principales:
- ventana móvil de al menos 48 horas;
- fuentes oficiales primero;
- lista de compañías abierta;
- Reporter V2 desde el nacimiento de cada noticia nueva;
- deduplicación por `eventKey`;
- no-op estricto cuando no hay cambios materiales;
- refetch/merge de `main` antes de escribir;
- frontend protegido de las actualizaciones horarias;
- si una ejecución desatendida no recibe permiso para escribir en GitHub, prepara un paquete de publicación pendiente y no deja estados parciales.

Fuentes de verdad:
- `source/docs/gazette-v1-standard.md`
- `source/docs/article-v2-schema.md`
- `source/docs/editorial-policy.md`
- `source/docs/scheduled-task.md`
- `source/docs/automation-operations.md`
- `source/docs/coordination.md`

## Histórico

Al corte del 7 de octubre de 2026:
- 49 artículos verificados;
- 36 corresponden al bloque auditado del 1–7 de septiembre;
- el 1–7 de septiembre está marcado `complete`;
- el resto de septiembre y octubre sigue en reconstrucción;
- las jornadas sin una historia material pueden cerrarse como `reviewed-no-material-news` después de una auditoría real;
- los titulares de prototipos antiguos son pistas, no hechos.

El workflow de reconstrucción se documenta en `source/docs/historical-backfill.md`.

## Estado de Reporter V2

La infraestructura, el frontend y la validación Reporter V2 ya existen. Claude Haiku 5.5 es la primera pieza publicada en el nuevo formato. Los artículos legacy restantes se irán enriqueciendo por lotes mientras se completa el archivo histórico; conservan sus IDs y eventKeys.

## Imágenes

La política visual está en `source/docs/image-policy.md`. Las noticias pueden reutilizar temporalmente arte de biblioteca y registrar `imageBrief` + `imageStatus` cuando necesitan una ilustración específica. La generación autónoma y carga de binarios desde Scheduled Tasks se mantiene separada hasta disponer de un Visual Desk automatizado y fiable.

Se conserva el brief original en `DESIGN-BRIEF.md`, la maqueta anterior en `prototype.html` y la referencia visual en `assets/reference-look.jpg`.

Publicación independiente. Las marcas pertenecen a sus respectivos titulares. Ilustraciones generadas con IA cuando así se acredita.
