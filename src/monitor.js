// The desk monitor in both rooms. When nothing is open it shows the night shift: his projects working while he sleeps; when a featured
// project is open it plays a short looping demo of what that project does, in the project's accent colour.
// Other projects get a plain title card. Everything is drawn on a canvas that becomes the screen's texture.
import * as THREE from "three";

const W = 768, H = 448;
const MONO = "'DM Mono', Consolas, monospace", SANS = "'DM Sans', 'Segoe UI', sans-serif", DISPLAY = "Syne, 'Arial Black', sans-serif";
const BG = "#0d1322", BAR = "#161e30", CARD = "#151d2e", EDGE = "#2a3348", CREAM = "#f6efe2", DIM = "#8f98ad", GREEN = "#55e0a8", RED = "#ff5f5f";
export const IDLE_ACCENT = "#6fe0c0";

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (k) => 1 - (1 - k) ** 3;
// Eased progress of u through the window [a, b].
const seg = (u, a, b) => ease(clamp((u - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;

function rr(c, x, y, w, h, r, fill, stroke, lw = 2) {
  c.beginPath(); c.roundRect(x, y, w, h, r);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
}
function txt(c, s, x, y, font, color, align = "left") { c.font = font; c.fillStyle = color; c.textAlign = align; c.fillText(s, x, y); c.textAlign = "left"; }
function shape(c, pts, cx, cy, s, fill) {
  c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo : c.moveTo).call(c, cx + x * s, cy + y * s)); c.closePath(); c.fillStyle = fill; c.fill();
}
function tick(c, x, y, color, size = 9) {
  c.strokeStyle = color; c.lineWidth = 3; c.lineCap = "round"; c.beginPath();
  c.moveTo(x - size, y); c.lineTo(x - size * 0.3, y + size * 0.7); c.lineTo(x + size, y - size * 0.8); c.stroke();
}
function cross(c, x, y, color, size = 8) {
  c.strokeStyle = color; c.lineWidth = 3; c.lineCap = "round"; c.beginPath();
  c.moveTo(x - size, y - size); c.lineTo(x + size, y + size); c.moveTo(x + size, y - size); c.lineTo(x - size, y + size); c.stroke();
}
function lock(c, x, y, color) {
  c.strokeStyle = color; c.lineWidth = 3; c.beginPath(); c.arc(x, y - 6, 7, Math.PI, 0); c.stroke();
  rr(c, x - 11, y - 6, 22, 17, 3, color);
}
function wrap(c, text, x, y, width, lineHeight) {
  let line = "", row = y;
  for (const word of text.split(" ")) {
    if (c.measureText(line + word).width > width && line) { c.fillText(line, x, row); row += lineHeight; line = ""; }
    line += word + " ";
  }
  c.fillText(line, x, row);
  return row + lineHeight;
}

// The window frame every demo sits in: title on the left, a blinking LIVE on the right.
function chrome(c, p, u) {
  c.fillStyle = BG; c.fillRect(0, 0, W, H);
  c.fillStyle = BAR; c.fillRect(0, 0, W, 54);
  c.fillStyle = p.accent; c.fillRect(0, 0, 6, 54);
  txt(c, p.title, 24, 37, `800 25px ${DISPLAY}`, CREAM);
  const on = Math.floor(u * 1.6) % 2 === 0;
  c.globalAlpha = on ? 1 : 0.35; c.fillStyle = p.accent; c.beginPath(); c.arc(W - 118, 28, 7, 0, 7); c.fill(); c.globalAlpha = 1;
  txt(c, "LIVE DEMO", W - 24, 34, `500 16px ${MONO}`, p.accent, "right");
}

// --- One demo per featured project. Each has a loop length, a moment that shows the finished state
// (used for reduced motion), and a draw function of the time u within the loop. ---
const SCENES = {
  // Requirement -> Evidence -> Reasoning -> Confidence -> Decision, lit in turn while the resume is read.
  hiring: { loop: 8.5, hold: 7, draw(c, u, a) {
    rr(c, 28, 74, 250, 350, 10, "#eae4d6");
    c.fillStyle = "#c9c0ad"; c.beginPath(); c.arc(62, 112, 18, 0, 7); c.fill();
    rr(c, 92, 100, 120, 10, 4, "#8d8577"); rr(c, 92, 118, 80, 8, 4, "#b3aa98");
    const widths = [200, 170, 190, 120, 200, 160, 180, 140, 195, 150];
    widths.forEach((w, i) => rr(c, 46, 152 + i * 26, w, 9, 4, "#cfc6b4"));
    [2, 5, 7].forEach((row, k) => {
      const k2 = seg(u, 0.8 + k * 0.6, 1.3 + k * 0.6);
      if (k2 > 0) { c.globalAlpha = 0.45; rr(c, 40, 145 + row * 26, (widths[row] + 12) * k2, 22, 5, a); c.globalAlpha = 1; }
    });
    txt(c, "resume.pdf", 46, 410, `15px ${MONO}`, "#8d8577");

    const steps = ["Requirement", "Evidence", "Reasoning", "Confidence", "Decision"];
    const notes = ["Python, 3 yrs", "resume, line 6", "used in 2 projects", "0.86", "Shortlist"];
    steps.forEach((s, i) => {
      const y = 76 + i * 60, at = 1.2 + i * 0.75, done = u > at + 0.45, active = !done && u > at;
      if (i) { c.strokeStyle = u > at ? a : EDGE; c.lineWidth = 3; c.beginPath(); c.moveTo(420, y - 16); c.lineTo(420, y); c.stroke(); }
      if (active) { c.shadowColor = a; c.shadowBlur = 18 + Math.sin(u * 12) * 6; }
      rr(c, 306, y, 230, 44, 10, done ? a : CARD, done ? null : active ? a : EDGE);
      c.shadowBlur = 0;
      txt(c, s, 324, y + 29, `600 19px ${SANS}`, done ? "#0b101e" : active ? CREAM : DIM);
      if (done) { tick(c, 512, y + 22, "#0b101e"); txt(c, notes[i], 552, y + 29, `16px ${MONO}`, i === 4 ? GREEN : DIM); }
    });
    // A highlighted line of evidence flies over to the Evidence step.
    const fly = seg(u, 1.4, 2.0);
    if (fly > 0 && fly < 1) { c.fillStyle = a; c.beginPath(); c.arc(lerp(250, 306, fly), lerp(210, 158, fly), 7, 0, 7); c.fill(); }

    const score = seg(u, 4.6, 5.8) * 0.86;
    txt(c, "match score", 306, 400, `15px ${MONO}`, DIM);
    rr(c, 306, 410, 340, 14, 7, CARD);
    if (score > 0) rr(c, 306, 410, 340 * score, 14, 7, a);
    txt(c, `${Math.round(score * 100)}%`, 740, 424, `800 26px ${DISPLAY}`, CREAM, "right");
  } },

  // Homework questions checked against the textbook: one is off-topic, and a replacement is suggested with its source.
  documentor: { loop: 9, hold: 7.5, draw(c, u, a) {
    rr(c, 28, 74, 290, 350, 10, "#f3ead7");
    txt(c, "Textbook · Ch. 4", 46, 106, `700 19px ${DISPLAY}`, "#3a3228");
    txt(c, "Clustering", 46, 128, `15px ${SANS}`, "#7a6f5e");
    const widths = [240, 210, 230, 180, 236, 200, 220, 170, 232, 190];
    const qs = [["Explain how k-means picks centroids", true], ["Compute a silhouette score", true], ["Describe photosynthesis", false], ["Compare DBSCAN and k-means", true], ["When does the elbow method fail?", true]];
    const at = (k) => 0.8 + k * 0.85;
    const current = qs.findIndex((_, k) => u >= at(k) && u < at(k + 1));
    widths.forEach((w, i) => {
      const lit = current >= 0 && qs[current][1] && Math.floor(i / 2) === current;
      rr(c, 46, 152 + i * 26, w, 9, 4, lit ? a : "#d8cdb6");
    });
    txt(c, "p. 104 – 118", 46, 410, `15px ${MONO}`, "#7a6f5e");

    txt(c, "Homework 4", 340, 106, `700 19px ${DISPLAY}`, CREAM);
    qs.forEach(([q, ok], k) => {
      const y = 124 + k * 50, checked = u > at(k) + 0.45, scanning = current === k && !checked;
      rr(c, 340, y, 400, 40, 8, CARD, checked && !ok ? RED : scanning ? a : EDGE);
      txt(c, `Q${k + 1}`, 354, y + 26, `500 15px ${MONO}`, DIM);
      txt(c, q, 390, y + 26, `16px ${SANS}`, checked && !ok ? "#ffb3b3" : CREAM);
      if (checked) (ok ? tick : cross)(c, 720, y + 20, ok ? GREEN : RED);
    });
    if (u > at(2) + 0.45) txt(c, "off-topic", 700, 124 + 2 * 50 + 25, `14px ${MONO}`, RED, "right");
    const s = seg(u, 5.6, 6.2);
    if (s > 0) {
      c.globalAlpha = s; rr(c, 340, 382, 400, 42, 8, null, a);
      txt(c, "Try: “Explain hierarchical clustering”", 354, 409, `15px ${SANS}`, CREAM);
      rr(c, 650, 390, 80, 26, 13, u > 7 ? GREEN : a); txt(c, u > 7 ? "Accepted" : "Accept", 690, 408, `600 13px ${SANS}`, "#0b101e", "center");
      c.globalAlpha = 1;
    }
  } },

  // PM writes the spec, QA locks tests before code exists, the developer codes until every test passes.
  agentcorp: { loop: 9.5, hold: 8, draw(c, u, a) {
    const nodes = [["PM", "Product manager", 130], ["DEV", "Architect & coder", 384], ["QA", "Test-first QA", 638]];
    const Y = 168;
    c.strokeStyle = EDGE; c.lineWidth = 3; c.beginPath(); c.moveTo(130, Y); c.lineTo(638, Y); c.stroke();
    const active = u < 1.6 ? 0 : u < 2.9 ? 1 : u < 3.6 ? 2 : u < 4.6 ? -1 : u < 5.6 ? 1 : u < 7.2 ? 2 : -1;
    nodes.forEach(([name, sub, x], i) => {
      rr(c, x - 50, Y - 50, 100, 100, 50, CARD, i === active ? a : EDGE, 3);
      if (i === active) { c.strokeStyle = a; c.lineWidth = 4; c.beginPath(); c.arc(x, Y, 60, u * 4, u * 4 + 1.6); c.stroke(); }
      txt(c, name, x, Y + 9, `800 24px ${DISPLAY}`, CREAM, "center");
      txt(c, sub, x, Y + 84, `15px ${SANS}`, DIM, "center");
    });
    const packet = (label, from, to, t0, t1) => {
      const k = seg(u, t0, t1);
      if (u < t0 || u > t1 + 0.2) return;
      const x = lerp(from, to, k);
      c.font = `500 14px ${MONO}`; const w = c.measureText(label).width + 20;
      rr(c, x - w / 2, Y - 92, w, 28, 8, a); txt(c, label, x, Y - 73, `500 14px ${MONO}`, "#0b101e", "center");
    };
    packet("prd_v1.md", 130, 384, 0.3, 1.5);
    packet("architecture_v1.md", 384, 638, 1.6, 2.8);
    packet("locked tests", 638, 384, 3.6, 4.5);
    if (u > 2.9) lock(c, 688, Y - 44, u > 3.2 ? a : DIM);
    if (u > 4.6 && u < 5.6) txt(c, "writing code" + ".".repeat(Math.floor(u * 4) % 4), 384, Y - 74, `500 15px ${MONO}`, a, "center");

    txt(c, "acceptance tests", 130, 318, `15px ${MONO}`, DIM);
    for (let i = 0; i < 12; i++) {
      const passed = u > 5.7 + i * 0.12, x = 130 + i * 44;
      rr(c, x, 330, 34, 34, 7, passed ? GREEN : CARD, passed ? null : u > 3.2 ? a : EDGE);
      if (passed) tick(c, x + 17, 347, "#0b101e", 7);
    }
    if (u > 7.3) txt(c, "qa_report_v1.md · every criterion met", 130, 410, `600 18px ${SANS}`, GREEN);
  } },

  // A traced agent run through a simulated outage, then the assertions that pass.
  agenttest: { loop: 9, hold: 8, draw(c, u, a) {
    txt(c, "trace · test_order_eta", 28, 92, `15px ${MONO}`, DIM);
    const rows = [["user", "when does order #123 arrive?", "#6cc5ff"], ["llm", "call search_orders(id=123)", "#c8a2ff"], ["tool", "503 · simulated outage", RED], ["llm", "retry with backoff", "#c8a2ff"], ["tool", "{ eta: \"Friday\" }", GREEN], ["agent", "It arrives on Friday.", a]];
    c.strokeStyle = EDGE; c.lineWidth = 2; c.beginPath(); c.moveTo(60, 120); c.lineTo(60, 120 + 44 * 5 * seg(u, 0.3, 3.3)); c.stroke();
    rows.forEach(([kind, text, col], i) => {
      const k = seg(u, 0.3 + i * 0.6, 0.6 + i * 0.6);
      if (k <= 0) return;
      const y = 104 + i * 46;
      c.globalAlpha = k;
      rr(c, 28 + (1 - k) * 20, y, 66, 30, 7, col); txt(c, kind, 61 + (1 - k) * 20, y + 21, `500 14px ${MONO}`, "#0b101e", "center");
      txt(c, text, 108 + (1 - k) * 20, y + 21, `16px ${MONO}`, kind === "tool" && col === RED ? "#ffb3b3" : CREAM);
      c.globalAlpha = 1;
    });
    rr(c, 492, 80, 250, 300, 12, CARD, EDGE);
    txt(c, "assertions", 512, 112, `15px ${MONO}`, DIM);
    ["called search_orders", "survived the outage", "answer is grounded", "pass rate 9 / 10"].forEach((s, i) => {
      const y = 152 + i * 54, ok = u > 4.2 + i * 0.5;
      if (ok) tick(c, 524, y - 6, GREEN, 8);
      else { c.fillStyle = EDGE; c.beginPath(); c.arc(524, y - 6, 5, 0, 7); c.fill(); }
      txt(c, s, 546, y, `16px ${SANS}`, ok ? CREAM : DIM);
    });
    if (u > 6.4) { txt(c, "4 passed", 28, 420, `500 24px ${MONO}`, GREEN); txt(c, "in 0.31s · model calls replayed", 150, 420, `16px ${MONO}`, DIM); }
  } },

  // Clothes are photographed and classified, one goes in the wash, and a prompt builds an outfit from the rest.
  style: { loop: 9, hold: 7.5, draw(c, u, a) {
    const items = [
      ["T-shirt", "0.97", "#e9c46a", [[-30, -40], [-12, -46], [0, -38], [12, -46], [30, -40], [52, -18], [38, -6], [28, -16], [28, 44], [-28, 44], [-28, -16], [-38, -6], [-52, -18]]],
      ["Jeans", "0.95", "#4a7cc4", [[-26, -46], [26, -46], [30, 48], [8, 48], [0, -6], [-8, 48], [-30, 48]]],
      ["Sneakers", "0.93", CREAM, [[-50, 20], [-50, -6], [-20, -10], [0, -30], [22, -30], [30, -6], [52, 4], [52, 20]]],
      ["Jacket", "0.91", "#7d8f6a", [[-30, -44], [-10, -48], [0, -30], [10, -48], [30, -44], [44, -30], [54, 40], [38, 42], [30, -10], [30, 46], [-30, 46], [-30, -10], [-38, 42], [-54, 40], [-44, -30]]],
    ];
    const picked = u > 5.2;
    items.forEach(([name, conf, col, pts], i) => {
      const k = seg(u, 0.2 + i * 0.25, 0.8 + i * 0.25), x = 28 + i * 182, y = 76 + (1 - k) * 40;
      if (k <= 0) return;
      const wash = i === 3 && u > 3.1, inOutfit = picked && i < 3;
      c.globalAlpha = k * (wash ? 0.4 : 1);
      rr(c, x, y, 166, 180, 12, CARD, inOutfit ? a : EDGE, inOutfit ? 3 : 2);
      shape(c, pts, x + 83, y + 72, 0.95, col);
      if (u > 1.4 + i * 0.35) { txt(c, name, x + 16, y + 158, `700 18px ${DISPLAY}`, CREAM); txt(c, conf, x + 150, y + 158, `500 14px ${MONO}`, a, "right"); }
      c.globalAlpha = 1;
      if (wash) { rr(c, x + 30, y + 64, 106, 28, 14, "#2a3348"); txt(c, "in the wash", x + 83, y + 83, `500 13px ${MONO}`, CREAM, "center"); }
    });
    rr(c, 28, 278, 712, 50, 12, CARD, u > 3.4 && u < 5 ? a : EDGE);
    const prompt = "casual weekend", typed = prompt.slice(0, Math.floor(clamp((u - 3.4) / 1.1) * prompt.length));
    txt(c, "›", 46, 311, `500 20px ${MONO}`, a);
    txt(c, typed + (u > 3.4 && u < 5 && Math.floor(u * 3) % 2 ? "▌" : ""), 70, 310, `18px ${MONO}`, CREAM);
    if (u < 3.4) txt(c, "describe an occasion…", 70, 310, `18px ${SANS}`, "#55607a");
    const s = seg(u, 5.2, 5.9);
    if (s > 0) {
      c.globalAlpha = s;
      txt(c, "Outfit 1", 28, 384, `800 22px ${DISPLAY}`, CREAM);
      txt(c, "T-shirt + Jeans + Sneakers", 28, 412, `16px ${SANS}`, DIM);
      rr(c, 400, 368, 260, 14, 7, CARD); rr(c, 400, 368, 260 * 0.92 * seg(u, 5.4, 6.4), 14, 7, a);
      txt(c, "92%", 740, 384, `800 24px ${DISPLAY}`, CREAM, "right");
      txt(c, "style compatibility", 400, 412, `14px ${MONO}`, DIM);
      c.globalAlpha = 1;
    }
  } },

  // A nine-factor match grows on the radar, then the deal moves down the pipeline.
  investo: { loop: 9, hold: 8, draw(c, u, a) {
    const cx = 210, cy = 262, R = 118, n = 9;
    const labels = ["Sector", "Stage", "Ticket", "Geo", "Traction", "Team", "Thesis", "Risk", "Timing"];
    const vals = [0.9, 0.8, 0.95, 0.7, 0.85, 0.9, 0.95, 0.75, 0.82];
    const pt = (i, r) => [cx + Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / n) * r, cy + Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / n) * r];
    c.strokeStyle = "#263049"; c.lineWidth = 1.5;
    for (const f of [0.33, 0.66, 1]) { c.beginPath(); for (let i = 0; i <= n; i++) (i ? c.lineTo : c.moveTo).call(c, ...pt(i % n, R * f)); c.stroke(); }
    for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(...pt(i, R)); c.stroke(); const [lx, ly] = pt(i, R + 22); txt(c, labels[i], lx, ly + 5, `13px ${MONO}`, DIM, "center"); }
    const g = seg(u, 0.3, 2.2);
    c.beginPath(); for (let i = 0; i <= n; i++) (i ? c.lineTo : c.moveTo).call(c, ...pt(i % n, R * vals[i % n] * g));
    c.globalAlpha = 0.3; c.fillStyle = a; c.fill(); c.globalAlpha = 1; c.strokeStyle = a; c.lineWidth = 3; c.stroke();
    txt(c, "match", 28, 96, `15px ${MONO}`, DIM);
    txt(c, `${Math.round(92 * g)}%`, 28, 134, `800 36px ${DISPLAY}`, a);

    const stages = ["Matched", "Meeting", "Data room", "Term sheet", "Closed"];
    const stage = clamp(Math.floor((u - 2.4) / 0.95), 0, 4);
    const moving = seg(u, 2.4 + stage * 0.95, 2.4 + stage * 0.95 + 0.5);
    c.strokeStyle = EDGE; c.lineWidth = 3; c.beginPath(); c.moveTo(440, 100); c.lineTo(440, 100 + 4 * 72); c.stroke();
    stages.forEach((s, i) => {
      const y = 100 + i * 72, reached = u > 2.4 && i <= stage;
      c.fillStyle = reached ? (i === 4 ? GREEN : a) : CARD; c.beginPath(); c.arc(440, y, 10, 0, 7); c.fill();
      c.strokeStyle = reached ? "transparent" : EDGE; c.lineWidth = 2; c.stroke();
      txt(c, s, 462, y + 6, `17px ${SANS}`, reached ? CREAM : DIM);
    });
    if (u > 2.4) {
      const y = lerp(100 + Math.max(0, stage - 1) * 72, 100 + stage * 72, stage ? moving : 1) - 22;
      const closed = stage === 4 && moving >= 1;
      rr(c, 576, y, 166, 44, 10, closed ? GREEN : CARD, closed ? null : a);
      txt(c, "Nimbus Labs", 590, y + 19, `600 15px ${SANS}`, closed ? "#0b101e" : CREAM);
      txt(c, closed ? "deal closed" : "seed · ₹2 Cr", 590, y + 36, `13px ${MONO}`, closed ? "#0b101e" : DIM);
    }
    txt(c, "all money is simulated", 740, 430, `13px ${MONO}`, "#55607a", "right");
  } },

  // Courses from three platforms fly into one catalogue, then get filtered by category.
  linkbery: { loop: 8, hold: 6.5, draw(c, u, a) {
    const sources = [["Coursera", "#2a73cc"], ["Udemy", "#a435f0"], ["Scrimba", "#e98b2a"]];
    sources.forEach(([name, col], i) => { rr(c, 28, 96 + i * 100, 168, 64, 12, col); txt(c, name, 112, 136 + i * 100, `700 19px ${DISPLAY}`, "#fff", "center"); });
    const tabs = ["All", "AI", "Web", "Data"], filter = u > 5.4 ? 1 : 0;
    tabs.forEach((t, i) => { const on = i === filter; rr(c, 290 + i * 78, 70, 68, 30, 15, on ? a : null, on ? null : EDGE); txt(c, t, 324 + i * 78, 91, `600 14px ${SANS}`, on ? "#0b101e" : DIM, "center"); });
    const courses = [["Intro to ML", 1], ["React Basics", 2], ["SQL for Data", 3], ["Deep Learning", 1], ["JS in 30 Days", 2], ["Pandas 101", 3], ["LLM Apps", 1], ["CSS Grid", 2], ["Statistics", 3]];
    courses.forEach(([title, cat], i) => {
      const src = i % 3, k = seg(u, 0.4 + i * 0.33, 1.1 + i * 0.33);
      if (k <= 0) return;
      const gx = 290 + (i % 3) * 152, gy = 116 + Math.floor(i / 3) * 96;
      const x = lerp(196, gx, k), y = lerp(96 + src * 100, gy, k);
      c.globalAlpha = filter && cat !== filter ? 0.25 : 1;
      rr(c, x, y, 140, 82, 10, CARD, EDGE); c.fillStyle = sources[src][1]; c.fillRect(x, y + 10, 4, 62);
      txt(c, title, x + 16, y + 34, `600 15px ${SANS}`, CREAM);
      txt(c, sources[src][0].toLowerCase(), x + 16, y + 60, `12px ${MONO}`, DIM);
      c.globalAlpha = 1;
    });
    if (u > 4.4) txt(c, "9 courses · 3 platforms · 1 place", 290, 428, `500 16px ${MONO}`, a);
  } },
};

