import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PROJECTS, SECTIONS, SECTION_ORDER, mountSection } from "./content.js";
import { createOpenBook } from "./openbook.js";
import { createTour, hasSeenTour } from "./tour.js";
import { createMonitor } from "./monitor.js";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-mono/400.css";
import "./styles.css";

// Text drawn onto 3D objects only uses these fonts, so ask for them explicitly.
for (const font of ["800 62px Syne", "700 34px Syne", "26px \"DM Sans\"", "22px \"DM Mono\""]) document.fonts?.load(font);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Camera position and look-at point for each stop. The picture shifts aside so the object clears the panel.
const STOPS = {
  home: { pos: [12.6, 9, 12.6], look: [-1.3, 1.0, -0.2] },
  about: { pos: [1.5, 2.5, 6.0], look: [-0.55, 0.62, 1.25] },
  projects: { pos: [0.95, 3.2, 3.4], look: [0.95, 1.6, -3.2] },
  experience: { pos: [-1.45, 3.2, 2.9], look: [-1.45, 2.95, -3.8] },
  skills: { pos: [1.3, 3.2, 3.7], look: [3.25, 1.55, -2.8] },
  certificates: { pos: [3.1, 3.2, 3.9], look: [-3.5, 1.7, 1.2] },
  contact: { pos: [7.6, 2.5, 2.6], look: [3.6, 0.85, -0.4] },
};

if (innerWidth < 800) STOPS.home.look = [0.4, 0.4, 0.4];

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
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color("#1d1828");
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
const box = (w, h, d, color, parent, x, y, z, r = 0.035) => add(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.01, h / 2.01, d / 2.01)), color.isMaterial ? color : mat(color)), parent, x, y, z);
const cyl = (rt, rb, h, color, parent, x, y, z, seg = 28) => add(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), color.isMaterial ? color : mat(color)), parent, x, y, z);
const ball = (r, color, parent, x, y, z) => add(new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), color.isMaterial ? color : mat(color)), parent, x, y, z);
const station = (name) => { const g = new THREE.Group(); g.userData.station = name; world.add(g); return g; };

// Shell of the room.
box(8.4, 0.3, 8.4, "#5f4634", world, 0, -0.15, 0, 0.06);
box(0.28, 5, 8.4, "#2b5a70", world, -4.06, 2.5, 0, 0.05);
box(8.4, 5, 0.28, "#30667c", world, 0, 2.5, -4.06, 0.05);
for (let i = 0; i < 8; i++) box(1, 0.02, 8.3, i % 2 ? "#6e533e" : "#634936", world, -3.5 + i, 0.01, 0, 0.005);
box(8.4, 0.14, 0.08, "#e8dcc6", world, 0, 0.1, -3.9, 0.02);
box(0.08, 0.14, 8.4, "#e8dcc6", world, -3.9, 0.1, 0, 0.02);
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
box(0.1, 2.2, 2.0, "#e8dcc6", world, -3.9, 2.9, -1.95, 0.02);
add(new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.0), new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false })), world, -3.84, 2.9, -1.95, false).rotation.y = Math.PI / 2;

