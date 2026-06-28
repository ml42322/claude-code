# Mimi's Recipe Box — installable web app (PWA)

A self-contained React app: Pantry, Test Kitchen, and Menus, with a grocery-list
builder. It saves everything **on your device** (via IndexedDB) and can be
**installed to your home screen** and used offline.

Your four recipes (chive pockets, sourdough boule, focaccia, and Eric's oxtail
soup) are already baked in as starters.

---

## 1. What you need
- **Node.js 18+** installed (https://nodejs.org — get the "LTS" version).
- A terminal (Terminal on Mac, PowerShell on Windows).

## 2. Run it locally
From inside this folder:

```bash
npm install      # one time — downloads dependencies
npm run dev      # starts a local server
```

Open the URL it prints (usually http://localhost:5173). Edit and play.

## 3. Build the production version

```bash
npm run build
```

This creates a **`dist/`** folder — that's the whole website, ready to host.
You can preview the built version with `npm run preview`.

## 4. Put it online (pick one)

**Easiest — Netlify Drop (no account juggling):**
1. Go to https://app.netlify.com/drop
2. Drag the **`dist`** folder onto the page.
3. You get a live URL like `https://your-name.netlify.app`. Done.

**Auto-deploy on every change — Vercel or Netlify via GitHub:**
1. Push this folder to a GitHub repo.
2. In Vercel/Netlify, "Import" the repo. Build command `npm run build`,
   publish directory `dist`. It redeploys whenever you push.

**GitHub Pages:** works too, but it serves from a subpath, so first set
`base: "/your-repo-name/"` in `vite.config.js`, then build and deploy `dist`.

> HTTPS is required for a PWA to install. Netlify/Vercel/Pages all give you
> HTTPS automatically, so you're covered.

## 5. Install it on your phone
Open your live URL on your phone's browser:
- **iPhone (Safari):** Share button → **Add to Home Screen**.
- **Android (Chrome):** menu (⋮) → **Install app** / **Add to Home screen**.

It launches full-screen with its own icon, and works offline after the first visit.

---

## Where your data lives
Recipes, experiments, menus, and grocery check-offs are stored in your browser's
**IndexedDB**, on that device. Notes:
- It is **not synced** across devices — your phone and laptop keep separate copies.
- Clearing the browser's site data (or deleting the installed app) erases it.
- If you later want cross-device sync, swap `src/storage.js` for a small
  Supabase/Firebase client — the rest of the app calls `window.storage.get/set/
  delete/list`, so only that one file changes.

## Custom domain (optional)
Netlify/Vercel let you attach a domain in their dashboard (Domain settings).
Buy one from Porkbun/Namecheap/Cloudflare (~$12/yr for a .com), then follow
their "add custom domain" steps. Totally optional — the free `*.netlify.app`
URL works the same.

## Editing the recipes / look
- App code: `src/RecipeBox.jsx`
- App name, colors, icons: `index.html`, `vite.config.js` (manifest), `public/`
- Storage behavior: `src/storage.js`
