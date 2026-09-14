# Weft — sustainable fashion, decoded

A mobile-first, installable web app (PWA) that makes sustainable fashion visual and
interactive, with every number tied to a cited source. Built with React + Vite, no
backend, works offline after the first load.

## The three dimensions

1. **Learn — what "sustainable" means and how brands are graded.**
   Six lenses (climate, water & chemicals, materials & waste, people, animals,
   transparency) each with headline evidence; profiles of the five rating systems
   (Good On You, Fashion Transparency Index, Higg Index, B Corp, Remake); a
   certification decoder (GOTS, OEKO-TEX, Fair Trade, bluesign, RWS/RDS, LWG,
   FSC/Canopy, Fair Wear); a "Grade a brand" rubric you fill in against any
   brand's website; and a "Greenwash or not?" quiz built from real claims.
2. **Fabrics — how they're made, moved, worn and cared for.**
   Sixteen fibres (cotton, organic cotton, linen, hemp, wool, cashmere, silk,
   leather, polyester, recycled polyester, nylon, elastane, acrylic, viscose,
   lyocell, modal), each with a seven-metric impact profile, a step-by-step journey
   from farm/oil well to wardrobe with transport modes, care tips to extend life,
   and what to look for on the label. Tools: a radar-chart fibre comparison, an
   interactive garment label, all 23 ISO 3758 care symbols with a quiz, and a
   "Make it last" calculator that shows how keeping and washing habits change the
   footprint per wear.
3. **Shop — match your style, budget and values.**
   Thirty-five brands from Patagonia to Shein, each with a style palette and
   garment glyphs, a price tier with typical prices, a six-lens score you can
   re-weight with sliders, its Good On You band, certifications, programmes,
   strengths and documented concerns. A four-step matcher ranks brands by style
   fit, price fit and your weighted sustainability score.

Every statistic carries a numbered chip; tapping it opens the source (research
paper, industry LCA, NGO index, regulation or journalism). The full list is on the
Sources screen, and the scoring method is on the "How we score" screen.

## Run it

```bash
cd sustainable-fashion
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build
```

Deploy `dist/` to Netlify, Vercel or GitHub Pages (set `base` in `vite.config.js`
for a subpath). On a phone, open the URL and "Add to Home Screen" to install.

## Keeping the data honest

- `src/data/sources.js` — the citation registry. Add a source here first.
- `src/data/sustainability.js` — lenses, raters, certifications, greenwash claims, the grading rubric.
- `src/data/fabrics.js` — fabric profiles, journeys, care tips, care symbols.
- `src/data/brands.js` — brand entries and the scoring helpers.

Brand scores were compiled in 2026 from public disclosures and ratings and are a
synthesis for relative comparison, not an audit. Re-check a brand's latest report
and Good On You before buying; the app says so on every brand page.

## Scripts

- `node scripts/icons.mjs` regenerates the PWA icons from the SVG mark.
- `npm run shots` screenshots every route at phone width in light and dark mode
  (needs a running `npm run preview` on port 4173).
