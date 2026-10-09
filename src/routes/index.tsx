import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { aggregate, type Exhibit, type Failure } from "@/lib/aggregate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Συλλογικό Ψηφιακό Μουσείο Μυκηναϊκών Σφραγιδόλιθων" },
      { name: "description", content: "Ενιαία έκθεση όλων των φοιτητικών συλλογών Μυκηναϊκών σφραγιδόλιθων." },
      { property: "og:title", content: "Συλλογικό Ψηφιακό Μουσείο Μυκηναϊκών Σφραγιδόλιθων" },
      { property: "og:description", content: "Ενιαία έκθεση όλων των φοιτητικών συλλογών Μυκηναϊκών σφραγιδόλιθων." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type ImgKey = "original" | "photorealistic" | "livingScene";
const TABS: { key: ImgKey; label: string }[] = [
  { key: "original", label: "Original" },
  { key: "photorealistic", label: "AI Photorealistic" },
  { key: "livingScene", label: "AI Living Scene" },
];

function Img({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (!src) return <div className={`flex items-center justify-center bg-muted text-xs text-muted-foreground ${className}`}>Δεν υπάρχει εικόνα</div>;
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}

function Index() {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [failures, setFailures] = useState<Failure[]>([]);
  const [collections, setCollections] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [student, setStudent] = useState("");
  const [material, setMaterial] = useState("");
  const [origin, setOrigin] = useState("");
  const [open, setOpen] = useState<Exhibit | null>(null);

  useEffect(() => {
    aggregate()
      .then((r) => { setExhibits(r.exhibits); setFailures(r.failures); setCollections(r.collections); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const uniq = (k: keyof Exhibit) => [...new Set(exhibits.map((e) => String(e[k])))].sort();
  const students = useMemo(() => uniq("studentName"), [exhibits]);
  const materials = useMemo(() => uniq("material"), [exhibits]);
  const origins = useMemo(() => uniq("origin"), [exhibits]);

  const filtered = exhibits.filter((e) => {
    const t = q.toLowerCase();
    return (!t || `${e.title} ${e.description} ${e.material}`.toLowerCase().includes(t))
      && (!student || e.studentName === student)
      && (!material || e.material === material)
      && (!origin || e.origin === origin);
  });

  const sel = "rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Master Exhibition Portal · <Link to="/specs" className="underline">Προδιαγραφές JSON</Link></p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">Συλλογικό Ψηφιακό Μουσείο<br />Μυκηναϊκών Σφραγιδόλιθων</h1>
          <div className="mt-10 flex flex-wrap justify-center gap-px overflow-hidden rounded-lg border border-border bg-border">
            {[[collections, "Συλλογές"], [exhibits.length, "Συνολικά Εκθέματα"], [students.length, "Δημιουργοί"]].map(([n, l]) => (
              <div key={l as string} className="bg-card px-8 py-4">
                <div className="font-display text-3xl text-primary">{loading ? "…" : n}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 grid gap-3 md:grid-cols-4">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Αναζήτηση σε τίτλο, περιγραφή, υλικό…" className={sel} />
          <select value={student} onChange={(e) => setStudent(e.target.value)} className={sel}><option value="">Όλοι οι δημιουργοί</option>{students.map((s) => <option key={s}>{s}</option>)}</select>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className={sel}><option value="">Όλα τα υλικά</option>{materials.map((s) => <option key={s}>{s}</option>)}</select>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={sel}><option value="">Όλες οι προελεύσεις</option>{origins.map((s) => <option key={s}>{s}</option>)}</select>
        </div>

        {loading && <p className="text-center text-muted-foreground">Συγκέντρωση συλλογών…</p>}
        {error && <p role="alert" className="text-center text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && <p className="text-center text-muted-foreground">Δεν βρέθηκαν εκθέματα.</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => <Card key={e.id} e={e} onOpen={() => setOpen(e)} />)}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        {failures.length > 0 && (
          <div className="mx-auto mb-3 max-w-xl rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-primary">
            ⚠ Δεν φορτώθηκαν {failures.length} συλλογ{failures.length === 1 ? "ή" : "ές"}: {failures.map((f) => f.student).join(", ")}
          </div>
        )}
        Συλλογικό Ψηφιακό Μουσείο · Μυκηναϊκοί Σφραγιδόλιθοι
      </footer>

      {open && <Modal e={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Card({ e, onOpen }: { e: Exhibit; onOpen: () => void }) {
  const [tab, setTab] = useState<ImgKey>("original");
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:border-primary/50">
      <button onClick={onOpen} className="block w-full"><Img src={e.images[tab]} alt={e.title} className="aspect-square w-full transition duration-500 group-hover:scale-[1.02]" /></button>
      <div className="flex border-b border-border text-[11px]">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2 transition ${tab === t.key ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
        ))}
      </div>
      <div className="space-y-3 p-5">
        <button onClick={onOpen} className="text-left font-display text-xl hover:text-primary">{e.title}</button>
        <dl className="grid grid-cols-3 gap-2 text-xs">
          {[["Υλικό", e.material], ["Περίοδος", e.period], ["Προέλευση", e.origin]].map(([k, v]) => (
            <div key={k}><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">{e.studentName}</span>
          <a href={e.appUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary">Δες την ατομική εμπειρία ↗</a>
        </div>
      </div>
    </article>
  );
}

function Modal({ e, onClose }: { e: Exhibit; onClose: () => void }) {
  const [pos, setPos] = useState(50);
  useEffect(() => {
    const h = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/85 p-4 backdrop-blur" onClick={onClose}>
      <div role="dialog" aria-modal className="mx-auto my-8 max-w-5xl rounded-xl border border-border bg-card p-6" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">{e.studentName} · {e.appTitle}</p>
            <h2 className="mt-1 font-display text-3xl">{e.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Κλείσιμο" className="text-2xl text-muted-foreground hover:text-foreground">×</button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {TABS.map((t) => (
            <figure key={t.key}><Img src={e.images[t.key]} alt={`${e.title} – ${t.label}`} className="aspect-square w-full rounded-lg" /><figcaption className="mt-1 text-center text-xs text-muted-foreground">{t.label}</figcaption></figure>
          ))}
        </div>

        {e.images.original && e.images.photorealistic && (
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Σύγκριση Original / AI Photorealistic</p>
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-lg">
              <img src={e.images.photorealistic} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <img src={e.images.original} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
              <div className="absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${pos}%` }} />
              <input type="range" min={0} max={100} value={pos} onChange={(ev) => setPos(+ev.target.value)} aria-label="Σύγκριση" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="font-display text-lg text-primary">Αρχαιολογική περιγραφή</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{e.description || "—"}</p>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {[["Υλικό", e.material], ["Περίοδος", e.period], ["Προέλευση", e.origin]].map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd>{v}</dd></div>)}
            </dl>
            {e.sourceUrl && <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-primary hover:underline">Πρωτογενής πηγή (CMS / Arachne) ↗</a>}
          </div>
          <aside className="rounded-lg border border-border bg-secondary/50 p-4">
            <h3 className="font-display text-lg text-primary">Η εφαρμογή του φοιτητή</h3>
            {e.conceptType && <span className="mt-2 inline-block rounded-full border border-primary/40 px-2 py-0.5 text-xs text-primary">{e.conceptType}</span>}
            <p className="mt-2 text-sm text-muted-foreground">{e.appDescription || "—"}</p>
            <a href={e.appUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">Δες την ατομική εμπειρία ↗</a>
          </aside>
        </div>
      </div>
    </div>
  );
}
