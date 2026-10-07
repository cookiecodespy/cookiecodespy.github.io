# AI Race Gazette — política de imágenes y Visual Desk

## Objetivo

Cada historia debe tener una identidad visual útil y coherente con el estilo de grabado/periódico del Gazette sin confundir ilustración con evidencia fotográfica.

## Niveles

### 1. Biblioteca editorial
Arte reusable por compañía/categoría. Es el fallback por defecto.

### 2. Ilustración específica
Preferida para:
- modelos frontier;
- chips/hardware;
- robótica;
- adquisiciones/acuerdos grandes;
- compañías nuevas importantes;
- investigaciones destacadas.

### 3. Diagrama
Usar cuando explica arquitectura, cronología, precios, disponibilidad o comparación mejor que una ilustración decorativa.

### 4. Imagen oficial
Solo si su uso es apropiado y la atribución/licencia es clara. Nunca descargar fotografías arbitrarias de medios.

## Flujo correcto

1. investigar y verificar;
2. cerrar el enfoque del artículo;
3. redactar un `imageBrief`;
4. seleccionar arte de biblioteca o crear arte específico;
5. acreditar;
6. publicar.

La noticia no se retrasa por arte si existe un fallback editorial adecuado.

## Automatización

La tarea horaria puede seleccionar arte existente y marcar `imageStatus`.

La generación autónoma + carga de binarios a GitHub se considera una capacidad separada del Newsroom textual. Hasta comprobar un pipeline fiable, la tarea NO debe prometer que cada ejecución podrá generar y subir una imagen nueva. En su lugar deja `imageBrief` + `imageStatus: needs-specific-art` para el Visual Desk.

Esto evita que una limitación de herramientas de imagen impida publicar una noticia verificada.

## Brief recomendado

Incluir:
- compañía/producto;
- idea central;
- metáfora visual;
- objetos permitidos;
- qué evitar;
- formato/orientación;
- estilo Gazette: grabado editorial, tinta/sepia, prensa antigua, textura de papel;
- prohibición de logotipos falsos, interfaces inventadas presentadas como reales o escenas engañosamente documentales.
