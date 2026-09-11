# Animação "¡Tu video ya comenzó!" (10 s)

Animação de 10 segundos para overlay de VSL, reproduzindo a referência enviada:
quadro preto 16:9 com o texto **¡TU VIDEO YA COMENZÓ!**, um relógio com ponteiros
girando, o botão laranja **HAZ CLIC PARA ESCUCHAR** e um dedo que clica no botão.
Todo o texto está em espanhol latino neutro.

## Linha do tempo

O vídeo é formado por dois ciclos idênticos de 5 s, então ele também fecha em loop perfeito.

| Instante (ciclo) | O que acontece |
| --- | --- |
| 0,00 s | O vídeo já começa com o texto de cima visível (ele não anima). |
| 0,10 – 0,55 s | O relógio aparece suavemente (fade + leve escala, sem "pulo"). Os ponteiros giram o tempo todo. |
| 0,65 – 1,05 s | O quadrado laranja com o texto de baixo aparece suavemente; o dedo entra junto. |
| 1,55 s / 2,55 s / 3,55 s | O dedo vai até o canto do botão e clica (faísca azul, botão afunda e escurece por um instante). |
| 4,55 – 4,75 s | O relógio some por alguns milésimos… |
| 4,65 – 4,85 s | …e o texto de baixo (com o dedo) também some. |
| 5,00 s | O ciclo recomeça: relógio volta, depois o texto de baixo volta. |

Arquivo final: `output/tu-video-ya-comenzo-10s.mp4` (1920×1080, 60 fps, H.264, 10 s, fundo preto).

## Como renderizar de novo

Requisitos: Node 18+, Playwright (Chromium) e `ffmpeg` no PATH.

```bash
npm install
npx playwright install chromium   # só na primeira vez
npm run render                     # gera output/tu-video-ya-comenzo-10s.mp4
npm run preview                    # salva alguns quadros em output/preview_*.png
```

`render.mjs` abre `animation.html` no Chromium, chama `seek(t)` quadro a quadro
(600 quadros) e codifica os PNGs com ffmpeg. Para trocar a duração, fps ou o tempo
dos cliques, edite as constantes no topo de `render.mjs` e de `animation.html`.

## Arquivos

- `animation.html` – a animação (HTML/SVG/JS, determinística via `window.seek(t)`). Abrir no navegador mostra a animação em loop.
- `render.mjs` – renderizador (Playwright + ffmpeg).
- `assets/fonts/` – League Spartan (texto de cima) e Arimo (texto do botão), ambas SIL OFL.
- `output/` – vídeo renderizado.
