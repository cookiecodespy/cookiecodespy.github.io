# AI Race Gazette

Un diario público en español sobre la carrera de la IA y la tecnología. Papel envejecido, portadas por edición, artículos con contexto y fuentes oficiales.

Sitio: https://cookiecodespy.github.io/ai-race-gazette/

## Producto

- Nombre del diario, resumen del proyecto, filtros y noticias, siguiendo la estructura de la maqueta v4.
- Portadas individuales con ilustraciones originales en estilo grabado o filas de lista; ambas abren el art?culo completo.
- Bordes reales de papel recortado con transparencia, textura y desgaste.
- Hemeroteca por fecha, búsqueda sin distinción de acentos, filtros combinables por compañía/tema/mes/día y vista lista. Se recuerdan los filtros durante la sesión.
- Enlaces compartibles por artículo y edición; navegación atrás/adelante del navegador.
- Artículos con resumen, desarrollo, puntos clave, análisis identificado y enlaces oficiales.
- RSS, diseño adaptable, teclado, estados vacíos/error y modo impresión.

## Código

El sitio publicado es estático. El código reproducible está en `source/`: React/Vite para la interfaz y Python estándar para validación, RSS y publicación. No necesita servidor Python, base de datos, cuenta de lector ni API de pago. Las imágenes WebP y tipografías locales evitan peticiones externas al leer.

En el proyecto local:

```powershell
npm ci
python scripts/editorial.py
node --test tests/news.test.mjs
npm run build
npm run dev -- --host 127.0.0.1 --port 4173
```

## Actualización

Editar `public/data/news.json`, ejecutar validación y build, publicar mediante `python scripts/publish.py --message "Actualiza AI Race Gazette"`. El script usa la autenticación existente de GitHub CLI, publica un commit atómico limitado a esta carpeta y conserva la página raíz.

La actualización diaria con ChatGPT + GitHub está activada para la madrugada, con ejecución alrededor de las 04:00 hora de Santiago. La tarea usa el repositorio publicado y no depende del PC local para las actualizaciones editoriales rutinarias. El comportamiento canónico está documentado en `source/docs/scheduled-task.md`: descubre también compañías emergentes y los filtros de compañía se generan automáticamente desde los datos.

## Estado y exactitud

Archivo ampliado: 15 noticias verificadas en 9 fechas entre el 1 de septiembre y el 6 de octubre de 2026, revisadas el 7 de octubre. Se recuperaron las 37 jornadas de la maqueta como pistas de investigación. El histórico completo sigue pendiente de verificación; no se publica el contenido de la maqueta como si estuviera comprobado. Ver `source/docs/editorial-policy.md` y `design-qa.md` para el alcance y las comprobaciones.

Se conserva el brief original en `DESIGN-BRIEF.md`, la maqueta anterior en `prototype.html` y la referencia de diseño en `assets/reference-look.jpg`.

Ilustraciones creadas con IA. Tipografías Bodoni Moda y Newsreader bajo SIL OFL; licencias incluidas en assets. Las marcas son de sus respectivos titulares. Publicación independiente, sin afiliación con las compañías cubiertas.
