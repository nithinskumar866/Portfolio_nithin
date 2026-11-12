import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PROJECTS, SECTIONS, SECTION_ORDER, mountSection } from "../content.js";
import { createOpenBook } from "../openbook.js";
import { createTour, hasSeenTour } from "../tour.js";
import { createMonitor } from "../monitor.js";
import { createMatch } from "./match.js";
import { buildExtras } from "./extras.js";
import { buildHobbies } from "./hobbies.js";
import { EXTRA_SECTIONS, mountPublications, mountFuture, mountFilms, mountHeartbreak, mountPhone, mountGuestbook, mountScooter } from "./panels.js";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-mono/400.css";
import "../styles.css";
import "./personal.css";

// Text drawn onto 3D objects only uses these fonts, so ask for them explicitly.
for (const font of ["800 62px Syne", "700 34px Syne", "26px \"DM Sans\"", "22px \"DM Mono\""]) document.fonts?.load(font);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// The personal room is about 1.5x the professional one: the walls, and everything on them, sit G further out.
const G = 2.1;
const HALF = 4.2 + G;

// Camera position and look-at point for each stop. The picture shifts aside so the object clears the panel.
const STOPS = {
  home: { pos: [17.2, 12.2, 17.2], look: [-1.9, 1.0, -0.8] },
  about: { pos: [1.5, 2.5, 6.0], look: [-0.55, 0.62, 1.25] },
  projects: { pos: [0.95, 3.2, 3.4 - G], look: [0.95, 1.6, -3.2 - G] },
  experience: { pos: [-1.45, 3.2, 2.9 - G], look: [-1.45, 2.95, -3.8 - G] },
  skills: { pos: [1.3, 3.2, 3.7 - G], look: [3.25, 1.55, -2.8 - G] },
  certificates: { pos: [3.1 - G, 3.2, 3.9], look: [-3.5 - G, 1.7, 1.2] },
  contact: { pos: [7.6, 2.5, 2.6], look: [3.6, 0.85, -0.4] },
};

if (innerWidth < 800) STOPS.home.look = [0.2, 0.4, 0.2];
{
  // Square on to the TV on the left wall.
  const d = innerWidth < 800 ? 4.4 : 3.0;
  STOPS.tv = { pos: [-5.93 + d, 1.85, 4.85], look: [-5.93, 1.75, 4.85] };
}
STOPS.publications = { pos: [-1.2, 3.0, 1.3], look: [-4.9, 2.8, 1.3] };
STOPS.future = { pos: [1.0, 3.25, -1.8], look: [1.05, 3.35, -6.0] };
STOPS.poster = { pos: [-4.15, 3.0, -2.6], look: [-4.15, 3.0, -6.0] };
STOPS.films = { pos: [-1.1, 3.0, 0.5], look: [-3.95, 0.95, -4.4] };
STOPS.guestbook = { pos: [4.65, 2.75, -1.7], look: [5.05, 2.45, -6.0] };
STOPS.scooter = { pos: [6.1, 2.3, -0.4], look: [5.05, 0.7, -4.5] };
STOPS.phone = { pos: [0.2, 1.5, 3.2], look: [-1.0, 0.1, 1.7] };
STOPS.heartbreak = { pos: [-1.9, 3.05, 3.2], look: [-6.0, 3.1, 3.2] };

const canvas = document.getElementById("scene");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch {
  document.getElementById("loader").remove();
  location.replace("/simple.html");
  throw new Error("WebGL is unavailable");
}
// If the browser drops the graphics context, reload so the textures come back with the scene.
canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setTimeout(() => location.reload(), 400); });
const maxRatio = Math.min(devicePixelRatio, 1.5);
renderer.setPixelRatio(maxRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Shadows are redrawn every other frame instead of every frame (see render()).
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color("#0c1424");
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
const world = new THREE.Group();
scene.add(world);

const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.02, ...opts });
function add(mesh, parent, x = 0, y = 0, z = 0, shadow = true) {
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
const box = (w, h, d, color, parent, x, y, z, r = 0.035) => add(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2.01, h / 2.01, d / 2.01)), color.isMaterial ? color : mat(color)), parent, x, y, z);
const cyl = (rt, rb, h, color, parent, x, y, z, seg = 28) => add(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), color.isMaterial ? color : mat(color)), parent, x, y, z);
const ball = (r, color, parent, x, y, z) => add(new THREE.Mesh(new THREE.SphereGeometry(r, r < 0.04 ? 10 : r < 0.12 ? 16 : 28, r < 0.04 ? 7 : r < 0.12 ? 12 : 20), color.isMaterial ? color : mat(color)), parent, x, y, z);
const station = (name) => { const g = new THREE.Group(); g.userData.station = name; world.add(g); return g; };

// Shell of the room.
box(HALF * 2, 0.3, HALF * 2, "#5f4634", world, 0, -0.15, 0, 0.06);
box(0.28, 5, HALF * 2, "#2b5a70", world, 0.14 - HALF, 2.5, 0, 0.05);
box(HALF * 2, 5, 0.28, "#30667c", world, 0, 2.5, 0.14 - HALF, 0.05);
for (let i = 0; i < 12; i++) box(1.05, 0.02, HALF * 2 - 0.1, i % 2 ? "#6e533e" : "#634936", world, -HALF + 0.525 + i * 1.05, 0.01, 0, 0.005);
box(HALF * 2, 0.14, 0.08, "#e8dcc6", world, 0, 0.1, 0.3 - HALF, 0.02);
box(0.08, 0.14, HALF * 2, "#e8dcc6", world, 0.3 - HALF, 0.1, 0, 0.02);
const rug = cyl(2.3, 2.3, 0.035, "#8c5f50", world, -0.3, 0.04, 1.7, 56); rug.castShadow = false;
cyl(1.9, 1.9, 0.04, "#e3cda4", world, -0.3, 0.045, 1.7, 56).castShadow = false;
cyl(1.5, 1.5, 0.045, "#34565f", world, -0.3, 0.05, 1.7, 56).castShadow = false;

// Window with the night outside.
const skyCanvas = document.createElement("canvas");
skyCanvas.width = 360; skyCanvas.height = 400;
{
  const c = skyCanvas.getContext("2d");
  const sky = c.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, "#7c8fc4"); sky.addColorStop(0.45, "#f0a9a0"); sky.addColorStop(0.75, "#ffd39a"); sky.addColorStop(1, "#ffe9c2");
  c.fillStyle = sky; c.fillRect(0, 0, 360, 400);
  c.fillStyle = "#fff4d6"; c.beginPath(); c.arc(215, 270, 42, 0, 7); c.fill();
  c.fillStyle = "#ffffff55"; for (const [x, y, w] of [[50, 90, 120], [210, 135, 100], [100, 180, 90]]) { c.beginPath(); c.ellipse(x, y, w / 2, 9, 0, 0, 7); c.fill(); }
  const hill = (color, base, amp, f) => { c.fillStyle = color; c.beginPath(); c.moveTo(0, 400); for (let x = 0; x <= 360; x += 6) c.lineTo(x, base + Math.sin(x / f) * amp + Math.sin(x / (f * 0.37)) * amp * 0.3); c.lineTo(360, 400); c.fill(); };
  hill("#8f7fa8", 300, 20, 55); hill("#5f6b8c", 330, 18, 40); hill("#3c5461", 362, 14, 30);
}
const skyTex = new THREE.CanvasTexture(skyCanvas); skyTex.colorSpace = THREE.SRGBColorSpace;
box(0.1, 2.2, 2.0, "#e8dcc6", world, -3.9 - G, 2.9, -1.95, 0.02);
add(new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.0), new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false })), world, -3.84 - G, 2.9, -1.95, false).rotation.y = Math.PI / 2;

// Sunlight falling through the window, as window-shaped patches on the floor.
const sunMat = new THREE.MeshBasicMaterial({ color: "#ffcf91", transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
for (const [x, z] of [[-2.95 - G, -2.45], [-2.95 - G, -1.5], [-1.95 - G, -2.45], [-1.95 - G, -1.5]]) {
  const patch = add(new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.86), sunMat), world, x, 0.035, z, false);
  patch.rotation.x = -Math.PI / 2;
}

// Fairy lights along the top of the walls.
const fairy = [];
const addBulb = (x, z, i) => {
  const m = new THREE.MeshBasicMaterial({ color: "#ffd993", toneMapped: false });
  const y = 4.55 - Math.abs(Math.sin(i * 0.9)) * 0.22;
  fairy.push({ m, phase: i * 1.7, mesh: add(new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), m), world, x, y, z, false) });
};
for (let i = 0; i < 25; i++) addBulb(-3.75 - G + i * 0.5, -3.84 - G, i);
for (let i = 0; i < 24; i++) addBulb(-3.84 - G, -3.3 - G + i * 0.5, i + 25);
box(0.08, 2.0, 0.05, "#e8dcc6", world, -3.82 - G, 2.9, -1.95, 0.01);
box(0.08, 0.05, 1.8, "#e8dcc6", world, -3.82 - G, 2.9, -1.95, 0.01);

