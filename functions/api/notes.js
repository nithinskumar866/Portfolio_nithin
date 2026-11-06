// Public guestbook API.
// GET  /api/notes  -> the approved notes, newest first.
// POST /api/notes  -> { name?, message } queues a note for approval. Nothing appears until it's approved.
import { MAX_MESSAGE, MAX_NAME, clean, json, listNotes, sha256 } from "../../lib/guestbook.js";

const PENDING_LIMIT = 200;

export async function onRequestGet({ env }) {
  if (!env.GUESTBOOK) return json({ notes: [] });
  const notes = await listNotes(env.GUESTBOOK, "approved:");
  return json({ notes: notes.slice(0, 30).map(({ name, message, at }) => ({ name, message, at })) });
}

export async function onRequestPost({ request, env }) {
  if (!env.GUESTBOOK) return json({ error: "The guestbook isn't set up yet." }, 503);
  // Only accept notes sent from this site's own pages.
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return json({ error: "Notes can only be sent from the site." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 2000) return json({ error: "That note is too long." }, 413);

  let body;
  try { body = await request.json(); } catch { return json({ error: "That didn't look like a note." }, 400); }
  // A hidden field that people never fill in; bots often do. Pretend it worked.
  if (body?.website) return json({ ok: true });

  const name = clean(body?.name, MAX_NAME);
  const message = clean(body?.message, MAX_MESSAGE);
  if (message.length < 2) return json({ error: "Write a short note first." }, 400);
  if (/https?:\/\/|www\.|<[a-z/]/i.test(`${name} ${message}`)) return json({ error: "Links and HTML aren't allowed in notes." }, 400);

  // One note a minute per visitor. The address is hashed, never stored as is.
  const visitor = await sha256(`${request.headers.get("cf-connecting-ip") || "unknown"}:guestbook`);
  if (await env.GUESTBOOK.get(`rate:${visitor}`)) return json({ error: "You just pinned a note. Try again in a minute." }, 429);
  const { keys } = await env.GUESTBOOK.list({ prefix: "pending:", limit: PENDING_LIMIT });
  if (keys.length >= PENDING_LIMIT) return json({ error: "The guestbook is full for now. Try again later." }, 503);

  const at = Date.now(), id = `${at}-${crypto.randomUUID().slice(0, 8)}`;
  await env.GUESTBOOK.put(`pending:${id}`, JSON.stringify({ id, name, message, at }), { expirationTtl: 60 * 60 * 24 * 30 });
  await env.GUESTBOOK.put(`rate:${visitor}`, "1", { expirationTtl: 60 });
  return json({ ok: true });
}
