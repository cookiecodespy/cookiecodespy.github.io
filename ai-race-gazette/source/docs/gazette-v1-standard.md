# AI Race Gazette — estándar editorial y de producto v1.0

Fecha de adopción: 2026-10-07.

Este documento es la constitución operativa de AI Race Gazette. Si otra guía entra en conflicto, prevalece este documento salvo instrucción explícita posterior del propietario.

## 1. Producto

AI Race Gazette es una hemeroteca y cronología viva de la carrera de la inteligencia artificial. No es un agregador de titulares.

Objetivos:
- cobertura exhaustiva de novedades materiales, verificables y relevantes;
- una edición consultable por cada día desde 2026-09-01 en adelante;
- artículos internos que funcionen como informes periodísticos profesionales;
- separación visible entre hechos, afirmaciones del proveedor, reportes no confirmados y análisis editorial;
- fuentes primarias como base;
- continuidad histórica: modelos, chips, agentes, robótica, infraestructura, investigación, productos, financiación material, seguridad y open source;
- descubrimiento de actores emergentes sin lista cerrada.

No se promete literalmente “todas las publicaciones de internet”. Se busca que no falte ninguna novedad material para entender la carrera de la IA.

## 2. Unidad editorial

Una noticia = un evento material.

Separar eventos con producto, utilidad, disponibilidad o implicaciones diferentes aunque compartan URL fuente. Agrupar solo ajustes menores del mismo producto.

Deduplicar por `eventKey`, no por URL.

IDs y eventKeys son estables. Las ampliaciones y correcciones enriquecen el mismo artículo.

## 3. Profundidad Reporter V2

La portada resume; la página interna investiga.

Longitudes orientativas, nunca cuotas:
- breve material: 500–800 palabras;
- noticia estándar: 900–1.600;
- noticia mayor: 1.500–2.500;
- informe excepcional: 2.000–3.500+ si la evidencia lo justifica.

No rellenar. Una pieza más corta y rigurosa es mejor que una larga con especulación.

Cada informe debe cubrir, cuando aplique:
1. qué pasó;
2. qué cambia;
3. cómo funciona;
4. detalles técnicos;
5. disponibilidad, regiones y planes;
6. precio/coste;
7. antecedentes y cronología;
8. claims y benchmarks con atribución;
9. comparación competitiva sustentada;
10. qué significa para developers;
11. qué significa para usuarios;
12. qué significa para empresas;
13. limitaciones y preguntas abiertas;
14. análisis editorial del Gazette;
15. consejos o acciones prácticas;
16. datos útiles;
17. datos curiosos verificables;
18. qué seguir;
19. resumen final;
20. fuentes.

Los bloques no aplicables se omiten.

## 4. Hechos, claims, análisis y rumores

- Hecho confirmado: respaldado por una fuente primaria o evidencia pública sólida.
- Claim del proveedor: se atribuye explícitamente (“Anthropic afirma…”, “según NVIDIA…”).
- Análisis Gazette: opinión o interpretación, siempre rotulada.
- Reporte/rumor: solo si es material y procede de una fuente reputada; se rotula en título/resumen/tags y nunca se formula como hecho confirmado.

No inventar citas. No convertir benchmarks propios de una empresa en ranking independiente.

## 5. Fuentes

Orden preferido:
1. anuncio/blog/documentación/paper/repositorio oficial;
2. documentación técnica del proveedor o plataforma de distribución;
3. documentos regulatorios, papers o repositorios primarios;
4. Reuters/AP y medios técnicos reputados para contexto adicional;
5. otras fuentes solo si agregan evidencia distinta y verificable.

Abrir las fuentes antes de escribir. Verificar fecha, estado, nombre, disponibilidad, precio, regiones, cifras y unidades.

## 6. Artículo V2

Los artículos V2 usan el esquema descrito en `article-v2-schema.md`.

Durante la migración mantienen también los campos legacy requeridos por el frontend actual:
`body`, `keyPoints`, `analysis`, `watch`, `image`, `source`.

Esto permite enriquecer datos antes de que el frontend V2 esté desplegado.

## 7. Imágenes

Ver `image-policy.md`.

