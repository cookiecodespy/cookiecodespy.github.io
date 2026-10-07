# AI Race Gazette — Coverage Audit Ledger

Fecha: 2026-10-07.

## Propósito

`research/coverage-audit.json` es el registro auditable de cómo se revisó cada jornada histórica.

No reemplaza:
- `docs/history-coverage.json`, que contiene el estado editorial diario;
- `data/news.json.dailyCoverage`, que expone ese estado al frontend.

Los tres artefactos se complementan.

## Qué registra

Por fecha:
- estado editorial;
- artículos verificados;
- modo de auditoría;
- fuentes base revisadas;
- categorías revisadas;
- si hubo discovery abierto;
- si se hizo pasada inversa;
- estadísticas de candidatos;
- documento de auditoría;
- fecha de revisión;
- si requiere reauditoría bajo Research Backbone v1.

## Modos de auditoría

### `pending-backbone-audit`
No existe todavía evidencia suficiente bajo el protocolo actual.

### `legacy-block-audit`
La fecha fue cerrada antes de Research Backbone v1 mediante una auditoría histórica válida, pero no tiene todavía la matriz detallada de fuentes/categorías.

No se degrada automáticamente su estado `complete`, pero queda `backboneReauditRequired: true` para la auditoría inversa final.

### `backbone-v1`
La fecha fue revisada con:
- source registry base;
- discovery abierto;
- categorías;
- pasada inversa;
- conteo de candidatos/publicaciones/descartes.

Para cerrar una fecha como `complete` o `reviewed-no-material-news` en este modo, los validators exigen evidencia de esas pasadas.

## Regla de sincronización

Cuando Historical Backfill cierre o cambie una fecha:
1. recalcular artículos reales;
2. actualizar `history-coverage.json`;
3. actualizar `data/news.json.dailyCoverage` y su espejo;
4. actualizar `research/coverage-audit.json`;
5. ejecutar validators.

Newsroom horario no necesita alterar este ledger en un no-op. Si publica una noticia en una jornada abierta, actualiza dailyCoverage/history-coverage; la auditoría exhaustiva del día puede cerrarse después.

## Candidatos

`candidateStats` usa:
- `found`;
- `published`;
- `discarded`;
- `unresolved`.

No inventar cifras. Usar `null` cuando el método histórico anterior no conservó el dato.

## Filosofía

La meta es que `complete` signifique algo comprobable: no “parece que buscamos suficiente”, sino “sabemos qué fuentes/categorías se revisaron y qué pasó con los candidatos”.
