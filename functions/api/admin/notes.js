// Private guestbook moderation, used by /guestbook-admin.html.
// Every request needs "Authorization: Bearer <ADMIN_TOKEN>", where ADMIN_TOKEN is a secret set on the Pages project.
// GET  -> { pending, approved }
// POST -> { id, action: "approve" | "reject" | "delete" }
import { json, listNotes, sameSecret } from "../../../lib/guestbook.js";

function authorised(request, env) {
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return Boolean(env.ADMIN_TOKEN) && token.length > 0 && sameSecret(token, env.ADMIN_TOKEN);
}

export async function onRequest({ request, env }) {
  if (!env.GUESTBOOK || !env.ADMIN_TOKEN) return json({ error: "The guestbook isn't set up yet." }, 503);
  if (!authorised(request, env)) return json({ error: "Wrong admin token." }, 401);

  if (request.method === "GET") {
    const [pending, approved] = await Promise.all([listNotes(env.GUESTBOOK, "pending:", 200), listNotes(env.GUESTBOOK, "approved:", 200)]);
    return json({ pending, approved });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request." }, 400); }
  const id = String(body?.id || "");
  if (!/^\d+-[0-9a-f]{8}$/.test(id)) return json({ error: "Unknown note." }, 400);

  if (body.action === "approve") {
    const note = await env.GUESTBOOK.get(`pending:${id}`, "json");
    if (!note) return json({ error: "That note is gone." }, 404);
    await env.GUESTBOOK.put(`approved:${id}`, JSON.stringify(note));
    await env.GUESTBOOK.delete(`pending:${id}`);
  } else if (body.action === "reject") {
    await env.GUESTBOOK.delete(`pending:${id}`);
  } else if (body.action === "delete") {
    await env.GUESTBOOK.delete(`approved:${id}`);
  } else {
    return json({ error: "Unknown action." }, 400);
  }
  return json({ ok: true });
}
