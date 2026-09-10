// Renderiza animation.html quadro a quadro (Playwright/Chromium) e codifica em MP4 (H.264).
// Uso: node render.mjs                -> renderiza os 10 s completos em output/seu-video-ja-comecou-10s.mp4
//      node render.mjs --preview 0.3,1.55,2.0  -> salva quadros isolados em output/preview_<t>.png
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FPS = 60, DURATION = 10, WIDTH = 1920, HEIGHT = 1080;
const args = process.argv.slice(2);
const previewIdx = args.indexOf('--preview');
const preview = previewIdx >= 0 ? args[previewIdx + 1].split(',').map(Number) : null;
const outDir = path.resolve('output');
const framesDir = path.join(outDir, 'frames');
const outFile = path.join(outDir, 'seu-video-ja-comecou-10s.mp4');
fs.mkdirSync(framesDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
await page.goto('file://' + path.resolve('animation.html'));
await page.evaluate(() => Promise.all([document.fonts.load("700 100px 'League Spartan'"), document.fonts.load("600 100px 'Arimo'")]));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(150);

if (preview) {
  for (const t of preview) {
    await page.evaluate(t => window.seek(t), t);
    const file = path.join(outDir, `preview_${t.toFixed(2)}.png`);
    await page.screenshot({ path: file });
    console.log('preview', file);
  }
} else {
  const total = FPS * DURATION;
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.seek(t), i / FPS);
    await page.screenshot({ path: path.join(framesDir, `f${String(i).padStart(4, '0')}.png`) });
    if (i % 60 === 0) console.log(`frame ${i}/${total} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  }
  const ffmpeg = process.env.FFMPEG || 'ffmpeg';
  const res = spawnSync(ffmpeg, [
    '-y', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow', '-profile:v', 'high',
    '-movflags', '+faststart', '-r', String(FPS), outFile,
  ], { stdio: 'inherit' });
  if (res.status !== 0) { console.error('ffmpeg falhou'); process.exit(1); }
  console.log('vídeo gerado em', outFile);
}
await browser.close();
