# Recuperación segura tras una interrupción de ChatGPT

## Principio
El estado de AI Race Gazette es **GitHub main**, no el último mensaje visible en un chat.
Nunca repetir un cambio ni declararlo terminado solo porque una respuesta anterior lo afirmó.

## Reentrada obligatoria
1. Consultar commit SHA y mensaje de main.
2. Leer data/news.json y source/public/data/news.json; comparar bytes.
3. Leer feed.xml en ambos espejos; comparar bytes y cantidad de artículos.
4. Comparar dailyCoverage con docs/history-coverage.json, fechas contiguas y conteos reales.
5. Leer ops/backlog.json, docs/master-checklist.md y verificar generación determinista.
6. Revisar source/visual/image-queue.json + manifest y contar briefs pendientes.
7. Ver último resultado de Build AI Race Gazette, Validate Content, Visual Sync y Live Smoke.
8. Revisar la automatización horaria activa sin crear otra; una segunda Gazette debe permanecer deshabilitada.

## Antes de continuar un paso
- Releer main y comprobar id/eventKey para evitar duplicados.
- Investigar fuente y fecha originales; separar primera publicación de artículos recapitulativos.
- Guardar cambios lógicos consistentes en un commit atómico, preferiblemente
  JSON A + JSON B + RSS A + RSS B + history coverage, o
  manifest + queue + binario de imagen.
- Usar la comprobación de HEAD/base tree y actualización condicional. No forzar push.
- Confirmar CI del commit. Sin CI verde, estado sigue in_progress/blocked.
- Todo hallazgo nuevo entra en backlog y su master-checklist se regenera.

## Fallas típicas y respuesta
- **CI rojo:** leer job logs y corregir causa real antes de cerrar.
- **GitHub write blocked:** registrar incidente, no desactivar la Scheduled Task,
  no enviar múltiples intentos idénticos, entregar paquete para publicación autorizada.
- **Otro escritor actualizó main:** volver a leer main, recomputar cambios, deduplicar.
- **Arte no aparece en Pages:** comprobar source/public, compilación, staging de binarios
  nuevos, Pages y respuesta HTTP final.
- **Fecha complete sin Backbone v1:** reabrir partial, volver a auditar con evidencia.
- **Front-end en vivo distinto del repositorio:** comparar commit de compilación y
  último run de Pages; no asumir propagación instantánea.

## Criterio de comunicación
Informar únicamente lo comprobado: commit, archivos afectados, tests y resultado de
GitHub Pages. Separar trabajo terminado de investigación pendiente, arte no producido
y automatizaciones todavía sin prueba de ejecución autónoma.
