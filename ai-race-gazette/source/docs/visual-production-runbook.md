# AI Race Gazette — Visual Production Runbook

Fecha: 2026-10-07.

## Flujo E2E

Visual Desk v1 separa generación, QA y publicación.

1. Elegir el siguiente item P0/P1 de visual/image-queue.json.
2. Confirmar que el brief representa el artículo y no convierte metáforas en hechos.
3. Generar arte preferentemente 3:2, 1600 px o más, estilo grabado Gazette, sin texto ni logos falsos.
4. Hacer QA visual: factualidad, crop, legibilidad, ausencia de UI/fotografía documental falsa.
5. Convertir el archivo aprobado a WebP real.
6. Publicarlo con scripts/publish_visual_asset.py.
7. Ejecutar validators y build.
8. Hacer commit normal; CI copia el asset de source/public a la web pública.

## Comando

python3 scripts/publish_visual_asset.py --article-id claude-haiku-5-5 --input /ruta/claude-haiku-5-5.webp --asset-id story-claude-haiku-5-5-v1 --alt "Grabado editorial..." --tags "anthropic,claude,models,agents"

El script copia el binario a source/public/assets/news/YYYY-MM-DD/<id>.webp, actualiza ambos news.json, registra el asset y marca la cola como completa.

## Validación

python3 scripts/editorial.py --validate-only
python3 scripts/validate_visual_desk.py
python3 scripts/quality-audit.py
python3 -m unittest tests/visual_publish_test.py
npm test
npm run build

## Atomicidad

La unidad visual de publicación es: binario + manifest + news mirror A + news mirror B + queue. Si una plataforma no permite garantizar el conjunto, abortar antes de cambiar el artículo.

## Upload binario desde ChatGPT

GitHub soporta blobs Base64 + trees + commits. Cuando el runtime de ChatGPT tenga acceso a los bytes del arte aprobado, puede usarse ese camino. El asset canónico sigue viviendo en source/public y CI publica la copia compilada.

## Rollback

Si el arte falla QA, restaurar el fallback registrado, devolver imageStatus a needs-specific-art, conservar id/eventKey y eliminar el asset específico solo si ya no tiene referencias.
