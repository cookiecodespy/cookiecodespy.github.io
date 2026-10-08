# AI Race Gazette — auditoría Visual Desk 2026-10-07

## Resultado

El archivo tenía identidad visual coherente, pero una biblioteca demasiado pequeña para el volumen editorial actual.

Baseline:
- 49 artículos;
- 4 imágenes hero editoriales registradas;
- 34 artículos usan `assets/hero.webp`;
- 12 usan `assets/google.webp`;
- 2 usan `assets/globe.webp`;
- 1 usa `assets/mistral.webp`;
- 1 artículo ya declara explícitamente `needs-specific-art` (Claude Haiku 5.5);
- 48 artículos todavía no tenían estado visual explícito.

## Riesgo principal

La reutilización de cuatro ilustraciones en 49 historias hace que noticias editorialmente diferentes se perciban demasiado parecidas. A medida que el archivo crezca, esto reduce:
- reconocimiento visual;
- sensación de cobertura propia;
- capacidad de distinguir productos/compañías;
- valor de las páginas internas Reporter V2.

## Solución aplicada

Se creó Visual Desk v1 con:
- `visual/asset-manifest.json`;
- `visual/image-queue.json`;
- `scripts/refresh_visual_queue.py`;
- `scripts/validate_visual_desk.py`;
- `docs/visual-desk.md`;
- validación CI;
- métricas visuales en `quality-audit.py`.

## Backlog inicial

La cola inicial contiene 49 historias:
- P0: 1;
- P1: 33;
- P2: 12;
- P3: 3.

Después de la dirección de arte del primer lote:
- brief-ready: 12;
- needs-art-direction: 37.

Los 12 briefs listos cubren Claude Haiku/Sonnet/Opus 5.5, GPT-6 Astra, Mistral Large 4, Gemini 3.8 Flash/Flash Cyber, NVIDIA PAIR, Qwen3.8-Max, Grok Bot Enterprise, Waymo y TCS HyperVault.

P0 corresponde a la historia que ya pide explícitamente arte específico. P1 representa principalmente artículos atrapados en el hero genérico reutilizado.

## Política de cierre

No intentamos sustituir 49 imágenes con arte mediocre solo para bajar una métrica.

Orden:
1. P0;
2. grandes lanzamientos Reporter V2;
3. P1 por importancia editorial;
4. P2;
5. P3.

Cada sustitución exige QA factual y visual.

## Próximo lote visual recomendado

Primer lote de producción:
- Claude Haiku 5.5;
- Claude Sonnet 5.5;
- Claude Opus 5.5;
- GPT-6 Astra;
- Mistral Large 4 (si se decide mejorar su pieza existente);
- Gemini 3.8 Flash / Flash Cyber;
- NVIDIA PAIR;
- Qwen 3.8 Max;
- Grok Bot Enterprise;
- una pieza genérica de agentes;
- una de chips/datacenter;
- una de robótica.

El objetivo del primer lote no es “cerrar todo”, sino crear una biblioteca reutilizable y varias historias específicas que reduzcan rápidamente la monotonía visual.

## Regla de verdad visual

Una imagen generada es ilustración editorial, no evidencia del evento. Debe acreditarse como tal y nunca simular una fotografía documental, una interfaz real o una instalación concreta sin evidencia.


## Primer lote ya art-directed

Se prepararon briefs específicos, no prompts genéricos por título, para 12 historias representativas:
- tres niveles de Claude 5.5;
- un frontier model de OpenAI;
- Mistral;
- dos historias Gemini;
- infraestructura local NVIDIA;
- Qwen;
- agentes empresariales xAI;
- robótica/autonomía Waymo;
- infraestructura de datacenter TCS.

Esto crea un lote equilibrado entre modelos, agentes, seguridad, infraestructura y robótica para probar el lenguaje visual antes de producir decenas de imágenes.
