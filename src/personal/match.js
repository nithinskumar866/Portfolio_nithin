// The clip on the personal room's TV: a small 3D floodlit stadium where an animated cricketer in the blue #7 kit
// hits the 2011 World Cup final's winning six, with camera cuts and slow motion. It renders into a texture for the TV.
// The cricketers are built from the same human model as the sleeper, re-dressed and posed with simple IK each frame.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";

export const CLIP = 12.6;
const HUD_W = 1024, HUD_H = 576;

// Clip time -> match time. The hit plays at about a third of real speed.
const SEGS = [[0, 2.2, 0, 2.2], [2.2, 4.2, 2.2, 2.8], [4.2, 7.0, 2.8, 5.6], [7.0, 9.6, 5.6, 8.2], [9.6, CLIP, 8.2, 11.2]];
const matchTime = (c) => { for (const [c0, c1, s0, s1] of SEGS) if (c < c1) return s0 + ((c - c0) / (c1 - c0)) * (s1 - s0); return 11.2; };
const shotAt = (c) => Math.max(0, SEGS.findIndex(([, c1]) => c < c1));

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => { const k = clamp01(v); return k * k * (3 - 2 * k); };
const lerp = THREE.MathUtils.lerp;
const UP = new THREE.Vector3(0, 1, 0);
const rand = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Piecewise smooth interpolation through [time, value] keys. Values are arrays.
function track(keys, s) {
  if (s <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (s <= keys[i][0]) { const k = smooth((s - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])); return keys[i - 1][1].map((v, j) => lerp(v, keys[i][1][j], k)); }
  }
  return keys[keys.length - 1][1];
}

// --- Bone helpers, all in world space ---
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3(), _e = new THREE.Vector3(), _t = new THREE.Vector3();
const _q = new THREE.Quaternion(), _p = new THREE.Quaternion(), _w = new THREE.Quaternion();
function aim(bone, child, dir) {
  bone.updateWorldMatrix(true, false); child.updateWorldMatrix(true, false);
  bone.getWorldPosition(_a); child.getWorldPosition(_b);
  _q.setFromUnitVectors(_b.sub(_a).normalize(), _t.copy(dir).normalize());
  bone.getWorldQuaternion(_w); bone.parent.getWorldQuaternion(_p);
  bone.quaternion.copy(_p.invert().multiply(_q).multiply(_w));
  bone.updateWorldMatrix(false, true);
}
function turn(bone, axis, angle) {
  bone.updateWorldMatrix(true, false);
  bone.getWorldQuaternion(_w); bone.parent.getWorldQuaternion(_p);
  _w.premultiply(_q.setFromAxisAngle(axis, angle));
  bone.quaternion.copy(_p.invert().multiply(_w));
  bone.updateWorldMatrix(false, true);
}
// Two-bone IK: bend a-b-c so c reaches the target, with the middle joint pushed towards the pole.
function ik(a, b, c, target, pole) {
  a.updateWorldMatrix(true, true);
  const A = a.getWorldPosition(new THREE.Vector3()), B = b.getWorldPosition(_c), C = c.getWorldPosition(_d);
  const l1 = A.distanceTo(B), l2 = B.distanceTo(C);
  const dir = _e.subVectors(target, A);
  const d = THREE.MathUtils.clamp(dir.length(), Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  dir.normalize();
  const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  const bend = new THREE.Vector3().subVectors(pole, A); bend.addScaledVector(dir, -bend.dot(dir)).normalize();
  const elbow = A.clone().addScaledVector(dir, x).addScaledVector(bend, h);
  const end = A.clone().addScaledVector(dir, d);
  aim(a, b, elbow.clone().sub(A));
  aim(b, c, end.sub(elbow));
}

// --- Canvas textures ---
function canvasTex(w, h, draw, repeat) {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(...repeat); }
  tex.anisotropy = 4;
  return tex;
}
const crowdTex = (jump) => canvasTex(1024, 256, (c, w, h) => {
  c.fillStyle = "#141a30"; c.fillRect(0, 0, w, h);
  const colors = ["#2e7fd6", "#f39c3d", "#f6efe2", "#3fa956", "#e2574c", "#f4d35e", "#2e7fd6", "#7c6fd6"];
  for (let r = 0; r < 16; r++) for (let i = 0; i < 86; i++) {
    const n = r * 131 + i, x = i * 12 + (r % 2) * 6, y = 8 + r * 15.5 - (jump && rand(n + 7) > 0.35 ? 5 : 0);
    c.fillStyle = colors[Math.floor(rand(n) * colors.length)];
    c.beginPath(); c.arc(x, y, 4.2, 0, 7); c.fill();
    if (jump && rand(n + 3) > 0.8) c.fillRect(x - 1, y - 10, 2, 7);
  }
}, [14, 3]);

