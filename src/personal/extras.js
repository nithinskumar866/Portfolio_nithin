// Extra pieces for the personal room: the fish tank on the bookshelf, the journals that open,
// the framed SaaS blueprint, the home cinema, the Torn Pages poster, the ringing phone and the guestbook. Each part has a small update for the render loop.
import * as THREE from "three";
import { PUBLICATIONS } from "./panels.js";

const smooth = (v) => { const k = Math.min(1, Math.max(0, v)); return k * k * (3 - 2 * k); };
const lerp = THREE.MathUtils.lerp;

function canvasTexture(w, h, draw) {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const paint = () => { const c = cv.getContext("2d"); c.clearRect(0, 0, w, h); draw(c, w, h); tex.needsUpdate = true; };
  paint(); document.fonts?.ready.then(paint);
  return tex;
}
function wrap(c, text, x, y, width, lineHeight, maxLines = 99) {
  const words = text.split(" "), lines = [];
  let line = "";
  for (const w of words) { if (c.measureText(line + w).width > width && line) { lines.push(line.trim()); line = ""; } line += w + " "; }
  lines.push(line.trim());
  lines.slice(0, maxLines).forEach((l, i) => c.fillText(l, x, y + i * lineHeight));
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

export function buildExtras({ world, box, cyl, ball, add, mat, G, HALF }) {
  const parts = [];

  // --- Fish tank on top of the bookshelf ---
  {
    const tank = new THREE.Group(); tank.position.set(-5.72, 3.505, 1.3); world.add(tank);
    const W = 0.42, H = 0.5, L = 1.1;
    box(W + 0.04, 0.04, L + 0.04, "#2a2e38", tank, 0, 0.02, 0, 0.01);
    box(W, 0.04, L, "#e8d3a2", tank, 0, 0.06, 0, 0.01);
    for (let i = 0; i < 14; i++) ball(0.018 + (i % 3) * 0.006, ["#c9b8a0", "#8d99ae", "#e07a5f", "#f6efe2"][i % 4], tank, (Math.sin(i * 7) * W) / 2.6, 0.085, (Math.cos(i * 3.1) * L) / 2.3);
    const rock = ball(0.07, "#6b7280", tank, 0.04, 0.1, -0.32); rock.scale.set(1.4, 0.8, 1);
    const plants = [];
    for (let i = 0; i < 7; i++) {
      const pivot = new THREE.Group(); pivot.position.set(-0.1 + (i % 3) * 0.08, 0.08, 0.2 + i * 0.045); tank.add(pivot);
      const h = 0.18 + (i % 3) * 0.08;
      box(0.018, h, 0.006, i % 2 ? "#2f9e6a" : "#4cc38a", pivot, 0, h / 2, 0, 0.003);
      plants.push({ pivot, phase: i * 1.3 });
    }
    const water = new THREE.Mesh(new THREE.BoxGeometry(W - 0.01, H - 0.1, L - 0.01), new THREE.MeshStandardMaterial({ color: "#47b6d6", transparent: true, opacity: 0.22, roughness: 0.1, depthWrite: false }));
    water.position.y = 0.04 + (H - 0.1) / 2; tank.add(water);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(W, H, L), new THREE.MeshStandardMaterial({ color: "#d8f3fb", transparent: true, opacity: 0.16, roughness: 0.05, depthWrite: false, side: THREE.DoubleSide }));
    glass.position.y = 0.04 + H / 2; tank.add(glass);
    box(W + 0.03, 0.03, L + 0.03, "#1d2230", tank, 0, 0.055 + H, 0, 0.01);
    add(new THREE.Mesh(new THREE.BoxGeometry(W - 0.08, 0.008, L - 0.1), new THREE.MeshBasicMaterial({ color: "#bff3ff", toneMapped: false })), tank, 0, 0.038 + H, 0, false);
    
    // Fish: a body, a tail that wags and an eye, swimming lazy loops.
    const fish = ["#ff8c42", "#f4d35e", "#4cc9f0", "#ff5d73", "#ffffff"].map((color, i) => {
      const f = new THREE.Group(); tank.add(f);
      const body = ball(0.03, mat(color, { roughness: 0.4 }), f, 0, 0, 0); body.scale.set(1.7, 1, 0.55);
      const tail = new THREE.Group(); tail.position.x = -0.05; f.add(tail);
      const fin = box(0.04, 0.045, 0.006, mat(color, { roughness: 0.4 }), tail, -0.018, 0, 0, 0.003); fin.rotation.z = 0.6;
      ball(0.006, "#111", f, 0.03, 0.008, 0.014);
      f.scale.setScalar(i === 4 ? 0.7 : 1);
      return { f, tail, speed: 0.35 + i * 0.07, phase: i * 1.7, y: 0.14 + (i % 3) * 0.09 };
    });
    const bubbles = Array.from({ length: 10 }, (_, i) => ({ m: ball(0.008, new THREE.MeshBasicMaterial({ color: "#e6fbff", transparent: true, opacity: 0.7 }), tank, 0.12, 0.1, -0.42), phase: i / 10 }));
    tank.traverse((o) => { o.raycast = () => {}; });
    const pos = new THREE.Vector3(), next = new THREE.Vector3();
    const at = (s, f, out) => out.set(Math.sin(s * 1.7 + f.phase) * 0.11, f.y + Math.sin(s * 0.9 + f.phase) * 0.05, Math.sin(s + f.phase) * 0.43);
    parts.push((t) => {
      for (const f of fish) {
        const s = t * f.speed;
        at(s, f, pos); at(s + 0.02, f, next);
        f.f.position.copy(pos);
        f.f.rotation.y = Math.atan2(-(next.z - pos.z), next.x - pos.x);
        f.tail.rotation.y = Math.sin(t * 12 + f.phase) * 0.5;
      }
      for (const b of bubbles) { const k = (t * 0.35 + b.phase) % 1; b.m.position.set(0.12 + Math.sin(k * 20 + b.phase * 9) * 0.01, 0.1 + k * (H - 0.16), -0.42); }
      for (const p of plants) p.pivot.rotation.x = Math.sin(t * 1.3 + p.phase) * 0.12;
    });
  }

  // --- Journals on the bookshelf's top shelf. Clicking one pulls it out and opens it ---
  const pubs = new THREE.Group(); pubs.userData.station = "publications"; pubs.position.x = -G; world.add(pubs);
  const journals = PUBLICATIONS.map((p, i) => {
    const w = 0.38, h = 0.72, t = 0.12;
    const j = new THREE.Group(); j.userData.index = i; pubs.add(j);
    const home = new THREE.Vector3(-3.56, 2.335, 1.12 + i * 0.15);
    j.position.copy(home);
    const cover = mat(p.cover, { roughness: 0.6 }), gold = mat("#e9c46a", { metalness: 0.5, roughness: 0.35 });
    box(w, h, 0.012, cover, j, 0, h / 2, t / 2 - 0.006, 0.004);
    box(w - 0.02, h - 0.025, t - 0.024, "#f3ead6", j, -0.005, h / 2, 0, 0.004);
    box(0.014, h, t, cover, j, w / 2, h / 2, 0, 0.004);
    for (const y of [0.07, h - 0.07]) box(0.016, 0.02, t + 0.002, gold, j, w / 2 + 0.001, y, 0, 0.003);
    const spine = canvasTexture(64, 384, (c) => {
      c.fillStyle = p.cover; c.fillRect(0, 0, 64, 384);
      c.save(); c.translate(40, 192); c.rotate(-Math.PI / 2); c.textAlign = "center";
      c.fillStyle = "#f4d35e"; c.font = "800 26px Syne, sans-serif"; c.fillText(p.short.toUpperCase(), 0, 0);
      c.restore();
      c.fillStyle = "#f6efe2"; c.font = "500 15px 'DM Mono', monospace"; c.textAlign = "center"; c.fillText(p.year, 32, 362);
      c.fillText(p.journalShort.slice(0, 6), 32, 30);
    });
    add(new THREE.Mesh(new THREE.PlaneGeometry(t, h), new THREE.MeshStandardMaterial({ map: spine, roughness: 0.6 })), j, w / 2 + 0.008, h / 2, 0, false).rotation.y = Math.PI / 2;
    // The front cover swings open on the spine. Its inside shows the journal; the first page shows the paper.
    const hinge = new THREE.Group(); hinge.position.set(w / 2, 0, -t / 2); j.add(hinge);
    box(w, h, 0.012, cover, hinge, -w / 2, h / 2, 0.006, 0.004);
    const inside = canvasTexture(380, 720, (c, W, H) => {
      c.fillStyle = "#f6efe2"; c.fillRect(0, 0, W, H);
      c.fillStyle = p.cover; c.fillRect(0, 0, W, 210);
      c.fillStyle = "#f4d35e"; c.font = "800 64px Syne, sans-serif"; c.textAlign = "center"; c.fillText(p.journalShort, W / 2, 120);
      c.fillStyle = "#f6efe2"; c.font = "500 22px 'DM Mono', monospace"; c.fillText(p.date.toUpperCase(), W / 2, 170);
      c.fillStyle = "#1d2230"; c.font = "600 22px 'DM Sans', sans-serif"; wrap(c, p.journal, W / 2, 280, W - 60, 30);
      c.fillStyle = "#6b7280"; c.font = "18px 'DM Mono', monospace"; wrap(c, p.detail, W / 2, 470, W - 60, 26);
      c.fillStyle = p.cover; c.beginPath(); c.arc(W / 2, 620, 46, 0, 7); c.fill();
      c.fillStyle = "#f4d35e"; c.font = "800 34px Syne, sans-serif"; c.fillText(String(i + 1), W / 2, 632);
    });
    const insidePage = add(new THREE.Mesh(new THREE.PlaneGeometry(w - 0.02, h - 0.03), new THREE.MeshBasicMaterial({ map: inside })), hinge, -w / 2, h / 2, 0.0135, false);
    insidePage.visible = false;
    const first = canvasTexture(380, 720, (c, W, H) => {
      c.fillStyle = "#fbf6ea"; c.fillRect(0, 0, W, H);
      c.fillStyle = p.cover; c.fillRect(30, 40, 70, 6);
      c.fillStyle = "#6b7280"; c.font = "500 18px 'DM Mono', monospace"; c.fillText("RESEARCH PAPER", 30, 80);
      c.fillStyle = "#1d2230";
      // Shrink the title until its longest word fits the page.
      let size = 32; const longest = p.title.split(" ").sort((x, y) => y.length - x.length)[0];
      do { c.font = `800 ${size}px Syne, sans-serif`; size -= 1; } while (c.measureText(longest).width > W - 60 && size > 16);
      const after = wrap(c, p.title, 30, 135, W - 60, size * 1.25, 8);
      c.fillStyle = p.cover; c.font = "600 19px 'DM Sans', sans-serif";
      const by = p.authors ? wrap(c, p.authors, 30, after + 22, W - 60, 26, 4) : after;
      c.fillStyle = "#4b5263"; c.font = "17px 'DM Sans', sans-serif";
      wrap(c, p.summary, 30, by + 30, W - 60, 24, 9);
      c.fillStyle = "#9aa1ad"; c.font = "500 15px 'DM Mono', monospace"; c.fillText("More in the card →", 30, H - 34);
    });
    const firstPage = add(new THREE.Mesh(new THREE.PlaneGeometry(w - 0.03, h - 0.04), new THREE.MeshBasicMaterial({ map: first })), j, -0.005, h / 2, -t / 2 + 0.011, false);
    firstPage.rotation.y = Math.PI; firstPage.visible = false;
    return { j, hinge, home, insidePage, firstPage, o: 0 };
  });
  // Where an opened journal floats, in front of the shelf, in the shelf's own coordinates.
  const READ_AT = new THREE.Vector3(-2.8, 2.05, 1.3);

  // --- The SaaS goal: a framed blueprint of an unnamed product above the desk, under a brass picture light ---
  const future = new THREE.Group(); future.userData.station = "future"; world.add(future);
  const BP_W = 1024, BP_H = 600;
  const bpCanvas = document.createElement("canvas"); bpCanvas.width = BP_W; bpCanvas.height = BP_H;
  const bpTex = new THREE.CanvasTexture(bpCanvas); bpTex.colorSpace = THREE.SRGBColorSpace; bpTex.anisotropy = 4;
  // Draws the blueprint. k from 0 to 1 reveals the line work, so it can draw itself in when you arrive.
  const drawBlueprint = (k) => {
    const c = bpCanvas.getContext("2d"), W = BP_W, H = BP_H;
    const paper = c.createRadialGradient(W * 0.45, H * 0.4, 60, W / 2, H / 2, W * 0.75); paper.addColorStop(0, "#1f4f8a"); paper.addColorStop(1, "#163a68");
    c.fillStyle = paper; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(220,235,255,0.08)"; c.lineWidth = 1;
    for (let x = 0; x <= W; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = 0; y <= H; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.strokeStyle = "rgba(230,242,255,0.5)"; c.lineWidth = 2; c.strokeRect(24, 24, W - 48, H - 48);
    const ink = (a = 1) => { c.strokeStyle = `rgba(236,245,255,${0.9 * a})`; c.fillStyle = `rgba(236,245,255,${0.9 * a})`; };
    const step = (from, to) => Math.min(1, Math.max(0, (k - from) / (to - from)));
    c.lineCap = "round"; c.lineJoin = "round";
    // The app window.
    let p = step(0, 0.35);
    ink(p); c.lineWidth = 3; c.strokeRect(70, 70, 470 * Math.max(p, 0.001), 330);
    if (p > 0.6) { c.beginPath(); c.moveTo(70, 108); c.lineTo(540, 108); c.stroke(); for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(92 + i * 20, 89, 6, 0, 7); c.stroke(); } }
    // Sidebar, cards and a chart inside it.
    p = step(0.25, 0.6);
    if (p > 0) {
      ink(p); c.lineWidth = 2;
      c.strokeRect(86, 124, 90, 260);
      for (let i = 0; i < 5; i++) c.fillRect(100, 146 + i * 30, 60 * p, 6);
      for (let i = 0; i < 3; i++) c.strokeRect(194 + i * 116, 124, 104, 74);
      c.beginPath(); c.moveTo(196, 360);
      for (let i = 0; i <= 12 * p; i++) c.lineTo(196 + i * 27, 360 - Math.sin(i * 0.7) * 28 - i * 9);
      c.stroke();
      c.setLineDash([6, 7]); c.strokeRect(194, 214, 330, 160); c.setLineDash([]);
    }
    // The flow: users, an AI core, and growth.
    p = step(0.5, 0.85);
    if (p > 0) {
      ink(p); c.lineWidth = 2.5;
      c.beginPath(); c.arc(770, 130, 48, 0, Math.PI * 2 * p); c.stroke();
      c.font = "600 16px 'DM Mono', monospace"; c.textAlign = "center"; c.fillText("AI CORE", 770, 136);
      for (const [x, y] of [[640, 260], [770, 300], [900, 260]]) { c.beginPath(); c.arc(x, y, 22, 0, Math.PI * 2 * p); c.stroke(); c.beginPath(); c.moveTo(770, 178); c.lineTo(lerp(770, x, p), lerp(178, y - 22, p)); c.stroke(); }
      c.setLineDash([8, 8]); c.beginPath(); c.moveTo(548, 230); c.lineTo(lerp(548, 610, p), 245); c.stroke(); c.setLineDash([]);
      c.font = "18px 'DM Mono', monospace"; c.fillText("USERS", 770, 352);
    }
    // Handwritten notes.
    p = step(0.7, 1);
    if (p > 0) {
      ink(p); c.font = "italic 500 24px 'DM Sans', sans-serif"; c.textAlign = "left";
      c.fillText("v1: simple, fast, magical", 76, 440);
      c.fillText("\u2192 scale it", 640, 420);
      c.beginPath(); c.moveTo(560, 470); c.quadraticCurveTo(620, 430, 640, 400); c.stroke();
    }
    // Title block, like an architect's drawing.
    ink(1); c.lineWidth = 2; c.strokeRect(W - 384, H - 154, 360, 130);
    c.beginPath(); c.moveTo(W - 384, H - 110); c.lineTo(W - 24, H - 110); c.moveTo(W - 384, H - 67); c.lineTo(W - 24, H - 67); c.stroke();
    c.textAlign = "left"; c.font = "600 19px 'DM Mono', monospace";
    c.fillText("PROJECT  \u2588\u2588\u2588\u2588\u2588\u2588 (STEALTH)", W - 370, H - 125);
    c.fillText("DRAWN  AFTER MIDNIGHT", W - 370, H - 82);
    c.fillText("STATUS  IN DESIGN \u00B7 V0.1", W - 370, H - 39);
    bpTex.needsUpdate = true;
  };
  drawBlueprint(1); document.fonts?.ready.then(() => drawBlueprint(1));
  const frameZ = 0.3 - HALF;
  const walnut = mat("#4a3122", { roughness: 0.5 }), brass = mat("#c9a04a", { metalness: 0.7, roughness: 0.3 });
  box(2.02, 1.3, 0.06, walnut, future, 1.05, 3.5, frameZ + 0.03, 0.015);
  box(1.9, 1.18, 0.02, "#efe6d4", future, 1.05, 3.5, frameZ + 0.065, 0.004);
  add(new THREE.Mesh(new THREE.PlaneGeometry(1.66, 0.975), new THREE.MeshBasicMaterial({ map: bpTex })), future, 1.05, 3.5, frameZ + 0.077, false);
  // Picture light: a brass bar on a short arm, washing the frame in warm light.
  box(0.05, 0.05, 0.16, brass, future, 1.05, 4.23, frameZ + 0.08, 0.01);
  const shade = cyl(0.045, 0.045, 0.7, brass, future, 1.05, 4.24, frameZ + 0.19, 18); shade.rotation.z = Math.PI / 2;
  add(new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.012, 0.03), new THREE.MeshBasicMaterial({ color: "#ffe3b0", toneMapped: false })), future, 1.05, 4.21, frameZ + 0.2, false);
  const washTex = canvasTexture(256, 256, (c) => { const g = c.createRadialGradient(128, 0, 10, 128, 40, 240); g.addColorStop(0, "rgba(255,220,160,0.3)"); g.addColorStop(1, "rgba(255,220,160,0)"); c.fillStyle = g; c.fillRect(0, 0, 256, 256); });
  const wash = add(new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshBasicMaterial({ map: washTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })), future, 1.05, 3.5, frameZ + 0.085, false);
  wash.raycast = () => {};
  
  // Brass plaque under the frame.
  const plaqueTex = canvasTexture(512, 96, (c, W, H) => { const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#e2c06a"); g.addColorStop(1, "#b08834"); c.fillStyle = g; c.fillRect(0, 0, W, H); c.strokeStyle = "#7a5c1e"; c.lineWidth = 3; c.strokeRect(6, 6, W - 12, H - 12); c.fillStyle = "#3d2c0c"; c.textAlign = "center"; c.font = "600 30px 'DM Sans', sans-serif"; c.fillText("Something big is being built.", W / 2, 60); });
  add(new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.12), new THREE.MeshStandardMaterial({ map: plaqueTex, metalness: 0.5, roughness: 0.35 })), future, 1.05, 2.72, frameZ + 0.012, false);
  let drawIn = 1, wasFuture = false;

  // --- A phone ringing on the floor by his hand. He sleeps right through it. Click it to answer ---
  const phone = new THREE.Group(); phone.userData.station = "phone";
  const phoneBody = new THREE.Group(); phone.add(phoneBody);
  box(0.078, 0.009, 0.158, "#16181f", phoneBody, 0, 0.0045, 0, 0.004);
  const PH_W = 156, PH_H = 320;
  const phCanvas = document.createElement("canvas"); phCanvas.width = PH_W; phCanvas.height = PH_H;
  const phTex = new THREE.CanvasTexture(phCanvas); phTex.colorSpace = THREE.SRGBColorSpace;
  let phoneState = "";
  const drawPhone = (answered, seconds) => {
    const key = answered ? "a" + seconds : "r";
    if (key === phoneState) return;
    phoneState = key;
    const c = phCanvas.getContext("2d"), W = PH_W, H = PH_H;
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, answered ? "#12322a" : "#1c2340"); g.addColorStop(1, "#0b0e18"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.textAlign = "center"; c.fillStyle = "#a9b1c4"; c.font = "500 13px 'DM Sans', sans-serif"; c.fillText(answered ? "On call" : "incoming call\u2026", W / 2, 46);
    c.fillStyle = "#2b3345"; c.beginPath(); c.arc(W / 2, 108, 34, 0, 7); c.fill();
    c.fillStyle = "#f6efe2"; c.font = "800 36px Syne, sans-serif"; c.fillText("?", W / 2, 121);
    c.font = "700 21px Syne, sans-serif"; c.fillText("Unknown", W / 2, 178);
    if (answered) { c.fillStyle = "#7cf2c8"; c.font = "500 15px 'DM Mono', monospace"; c.fillText("00:" + String(seconds).padStart(2, "0"), W / 2, 204); }
    if (!answered) { c.fillStyle = "#2fbf71"; c.beginPath(); c.arc(W * 0.72, 268, 19, 0, 7); c.fill(); }
    c.fillStyle = "#e2574c"; c.beginPath(); c.arc(answered ? W / 2 : W * 0.28, 268, 19, 0, 7); c.fill();
    phTex.needsUpdate = true;
  };
  drawPhone(false, 0); document.fonts?.ready.then(() => { phoneState = ""; drawPhone(false, 0); });
  const phScreenMat = new THREE.MeshBasicMaterial({ map: phTex, toneMapped: false });
  const phScreen = add(new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.146), phScreenMat), phoneBody, 0, 0.0095, 0, false); phScreen.rotation.x = -Math.PI / 2;
  // Rings of "buzz" spreading across the floor while it rings.
  const ringMats = [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: "#9fd8ff", transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  const rings = ringMats.map((m) => { const r = add(new THREE.Mesh(new THREE.RingGeometry(0.1, 0.112, 40), m), phone, 0, 0.004, 0, false); r.rotation.x = -Math.PI / 2; return r; });
  
  // A larger invisible box so the phone is easy to click.
  add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.34), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false })), phone, 0, 0.05, 0, false);
  let answeredAt = 0, wasPhone = false;

  // --- Guestbook corkboard on the back wall, right of the server rack. Approved notes are pinned on it ---
  const guest = new THREE.Group(); guest.userData.station = "guestbook"; world.add(guest);
  const GB_X = 5.05, GB_Y = 2.45, GB_Z = 0.3 - HALF;
  box(2.12, 1.52, 0.06, "#6b4a33", guest, GB_X, GB_Y, GB_Z + 0.03, 0.02);
  const GB_W = 1024, GB_H = 704;
  const gbCanvas = document.createElement("canvas"); gbCanvas.width = GB_W; gbCanvas.height = GB_H;
  const gbTex = new THREE.CanvasTexture(gbCanvas); gbTex.colorSpace = THREE.SRGBColorSpace; gbTex.anisotropy = 4;
  let guestNotes = [];
  const NOTE_COLOURS = ["#f4d35e", "#f6efe2", "#9fd8cb", "#ee9b7f", "#c8b6e2", "#b8e0a8"];
  const drawGuestbook = () => {
    const c = gbCanvas.getContext("2d"), W = GB_W, H = GB_H;
    c.fillStyle = "#b98a5a"; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) { c.fillStyle = i % 2 ? "rgba(90,55,25,0.18)" : "rgba(255,230,190,0.12)"; c.fillRect((i * 389) % W, (i * 241) % H, 3, 3); }
    // Header card.
    c.save(); c.translate(W / 2, 74); c.rotate(-0.015);
    c.fillStyle = "#1d2230"; c.fillRect(-230, -42, 460, 84);
    c.fillStyle = "#f6efe2"; c.textAlign = "center"; c.font = "800 40px Syne, sans-serif"; c.fillText("GUESTBOOK", 0, 6);
    c.fillStyle = "#ffb35c"; c.font = "500 18px 'DM Mono', monospace"; c.fillText("PIN A NOTE \u00B7 SAY HI", 0, 32);
    c.restore();
    c.fillStyle = "#d9583f"; c.beginPath(); c.arc(W / 2, 34, 9, 0, 7); c.fill();
    const notes = guestNotes.length ? guestNotes.slice(0, 8) : [{ name: "", message: "Be the first to pin a note here." }];
    notes.forEach((n, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const x = 70 + col * 230 + (row % 2) * 18, y = 160 + row * 262, w = 200, h = 220;
      c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(((i * 37) % 9 - 4) * 0.012);
      c.fillStyle = "rgba(0,0,0,0.18)"; c.fillRect(-w / 2 + 5, -h / 2 + 7, w, h);
      c.fillStyle = NOTE_COLOURS[i % NOTE_COLOURS.length]; c.fillRect(-w / 2, -h / 2, w, h);
      c.fillStyle = "#1d2230"; c.textAlign = "left"; c.font = "italic 500 21px 'DM Sans', sans-serif";
      wrap(c, n.message, -w / 2 + 16, -h / 2 + 44, w - 32, 27, 5);
      if (n.name) { c.font = "600 17px 'DM Mono', monospace"; c.fillText("\u2014 " + n.name.slice(0, 18), -w / 2 + 16, h / 2 - 20); }
      c.fillStyle = ["#d9583f", "#3d5a80", "#2a9d8f"][i % 3]; c.beginPath(); c.arc(0, -h / 2 + 10, 9, 0, 7); c.fill();
      c.restore();
    });
    gbTex.needsUpdate = true;
  };
  drawGuestbook(); document.fonts?.ready.then(drawGuestbook);
  add(new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.375), new THREE.MeshStandardMaterial({ map: gbTex, roughness: 0.9 })), guest, GB_X, GB_Y, GB_Z + 0.062, false);
  

  // --- Mini home cinema in the back corner: a projector on a side table, a screen, an armchair and popcorn ---
  const films = new THREE.Group(); films.userData.station = "films"; world.add(films);
  const walnutF = mat("#5a3a26", { roughness: 0.55 }), metal = mat("#2a2e38", { roughness: 0.4, metalness: 0.5 }), brassF = mat("#c9a04a", { metalness: 0.7, roughness: 0.3 });
  // A round rug to hold the corner together.
  cyl(1.25, 1.25, 0.02, "#c9a77c", films, -3.75, 0.035, -4.0, 48).castShadow = false;
  cyl(1.05, 1.05, 0.022, "#a9694a", films, -3.75, 0.037, -4.0, 48).castShadow = false;
  // The screen on a slim stand, facing into the room.
  const SCREEN_W = 1.5, SCREEN_H = 0.84;
  const screenAt = new THREE.Vector3(-3.7, 1.38, -5.55);
  for (const x of [-0.8, 0.8]) { cyl(0.014, 0.014, 1.86, metal, films, screenAt.x + x, 0.93, screenAt.z, 8); box(0.32, 0.02, 0.05, metal, films, screenAt.x + x, 0.01, screenAt.z, 0.01).rotation.y = Math.PI / 2; }
  cyl(0.03, 0.03, 1.68, "#1d2028", films, screenAt.x, screenAt.y + SCREEN_H / 2 + 0.04, screenAt.z, 12).rotation.z = Math.PI / 2;
  box(SCREEN_W + 0.08, SCREEN_H + 0.08, 0.02, "#111318", films, screenAt.x, screenAt.y, screenAt.z - 0.005, 0.004);
  const FILM_W = 512, FILM_H = 288;
  const filmCanvas = document.createElement("canvas"); filmCanvas.width = FILM_W; filmCanvas.height = FILM_H;
  const filmTex = new THREE.CanvasTexture(filmCanvas); filmTex.colorSpace = THREE.SRGBColorSpace; filmTex.generateMipmaps = false; filmTex.minFilter = THREE.LinearFilter;
  const screenMat = new THREE.MeshBasicMaterial({ map: filmTex, toneMapped: false });
  add(new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), screenMat), films, screenAt.x, screenAt.y, screenAt.z + 0.008, false);
  // The film: a countdown leader, then a short silhouette story, then a title card. About 13 seconds, on loop.
  const FILM_LOOP = 13;
  const drawFilm = (T) => {
    const c = filmCanvas.getContext("2d"), W = FILM_W, H = FILM_H;
    if (T < 2.4) {
      // Countdown leader: 3, 2, 1 with the sweeping hand.
      const n = 3 - Math.floor(T / 0.8), k = (T % 0.8) / 0.8;
      c.fillStyle = "#cfc2a6"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#a99c80"; c.beginPath(); c.moveTo(W / 2, H / 2); c.arc(W / 2, H / 2, 260, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); c.fill();
      c.strokeStyle = "#2a2520"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.moveTo(W / 2, 0); c.lineTo(W / 2, H); c.stroke();
      for (const r of [96, 118]) { c.beginPath(); c.arc(W / 2, H / 2, r, 0, 7); c.stroke(); }
      c.fillStyle = "#2a2520"; c.font = "800 130px Syne, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(String(n), W / 2, H / 2 + 6); c.textBaseline = "alphabetic";
    } else if (T < 9.6) {
      // A boy on a hill under the moon, writing; his pages fold into paper planes that fly off and become stars.
      const s = T - 2.4;
      const sky = c.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#1b2a4a"); sky.addColorStop(0.7, "#5a4a6e"); sky.addColorStop(1, "#d99a6c"); c.fillStyle = sky; c.fillRect(0, 0, W, H);
      c.fillStyle = "#fff4d6"; c.beginPath(); c.arc(380, 74, 30, 0, 7); c.fill();
      c.fillStyle = "rgba(255,244,214,0.18)"; c.beginPath(); c.arc(380, 74, 46, 0, 7); c.fill();
      const stars = Math.floor(s * 1.6);
      for (let i = 0; i < Math.min(stars, 11); i++) { const x = 40 + ((i * 131) % 300), y = 30 + ((i * 57) % 110); c.fillStyle = `rgba(255,250,230,${0.5 + 0.5 * Math.sin(T * 3 + i)})`; c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); }
      c.fillStyle = "#14101c"; c.beginPath(); c.moveTo(0, H); c.lineTo(0, 238); c.quadraticCurveTo(170, 175, 330, 222); c.quadraticCurveTo(430, 250, W, 230); c.lineTo(W, H); c.fill();
      // The boy, sitting, knees up, notebook on his lap.
      c.beginPath(); c.arc(168, 166, 11, 0, 7); c.fill();
      c.beginPath(); c.moveTo(160, 176); c.lineTo(178, 176); c.lineTo(186, 206); c.lineTo(150, 206); c.fill();
      c.beginPath(); c.moveTo(186, 206); c.lineTo(214, 186); c.lineTo(220, 206); c.fill();
      c.fillStyle = "#e9dcc0"; c.fillRect(184, 186, 22, 4);
      // Paper planes.
      for (let i = 0; i < 4; i++) {
        const k = s * 0.32 - i * 0.28;
        if (k <= 0 || k >= 1) continue;
        const x = lerp(200, 70 + i * 90, k) + Math.sin(k * 9 + i) * 14, y = lerp(184, 40 + (i % 2) * 34, k) - Math.sin(k * Math.PI) * 40;
        c.save(); c.translate(x, y); c.rotate(-0.4 + Math.sin(k * 8) * 0.2); c.globalAlpha = 1 - Math.max(0, (k - 0.8) / 0.2);
        c.fillStyle = "#f6efe2"; c.beginPath(); c.moveTo(12, 0); c.lineTo(-10, -6); c.lineTo(-4, 0); c.lineTo(-10, 6); c.closePath(); c.fill(); c.restore();
      }
    } else {
      // Title card.
      const k = Math.min(1, (T - 9.6) / 0.8);
      c.fillStyle = "#0f0d12"; c.fillRect(0, 0, W, H);
      c.globalAlpha = k; c.textAlign = "center";
      c.fillStyle = "#f3e6c4"; c.font = "500 17px 'DM Mono', monospace"; c.fillText("AN ORIGINAL STORY", W / 2, 106);
      c.font = "800 44px Syne, sans-serif"; c.fillText("Coming soon", W / 2, 160);
      c.fillStyle = "#b8a989"; c.font = "italic 18px 'DM Sans', sans-serif"; c.fillText("Every story starts with someone who wouldn\u2019t stop dreaming.", W / 2, 202);
      c.globalAlpha = 1;
    }
    // Old film: grain, scratches and a soft vignette.
    for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`; c.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5); }
    if (Math.random() < 0.3) { c.fillStyle = "rgba(255,255,255,0.12)"; c.fillRect(Math.random() * W, 0, 1, H); }
    const v = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.62); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.55)"); c.fillStyle = v; c.fillRect(0, 0, W, H);
    filmTex.needsUpdate = true;
  };
  drawFilm(10.5);
  // The projector, on a slim walnut side table, pointed at the screen.
  const table = new THREE.Group(); table.position.set(-3.05, 0, -3.05); films.add(table);
  cyl(0.24, 0.24, 0.03, walnutF, table, 0, 0.72, 0, 32);
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const leg = cyl(0.014, 0.01, 0.74, walnutF, table, Math.cos(a) * 0.13, 0.36, Math.sin(a) * 0.13, 8); leg.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12); }
  const projector = new THREE.Group(); projector.position.set(0, 0.735, 0); table.add(projector);
  projector.rotation.y = Math.atan2(screenAt.x - table.position.x, screenAt.z - table.position.z);
  box(0.24, 0.17, 0.32, "#2b2f38", projector, 0, 0.1, 0, 0.035);
  box(0.25, 0.02, 0.33, brassF, projector, 0, 0.02, 0, 0.006);
  const barrel = cyl(0.045, 0.055, 0.12, brassF, projector, 0, 0.11, 0.21, 20); barrel.rotation.x = Math.PI / 2;
  add(new THREE.Mesh(new THREE.CircleGeometry(0.04, 20), new THREE.MeshBasicMaterial({ color: "#fff3d6", toneMapped: false })), projector, 0, 0.11, 0.272, false);
  const projReels = [-0.1, 0.11].map((z) => {
    const arm = box(0.012, 0.16, 0.012, metal, projector, 0, 0.26, z * 0.7, 0.004); arm.rotation.x = z > 0 ? -0.3 : 0.3;
    const holder = new THREE.Group(); holder.position.set(0, 0.34, z); holder.rotation.z = Math.PI / 2; projector.add(holder);
    const reel = cyl(0.1, 0.1, 0.022, "#3a3f4b", holder, 0, 0, 0, 28);
    for (let k = 0; k < 5; k++) { const spoke = box(0.012, 0.026, 0.085, "#22252d", reel, 0, 0, 0, 0.004); spoke.rotation.y = (k * Math.PI) / 5; }
    return reel;
  });
  // The beam: a soft cone of light from the lens to the screen, with dust drifting through it.
  const lensWorld = new THREE.Vector3(); projector.updateMatrixWorld(true); projector.localToWorld(lensWorld.set(0, 0.11, 0.28));
  const beamDir = new THREE.Vector3().subVectors(screenAt, lensWorld), beamLen = beamDir.length();
  const beamCanvasTex = canvasTexture(64, 256, (c) => { const g = c.createLinearGradient(0, 256, 0, 0); g.addColorStop(0, "rgba(255,236,190,0.9)"); g.addColorStop(1, "rgba(255,236,190,0.15)"); c.fillStyle = g; c.fillRect(0, 0, 64, 256); });
  const beamMatF = new THREE.MeshBasicMaterial({ map: beamCanvasTex, color: "#ffe9be", transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const beamGeo = new THREE.CylinderGeometry(0.62, 0.035, beamLen, 4, 1, true); beamGeo.rotateY(Math.PI / 4); beamGeo.scale(1.25, 1, 0.7);
  const beamF = new THREE.Mesh(beamGeo, beamMatF); beamF.raycast = () => {};
  beamF.position.copy(lensWorld).addScaledVector(beamDir, 0.5); beamF.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamDir.clone().normalize());
  world.add(beamF);
  const moteCount = 40, motePos = new Float32Array(moteCount * 3);
  const moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: "#fff1cf", size: 0.02, transparent: true, opacity: 0.8, depthWrite: false })); motes.raycast = () => {};
  world.add(motes);
  
  // A cosy armchair turned towards the screen, with a throw and a bucket of popcorn.
  const arm = new THREE.Group(); arm.position.set(-4.75, 0, -3.55); arm.rotation.y = Math.atan2(screenAt.x + 4.75, screenAt.z + 3.55); films.add(arm);
  const fabric = mat("#c2763f", { roughness: 0.95 }), fabricDark = mat("#a5612f", { roughness: 0.95 });
  for (const [x, z] of [[-0.3, -0.26], [0.3, -0.26], [-0.3, 0.26], [0.3, 0.26]]) { const leg = cyl(0.022, 0.014, 0.2, walnutF, arm, x, 0.1, z, 8); leg.rotation.set(z * 0.5, 0, -x * 0.5); }
  box(0.78, 0.16, 0.66, fabricDark, arm, 0, 0.27, 0, 0.06);
  box(0.6, 0.1, 0.56, fabric, arm, 0, 0.4, 0.04, 0.05);
  box(0.74, 0.5, 0.14, fabric, arm, 0, 0.62, -0.27, 0.07).rotation.x = -0.12;
  for (const x of [-0.35, 0.35]) box(0.1, 0.26, 0.6, fabricDark, arm, x, 0.46, 0.02, 0.05);
  const throwTex = canvasTexture(128, 128, (c) => { c.fillStyle = "#efe4cf"; c.fillRect(0, 0, 128, 128); c.fillStyle = "#d9c7a6"; for (let y = 0; y < 128; y += 16) c.fillRect(0, y, 128, 6); c.fillStyle = "#b5583a"; c.fillRect(0, 112, 128, 8); });
  const throwMat = new THREE.MeshStandardMaterial({ map: throwTex, roughness: 1 });
  const throw1 = add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.56), throwMat), arm, 0.36, 0.6, 0.02); throw1.rotation.z = 0.1;
  const throw2 = add(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.36, 0.56), throwMat), arm, 0.43, 0.42, 0.02); throw2.rotation.z = 0.08;
  const pop = new THREE.Group(); pop.position.set(-4.1, 0, -3.15); films.add(pop);
  const stripeTex = canvasTexture(128, 64, (c) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#f6efe2" : "#d9583f"; c.fillRect(i * 16, 0, 16, 64); } });
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.075, 0.22, 20, 1, true), new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.7, side: THREE.DoubleSide })), pop, 0, 0.11, 0);
  for (let i = 0; i < 16; i++) ball(0.022 + (i % 3) * 0.004, "#f8e7b0", pop, Math.cos(i * 2.4) * 0.06 * (i % 4) / 3, 0.22 + (i % 3) * 0.025, Math.sin(i * 2.4) * 0.06 * (i % 4) / 3);
  let filmFrame = 0;

  // --- "Torn Pages": a sad film poster on the left wall, between the bookshelf and the TV, under a broken neon heart ---
  const heart = new THREE.Group(); heart.userData.station = "heartbreak"; heart.position.set(0.3 - HALF + 0.005, 0, 3.2); heart.rotation.y = Math.PI / 2; world.add(heart);
  const posterTex = canvasTexture(520, 700, (c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1a0d16"); g.addColorStop(0.6, "#3a1424"); g.addColorStop(1, "#0d0a12"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    // Rain.
    c.strokeStyle = "rgba(200,210,255,0.16)"; c.lineWidth = 1.5; for (let i = 0; i < 90; i++) { const x = (i * 97) % W, y = (i * 53) % H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y + 26); c.stroke(); }
    // A street lamp and a lone figure in its light.
    c.fillStyle = "rgba(255,214,150,0.28)"; c.beginPath(); c.moveTo(318, 205); c.lineTo(190, 520); c.lineTo(470, 520); c.closePath(); c.fill();
    c.fillStyle = "#0b0810"; c.fillRect(326, 180, 8, 340); c.fillRect(300, 176, 46, 10);
    c.fillStyle = "#ffd696"; c.beginPath(); c.arc(318, 198, 12, 0, 7); c.fill();
    c.fillStyle = "#0b0810"; c.beginPath(); c.arc(250, 395, 15, 0, 7); c.fill(); c.fillRect(238, 410, 24, 70); c.fillRect(240, 478, 8, 42); c.fillRect(252, 478, 8, 42);
    c.fillStyle = "#06040a"; c.fillRect(0, 520, W, H - 520);
    c.textAlign = "center";
    c.fillStyle = "#ff6b8b"; c.font = "800 64px Syne, sans-serif"; c.fillText("TORN", W / 2, 76); c.fillText("PAGES", W / 2, 140);
    c.fillStyle = "#f6dfe6"; c.font = "italic 500 23px 'DM Sans', sans-serif";
    wrap(c, "“You handed me the script to a perfect life, then tore up the pages.”", W / 2, 566, W - 70, 31);
    c.fillStyle = "#a88a96"; c.font = "500 15px 'DM Mono', monospace"; c.fillText("BASED ON A TRUE STORY", W / 2, 676);
  });
  box(0.86, 1.12, 0.04, "#14111a", heart, 0, 2.75, 0.02, 0.01);
  add(new THREE.Mesh(new THREE.PlaneGeometry(0.78, 1.05), new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.6 })), heart, 0, 2.75, 0.042, false);
  const halfHeart = (side) => canvasTexture(128, 220, (c) => {
    c.shadowColor = "#ff4f7b"; c.shadowBlur = 18; c.strokeStyle = "#ff6b8b"; c.lineWidth = 9; c.lineJoin = "round";
    c.beginPath();
    if (side < 0) { c.moveTo(118, 50); c.bezierCurveTo(90, 5, 15, 15, 20, 80); c.bezierCurveTo(25, 130, 90, 170, 118, 205); c.lineTo(100, 150); c.lineTo(122, 110); c.lineTo(100, 75); c.closePath(); }
    else { c.moveTo(10, 50); c.bezierCurveTo(38, 5, 113, 15, 108, 80); c.bezierCurveTo(103, 130, 38, 170, 10, 205); c.lineTo(28, 150); c.lineTo(6, 110); c.lineTo(28, 75); c.closePath(); }
    c.stroke();
  });
  const neon = [-1, 1].map((side) => {
    const m = new THREE.MeshBasicMaterial({ map: halfHeart(side), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending });
    add(new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.34), m), heart, side * (0.11 + (side > 0 ? 0.03 : 0)), 3.72, 0.03, false).rotation.z = side > 0 ? -0.12 : 0;
    return m;
  });
  

  return {
    journals, posters: null,
    placePhone(parent, x, z) { phone.position.set(x, 0.074, z); phone.rotation.y = 0.5; parent.add(phone); return phone; },
    setGuestNotes(notes) { guestNotes = notes; drawGuestbook(); },
    update(t, dt, { current, journalIndex, reduce }) {
      if (!reduce) parts.forEach((p) => p(t));
      // Journals: slide out, float to the reading spot, grow and open.
      journals.forEach((b, i) => {
        const want = current === "publications" && journalIndex === i ? 1 : 0;
        b.o = reduce ? want : b.o + Math.sign(want - b.o) * Math.min(Math.abs(want - b.o), dt * 1.3);
        const pull = smooth(b.o / 0.3), fly = smooth((b.o - 0.25) / 0.45), open = smooth((b.o - 0.65) / 0.35);
        b.j.position.set(lerp(b.home.x + pull * 0.42, READ_AT.x, fly), lerp(b.home.y, READ_AT.y, fly), lerp(b.home.z, READ_AT.z, fly));
        b.j.rotation.y = fly * -Math.PI / 2;
        b.j.scale.setScalar(1 + fly * 1.1);
        b.hinge.rotation.y = -open * Math.PI * 0.96;
        b.insidePage.visible = b.firstPage.visible = open > 0.02;
      });
      // Blueprint: redraws itself, line by line, each time you open it.
      const atFuture = current === "future";
      if (atFuture && !wasFuture) drawIn = reduce ? 1 : 0;
      wasFuture = atFuture;
      if (drawIn < 1) { drawIn = Math.min(1, drawIn + dt * 0.45); drawBlueprint(drawIn); }
      // Home cinema: the film plays and the reels turn; brighter while you're watching.
      const watching = current === "films";
      if (!reduce) {
        if ((filmFrame = (filmFrame + 1) % 3) === 0) drawFilm(t % FILM_LOOP);
        projReels.forEach((r, i) => { r.rotation.y += dt * (watching ? 3 : 1.2) * (i ? -1 : 1); });
        const mp = moteGeo.attributes.position;
        for (let i = 0; i < moteCount; i++) {
          const k = (i * 0.618 + t * 0.03) % 1, spread = k * 0.5;
          mp.setXYZ(i, lensWorld.x + beamDir.x * k + Math.sin(i * 7.1 + t * 0.4) * spread * 0.5, lensWorld.y + beamDir.y * k + Math.cos(i * 3.3 + t * 0.3) * spread * 0.3, lensWorld.z + beamDir.z * k + Math.sin(i * 5.7) * spread * 0.3);
        }
        mp.needsUpdate = true;
      }
      const flickerF = reduce ? 1 : 0.92 + Math.sin(t * 24) * 0.04 + Math.sin(t * 7.3) * 0.03;
      beamMatF.opacity = (watching ? 0.16 : 0.1) * flickerF; screenMat.color.setScalar(flickerF);
      // The broken heart's right half stutters, like a failing neon tube.
      const stutter = reduce ? 1 : Math.sin(t * 13) > 0.85 || Math.sin(t * 2.3 + 1) > 0.97 ? 0.15 : 1;
      neon[0].color.setScalar(reduce ? 1 : 0.85 + Math.sin(t * 2) * 0.1); neon[1].color.setScalar(stutter);
      // The phone rings in bursts until you answer it, then shows the call timer while its card is open.
      const onCall = current === "phone";
      if (onCall && !wasPhone) answeredAt = t;
      wasPhone = onCall;
      drawPhone(onCall, onCall ? Math.min(59, Math.floor(t - answeredAt)) : 0);
      const cycle = t % 2.6, buzzing = !onCall && !reduce && cycle < 1.2 && cycle % 0.6 < 0.42;
      phoneBody.position.x = buzzing ? Math.sin(t * 90) * 0.003 : 0;
      phoneBody.rotation.y = buzzing ? Math.sin(t * 70) * 0.04 : 0;
      phScreenMat.color.setScalar(onCall || reduce ? 1 : 0.8 + Math.max(0, Math.sin(t * 2.4)) * 0.2);
      rings.forEach((r, i) => {
        const k = ((t * 0.8 + i / 3) % 1);
        const show = !onCall && !reduce && cycle < 1.6;
        r.scale.setScalar(1 + k * 2.4); ringMats[i].opacity = show ? (1 - k) * 0.35 : 0;
      });
    },
  };
}