Principios:
- una imagen no puede presentarse como fotografía documental si es generada;
- toda imagen generada lleva crédito;
- no bloquear una noticia urgente por falta de arte específico;
- para noticias grandes se prefiere ilustración propia;
- imágenes múltiples solo cuando agreguen comprensión;
- el arte se produce después de confirmar los hechos de la historia.

## 8. Calendario histórico

Cada fecha desde 2026-09-01 debe tener un estado:
- `pending`;
- `partial`;
- `complete`;
- `reviewed-no-material-news`.

No se inventa una noticia para llenar un día.

Una fecha `complete` requiere evidencia de doble pasada:
- revisión por fecha/canales oficiales;
- revisión inversa por actores/categorías;
- candidatos descartados documentados cuando sean relevantes;
- deduplicación y revisión de disponibilidad/fase.

Un día sin historias puede cerrarse como `reviewed-no-material-news` si fue revisado de forma equivalente.

## 9. Operación en tres carriles

### Automation & Newsroom
Actualidad + ventana móvil de al menos 48 h. No hace backfill masivo ni cambios de frontend.

### Historical Backfill
Completa el archivo por bloques y enriquece artículos heredados demasiado cortos. No persigue la actualidad salvo correcciones de evidencia.

### Editor-in-Chief / Product & QA
Esquema, frontend, calidad, consistencia, pruebas, SEO, visuales y coordinación.

Todos leen `coordination.md`.

## 10. Publicación horaria

No-op estricto:
- sin noticia/corrección/cambio material => cero commits;
- no tocar `updatedAt`, `verifiedAt` ni logs por rutina vacía.

Antes de escribir: refetch de `main`, merge sobre el estado actual, dedupe, preservación de trabajo concurrente.

Si la plataforma bloquea una escritura por aprobación/seguridad:
- no reintentar en bucle;
- no dejar cambios parciales;
- emitir un paquete listo para publicar con eventos, fuentes y archivos afectados;
- reportar que la investigación fue exitosa pero la publicación quedó pendiente de aprobación.
Ver `automation-operations.md`.

## 11. Definición de v1.0

v1.0 exige:
- septiembre completo por estados diarios;
- octubre completo hasta la fecha de cierre y continuidad posterior;
- artículos existentes migrados progresivamente a Reporter V2;
- frontend capaz de representar Article V2;
- mirrors JSON/RSS consistentes;
- cero duplicados id/eventKey;
- fuentes verificables;
- automatización sin commits vacíos;
- concurrencia segura;
- SEO/OpenGraph revisados;
- mobile/desktop QA;
- arte con crédito y sin falsas fotografías.


## 12. Estado diario público

`data/news.json` contiene `dailyCoverage`, una copia pública del ledger de `docs/history-coverage.json`.

Reglas:
- cada fecha del ledger es única;
- no puede haber huecos entre `coverageStart` y la última fecha registrada;
- `verifiedArticles` debe coincidir con el número real de artículos de esa fecha;
- cuando se modifica un estado diario, actualizar `dailyCoverage` y `history-coverage.json` en la misma publicación;
- un run horario vacío NO crea por sí solo un commit para marcar el día; el cierre `reviewed-no-material-news` se hace durante una auditoría/cierre de cobertura;
- toda fecha que contenga artículos debe existir en el ledger público.

Esto permite que el frontend distinga un hueco pendiente de un día realmente revisado sin noticias.


## 13. Research Backbone y cobertura auditable

El Gazette usa `research/source-registry.json` como checklist base de fuentes oficiales, no como lista cerrada.

Cada investigación histórica completa debe combinar:
- fuentes base;
- discovery abierto;
- revisión por categorías;
- pasada inversa por actores/categorías.

`research/coverage-audit.json` registra la evidencia operativa del cierre diario. Ver `docs/coverage-audit.md`.

Las fechas 1–7 Sep cerradas antes de Research Backbone v1 mantienen estado `complete`, pero quedan marcadas para replay del nuevo checklist durante la auditoría inversa final.

## 14. Calendario público

La web debe representar todas las fechas del ledger, incluidas fechas sin artículos:
- complete;
- partial;
- pending;
- reviewed-no-material-news.

Una edición diaria vacía debe explicar su estado; nunca usar un hueco visual como prueba de que no hubo noticias.