// --- Characters ---
const KITS = {
  india: { top: "#2f7fd8", bottom: "#2560b5", shoes: "#f3f1ea", trim: "#f39c3d", chest: "INDIA" },
  lanka: { top: "#1d3f8c", bottom: "#1d3f8c", shoes: "#f3f1ea", trim: "#f4d35e", chest: "" },
};
const white = new THREE.MeshStandardMaterial({ color: "#f3f1ea", roughness: 0.7 });
function makeBat() {
  const bat = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 10), new THREE.MeshStandardMaterial({ color: "#20242c", roughness: 0.9 }));
  handle.position.y = 0.1; bat.add(handle);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.108, 0.56, 0.048), new THREE.MeshStandardMaterial({ color: "#e6cc93", roughness: 0.6 }));
  blade.position.y = 0.54; bat.add(blade);
  const sticker = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.05), new THREE.MeshStandardMaterial({ color: "#1d2230", roughness: 0.6 }));
  sticker.position.y = 0.36; bat.add(sticker);
  return bat;
}
function makePlayer(source, scene, kit, { helmet = false, pads = false, back = null } = {}) {
  const root = cloneSkinned(source);
  const bones = {};
  root.traverse((o) => {
    if (o.isBone) bones[o.name] = o;
    if (o.isMesh) {
      o.frustumCulled = false; o.material = o.material.clone();
      const col = { Wolf3D_Outfit_Top: kit.top, Wolf3D_Outfit_Bottom: kit.bottom, Wolf3D_Outfit_Footwear: kit.shoes }[o.material.name];
      // Plain kit colours. Dropping the detail maps also takes away the jacket's lapels and bow tie.
      if (col) { o.material.map = null; o.material.normalMap = null; o.material.metalnessMap = null; o.material.roughnessMap = null; o.material.color.set(col); o.material.roughness = 0.8; o.material.metalness = 0; }
      // Turn the jacket into a shirt: tuck the coat tails in at the waist and flatten the lapels and bow tie.
      // Positions here are in the model's standing pose, in metres.
      if (o.material.name === "Wolf3D_Outfit_Top") {
        o.material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
            if (position.y < 0.95) transformed.y = 0.95 + (position.y - 0.95) * 0.06;
            if (position.y > 1.0 && position.y < 1.6 && abs(position.x) < 0.17) transformed.z = min(transformed.z, position.y > 1.4 ? 0.055 : 0.125);`);
        };
      }
      if (helmet && o.material.name === "Wolf3D_Headwear") o.visible = false;
    }
  });
  scene.add(root);
  root.updateMatrixWorld(true);
  const rest = new Map(Object.values(bones).map((b) => [b, b.quaternion.clone()]));
  // Attach props in the model's own space (standing, facing +z), so they follow the bones.
  const attach = (mesh, bone, x, y, z, faceBack = false) => {
    mesh.position.set(x, y, z); root.add(mesh);
    if (faceBack) mesh.rotation.y = Math.PI;
    mesh.updateMatrixWorld(); bones[bone].attach(mesh);
    return mesh;
  };
  if (kit.chest) {
    const chestTex = canvasTex(256, 96, (c) => { c.textAlign = "center"; c.fillStyle = kit.trim; c.font = "800 64px Syne, sans-serif"; c.fillText(kit.chest, 128, 72); });
    document.fonts?.ready.then(() => { const c = chestTex.image.getContext("2d"); c.clearRect(0, 0, 256, 96); c.textAlign = "center"; c.fillStyle = kit.trim; c.font = "800 64px Syne, sans-serif"; c.fillText(kit.chest, 128, 72); chestTex.needsUpdate = true; });
    attach(new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.09), new THREE.MeshBasicMaterial({ map: chestTex, transparent: true, depthWrite: false })), "Spine2", 0, 1.36, 0.168);
  }
  if (helmet) {
    const navy = new THREE.MeshStandardMaterial({ color: "#13284e", roughness: 0.4 });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), navy);
    attach(shell, "Head", 0, 1.715, 0.0);
    const peak = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.015, 0.09), navy); attach(peak, "Head", 0, 1.75, 0.135);
    const grille = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.007, 6, 20, Math.PI), new THREE.MeshStandardMaterial({ color: "#b9bec8", metalness: 0.6, roughness: 0.4 }));
    grille.rotation.x = Math.PI / 2 + 0.25; attach(grille, "Head", 0, 1.665, 0.03);
    grille.scale.set(1, 1.1, 1);
  }
  if (pads) {
    for (const [side, x] of [["Left", 0.095], ["Right", -0.095]]) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.1), white); attach(pad, `${side}Leg`, x, 0.33, 0.06);
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), white);
      const hand = bones[`${side}Hand`].getWorldPosition(new THREE.Vector3()); root.worldToLocal(hand);
      attach(glove, `${side}Hand`, hand.x + (x > 0 ? 0.05 : -0.05), hand.y, hand.z);
    }
  }
  if (back) {
    const tex = canvasTex(256, 256, (c) => {
      c.textAlign = "center"; c.fillStyle = "#f6efe2"; c.font = "800 44px Syne, sans-serif"; c.fillText(back.name, 128, 70);
      c.fillStyle = "#f39c3d"; c.font = "800 150px Syne, sans-serif"; c.fillText(back.number, 128, 215);
    });
    document.fonts?.ready.then(() => { const c = tex.image.getContext("2d"); c.clearRect(0, 0, 256, 256); c.textAlign = "center"; c.fillStyle = "#f6efe2"; c.font = "800 44px Syne, sans-serif"; c.fillText(back.name, 128, 70); c.fillStyle = "#f39c3d"; c.font = "800 150px Syne, sans-serif"; c.fillText(back.number, 128, 215); tex.needsUpdate = true; });
    const print = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.27), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    attach(print, "Spine2", 0, 1.3, -0.15, true);
  }
  // Helpers to aim the face and to place things relative to the body.
  const nose = new THREE.Object3D(); attach(nose, "Head", 0, 1.72, 0.4);
  return { root, bones, rest, nose, reset() { for (const [b, q] of rest) b.quaternion.copy(q); root.updateMatrixWorld(true); } };
}

export function createMatch(renderer, { still = false } = {}) {
  const rt = new THREE.WebGLRenderTarget(768, 432, { samples: 4 });
  rt.texture.colorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0a1430");
  const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 400);
  scene.add(cam);

  // Lights: floodlights from four corners.
  scene.add(new THREE.HemisphereLight("#d6e4ff", "#24402a", 1.1));
  const key = new THREE.DirectionalLight("#fff6e2", 2.0); key.position.set(30, 45, 20); scene.add(key);
  const rim = new THREE.DirectionalLight("#cfe0ff", 1.1); rim.position.set(-30, 35, -30); scene.add(rim);

  // Outfield, pitch, creases and stumps.
  const grass = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#2f8a45" : "#37984d"; c.fillRect(0, (i * h) / 8, w, h / 8); } }, [6, 6]);
  const field = new THREE.Mesh(new THREE.CircleGeometry(46, 72), new THREE.MeshStandardMaterial({ map: grass, roughness: 1 }));
  field.rotation.x = -Math.PI / 2; scene.add(field);
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 24), new THREE.MeshStandardMaterial({ color: "#d3bd8a", roughness: 1 }));
  pitch.rotation.x = -Math.PI / 2; pitch.position.set(0, 0.005, -10); scene.add(pitch);
  const lineMat = new THREE.MeshBasicMaterial({ color: "#f6f3ea" });
  for (const z of [0, 1.22, -20.12, -21.34]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.05), lineMat); l.rotation.x = -Math.PI / 2; l.position.set(0, 0.01, z); scene.add(l); }
  const stumpMat = new THREE.MeshStandardMaterial({ color: "#f1e6cf", roughness: 0.6 });
  for (const z of [1.22, -21.34]) for (const x of [-0.11, 0, 0.11]) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.71, 8), stumpMat); s.position.set(x, 0.355, z); scene.add(s); }

  // Boundary boards, stands, roof and floodlight towers.
  const boards = canvasTex(1024, 64, (c) => { ["#f39c3d", "#2e7fd6", "#f6efe2", "#3fa956", "#e2574c", "#14284b"].forEach((col, i) => { c.fillStyle = col; c.fillRect(i * 171, 0, 171, 64); }); }, [10, 1]);
  const boardRing = new THREE.Mesh(new THREE.CylinderGeometry(44, 44, 1.1, 96, 1, true), new THREE.MeshBasicMaterial({ map: boards, side: THREE.BackSide }));
  boardRing.position.y = 0.55; scene.add(boardRing);
  const crowdCalm = crowdTex(false), crowdJump = crowdTex(true);
  const standMat = new THREE.MeshStandardMaterial({ map: crowdCalm, side: THREE.BackSide, roughness: 1 });
  const stands = new THREE.Mesh(new THREE.CylinderGeometry(72, 47, 24, 120, 1, true), standMat);
  stands.position.y = 12; scene.add(stands);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(84, 72, 6, 120, 1, true), new THREE.MeshStandardMaterial({ color: "#1b2238", side: THREE.BackSide }));
  roof.position.y = 27; scene.add(roof);
  const glowTex = canvasTex(128, 128, (c) => { const g = c.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, "rgba(255,250,230,1)"); g.addColorStop(0.3, "rgba(255,245,210,0.45)"); g.addColorStop(1, "rgba(255,245,210,0)"); c.fillStyle = g; c.fillRect(0, 0, 128, 128); });
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2, x = Math.cos(a) * 80, z = Math.sin(a) * 80;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1, 48, 8), new THREE.MeshStandardMaterial({ color: "#2a3048" })); pole.position.set(x, 24, z); scene.add(pole);
    const head = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 1), new THREE.MeshBasicMaterial({ color: "#fffbe8" })); head.position.set(x, 50, z); head.lookAt(0, 0, 0); scene.add(head);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); glow.scale.setScalar(46); glow.position.set(x, 50, z); scene.add(glow);
  }
  // Stars and camera flashes in the crowd.
  const starGeo = new THREE.BufferGeometry(), stars = [];
  for (let i = 0; i < 300; i++) { const a = rand(i) * Math.PI * 2, r = 150 + rand(i + 1) * 80; stars.push(Math.cos(a) * r, 40 + rand(i + 2) * 120, Math.sin(a) * r); }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: "#c8d6ff", size: 0.8, sizeAttenuation: true })));
  const flashCount = 120, flashPos = new Float32Array(flashCount * 3), flashCol = new Float32Array(flashCount * 3);
  for (let i = 0; i < flashCount; i++) { const a = rand(i + 50) * Math.PI * 2, k = rand(i + 60); flashPos.set([Math.cos(a) * lerp(48, 70, k), 1 + k * 22, Math.sin(a) * lerp(48, 70, k)], i * 3); }
  const flashGeo = new THREE.BufferGeometry(); flashGeo.setAttribute("position", new THREE.BufferAttribute(flashPos, 3)); flashGeo.setAttribute("color", new THREE.BufferAttribute(flashCol, 3));
  scene.add(new THREE.Points(flashGeo, new THREE.PointsMaterial({ size: 1.4, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })));

  // The ball, with a short trail.
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
  scene.add(ball);
  const trailN = 16, trailPos = new Float32Array(trailN * 3);
  const trailGeo = new THREE.BufferGeometry(); trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55 }));
  trail.frustumCulled = false; scene.add(trail);

  const bat = makeBat(); scene.add(bat);
  const partnerBat = makeBat(); scene.add(partnerBat);

  // Score bug, SIX! and the title, drawn on a canvas in front of the camera.
  const hudCanvas = document.createElement("canvas"); hudCanvas.width = HUD_W; hudCanvas.height = HUD_H;
  const hudTex = new THREE.CanvasTexture(hudCanvas); hudTex.colorSpace = THREE.SRGBColorSpace;
  const hud = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, depthTest: false, depthWrite: false }));
  hud.renderOrder = 10; hud.position.z = -1; cam.add(hud);

  // --- The play, in match time (seconds) ---
  // Batter on strike at the near crease, side-on, facing +x with the bowler down the pitch at -z.
  // Grip point of the bat over time.
  const GRIP = [
    [0, [0.3, 0.93, 0.06]], [1.55, [0.3, 0.95, 0.06]], [1.95, [0.12, 1.42, 0.3]], [2.12, [0.22, 1.2, 0.18]], [2.25, [0.42, 0.98, -0.3]],
    [2.38, [0.38, 1.18, -0.42]], [2.55, [0.2, 1.58, -0.3]], [2.72, [0.06, 1.8, -0.1]], [6.5, [0.06, 1.76, -0.1]], [8, [0.08, 1.78, -0.08]],
  ];
  // The bat swings down in the vertical plane, then whips round over his head: the helicopter.
  const swingAngle = (s) => {
    const keys = [[1.55, 0.25], [1.95, 0.71], [2.12, 2.0], [2.25, 3.85], [2.38, 4.6]];
    if (s <= keys[0][0]) return keys[0][1] + Math.sin(s * 3) * 0.04;
    for (let i = 1; i < keys.length; i++) if (s <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (s - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
    return 4.6;
  };
  const batDir = (s, out) => {
    if (s < 1.55) return out.set(0.06, -1, 0.14).normalize();
    if (s <= 2.38) { const th = swingAngle(s); return out.set(0.15, Math.cos(th), Math.sin(th)).normalize(); }
    // Whip: from pointing at the bowler, round the leg side to behind his head, toe rising.
    let psi = smooth((s - 2.38) / 0.34) * Math.PI * 1.05;
    if (s > 6.6) psi += smooth((s - 6.6) / 0.7) * Math.PI * 2; // a twirl overhead
    const lift = smooth((s - 2.38) / 0.34) * 0.75;
    const x = 0.15, z = -1;
    out.set(x * Math.cos(psi) + z * Math.sin(psi), -0.11 + lift, -x * Math.sin(psi) + z * Math.cos(psi));
    return out.normalize();
  };
  // Positive turns the chest from the off side towards the bowler.
  const CHEST = [[0, [-0.1]], [1.6, [-0.1]], [1.95, [-0.35]], [2.25, [0.5]], [2.7, [0.95]], [6, [0.9]]];
  const LEAN = [[0, [0.32]], [1.6, [0.3]], [2.25, [0.2]], [2.7, [-0.12]], [6, [-0.08]]];
  const CROUCH = [[0, [-0.09]], [1.6, [-0.09]], [2.25, [-0.06]], [2.8, [-0.01]]];
  const FRONT_FOOT = [[0, [0.04, 0.08, -0.34]], [1.95, [0.04, 0.08, -0.34]], [2.1, [0.12, 0.2, -0.52]], [2.22, [0.14, 0.08, -0.6]]];
  const BACK_FOOT = [[0, [0.0, 0.08, 0.32]], [2.25, [0.0, 0.08, 0.32]], [2.6, [-0.05, 0.1, 0.26]]];
  const RELEASE = new THREE.Vector3(0.42, 2.15, -19.4), BOUNCE = new THREE.Vector3(0.24, 0.03, -4.4), LAND = new THREE.Vector3(-23, 13, -61);
  const impact = new THREE.Vector3();
  { const g = track(GRIP, 2.25), d = batDir(2.25, new THREE.Vector3()); impact.set(...g).addScaledVector(d, 0.58); }
  const ballAt = (s, out) => {
    if (s < 1.62) return null;
    if (s < 2.05) { const k = (s - 1.62) / 0.43; return out.lerpVectors(RELEASE, BOUNCE, k); }
    if (s < 2.25) { const k = (s - 2.05) / 0.2; return out.lerpVectors(BOUNCE, impact, k); }
    if (s < 5.0) { const k = (s - 2.25) / 2.75; out.lerpVectors(impact, LAND, k); out.y += 4 * 34 * k * (1 - k); return out; }
    return null;
  };

  let batter = null, bowler = null, partner = null;
  new GLTFLoader().load("/models/sleeper.glb", (gltf) => {
    batter = makePlayer(gltf.scene, scene, KITS.india, { helmet: true, pads: true, back: { name: "DHONI", number: "7" } });
    batter.root.rotation.y = Math.PI / 2;
    bowler = makePlayer(gltf.scene, scene, KITS.lanka);
    partner = makePlayer(gltf.scene, scene, KITS.india, { helmet: true, pads: true });
    for (const p of [batter, bowler, partner]) p.root.updateMatrixWorld(true);
    if (still) update(0);
  });

  const g = new THREE.Vector3(), d = new THREE.Vector3(), tmp = new THREE.Vector3(), ballPos = new THREE.Vector3(), look = new THREE.Vector3(), pole = new THREE.Vector3();
  const lookSmooth = new THREE.Vector3(0, 1, -10);
  const history = [];

  function poseBatter(s) {
    const b = batter.bones;
    batter.reset();
    batter.root.position.set(0, track(CROUCH, s)[0], 0);
    batter.root.updateMatrixWorld(true);
    // Lean towards the off side and turn the chest.
    const lean = track(LEAN, s)[0], chest = track(CHEST, s)[0];
    for (const [bone, k] of [[b.Spine, 0.3], [b.Spine1, 0.35], [b.Spine2, 0.35]]) { turn(bone, tmp.set(0, 0, 1), -lean * k); turn(bone, UP, chest * k); }
    // Legs.
    for (const [side, keys, pz] of [["Left", FRONT_FOOT, -0.15], ["Right", BACK_FOOT, 0.15]]) {
      const foot = tmp.set(...track(keys, s));
      b[`${side}UpLeg`].getWorldPosition(pole); pole.add(new THREE.Vector3(1.2, -0.3, pz));
      ik(b[`${side}UpLeg`], b[`${side}Leg`], b[`${side}Foot`], foot.clone(), pole.clone());
    }
    // Hands on the bat: top hand at the grip, bottom hand just below.
    g.set(...track(GRIP, s)); batDir(s, d);
    const high = smooth((g.y - 1.25) / 0.45);
    b.Spine2.getWorldPosition(pole);
    ik(b.LeftArm, b.LeftForeArm, b.LeftHand, g.clone(), pole.clone().add(tmp.set(lerp(0.5, 0.3, high), lerp(-0.7, 0.3, high), lerp(-0.6, -1, high))));
    ik(b.RightArm, b.RightForeArm, b.RightHand, g.clone().addScaledVector(d, 0.1), pole.clone().add(tmp.set(lerp(0.5, 0.3, high), lerp(-0.7, 0.3, high), lerp(0.7, 1, high))));
    bat.position.copy(g).addScaledVector(d, -0.04); bat.quaternion.setFromUnitVectors(UP, d);
    // Eyes on the bowler, then on the ball, then up at the crowd.
    b.Head.getWorldPosition(tmp);
    if (s < 2.25) look.set(0.2, 1.2, -20).sub(tmp);
    else if (s < 5) { ballAt(s, ballPos); look.subVectors(ballPos, tmp); }
    else if (s < 6.5) look.subVectors(LAND, tmp);
    else look.set(0.3, 0.25, -1);
    look.normalize();
    aim(b.Head, batter.nose, look);
  }

  function walkLegs(p, phase, amp) {
    const b = p.bones, f = new THREE.Vector3(0, 0, 1).applyQuaternion(p.root.quaternion);
    for (const [side, off] of [["Left", 0], ["Right", Math.PI]]) {
      const a = Math.sin(phase + off) * amp, knee = Math.max(0, Math.cos(phase + off)) * amp * 1.4;
      aim(b[`${side}UpLeg`], b[`${side}Leg`], tmp.set(0, -Math.cos(a), 0).addScaledVector(f, Math.sin(a)));
      aim(b[`${side}Leg`], b[`${side}Foot`], tmp.set(0, -Math.cos(a - knee), 0).addScaledVector(f, Math.sin(a - knee)));
    }
  }

  function poseBowler(s) {
    const b = bowler.bones;
    bowler.reset();
    const z = s < 1.5 ? -34 + s * 9.2 : -20.2 + (1 - Math.exp(-(s - 1.5) * 1.6)) * 2.2;
    bowler.root.position.set(0.55, 0, z);
    bowler.root.updateMatrixWorld(true);
    const speed = s < 1.5 ? 1 : Math.exp(-(s - 1.5) * 2);
    walkLegs(bowler, s * 13, 0.6 * speed + 0.02);
    aim(b.LeftArm, b.LeftForeArm, tmp.set(0.25, -Math.cos(Math.sin(s * 13) * 0.6 * speed), Math.sin(Math.sin(s * 13) * 0.6 * speed)));
    // The bowling arm goes round over the top, straight, and lets go near the top.
    const k = clamp01((s - 1.34) / 0.5), beta = k * Math.PI * 2;
    if (k > 0 && k < 1) aim(b.RightArm, b.RightForeArm, tmp.set(-0.12, -Math.cos(beta), -Math.sin(beta)));
    else aim(b.RightArm, b.RightForeArm, tmp.set(-0.25, -Math.cos(Math.sin(s * 13 + Math.PI) * 0.6 * speed), Math.sin(Math.sin(s * 13 + Math.PI) * 0.6 * speed)));
    aim(b.RightForeArm, b.RightHand, b.RightForeArm.getWorldPosition(new THREE.Vector3()).sub(b.RightArm.getWorldPosition(new THREE.Vector3())));
  }

  function posePartner(s) {
    const b = partner.bones;
    partner.reset();
    // Backing up at the bowler's end, then running down to celebrate.
    const run = clamp01((s - 5.6) / 2.4);
    partner.root.position.set(-1.25, 0, lerp(-20.8, -6, run));
    partner.root.updateMatrixWorld(true);
    if (run > 0 && run < 1) walkLegs(partner, s * 12, 0.55);
    const cheer = s > 5.0;
    const jump = cheer ? Math.abs(Math.sin(s * 7)) * 0.12 : 0;
    partner.root.position.y = run > 0 && run < 1 ? 0 : jump; partner.root.updateMatrixWorld(true);
    aim(b.LeftArm, b.LeftForeArm, cheer ? tmp.set(-0.35, 1, 0.15) : tmp.set(-0.12, -1, 0.05));
    aim(b.RightArm, b.RightForeArm, cheer ? tmp.set(0.35, 1, 0.15) : tmp.set(0.12, -1, 0.1));
    aim(b.LeftForeArm, b.LeftHand, cheer ? tmp.set(-0.2, 1, 0.1) : tmp.set(-0.05, -1, 0.1));
    aim(b.RightForeArm, b.RightHand, cheer ? tmp.set(0.2, 1, 0.1) : tmp.set(0.05, -1, 0.15));
    b.RightHand.getWorldPosition(tmp);
    partnerBat.position.copy(tmp); partnerBat.quaternion.setFromUnitVectors(UP, cheer ? d.set(0.2, 1, 0) : d.set(0.1, -1, 0.15).normalize());
  }

  function placeCamera(c, s, shot) {
    let fov = 30;
    if (shot === 0) { cam.position.set(0.7, 3.0, -41 + c * 0.3); look.set(0.1, 0.9, -9); fov = 22; }
    else if (shot === 1) { const k = (c - 2.2) / 2; cam.position.set(lerp(4.4, 3.8, k), lerp(1.25, 1.45, k), lerp(-1.9, -1.4, k)); look.set(0.15, 1.2, -0.2); fov = 34; }
    else if (shot === 2) {
      cam.position.set(2.4, 1.5, 6.2);
      const target = s < 5 ? (ballAt(s, ballPos), ballPos) : LAND;
      lookSmooth.lerp(target, 0.25); look.copy(lookSmooth); fov = lerp(48, 34, clamp01((s - 4.2) / 1.2));
    } else if (shot === 3) { const k = (c - 7) / 2.6; cam.position.set(-2.7, lerp(1.55, 1.7, k), lerp(0.95, 0.6, k)); look.set(0.1, 1.6, -0.25); fov = 36; }
    else { const k = (c - 9.6) / 3, a = lerp(0.95, 0.35, k); cam.position.set(Math.cos(a) * 7.5, 2.3, -Math.sin(a) * 7.5 + 0.5); look.set(0, 2.5, -0.2); fov = 36; }
    if (shot !== 2) lookSmooth.set(0.3, 1.2, -1);
    cam.fov = fov; cam.updateProjectionMatrix(); cam.lookAt(look);
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2);
    hud.scale.set(h * (16 / 9), h, 1);
  }

  function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
  let hudKey = "";
  function drawHud(c, s, shot) {
    const done = s >= 5.0, sixPop = shot === 2 && s >= 5.0 ? smooth((s - 5.0) / 0.25) : 0, title = shot === 4 ? smooth((c - 9.8) / 0.5) : 0, sub = shot === 4 ? smooth((c - 10.4) / 0.5) : 0;
    const keyNow = [done, sixPop.toFixed(2), title.toFixed(2), sub.toFixed(2), shot].join();
    if (keyNow === hudKey) return;
    hudKey = keyNow;
    const g2 = hudCanvas.getContext("2d");
    g2.clearRect(0, 0, HUD_W, HUD_H);
    if (shot === 1) { g2.fillStyle = "rgba(255,255,255,0.85)"; g2.font = "600 22px 'DM Mono', monospace"; g2.fillText("SLOW MOTION", 40, 54); }
    if (shot < 4) {
      g2.fillStyle = "#e2574c"; rr(g2, 902, 28, 86, 34, 7); g2.fill();
      g2.fillStyle = "#fff"; g2.font = "700 20px 'DM Sans', sans-serif"; g2.textBaseline = "middle"; g2.fillText("LIVE", 922, 46);
      g2.fillStyle = "rgba(10,16,32,0.88)"; rr(g2, 30, 496, done ? 690 : 600, 50, 10); g2.fill();
      g2.fillStyle = "#2e7fd6"; rr(g2, 30, 496, 110, 50, 10); g2.fill();
      g2.fillStyle = "#fff"; g2.font = "700 27px 'DM Sans', sans-serif"; g2.fillText("IND", 60, 522); g2.fillText(done ? "277/4" : "271/4", 160, 522);
      g2.fillStyle = "#a9b8d6"; g2.font = "23px 'DM Mono', monospace"; g2.fillText(done ? "48.2 ov" : "48.1 ov", 258, 522);
      g2.fillStyle = done ? "#7cf2c8" : "#f4d35e"; g2.font = "700 23px 'DM Sans', sans-serif"; g2.fillText(done ? "INDIA WIN BY 6 WICKETS" : "NEED 4 FROM 11", 378, 522);
      g2.textBaseline = "alphabetic";
    }
    if (sixPop) {
      g2.save(); g2.translate(512, 200); g2.scale(0.6 + sixPop * 0.55, 0.6 + sixPop * 0.55); g2.globalAlpha = sixPop;
      g2.font = "800 150px Syne, sans-serif"; g2.textAlign = "center"; g2.lineWidth = 16; g2.strokeStyle = "#14284b"; g2.strokeText("SIX!", 0, 50);
      g2.fillStyle = "#f4d35e"; g2.fillText("SIX!", 0, 50); g2.restore();
    }
    if (title) {
      g2.fillStyle = `rgba(8,14,32,${0.55 * title})`; g2.fillRect(0, 40, HUD_W, 270);
      g2.save(); g2.globalAlpha = title; g2.textAlign = "center";
      g2.fillStyle = "#f4d35e"; g2.font = "800 64px Syne, sans-serif"; g2.fillText("DHONI FINISHES", 512, 125 - (1 - title) * 24); g2.fillText("OFF IN STYLE!", 512, 195 - (1 - title) * 24);
      g2.globalAlpha = sub; g2.fillStyle = "#f6efe2"; g2.font = "600 30px 'DM Sans', sans-serif"; g2.fillText("India win the 2011 World Cup", 512, 244);
      g2.fillStyle = "#cfe0ff"; g2.font = "22px 'DM Mono', monospace"; g2.fillText("IND 277/4 (48.2) beat SL 274/6  ·  Wankhede, 2 April 2011", 512, 284);
      g2.restore();
    }
    hudTex.needsUpdate = true;
  }

  let frozen = null;
  function update(t) {
    const c = frozen ?? (still ? 10.8 : t % CLIP), s = matchTime(c), shot = shotAt(c);
    if (batter) { poseBatter(s); poseBowler(s); posePartner(s); }
    // Ball and trail.
    const p = ballAt(s, ballPos);
    ball.visible = Boolean(p);
    if (p) { ball.position.copy(p); history.unshift(p.clone()); } else history.length = 0;
    history.length = Math.min(history.length, trailN);
    for (let i = 0; i < trailN; i++) { const h = history[Math.min(i, history.length - 1)] ?? ballPos; trailPos.set([h.x, h.y, h.z], i * 3); }
    trailGeo.attributes.position.needsUpdate = true; trail.visible = history.length > 2 && s > 2.25;
    // The crowd goes up when the ball lands.
    const excited = s >= 5.0;
    standMat.map = excited && Math.floor(c * 8) % 2 ? crowdJump : crowdCalm;
    for (let i = 0; i < flashCount; i++) { const k = (c * 2.5 + rand(i) * 7) % 1, on = excited && k < 0.1 ? 1 - k / 0.1 : 0; flashCol.set([on, on, on], i * 3); }
    flashGeo.attributes.color.needsUpdate = true;
    placeCamera(c, s, shot);
    drawHud(c, s, shot);
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(rt);
    renderer.render(scene, cam);
    renderer.setRenderTarget(prev);
  }

  return { texture: rt.texture, update, freeze: (c) => { frozen = c; } };
}
