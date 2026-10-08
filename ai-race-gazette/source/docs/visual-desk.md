# AI Race Gazette — Visual Desk v1

Fecha: 2026-10-07.

## Objetivo

Convertir el componente visual del Gazette en un sistema editorial reproducible, no en una colección de imágenes improvisadas.

El objetivo final es que los informes Reporter V2 importantes tengan una ilustración específica que explique o simbolice la historia, manteniendo un fallback de biblioteca para breaking news y actualizaciones menores.

## Diagnóstico inicial

Al abrir esta pasada existían 49 artículos y solo cuatro ilustraciones editoriales reutilizadas como hero:
- `hero.webp`: 34 artículos;
- `google.webp`: 12;
- `globe.webp`: 2;
- `mistral.webp`: 1.

La reutilización permitió construir el archivo, pero ya es la principal deuda visual.

## Artefactos del sistema

### `visual/asset-manifest.json`
Registro canónico de assets editoriales:
- ID estable;
- ruta;
- procedencia;
- tipo;
- tags;
- reutilización permitida;
- crédito canónico;
- créditos legacy aceptados;
- uso actual;
- restricciones.

Toda imagen hero/media editorial nueva debe entrar al manifest.

### `visual/image-queue.json`
Cola de producción visual derivada del archivo actual.

Cada entrada conserva:
- articleId/eventKey;
- historia/producto/compañía;
- imagen actual;
- grado de reutilización;
- prioridad;
- brief;
- output esperado;
- estado de producción.

No es fuente factual y no sustituye `news.json`.

## Prioridades

- **P0**: el artículo declara `needs-specific-art`.
- **P1**: usa un fallback excesivamente reutilizado (20+ usos).
- **P2**: usa un asset reutilizado en 5+ artículos.
- **P3**: deuda visual menor.

Dentro de cada prioridad, el Editor visual puede adelantar grandes lanzamientos.

## Flujo por imagen

1. La noticia ya fue investigada y redactada.
2. Art Director revisa el brief contra el informe.
3. Se genera/selecciona arte.
4. QA visual:
   - representa la historia sin inventar hechos;
   - no contiene texto roto;
   - no contiene logos falsos;
   - no presenta una interfaz ficticia como captura real;
   - no parece una fotografía documental si es generada;
   - funciona en crop de portada y hero;
   - mantiene estética Gazette.
5. Convertir a WebP optimizado.
6. Registrar asset en manifest.
7. Copiar al asset público/reproducible.
8. Actualizar el mismo artículo, sin cambiar id/eventKey:
   - `image`;
   - `imageAlt`;
   - `imageCredit`;
   - `imageStatus: specific`;
   - opcionalmente `media[]`.
9. Marcar queue item `complete`.
10. CI valida rutas, manifest, crédito y datos.

## Naming

Arte específico:
`assets/news/YYYY-MM-DD/<article-id>.webp`

Diagramas:
`assets/news/YYYY-MM-DD/<article-id>-diagram-01.webp`

Nunca usar nombres genéricos como `image1.webp`.

## Créditos

Crédito generado canónico:

> Ilustración editorial generada con IA · AI Race Gazette; no es una fotografía documental.

Puede añadirse una aclaración más específica, pero nunca quitar la distinción entre ilustración y evidencia fotográfica.

## Imágenes oficiales

Una imagen oficial solo se usa cuando:
- tiene procedencia clara;
- su uso editorial es apropiado;
- existe crédito/licencia razonable;
- no fue extraída arbitrariamente de un medio.

Registrar `origin: official` y fuente/licencia en el manifest.

## Diagramas

Un diagrama es preferible a una ilustración cuando explica mejor:
- arquitectura;
- cronología;
- precios;
- disponibilidad;
- relaciones entre modelos/agentes;
- hardware.

Los diagramas deben representar solo datos sustentados.

## Newsroom horario

Newsroom NO queda bloqueado por Visual Desk.

Puede:
- usar una imagen library;
- poner `imageStatus: needs-specific-art`;
- añadir `imageBrief`.

No debe:
- modificar assets durante el ciclo horario;
- inventar una imagen oficial;
- afirmar que generó/subió arte si no lo hizo.

## Objetivo v1.0

Antes de declarar v1.0:
- toda imagen usada por artículos está registrada;
- ningún hero depende de un archivo huérfano;
- todos los Reporter V2 tienen estado visual explícito;
- grandes lanzamientos tienen arte específico o una excepción documentada;
- la cola P0 está vacía;
- la reutilización del hero genérico deja de dominar el archivo;
- créditos y alt text pasan QA.

## Publicación E2E

El procedimiento operativo para llevar un arte aprobado desde archivo WebP hasta el sitio está en `visual-production-runbook.md`. La herramienta `scripts/publish_visual_asset.py` actualiza de forma coordinada el binario fuente, manifest, mirrors de noticias y cola visual.
