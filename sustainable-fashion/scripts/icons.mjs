// Renders the PWA icons (PNG) from an inline SVG using the bundled Chromium.
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const EXE = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect width="64" height="64" rx="${pad ? 0 : 14}" fill="#2F5D3A"/>
  <g fill="none" stroke="#F6F1E8" stroke-width="4" stroke-linecap="round" transform="translate(32 32) scale(${pad ? 0.8 : 1}) translate(-32 -32)">
    <path d="M14 20h36M14 32h36M14 44h36"/>
    <path d="M22 12v40M32 12v40M42 12v40" stroke="#D9A23A" stroke-dasharray="8 4"/>
  </g>
</svg>`;

const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
for (const [file, size, pad] of [["public/icon-512.png", 512, true], ["public/icon-192.png", 192, true], ["public/apple-touch-icon.png", 180, false]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:#2F5D3A">${svg(pad).replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`);
  const buf = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: size, height: size } });
  writeFileSync(file, buf);
  console.log("wrote", file);
}
await browser.close();
