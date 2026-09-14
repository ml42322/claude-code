import React from "react";
import { HEADLINE_STATS } from "../data/sustainability.js";
import { Cite, Icon, nav, useStored } from "../components/ui.jsx";

const SECTIONS = [
  { id: "learn", title: "What is sustainable?", sub: "Six lenses, the raters, and how to spot greenwash", icon: "leaf", tone: "moss", total: 8 },
  { id: "fabrics", title: "Know your fabrics", sub: "How 16 fibres are made, shipped, worn and cared for", icon: "weave", tone: "sky", total: 12 },
  { id: "shop", title: "Shop by style and values", sub: "35 brands ranked on your priorities, style and budget", icon: "bag", tone: "clay", total: 8 },
];

export default function Home() {
  const [visited] = useStored("visited", []);
  const day = Math.floor(Date.now() / 86400000);
  const fact = HEADLINE_STATS[day % HEADLINE_STATS.length];
  const counts = (id) => visited.filter((v) => v.startsWith(id + "/")).length;
  return (
    <div className="screen">
      <div className="hero">
        <div className="eyebrow">Weft</div>
        <h1 style={{ marginTop: 6 }}>Sustainable fashion, decoded.</h1>
        <p style={{ marginTop: 10, maxWidth: 300 }}>What the word means, what your clothes are made of, and which brands earn the label. Every number has a source.</p>
        <svg className="bg" viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth="2"><path d="M10 20h80M10 40h80M10 60h80M10 80h80" /><path d="M25 5v90M50 5v90M75 5v90" strokeDasharray="6 4" /></svg>
      </div>

      <div className="section">
        <div className="eyebrow">Today's thread</div>
        <div className="card">
          <div className="bignum" style={{ color: "var(--moss)" }}>{fact.prefix || ""}{fact.value}{fact.suffix}</div>
          <p className="small" style={{ marginTop: 8 }}>{fact.label}<Cite k={fact.cite} /></p>
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">Three dimensions</div>
        <div className="stack">
          {SECTIONS.map((s) => {
            const done = Math.min(s.total, counts(s.id));
            return (
              <button key={s.id} className="card tap" style={{ width: "100%", textAlign: "left" }} onClick={() => nav("/" + s.id)}>
                <div className="row" style={{ gap: 14 }}>
                  <span className="list-item" style={{ padding: 0, border: 0, width: "auto" }}>
                    <span className="icon" style={{ background: `var(--${s.tone}-soft)`, color: `var(--${s.tone})` }}><Icon name={s.icon} /></span>
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3>{s.title}</h3>
                    <p className="small muted" style={{ marginTop: 3 }}>{s.sub}</p>
                  </div>
                  <Icon name="arrow" size={20} />
                </div>
                <div className="row" style={{ marginTop: 12, gap: 10 }}>
                  <div className="progress" style={{ flex: 1 }}><i style={{ width: `${(done / s.total) * 100}%`, background: `var(--${s.tone})` }} /></div>
                  <span className="tiny muted">{done}/{s.total} explored</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="eyebrow">Start with a tool</div>
        <div className="grid3">
          {[
            { t: "Grade a brand", p: "/learn/grade", i: "check" },
            { t: "Decode a label", p: "/fabrics/labels", i: "tag" },
            { t: "Match my style", p: "/shop/match", i: "sliders" },
          ].map((x) => (
            <button key={x.p} className="card tap" style={{ padding: 12, textAlign: "left" }} onClick={() => nav(x.p)}>
              <span style={{ color: "var(--moss)" }}><Icon name={x.i} /></span>
              <div className="small" style={{ fontWeight: 600, marginTop: 8, lineHeight: 1.25 }}>{x.t}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <button className="list-item" onClick={() => nav("/sources")}>
          <span className="icon"><Icon name="book" /></span>
          <div className="body">
            <div className="title">Sources & method</div>
            <div className="small muted">40 research reports, LCAs, indices and investigations behind the app</div>
          </div>
          <Icon name="arrow" size={18} />
        </button>
      </div>
    </div>
  );
}
