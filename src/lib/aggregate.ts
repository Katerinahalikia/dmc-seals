export type ManifestEntry = { student: string; appUrl: string; dataApi: string };
export type Exhibit = {
  id: string;
  title: string;
  description: string;
  material: string;
  period: string;
  origin: string;
  sourceUrl?: string;
  images: { original?: string; photorealistic?: string; livingScene?: string };
  studentName: string;
  appTitle: string;
  appUrl: string;
  appDescription: string;
  conceptType: string;
};
export type Failure = { student: string; reason: string };

export const MANIFEST_URL = import.meta.env.VITE_MANIFEST_URL || "/manifest.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalize(entry: ManifestEntry, data: any): Exhibit[] {
  const list: any[] = Array.isArray(data) ? data : data?.exhibits ?? data?.items ?? [];
  const appTitle = data?.appTitle ?? data?.title ?? entry.student;
  return list.map((e, i) => ({
    id: `${entry.student}-${e.id ?? i}`,
    title: e.title ?? "Χωρίς τίτλο",
    description: e.description ?? "",
    material: e.material ?? "—",
    period: e.period ?? "—",
    origin: e.origin ?? e.provenance ?? "—",
    sourceUrl: e.sourceUrl,
    images: {
      original: e.images?.original ?? e.imageOriginal ?? e.image,
      photorealistic: e.images?.photorealistic ?? e.imagePhotorealistic,
      livingScene: e.images?.livingScene ?? e.imageLivingScene,
    },
    studentName: entry.student,
    appTitle,
    appUrl: entry.appUrl,
    appDescription: data?.appDescription ?? "",
    conceptType: data?.conceptType ?? "",
  }));
}

export async function aggregate(manifestUrl = MANIFEST_URL) {
  const res = await fetch(manifestUrl);
  if (!res.ok) throw new Error(`Αποτυχία φόρτωσης manifest (${res.status})`);
  const manifest: ManifestEntry[] = await res.json();
  const results = await Promise.allSettled(
    manifest.map(async (m) => {
      const r = await fetch(m.dataApi);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return normalize(m, await r.json());
    }),
  );
  const exhibits: Exhibit[] = [];
  const failures: Failure[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") exhibits.push(...r.value);
    else failures.push({ student: manifest[i].student, reason: String(r.reason?.message ?? r.reason) });
  });
  return { manifest, exhibits, failures, collections: manifest.length - failures.length };
}
