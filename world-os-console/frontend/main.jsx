import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadProjects() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects().catch(console.error);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "16px" }}>
      <h1>World-OS Console (MVP)</h1>
      <p>Minimaler Editor für World-OS-Projekte (T0–T5) – ohne KI.</p>

      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ flex: 1 }}>
          <h2>Projekte</h2>
          {loading && <p>Lade...</p>}
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                <button onClick={() => setSelected(p)} style={{ cursor: "pointer" }}>
                  {p.name} <small>({p.id})</small>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 2 }}>
          <h2>Projekt-Details</h2>
          {!selected && <p>Wähle ein Projekt aus der Liste.</p>}
          {selected && (
            <div>
              <h3>{selected.name}</h3>
              <p>
                <strong>Typ:</strong> {selected.type}
              </p>
              <p>{selected.description}</p>
              <h4>Tier-Roadmap</h4>
              <ol>
                <li>T0 – Foundation</li>
                <li>T1 – World Core</li>
                <li>T2 – Modules &amp; Systems</li>
                <li>T3 – Characters</li>
                <li>T4 – Zones</li>
                <li>T5 – Narrative Chains</li>
              </ol>
              <p>
                Dies ist nur ein <em>Viewer</em> – die Editor-Views für die einzelnen Tiers können hier
                nach und nach ergänzt werden.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
