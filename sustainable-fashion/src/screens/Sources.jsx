import React from "react";
import { SOURCES, SOURCE_KEYS, sourceIndex } from "../data/sources.js";
import { TopBar, useSheet, SourceCard } from "../components/ui.jsx";

export default function Sources() {
  const { open } = useSheet();
  const types = [...new Set(SOURCE_KEYS.map((k) => SOURCES[k].type))];
  return (
    <div className="screen">
      <TopBar title="Sources & method" />
      <p className="lead">Every statistic, score and claim in Weft points to one of these. Tap any numbered chip in the app to see the source it rests on.</p>
      <div className="note moss small">
        <b>How to read the evidence.</b> Peer-reviewed research and standards are the firmest ground. Industry LCAs (like Levi's) are rigorous but chosen by the company. NGO indices and investigations are independent but have a point of view. Journalism documents specific events. Figures were compiled in 2026 and may have been updated since; the links go to the originals.
      </div>
      {types.map((t) => (
        <div className="section" key={t}>
          <div className="eyebrow">{t}</div>
          <div className="card" style={{ padding: "4px 16px" }}>
            {SOURCE_KEYS.filter((k) => SOURCES[k].type === t).map((k) => {
              const s = SOURCES[k];
              return (
                <button key={k} className="list-item" onClick={() => open(<SourceCard k={k} />)}>
                  <span className="cite" style={{ margin: 0, minWidth: 26, height: 26, fontSize: 12 }}>{sourceIndex(k)}</span>
                  <div className="body">
                    <div className="small" style={{ fontWeight: 600 }}>{s.title}</div>
                    <div className="tiny muted">{s.org} · {s.year}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
