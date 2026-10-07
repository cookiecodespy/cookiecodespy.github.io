# Reutilización de spanish-news-nlp-pipeline en AI Race Gazette

Fecha: 2026-10-07.

## Decisión

No fusionar ni copiar el repositorio completo.

Reutilizar selectivamente sus contratos de confianza, procedencia y discovery.

## Matriz de reutilización

| Componente | Decisión | Razón |
| --- | --- | --- |
| V1 TF-IDF / LogReg | No | Clasifica secciones; no resuelve cobertura Gazette |
| Limpieza/dedupe de titulares | Parcial | La idea sirve, pero Gazette deduplica por eventKey |
| Source registry | Sí | Excelente checklist de fuentes oficiales |
| Default-deny estricto | Adaptar | Útil para ingestión automática, pero Gazette necesita discovery abierto |
| External content = data | Sí | Regla de seguridad correcta |
| SQLite discovery ledger | Después | Útil si existe proceso persistente; Scheduled Tasks no deben depender de él hoy |
| Ingestión exact-byte + SHA | Después | Gran provenance, pero no requisito de v1 |
| Normalización + citation blocks | Después | Muy valioso para research service, demasiado pesado para cada run horario |
| Evidence bundles | Después | Ideal para claims auditables |
| Claim status UNREVIEWED/UNASSESSED | Sí como principio | Evita confundir cita válida con verdad |
| Human review authority | Sí como principio | Compatible con Editor-in-Chief / QA |
| CI offline determinista | Sí | Ya existe filosofía similar en Gazette |

## Resultado

Spanish News NLP Pipeline pasa a ser la referencia de diseño del futuro **Research Backbone**, mientras AI Race Gazette conserva su arquitectura editorial actual y su operación ChatGPT + GitHub.