// Desk, monitor and lamp.
const desk = station("projects");
desk.position.z = -G;
box(3.5, 0.13, 1.25, "#b27a4b", desk, 0.95, 1.08, -3.1, 0.04);
for (const [x, z] of [[-0.7, -3.6], [2.6, -3.6], [-0.7, -2.6], [2.6, -2.6]]) box(0.1, 1.05, 0.1, "#3a2c26", desk, x, 0.52, z, 0.02);
box(0.7, 0.05, 0.35, "#2a2e38", desk, 0.95, 1.17, -3.2);
box(0.1, 0.42, 0.1, "#2a2e38", desk, 0.95, 1.38, -3.3, 0.02);
box(1.82, 1.08, 0.08, "#191c24", desk, 0.95, 1.98, -3.34, 0.04);
const monitor = createMonitor({ reduce });
add(new THREE.Mesh(new THREE.PlaneGeometry(1.68, 0.96), new THREE.MeshBasicMaterial({ map: monitor.texture, toneMapped: false })), desk, 0.95, 1.98, -3.295, false);
box(1.0, 0.04, 0.34, "#e6dfd0", desk, 0.95, 1.17, -2.7, 0.015);
for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) box(0.06, 0.018, 0.06, "#b7ae9d", desk, 0.53 + i * 0.076, 1.2, -2.8 + j * 0.1, 0.006);
const mug = cyl(0.085, 0.075, 0.18, "#d9583f", desk, 2.1, 1.24, -2.75);
const handle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 16), mat("#d9583f")); add(handle, mug, 0.095, 0, 0);
box(0.42, 0.012, 0.58, "#faf6ec", desk, -0.25, 1.15, -2.82, 0.004).rotation.y = 0.18;

const lampGroup = new THREE.Group(); desk.add(lampGroup);
cyl(0.16, 0.19, 0.04, "#2a2e38", lampGroup, 2.32, 1.17, -3.3);
const arm = cyl(0.018, 0.018, 0.95, "#2a2e38", lampGroup, 2.32, 1.64, -3.3); arm.rotation.z = 0.12;
cyl(0.11, 0.26, 0.26, mat("#f0a64b"), lampGroup, 2.2, 2.14, -3.22);
const bulb = ball(0.08, new THREE.MeshBasicMaterial({ color: "#ffe2ad" }), lampGroup, 2.2, 2.03, -3.22); bulb.castShadow = false;
const lampLight = new THREE.SpotLight("#ffc27a", 24, 11, 1.08, 0.72, 1.7);
lampLight.position.set(2.2, 2.25, -3.1 - G);
lampLight.target.position.set(1.0, 0, -0.9 - G);
lampLight.castShadow = true;
lampLight.shadow.mapSize.set(1024, 1024);
lampLight.shadow.bias = -0.0006;
lampLight.shadow.radius = 5;
world.add(lampLight, lampLight.target);

// Chair.
cyl(0.33, 0.33, 0.1, "#39424f", desk, 0.95, 0.72, -1.72);
box(0.62, 0.72, 0.1, "#39424f", desk, 0.95, 1.14, -1.42, 0.05);
cyl(0.045, 0.045, 0.6, "#23262d", desk, 0.95, 0.38, -1.72);
for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; box(0.42, 0.04, 0.05, "#23262d", desk, 0.95 + Math.cos(a) * 0.2, 0.09, -1.72 + Math.sin(a) * 0.2, 0.015).rotation.y = -a; }

// Bookshelf: exactly one book per certification.
const shelf = station("certificates");
shelf.position.x = -G;
const wood = "#5d3c28";
box(0.06, 3.5, 2.5, wood, shelf, -3.86, 1.76, 1.3, 0.01);
for (const zz of [0.08, 2.52]) box(0.5, 3.5, 0.08, wood, shelf, -3.62, 1.76, zz, 0.012);
for (const yy of [0.05, 1.18, 2.3, 3.47]) box(0.5, 0.07, 2.5, wood, shelf, -3.62, yy, 1.3, 0.012);
const books = [];
const bookColors = ["#2a9d8f", "#e9c46a", "#d9583f", "#f6efe2", "#3d5a80", "#e07a5f", "#81b29a", "#c8a2c8"];
let z = 0.28;
bookColors.forEach((c, i) => {
  const h = 0.56 + ((i * 7) % 5) * 0.055, t = 0.13 + (i % 3) * 0.035;
  const row = i < 5 ? 1.665 : 0.535;
  if (i === 5) z = 0.32;
  books.push(box(0.36, h, t, c, shelf, -3.56, row - 0.45 + h / 2, z, 0.012));
  z += t + 0.03;
});
const openBook = createOpenBook(shelf, books, Object.fromEntries(PROJECTS.map((p) => [p.id, p.title])), reduce);
box(0.34, 0.1, 0.46, "#3d5a80", shelf, -3.56, 2.39, 0.75, 0.015);
ball(0.13, "#e9c46a", shelf, -3.56, 2.57, 0.75);
cyl(0.11, 0.09, 0.2, "#e8dcc6", shelf, -3.56, 2.44, 1.85);
for (let i = 0; i < 6; i++) { const leaf = ball(0.07, "#3f8f6b", shelf, -3.56 + Math.cos(i) * 0.1, 2.6 + (i % 2) * 0.05, 1.85 + Math.sin(i) * 0.12); leaf.scale.y = 1.4; }
box(0.32, 0.46, 0.65, "#e7dfd0", shelf, -3.58, 0.32, 1.92, 0.02);

// Pinboard: one note per job. Opening a job lifts its note.
const noteParts = [];
const NOTES = [["Techwaukee", "2026"], ["VOIS", "2025"], ["CodeClause", "2025"], ["Rius Tech", "2023"]];
const board = station("experience");
box(0.05, 1.5, 2.15, "#a97d55", board, 0, 0, 0, 0.02);
board.position.set(-1.45, 2.95, -3.88 - G); board.rotation.y = -Math.PI / 2;
[["#f4d35e", 0.5, 0.36, -0.08], ["#f6efe2", -0.42, 0.33, 0.06], ["#ee9b7f", 0.5, -0.32, 0.07], ["#9fd8cb", -0.42, -0.34, -0.06]].forEach(([c, zz, y, rot]) => {
  const note = box(0.02, 0.5, 0.58, c, board, 0.04, y, zz, 0.005); note.rotation.x = rot;
  ball(0.03, "#c8553d", board, 0.07, y + 0.2, zz);
  const [co, yr] = NOTES.shift();
  const nc = document.createElement("canvas"); nc.width = 256; nc.height = 220;
  const draw = () => { const g = nc.getContext("2d"); g.clearRect(0, 0, 256, 220); g.fillStyle = "#1d2230"; g.textAlign = "center"; g.font = "700 34px Syne, sans-serif"; g.fillText(co, 128, 112); g.font = "26px DM Sans, sans-serif"; g.fillText(yr, 128, 154); tex.needsUpdate = true; };
  const tex = new THREE.CanvasTexture(nc); tex.colorSpace = THREE.SRGBColorSpace; draw(); document.fonts?.ready.then(draw);
  const plane = add(new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.48), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })), board, 0.054, y, zz, false);
  plane.rotation.y = Math.PI / 2; plane.rotation.z = rot;
  noteParts.push({ parts: [note, plane], z: 0 });
});

// Wall clock showing the visitor's real time.
const clock = new THREE.Group(); clock.position.set(-3.87 - G, 3.8, 0.0); clock.rotation.z = -Math.PI / 2; world.add(clock);
cyl(0.33, 0.33, 0.04, "#f6efe2", clock, 0, 0, 0, 40);
const hourHand = new THREE.Group(), minuteHand = new THREE.Group(); clock.add(hourHand, minuteHand); hourHand.position.y = minuteHand.position.y = 0.03;
add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.03), mat("#1d2230")), hourHand, 0.09, 0, 0, false);
add(new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.012, 0.02), mat("#d9583f")), minuteHand, 0.135, 0, 0, false);

// Server rack with blinking lights.
const rack = station("skills");
rack.position.z = -G;
box(1.15, 3.0, 1.0, "#1c1f27", rack, 3.25, 1.5, -3.25, 0.05);
const leds = [];
for (let u = 0; u < 7; u++) {
  box(0.95, 0.27, 0.03, "#2b303b", rack, 3.25, 0.42 + u * 0.38, -2.74, 0.012);
  for (let i = 0; i < 6; i++) {
    const m = new THREE.MeshBasicMaterial({ color: i % 3 === 2 ? "#ffb35c" : "#55e0a8", toneMapped: false });
    add(new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), m), rack, 2.88 + i * 0.07, 0.42 + u * 0.38, -2.715, false);
    leds.push({ m, u, on: m.color.clone(), phase: (u * 13 + i * 7) % 11, speed: 1.2 + ((u + i) % 4) });
  }
  box(0.28, 0.1, 0.02, "#11141a", rack, 3.5, 0.42 + u * 0.38, -2.72, 0.006);
}
for (let i = 0; i < 3; i++) { const cable = cyl(0.016, 0.016, 2.1, ["#d9583f", "#e9c46a", "#2a9d8f"][i], rack, 2.62 + i * 0.06, 1.06, -3.55); cable.rotation.z = 0.02; }

// Plant.
const plant = new THREE.Group(); plant.position.set(-3.1 - G, 0, -3.15 - G); world.add(plant);
cyl(0.34, 0.24, 0.5, "#d9cdb8", plant, 0, 0.25, 0);
const leaves = [];
for (let i = 0; i < 9; i++) {
  const pivot = new THREE.Group(); pivot.position.y = 0.5; pivot.rotation.y = i * 2.4; plant.add(pivot);
  const leaf = ball(0.2, mat(i % 2 ? "#2f7a5b" : "#3f9a72"), pivot, 0, 0.5 + (i % 3) * 0.2, 0.26);
  leaf.scale.set(0.55, 1.6, 0.12); leaf.rotation.x = 0.6;
  leaves.push({ pivot, phase: i });
}

