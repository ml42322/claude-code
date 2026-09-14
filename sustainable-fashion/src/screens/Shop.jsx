import React, { useMemo, useState } from "react";
import { BRANDS, STYLES, PRICE_TIERS, LENS_KEYS, brandById, scoreBrand, bandFor } from "../data/brands.js";
import { CERTS } from "../data/sustainability.js";
import { Cite, Icon, TopBar, nav, useSheet, Chip, ScoreRing, Meter, Garment, RadarChart, LENS_COLOR, LENS_LABEL, useStored } from "../components/ui.jsx";
import { CertSheet } from "./Learn.jsx";

const DEFAULT_W = { climate: 2, water: 2, materials: 2, people: 2, animals: 2, transparency: 2 };
const useWeights = () => useStored("weights", DEFAULT_W);
const tierLabel = (t) => PRICE_TIERS.find((p) => p.tier === t).label;

export default function Shop({ segs }) {
  const [, sub, id] = segs;
  if (sub === "match") return <Match />;
  if (sub === "brand" && id) return <BrandDetail id={id} />;
  if (sub === "method") return <Method />;
  return <ShopIndex />;
}

function Tier({ t }) {
  return <span className="tier">{"$".repeat(t)}<span>{"$".repeat(4 - t)}</span></span>;
}

function BrandTile({ b, w, extra }) {
  const s = scoreBrand(b, w);
  const band = bandFor(s);
  return (
    <button className="card tap" style={{ width: "100%", textAlign: "left", padding: 14 }} onClick={() => nav(`/shop/brand/${b.id}`)}>
      <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, flex: "none", display: "grid", placeItems: "center", background: `linear-gradient(135deg, ${b.palette[0]}, ${b.palette[1]})`, color: "#fff" }}>
          <Garment type={b.garments[0]} size={32} color="rgba(255,255,255,.92)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row between">
            <h3 style={{ fontSize: 17 }}>{b.name}</h3>
            <Tier t={b.price} />
          </div>
          <p className="tiny muted" style={{ marginTop: 2 }}>{b.styles.map((x) => STYLES.find((s) => s.id === x)?.name).join(" · ")}</p>
          <div className="row" style={{ marginTop: 8, gap: 6 }}>
            <span className="swatches">{b.palette.map((c) => <i key={c} style={{ background: c }} />)}</span>
            <span className="row" style={{ gap: 2, color: "var(--muted)" }}>{b.garments.map((g) => <Garment key={g} type={g} size={20} />)}</span>
          </div>
          {extra && <div style={{ marginTop: 8 }}>{extra}</div>}
        </div>
        <div style={{ textAlign: "center", flex: "none", width: 70 }}>
          <ScoreRing score={s} size={48} stroke={5} />
          <div style={{ marginTop: 2, color: `var(--${band.color})`, fontWeight: 700, fontSize: 10.5, whiteSpace: "nowrap" }}>{band.label}</div>
        </div>
      </div>
    </button>
  );
}

function ShopIndex() {
  const [w] = useWeights();
  const [styles, setStyles] = useStored("shopStyles", []);
  const [tiers, setTiers] = useStored("shopTiers", []);
  const [sort, setSort] = useState("score");
  const list = useMemo(() => {
    let l = BRANDS.filter((b) => (!styles.length || b.styles.some((s) => styles.includes(s))) && (!tiers.length || tiers.includes(b.price)));
    if (sort === "score") l.sort((a, b) => scoreBrand(b, w) - scoreBrand(a, w));
    if (sort === "price") l.sort((a, b) => a.price - b.price || scoreBrand(b, w) - scoreBrand(a, w));
    if (sort === "name") l.sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [styles, tiers, sort, w]);
  const tog = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  return (
    <div className="screen">
      <div className="eyebrow">Dimension 3</div>
      <h1 style={{ marginTop: 4 }}>Shop by style and values</h1>
      <p className="lead">{BRANDS.length} brands, each with a style palette, a price tier and a score built from the six lenses. Weight the lenses however you like.</p>

      <button className="hero tap" style={{ width: "100%", textAlign: "left", padding: 18, background: "linear-gradient(135deg, var(--clay), #7a3319)" }} onClick={() => nav("/shop/match")}>
        <div className="row between">
          <div>
            <div className="eyebrow">Find your match</div>
            <h2 style={{ color: "#fff", marginTop: 4 }}>Pick your style, budget and priorities</h2>
          </div>
          <span style={{ color: "#fff" }}><Icon name="arrow" size={26} /></span>
        </div>
      </button>

      <div className="section">
        <div className="row between">
          <div className="eyebrow">Filter</div>
          <button className="tiny" style={{ color: "var(--moss)", fontWeight: 600 }} onClick={() => nav("/shop/method")}>How we score ↗</button>
        </div>
        <div className="scroller" style={{ marginTop: 8 }}>
          {STYLES.map((s) => <Chip key={s.id} on={styles.includes(s.id)} onClick={() => tog(styles, setStyles, s.id)} mini>{s.name}</Chip>)}
        </div>
        <div className="row" style={{ marginTop: 8, justifyContent: "space-between" }}>
          <div className="row" style={{ gap: 6 }}>
            {PRICE_TIERS.map((p) => <Chip key={p.tier} on={tiers.includes(p.tier)} onClick={() => tog(tiers, setTiers, p.tier)} mini>{p.label}</Chip>)}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ font: "inherit", fontSize: 12, fontWeight: 600, border: 0, background: "var(--surface-2)", color: "inherit", borderRadius: 999, padding: "6px 10px" }}>
            <option value="score">Best score</option>
            <option value="price">Lowest price</option>
            <option value="name">A–Z</option>
          </select>
        </div>
      </div>

      <div className="section stack">
        {list.map((b) => <BrandTile key={b.id} b={b} w={w} />)}
        {!list.length && <div className="note">No brand matches all of those filters. Try fewer.</div>}
      </div>
    </div>
  );
}