// Projects without a demo get a title card.
function card(c, p) {
  const a = p.accent ?? "#6cc5ff";
  c.fillStyle = BG; c.fillRect(0, 0, W, H);
  c.fillStyle = a; c.fillRect(0, 0, W, 12);
  txt(c, p.tag, 40, 76, `26px ${MONO}`, a);
  c.fillStyle = CREAM; c.font = `800 48px ${DISPLAY}`;
  const after = wrap(c, p.title, 40, 140, 690, 56);
  c.fillStyle = "#a9b1c4"; c.font = `28px ${SANS}`;
  const end = wrap(c, p.tagline, 40, after + 6, 690, 38);
  let x = 40;
  for (const s of p.stack ?? []) {
    c.font = `18px ${MONO}`; const w = c.measureText(s).width + 26;
    if (x + w > 730) break;
    rr(c, x, end + 4, w, 34, 17, null, a); txt(c, s, x + 13, end + 27, `18px ${MONO}`, a); x += w + 10;
  }
}

// The idle screen: the night shift. Nithin is asleep, but his projects keep doing their jobs, one log line at a time.
const NIGHT_LOG = [
  ["agenttest", "#ff8a5c", "128 agent tests passed, replayed for free"],
  ["DocuMentor", "#f4b860", "graded 32 answers, each with its textbook page"],
  ["Hiring", "#9d8cff", "shortlisted 3 candidates, every score with evidence"],
  ["AgentCorp", "#4fd1a5", "QA locked 12 acceptance tests before any code"],
  ["Investo", "#6cc5ff", "matched 5 startups to investors, and said why"],
  ["Style Matrix", "#ff6fa8", "planned tomorrow's outfit (jeans are in the wash)"],
  ["Linkbery", "#c8a2ff", "found 40 new courses across 3 platforms"],
  ["DocuMentor", "#f4b860", "flagged 1 off-topic homework question"],
  ["agenttest", "#ff8a5c", "caught a tool loop before it shipped"],
  ["Hiring", "#9d8cff", "flagged a skill listed but never shown"],
];
const STEP = 2.2, ROWS = 6;
const nightTime = (i) => { const m = 2 * 60 + 12 + i * 3; return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
function nightShift(c, time) {
  const n = Math.floor(time / STEP), phase = time - n * STEP;
  c.fillStyle = BG; c.fillRect(0, 0, W, H);
  c.fillStyle = BAR; c.fillRect(0, 0, W, 48);
  ["#d9583f", "#e9c46a", GREEN].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(26 + i * 26, 24, 8, 0, 7); c.fill(); });
  txt(c, "night-shift.log", 110, 31, `18px ${MONO}`, "#a9b1c4");
  txt(c, nightTime(n % 80), W - 24, 32, `500 20px ${MONO}`, IDLE_ACCENT, "right");

  // Asleep: a moon, drifting Zs and when he'll be back.
  c.fillStyle = "#ffe2ad"; c.beginPath(); c.arc(52, 96, 20, 0, 7); c.fill();
  c.fillStyle = BG; c.beginPath(); c.arc(62, 88, 18, 0, 7); c.fill();
  for (let i = 0; i < 3; i++) {
    const k = (time * 0.35 + i / 3) % 1;
    c.globalAlpha = Math.sin(k * Math.PI); txt(c, "z", 78 + k * 26 + i * 4, 92 - k * 30, `600 ${13 + i * 4}px ${DISPLAY}`, "#ffe2ad"); c.globalAlpha = 1;
  }
  txt(c, "Nithin is asleep", 124, 96, `800 24px ${DISPLAY}`, CREAM);
  txt(c, "back around 09:00 · his agents don't sleep", 124, 122, `16px ${SANS}`, DIM);
  c.fillStyle = EDGE; c.fillRect(24, 146, W - 48, 2);

  // The newest line slides in at the bottom, works for a moment, then ticks off.
  const slide = ease(clamp(phase / 0.4));
  for (let r = 0; r < ROWS; r++) {
    const i = n - (ROWS - 1 - r);
    if (i < 0) continue;
    const [name, col, msg] = NIGHT_LOG[i % NIGHT_LOG.length];
    const y = 186 + r * 44 + (1 - slide) * 44, newest = r === ROWS - 1;
    c.globalAlpha = (newest ? slide : 1) * (0.35 + 0.65 * (r / (ROWS - 1)));
    txt(c, nightTime(i % 80), 28, y, `15px ${MONO}`, DIM);
    txt(c, name, 96, y, `500 16px ${MONO}`, col);
    txt(c, msg, 230, y, `17px ${SANS}`, CREAM);
    if (newest && phase < 1.4) { c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.arc(736, y - 6, 8, time * 6, time * 6 + 4.2); c.stroke(); }
    else tick(c, 736, y - 6, GREEN, 8);
    c.globalAlpha = 1;
  }
}

export function createMonitor({ reduce = false } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  let project = null, since = 0, last = -1;
  const now = () => performance.now() / 1000;

  function draw() {
    const scene = project && SCENES[project.id];
    if (scene) {
      const u = reduce ? scene.hold : (now() - since) % scene.loop;
      chrome(c, project, u);
      scene.draw(c, u, project.accent);
    } else if (project) card(c, project);
    else nightShift(c, reduce ? STEP * 6 + 2 : now());
    texture.needsUpdate = true;
  }

  draw();
  document.fonts?.ready.then(draw);
  return {
    texture,
    get accent() { return project?.accent ?? IDLE_ACCENT; },
    show(p) { project = p; since = now(); draw(); },
    // Call every frame. Demos redraw at 30 fps, the idle screen at 12; a plain card never needs to.
    update() {
      if (reduce || (project && !SCENES[project.id])) return;
      const t = now();
      if (t - last < (project ? 1 / 30 : 1 / 12)) return;
      last = t; draw();
    },
  };
}