// Air cooler at the front end of the bookshelf, turned to blow at Nithin on the sofa. Click it to switch it off and on.
const air = { uTime: { value: 0 }, uOn: { value: 1 }, on: true };
const cooler = new THREE.Group(); cooler.userData.station = "cooler"; world.add(cooler);
const coolerPos = new THREE.Vector3(-5.5, 0, 3.15);
const breezeTarget = new THREE.Vector3(-1.35, 0.9, 1.05); // Nithin's head on the pillow.
cooler.position.copy(coolerPos);
cooler.rotation.y = Math.atan2(breezeTarget.x - coolerPos.x, breezeTarget.z - coolerPos.z);
{
  const shell = mat("#f3efe6", { roughness: 0.5 }), trim = mat("#3d5a80", { roughness: 0.55 });
  box(0.64, 1.12, 0.5, shell, cooler, 0, 0.66, 0, 0.07);
  box(0.66, 0.1, 0.52, trim, cooler, 0, 1.24, 0, 0.04);
  box(0.66, 0.08, 0.52, trim, cooler, 0, 0.12, 0, 0.03);
  for (const [x, z] of [[-0.24, -0.18], [0.24, -0.18], [-0.24, 0.18], [0.24, 0.18]]) cyl(0.04, 0.04, 0.06, "#23262d", cooler, x, 0.04, z, 12);
  // Cooling pads on both sides.
  const padCanvas = document.createElement("canvas"); padCanvas.width = padCanvas.height = 128;
  { const c = padCanvas.getContext("2d"); c.fillStyle = "#c9a35e"; c.fillRect(0, 0, 128, 128); c.strokeStyle = "#9c7a3f"; c.lineWidth = 3; for (let i = -128; i < 256; i += 16) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 128, 128); c.stroke(); c.beginPath(); c.moveTo(i + 128, 0); c.lineTo(i, 128); c.stroke(); } }
  const padTex = new THREE.CanvasTexture(padCanvas); padTex.colorSpace = THREE.SRGBColorSpace; padTex.wrapS = padTex.wrapT = THREE.RepeatWrapping; padTex.repeat.set(2, 3);
  for (const x of [-0.325, 0.325]) add(new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.62), new THREE.MeshStandardMaterial({ map: padTex, roughness: 0.95 })), cooler, x, 0.72, 0, false).rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
  // Front grille, with horizontal louvres and vanes that swing side to side.
  box(0.5, 0.46, 0.03, "#2a2e38", cooler, 0, 0.94, 0.245, 0.02);
  for (let i = 0; i < 5; i++) { const slat = box(0.46, 0.022, 0.07, "#e3ddd0", cooler, 0, 0.77 + i * 0.085, 0.27, 0.008); slat.rotation.x = 0.35; }
  air.vanes = [];
  for (let i = 0; i < 6; i++) { const vane = box(0.012, 0.4, 0.06, "#b9b2a4", cooler, -0.2 + i * 0.08, 0.94, 0.26, 0.004); air.vanes.push(vane); }
  // Water tank window and the control strip.
  box(0.32, 0.16, 0.012, "#cfe9f4", cooler, 0, 0.36, 0.252, 0.01);
  box(0.3, 0.07, 0.014, "#5bb6dd", cooler, 0, 0.32, 0.255, 0.008);
  for (let i = 0; i < 3; i++) cyl(0.022, 0.022, 0.02, "#f3efe6", cooler, -0.12 + i * 0.07, 1.3, 0.12, 12);
  air.led = new THREE.MeshBasicMaterial({ color: "#55e0a8", toneMapped: false });
  add(new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), air.led), cooler, 0.18, 1.3, 0.12, false);
  // Ribbons tied to the grille show the breeze, like on a real cooler.
  air.ribbons = ["#d9583f", "#e9c46a", "#2a9d8f"].map((color, i) => {
    const geo = new THREE.PlaneGeometry(0.035, 0.34, 1, 12);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, roughness: 0.8 }));
    mesh.position.set(-0.14 + i * 0.14, 0.98, 0.27); cooler.add(mesh);
    return { geo, base: geo.attributes.position.array.slice(), phase: i * 1.9 };
  });
  // An invisible box makes the whole cooler easy to click.
  add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.35, 0.6), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false })), cooler, 0, 0.67, 0, false);
}

// Visible streams of air, flowing from the grille to the sofa.
cooler.updateMatrixWorld(true);
const outlet = cooler.localToWorld(new THREE.Vector3(0, 0.94, 0.3));
const airVert = "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
const airFrag = `uniform float uTime; uniform float uOn; uniform float uSeed; varying vec2 vUv;
void main() {
  float f = fract(vUv.x * 1.6 - uTime * 0.45 + uSeed);
  float band = smoothstep(0.0, 0.3, f) * smoothstep(0.85, 0.45, f);
  float ends = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
  float a = band * ends * 0.6 * uOn;
  if (a < 0.01) discard;
  gl_FragColor = vec4(0.9, 0.97, 1.0, a);
}`;
air.streams = [];
for (let i = 0; i < 7; i++) {
  const k = i / 6 - 0.5;
  const side = new THREE.Vector3(-(breezeTarget.z - outlet.z), 0, breezeTarget.x - outlet.x).normalize();
  const start = outlet.clone().add(side.clone().multiplyScalar(k * 0.3)).add(new THREE.Vector3(0, (i % 3 - 1) * 0.1, 0));
  const end = breezeTarget.clone().add(side.clone().multiplyScalar(k * 1.6)).add(new THREE.Vector3(0.35 * k, 0.15 + (i % 2) * 0.2, 0));
  const pts = [];
  for (let j = 0; j <= 6; j++) {
    const u = j / 6;
    const p = start.clone().lerp(end, u);
    p.add(side.clone().multiplyScalar(Math.sin(u * Math.PI * 2 + i) * 0.12 * u));
    p.y += Math.sin(u * Math.PI) * 0.25 + Math.sin(u * 9 + i * 2) * 0.05;
    pts.push(p);
  }
  const material = new THREE.ShaderMaterial({ uniforms: { uTime: air.uTime, uOn: air.uOn, uSeed: { value: i * 0.37 } }, vertexShader: airVert, fragmentShader: airFrag, transparent: true, depthWrite: false });
  const stream = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.02 + (i % 2) * 0.008, 6), material);
  stream.raycast = () => {};
  world.add(stream);
  air.streams.push(stream);
}

// Curtains on the window, stirring in the draught.
cyl(0.025, 0.025, 3.4, "#3a2c26", world, -3.78 - G, 4.15, -1.95, 12).rotation.x = Math.PI / 2;
air.curtains = [[-3.25, 0.3], [-0.65, 0.38]].map(([zz, strength], i) => {
  const geo = new THREE.PlaneGeometry(0.75, 2.5, 12, 18);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: "#d98f6f", side: THREE.DoubleSide, roughness: 0.92 }));
  mesh.position.set(-3.74 - G, 2.9, zz); mesh.rotation.y = Math.PI / 2; mesh.castShadow = true; mesh.receiveShadow = true; mesh.raycast = () => {};
  world.add(mesh);
  return { geo, base: geo.attributes.position.array.slice(), strength, phase: i * 2.1 };
});

// Loose pages on the floor in the cooler's path, lifting at the edges.
const pageCanvas = document.createElement("canvas"); pageCanvas.width = 96; pageCanvas.height = 128;
{ const c = pageCanvas.getContext("2d"); c.fillStyle = "#faf6ec"; c.fillRect(0, 0, 96, 128); c.strokeStyle = "#b8c4d6"; c.lineWidth = 2; for (let y = 22; y < 124; y += 12) { c.beginPath(); c.moveTo(8, y); c.lineTo(88, y); c.stroke(); } c.strokeStyle = "#3d5a80"; for (let y = 20; y < 90; y += 12) { c.beginPath(); c.moveTo(10, y); c.lineTo(20 + ((y * 7) % 55), y); c.stroke(); } }
const pageTex = new THREE.CanvasTexture(pageCanvas); pageTex.colorSpace = THREE.SRGBColorSpace;
const lerp = THREE.MathUtils.lerp;
const windAngle = -Math.atan2(breezeTarget.z - coolerPos.z, breezeTarget.x - coolerPos.x);
const pathSide = new THREE.Vector3(-(breezeTarget.z - coolerPos.z), 0, breezeTarget.x - coolerPos.x).normalize();
air.pages = [[0.4, 0.2, 0.3], [0.55, -0.3, -0.5], [0.68, 0.15, 1.2]].map(([u, off, turn], i) => {
  const x = lerp(coolerPos.x, breezeTarget.x, u) + pathSide.x * off, z = lerp(coolerPos.z, breezeTarget.z, u) + pathSide.z * off;
  const geo = new THREE.PlaneGeometry(0.42, 0.3, 8, 4); geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: pageTex, side: THREE.DoubleSide, roughness: 0.9 }));
  mesh.position.set(x, 0.07 + i * 0.002, z); mesh.rotation.y = windAngle + turn * 0.3; mesh.receiveShadow = true; mesh.raycast = () => {};
  world.add(mesh);
  return { geo, base: geo.attributes.position.array.slice(), phase: i * 2.7 };
});