// Sunlight falling through the window, as window-shaped patches on the floor.
const sunMat = new THREE.MeshBasicMaterial({ color: "#ffcf91", transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
for (const [x, z] of [[-2.95, -2.45], [-2.95, -1.5], [-1.95, -2.45], [-1.95, -1.5]]) {
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
for (let i = 0; i < 16; i++) addBulb(-3.75 + i * 0.5, -3.84, i);
for (let i = 0; i < 16; i++) addBulb(-3.84, -3.3 + i * 0.5, i + 16);
box(0.08, 2.0, 0.05, "#e8dcc6", world, -3.82, 2.9, -1.95, 0.01);
box(0.08, 0.05, 1.8, "#e8dcc6", world, -3.82, 2.9, -1.95, 0.01);

// Desk, monitor and lamp.
const desk = station("projects");
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
lampLight.position.set(2.2, 2.25, -3.1);
lampLight.target.position.set(1.0, 0, -0.9);
lampLight.castShadow = true;
lampLight.shadow.mapSize.set(2048, 2048);
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
board.position.set(-1.45, 2.95, -3.88); board.rotation.y = -Math.PI / 2;
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
const clock = new THREE.Group(); clock.position.set(-3.87, 3.8, 0.0); clock.rotation.z = -Math.PI / 2; world.add(clock);
cyl(0.33, 0.33, 0.04, "#f6efe2", clock, 0, 0, 0, 40);
const hourHand = new THREE.Group(), minuteHand = new THREE.Group(); clock.add(hourHand, minuteHand); hourHand.position.y = minuteHand.position.y = 0.03;
add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.03), mat("#1d2230")), hourHand, 0.09, 0, 0, false);
add(new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.012, 0.02), mat("#d9583f")), minuteHand, 0.135, 0, 0, false);

// Server rack with blinking lights.
const rack = station("skills");
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
const plant = new THREE.Group(); plant.position.set(-3.1, 0, -3.15); world.add(plant);
cyl(0.34, 0.24, 0.5, "#d9cdb8", plant, 0, 0.25, 0);
const leaves = [];
for (let i = 0; i < 9; i++) {
  const pivot = new THREE.Group(); pivot.position.y = 0.5; pivot.rotation.y = i * 2.4; plant.add(pivot);
  const leaf = ball(0.2, mat(i % 2 ? "#2f7a5b" : "#3f9a72"), pivot, 0, 0.5 + (i % 3) * 0.2, 0.26);
  leaf.scale.set(0.55, 1.6, 0.12); leaf.rotation.x = 0.6;
  leaves.push({ pivot, phase: i });
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

// A rigged human model, posed by aiming each limb bone in a direction in the room.
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
      // Re-dress the model: plain fabric colours instead of its tan outfit, which read as bare skin.
      const outfit = { Wolf3D_Outfit_Top: "#2f3644", Wolf3D_Outfit_Bottom: "#2f4a72", Wolf3D_Outfit_Footwear: "#e6e1d6" }[o.material.name];
      if (outfit) { o.material.map = null; o.material.color.set(outfit); o.material.roughness = 0.9; o.material.metalness = 0; o.material.needsUpdate = true; }
    }
  });
  // Face down along the sofa with the head at the pillow, rolled a little so his back faces the room.
  const lying = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, -1, 0));
  person.quaternion.setFromRotationMatrix(lying).premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.62));
  person.scale.setScalar(1.17);
  person.position.set(1.12, 0.79, 0.02);
  sofa.add(person);
  person.updateWorldMatrix(true, true);

  const chain = (names, dirs) => names.slice(0, -1).forEach((n, i) => aimBone(bones[n], bones[names[i + 1]], dirs[i]));
  // The arm nearest the room slides off the sofa and hangs down.
  bones.LeftShoulder.rotation.x += 0.28;
  chain(["LeftArm", "LeftForeArm", "LeftHand", "LeftHandMiddle1"], [[0.14, -0.3, 0.95], [0.03, -1, 0.2], [0.02, -1, 0.1]]);
  for (const finger of ["Index", "Middle", "Ring", "Pinky"]) chain([`LeftHand${finger}1`, `LeftHand${finger}2`, `LeftHand${finger}3`], [[0.03, -1, -0.12], [0.02, -0.95, -0.35]]);
  // The other arm is tucked up under the pillow.
  chain(["RightArm", "RightForeArm", "RightHand"], [[-0.55, 0.05, -0.8], [-0.75, -0.08, 0.62]]);
  // One knee bent, the way people actually sleep.
  chain(["LeftUpLeg", "LeftLeg", "LeftFoot"], [[1, -0.06, 0.05], [1, -0.02, -0.06]]);
  chain(["RightUpLeg", "RightLeg", "RightFoot"], [[0.97, 0.06, -0.22], [0.96, -0.06, 0.26]]);
  // Head turned away towards the back of the sofa, resting on the pillow.
  bones.Neck.rotation.y += 0.2;
  bones.Head.rotation.y += 0.45;
  bones.Head.rotation.z += 0.12;

  sleeper.chest = bones.Spine1; sleeper.chest2 = bones.Spine2; sleeper.arm = bones.LeftArm; sleeper.head = bones.Head;
  for (const b of [bones.Spine1, bones.Spine2, bones.LeftArm, bones.Head]) sleeper.base.set(b, b.quaternion.clone());
  sleeper.pose = person;
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
for (const [x, z, c] of [[-1.55, 1.05, "#e8dcc6"], [1.02, 1.12, "#d9583f"], [1.2, 0.94, "#3d5a80"]]) cyl(0.075, 0.065, 0.16, c, sofa, x, 0.14, z, 16);

