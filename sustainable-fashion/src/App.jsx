import React, { useEffect } from "react";
import { SheetProvider, useRoute, nav, Icon, useStored } from "./components/ui.jsx";
import Home from "./screens/Home.jsx";
import Learn from "./screens/Learn.jsx";
import Fabrics from "./screens/Fabrics.jsx";
import Shop from "./screens/Shop.jsx";
import Sources from "./screens/Sources.jsx";

const TABS = [
  { id: "", name: "Home", icon: "home" },
  { id: "learn", name: "Learn", icon: "leaf" },
  { id: "fabrics", name: "Fabrics", icon: "weave" },
  { id: "shop", name: "Shop", icon: "bag" },
];

function Shell() {
  const { segs } = useRoute();
  const tab = segs[0] || "";
  const [visited, setVisited] = useStored("visited", []);
  useEffect(() => {
    if (segs.length >= 2) {
      const key = segs.slice(0, 2).join("/");
      if (!visited.includes(key)) setVisited([...visited, key]);
    }
  }, [segs.join("/")]);
  let screen;
  if (tab === "learn") screen = <Learn segs={segs} />;
  else if (tab === "fabrics") screen = <Fabrics segs={segs} />;
  else if (tab === "shop") screen = <Shop segs={segs} />;
  else if (tab === "sources") screen = <Sources />;
  else screen = <Home />;
  return (
    <div className="app">
      <div key={segs.join("/")}>{screen}</div>
      <nav className="nav">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => nav("/" + t.id)}>
            <Icon name={t.icon} />
            {t.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <SheetProvider>
      <Shell />
    </SheetProvider>
  );
}