function updateBreeze(t, dt) {
  air.uOn.value += ((air.on ? 1 : 0) - air.uOn.value) * Math.min(1, dt * 2.5);
  air.uTime.value += dt * (0.25 + air.uOn.value * 0.75);
  const on = air.uOn.value, wt = air.uTime.value;
  air.vanes.forEach((v) => { v.rotation.y = Math.sin(t * 0.7) * 0.45 * on; });
  for (const r of air.ribbons) {
    const p = r.geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const bx = r.base[i * 3], u = (0.17 - r.base[i * 3 + 1]) / 0.34;
      // Hanging straight down when off; streaming out and fluttering when on.
      const lift = on * u * 0.3;
      p.setXYZ(i, bx + Math.sin(wt * 17 + u * 6 + r.phase) * 0.025 * u * on, 0.17 - u * 0.34 * (1 - on * 0.85) + Math.sin(wt * 13 + u * 8 + r.phase) * 0.03 * u * on, lift + u * 0.02);
    }
    p.needsUpdate = true;
  }
  for (const c of air.curtains) {
    const p = c.geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const bx = c.base[i * 3], by = c.base[i * 3 + 1], v = (1.25 - by) / 2.5;
      const pleat = Math.sin(bx * 22) * 0.035;
      const billow = v ** 1.6 * c.strength * on * (0.16 + Math.sin(wt * 2.2 + bx * 5 + v * 3 + c.phase) * 0.09 + Math.sin(wt * 5.3 + v * 7) * 0.025);
      p.setZ(i, pleat + billow);
    }
    p.needsUpdate = true; c.geo.computeVertexNormals();
  }
  for (const pg of air.pages) {
    const p = pg.geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = (0.21 - pg.base[i * 3]) / 0.42; // 1 at the edge facing the cooler.
      const flap = 0.035 + Math.sin(wt * 9 + pg.phase) * 0.03 + Math.sin(wt * 23 + pg.phase * 2 + pg.base[i * 3 + 2] * 10) * 0.012;
      p.setY(i, u ** 2.2 * flap * on);
    }
    p.needsUpdate = true; pg.geo.computeVertexNormals();
  }
  air.led.color.set(air.on ? "#55e0a8" : "#d9583f");
}

// TV on the left wall near the front, over a low unit. It plays a 3D clip of the 2011 final's winning six.
// Click it to zoom in.
const tv = new THREE.Group(); tv.userData.station = "tv"; world.add(tv);
tv.position.set(0.14 - HALF + 0.14, 0, 4.85); tv.rotation.y = Math.PI / 2;
const match = createMatch(renderer, { still: reduce });
{
  const unit = mat("#7a5236"), front = mat("#8d6342"), gold = mat("#e9c46a", { metalness: 0.6, roughness: 0.3 });
  box(2.0, 0.44, 0.42, unit, tv, 0, 0.27, 0.23, 0.03);
  for (const [x, z] of [[-0.9, 0.08], [0.9, 0.08], [-0.9, 0.38], [0.9, 0.38]]) cyl(0.03, 0.025, 0.06, "#2c2019", tv, x, 0.03, z, 10);
  for (const x of [-0.5, 0.5]) { box(0.94, 0.32, 0.02, front, tv, x, 0.27, 0.445, 0.01); box(0.16, 0.025, 0.025, "#d8c7a5", tv, x, 0.36, 0.46, 0.008); }
  box(1.0, 0.07, 0.1, "#2a2e38", tv, 0, 0.53, 0.3, 0.03);
  box(0.32, 0.06, 0.22, "#1d2028", tv, 0.68, 0.52, 0.22, 0.012);
  add(new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: "#55e0a8", toneMapped: false })), tv, 0.56, 0.53, 0.335, false);
  // A cricket ball and a little gold trophy on the unit.
  ball(0.04, "#c8553d", tv, -0.62, 0.53, 0.3);
  cyl(0.07, 0.09, 0.05, "#c9a04a", tv, -0.85, 0.515, 0.22, 16);
  cyl(0.025, 0.05, 0.16, gold, tv, -0.85, 0.62, 0.22, 16);
  ball(0.075, gold, tv, -0.85, 0.75, 0.22);
  // The wall-mounted screen.
  box(1.92, 1.12, 0.06, "#15171d", tv, 0, 1.75, 0.05, 0.03);
  add(new THREE.Mesh(new THREE.PlaneGeometry(1.84, 1.035), new THREE.MeshBasicMaterial({ map: match.texture, toneMapped: false })), tv, 0, 1.75, 0.082, false);
}

match.update(0);
let tvFrame = 0;

// A gallery wall of quote posters, taped up on the back wall between the plant and the pinboard.
const QUOTES = [
  ["Arise, awake, and stop not till the goal is reached.", "Swami Vivekananda", ["#2a9d8f", "#f6efe2", "#e9c46a"]],
  ["You have to dream before your dreams can come true.", "A.P.J. Abdul Kalam", ["#e9c46a", "#1d2230", "#d9583f"]],
  ["The only way to do great work is to love what you do.", "Steve Jobs", ["#f6efe2", "#1d2230", "#2b5a70"]],
  ["Life is like riding a bicycle. To keep your balance, you must keep moving.", "Albert Einstein", ["#d9583f", "#fff6e6", "#f4d35e"]],
  ["Talent wins games, but teamwork and intelligence win championships.", "Michael Jordan", ["#3d5a80", "#f6efe2", "#ee9b7f"]],
  ["Excellence is a continuous process and not an accident.", "A.P.J. Abdul Kalam", ["#81b29a", "#1d2230", "#f6efe2"]],
];
function drawPoster(cv, [quote, who, [bg, fg, accent]], i) {
  const c = cv.getContext("2d"), W = cv.width, H = cv.height;
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  c.fillStyle = accent; c.globalAlpha = 0.35;
  if (i % 3 === 0) { c.beginPath(); c.arc(W * 0.85, H * 0.88, 120, 0, 7); c.fill(); }
  else if (i % 3 === 1) { for (let k = 0; k < 5; k++) c.fillRect(0, H - 40 - k * 22, W, 8); }
  else { c.beginPath(); c.moveTo(W, 0); c.lineTo(W, 170); c.lineTo(W - 170, 0); c.fill(); }
  c.globalAlpha = 0.25; c.strokeStyle = fg; c.lineWidth = 3; c.strokeRect(18, 18, W - 36, H - 36); c.globalAlpha = 1;
  c.fillStyle = accent; c.font = "800 150px Syne, sans-serif"; c.fillText("“", 30, 150);
  // The largest size that keeps the quote inside the poster.
  let size = 50, lines = [];
  for (; size >= 24; size -= 2) {
    c.font = `700 ${size}px Syne, sans-serif`; lines = []; let line = "";
    for (const word of quote.split(" ")) { if (c.measureText(line + word).width > W - 84 && line) { lines.push(line.trim()); line = ""; } line += word + " "; }
    lines.push(line.trim());
    if (lines.length * size * 1.18 < H - 270) break;
  }
  c.fillStyle = fg;
  lines.forEach((l, k) => c.fillText(l, 42, 170 + k * size * 1.18));
  c.globalAlpha = 0.8; c.fillRect(42, H - 92, 34, 4); c.globalAlpha = 1;
  c.font = "500 24px 'DM Mono', monospace"; c.fillText(who, 42, H - 54);
}
const tapeMat = new THREE.MeshStandardMaterial({ color: "#f3e6c4", transparent: true, opacity: 0.85, roughness: 0.9 });
const posters = [];
QUOTES.forEach((q, i) => {
  const cv = document.createElement("canvas"); cv.width = 430; cv.height = 500;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const draw = () => { drawPoster(cv, q, i); tex.needsUpdate = true; };
  draw(); document.fonts?.ready.then(draw);
  const poster = new THREE.Group(); poster.userData.station = "poster"; poster.userData.index = i;
  poster.position.set(-5.15 + (i % 3) * 1.0, i < 3 ? 3.55 : 2.45, 0.3 - HALF + 0.01);
  poster.rotation.z = [0.025, -0.02, 0.015, -0.03, 0.02, -0.015][i];
  world.add(poster); posters.push({ g: poster, base: poster.position.clone(), tilt: poster.rotation.z, o: 0 });
  add(new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.95), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })), poster, 0, 0, 0, false);
  for (const sx of [-1, 1]) { const tape = add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.004), tapeMat), poster, sx * 0.38, 0.45, 0.004, false); tape.rotation.z = sx * -0.6; }
});

// Fish tank, journals, the SaaS blueprint, the home cinema, the Torn Pages poster, the phone and the guestbook.
const extras = buildExtras({ world, box, cyl, ball, add, mat, G, HALF });
const hobbies = buildHobbies({ world, box, cyl, add, mat, HALF });

// Guestbook notes come from the site's own API (a Cloudflare Pages Function). Without it, the board just starts empty.
let guestNotes = [];
fetch("/api/notes", { headers: { accept: "application/json" } })
  .then((r) => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : { notes: [] }))
  .then((d) => { guestNotes = Array.isArray(d.notes) ? d.notes : []; extras.setGuestNotes(guestNotes); })
  .catch(() => {});