// Floating Zs.
const zCanvas = document.createElement("canvas"); zCanvas.width = zCanvas.height = 96;
{ const c = zCanvas.getContext("2d"); c.fillStyle = "#fff6e6"; c.font = "800 78px Syne, sans-serif"; c.textAlign = "center"; c.fillText("Z", 48, 76); }
const zTex = new THREE.CanvasTexture(zCanvas); zTex.colorSpace = THREE.SRGBColorSpace;
const zs = [0, 1, 2].map((i) => { const m = new THREE.SpriteMaterial({ map: zTex, transparent: true, depthWrite: false }); const z = new THREE.Sprite(m); sofa.add(z); return { z, m, offset: i / 3 }; });

// Dust drifting through the morning light.
const dustCount = 140, dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) { dustPos[i * 3] = -3.5 + ((i * 97) % 700) / 100; dustPos[i * 3 + 1] = 0.3 + ((i * 53) % 370) / 100; dustPos[i * 3 + 2] = -3.5 + ((i * 71) % 700) / 100; }
const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: "#ffd9a3", size: 0.028, transparent: true, opacity: 0.55, depthWrite: false }));
world.add(dust);

// Lights: warm lamp indoors, cool moonlight from the window.
scene.add(new THREE.HemisphereLight("#fff1e4", "#5c4e45", 2.0));
const moon = new THREE.DirectionalLight("#ffeedd", 1.8); moon.position.set(5, 8, 7); scene.add(moon);
const fill = new THREE.PointLight("#ffb777", 9, 9, 1.8); fill.position.set(1.5, 3, 1.5); scene.add(fill);
const screenGlow = new THREE.PointLight("#6fe0c0", 3.2, 4, 2); screenGlow.position.set(0.95, 1.95, -2.75); world.add(screenGlow);


// Navigation.
const order = SECTION_ORDER;
const menu = document.getElementById("menu");
const mkBtn = (key, text) => { const b = document.createElement("button"); b.textContent = text; b.dataset.key = key; b.addEventListener("click", () => go(key)); menu.append(b); return b; };
mkBtn("home", "Room");
order.forEach((k) => mkBtn(k, SECTIONS[k].label));
const tourBtn = document.createElement("button"); tourBtn.textContent = "Take the tour"; tourBtn.className = "tour-btn"; tourBtn.addEventListener("click", () => { go("home"); tour.start(); }); menu.append(tourBtn);
const simpleLink = document.createElement("a"); simpleLink.href = "/simple.html"; simpleLink.textContent = "Simple view"; simpleLink.className = "simple-link"; menu.append(simpleLink);

const camPos = new THREE.Vector3(...STOPS.home.pos).add(new THREE.Vector3(4, 3, 4));
const camLook = new THREE.Vector3(...STOPS.home.look);
const fromPos = new THREE.Vector3(), fromLook = new THREE.Vector3(), toPos = new THREE.Vector3(...STOPS.home.pos), toLook = new THREE.Vector3(...STOPS.home.look);
let moveT = 0, moveDur = reduce ? 0.001 : 2.2, current = "home";
fromPos.copy(camPos); fromLook.copy(camLook);
let spin = 0, spinTarget = 0, shift = 0;

