# Fase 5 — 12 y 13 de septiembre de 2026 (segunda conversación, ronda adicional)

**Estado:** investigación y resolución de fechas de varios candidatos, NO auditoría exhaustiva por fuente y categoría. **No cerrar** 12/13 como `complete` ni `reviewed-no-material-news` sin doble pasada, discovery abierto por organizaciones y un ledger con fuentes consultadas.

## Candidato publicado en esta rama

**13 Sep — Shanghai AI Laboratory / InternLM, Intern-S2-397B (pesos del checkpoint final).**

- Modelo y licencia oficial Apache 2.0: https://huggingface.co/internlm/Intern-S2-397B
- Historial de commits de la subida original: https://huggingface.co/internlm/Intern-S2-397B/commits/main
- Página oficial de versiones Preview y final: https://github.com/InternLM/Intern-S1
- Guía oficial de despliegue: https://github.com/InternLM/Intern-S1/blob/main/docs/interns2_397b_user_guide.md
- Verificación temporal adicional (fuente periodística secundaria publicada 13 Sep): https://agenccy.ai/news/shanghai-ai-lab-shipped-403b-weights-with-no-readable-scores/
- Editorial: distinguir `Preview` de pesos finales, no confundir nombre 397B con capacidad de RAM, no convertir benchmark gráfico del fabricante en evaluación independiente. `id` = `internlm-intern-s2-397b-open-weights-2026-09-13`.
- El día pasa de `pending` a `partial`, no a `complete`.

## Hallazgos que NO corresponden al 12/13

1. **MiniCPM5-2B** aparece fechado el 12 Sep en algunos medios, pero el README del proyecto anuncia oficialmente `[2026.09.07]`: https://github.com/Marvel202/minicpm . Reabrir auditoría **7 Sep**, no asignar 12.
2. **Cohere North Small Translate:** el changelog oficial tiene fecha **9 Sep**, aunque su paper se subió a arXiv el 12 Sep y notas secundarias hablaron del modelo posteriormente: https://docs.cohere.com/changelog/north-small-translate-1-0 ; https://arxiv.org/abs/2609.13916 . Evento comercial del 9, no segundo lanzamiento el 12 sin cambio material.
3. **Cognition SWE-2:** anuncio propio con fecha **10 Sep**: https://cognition.com/blog/swe-2 . Revisar backfill del 10, no titularlo 13 por artículos posteriores.
4. **Upstage Solar Mini 4:** anuncio oficial **1 Oct** (https://www.upstage.ai/blog/en/solar-mini-4); índice secundario lo asocia erróneamente al 13 Sep. No moverlo de octubre.
5. **Unitree UnifoLM-WLA-1.0:** el README oficial enumera pesos ER-1/ER-Flow el **11 Sep**, módulos el 20 y base + fine-tuning el 28 Sep: https://github.com/unitreerobotics/unifolm-wla . Notas secundarias del 12 no prueban apertura de todos los pesos WLA el 12.
6. **ElevenLabs Music v2.5:** publicación del proveedor el **11 Sep** en su comunidad oficial, no el 13: https://www.reddit.com/r/ElevenLabs/comments/1wdl4yo/introducing_music_v25_in_elevenmusic_our_best/ . Revisar el día 11 con documentación primaria del producto.
7. **Dream-RSI:** primera versión arXiv recibida en UTC el **14 Sep**, aunque indexadores lo listan en el 13: https://arxiv.org/abs/2609.14858 . No reetiquetar de forma artificial.
8. **World Labs Atlas:** anuncio primario del **1 Sep** y podcast posterior el 13; ya figuraba en continuidad anterior. https://www.worldlabs.ai/blog/atlas

## Candidatos aún por resolver

- **AllSpark Iris-mini/Iris-pro:** paper apareció el 3 Sep (https://arxiv.org/abs/2609.04304). Hay evidencias secundarias de entrega de pesos y harness el 13 Sep, con assets primarios existentes hoy: https://github.com/AllSpark-Research/Iris y https://huggingface.co/AllSpark-Research/Iris-mini . Antes de publicar como *evento de disponibilidad* del 13, comprobar primera fecha de los pesos por historial del repositorio. No confundir paper del 3 con release de pesos.
- **Intern-S2 variantes FP8:** comprobar si disponibles en el mismo evento o si tienen fecha distinta, sin fragmentar por cada formato.
- **Novedades originales 12 Sep:** continúan en búsqueda abierta por empresas/sectores. La falta de noticias en esta primera pasada NO certifica que el día haya carecido de hechos materiales.
- **Fase 5 8–14:** faltan segunda revisión Google/DeepMind, actor emergente, fuentes originales por categoría, registro de descartes y segunda pasada inversa.

## Criterio de salida

Antes de cerrar 12/13: fuentes base por actor comprobadas, búsquedas por fecha + inversas por categorías, descubrimiento abierto, candidatos resueltos con procedencia temporal, dedupe, cobertura sincronizada y evidencia legible; `complete` solo tras segunda pasada. El ciclo horario en paralelo debe continuar atendiendo noticias recientes, nunca backfill masivo.