async function submitNote(data) {
  let r;
  try { r = await fetch("/api/notes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }); }
  catch { throw new Error("Couldn’t reach the guestbook. Check your connection and try again."); }
  const body = r.headers.get("content-type")?.includes("json") ? await r.json() : {};
  if (!r.ok || !body.ok) throw new Error(body.error || "The guestbook isn’t taking notes right now. Try again later.");
}

// Robot.
const robot = station("guide");
robot.position.set(2.95, 0.06, 2.35);
const bot = new THREE.Group(); robot.add(bot);
const white = mat("#efe6d5", { roughness: 0.45 }), dark = mat("#232833", { roughness: 0.4 });
box(0.78, 0.82, 0.62, white, bot, 0, 0.9, 0, 0.2);
box(0.42, 0.26, 0.02, dark, bot, 0, 0.98, 0.315, 0.04);
const chest = new THREE.MeshBasicMaterial({ color: "#55e0a8", toneMapped: false });
add(new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), chest), bot, 0, 0.98, 0.33, false);
box(0.56, 0.1, 0.46, dark, bot, 0, 0.42, 0, 0.04);
for (const x of [-0.26, 0.26]) { cyl(0.11, 0.13, 0.3, white, bot, x, 0.21, 0); box(0.26, 0.11, 0.38, dark, bot, x, 0.06, 0.05, 0.04); }
const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-0.46, 1.16, 0); armR.position.set(0.46, 1.16, 0); bot.add(armL, armR);
for (const a of [armL, armR]) { cyl(0.06, 0.06, 0.48, white, a, 0, -0.24, 0); ball(0.09, dark, a, 0, -0.5, 0); ball(0.085, dark, a, 0, 0, 0); }
const head = new THREE.Group(); head.position.y = 1.56; bot.add(head);
box(0.76, 0.56, 0.6, white, head, 0, 0, 0, 0.2);
box(0.6, 0.32, 0.03, dark, head, 0, 0, 0.3, 0.1);
const eye = new THREE.MeshBasicMaterial({ color: "#7cf2c8", toneMapped: false });
const eyes = [-0.14, 0.14].map((x) => add(new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 12), eye), head, x, 0.01, 0.315, false));
cyl(0.012, 0.012, 0.2, dark, head, 0, 0.37, 0);
const tip = ball(0.04, new THREE.MeshBasicMaterial({ color: "#ffb35c", toneMapped: false }), head, 0, 0.5, 0);
tip.castShadow = false;

// Mailbox.
const mail = station("contact");
mail.position.set(3.6, 0, -0.4);
cyl(0.05, 0.06, 0.82, "#3a2c26", mail, 0, 0.41, 0);
box(0.36, 0.34, 0.68, "#3d5a80", mail, 0, 0.98, 0, 0.14);
const flag = new THREE.Group(); flag.position.set(0.2, 0.92, -0.05); mail.add(flag);
box(0.018, 0.34, 0.03, "#d9583f", flag, 0, 0.17, 0, 0.005);
box(0.018, 0.13, 0.17, "#d9583f", flag, 0, 0.3, 0.09, 0.005);
box(0.02, 0.06, 0.34, "#16202e", mail, 0, 1.0, 0.35, 0.01).rotation.y = Math.PI / 2;

// Nithin, asleep on the sofa with his back to us and one hand hanging down.
const sofa = station("about");
sofa.position.set(-0.4, 0, 1.0);
const fabric = mat("#cdbfa6", { roughness: 0.95 }), fabricDark = mat("#ad9f87", { roughness: 0.95 });
box(3.0, 0.3, 1.0, fabricDark, sofa, 0, 0.27, 0, 0.06);
for (const x of [-0.66, 0.66]) box(1.3, 0.17, 0.84, fabric, sofa, x, 0.5, 0.07, 0.07);
box(2.98, 0.66, 0.26, fabric, sofa, 0, 0.74, -0.38, 0.1);
for (const x of [-1.42, 1.42]) box(0.26, 0.62, 1.0, fabricDark, sofa, x, 0.5, 0, 0.1);
for (const [x, z] of [[-1.35, -0.4], [1.35, -0.4], [-1.35, 0.42], [1.35, 0.42]]) cyl(0.04, 0.03, 0.12, "#2c2019", sofa, x, 0.06, z, 10);
const pillow = box(0.62, 0.17, 0.62, "#5f7f86", sofa, -1.0, 0.66, 0.06, 0.07);
pillow.rotation.z = 0.08;

// Medium-length hair that falls to the top of the neck, built around the head bone.
// Head-bone space is the model's standing pose in metres: +y up the skull, +z towards the face.
function makeHair() {
  const geo = new THREE.SphereGeometry(1, 72, 48);
  const p = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const around = Math.atan2(v.x, v.z); // 0 at the face, ±π at the back
    const front = (Math.cos(around) + 1) / 2;
    // Soft locks: shallow grooves running from the crown down.
    const lock = 1 + 0.035 * Math.sin(around * 15) * (1 - Math.max(v.y, 0) * 0.7);
    let x = v.x * 0.118 * lock, y = 0.118 + v.y * 0.122, z = 0.004 + v.z * 0.126 * lock;
    // Hairline: high on the forehead, over the tops of the ears, down to the nape at the back.
    const line = -0.03 + 0.2 * Math.pow(front, 1.6);
    if (y < line) {
      y = line;
      // At the back and sides, the ends flick out a little instead of hugging the neck.
      const flick = 1 + 0.12 * (1 - front);
      x *= flick; z = 0.004 + (z - 0.004) * flick;
    }
    // A side-swept fringe over the forehead.
    if (front > 0.8 && y > 0.12) { z += 0.012 * front; y += 0.006 * Math.sin(v.x * 9); }
    p.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  // Strands drawn along the texture's vertical axis, which runs crown to tips.
  const c = document.createElement("canvas"); c.width = 512; c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#2a1d17"; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 900; i++) {
    const x = (i * 197.3) % 512, shade = (i * 37) % 3;
    g.strokeStyle = ["#3d2a20", "#1d140f", "#4a3427"][shade]; g.globalAlpha = 0.55; g.lineWidth = 1 + (i % 3) * 0.6;
    g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 6, 90, x - 6, 170, x + 3, 256); g.stroke();
  }
  const map = new THREE.CanvasTexture(c); map.colorSpace = THREE.SRGBColorSpace; map.wrapS = THREE.RepeatWrapping;
  const material = new THREE.MeshStandardMaterial({ map, roughness: 0.72, metalness: 0, side: THREE.DoubleSide });
  // The ends move in the cooler's breeze.
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = air.uTime; shader.uniforms.uOn = air.uOn;
    shader.vertexShader = "uniform float uTime;\nuniform float uOn;\n" + shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
      float sway = (1.0 - smoothstep(0.02, 0.16, position.y)) * uOn;
      transformed.x += sin(uTime * 7.0 + position.z * 60.0) * 0.004 * sway;
      transformed.z += cos(uTime * 6.0 + position.x * 55.0) * 0.004 * sway;`);
  };
  const hair = new THREE.Mesh(geo, material);
  hair.castShadow = true; hair.raycast = () => {};
  return hair;
}

// Closed eyelids with a lash line, placed over each eye in head-bone space.
function makeEyelids(skin) {
  const lids = new THREE.Group();
  const lidMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.75 });
  const lashMat = new THREE.MeshBasicMaterial({ color: "#2a1d17" });
  for (const x of [-0.0305, 0.0305]) {
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.0205, 16, 10), lidMat);
    lid.position.set(x, 0.088, 0.093); lid.scale.set(1.05, 0.9, 0.62); lids.add(lid);
    const lash = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0014, 4, 14, Math.PI), lashMat);
    lash.position.set(x, 0.089, 0.1055); lash.rotation.z = Math.PI; lash.scale.set(1, 0.45, 1); lids.add(lash);
  }
  lids.traverse((o) => { o.raycast = () => {}; });
  return lids;
}

// A rigged human model, posed by aiming each limb bone in a direction in the room (+x towards his feet, +z towards the viewer).
const POSE = {
  at: [1.12, 0.79, 0.02], roll: 0.62,
  hang: [[0.14, -0.3, 0.95], [0.03, -1, 0.2], [0.02, -1, 0.1]],
  hangFingers: [[0.03, -1, -0.12], [0.02, -0.95, -0.35]],
  up: [[-0.3, -0.75, 0.15], [-0.3, 0, 0.95]], upHand: [-0.25, -0.15, 0.95],
  upFingers: [[-0.15, -0.55, 0.8], [-0.05, -0.9, 0.4]],
  legL: [[1, -0.06, 0.05], [1, -0.02, -0.06]], legR: [[0.97, 0.06, -0.22], [0.96, -0.06, 0.26]],
};

const HOODIE = "#2a303d";
const sleeper = { pose: null, chest: null, chest2: null, arm: null, head: null, base: new Map() };
const scratch = { a: new THREE.Vector3(), b: new THREE.Vector3(), q: new THREE.Quaternion(), p: new THREE.Quaternion(), w: new THREE.Quaternion() };
function aimBone(bone, child, direction) {
  bone.updateWorldMatrix(true, false);
  child.updateWorldMatrix(true, false);
  bone.getWorldPosition(scratch.a);
  child.getWorldPosition(scratch.b);
  const current = scratch.b.sub(scratch.a).normalize();
  scratch.q.setFromUnitVectors(current, new THREE.Vector3(...direction).normalize());
  bone.getWorldQuaternion(scratch.w);
  bone.parent.getWorldQuaternion(scratch.p);
  bone.quaternion.copy(scratch.p.invert().multiply(scratch.q).multiply(scratch.w));
  bone.updateWorldMatrix(false, true);
}
new GLTFLoader().load("/models/sleeper.glb", (gltf) => {
  const person = gltf.scene;
  const bones = {};
  person.traverse((o) => {
    if (o.isBone) bones[o.name] = o;
    if (o.isMesh) {
      o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; o.raycast = () => {};
      // Re-dress the model: a dark hoodie, jeans and white sneakers, in plain fabric without the jacket's detail maps.
      const outfit = { Wolf3D_Outfit_Top: HOODIE, Wolf3D_Outfit_Bottom: "#2f4a72", Wolf3D_Outfit_Footwear: "#e6e1d6" }[o.material.name];
      if (outfit) { Object.assign(o.material, { map: null, normalMap: null, roughnessMap: null, metalnessMap: null, roughness: 0.95, metalness: 0 }); o.material.color.set(outfit); o.material.needsUpdate = true; }
      // The model's top is a long coat. Tuck its tails in at the waist and flatten the lapels and bow tie, so it reads as a hoodie.
      // Positions here are in the model's standing pose, in metres.
      if (o.material.name === "Wolf3D_Outfit_Top") {
        o.material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
            if (position.y < 0.97) transformed.y = 0.97 + (position.y - 0.97) * 0.05;
            if (position.y > 1.0 && position.y < 1.6 && abs(position.x) < 0.17) transformed.z = min(transformed.z, position.y > 1.4 ? 0.055 : 0.125);`);
        };
      }
      // A warmer, slightly darker skin tone.
      if (o.material.name === "Wolf3D_Skin" || o.material.name === "Wolf3D_Body") { o.material.color.set("#cba892"); o.material.needsUpdate = true; }
      // The model's hair is fused with a hat, so it's hidden and replaced by makeHair() below.
      if (o.material.name === "Wolf3D_Headwear") o.visible = false;
      // The model has no blink shape, so its eyes are hidden behind closed lids (see makeEyelids()).
      if (o.name === "EyeLeft" || o.name === "EyeRight") o.visible = false;
      // The model's handlebar moustache reads as a costume when he's face up, so it's left off.
      if (o.material.name === "Wolf3D_Beard") o.visible = false;
    }
  });
  // Face down along the sofa with the head at the pillow, rolled a little so his back faces the room.
  // His left side faces the room, so his left arm is the one that slides off the sofa.
  const lying = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0));
  person.quaternion.setFromRotationMatrix(lying).premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), POSE.roll));
  person.scale.setScalar(1.17);
  person.position.set(...POSE.at);
  sofa.add(person);
  person.updateWorldMatrix(true, true);

  const chain = (names, dirs) => names.slice(0, -1).forEach((n, i) => aimBone(bones[n], bones[names[i + 1]], dirs[i]));
  // The arm nearest the room slides off the sofa and hangs to the floor.
  bones.LeftShoulder.rotation.x += 0.28;
  chain(["LeftArm", "LeftForeArm", "LeftHand", "LeftHandMiddle1"], POSE.hang);
  for (const finger of ["Index", "Middle", "Ring", "Pinky"]) chain([`LeftHand${finger}1`, `LeftHand${finger}2`, `LeftHand${finger}3`], POSE.hangFingers);
  // The other arm is bent and pushed under the pillow, the fingers just peeking out from under its front edge.
  chain(["RightArm", "RightForeArm", "RightHand", "RightHandMiddle1"], [...POSE.up, POSE.upHand]);
  for (const finger of ["Index", "Middle", "Ring", "Pinky"]) chain([`RightHand${finger}1`, `RightHand${finger}2`, `RightHand${finger}3`], POSE.upFingers);
  // One knee bent, the way people actually sleep.
  chain(["LeftUpLeg", "LeftLeg", "LeftFoot"], POSE.legL);
  chain(["RightUpLeg", "RightLeg", "RightFoot"], POSE.legR);
  // Head turned away towards the back of the sofa, resting on the pillow.
  bones.Neck.rotation.y += 0.2;
  bones.Head.rotation.y += 0.45;
  bones.Head.rotation.z += 0.12;
  bones.Head.add(makeHair(), makeEyelids("#8a5a44"));

  sleeper.chest = bones.Spine1; sleeper.chest2 = bones.Spine2; sleeper.arm = bones.LeftArm; sleeper.head = bones.Head;
  for (const b of [bones.Spine1, bones.Spine2, bones.LeftArm, bones.Head]) sleeper.base.set(b, b.quaternion.clone());
  sleeper.pose = person;
  const hand = bones.LeftHand.getWorldPosition(new THREE.Vector3()); sofa.worldToLocal(hand);
  // The phone rings on the floor just beside his hanging hand. Its camera stop looks down at it.
  const phone = extras.placePhone(sofa, hand.x + 0.2, hand.z + 0.1);
  const at = phone.getWorldPosition(new THREE.Vector3());
  STOPS.phone = { pos: [at.x + 1.1, 1.45, at.z + 1.5], look: [at.x, 0.12, at.z] };
}, undefined, (err) => console.error("Could not load the character", err));

