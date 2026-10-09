export type ManifestEntry = { student: string; appUrl: string; dataApi: string };
export type Exhibit = {
  id: string;
  title: string;
  description: string;
  material: string;
  period: string;
  origin: string;
  sourceUrl?: string | undefined;
  images: { original?: string | undefined; photorealistic?: string | undefined; livingScene?: string | undefined };
  studentName: string;
  appTitle: string;
  appUrl: string;
  appDescription: string;
  conceptType: string;
};
export type Failure = { student: string; reason: string };

export const MANIFEST_URL = import.meta.env['VITE_MANIFEST_URL'] || "/manifest.json";

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

/** Turn image paths like "/images/x.jpg" into absolute URLs on the student's site. */
export function resolveUrl(src: string | undefined, base: string): string | undefined {
  if (!src) return src;
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
}

async function loadStudentJson(dataApi: string): Promise<unknown> {
  if (/^https?:\/\//i.test(dataApi)) {
    const { fetchStudentData } = await import("./student-data.functions");
    const res = await fetchStudentData({ data: { url: dataApi } });
    if (!res.ok) throw new Error(res.error);
    return JSON.parse(res.json);
  }
  const r = await fetch(dataApi);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function aggregate(manifestUrl = MANIFEST_URL) {
  const res = await fetch(manifestUrl);
  if (!res.ok) throw new Error(`Αποτυχία φόρτωσης manifest (${res.status})`);
  const manifest: ManifestEntry[] = await res.json();
  const results = await Promise.allSettled(
    manifest.map(async (m) => {
      const json = await loadStudentJson(m.dataApi);
      const isRemote = /^https?:\/\//i.test(m.dataApi);
      const base = isRemote ? m.dataApi : m.appUrl;
      return normalize(m, json).map((e) =>
        isRemote
          ? {
              ...e,
              images: {
                original: resolveUrl(e.images.original, base),
                photorealistic: resolveUrl(e.images.photorealistic, base),
                livingScene: resolveUrl(e.images.livingScene, base),
              },
            }
          : e,
      );
    }),
  );
  const exhibits: Exhibit[] = [];
  const failures: Failure[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") exhibits.push(...r.value);
    else failures.push({ student: manifest[i]?.student ?? '?', reason: String(r.reason?.message ?? r.reason) });
  });
  return { manifest, exhibits, failures, collections: manifest.length - failures.length };
}
