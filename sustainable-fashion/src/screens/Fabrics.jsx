import React, { useMemo, useState } from "react";
import { FABRICS, CATS, IMPACT_KEYS, CARE_SYMBOLS, fabricById } from "../data/fabrics.js";
import { Cite, Icon, TopBar, nav, useSheet, Chip, Dots, RadarChart, CareSymbol, SourceCard, useStored } from "../components/ui.jsx";
import { sourceIndex } from "../data/sources.js";

export default function Fabrics({ segs }) {
  const [, sub] = segs;
  if (sub === "compare") return <Compare />;
  if (sub === "labels") return <Labels />;
  if (sub === "care") return <CareLibrary />;
  if (sub === "longevity") return <Longevity />;
  if (sub) return <FabricDetail id={sub} />;
  return <FabricIndex />;
}

const catOf = (id) => CATS.find((c) => c.id === id);
const goodness = (f) => {
  // 1–5 where 5 = best, averaged across the seven metrics
  let s = 0;
  for (const k of IMPACT_KEYS) s += k.bad ? 6 - f.impact[k.k] : f.impact[k.k];
  return s / IMPACT_KEYS.length;
};

function FabricIndex() {
  const [cat, setCat] = useState("all");
  const list = FABRICS.filter((f) => cat === "all" || f.cat === cat);
  return (
    <div className="screen">
      <div className="eyebrow">Dimension 2</div>
      <h1 style={{ marginTop: 4 }}>Know your fabrics</h1>
      <p className="lead">Where each fibre comes from, the route it takes to your wardrobe, and how to make it last. Bigger dot rows mean lower impact.</p>

      <div className="grid2" style={{ marginBottom: 20 }}>
        {[
          { t: "Compare fibres", s: "Radar chart, up to three", p: "/fabrics/compare", i: "sliders", c: "sky" },
          { t: "Read a label", s: "Tap the parts of a real tag", p: "/fabrics/labels", i: "tag", c: "clay" },
          { t: "Care symbols", s: "All 23 decoded, plus a quiz", p: "/fabrics/care", i: "wash", c: "moss" },
          { t: "Make it last", s: "How care changes the footprint", p: "/fabrics/longevity", i: "repair", c: "plum" },
        ].map((x) => (
          <button key={x.p} className="card tap" style={{ textAlign: "left", padding: 14 }} onClick={() => nav(x.p)}>
            <span style={{ color: `var(--${x.c})` }}><Icon name={x.i} /></span>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{x.t}</div>
            <div className="tiny muted" style={{ marginTop: 2 }}>{x.s}</div>
          </button>
        ))}
      </div>

      <div className="scroller">
        <Chip on={cat === "all"} onClick={() => setCat("all")}>All {FABRICS.length}</Chip>
        {CATS.map((c) => <Chip key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>{c.name}</Chip>)}
      </div>
      <div className="grid2" style={{ marginTop: 10 }}>
        {list.map((f) => {
          const c = catOf(f.cat), g = goodness(f);
          return (
            <button key={f.id} className="fabric-tile" onClick={() => nav(`/fabrics/${f.id}`)}>
              <div className="row between">
                <span style={{ fontSize: 26 }}>{f.hero}</span>
                <span className={`chip mini ${c.color === "moss" ? "soft" : c.color}`}>{c.name}</span>
              </div>
              <div className="name">{f.name}</div>
              <div className="tiny muted" style={{ flex: 1 }}>{f.share}</div>
              <div className="row between">
                <Dots n={Math.round(g)} tone={g < 2.5 ? "bad" : g < 3.5 ? "warn" : ""} />
                <span className="tiny muted">overall</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FabricDetail({ id }) {
  const f = fabricById(id);
  const { open } = useSheet();
  const [step, setStep] = useState(0);
  if (!f) return <div className="screen"><TopBar title="Not found" fallback="/fabrics" /></div>;
  const c = catOf(f.cat);
  return (
    <div className="screen">
      <TopBar title={f.name} fallback="/fabrics" />
      <div className="row" style={{ gap: 8 }}>
        <span style={{ fontSize: 34 }}>{f.hero}</span>
        <span className={`chip mini ${c.color === "moss" ? "soft" : c.color}`}>{c.name}</span>
        <span className="chip mini">{f.share}</span>
      </div>
      <p className="lead" style={{ fontWeight: 500 }}>{f.tagline}</p>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 6 }}>How it's made</div>
        <p className="small">{f.made}</p>
      </div>

      <div className="section">
        <div className="eyebrow">Impact profile <span className="tiny muted" style={{ textTransform: "none", letterSpacing: 0 }}>· tap a row for the why</span></div>
        <div className="card" style={{ padding: "6px 16px" }}>
          {IMPACT_KEYS.map((k) => {
            const v = f.impact[k.k];
            const tone = k.bad ? (v >= 4 ? "bad" : v === 3 ? "warn" : "") : (v <= 2 ? "bad" : v === 3 ? "warn" : "");
            const note = f.notes[k.k];
            return (
              <button key={k.k} className="list-item" style={{ padding: "10px 0" }} onClick={() => note && open(<div className="stack"><span className="chip mini soft">{k.label}</span><p className="small">{note}</p><div className="wrap">{f.cites.map((s) => <button key={s} className="chip mini ochre" onClick={() => open(<SourceCard k={s} />)}>Source {sourceIndex(s)}</button>)}</div></div>)}>
                <div className="body">
                  <div className="small" style={{ fontWeight: 600 }}>{k.label}</div>
                  <div className="tiny muted">{k.bad ? (v >= 4 ? "high pressure" : v === 3 ? "moderate" : "low pressure") : (v >= 4 ? "strong" : v === 3 ? "moderate" : "weak")}</div>
                </div>
                <Dots n={v} tone={tone} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">The journey to your wardrobe</div>
        <div className="scroller" style={{ marginTop: 8 }}>
          {f.journey.map((j, i) => <Chip key={i} on={step === i} onClick={() => setStep(i)} mini>{i + 1}. {j.stage}</Chip>)}
        </div>
        <div className="card" style={{ marginTop: 8 }}>
          <JourneyStrip n={f.journey.length} at={step} />
          <h3 style={{ marginTop: 10 }}>{f.journey[step].stage}</h3>
          <p className="tiny muted" style={{ marginTop: 2 }}>📍 {f.journey[step].where}</p>
          <p className="small" style={{ marginTop: 10 }}>{f.journey[step].how}{f.journey[step].cite && <Cite k={f.journey[step].cite} />}</p>
          <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
            <span className="chip mini sky">→ {f.journey[step].transport}</span>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn ghost sm" disabled={step === 0} onClick={() => setStep(step - 1)}>‹</button>
              <button className="btn sm" disabled={step === f.journey.length - 1} onClick={() => setStep(step + 1)}>Next ›</button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">Care to make it last</div>
        <div className="card" style={{ padding: "4px 16px" }}>
          {f.care.map((c, i) => (
            <div key={i} className="list-item">
              <span className="icon" style={{ background: "var(--moss-soft)", color: "var(--moss)" }}><Icon name={c.icon} /></span>
              <div className="body small">{c.tip}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">On the label</div>
        <div className="note small">{f.label}</div>
      </div>

      <div className="section">
        <div className="eyebrow">Lower-impact alternatives</div>
        <div className="wrap" style={{ marginTop: 4 }}>
          {f.alt.map((a) => { const x = fabricById(a); return x && <Chip key={a} tone="soft" onClick={() => nav(`/fabrics/${a}`)}>{x.hero} {x.name}</Chip>; })}
          <Chip onClick={() => nav("/fabrics/compare?with=" + f.id)}>Compare ↗</Chip>
        </div>
      </div>
      <div className="section">
        <div className="eyebrow">Sources for this fabric</div>
        <div className="wrap" style={{ marginTop: 4 }}>{f.cites.map((s) => <Cite key={s} k={s} />)}</div>
      </div>
    </div>
  );
}

function JourneyStrip({ n, at }) {
  const w = 300, pad = 14, step = (w - pad * 2) / (n - 1);
  return (
    <svg viewBox={`0 0 ${w} 30`} width="100%" style={{ display: "block" }}>
      <line x1={pad} y1="15" x2={w - pad} y2="15" stroke="var(--line)" strokeWidth="3" />
      <line x1={pad} y1="15" x2={pad + step * at} y2="15" stroke="var(--moss)" strokeWidth="3" style={{ transition: "all .3s" }} />
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} cx={pad + step * i} cy="15" r={i === at ? 8 : 5} fill={i <= at ? "var(--moss)" : "var(--surface-2)"} stroke="var(--surface)" strokeWidth="2" style={{ transition: "all .3s" }} />
      ))}
    </svg>
  );
}

const AXES = [
  { k: "water", label: "Low water" }, { k: "climate", label: "Low carbon" }, { k: "land", label: "Low land use" },
  { k: "chemicals", label: "Clean chem" }, { k: "micro", label: "No microplastic" }, { k: "biodeg", label: "Biodegrades" }, { k: "durable", label: "Durable" },
];
const COLORS = ["var(--moss)", "var(--clay)", "var(--sky)"];

function Compare() {
  const q = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const [sel, setSel] = useState(() => [q.get("with") || "cotton", "polyester"].filter(Boolean));
  const toggle = (id) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : sel.length < 3 ? [...sel, id] : [...sel.slice(1), id]);
  const series = sel.map((id, i) => {
    const f = fabricById(id);
    const values = {};
    for (const k of IMPACT_KEYS) values[k.k] = k.bad ? 6 - f.impact[k.k] : f.impact[k.k];
    return { name: f.name, color: COLORS[i], values };
  });
  return (
    <div className="screen">
      <TopBar title="Compare fibres" fallback="/fabrics" />
      <p className="small muted">Pick up to three. Further out is better on every axis.</p>
      <div className="card" style={{ marginTop: 12 }}>
        <RadarChart axes={AXES} series={series} size={300} />
        <div className="legend" style={{ justifyContent: "center", marginTop: 6 }}>
          {series.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>)}
        </div>
      </div>
      <div className="wrap" style={{ marginTop: 14 }}>
        {FABRICS.map((f) => <Chip key={f.id} on={sel.includes(f.id)} onClick={() => toggle(f.id)} mini>{f.hero} {f.name}</Chip>)}
      </div>
      <div className="section card" style={{ overflowX: "auto" }}>
        <table className="tbl">
          <thead><tr><th>Metric</th>{series.map((s) => <th key={s.name} style={{ color: s.color }}>{s.name}</th>)}</tr></thead>
          <tbody>
            {IMPACT_KEYS.map((k) => (
              <tr key={k.k}><td className="muted">{k.label}</td>{sel.map((id) => { const v = fabricById(id).impact[k.k]; return <td key={id}><Dots n={v} tone={k.bad ? (v >= 4 ? "bad" : v === 3 ? "warn" : "") : (v <= 2 ? "bad" : v === 3 ? "warn" : "")} /></td>; })}</tr>
            ))}
          </tbody>
        </table>
        <p className="tiny muted" style={{ marginTop: 10 }}>Pressure metrics (water to microplastics): more dots = more impact. Biodegradable and durable: more dots = better. Bands synthesised from the Higg MSI and the LCAs cited on each fabric page.<Cite k="higg" /><Cite k="sandin2019" /></p>
      </div>
    </div>
  );
}

const LABEL_PARTS = [
  { id: "brand", text: "NORTHWEAVE · Made in Portugal", why: "Country of origin is required in the US and many other markets, and it tells you about the final sewing step only. The fabric may have been woven and dyed elsewhere. Portugal, Italy and Türkiye have relatively strong labour law; that is not a guarantee.", cite: "ftc" },
  { id: "fibre", text: "95% organic cotton · 5% elastane", why: "Fibre content is legally required in the EU and US and listed by weight, largest first. 'Organic' here is a claim unless a certification and licence number back it. The 5% elastane makes the shirt stretchy and, at end of life, non-recyclable.", cite: "euReg1007" },
  { id: "cert", text: "GOTS certified · Licence CU 812345", why: "The licence number is the tell. GOTS, Fairtrade, OEKO-TEX and bluesign all issue searchable numbers; a logo alone is easy to print.", cite: "gots" },
  { id: "care", text: "care symbols", why: "Five symbols in fixed order: wash, bleach, dry, iron, professional clean. The label shows the maximum a garment can take, not the best routine. Washing cooler and skipping the dryer is always allowed.", cite: "iso3758" },
  { id: "rn", text: "RN 123456 · Lot 2311", why: "In the US the RN number identifies the company legally responsible; you can look it up in the FTC database. A lot code is what a brand uses to trace a batch back to a factory. Brands with real traceability often print a QR code linking to the factory.", cite: "ftc" },
];

function Labels() {
  const [on, setOn] = useState("fibre");
  const part = LABEL_PARTS.find((p) => p.id === on);
  return (
    <div className="screen">
      <TopBar title="Read a label" fallback="/fabrics" />
      <p className="small muted" style={{ marginBottom: 12 }}>Tap each line of this (fictional) tag.</p>
      <div className="label-card">
        {LABEL_PARTS.map((p) => (
          <button key={p.id} className={`hot ${on === p.id ? "on" : ""}`} onClick={() => setOn(p.id)}>
            {p.id === "care" ? (
              <span className="row" style={{ gap: 4, color: "#222" }}>
                <CareSymbol draw="tub" arg="30" size={34} /><CareSymbol draw="tri" arg="no" size={34} /><CareSymbol draw="tumble" arg="no" size={34} /><CareSymbol draw="iron" arg="2" size={34} /><CareSymbol draw="circle" arg="no" size={34} />
              </span>
            ) : (
              <span style={{ fontSize: p.id === "brand" ? 12 : 13, fontWeight: p.id === "brand" ? 700 : 500, letterSpacing: p.id === "brand" ? ".08em" : 0, textTransform: p.id === "brand" ? "uppercase" : "none", color: p.id === "rn" ? "#777" : "#222" }}>{p.text}</span>
            )}
          </button>
        ))}
      </div>
      <div className="note clay" style={{ marginTop: 12, animation: "fade .2s" }} key={on}>
        <b>{part.id === "care" ? "Care symbols" : part.text}.</b> {part.why}<Cite k={part.cite} />
      </div>

      <div className="section">
        <div className="eyebrow">Five things to read before you buy</div>
        <div className="card" style={{ padding: "4px 16px" }}>
          {[
            "Fibre content first: one fibre beats a blend for durability, recyclability and honest care.",
            "Look for a certification with a licence number, not just a leaf logo or the word 'conscious'.",
            "Country of origin covers sewing only; a brand that names the mill is rarer and better.",
            "The care symbols show the maximum; cooler and gentler is always allowed and usually better.",
            "Check the seams and the price: a $5 'cashmere' or $3 tee is telling you where the cost went.",
          ].map((x, i) => (
            <div key={i} className="list-item"><span className="icon" style={{ fontFamily: "var(--serif)", fontWeight: 700 }}>{i + 1}</span><div className="body small">{x}</div></div>
          ))}
        </div>
      </div>
      <div className="row" style={{ marginTop: 16, gap: 10 }}>
        <button className="btn wide" onClick={() => nav("/fabrics/care")}>Decode all care symbols</button>
      </div>
    </div>
  );
}

function CareLibrary() {
  const { open } = useSheet();
  const [mode, setMode] = useState("browse");
  const groups = [...new Set(CARE_SYMBOLS.map((s) => s.group))];
  return (
    <div className="screen">
      <TopBar title="Care symbols" fallback="/fabrics" />
      <div className="tabs" style={{ marginBottom: 14 }}>
        <button className={mode === "browse" ? "on" : ""} onClick={() => setMode("browse")}>Browse</button>
        <button className={mode === "quiz" ? "on" : ""} onClick={() => setMode("quiz")}>Quiz me</button>
      </div>
      {mode === "browse" ? groups.map((g) => (
        <div className="section" key={g} style={{ marginTop: 16 }}>
          <div className="eyebrow">{g}</div>
          <div className="grid3">
            {CARE_SYMBOLS.filter((s) => s.group === g).map((s) => (
              <button key={s.id} className="card tap" style={{ padding: 10, textAlign: "center" }} onClick={() => open(<div className="stack" style={{ alignItems: "center", textAlign: "center" }}><CareSymbol draw={s.draw} arg={s.arg} size={80} /><h3>{s.name}</h3><p className="small">{s.meaning}<Cite k="iso3758" /></p></div>)}>
                <CareSymbol draw={s.draw} arg={s.arg} size={48} />
                <div className="tiny" style={{ marginTop: 4, lineHeight: 1.2 }}>{s.name}</div>
              </button>
            ))}
          </div>
        </div>
      )) : <CareQuiz />}
    </div>
  );
}

function CareQuiz() {
  const make = () => {
    const pick = CARE_SYMBOLS[Math.floor(Math.random() * CARE_SYMBOLS.length)];
    const others = CARE_SYMBOLS.filter((s) => s.id !== pick.id).sort(() => Math.random() - 0.5).slice(0, 2);
    return { pick, options: [pick, ...others].sort(() => Math.random() - 0.5) };
  };
  const [q, setQ] = useState(make);
  const [ans, setAns] = useState(null);
  const [score, setScore] = useState({ r: 0, n: 0 });
  return (
    <div className="quiz-card" style={{ alignItems: "center", textAlign: "center" }}>
      <span className="chip mini soft">{score.r}/{score.n} right</span>
      <CareSymbol draw={q.pick.draw} arg={q.pick.arg} size={110} />
      <div className="stack" style={{ width: "100%" }}>
        {q.options.map((o) => (
          <button key={o.id} className={`flag ${ans ? (o.id === q.pick.id ? "green" : ans === o.id ? "red" : "") : ""}`} style={{ fontSize: 14 }} onClick={() => { if (ans) return; setAns(o.id); setScore({ r: score.r + (o.id === q.pick.id ? 1 : 0), n: score.n + 1 }); }}>{o.name}</button>
        ))}
      </div>
      {ans && <p className="small muted" style={{ animation: "fade .2s" }}>{q.pick.meaning}</p>}
      {ans && <button className="btn wide" onClick={() => { setQ(make()); setAns(null); }}>Next symbol</button>}
    </div>
  );
}

const GARMENTS = [
  { id: "tee", name: "Cotton t-shirt", P: 40, wearsYr: 40, care: { wpw: 1, temp: "warm", dryer: true } },
  { id: "jeans", name: "Jeans", P: 100, wearsYr: 60, care: { wpw: 2, temp: "warm", dryer: true } },
  { id: "sweater", name: "Wool sweater", P: 120, wearsYr: 30, care: { wpw: 5, temp: "cold", dryer: false } },
  { id: "fleece", name: "Polyester fleece", P: 90, wearsYr: 40, care: { wpw: 3, temp: "warm", dryer: true } },
];
const careUnit = (temp, dryer) => ({ cold: 0.2, warm: 0.45, hot: 0.65 }[temp] + (dryer ? 0.55 : 0));

function Longevity() {
  const [gid, setGid] = useState("jeans");
  const g = GARMENTS.find((x) => x.id === gid);
  const [years, setYears] = useState(2);
  const [wpw, setWpw] = useState(g.care.wpw);
  const [temp, setTemp] = useState(g.care.temp);
  const [dryer, setDryer] = useState(g.care.dryer);
  const pickG = (id) => { const n = GARMENTS.find((x) => x.id === id); setGid(id); setWpw(n.care.wpw); setTemp(n.care.temp); setDryer(n.care.dryer); };
  const calc = (yrs, w, t, d) => {
    const wears = yrs * g.wearsYr, washes = wears / w, care = washes * careUnit(t, d);
    return { wears, care, total: g.P + care, perWear: (g.P + care) / wears };
  };
  const base = calc(2, g.care.wpw, g.care.temp, g.care.dryer);
  const you = calc(years, wpw, temp, dryer);
  const delta = Math.round((1 - you.perWear / base.perWear) * 100);
  const carePct = Math.round((you.care / you.total) * 100);
  return (
    <div className="screen">
      <TopBar title="Make it last" fallback="/fabrics" />
      <p className="small muted">The two biggest levers you control: how long you keep a garment and how you wash it. Move the sliders.</p>
      <div className="scroller" style={{ marginTop: 12 }}>
        {GARMENTS.map((x) => <Chip key={x.id} on={gid === x.id} onClick={() => pickG(x.id)}>{x.name}</Chip>)}
      </div>
      <div className="card" style={{ marginTop: 8 }}>
        <div className="row between">
          <div>
            <div className="eyebrow">Footprint per wear</div>
            <div className="bignum" style={{ color: delta >= 0 ? "var(--good)" : "var(--bad)", marginTop: 6 }}>{delta > 0 ? "−" : delta < 0 ? "+" : ""}{Math.abs(delta)}%</div>
            <p className="tiny muted" style={{ marginTop: 4 }}>vs a typical owner: 2 years, {g.care.wpw === 1 ? "washed every wear" : `washed every ${g.care.wpw} wears`}, {g.care.temp}, {g.care.dryer ? "tumble dried" : "line dried"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="serif" style={{ fontSize: 22, fontWeight: 700 }}>{you.wears}</div>
            <div className="tiny muted">wears in total</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div className="tiny muted" style={{ marginBottom: 4 }}>Where the lifetime impact sits</div>
          <div className="progress" style={{ height: 14, display: "flex" }}>
            <i style={{ width: `${100 - carePct}%`, background: "var(--plum)", borderRadius: "99px 0 0 99px" }} />
            <i style={{ width: `${carePct}%`, background: "var(--sky)", borderRadius: "0 99px 99px 0" }} />
          </div>
          <div className="legend" style={{ marginTop: 6 }}><span><i style={{ background: "var(--plum)" }} />Making it {100 - carePct}%</span><span><i style={{ background: "var(--sky)" }} />Washing & drying {carePct}%</span></div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row between"><span className="small" style={{ fontWeight: 600 }}>Years you keep it</span><span className="chip mini soft">{years} {years === 1 ? "year" : "years"}</span></div>
        <input className="slider" type="range" min="1" max="10" value={years} onChange={(e) => setYears(+e.target.value)} style={{ marginTop: 10 }} />
        <div className="row between" style={{ marginTop: 16 }}><span className="small" style={{ fontWeight: 600 }}>Wears between washes</span><span className="chip mini soft">{wpw}</span></div>
        <input className="slider" type="range" min="1" max="15" value={wpw} onChange={(e) => setWpw(+e.target.value)} style={{ marginTop: 10 }} />
        <div className="row between" style={{ marginTop: 16, flexWrap: "wrap" }}>
          <span className="small" style={{ fontWeight: 600 }}>Wash temperature</span>
          <span className="toggle">{["cold", "warm", "hot"].map((t) => <button key={t} className={temp === t ? "on" : ""} onClick={() => setTemp(t)}>{t}</button>)}</span>
        </div>
        <div className="row between" style={{ marginTop: 12 }}>
          <span className="small" style={{ fontWeight: 600 }}>Tumble dryer</span>
          <span className="toggle"><button className={dryer ? "on" : ""} onClick={() => setDryer(true)}>yes</button><button className={!dryer ? "on" : ""} onClick={() => setDryer(false)}>line dry</button></span>
        </div>
      </div>

      <div className="section note small">
        <b>Where this comes from.</b> An illustrative model calibrated to two published findings: in Levi's full life-cycle assessment, consumer care is ~37% of a jean's climate impact and washing every 10 wears instead of 2 cuts that by up to 80%<Cite k="levi2015" />; and WRAP found that nine extra months of active life reduce carbon, water and waste footprints by 20–30%<Cite k="wrap2017" />. Heating water and running a dryer dominate the care stage in every LCA.<Cite k="sandin2019" />
      </div>
    </div>
  );
}