// An invisible shape makes him easy to click, without testing every triangle of the model.
const sleeperHit = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.6, 0.8), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
sleeperHit.position.set(0, 0.95, 0.12);
sofa.add(sleeperHit);

// The laptop he left running on the floor, plus an all-nighter's worth of mugs.
box(0.54, 0.025, 0.36, "#2a2e38", sofa, 0.42, 0.075, 1.03, 0.01);
const lidPivot = new THREE.Group(); lidPivot.position.set(0.42, 0.09, 0.86); lidPivot.rotation.x = -0.3; sofa.add(lidPivot);
box(0.54, 0.34, 0.018, "#2a2e38", lidPivot, 0, 0.17, 0, 0.008);
const lapCanvas = document.createElement("canvas"); lapCanvas.width = 320; lapCanvas.height = 192;
const lapTex = new THREE.CanvasTexture(lapCanvas); lapTex.colorSpace = THREE.SRGBColorSpace;
let epoch = 412;
const drawLaptop = () => { const c = lapCanvas.getContext("2d"); c.fillStyle = "#0f1420"; c.fillRect(0, 0, 320, 192); c.fillStyle = "#55e0a8"; c.font = "22px Consolas, monospace"; c.fillText("training...", 20, 44); c.fillStyle = "#f6efe2"; c.fillText("epoch " + epoch + "/500", 20, 84); c.fillStyle = "#2b3345"; c.fillRect(20, 110, 280, 18); c.fillStyle = "#55e0a8"; c.fillRect(20, 110, 280 * (epoch / 500), 18); lapTex.needsUpdate = true; };
drawLaptop();
if (!reduce) setInterval(() => { epoch = epoch >= 499 ? 412 : epoch + 1; drawLaptop(); }, 1600);
add(new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), new THREE.MeshBasicMaterial({ map: lapTex, toneMapped: false })), lidPivot, 0, 0.17, 0.011, false);
cyl(0.075, 0.065, 0.16, "#e8dcc6", sofa, -1.55, 0.14, 1.05, 16);

// Floating Zs.
const zCanvas = document.createElement("canvas"); zCanvas.width = zCanvas.height = 96;
{ const c = zCanvas.getContext("2d"); c.fillStyle = "#fff6e6"; c.font = "800 78px Syne, sans-serif"; c.textAlign = "center"; c.fillText("Z", 48, 76); }
const zTex = new THREE.CanvasTexture(zCanvas); zTex.colorSpace = THREE.SRGBColorSpace;
const zs = [0, 1, 2].map((i) => { const m = new THREE.SpriteMaterial({ map: zTex, transparent: true, depthWrite: false }); const z = new THREE.Sprite(m); sofa.add(z); return { z, m, offset: i / 3 }; });

// Dust drifting through the morning light.
const dustCount = 240, dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) { dustPos[i * 3] = -5.6 + ((i * 97) % 1050) / 100; dustPos[i * 3 + 1] = 0.3 + ((i * 53) % 370) / 100; dustPos[i * 3 + 2] = -5.6 + ((i * 71) % 1050) / 100; }
const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: "#ffd9a3", size: 0.028, transparent: true, opacity: 0.55, depthWrite: false }));
world.add(dust);

// Lights: warm lamp indoors, cool moonlight from the window.
scene.add(new THREE.HemisphereLight("#fff1e4", "#5c4e45", 2.0));
const moon = new THREE.DirectionalLight("#ffeedd", 1.8); moon.position.set(5, 8, 7); scene.add(moon);
const fill = new THREE.PointLight("#ffb777", 9, 9, 1.8); fill.position.set(1.5, 3, 1.5); scene.add(fill);
const fill2 = new THREE.PointLight("#ffd6a8", 7, 8, 1.8); fill2.position.set(-3.6, 3.2, -2.4); scene.add(fill2);
const screenGlow = new THREE.PointLight("#6fe0c0", 3.2, 4, 2); screenGlow.position.set(0.95, 1.95, -2.75 - G); world.add(screenGlow);


// Navigation.
const order = SECTION_ORDER;
const menu = document.getElementById("menu");
const mkBtn = (key, text) => { const b = document.createElement("button"); b.textContent = text; b.dataset.key = key; b.addEventListener("click", () => go(key)); menu.append(b); return b; };
mkBtn("home", "Room");
order.forEach((k) => mkBtn(k, SECTIONS[k].label));
for (const k of ["publications", "future", "films", "guestbook"]) mkBtn(k, EXTRA_SECTIONS[k].label);
const ALL_STOPS = ["home", ...order, "publications", "future", "films", "guestbook"];
const tourBtn = document.createElement("button"); tourBtn.textContent = "Take the tour"; tourBtn.className = "tour-btn"; tourBtn.addEventListener("click", () => { go("home"); tour.start(); }); menu.append(tourBtn);
const simpleLink = document.createElement("a"); simpleLink.href = "/simple.html"; simpleLink.textContent = "Simple view"; simpleLink.className = "simple-link"; menu.append(simpleLink);

