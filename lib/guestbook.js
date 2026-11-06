// Helpers for the guestbook's Pages Functions (functions/api).
// Notes live in the GUESTBOOK KV namespace: "pending:<id>" until approved, then "approved:<id>".

export const MAX_NAME = 30;
export const MAX_MESSAGE = 160;

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// Collapse whitespace, drop control characters and trim to a maximum length.
export const clean = (value, max) =>
  String(value ?? "")
    // eslint-disable-next-line no-control-regex -- stripping control characters is the point
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export async function sha256(text) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Compares two strings in time that doesn't depend on where they differ.
export function sameSecret(a, b) {
  const x = new TextEncoder().encode(String(a)), y = new TextEncoder().encode(String(b));
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function listNotes(kv, prefix, limit = 100) {
  const { keys } = await kv.list({ prefix, limit });
  const notes = await Promise.all(keys.map((k) => kv.get(k.name, "json")));
  return notes.filter(Boolean).sort((a, b) => b.at - a.at);
}
