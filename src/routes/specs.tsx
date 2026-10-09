import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/specs")({
  head: () => ({
    meta: [
      { title: "Προδιαγραφές JSON — Ψηφιακό Μουσείο Σφραγιδόλιθων" },
      { name: "description", content: "Οδηγός και πρότυπα JSON για να συνδέσουν οι φοιτητές τη συλλογή τους στο κεντρικό μουσείο." },
      { property: "og:title", content: "Προδιαγραφές JSON για φοιτητές" },
      { property: "og:description", content: "Πρότυπα data.json και manifest.json έτοιμα για αντιγραφή." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Specs,
});

const DATA = `{
  "appTitle": "Τίτλος της εφαρμογής σου",
  "appDescription": "Σύντομη περιγραφή του concept της εφαρμογής.",
  "conceptType": "Storytelling | AI Reconstruction | Game | ...",
  "exhibits": [
    {
      "id": "seal-001",
      "title": "Φακοειδής σφραγιδόλιθος με λέοντα",
      "description": "Πλήρης αρχαιολογική περιγραφή του εκθέματος.",
      "material": "Σάρδιος",
      "period": "ΥΕ ΙΙ",
      "origin": "Μυκήνες",
      "sourceUrl": "https://arachne.dainst.org/entity/...",
      "images": {
        "original": "https://.../original.jpg",
        "photorealistic": "https://.../photorealistic.jpg",
        "livingScene": "https://.../living-scene.jpg"
      }
    }
  ]
}`;

const MANIFEST = `{ "student": "Ονοματεπώνυμο", "appUrl": "https://η-εφαρμογή-σου.lovable.app", "dataApi": "https://η-εφαρμογή-σου.lovable.app/data.json" }`;

const FIELDS: [string, string, string][] = [
  ["appTitle", "ναι", "Τίτλος της ατομικής εφαρμογής"],
  ["appDescription", "ναι", "Περιγραφή concept"],
  ["conceptType", "ναι", "Είδος εμπειρίας"],
  ["exhibits[].id", "ναι", "Μοναδικό αναγνωριστικό"],
  ["exhibits[].title", "ναι", "Τίτλος εκθέματος"],
  ["exhibits[].description", "ναι", "Αρχαιολογική περιγραφή"],
  ["exhibits[].material", "ναι", "π.χ. Ίασπις, Σάρδιος, Στεατίτης"],
  ["exhibits[].period", "ναι", "π.χ. ΥΕ ΙΙ"],
  ["exhibits[].origin", "ναι", "π.χ. Μυκήνες, Πύλος"],
  ["exhibits[].sourceUrl", "προαιρ.", "Σύνδεσμος CMS / Arachne"],
  ["exhibits[].images.*", "ναι", "Πλήρη URLs για original, photorealistic, livingScene"],
];

function Code({ code, label }: { code: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setOk(true); setTimeout(() => setOk(false), 1500); }} className="rounded bg-primary px-3 py-1 text-primary-foreground hover:bg-primary/90">
          {ok ? "Αντιγράφηκε ✓" : "Αντιγραφή"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

function Specs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link to="/" className="text-sm text-primary hover:underline">← Πίσω στο μουσείο</Link>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">Προδιαγραφές JSON</h1>
        <p className="mt-3 text-muted-foreground">Δημοσίευσε ένα αρχείο <code className="text-primary">data.json</code> στην εφαρμογή σου (π.χ. στο <code>/public/data.json</code>), επιτρέψτε CORS, και στείλε τη γραμμή του manifest στον διδάσκοντα.</p>

        <h2 className="mt-10 font-display text-2xl text-primary">1. data.json</h2>
        <div className="mt-3"><Code code={DATA} label="data.json" /></div>

        <h2 className="mt-10 font-display text-2xl text-primary">Πεδία</h2>
        <table className="mt-3 w-full text-sm">
          <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="py-2">Πεδίο</th><th>Υποχρ.</th><th>Περιγραφή</th></tr></thead>
          <tbody>{FIELDS.map(([f, r, d]) => <tr key={f} className="border-b border-border/50"><td className="py-2 font-mono text-xs text-primary">{f}</td><td>{r}</td><td className="text-muted-foreground">{d}</td></tr>)}</tbody>
        </table>

        <h2 className="mt-10 font-display text-2xl text-primary">2. Εγγραφή στο manifest.json</h2>
        <div className="mt-3"><Code code={MANIFEST} label="manifest entry" /></div>
      </div>
    </div>
  );
}