const camPos = new THREE.Vector3(...STOPS.home.pos).add(new THREE.Vector3(4, 3, 4));
const camLook = new THREE.Vector3(...STOPS.home.look);
const fromPos = new THREE.Vector3(), fromLook = new THREE.Vector3(), toPos = new THREE.Vector3(...STOPS.home.pos), toLook = new THREE.Vector3(...STOPS.home.look);
let moveT = 0, moveDur = reduce ? 0.001 : 2.2, current = "home";
fromPos.copy(camPos); fromLook.copy(camLook);
let spin = 0, spinTarget = 0, shift = 0;

const selected = { note: null, book: null, rack: null };
let journalIndex = null, posterIndex = null, pickIndex = null;
let flagUntil = 0, tour = null, pointing = null;
const cardHooks = {
  go: (key) => go(key),
  note: (i) => { selected.note = i; },
  book: (i) => { selected.book = i; },
  rack: (i) => { selected.rack = i; },
  project: (p) => { monitor.show(p); screenGlow.color.set(monitor.accent); },
  flag: () => { flagUntil = performance.now() + 2000; },
  journal: (i) => { journalIndex = i; },
};

// Where the robot stands for each stop. It walks around the sofa instead of through it.
const STANDS = { home: [2.95, 2.35], about: [-2.95, -0.75], projects: [2.05, -1.35 - G], experience: [-1.4, -2.45 - G], skills: [2.5, -1.75 - G], certificates: [-2.65 - G, -0.55], contact: [2.85, 0.35], tv: [-4.4, 6.0], publications: [-4.3, 2.45], future: [-1.3, -3.5], poster: [-1.6, -3.4], films: [-1.5, -4.6], heartbreak: [-4.5, 4.6], guestbook: [2.4, -2.8], scooter: [3.3, -2.6], phone: [0.9, 2.8] };
let robotPath = [];
function walkTo(key) {
  const [x, z] = STANDS[key] ?? STANDS.home;
  if (reduce) { robot.position.x = x; robot.position.z = z; return; }
  robotPath = [];
  const a = robot.position, sofaZ = 1.0;
  if ((a.z - sofaZ) * (z - sofaZ) < 0) {
    const cross = a.x + ((x - a.x) * (sofaZ - a.z)) / (z - a.z);
    if (cross > -2.3 && cross < 1.5) robotPath.push(a.x + x > -0.8 ? [1.75, sofaZ] : [-2.75, sofaZ]);
  }
  robotPath.push([x, z]);
}

function openPoster(i) {
  const p = posters[i].base;
  STOPS.poster = { pos: [p.x, p.y, p.z + 3.7], look: [p.x, p.y, p.z] };
  go("poster"); posterIndex = i;
}
function openJournal(i) { journalIndex = i; go("publications"); }
function go(key) {
  const viewOnly = key === "tv" || key === "poster";
  if (key !== "home" && !viewOnly && !SECTIONS[key] && !EXTRA_SECTIONS[key]) return;
  current = key;
  const stop = STOPS[key];
  fromPos.copy(camPos); fromLook.copy(camLook);
  toPos.set(...stop.pos); toLook.set(...stop.look);
  moveT = 0; moveDur = reduce ? 0.001 : 1.5;
  spinTarget = 0;
  document.body.classList.toggle("open", key !== "home" && !viewOnly);
  document.body.classList.toggle("watching", viewOnly);
  if (key !== "publications") journalIndex = null;
  else if (journalIndex === null) journalIndex = 0;
  if (key !== "poster") posterIndex = null;
  if (tour?.isActive()) tour.end();
  walkTo(key);
  selected.note = null; selected.book = null; selected.rack = null;
  monitor.show(null); screenGlow.color.set(monitor.accent);
  if (key !== "home" && !viewOnly) {
    const panel = document.getElementById("panel"), content = document.getElementById("content");
    panel.style.setProperty("--sec", (SECTIONS[key] ?? EXTRA_SECTIONS[key]).color);
    if (key === "publications") mountPublications(content, cardHooks, journalIndex);
    else if (key === "future") mountFuture(content, cardHooks);
    else if (key === "films") mountFilms(content);
    else if (key === "heartbreak") mountHeartbreak(content);
    else if (key === "phone") mountPhone(content, cardHooks);
    else if (key === "scooter") mountScooter(content);
    else if (key === "guestbook") mountGuestbook(content, { notes: guestNotes, submit: submitNote });
    else mountSection(key, content, cardHooks);
    panel.scrollTop = 0;
    requestAnimationFrame(() => { panel.scrollTop = 0; });
  }
  [...menu.children].filter((b) => b.dataset.key).forEach((b) => b.setAttribute("aria-current", String(b.dataset.key === key)));
  hideTip();
}
document.getElementById("close").addEventListener("click", () => go("home"));
addEventListener("keydown", (e) => {
  if (e.target.closest?.("input, textarea") && e.key !== "Escape") return;
  if (e.key === "Escape") { if (tour.isActive()) tour.end(); else go("home"); return; }
  if (tour.isActive()) return;
  const all = ALL_STOPS;
  if (e.key === "ArrowRight") go(all[(all.indexOf(current) + 1) % all.length]);
  if (e.key === "ArrowLeft") go(all[(all.indexOf(current) - 1 + all.length) % all.length]);
});

// Scroll steps through the room, unless the pointer is over the panel being read.
let wheelLock = 0;
addEventListener("wheel", (e) => {
  if (tour.isActive() || e.target.closest?.("#panel, #bubble") || Math.abs(e.deltaY) < 12) return;
  const now = performance.now();
  if (now < wheelLock) return;
  wheelLock = now + 1300;
  const all = ALL_STOPS;
  go(all[(all.indexOf(current) + (e.deltaY > 0 ? 1 : -1) + all.length) % all.length]);
}, { passive: true });

// Pointer: hover, click and drag.
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), pointer = { x: 0, y: 0 };
const tip_ = document.getElementById("tip");
let hovered = null, dragging = false, moved = 0, lastX = 0;
const hideTip = () => { tip_.style.opacity = 0; hovered = null; canvas.classList.remove("pointing"); };
function pick(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  for (const hit of ray.intersectObjects(world.children, true)) {
    if (hit.object.isPoints) continue;
    let o = hit.object;
    pickIndex = null;
    while (o && !o.userData.station) { if (o.userData.index !== undefined) pickIndex = o.userData.index; o = o.parent; }
    if (o?.userData.index !== undefined) pickIndex = o.userData.index;
    return o ? o.userData.station : null;
  }
  return null;
}
canvas.addEventListener("pointerdown", (e) => { dragging = true; moved = 0; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.classList.add("dragging"); });
canvas.addEventListener("pointermove", (e) => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = (e.clientY / innerHeight) * 2 - 1;
  if (dragging) {
    moved += Math.abs(e.clientX - lastX);
    if (current === "home") spinTarget = THREE.MathUtils.clamp(spinTarget + (e.clientX - lastX) * 0.004, -0.62, 0.62);
    lastX = e.clientX;
    hideTip();
    return;
  }
  if (e.pointerType === "touch" || tour.isActive()) return;
  const s = pick(e);
  hovered = s;
  canvas.classList.toggle("pointing", Boolean(s));
  if (s) { tip_.textContent = s === "guide" ? "The robot: take the tour again" : s === "poster" ? "Quote wall: click a poster to read it" : EXTRA_SECTIONS[s] ? EXTRA_SECTIONS[s].tip : s === "tv" ? "TV: watch the winning six" : s === "cooler" ? (air.on ? "Air cooler: click to switch it off" : "Air cooler: click to switch it on") : SECTIONS[s].tip; tip_.style.opacity = 1; tip_.style.transform = `translate(${Math.min(e.clientX + 16, innerWidth - 230)}px, ${e.clientY + 18}px)`; } else tip_.style.opacity = 0;
});
canvas.addEventListener("pointerleave", hideTip);
canvas.addEventListener("pointerup", (e) => {
  dragging = false; canvas.classList.remove("dragging");
  if (moved < 6) { const s = pick(e); if (s === "cooler") { air.on = !air.on; tip_.style.opacity = 0; } else if (s === "poster") { if (current === "poster" && posterIndex === pickIndex) go("home"); else openPoster(pickIndex); } else if (s === "publications") openJournal(pickIndex ?? 0); else if (s === "guide") { go("home"); tour.start(); } else go(s || "home"); }
});

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = camera.aspect < 0.8 ? 60 : 30;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize); resize();

const STOP_ANCHORS = {
  projects: new THREE.Vector3(0.95, 1.98, -3.3 - G), experience: new THREE.Vector3(-1.45, 2.95, -3.85 - G), skills: new THREE.Vector3(3.25, 1.7, -2.75 - G),
  certificates: new THREE.Vector3(-3.45 - G, 1.75, 1.3), contact: new THREE.Vector3(3.6, 1.0, -0.4), about: new THREE.Vector3(-1.2, 1.0, 1.15),
};
const projected = new THREE.Vector3();
const projectToScreen = (v) => {
  projected.copy(v).applyMatrix4(world.matrixWorld).project(camera);
  return { x: (projected.x * 0.5 + 0.5) * innerWidth, y: (-projected.y * 0.5 + 0.5) * innerHeight };
};
tour = createTour({ anchors: STOP_ANCHORS, project: projectToScreen, setPointing: (p, key) => { pointing = p; walkTo(key); } });
const groups = [desk, shelf, board, rack, sofa, mail];
const baseY = new Map(groups.map((g) => [g, g.position.y]));
const clockNow = () => { const d = new Date(); return [(d.getHours() % 12 + d.getMinutes() / 60) / 12, d.getMinutes() / 60]; };
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const timer = new THREE.Clock();
const sleepNudge = new THREE.Quaternion(), sleepEuler = new THREE.Euler();
const look = new THREE.Vector3();

