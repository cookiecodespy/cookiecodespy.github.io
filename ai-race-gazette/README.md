# AI Race Gazette — referencia de diseño y producto

## Objetivo general
Crear una **web pública estilo diario antiguo / retro / envejecido**, orientada a noticias del mundo de la IA.
La estética debe verse como un **periódico físico antiguo deteriorado**, con mucha personalidad visual y un acabado más premium y detallado que la maqueta actual.

## Referencia visual principal

![Referencia visual principal](assets/reference-look.jpg)
- Archivo incluido en esta carpeta: `reference-look.jpg`
- Esta imagen es la **referencia principal de look & feel**.
- La meta es acercarse a ese nivel de detalle visual: papel envejecido, bordes quemados, textura realista y composición editorial más rica.

## Qué quiere el usuario (resumen claro)
El usuario quiere que la página:
1. **Se vea como un diario antiguo deteriorado**.
2. Tenga **bordes y esquinas quemadas / rotas / gastadas** en la página general y en las hojas internas.
3. Se sienta más **detallada y menos básica** que las versiones anteriores.
4. Muestre noticias de IA como si fueran **portadas / ediciones** de diario.
5. Permita **presionar una portada** para abrir una **página completa del diario** con más detalle.
6. Esa página interna debe incluir:
   - titular principal,
   - bajada / resumen,
   - desarrollo más completo,
   - imágenes si es necesario,
   - puntos clave,
   - enlace a la **fuente oficial/original**.
7. Idealmente, la portada también podría llevar directo a la fuente original, pero la preferencia es:
   - **primero abrir la página del diario**, y desde ahí ofrecer el link a la fuente oficial.

## Decisión UX / navegación
### Home / portada principal
- La home debe funcionar como **archivo interactivo / hemeroteca**.
- Debe mostrar múltiples noticias o ediciones.
- Cada noticia se presenta como:
  - una mini portada,
  - o una tarjeta/editorial con estética de periódico.

### Interacción deseada
- **Click en portada/tarjeta** → abre una **página/overlay/entrada completa** estilo diario.
- Dentro de esa vista interna:
  - contenido más completo,
  - más contexto,
  - posiblemente más imágenes,
  - botón o link visible: **“Ver fuente oficial”** / **“Fuente original”**.

## Dirección estética exacta
La web NO debe decir explícitamente cosas como:
- “noticias de IA en páginas de diario antiguo”
- “maqueta vintage”
- “retro tech newspaper” como explicación obvia del concepto

En cambio, debe verse así por diseño, pero el contenido público debe sentirse profesional, por ejemplo con naming como:
- **Noticias de IA**
- **AI Race Gazette**
- **Edición diaria**
- **Archivo diario**
- **Cobertura de la industria**
- **Archivo interactivo**

## Detalles visuales obligatorios
### Papel / superficie
- textura de papel antiguo
- ligeras arrugas o fibras visuales
- tonos crema / sepia / pergamino
- sombreado irregular
- envejecimiento no uniforme

### Bordes y esquinas
- bordes irregulares
- esquinas cortadas / erosionadas
- zonas quemadas oscuras
- desgaste visible en el contorno
- sensación de hoja física real

### Composición gráfica
- filetes editoriales
- divisores finos y dobles líneas
- ornamentos pequeños tipo prensa antigua
- jerarquía tipográfica fuerte
- titulares grandes y dramáticos
- sensación de portada real, no simple tarjeta web

### Profundidad / acabado
- nada demasiado plano
- más detalle visual
- más trabajo en marcos, cajas y secciones
- hero principal con más presencia
- bloques que parezcan “columnas de diario” o “recortes impresos”

## Estructura recomendada del sitio
### 1) Página principal
Secciones sugeridas:
- encabezado / masthead del diario
- barra de búsqueda
- filtros por mes / categoría / compañía
- portada destacada del día
- grilla o archivo de noticias/portadas anteriores

### 2) Página de noticia (o modal grande / overlay)
Estructura sugerida:
- fecha / edición
- categoría(s)
- titular grande
- subtítulo o bajada
- imagen principal
- cuerpo estilo artículo
- puntos clave o “claves de la edición”
- citas destacadas
- enlaces relacionados
- botón final a fuente oficial

## Contenido / tono editorial
- público
- profesional
- útil
- serio pero llamativo
- sin explicar demasiado el concepto “retro”: el diseño lo comunica solo

## Qué no gustó de versiones previas
- se veían demasiado básicas
- el deterioro visual era muy sutil
- faltaba fuerza en esquinas y bordes quemados
- faltaba nivel de detalle en la página como objeto físico
- no se acercaba lo suficiente a la referencia visual final

## Requisito funcional importante
La experiencia ideal es:
- **Portada** → **abre página completa tipo diario** → **desde ahí link a fuente oficial**

No solo:
- portada → fuente externa directa

Aunque se puede dejar como opción secundaria.

## Implementación sugerida para versión 1 real
- Publicar con **GitHub Pages**
- Estructura de datos en JSON/MD para noticias diarias
- Automatización posterior con scheduled task / GitHub Action
- Diseñar primero una **maqueta de alto detalle**, luego integrarla con datos reales

## Entregables sugeridos para Astra / PC
1. Mejorar el diseño visual hasta acercarlo a `reference-look.jpg`
2. Hacer una portada principal más fuerte
3. Diseñar una plantilla de noticia interna tipo página de diario
4. Dejar un sistema de navegación entre archivo y detalle
5. Preparar el sitio para futura automatización diaria

## Archivo incluido
- `reference-look.jpg` → referencia principal del estilo visual deseado