const selected = { note: null, book: null, rack: null };
let flagUntil = 0, tour = null, pointing = null;
const cardHooks = {
  go: (key) => go(key),
  note: (i) => { selected.note = i; },
  book: (i) => { selected.book = i; },
  rack: (i) => { selected.rack = i; },
  project: (p) => { monitor.show(p); screenGlow.color.set(monitor.accent); },
  flag: () => { flagUntil = performance.now() + 2000; },
};

// Where the robot stands for each stop. It walks around the sofa instead of through it.
const STANDS = { home: [2.95, 2.35], about: [-2.95, -0.75], projects: [2.05, -1.35], experience: [-1.4, -2.45], skills: [2.5, -1.75], certificates: [-2.65, -0.4], contact: [2.85, 0.35] };
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

function go(key) {
  if (key !== "home" && !SECTIONS[key]) return;
  current = key;
  const stop = STOPS[key];
  fromPos.copy(camPos); fromLook.copy(camLook);
  toPos.set(...stop.pos); toLook.set(...stop.look);
  moveT = 0; moveDur = reduce ? 0.001 : 1.5;
  spinTarget = 0;
  document.body.classList.toggle("open", key !== "home");
  if (tour?.isActive()) tour.end();
  walkTo(key);
  selected.note = null; selected.book = null; selected.rack = null;
  monitor.show(null); screenGlow.color.set(monitor.accent);
  if (key !== "home") {
    const panel = document.getElementById("panel");
    panel.style.setProperty("--sec", SECTIONS[key].color);
    mountSection(key, document.getElementById("content"), cardHooks);
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
  const all = ["home", ...order];
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
  const all = ["home", ...order];
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
    while (o && !o.userData.station) o = o.parent;
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
  if (s) { tip_.textContent = s === "guide" ? "The robot: take the tour again" : SECTIONS[s].tip; tip_.style.opacity = 1; tip_.style.transform = `translate(${Math.min(e.clientX + 16, innerWidth - 230)}px, ${e.clientY + 18}px)`; } else tip_.style.opacity = 0;
});
canvas.addEventListener("pointerleave", hideTip);
canvas.addEventListener("pointerup", (e) => {
  dragging = false; canvas.classList.remove("dragging");
  if (moved < 6) { const s = pick(e); if (s === "guide") { go("home"); tour.start(); } else go(s || "home"); }
});

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = camera.aspect < 0.8 ? 60 : 30;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize); resize();

const STOP_ANCHORS = {
  projects: new THREE.Vector3(0.95, 1.98, -3.3), experience: new THREE.Vector3(-1.45, 2.95, -3.85), skills: new THREE.Vector3(3.25, 1.7, -2.75),
  certificates: new THREE.Vector3(-3.45, 1.75, 1.3), contact: new THREE.Vector3(3.6, 1.0, -0.4), about: new THREE.Vector3(-1.2, 1.0, 1.15),
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
  const shiftTarget = current === "home" ? 0 : wide ? Math.min(470, innerWidth * 0.34) / 2 : innerHeight * 0.3;
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
  openBook.update(selected.book);
  if (reduce) { zs.forEach((item, i) => { item.z.position.set(-1.05 + i * 0.12, 1.3 + i * 0.28, 0.2); const size = 0.12 + i * 0.07; item.z.scale.set(size, size, 1); item.m.opacity = 0.9; }); robot.rotation.y = 0.72; }
  renderer.render(scene, camera);
  tour.place();
}
renderer.setAnimationLoop(render);
render();
const loader = document.getElementById("loader");
requestAnimationFrame(() => { loader.style.opacity = 0; setTimeout(() => loader.remove(), 700); });
[...menu.children][0].setAttribute("aria-current", "true");
if (!hasSeenTour()) setTimeout(() => { if (current === "home") tour.start(); }, reduce ? 300 : 2300);
if (import.meta.env.DEV) window.__room = { go, renderer, tour };
