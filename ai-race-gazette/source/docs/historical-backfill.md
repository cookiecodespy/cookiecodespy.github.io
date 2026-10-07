# AI Race Gazette — Historical Backfill Reporter V2

Fecha: 2026-10-07.

## Objetivo

Reconstruir de forma exhaustiva y verificable la cronología de la carrera de la IA desde el 1 de septiembre de 2026, sin inventar eventos y sin crear una nueva deuda de artículos cortos.

Leer primero:
- `gazette-v1-standard.md`
- `article-v2-schema.md`
- `article-depth.md`
- `editorial-policy.md`
- `content-model.md`
- `coordination.md`
- `image-policy.md`

## Orden de lotes

- 1–7 Sep: investigación factual cerrada; pendiente migración editorial completa Reporter V2.
- 8–14 Sep: siguiente bloque.
- 15–21 Sep.
- 22–30 Sep.
- 1 Oct–fecha actual.
- Luego continuidad diaria.

## Doble pasada obligatoria

### Pasada A: por día/fuentes
Revisar blogs, changelogs, documentación, papers, repositorios y newsroom oficiales dentro de cada fecha.

### Pasada B: por actor/categoría
Revisar inversamente laboratorios y áreas para detectar omisiones que un barrido cronológico pudo perder:
- modelos;
- agentes;
- voz/audio;
- imágenes/video;
- chips/aceleradores;
- datacenters/infra;
- robótica/autonomía;
- investigación;
- seguridad;
- devtools;
- open source;
- adquisiciones, alianzas y financiación material.

La lista de compañías no es cerrada.

## Cobertura mínima por ecosistema

Revisar, cuando corresponda:
OpenAI, Anthropic, Google/DeepMind, xAI, Meta, Microsoft, NVIDIA, Amazon/AWS, Apple, Mistral, Hugging Face y ecosistema open source; además Alibaba/Qwen, Cohere, Perplexity, Cerebras, Groq, CoreWeave, Waymo y actores emergentes que aparezcan durante la investigación.

Esto es un radar, no una obligación de fabricar una noticia por empresa.

## Cierre diario

Cada día termina como:
- `complete` si la revisión encontró y publicó/descartó de forma trazable lo material;
- `reviewed-no-material-news` si la misma revisión no encontró una historia publicable;
- `partial` mientras falte una pasada;
- `pending` si aún no se investigó suficientemente.

No crear una historia para evitar un hueco visual.

## Reporter V2 durante el backfill

Cada historia nueva debe nacer en Reporter V2.

Cuando el bloque contiene artículos legacy existentes:
- reabrir sus fuentes;
- enriquecerlos con nueva estructura y contexto;
- conservar `id` y `eventKey`;
- no inflar con texto vacío;
- añadir fuentes complementarias cuando aporten evidencia/contexto distinto;
- incluir imageBrief si merece arte específico.

El lote no se considera editorialmente terminado hasta que sus historias materiales tengan profundidad adecuada o exista una nota explícita de migración pendiente.

## Auditoría del lote

El documento de auditoría debe registrar:
- fechas cubiertas;
- número de historias;
- principales actores/categorías revisados;
- metodología;
- candidatos descartados importantes y motivo;
- reportes/rumores publicados;
- historias legacy enriquecidas;
- historias aún pendientes de Reporter V2;
- conflictos o limitaciones;
- commit final y comprobación de mirrors.

## Concurrencia

Antes de cada publicación:
- refetch de `main`;
- merge por id/eventKey;
- preservar Newsroom;
- si Newsroom publicó un evento mientras se investigaba, enriquecerlo o deduplicarlo; nunca duplicarlo.

## Meta

Al terminar septiembre y octubre hasta la fecha actual, la hemeroteca debe permitir reconstruir la evolución de la AI race día por día, incluyendo días auditados sin una noticia material.
