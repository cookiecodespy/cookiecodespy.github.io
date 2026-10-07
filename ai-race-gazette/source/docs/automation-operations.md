# AI Race Gazette — operaciones de automatización

Fecha: 2026-10-07.

## Diagnóstico de escritura GitHub

La conexión GitHub del usuario tiene permisos de repositorio `admin/push` y el permiso específico de la app está configurado como “Allow all actions”.

Por tanto, un rechazo durante una ejecución programada no debe diagnosticarse automáticamente como “el repositorio no permite escribir”.

Las Scheduled Tasks pueden usar apps conectadas, pero una acción que modifica datos externos puede quedar sujeta a aprobación/controles adicionales del producto. Si esto ocurre, el run debe tratarlo como una limitación de ejecución desatendida, no como pérdida de datos.

## Regla ante bloqueo

Cuando una escritura sea rechazada:
1. abortar el lote antes de dejar archivos desincronizados;
2. no reintentar repetidamente en la misma ejecución;
3. no desactivar automáticamente la tarea;
4. conservar el evento como candidato listo para publicación;
5. reportar: evento, fuentes, eventKey propuesto, archivos que pretendía cambiar y naturaleza del bloqueo;
6. en el siguiente run deduplicar otra vez contra `main`.

## Paquete de publicación pendiente

El reporte debe ser suficiente para que un chat interactivo pueda publicar sin rehacer toda la investigación:
- título;
- compañía/producto;
- date/announcedAt;
- eventKey;
- fuentes;
- resumen;
- puntos técnicos/availability/pricing;
- claims que requieren atribución;
- notas de incertidumbre;
- imageBrief;
- sugerencia de profundidad.

## Separación de fallos

- fallo de investigación => no publicar;
- fuente ambigua => no publicar;
- conflicto concurrente => no publicar ese evento;
- rechazo de escritura => contenido listo, publicación pendiente;
- fallo de mirror/RSS después de una escritura => prioridad crítica: reparar sincronización antes de nuevas noticias.
