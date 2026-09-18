import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { SOURCES, sourceIndex } from "../data/sources.js";

/* ---------- navigation (hash router) ---------- */
export const nav = (path) => { window.location.hash = path.startsWith("#") ? path : "#" + path; };
export const back = (fallback = "/") => {
  let seen = false; try { seen = sessionStorage.getItem("weft-nav") === "1"; } catch {}
  if (window.history.length > 1 && seen) window.history.back();
  else nav(fallback);
};
export function useRoute() {
  const parse = () => (window.location.hash.replace(/^#/, "") || "/").split("?")[0];
  const [path, setPath] = useState(parse);
  useEffect(() => {
    const h = () => { try { sessionStorage.setItem("weft-nav", "1"); } catch {} setPath(parse()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const segs = path.split("/").filter(Boolean);
  return { path, segs };
}

/* ---------- bottom sheet + citations ---------- */
const SheetCtx = createContext({ open: () => {}, openSource: () => {} });
export const useSheet = () => useContext(SheetCtx);

export function SheetProvider({ children }) {
  const [content, setContent] = useState(null);
  const open = (node) => setContent(() => node);
  const close = () => setContent(null);
  const openSource = (k) => open(<SourceCard k={k} />);
  useEffect(() => {
    document.body.style.overflow = content ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [content]);
  useEffect(() => {
    const h = () => setContent(null);
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return (
    <SheetCtx.Provider value={{ open, close, openSource }}>
      {children}
      {content && (
        <>
          <div className="sheet-backdrop" onClick={close} />
          <div className="sheet" role="dialog">
            <div className="handle" />
            {content}
            <button className="btn ghost wide" style={{ marginTop: 18 }} onClick={close}>Close</button>
          </div>
        </>
      )}
    </SheetCtx.Provider>
  );
}

export function Cite({ k }) {
  const { openSource } = useSheet();
  if (!SOURCES[k]) return null;
  return (
    <button className="cite" onClick={(e) => { e.stopPropagation(); openSource(k); }} aria-label={`Source ${sourceIndex(k)}`}>
      {sourceIndex(k)}
    </button>
  );
}

export function SourceCard({ k }) {
  const s = SOURCES[k];
  if (!s) return null;
  return (
    <div className="stack">
      <div className="row">
        <span className="chip ochre mini">Source {sourceIndex(k)}</span>
        <span className="chip mini">{s.type}</span>
      </div>
      <h3 className="serif" style={{ fontSize: 19 }}>{s.title}</h3>
      <p className="small muted">{s.org} · {s.year}</p>
      <p className="small">{s.note}</p>
      <a className="small" href={s.url} target="_blank" rel="noreferrer">Open the original ↗</a>
    </div>
  );
}

/* ---------- small building blocks ---------- */
export function TopBar({ title, fallback = "/", right }) {
  return (
    <div className="topbar">
      <button className="back" onClick={() => back(fallback)} aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h1>{title}</h1>
      {right}
    </div>
  );
}

export function Chip({ on, onClick, children, tone, mini }) {
  return <button className={`chip ${on ? "on" : ""} ${tone || ""} ${mini ? "mini" : ""}`} onClick={onClick}>{children}</button>;
}

export function Dots({ n, of = 5, tone }) {
  return (
    <span className={`dots ${tone || ""}`}>
      {Array.from({ length: of }).map((_, i) => <i key={i} className={i < n ? "on" : ""} />)}
    </span>
  );
}

export function Meter({ label, value, max = 100, color, suffix = "" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="meter">
      <span className="muted">{label}</span>
      <span className="bar"><i style={{ width: pct + "%", background: color || "var(--moss)" }} /></span>
      <span className="val">{value}{suffix}</span>
    </div>
  );
}

export function ScoreRing({ score, size = 64, stroke = 7, color, label }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const col = color || (score >= 60 ? "var(--good)" : score >= 40 ? "var(--warn)" : "var(--bad)");
  return (
    <span className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <span className="num" style={{ fontSize: size * 0.3 }}>{label ?? score}</span>
    </span>
  );
}

export function CountUp({ value, prefix = "", suffix = "", duration = 1200 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setV(value); return; }
    let raf, start;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const tick = (t) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        setV(Math.round(value * ease));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref} className="count">{prefix}{v}{suffix}</span>;
}

/* ---------- radar chart ---------- */
export function RadarChart({ axes, series, size = 260, max = 5 }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 30;
  const n = axes.length;
  const ang = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, v) => [cx + Math.cos(ang(i)) * R * (v / max), cy + Math.sin(ang(i)) * R * (v / max)];
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <svg viewBox={`-48 0 ${size + 96} ${size}`} width="100%" style={{ maxWidth: size + 96, display: "block", margin: "0 auto" }}>
      {rings.map((f) => (
        <polygon key={f} points={axes.map((_, i) => pt(i, max * f).join(",")).join(" ")} fill="none" stroke="var(--line)" strokeWidth="1" />
      ))}
      {axes.map((a, i) => {
        const [x, y] = pt(i, max);
        const c = Math.cos(ang(i)), sn = Math.sin(ang(i));
        const [lx, ly] = [cx + c * (R + 14), cy + sn * (R + 14)];
        const anchor = c > 0.3 ? "start" : c < -0.3 ? "end" : "middle";
        return (
          <g key={a.k}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" />
            <text x={lx} y={ly} fontSize="10" fill="var(--muted)" textAnchor={anchor} dominantBaseline="middle" fontFamily="var(--sans)">{a.label}</text>
          </g>
        );
      })}
      {series.map((s) => (
        <g key={s.name}>
          <polygon points={axes.map((a, i) => pt(i, s.values[a.k] ?? 0).join(",")).join(" ")} fill={s.color} fillOpacity=".18" stroke={s.color} strokeWidth="2" strokeLinejoin="round" style={{ transition: "all .4s" }} />
          {axes.map((a, i) => { const [x, y] = pt(i, s.values[a.k] ?? 0); return <circle key={a.k} cx={x} cy={y} r="3" fill={s.color} />; })}
        </g>
      ))}
    </svg>
  );
}

/* ---------- icons ---------- */
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
export function Icon({ name, size = 24 }) {
  const paths = {
    home: <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z" />,
    leaf: <><path d="M4 20c0-9 6-15 16-16-1 10-7 16-16 16z" /><path d="M4 20l9-9" /></>,
    weave: <><path d="M4 4h16v16H4z" /><path d="M4 9h16M4 15h16M9 4v16M15 4v16" /></>,
    bag: <><path d="M6 8h12l1 13H5z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    cloud: <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4 4 0 0 1-1 9z" />,
    drop: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
    loop: <><path d="M4 12a8 8 0 0 1 14-5l2 2" /><path d="M20 4v5h-5" /><path d="M20 12a8 8 0 0 1-14 5l-2-2" /><path d="M4 20v-5h5" /></>,
    people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16 15.5a5 5 0 0 1 5.5 4.5" /></>,
    paw: <><circle cx="7" cy="9" r="1.8" /><circle cx="11" cy="6" r="1.8" /><circle cx="16" cy="7" r="1.8" /><circle cx="19" cy="12" r="1.6" /><path d="M8 19c0-3 2.5-6 5.5-6s5 3 5 5-1.5 3-3 3-2-1-2.5-1-1 1-2.5 1S8 20.5 8 19z" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    wash: <><path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M4 9l1.5 10h13L20 9" /></>,
    dry: <><path d="M4 6c4 0 4 3 8 3s4-3 8-3" /><path d="M12 9v11" /></>,
    iron: <><path d="M7 8h9a4 4 0 0 1 4 4v4H3l2-6a3 3 0 0 1 2-2z" /><path d="M9 8V6a2 2 0 0 1 2-2h4" /></>,
    repair: <><path d="M14 4l6 6-9 9H5v-6z" /><path d="M12 6l6 6" /></>,
    air: <><path d="M4 8h10a2.5 2.5 0 1 0-2.5-2.5" /><path d="M4 13h14a2.5 2.5 0 1 1-2.5 2.5" /><path d="M4 18h7" /></>,
    flat: <><path d="M3 15h18" /><path d="M6 15c1-3 3-4 6-4s5 1 6 4" /></>,
    moth: <><path d="M12 6v12" /><path d="M12 8c-3-3-7-3-8 0s1 6 8 5c7 1 9-2 8-5s-5-3-8 0z" /><path d="M12 13c-3 0-6 2-6 5s3 2 6 0c3 2 6 3 6 0s-3-5-6-5z" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>,
    check: <path d="M5 12l4 4 10-10" />,
    book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 5v16" /></>,
    star: <path d="M12 3l2.8 6 6.2.7-4.6 4.3 1.3 6.3L12 17l-5.7 3.3 1.3-6.3L3 9.7 9.2 9z" />,
    tag: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.3" /></>,
    sliders: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" {...P}>{paths[name] || paths.star}</svg>;
}

/* ---------- garment silhouettes ---------- */
export function Garment({ type, size = 36, color = "currentColor" }) {
  const g = {
    tee: <path d="M8 6l4-2 3 3 3-3 4 2 3 5-4 2v11H9V13L5 11z" />,
    top: <path d="M10 5l2 5 2-5 3 1v18H7V6z" />,
    shirt: <><path d="M8 5l4-2 3 2 3-2 4 2 3 5-4 2v12H9V12L5 10z" /><path d="M15 6v16" /></>,
    hoodie: <><path d="M8 7l4-3h6l4 3 3 5-4 2v11H9V14L5 12z" /><path d="M12 4c0 3 1 5 3 5s3-2 3-5" /><path d="M15 15v6" /></>,
    sweater: <><path d="M8 6l4-2h6l4 2 3 6-4 1v12H9V13L5 12z" /><path d="M12 4c0 2 1 3 3 3s3-1 3-3" /></>,
    jacket: <><path d="M8 6l4-2 3 4 3-4 4 2 3 6-4 1v12H9V13L5 12z" /><path d="M15 8v17" /><path d="M11 25v-6M19 25v-6" /></>,
    coat: <><path d="M8 5l4-2 3 3 3-3 4 2 3 7-4 1v13H9V13L5 12z" /><path d="M15 6v20" /></>,
    blazer: <><path d="M8 5l5-2 2 5 2-5 5 2 3 7-4 1v13H9V13L5 12z" /><path d="M13 3l2 22 2-22" /></>,
    dress: <><path d="M11 4l4 3 4-3 2 7-2 2 4 13H7l4-13-2-2z" /></>,
    skirt: <path d="M9 8h12l4 16H5z" />,
    jeans: <><path d="M9 4h12v7l-1 15h-4l-1-12-1 12H10L9 11z" /><path d="M9 8h12" /></>,
    pants: <><path d="M10 4h10v8l-1 14h-3l-1-11-1 11h-3l-1-14z" /></>,
    leggings: <><path d="M10 4h10v7l-1 15h-3l-1-11-1 11h-3l-1-15z" /><path d="M10 7h10" /></>,
    shorts: <path d="M9 5h12l1 11h-6l-1-5-1 5H8z" />,
    sneaker: <><path d="M4 20c0-3 3-4 6-5l3-7 3 2 6 4c3 1 4 2 4 5H4z" /><path d="M4 20h22v2H4z" /><path d="M13 10l2 2M15 8l2 2" /></>,
    boots: <><path d="M10 3h8v12l6 4v3H8v-5l2-2z" /><path d="M8 22h16" /></>,
    bag: <><path d="M6 10h18l-1 15H7z" /><path d="M11 10V7a4 4 0 0 1 8 0v3" /></>,
    socks: <><path d="M11 3h8v11l5 5a4 4 0 0 1-6 5l-6-6z" /><path d="M11 7h8" /></>,
    underwear: <path d="M7 6h16l-1 6-5 3v9h-4v-9l-5-3z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 30 30" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">{g[type] || g.tee}</svg>;
}

/* ---------- care symbols (ISO 3758 style) ---------- */
export function CareSymbol({ draw, arg, size = 44 }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const cross = <path d="M6 6L34 34M34 6L6 34" {...s} strokeWidth="2.4" />;
  const dots = (n, y = 20, x0 = 20) => Array.from({ length: n }).map((_, i) => <circle key={i} cx={x0 + (i - (n - 1) / 2) * 7} cy={y} r="2.2" fill="currentColor" />);
  let inner = null;
  if (draw === "tub") {
    inner = (
      <>
        <path d="M4 12c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 8 0" {...s} />
        <path d="M6 13l3 17h22l3-17" {...s} />
        {arg === "hand" && <path d="M18 8c0-3 2-5 4-5s4 2 4 5v5" {...s} />}
        {arg !== "hand" && arg !== "no" && <text x="20" y="27" fontSize="11" fontWeight="700" textAnchor="middle" fill="currentColor" fontFamily="var(--sans)">{arg}</text>}
        {arg === "no" && cross}
      </>
    );
  } else if (draw === "tri") {
    inner = (
      <>
        <path d="M20 5l16 28H4z" {...s} />
        {arg === "ox" && <path d="M14 30l8-14M18 30l8-14" {...s} strokeWidth="1.6" />}
        {arg === "no" && cross}
      </>
    );
  } else if (draw === "tumble") {
    inner = (
      <>
        <rect x="5" y="5" width="30" height="30" rx="2" {...s} />
        <circle cx="20" cy="20" r="11" {...s} />
        {arg !== "no" && dots(Number(arg))}
        {arg === "no" && cross}
      </>
    );
  } else if (draw === "sq") {
    inner = (
      <>
        <rect x="5" y="5" width="30" height="30" rx="2" {...s} />
        {arg === "line" && <path d="M5 10c5 6 25 6 30 0" {...s} />}
        {arg === "drip" && <path d="M14 9v22M20 9v22M26 9v22" {...s} />}
        {arg === "flat" && <path d="M9 20h22" {...s} />}
        {arg === "shade" && <path d="M8 9l10 10M8 17l4 4" {...s} strokeWidth="1.6" />}
      </>
    );
  } else if (draw === "iron") {
    inner = (
      <>
        <path d="M11 12h15a6 6 0 0 1 6 6v8H5l3-11a3 3 0 0 1 3-3z" {...s} />
        <path d="M14 12V9a2 2 0 0 1 2-2h8" {...s} />
        {arg !== "no" && dots(Number(arg), 20, 19)}
        {arg === "no" && cross}
      </>
    );
  } else if (draw === "circle") {
    inner = (
      <>
        <circle cx="20" cy="20" r="14" {...s} />
        {arg !== "no" && <text x="20" y="25" fontSize="14" fontWeight="700" textAnchor="middle" fill="currentColor" fontFamily="var(--sans)">{arg}</text>}
        {arg === "no" && cross}
      </>
    );
  }
  return <svg width={size} height={size} viewBox="0 0 40 40">{inner}</svg>;
}

/* ---------- persistence ---------- */
export function useStored(key, initial) {
  const [v, setV] = useState(() => {
    try { const raw = localStorage.getItem("weft:" + key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem("weft:" + key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

export const LENS_COLOR = { climate: "var(--moss)", water: "var(--sky)", materials: "var(--plum)", people: "var(--clay)", animals: "var(--ochre)", transparency: "var(--ochre)" };
export const LENS_LABEL = { climate: "Climate", water: "Water & chemicals", materials: "Materials & waste", people: "People", animals: "Animals", transparency: "Transparency" };