function Match() {
  const [step, setStep] = useState(0);
  const [styles, setStyles] = useStored("matchStyles", []);
  const [tiers, setTiers] = useStored("matchTiers", []);
  const [w, setW] = useWeights();
  const tog = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const results = useMemo(() => {
    return BRANDS.map((b) => {
      const styleHit = styles.length ? b.styles.filter((s) => styles.includes(s)).length / Math.min(styles.length, b.styles.length) : 1;
      const priceHit = tiers.length ? (tiers.includes(b.price) ? 1 : tiers.some((t) => Math.abs(t - b.price) === 1) ? 0.5 : 0) : 1;
      const sus = scoreBrand(b, w) / 100;
      const match = Math.round((0.35 * styleHit + 0.2 * priceHit + 0.45 * sus) * 100);
      return { b, styleHit, priceHit, sus, match };
    }).filter((r) => r.styleHit > 0).sort((a, b) => b.match - a.match);
  }, [styles, tiers, w]);
  const titles = ["Your style", "Your budget", "Your priorities", "Your matches"];
  return (
    <div className="screen">
      <TopBar title={titles[step]} fallback="/shop" />
      <div className="row" style={{ gap: 6, marginBottom: 16 }}>
        {titles.map((_, i) => <div key={i} className="progress" style={{ flex: 1 }}><i style={{ width: i <= step ? "100%" : "0%", background: "var(--clay)" }} /></div>)}
      </div>

      {step === 0 && (
        <>
          <p className="lead">Pick every style you actually wear. This decides which brands are shown at all.</p>
          <div className="grid2">
            {STYLES.map((s) => (
              <button key={s.id} className={`card tap ${styles.includes(s.id) ? "" : ""}`} style={{ textAlign: "left", padding: 14, border: `2px solid ${styles.includes(s.id) ? "var(--clay)" : "transparent"}` }} onClick={() => tog(styles, setStyles, s.id)}>
                <div style={{ fontSize: 22 }}>{s.emoji}</div>
                <div style={{ fontWeight: 600, marginTop: 6 }}>{s.name}</div>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <p className="lead">What do you usually spend? Adjacent tiers still show, ranked lower.</p>
          <div className="stack">
            {PRICE_TIERS.map((p) => (
              <button key={p.tier} className="card tap" style={{ width: "100%", textAlign: "left", border: `2px solid ${tiers.includes(p.tier) ? "var(--clay)" : "transparent"}`, display: "flex", gap: 14, alignItems: "center" }} onClick={() => tog(tiers, setTiers, p.tier)}>
                <span className="tier" style={{ fontSize: 22 }}><Tier t={p.tier} /></span>
                <span className="small">{p.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <p className="lead">How much does each lens matter to you? These weights also re-rank the whole shop.</p>
          <div className="card">
            {LENS_KEYS.map((k) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <div className="row between"><span className="small" style={{ fontWeight: 600, color: LENS_COLOR[k] }}>{LENS_LABEL[k]}</span><span className="tiny muted">{["ignore", "a little", "matters", "essential"][w[k]]}</span></div>
                <input className="slider" type="range" min="0" max="3" value={w[k]} onChange={(e) => setW({ ...w, [k]: +e.target.value })} style={{ marginTop: 6 }} />
              </div>
            ))}
            <button className="tiny" style={{ color: "var(--moss)", fontWeight: 600 }} onClick={() => setW(DEFAULT_W)}>Reset to equal weights</button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <p className="small muted" style={{ marginBottom: 12 }}>Match = 35% style fit + 20% price fit + 45% weighted sustainability score. {results.length} brands fit your styles.</p>
          <div className="stack">
            {results.map((r, i) => (
              <BrandTile key={r.b.id} b={r.b} w={w} extra={<span className={`chip mini ${r.match >= 70 ? "soft" : r.match >= 50 ? "ochre" : "clay"}`}>{r.match}% match</span>} />
            ))}
          </div>
        </>
      )}

      <div className="row" style={{ marginTop: 20, gap: 10 }}>
        {step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 3 ? <button className="btn" style={{ flex: 1 }} onClick={() => setStep(step + 1)}>{step === 0 && !styles.length ? "Skip: show all styles" : "Next"}</button>
          : <button className="btn" style={{ flex: 1 }} onClick={() => nav("/shop")}>Browse everything</button>}
      </div>
    </div>
  );
}

function BrandDetail({ id }) {
  const b = brandById(id);
  const [w] = useWeights();
  const { open } = useSheet();
  if (!b) return <div className="screen"><TopBar title="Not found" fallback="/shop" /></div>;
  const s = scoreBrand(b, w), band = bandFor(s);
  const avg = {}; for (const k of LENS_KEYS) avg[k] = Math.round(BRANDS.reduce((t, x) => t + x.scores[k], 0) / BRANDS.length);
  const radarAxes = LENS_KEYS.map((k) => ({ k, label: LENS_LABEL[k].split(" ")[0] }));
  const goyTone = !b.goy ? "" : /Great|Good/.test(b.goy) ? "soft" : /Start/.test(b.goy) ? "ochre" : "clay";
  return (
    <div className="screen">
      <TopBar title={b.name} fallback="/shop" />
      <div style={{ borderRadius: 24, padding: 18, background: `linear-gradient(135deg, ${b.palette[0]}, ${b.palette[1]} 70%, ${b.palette[2]})`, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>
        <div className="row between">
          <div className="row" style={{ gap: 6 }}>{b.garments.map((g) => <Garment key={g} type={g} size={38} color="rgba(255,255,255,.95)" />)}</div>
          <span style={{ fontSize: 22 }} className="tier"><Tier t={b.price} /></span>
        </div>
        <p className="small" style={{ marginTop: 12, fontWeight: 600 }}>{b.priceNote}</p>
        <div className="wrap" style={{ marginTop: 8 }}>{b.styles.map((x) => <span key={x} className="chip mini" style={{ background: "rgba(255,255,255,.22)", color: "#fff", textShadow: "none" }}>{STYLES.find((s) => s.id === x)?.name}</span>)}</div>
      </div>
      <p className="tiny muted" style={{ marginTop: 10 }}>{b.hq} · est. {b.founded} · {b.kind}</p>
      <p className="lead" style={{ fontWeight: 500 }}>{b.blurb}</p>

      <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <ScoreRing score={s} size={84} stroke={9} />
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: `var(--${band.color})` }}>{band.label}</div>
          <p className="tiny muted">Weft score with your lens weights. <button style={{ color: "var(--moss)", fontWeight: 600 }} onClick={() => nav("/shop/method")}>Method ↗</button></p>
          {b.goy ? <span className={`chip mini ${goyTone}`} style={{ marginTop: 8 }}>Good On You: {b.goy}</span> : <span className="chip mini" style={{ marginTop: 8 }}>Not rated by Good On You</span>}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <RadarChart axes={radarAxes} series={[{ name: "Directory average", color: "var(--muted)", values: Object.fromEntries(LENS_KEYS.map((k) => [k, avg[k] / 20])) }, { name: b.name, color: b.palette[0] === "#FFFFFF" || b.palette[0] === "#F4F4F0" ? b.palette[1] : b.palette[0], values: Object.fromEntries(LENS_KEYS.map((k) => [k, b.scores[k] / 20])) }]} size={260} />
        <div className="legend" style={{ justifyContent: "center" }}><span><i style={{ background: "var(--muted)" }} />Directory average</span><span><i style={{ background: b.palette[0] }} />{b.name}</span></div>
        <div style={{ marginTop: 14 }}>
          {LENS_KEYS.map((k) => <Meter key={k} label={LENS_LABEL[k]} value={b.scores[k]} color={LENS_COLOR[k]} />)}
        </div>
      </div>

      {!!b.certs.length && (
        <div className="section">
          <div className="eyebrow">Certifications & memberships</div>
          <div className="wrap" style={{ marginTop: 4 }}>
            {b.certs.map((c) => { const cert = CERTS.find((x) => x.id === c) || (c === "rds" ? CERTS.find((x) => x.id === "rws") : null); return cert ? <Chip key={c} tone="soft" mini onClick={() => open(<CertSheet c={cert} />)}>{c === "rds" ? "RDS" : cert.name}</Chip> : <span key={c} className="chip mini">{c}</span>; })}
          </div>
        </div>
      )}

      <div className="section">
        <div className="eyebrow">Programmes</div>
        <div className="card" style={{ padding: "4px 16px" }}>
          {b.programs.map((p) => <div key={p} className="list-item" style={{ padding: "10px 0" }}><span className="icon" style={{ width: 32, height: 32, background: "var(--plum-soft)", color: "var(--plum)" }}><Icon name="loop" size={18} /></span><div className="body small">{p}</div></div>)}
        </div>
      </div>
      <div className="section grid2">
        <div className="card" style={{ background: "var(--moss-soft)", boxShadow: "none" }}>
          <div className="eyebrow" style={{ color: "var(--moss)" }}>Strengths</div>
          <ul className="small" style={{ paddingLeft: 16, margin: "8px 0 0", lineHeight: 1.45 }}>{b.strengths.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="card" style={{ background: "var(--clay-soft)", boxShadow: "none" }}>
          <div className="eyebrow" style={{ color: "var(--clay)" }}>Concerns</div>
          <ul className="small" style={{ paddingLeft: 16, margin: "8px 0 0", lineHeight: 1.45 }}>{b.concerns.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>
      <div className="section">
        <div className="eyebrow">Evidence</div>
        <div className="wrap" style={{ marginTop: 4 }}>{b.cites.map((c) => <Cite key={c} k={c} />)}</div>
        <p className="tiny muted" style={{ marginTop: 8 }}>Scores compiled in 2026 from public disclosures, ratings and reporting; practices change. Check the brand's latest report and Good On You before buying.</p>
      </div>
    </div>
  );
}

function Method() {
  return (
    <div className="screen">
      <TopBar title="How we score" fallback="/shop" />
      <p className="lead">Weft's score is a synthesis, not a new audit. Here is exactly how it is built so you can disagree with it.</p>
      <div className="stack">
        <div className="card">
          <h3>1. Six lens scores, 0–100</h3>
          <p className="small" style={{ marginTop: 6 }}>Each brand gets a score on Climate, Water & chemicals, Materials & waste, People, Animals and Transparency. The starting point is the brand's Good On You band<Cite k="goy" /> and its Fashion Transparency Index disclosure<Cite k="fti2023" />, adjusted up for verified certifications (GOTS, Fair Wear, B Corp, bluesign, RWS<Cite k="gots" /><Cite k="fwf" /><Cite k="bcorp" />), published programmes with numbers (repair volumes, take-back results, LCAs), and adjusted down for documented investigations and regulator findings<Cite k="cm2021" /><Cite k="quartz2022" /><Cite k="publiceye2021" />.</p>
        </div>
        <div className="card">
          <h3>2. Your weights</h3>
          <p className="small" style={{ marginTop: 6 }}>The overall score is a weighted mean of the six lenses using the sliders in "Find your match" (0 = ignore, 3 = essential). Equal weights by default. A vegan shopper can make Animals essential; a labour-first shopper can zero everything but People.</p>
        </div>
        <div className="card">
          <h3>3. Bands</h3>
          <p className="small" style={{ marginTop: 6 }}>75+ Leading · 60–74 Good · 45–59 Getting there · 30–44 Weak · under 30 Avoid. The bands are deliberately close to Good On You's five, so the two can be read side by side.</p>
        </div>
        <div className="card">
          <h3>4. Style and price</h3>
          <p className="small" style={{ marginTop: 6 }}>Style tags and palettes describe what a brand mostly sells, from its own range. Price tiers use typical t-shirt, jeans and jacket prices in 2026 US dollars. Match % = 35% style fit + 20% price fit + 45% weighted score.</p>
        </div>
        <div className="note clay small">
          <b>What this cannot tell you.</b> A high score means a brand publishes strong evidence; it does not mean its clothes are the right ones for you, that a specific garment is well made, or that nothing has changed since 2026. Everlane is the cautionary example: rated "Good" by every system, then sold to Shein.<Cite k="everlane2026" /> The cheapest, lowest-impact garment is nearly always the one already in your wardrobe or a secondhand one.<Cite k="wrap2017" />
        </div>
      </div>
    </div>
  );
}
