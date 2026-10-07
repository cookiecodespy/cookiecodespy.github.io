# AI Race Gazette — profundidad de artículos

Fecha: 2026-10-07.

## Problema detectado

Las páginas internas actuales son demasiado resumidas para la experiencia buscada. Tres párrafos breves más “Por qué importa” y “Qué seguir ahora” funcionan como briefing, pero no como una pieza editorial completa.

AI Race Gazette debe diferenciar entre la **portada resumida** y el **artículo/informe completo**.

## Objetivo editorial

La portada debe seguir siendo rápida de escanear. Al abrir una noticia, el lector debe recibir suficiente contexto para entender:
- qué ocurrió;
- qué anunció realmente la empresa;
- qué producto o tecnología cambió;
- antecedentes relevantes;
- detalles técnicos verificables;
- disponibilidad, regiones, precio o requisitos si existen;
- qué afirma el proveedor y qué está comprobado de forma independiente;
- cómo encaja frente a competidores;
- por qué importa para la carrera de la IA;
- riesgos, limitaciones o datos aún no confirmados;
- qué conviene vigilar después;
- fuentes oficiales y secundarias útiles.

No alargar por rellenar. La longitud debe seguir la importancia y la cantidad de información verificable.

## Longitud objetivo

### Actualización menor
Aproximadamente 350–600 palabras.
Ejemplos: nueva disponibilidad regional, integración puntual, cambio de precio o beta pequeña.

### Noticia estándar
Aproximadamente 700–1.200 palabras.
Debe ser el formato normal para lanzamientos relevantes.

### Noticia mayor / informe
Aproximadamente 1.200–2.000 palabras cuando la fuente y relevancia lo justifican.
Ejemplos: nuevo modelo frontier, nueva plataforma de agentes, adquisición importante, nueva arquitectura de hardware, cambio competitivo material.

No existe un mínimo rígido si la fuente no da suficiente información. Nunca completar con especulación para alcanzar una cifra.

## Estructura recomendada

Cada artículo completo debería cubrir, cuando aplique:

1. **Qué pasó**
   - anuncio exacto;
   - fecha;
   - quién lo anunció;
   - estado: preview, beta, GA, research, rumor, etc.

2. **Qué cambia**
   - diferencia respecto del producto/modelo anterior;
   - nuevas capacidades;
   - cambios de acceso o distribución.

3. **Detalles técnicos**
   - arquitectura, contexto, modalidades, parámetros, benchmarks, hardware, API o integración;
   - atribuir cifras y benchmarks al proveedor cuando sean claims propios.

4. **Disponibilidad y precio**
   - países;
   - planes;
   - API;
   - open weights;
   - condiciones de acceso;
   - precio conocido;
   - si un dato no está publicado, decirlo.

5. **Contexto y antecedentes**
   - qué existía antes;
   - qué problema intenta resolver;
   - anuncios anteriores relacionados.

6. **Impacto competitivo**
   - cómo afecta a rivales o al mercado;
   - comparaciones solo cuando haya base verificable;
   - no convertir opinión en hecho.

7. **Por qué importa**
   - análisis editorial separado de los hechos.

8. **Limitaciones / qué falta saber**
   - acceso restringido;
   - métricas no independientes;
   - fechas pendientes;
   - claims todavía no comprobados.

9. **Qué seguir ahora**
   - siguientes hitos concretos.

10. **Fuentes**
   - fuente primaria;
   - documentación técnica;
   - fuentes secundarias de alta reputación cuando aporten contexto distinto.

## Portada versus artículo

La tarjeta/portada mantiene:
- título;
- resumen corto;
- 2–3 puntos clave;
- tags.

La página interna NO debe limitarse a repetir esa información. Debe expandirla sustancialmente.

## Investigación histórica

Historical Backfill no solo añade noticias faltantes. Cuando encuentre un artículo existente demasiado breve dentro del período que está auditando, debe enriquecerlo hasta el nivel apropiado sin cambiar su `id` ni su `eventKey`.

## Automatización horaria

Automation & Newsroom puede publicar una versión inicial suficientemente completa de una noticia nueva. No debe publicar tres párrafos superficiales solo por ser rápido.

Si el anuncio acaba de salir y todavía falta documentación:
- publicar solo si ya existe suficiente información verificable;
- marcar claramente lo que falta;
- enriquecer el mismo artículo después cuando aparezcan detalles materiales;
- conservar el mismo id/eventKey.

## Calidad sobre longitud

Un artículo de 800 palabras verificadas es mejor que uno de 1.500 con relleno. La profundidad significa más evidencia, contexto y utilidad, no más texto por sí mismo.
