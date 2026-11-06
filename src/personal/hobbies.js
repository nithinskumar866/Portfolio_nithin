// Things I love outside work: my electric scooter, parked in front of the guestbook on charge, and a badminton racket on the wall.
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

// How the scooter model sits in the room. flip turns it end to end if the model's nose points the other way.
// angle turns it to face the camera's usual view from the front-right of the room.
const SCOOTER = { at: [5.05, 0, -4.5], length: 2.0, angle: 0.5, flip: true, rearPlateY: 0.57, frontPlateY: 0.78, frontPlateIn: 0.34, lampIn: 0.3, lampY: 0.95, tailY: 0.74, rearIn: 0.2 };

export function buildHobbies({ world, box, cyl, add, mat, HALF }) {
  const parts = [];

  // --- Electric scooter: a moped model (public/models/moped.fbx), recoloured matte black with teal accents, parked facing the room in
  // front of the guestbook corkboard and charging from a socket on the back wall. If the file is missing, it is left out.
  {
    // The scooter's own space: +x is its nose, +y up. The group turns it to face the camera's usual view.
    const ev = new THREE.Group(); ev.userData.station = "scooter";
    ev.position.set(...SCOOTER.at); ev.rotation.y = -Math.PI / 2 + SCOOTER.angle; ev.visible = false; world.add(ev);
    const half = SCOOTER.length / 2;
    const black = mat("#1a1c20", { roughness: 0.72, metalness: 0.1 });
    const rubber = mat("#101113", { roughness: 0.95 });
    const teal = mat("#19d3c5", { roughness: 0.4, metalness: 0.3, emissive: "#0c8f86", emissiveIntensity: 0.35 });
    // Matte black body with a glowing teal stripe along each side, painted in the shader so the model needs no textures.
    const body = mat("#1a1c20", { roughness: 0.68, metalness: 0.12 });
    const stripe = { lo: { value: 0 }, hi: { value: 1 }, axis: { value: 2 } };
    body.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, { uLo: stripe.lo, uHi: stripe.hi, uAxis: stripe.axis });
      shader.vertexShader = "varying vec3 vModelPos; varying vec3 vModelNormal;\n" + shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvModelPos = position; vModelNormal = normal;");
      shader.fragmentShader = "uniform float uLo; uniform float uHi; uniform int uAxis; varying vec3 vModelPos; varying vec3 vModelNormal;\n" + shader.fragmentShader
        .replace("#include <color_fragment>", `#include <color_fragment>
          float side = abs(uAxis == 0 ? vModelNormal.x : uAxis == 1 ? vModelNormal.y : vModelNormal.z);
          float band = step(uLo, vModelPos.y) * step(vModelPos.y, uHi) * step(0.55, side);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.1, 0.83, 0.77), band);`)
        .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(0.03, 0.45, 0.42) * band;`);
    };
    // The model's parts have generic names: the tyres and the fork tubes are picked out by name, the body gets the stripe.
    const pick = (name) => /^pcylinder1[23]$/.test(name) ? rubber : /^pcylinder1[01]$/.test(name) ? teal : /^polysurface1$/.test(name) ? body : black;

    // Headlight and tail light. The headlight brightens when you come to look at the scooter.
    const lampMat = new THREE.MeshBasicMaterial({ color: "#9fefff", toneMapped: false });
    const tailMat = new THREE.MeshBasicMaterial({ color: "#ff3344", toneMapped: false });

    new FBXLoader().load("/models/moped.fbx", (model) => {
      model.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = true; o.raycast = () => {};
        o.material = pick(o.name.toLowerCase());
        if (o.material === body) {
          // Put the stripe a little below the middle of the body, on the faces that point sideways.
          o.geometry.computeBoundingBox();
          const b = o.geometry.boundingBox, size = b.getSize(new THREE.Vector3());
          stripe.axis.value = size.x < size.z ? 0 : 2;
          stripe.lo.value = b.min.y + size.y * 0.42; stripe.hi.value = b.min.y + size.y * 0.455;
        }
      });
      // Lay its length along x, scale it to the room, and stand it on the floor.
      const fit = new THREE.Group(); fit.add(model); // measured before it joins the room, so its box is in its own space
      let size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
      if (size.z > size.x) model.rotation.y = Math.PI / 2;
      model.rotation.y += SCOOTER.flip ? Math.PI : 0;
      model.updateMatrixWorld(true);
      size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
      fit.scale.setScalar(SCOOTER.length / size.x);
      fit.updateMatrixWorld(true);
      const box3 = new THREE.Box3().setFromObject(fit), centre = box3.getCenter(new THREE.Vector3());
      fit.position.set(-centre.x, -box3.min.y, -centre.z);
      ev.add(fit);
      // An invisible box the size of the scooter makes it easy to click.
      const dims = box3.getSize(new THREE.Vector3());
      const hit = new THREE.Mesh(new THREE.BoxGeometry(dims.x, dims.y, dims.z), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
      hit.position.y = dims.y / 2; ev.add(hit);
      ev.visible = true;
    }, undefined, () => {});

    add(new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.16), lampMat), ev, half - SCOOTER.lampIn, SCOOTER.lampY, 0, false);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.2), tailMat), ev, -half + SCOOTER.rearIn + 0.02, SCOOTER.tailY, 0, false);

    // Green number plates, front and back, the mark of an electric vehicle in India. Left blank on purpose.
    const plate = (x, y, w, h) => {
      const g = new THREE.Group(); g.position.set(x, y, 0); ev.add(g);
      box(0.01, h + 0.02, w + 0.02, mat("#f2f2f2"), g, 0, 0, 0, 0.006);
      add(new THREE.Mesh(new THREE.BoxGeometry(0.016, h, w), mat("#1f9d55", { roughness: 0.5 })), g, 0, 0, 0, false);
    };
    plate(-half + SCOOTER.rearIn, SCOOTER.rearPlateY, 0.26, 0.14);
    plate(half - SCOOTER.frontPlateIn, SCOOTER.frontPlateY, 0.2, 0.11);

    // Charging: a cable from under the seat, along the floor, up to a wall charger behind it.
    ev.updateMatrixWorld(true);
    const start = ev.localToWorld(new THREE.Vector3(-half * 0.35, 0.5, 0.22));
    const socket = new THREE.Vector3(SCOOTER.at[0] - 0.75, 0.55, 0.32 - HALF);
    const floorY = 0.05;
    const cablePath = new THREE.CatmullRomCurve3([
      start, new THREE.Vector3(start.x, 0.25, start.z + 0.05), new THREE.Vector3(start.x - 0.05, floorY, start.z + 0.1),
      new THREE.Vector3(socket.x + 0.15, floorY, socket.z + 0.35), new THREE.Vector3(socket.x, floorY + 0.02, socket.z + 0.08),
      new THREE.Vector3(socket.x, 0.3, socket.z + 0.03), socket,
    ], false, "catmullrom", 0.2);
    add(new THREE.Mesh(new THREE.TubeGeometry(cablePath, 80, 0.016, 8, false), mat("#22252b", { roughness: 0.6 })), world, 0, 0, 0, false);
    const charger = box(0.24, 0.3, 0.08, mat("#e8e4dc"), world, socket.x, socket.y + 0.1, socket.z, 0.02);
    const chargeLed = new THREE.MeshBasicMaterial({ color: "#19d3c5", toneMapped: false });
    add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.01), chargeLed), charger, 0, 0.08, 0.042, false);
    // Pulses of light travelling down the cable into the scooter.
    const pulseMat = new THREE.MeshBasicMaterial({ color: "#6ff5ea", toneMapped: false, transparent: true, opacity: 0.9 });
    const pulses = [0, 1, 2].map(() => add(new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), pulseMat), world, 0, 0, 0, false));
    // A small battery readout floating over the seat, filling up as it charges.
    const bc = document.createElement("canvas"); bc.width = 160; bc.height = 80;
    const batteryTex = new THREE.CanvasTexture(bc); batteryTex.colorSpace = THREE.SRGBColorSpace;
    const battery = new THREE.Sprite(new THREE.SpriteMaterial({ map: batteryTex, transparent: true, depthWrite: false }));
    battery.scale.set(0.42, 0.21, 1); battery.position.set(-half * 0.15, 1.42, 0); ev.add(battery);
    let shownLevel = -1;
    const drawBattery = (level) => {
      if (level === shownLevel) return;
      shownLevel = level;
      const g = bc.getContext("2d"); g.clearRect(0, 0, 160, 80);
      g.fillStyle = "rgba(8, 22, 28, 0.82)"; g.beginPath(); g.roundRect(2, 2, 156, 76, 16); g.fill();
      g.strokeStyle = "#19d3c5"; g.lineWidth = 4; g.strokeRect(22, 22, 98, 36); g.fillStyle = "#19d3c5"; g.fillRect(120, 32, 8, 16);
      for (let i = 0; i < 4; i++) { g.globalAlpha = i < level ? 1 : 0.15; g.fillRect(28 + i * 23, 28, 18, 24); }
      g.globalAlpha = 1; g.fillStyle = "#f6efe2"; g.beginPath(); g.moveTo(141, 18); g.lineTo(132, 42); g.lineTo(140, 42); g.lineTo(135, 62); g.lineTo(150, 34); g.lineTo(142, 34); g.closePath(); g.fill();
      batteryTex.needsUpdate = true;
    };
    drawBattery(0);

    parts.push((t, current) => {
      // Charge bars fill one by one, then start again.
      drawBattery(Math.floor((t * 0.8) % 5));
      const k = 0.55 + Math.sin(t * 3) * 0.45;
      chargeLed.color.setRGB(0.1 * k, 0.83 * k, 0.77 * k);
      pulses.forEach((p, i) => { p.position.copy(cablePath.getPointAt(1 - ((t * 0.35 + i / 3) % 1))); });
      battery.position.y = 1.42 + Math.sin(t * 2) * 0.02;
      lampMat.color.set(current === "scooter" ? "#f2fdff" : "#5fb8c4");
    });
  }

  // --- Badminton racket and a shuttlecock hanging on the left wall, above the home cinema ---
  {
    const wall = new THREE.Group(); wall.position.set(0.3 - HALF + 0.01, 0, -4.75); wall.rotation.y = Math.PI / 2; world.add(wall);
    // Drawn on the wall's surface: +x along the wall, +y up, +z out of the wall.
    const racket = new THREE.Group(); racket.position.set(0, 2.62, 0.05); racket.rotation.z = 0.12; wall.add(racket);
    const frame = mat("#1d2a44", { roughness: 0.4, metalness: 0.3 });
    const head = add(new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.009, 8, 40), frame), racket, 0, 0.18, 0); head.scale.set(0.82, 1.08, 1);
    // Strings: a fine grid drawn on a transparent canvas.
    const sc = document.createElement("canvas"); sc.width = sc.height = 128;
    { const g = sc.getContext("2d"); g.strokeStyle = "rgba(245,245,235,0.85)"; g.lineWidth = 1.4; for (let i = 6; i < 128; i += 9) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); } }
    const strings = new THREE.CanvasTexture(sc); strings.colorSpace = THREE.SRGBColorSpace;
    const net = add(new THREE.Mesh(new THREE.CircleGeometry(0.128, 32), new THREE.MeshBasicMaterial({ map: strings, transparent: true, depthWrite: false, side: THREE.DoubleSide })), racket, 0, 0.18, 0, false);
    net.scale.set(0.82, 1.08, 1);
    // Throat, shaft and grip.
    for (const s of [-1, 1]) { const t = cyl(0.006, 0.006, 0.075, frame, racket, s * 0.011, 0.015, 0, 6); t.rotation.z = s * 0.3; }
    cyl(0.0045, 0.0045, 0.26, mat("#c9ced6", { metalness: 0.6, roughness: 0.3 }), racket, 0, -0.15, 0, 6);
    cyl(0.014, 0.012, 0.2, mat("#b8f34a", { roughness: 0.9 }), racket, 0, -0.37, 0, 10);
    cyl(0.016, 0.016, 0.012, frame, racket, 0, -0.475, 0, 10);
    // The hook it hangs from.
    cyl(0.008, 0.008, 0.06, steel(), wall, -0.02, 2.9, 0.03, 6).rotation.x = Math.PI / 2;

    // A shuttlecock on its own hook beside it: white feathers and a cork base.
    const shuttle = new THREE.Group(); shuttle.position.set(0.3, 2.42, 0.06); shuttle.rotation.z = Math.PI + 0.25; wall.add(shuttle);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.016, 0.075, 16, 1, true), mat("#fbfaf4", { side: THREE.DoubleSide, roughness: 0.9 })), shuttle, 0, 0.05, 0);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat("#d9c7a3")), shuttle, 0, 0.012, 0).rotation.x = Math.PI;
    cyl(0.006, 0.006, 0.05, steel(), wall, 0.29, 2.455, 0.025, 6).rotation.x = Math.PI / 2;

    // Both sway a touch in the cooler's breeze.
    parts.push((t) => { racket.rotation.z = 0.12 + Math.sin(t * 1.3) * 0.012; shuttle.rotation.z = Math.PI + 0.25 + Math.sin(t * 1.7 + 1) * 0.03; });
  }

  function steel() { return mat("#9aa0a8", { roughness: 0.35, metalness: 0.7 }); }

  return { update(t, reduce, current) { if (!reduce) parts.forEach((p) => p(t, current)); } };
}