function render() {
  monitor.update();
  const dt = Math.min(timer.getDelta(), 0.05), t = timer.elapsedTime;
  if (moveT < 1) {
    moveT = Math.min(1, moveT + dt / moveDur);
    const k = ease(moveT);
    camPos.lerpVectors(fromPos, toPos, k); camLook.lerpVectors(fromLook, toLook, k);
  }
  const wide = innerWidth > 800;
  const shiftTarget = current === "home" || current === "tv" || current === "poster" ? 0 : wide ? Math.min(470, innerWidth * 0.34) / 2 : innerHeight * 0.3;
  shift += (shiftTarget - shift) * (reduce ? 1 : 0.08);
  camera.setViewOffset(innerWidth, innerHeight, wide ? shift : 0, wide ? 0 : shift, innerWidth, innerHeight);
  spin += (spinTarget - spin) * 0.09;
  world.rotation.y = spin;
  const sway = current === "home" && !reduce ? 1 : 0.15;
  camera.position.set(camPos.x + pointer.x * 0.35 * sway, camPos.y - pointer.y * 0.2 * sway, camPos.z - pointer.x * 0.35 * sway);
  look.copy(camLook);
  camera.lookAt(look);

  const [h, m] = clockNow();
  hourHand.rotation.y = -h * Math.PI * 2 + Math.PI / 2; minuteHand.rotation.y = -m * Math.PI * 2 + Math.PI / 2;

  if (!reduce) {
    // Walking.
    const walking = robotPath.length > 0;
    let heading = pointing && pointing !== "wave" ? Math.atan2(pointing.x - robot.position.x, pointing.z - robot.position.z) : 0.72;
    if (walking) {
      const dx = robotPath[0][0] - robot.position.x, dz = robotPath[0][1] - robot.position.z, dist = Math.hypot(dx, dz), step = dt * 2.3;
      heading = Math.atan2(dx, dz);
      if (dist <= step) { robot.position.x = robotPath[0][0]; robot.position.z = robotPath[0][1]; robotPath.shift(); }
      else { robot.position.x += (dx / dist) * step; robot.position.z += (dz / dist) * step; }
    }
    let turn = heading - robot.rotation.y;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    robot.rotation.y += turn * 0.1;
    bot.position.y = walking ? Math.abs(Math.sin(t * 11)) * 0.06 : Math.sin(t * 1.8) * 0.025;
    bot.rotation.z = walking ? Math.sin(t * 11) * 0.075 : bot.rotation.z * 0.85;
    armL.rotation.x = walking ? Math.sin(t * 11) * 0.5 : Math.sin(t * 1.8) * 0.08;
    const waving = hovered === "guide" || pointing === "wave";
    const aiming = !walking && pointing && pointing !== "wave";
    armR.rotation.x = walking ? -Math.sin(t * 11) * 0.5 : waving ? -2.5 + Math.sin(t * 9) * 0.3 : aiming ? -1.85 + Math.sin(t * 5) * 0.06 : -Math.sin(t * 1.8) * 0.08;
    armR.rotation.z = waving && !walking ? 0.3 : 0;
    // The robot watches the cursor when it's idle, and blinks now and then.
    head.rotation.y += ((walking || aiming ? 0 : pointer.x * 0.7) - head.rotation.y) * 0.07;
    head.rotation.x += ((pointer.y * 0.25) - head.rotation.x) * 0.07;

    updateBreeze(t, dt);
    if ((tvFrame = (tvFrame + 1) % 3) === 0) match.update(t);

    // Nithin breathes, snores and dangles.
    if (sleeper.pose) {
      const breath = Math.sin(t * 1.15);
      const nudge = (bone, x, y, z) => { bone.quaternion.copy(sleeper.base.get(bone)).multiply(sleepNudge.setFromEuler(sleepEuler.set(x, y, z))); };
      nudge(sleeper.chest, breath * 0.012, 0, 0);
      nudge(sleeper.chest2, breath * 0.02, 0, 0);
      const swing = hovered === "about" ? 0.11 : 0.035;
      nudge(sleeper.arm, Math.sin(t * 0.75) * swing, 0, Math.sin(t * 0.55) * swing * 0.5);
      nudge(sleeper.head, breath * 0.006, 0, 0);
    }
    zs.forEach((item) => {
      const p = ((t * 0.17) + item.offset) % 1;
      item.z.position.set(-1.1 + p * 0.35 + Math.sin(p * 7) * 0.05, 1.18 + p * 1.0, 0.2);
      const size = 0.1 + p * 0.2;
      item.z.scale.set(size, size, 1);
      item.m.opacity = Math.sin(p * Math.PI) * 0.95;
    });
    fairy.forEach((b) => { const v = 0.72 + Math.sin(t * 1.4 + b.phase) * 0.28; b.m.color.setRGB(1 * v, 0.85 * v, 0.58 * v); });
    const blink = t % 4.2 < 0.12 ? 0.1 : 1;
    eyes.forEach((e) => { e.scale.y = blink; });
    chest.color.setHSL(0.43, 0.7, 0.55 + Math.sin(t * 3) * 0.12);
    flag.rotation.x = hovered === "contact" || performance.now() < flagUntil || pointing === STOP_ANCHORS.contact ? Math.sin(t * 9) * 0.5 : 0;
    leds.forEach((l) => { const active = selected.rack === null || selected.rack === l.u; const on = selected.rack === l.u || Math.sin(t * l.speed + l.phase * 2.3) > -0.25; l.m.color.copy(l.on).multiplyScalar(active && on ? 1 : 0.1); });
    leaves.forEach((l) => { l.pivot.rotation.x = Math.sin(t * 0.9 + l.phase) * 0.035; });
    const p = dust.geometry.attributes.position;
    for (let i = 0; i < dustCount; i++) { let y = p.getY(i) + dt * 0.035; if (y > 4) y = 0.2; p.setY(i, y); p.setX(i, p.getX(i) + Math.sin(t * 0.3 + i) * 0.0009); }
    p.needsUpdate = true;
    lampLight.intensity = 24 + Math.sin(t * 13) * Math.sin(t * 2.1) * 0.8;
    screenGlow.intensity = 3 + Math.sin(t * 2) * 0.4;
    noteParts.forEach((n, i) => {
      const k = selected.note === i ? 1 : 0;
      n.z += (k - n.z) * 0.14;
      n.parts.forEach((p) => { p.scale.setScalar(1 + n.z * 0.14); });
      n.parts[0].position.x = 0.04 + n.z * 0.06; n.parts[1].position.x = 0.054 + n.z * 0.075;
    });
    groups.forEach((g) => {
      const lift = hovered === g.userData.station ? 0.05 : 0;
      g.position.y += (baseY.get(g) + lift - g.position.y) * 0.14;
    });
  }
  extras.update(t, dt, { current, journalIndex, reduce });
  hobbies.update(t, reduce, current);
  posters.forEach((p, i) => {
    const want = current === "poster" && posterIndex === i ? 1 : 0;
    p.o += reduce ? want - p.o : (want - p.o) * Math.min(1, dt * 5);
    p.g.position.z = p.base.z + p.o * 0.45 + (hovered === "poster" && pickIndex === i && current !== "poster" ? 0.04 : 0);
    p.g.scale.setScalar(1 + p.o * 0.25);
    p.g.rotation.z = p.tilt * (1 - p.o);
  });
  openBook.update(selected.book);
  if (reduce) { zs.forEach((item, i) => { item.z.position.set(-1.05 + i * 0.12, 1.3 + i * 0.28, 0.2); const size = 0.12 + i * 0.07; item.z.scale.set(size, size, 1); item.m.opacity = 0.9; }); robot.rotation.y = 0.72; }
  if ((shadowFrame = (shadowFrame + 1) % 2) === 0) renderer.shadowMap.needsUpdate = true;
  renderer.render(scene, camera);
  tour.place();
  adaptResolution(dt);
}

// If frames take too long, lower the resolution a step at a time; raise it again when there's headroom.
let shadowFrame = 0, perfTime = 0, perfFrames = 0;
function adaptResolution(dt) {
  perfTime += Math.min(dt, 0.25); perfFrames++;
  if (perfTime < 2) return;
  const fps = perfFrames / perfTime, ratio = renderer.getPixelRatio();
  perfTime = 0; perfFrames = 0;
  const next = fps < 42 ? Math.max(0.75, ratio - 0.25) : fps > 58 ? Math.min(maxRatio, ratio + 0.25) : ratio;
  if (next !== ratio) renderer.setPixelRatio(next);
}
// Small props (pebbles, popcorn, LEDs, fish) cast shadows too tiny to see, so leave them out of the shadow pass.
world.traverse((o) => {
  if (!o.isMesh || !o.castShadow) return;
  o.geometry.computeBoundingSphere();
  if (o.geometry.boundingSphere.radius * o.getWorldScale(new THREE.Vector3()).x < 0.07) o.castShadow = false;
});
renderer.setAnimationLoop(render);
render();
const loader = document.getElementById("loader");
requestAnimationFrame(() => { loader.style.opacity = 0; setTimeout(() => loader.remove(), 700); });
[...menu.children][0].setAttribute("aria-current", "true");
if (!hasSeenTour()) setTimeout(() => { if (current === "home") tour.start(); }, reduce ? 300 : 2300);
if (import.meta.env.DEV) window.__room = { go, renderer, tour, air, match, scene, extras, peek: (pos, look) => { fromPos.copy(camPos); fromLook.copy(camLook); toPos.set(...pos); toLook.set(...look); moveT = 0; moveDur = 0.6; } };
