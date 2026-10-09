import { createServerFn } from "@tanstack/react-start";

// Fetches a student's data.json from the server side, so the student's site
// does not need CORS headers.
export const fetchStudentData = createServerFn({ method: "GET" })
  .inputValidator((input: { url: string }) => {
    const u = new URL(input.url);
    if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Invalid URL");
    return { url: u.toString() };
  })
  .handler(async ({ data }) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    try {
      const r = await fetch(data.url, { signal: ctrl.signal, headers: { Accept: "application/json" } });
      if (!r.ok) return { ok: false as const, error: `HTTP ${r.status}` };
      const text = await r.text();
      if (text.length > 2_000_000) return { ok: false as const, error: "Too large" };
      return { ok: true as const, json: text };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Network error" };
    } finally {
      clearTimeout(t);
    }
  });
