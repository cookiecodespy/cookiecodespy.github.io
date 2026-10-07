# Design QA ? AI Race Gazette

final result: passed

## Referencias y alcance

La maqueta ai-race-daily-retro-newspaper-v4.html define la estructura, los textos del resumen, los controles y su posici?n. public/assets/reference-look.jpg define el papel deteriorado y el estilo de las ilustraciones. Comparaciones lado a lado: qa/compare-covers.png y qa/compare-list.png, referencia a la izquierda e implementaci?n a la derecha, viewport 1916 ? 1010.

## Resultado

Encabezado con nombre y b?squeda; cuadro Noticias de IA con el resumen original; botones de vista y mes; etiquetas de compa??a y tema; portadas individuales o filas de lista que abren cada noticia. Se eliminaron los bloques intermedios de portada destacada y hemeroteca. Se conservaron el papel recortado, las ilustraciones, las fuentes locales, las rutas compartibles y las fuentes oficiales. Los titulares publicados proceden del archivo verificado, no del contenido de ejemplo de la maqueta.

## Correcciones y verificaci?n

Se corrigi? un desbordamiento a 320 px causado por el ancho m?nimo de las columnas interiores de las portadas. Chromium confirm? el orden de los bloques, cuatro noticias, ambas vistas, b?squeda sin acentos, filtros de compa??a/tema/mes, resultados vac?os, limpieza de filtros, rutas de art?culo y recarga. Sin desbordamiento a 320, 390, 768 y 1280 px; sin errores de p?gina ni consola. Capturas finales en qa/layout-covers-desktop.png, qa/layout-list-desktop.png y qa/home-mobile.png. Producci?n compilada correctamente.

El archivo hist?rico y la activaci?n de la tarea diaria mantienen el estado pendiente documentado en README.md. La est?tica no implica que exista cobertura verificada para todos los d?as.

## Auditoría editorial y funcional posterior

La revisión del 7 de octubre incorporó filtros combinables por día, mes con año, compañía y tema; persistencia en sesión; historial parcial desde septiembre; 15 noticias en 9 fechas; correcciones visibles y eventos independientes aunque compartan fuente. Se preservó el layout v4. Las capturas finales fueron inspeccionadas en qa/polished. Cinco pruebas de lógica, cuatro de validación y cuatro de empaquetado pasaron; Chromium verificó 60 lanzamientos simultáneos, búsqueda, recarga, filtros, teclado y reflujo a 320/390/768/1280 px, sin errores. npm audit terminó con cero vulnerabilidades conocidas. Ver docs/audit-2026-10-07.md para hallazgos y límites.
