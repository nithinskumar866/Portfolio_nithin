import * as THREE from "three";
import { CERTS } from "./content.js";

// The picked certificate's book leaves the shelf and opens in front of it: what it taught on the left page, where it was used on the right.
const W = 0.34, H = 0.48;

function wrap(c, text, x, y, max, lh) {
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (c.measureText(test).width > max && line) { c.fillText(line, x, y); y += lh; line = word; } else line = test;
  }
  if (line) c.fillText(line, x, y);
  return y + lh;
}

function pageTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 340; canvas.height = 480;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { canvas, tex };
}

function paint(left, right, cert, titles) {
  const ink = "#2b2620", label = "#8a6d55";
  const base = (c, flip) => {
    c.fillStyle = "#f3ead8"; c.fillRect(0, 0, 340, 480);
    const g = c.createLinearGradient(flip ? 340 : 0, 0, flip ? 300 : 40, 0);
    g.addColorStop(0, "#0000002a"); g.addColorStop(1, "#00000000");
    c.fillStyle = g; c.fillRect(0, 0, 340, 480);
    c.textBaseline = "top";
  };
  let c = left.canvas.getContext("2d");
  base(c, true);
  c.fillStyle = label; c.font = "500 15px \"DM Mono\", monospace"; c.fillText(cert.by.toUpperCase(), 26, 30);
  c.fillStyle = ink; c.font = "700 27px Syne, sans-serif";
  let y = wrap(c, cert.name, 26, 58, 290, 32) + 14;
  c.fillStyle = label; c.font = "500 15px \"DM Mono\", monospace"; c.fillText("WHAT IT TAUGHT ME", 26, y); y += 30;
  c.fillStyle = ink; c.font = "19px \"DM Sans\", sans-serif";
  for (const l of cert.learned) { c.fillText("•", 26, y); y = wrap(c, l, 44, y, 270, 24) + 8; }

  c = right.canvas.getContext("2d");
  base(c, false);
  c.fillStyle = label; c.font = "500 15px \"DM Mono\", monospace"; c.fillText("WHERE I USED IT", 24, 30);
  y = 62;
  for (const u of cert.used) {
    const title = u.label ?? titles[u.id] ?? u.id;
    c.font = "21px \"DM Sans\", sans-serif";
    const top = y;
    c.font = "700 21px \"DM Sans\", sans-serif"; c.fillStyle = ink;
    y = wrap(c, title, 38, y + 12, 270, 26);
    c.font = "17px \"DM Sans\", sans-serif"; c.fillStyle = "#5d5246";
    y = wrap(c, u.what, 38, y + 2, 270, 22) + 10;
    c.setLineDash([6, 5]); c.strokeStyle = "#8a6d5599"; c.lineWidth = 2;
    c.strokeRect(24, top, 296, y - top); c.setLineDash([]);
    y += 12;
  }
  left.tex.needsUpdate = true; right.tex.needsUpdate = true;
}

/**
 * @param {THREE.Object3D} shelf the bookshelf group the books live in
 * @param {THREE.Mesh[]} books one mesh per certificate, in CERTS order
 * @param {Record<string,string>} titles project id -> title, for the right-hand page
 */
export function createOpenBook(shelf, books, titles, reduce) {
  const group = new THREE.Group();
  group.visible = false;
  shelf.add(group);
  const coverMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.7 });
  const halves = [1, -1].map((side) => {
    const pivot = new THREE.Group();
    group.add(pivot);
    const page = pageTexture();
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ map: page.tex, emissive: "#fff3dc", emissiveMap: page.tex, emissiveIntensity: 0.16, roughness: 0.9 }));
    paper.rotation.y = Math.PI / 2;
    paper.position.set(0.004, 0, side * W / 2);
    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.014, H + 0.03, W + 0.02), coverMat);
    cover.position.set(-0.006, 0, side * (W / 2 + 0.008));
    pivot.add(paper, cover);
    return { pivot, side, page };
  });
  const glow = new THREE.PointLight("#ffd9a8", 0, 1.4, 2);
  glow.position.set(0.35, 0.05, 0);
  group.add(glow);

  let shown = null, open = 0;
  const target = new THREE.Vector3();

  return {
    update(sel) {
      if (sel !== shown) {
        shown = sel;
        books.forEach((b) => { b.visible = true; });
        if (sel == null) { group.visible = false; return; }
        const cert = CERTS[sel], book = books[sel];
        coverMat.color.set(cert.color);
        paint(halves[0].page, halves[1].page, cert, titles);
        group.position.copy(book.position);
        target.set(-3.02, book.position.y < 1.1 ? 0.64 : 1.76, THREE.MathUtils.clamp(book.position.z, 0.62, 1.98));
        open = 0;
        group.visible = true;
      }
      if (sel == null) return;
      const k = reduce ? 1 : 0.12;
      group.position.lerp(target, k);
      open += ((1) - open) * (reduce ? 1 : 0.09);
      books[sel].visible = open < 0.08;
      group.scale.setScalar(0.55 + open * 0.45);
      group.rotation.z = -0.12 * open;
      for (const h of halves) h.pivot.rotation.y = h.side * (Math.PI / 2 - (Math.PI / 2 - 0.34) * open);
      glow.intensity = open * 1.6;
    },
  };
}
