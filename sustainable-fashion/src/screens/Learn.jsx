import React, { useMemo, useState } from "react";
import { LENSES, HEADLINE_STATS, RATERS, CERTS, GREENWASH, GRADE_QUESTIONS } from "../data/sustainability.js";
import { BRANDS } from "../data/brands.js";
import { Cite, CountUp, Icon, TopBar, nav, useSheet, Chip, ScoreRing, Meter, LENS_COLOR, LENS_LABEL, useStored } from "../components/ui.jsx";

export default function Learn({ segs }) {
  const [, sub, id] = segs;
  if (sub === "lens" && id) return <LensDetail id={id} />;
  if (sub === "raters") return <Raters />;
  if (sub === "rater" && id) return <RaterDetail id={id} />;
  if (sub === "certs") return <Certs />;
  if (sub === "grade") return <GradeABrand />;
  if (sub === "greenwash") return <Greenwash />;
  return <LearnIndex />;
}

function LearnIndex() {
  return (
    <div className="screen">
      <div className="eyebrow">Dimension 1</div>
      <h1 style={{ marginTop: 4 }}>What is sustainable?</h1>
      <p className="lead">"Sustainable" has no legal definition on a clothing label. In practice it means six measurable things, and brands are graded on how much of each they can prove.</p>

      <div className="section">
        <div className="eyebrow">The scale of it</div>
        <div className="grid2">
          {HEADLINE_STATS.map((s, i) => (
            <div className="stat" key={i}>
              <div className="bignum" style={{ color: i % 2 ? "var(--clay)" : "var(--moss)" }}><CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} /></div>
              <div className="label">{s.label}<Cite k={s.cite} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">Six lenses</div>
        <p className="small muted" style={{ marginBottom: 10 }}>Tap a lens for the evidence and what to look for.</p>
        <div className="stack">
          {LENSES.map((l) => (
            <button key={l.id} className="card tap" style={{ width: "100%", textAlign: "left", display: "flex", gap: 14, alignItems: "center" }} onClick={() => nav(`/learn/lens/${l.id}`)}>
              <span style={{ width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: `var(--${l.color}-soft)`, color: `var(--${l.color})`, flex: "none" }}><Icon name={l.icon} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3>{l.name}</h3>
                <p className="small muted" style={{ marginTop: 2 }}>{l.tagline}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="serif" style={{ fontWeight: 700, fontSize: 18, color: `var(--${l.color})`, whiteSpace: "nowrap" }}>{l.stat.value}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">How brands get graded</div>
        <div className="card" style={{ padding: "4px 16px" }}>
          <button className="list-item" onClick={() => nav("/learn/raters")}>
            <span className="icon" style={{ background: "var(--ochre-soft)", color: "var(--ochre)" }}><Icon name="star" /></span>
            <div className="body"><div className="title">The raters</div><div className="small muted">Good On You, Fashion Transparency Index, Higg, B Corp, Remake</div></div>
            <Icon name="arrow" size={18} />
          </button>
          <button className="list-item" onClick={() => nav("/learn/certs")}>
            <span className="icon" style={{ background: "var(--moss-soft)", color: "var(--moss)" }}><Icon name="check" /></span>
            <div className="body"><div className="title">Certification decoder</div><div className="small muted">What GOTS, OEKO-TEX, Fair Trade, bluesign and RWS actually cover</div></div>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">Try it yourself</div>
        <div className="grid2">
          <button className="card tap" style={{ textAlign: "left" }} onClick={() => nav("/learn/grade")}>
            <span style={{ color: "var(--moss)" }}><Icon name="sliders" /></span>
            <h3 style={{ marginTop: 8 }}>Grade a brand</h3>
            <p className="small muted" style={{ marginTop: 4 }}>An 11-question rubric built from what the indices check.</p>
          </button>
          <button className="card tap" style={{ textAlign: "left" }} onClick={() => nav("/learn/greenwash")}>
            <span style={{ color: "var(--clay)" }}><Icon name="eye" /></span>
            <h3 style={{ marginTop: 8 }}>Greenwash or not?</h3>
            <p className="small muted" style={{ marginTop: 4 }}>Ten real claims. Red flag or green flag?</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function LensDetail({ id }) {
  const l = LENSES.find((x) => x.id === id);
  if (!l) return <div className="screen"><TopBar title="Not found" fallback="/learn" /></div>;
  const key = id === "water" ? "water" : id;
  const top = [...BRANDS].sort((a, b) => b.scores[key] - a.scores[key]).slice(0, 3);
  return (
    <div className="screen">
      <TopBar title={l.name} fallback="/learn" />
      <div className="card" style={{ background: `var(--${l.color}-soft)`, boxShadow: "none" }}>
        <div className="row" style={{ gap: 12 }}>
          <span style={{ color: `var(--${l.color})` }}><Icon name={l.icon} size={30} /></span>
          <p style={{ fontWeight: 600 }}>{l.tagline}</p>
        </div>
        <div className="bignum" style={{ marginTop: 14, color: `var(--${l.color})`, fontSize: 34 }}>{l.stat.value}</div>
        <p className="small" style={{ marginTop: 6 }}>{l.stat.label}<Cite k={l.stat.cite} /></p>
      </div>
      <div className="section stack">
        <div className="eyebrow">The evidence</div>
        {l.body.map((b, i) => <p key={i} style={{ fontSize: 15 }}>{b.t}<Cite k={b.c} /></p>)}
      </div>
      <div className="section">
        <div className="eyebrow">What to look for on a brand's site</div>
        <div className="card" style={{ padding: "4px 16px" }}>
          {l.lookFor.map((x) => (
            <div key={x} className="check on" style={{ cursor: "default" }}><span className="box"><Icon name="check" size={16} /></span><span className="small">{x}</span></div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="eyebrow">Strongest brands on this lens</div>
        <div className="card" style={{ padding: "4px 16px" }}>
          {top.map((b) => (
            <button key={b.id} className="list-item" onClick={() => nav(`/shop/brand/${b.id}`)}>
              <ScoreRing score={b.scores[key]} size={44} stroke={5} color={LENS_COLOR[key]} />
              <div className="body"><div className="title">{b.name}</div><div className="small muted">{b.programs[0]}</div></div>
              <Icon name="arrow" size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Raters() {
  return (
    <div className="screen">
      <TopBar title="The raters" fallback="/learn" />
      <p className="lead">Nobody grades fashion officially. Five systems do most of the work, each measuring something different. Knowing which is which tells you what a badge or score means.</p>
      <div className="stack">
        {RATERS.map((r) => (
          <button key={r.id} className="card tap" style={{ width: "100%", textAlign: "left" }} onClick={() => nav(`/learn/rater/${r.id}`)}>
            <div className="row between">
              <h3>{r.name}</h3>
              <Icon name="arrow" size={18} />
            </div>
            <p className="tiny muted" style={{ marginTop: 2 }}>{r.org} · {r.kind}</p>
            <p className="small" style={{ marginTop: 8 }}><b>Scale:</b> {r.scale}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function RaterDetail({ id }) {
  const r = RATERS.find((x) => x.id === id);
  if (!r) return <div className="screen"><TopBar title="Not found" fallback="/learn/raters" /></div>;
  return (
    <div className="screen">
      <TopBar title={r.name} fallback="/learn/raters" />
      <p className="tiny muted">{r.org} · {r.kind}</p>
      <div className="note" style={{ marginTop: 10 }}><b>Scale:</b> {r.scale}</div>
      <div className="section stack">
        <div className="eyebrow">What it measures</div>
        <p>{r.measures}</p>
        <div className="eyebrow" style={{ marginTop: 8 }}>How it works</div>
        <p>{r.how}<Cite k={r.cite} /></p>
      </div>
      <div className="section grid2">
        <div className="card" style={{ background: "var(--moss-soft)", boxShadow: "none" }}>
          <div className="eyebrow" style={{ color: "var(--moss)" }}>Strengths</div>
          <ul className="small" style={{ paddingLeft: 16, margin: "8px 0 0", lineHeight: 1.45 }}>{r.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="card" style={{ background: "var(--clay-soft)", boxShadow: "none" }}>
          <div className="eyebrow" style={{ color: "var(--clay)" }}>Limits</div>
          <ul className="small" style={{ paddingLeft: 16, margin: "8px 0 0", lineHeight: 1.45 }}>{r.limits.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export function CertSheet({ c }) {
  return (
    <div className="stack">
      <div className="row"><span className="chip soft mini">{c.name}</span></div>
      <h3 className="serif" style={{ fontSize: 19 }}>{c.full}</h3>
      <div className="wrap">{c.covers.map((x) => <span key={x} className="chip mini">{x}</span>)}</div>
      <p className="small">{c.what}<Cite k={c.cite} /></p>
      <div className="note small"><b>Caveat.</b> {c.caveat}</div>
    </div>
  );
}

function Certs() {
  const { open } = useSheet();
  return (
    <div className="screen">
      <TopBar title="Certification decoder" fallback="/learn" />
      <p className="lead">A logo on the tag is a claim about one slice of the garment. Tap each to see the slice, and the caveat.</p>
      <div className="stack">
        {CERTS.map((c) => (
          <button key={c.id} className="card tap" style={{ width: "100%", textAlign: "left" }} onClick={() => open(<CertSheet c={c} />)}>
            <div className="row between">
              <div>
                <h3>{c.name}</h3>
                <p className="tiny muted">{c.full}</p>
              </div>
              <Icon name="arrow" size={18} />
            </div>
            <div className="wrap" style={{ marginTop: 10 }}>{c.covers.map((x) => <span key={x} className="chip mini soft">{x}</span>)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function GradeABrand() {
  const [checked, setChecked] = useStored("grade", {});
  const [name, setName] = useStored("gradeName", "");
  const score = GRADE_QUESTIONS.reduce((s, q) => s + (checked[q.id] ? q.w : 0), 0);
  const perLens = useMemo(() => {
    const out = {};
    for (const q of GRADE_QUESTIONS) {
      out[q.lens] = out[q.lens] || { got: 0, of: 0 };
      out[q.lens].of += q.w; if (checked[q.id]) out[q.lens].got += q.w;
    }
    return out;
  }, [checked]);
  const band = score >= 75 ? "Leading: rare air, verify the claims" : score >= 55 ? "Good: better than most of the market" : score >= 35 ? "Getting there: pledges outnumber proof" : score >= 15 ? "Weak: mostly marketing" : "Nothing to show";
  const avg = Math.round(BRANDS.reduce((s, b) => s + b.scores.transparency, 0) / BRANDS.length);
  return (
    <div className="screen">
      <TopBar title="Grade a brand" fallback="/learn" />
      <p className="lead">Open a brand's website, look for each item below, and tick what you can actually find. The weights mirror what the Fashion Transparency Index and Good On You reward.</p>
      <div className="card" style={{ display: "flex", gap: 16, alignItems: "center", position: "sticky", top: 8, zIndex: 5 }}>
        <ScoreRing score={score} size={76} stroke={8} />
        <div style={{ flex: 1 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brand you're grading" style={{ font: "inherit", fontWeight: 600, border: 0, borderBottom: "1px solid var(--line)", background: "transparent", color: "inherit", width: "100%", padding: "4px 0", outline: "none" }} />
          <p className="small muted" style={{ marginTop: 6 }}>{band}</p>
        </div>
      </div>
      <div className="card" style={{ padding: "4px 16px", marginTop: 12 }}>
        {GRADE_QUESTIONS.map((q) => (
          <button key={q.id} className={`check ${checked[q.id] ? "on" : ""}`} onClick={() => setChecked({ ...checked, [q.id]: !checked[q.id] })}>
            <span className="box">{checked[q.id] && <Icon name="check" size={16} />}</span>
            <span style={{ flex: 1 }}>
              <span className="small" style={{ display: "block" }}>{q.q}</span>
              <span className="tiny" style={{ color: LENS_COLOR[q.lens], fontWeight: 600 }}>{LENS_LABEL[q.lens]} · {q.w} pts</span>
            </span>
          </button>
        ))}
      </div>
      <div className="section card">
        <div className="eyebrow" style={{ marginBottom: 10 }}>Breakdown</div>
        {Object.entries(perLens).map(([k, v]) => <Meter key={k} label={LENS_LABEL[k]} value={v.got} max={v.of} color={LENS_COLOR[k]} suffix={`/${v.of}`} />)}
      </div>
      <div className="section note small">
        For scale: the 250 biggest brands average 26% on the Fashion Transparency Index<Cite k="fti2023" />, and the {BRANDS.length} brands in Weft's shop directory average {avg}/100 on transparency. A brand ticking 6 of these 11 boxes is already unusual.
      </div>
      <div className="row" style={{ marginTop: 14, gap: 10 }}>
        <button className="btn ghost" onClick={() => { setChecked({}); setName(""); }}>Reset</button>
        <button className="btn" style={{ flex: 1 }} onClick={() => nav("/shop")}>See how our brands score</button>
      </div>
    </div>
  );
}

function Greenwash() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [tally, setTally] = useState({ right: 0, done: 0 });
  const item = GREENWASH[i];
  const done = i >= GREENWASH.length;
  const choose = (v) => {
    if (pick) return;
    setPick(v);
    setTally((t) => ({ right: t.right + (v === item.verdict ? 1 : 0), done: t.done + 1 }));
  };
  const next = () => { setPick(null); setI(i + 1); };
  const label = { red: "Red flag", amber: "Depends", green: "Green flag" };
  return (
    <div className="screen">
      <TopBar title="Greenwash or not?" fallback="/learn" />
      <div className="row between" style={{ marginBottom: 12 }}>
        <span className="small muted">{Math.min(i + 1, GREENWASH.length)} of {GREENWASH.length}</span>
        <span className="chip mini soft">{tally.right} right</span>
      </div>
      <div className="progress" style={{ marginBottom: 16 }}><i style={{ width: `${(Math.min(i, GREENWASH.length) / GREENWASH.length) * 100}%` }} /></div>
      {done ? (
        <div className="quiz-card" style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <ScoreRing score={Math.round((tally.right / GREENWASH.length) * 100)} size={96} stroke={9} label={`${tally.right}/${GREENWASH.length}`} />
          <h2>{tally.right >= 8 ? "Hard to fool." : tally.right >= 5 ? "Getting sharper." : "Marketing works on all of us."}</h2>
          <p className="small muted">The pattern: specific, certified, checkable claims are green; vague words, sub-lines and offsets are red; recycled and 'natural' depend on the details.</p>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn ghost" onClick={() => { setI(0); setPick(null); setTally({ right: 0, done: 0 }); }}>Again</button>
            <button className="btn" onClick={() => nav("/learn/certs")}>Certification decoder</button>
          </div>
        </div>
      ) : (
        <div className="quiz-card">
          <div className="eyebrow">On the tag or the website</div>
          <h2 className="serif" style={{ fontSize: 26 }}>{item.claim}</h2>
          <div className="grid3" style={{ marginTop: "auto" }}>
            {["red", "amber", "green"].map((v) => (
              <button key={v} className={`flag ${pick ? (v === item.verdict ? (v === "amber" ? "" : v) : "") : ""} ${pick === v ? "picked" : ""}`} style={pick && v === item.verdict && v === "amber" ? { borderColor: "var(--warn)", color: "var(--warn)" } : {}} onClick={() => choose(v)}>
                {label[v]}
              </button>
            ))}
          </div>
          {pick && (
            <div className={`note ${item.verdict === "green" ? "moss" : item.verdict === "red" ? "clay" : ""}`} style={{ animation: "fade .25s" }}>
              <b>{pick === item.verdict ? "Right. " : `We'd call it "${label[item.verdict]}". `}</b>{item.why}<Cite k={item.cite} />
            </div>
          )}
          {pick && <button className="btn wide" onClick={next}>{i + 1 === GREENWASH.length ? "See result" : "Next claim"}</button>}
        </div>
      )}
    </div>
  );
}
