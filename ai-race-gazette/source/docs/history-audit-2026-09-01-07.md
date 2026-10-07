# Auditoría histórica · 1–7 de septiembre de 2026

Fecha de revisión: 2026-10-07.

## Resultado

El lote **2026-09-01 → 2026-09-07** queda marcado como `complete` bajo la definición editorial de AI Race Gazette. Se realizaron dos pasadas de investigación, se revisaron fuentes primarias de actores principales y emergentes, se verificaron fechas y fases de disponibilidad, se deduplicó por `eventKey` y sólo se publicaron novedades materiales.

El bloque contiene **36 artículos verificados**:
- 2026-09-01: 12 artículos
- 2026-09-02: 8 artículos
- 2026-09-03: 6 artículos
- 2026-09-04: 4 artículos
- 2026-09-05: 2 artículos
- 2026-09-06: 2 artículos
- 2026-09-07: 2 artículos

## Método

1. Se partió del archivo actual y de `history-candidates.json`; la maqueta antigua se trató únicamente como conjunto de pistas.
2. Primera pasada por fecha en fuentes oficiales, documentación técnica, repositorios y anuncios corporativos.
3. Segunda pasada inversa por actor y categoría para localizar omisiones que no aparecían en los resúmenes diarios.
4. Se comprobó fecha original, producto, fase de disponibilidad y naturaleza de las cifras.
5. Se separaron hechos, afirmaciones del proveedor y reportes externos.
6. Se deduplicó contra los artículos existentes. Claude Fable 5.1, Claude Mythos 5.1 y Lyria 3.5 ya estaban verificados y se conservaron sin recrearlos.
7. Se revisaron ids/eventKeys, fuentes HTTPS, espejo público, RSS y conteos de cobertura.

## Actores y áreas revisadas

Se revisaron anuncios y canales de OpenAI, Anthropic, Google/DeepMind, Meta, xAI, AWS/Amazon, NVIDIA, Alibaba/Qwen, GitHub, Waymo, CrowdStrike, Perplexity, IFM, OpenBMB y actores emergentes de seguridad, agentes e infraestructura.

Además se buscaron novedades materiales de Apple, Cohere, ElevenLabs, Mistral, CoreWeave, Cerebras/Groq y otros actores relevantes. No se creó un artículo cuando no apareció una novedad independiente material y fechada dentro de la ventana, o cuando sólo había un changelog menor, repetición de marketing o una pista sin evidencia suficiente.

## Decisiones editoriales

- Los titulares de la maqueta antigua no se importaron como hechos.
- Los changelogs pequeños no se convirtieron automáticamente en noticias.
- Benchmarks, ahorros y métricas de fabricantes quedan atribuidos a sus autores; el Gazette no los transforma en rankings propios.
- El incidente de agentes de OpenAI coordinándose mediante una wiki queda rotulado como **Reporte** y añade la respuesta posterior de OpenAI como fuente relacionada.
- El acuerdo NVIDIA–Hugging Face se describe como acuerdo sujeto a cierre, no como adquisición ya consumada.
- Previews, pruebas, despliegues graduales y accesos restringidos se distinguen de disponibilidad general.
- Financiación se publica sólo cuando es material para la lectura de la carrera, como HiddenLayer y Wonderful.

## Estado del proyecto

Este lote histórico está cerrado. El siguiente bloque de reconstrucción es **8–14 de septiembre de 2026**. El archivo global continúa en estado `partial` hasta completar los lotes restantes.
