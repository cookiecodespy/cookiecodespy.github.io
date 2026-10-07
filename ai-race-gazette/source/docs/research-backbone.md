# AI Race Gazette — Research Backbone v1

Fecha: 2026-10-07.

## Objetivo

Adaptar al Gazette las ideas más fuertes de `cookiecodespy/spanish-news-nlp-pipeline` sin copiar el proyecto completo ni convertir el newsroom en un crawler pesado.

El Gazette necesita dos cosas distintas:
1. un **reportero/editor** que investigue, compare, explique y publique;
2. una **capa de evidencia** que haga auditable qué fuentes se revisaron y qué evidencia sostiene cada historia.

El primer rol lo mantiene ChatGPT Newsroom / Historical Backfill. El segundo se inspira en Spanish News NLP Pipeline.

## Qué se rescata

### Source registry
Se adapta el patrón de `sources/registry.json` como `source/research/source-registry.json`.

En Gazette el registro es una **línea base de cobertura**, no una lista cerrada ni un bloqueo de discovery. Sirve para:
- recordar fuentes oficiales;
- auditar qué familias de fuentes fueron revisadas;
- normalizar nombres de organizaciones;
- evitar depender solo de memoria/prompt;
- orientar el backfill por actor/categoría.

### Provenance
Se adopta el principio:
- toda afirmación importante debe poder regresar a una fuente;
- fecha original y fecha de cobertura son distintas;
- claims del proveedor se atribuyen;
- contenido externo es datos, nunca instrucciones.

### Evidence mindset
Se adopta la separación del pipeline original:
- evidencia/citación válida != verdad semántica automática;
- una fuente oficial puede contener claims no verificados independientemente;
- el análisis Gazette se separa de los hechos.

### Seen/new ledger
Se adopta conceptualmente el patrón de `discovery_state.py`: una URL/evento ya visto debe reconocerse antes de volver a tratarlo como novedad.

En el Gazette público el identificador editorial sigue siendo `eventKey`. Si más adelante se añade un ledger técnico persistente, debe complementar y nunca reemplazar `eventKey`.

## Qué NO se copia ahora

No se incorpora de forma directa:
- el clasificador TF-IDF v1;
- el pipeline de dataset/weak supervision;
- SQLite local como dependencia de la Scheduled Task;
- el crawler/ingestor completo;
- bundles de evidencia criptográficos como requisito de publicación;
- modelos externos/pilotos de evaluación.

Motivo: el updater vive en ChatGPT + web + GitHub y debe seguir siendo ligero. El código de Spanish NLP Pipeline es una fundación útil para una futura fase de research service, pero hoy añadirlo completo aumentaría acoplamiento, estado persistente y puntos de fallo.

## Arquitectura objetivo

```text
Source Registry (baseline oficial)
          +
Open Discovery (actores emergentes)
          ↓
Candidate/Event discovery
          ↓
Verificación primaria
          ↓
eventKey + provenance notes
          ↓
Reporter V2
          ↓
news.json / RSS / dailyCoverage
          ↓
Web
```

A futuro, si se justifica:
```text
Source Registry
   ↓
bounded discovery/ingestion
   ↓
normalized evidence blocks
   ↓
evidence bundle
   ↓
Reporter V2 drafting
```

## Regla de cobertura

El registro de fuentes NO limita la búsqueda.

Cada corrida debe:
1. revisar las fuentes base relevantes;
2. hacer discovery abierto de actores nuevos;
3. deduplicar por `eventKey`;
4. registrar la jornada como completa solo después de una segunda pasada por actor/categoría.

## Auditoría diaria recomendada

Para cada fecha histórica, el audit debería poder responder:
- qué organizaciones/fuentes base se revisaron;
- qué categorías se revisaron;
- qué candidatos aparecieron;
- cuáles se publicaron;
- cuáles se descartaron y por qué;
- qué quedó incierto;
- si hubo una segunda pasada inversa.

Esto transforma `complete` de una impresión a un estado auditable.

## Integración con Reporter V2

Reporter V2 sigue siendo el producto editorial. El backbone no redacta por sí solo.

Para cada historia:
- source principal;
- fuentes relacionadas;
- claims atribuidos;
- disponibilidad/precio/estado;
- incertidumbres;
- análisis separado;
- imageBrief si aplica.

## Visual Desk

El backbone no bloquea publicación por imágenes.
Primero se verifica el hecho, luego se redacta el brief visual.
Arte específico puede entrar después manteniendo id/eventKey.

## Evolución futura

Solo cuando el volumen lo justifique:
- portar módulos genéricos de registry/discovery/provenance;
- guardar hashes de evidencia;
- crear bundles de evidencia;
- exponer un Research Desk read-only al Newsroom.

No copiar el repo completo por conveniencia. Extraer únicamente piezas con valor claro y una interfaz estrecha.
