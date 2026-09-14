// Screenshots every main route at phone width for a visual check.
// Usage: npm run build && npm run preview -- --port 4173 & node scripts/screenshots.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const EXE = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.env.BASE_URL || "http://localhost:4173";
const OUT = process.env.OUT_DIR || "shots";
const ROUTES = ["/", "/learn", "/learn/lens/materials", "/learn/raters", "/learn/grade", "/learn/greenwash", "/learn/certs",
  "/fabrics", "/fabrics/cotton", "/fabrics/compare", "/fabrics/labels", "/fabrics/care", "/fabrics/longevity",
  "/shop", "/shop/match", "/shop/brand/patagonia", "/shop/brand/shein", "/shop/method", "/sources"];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  for (const r of ROUTES) {
    await page.goto(`${BASE}/#${r}`);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${scheme}${r.replace(/\//g, "_") || "_home"}.png`, fullPage: true });
  }
  console.log(scheme, "done; errors:", errors.length ? errors : "none");
  await ctx.close();
}
await browser.close();
