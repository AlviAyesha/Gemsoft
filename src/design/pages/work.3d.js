/* eslint-disable */

// Work hero background (trionn.com hero): the GEMSOFT icon as a dark glass/metal 3D object.
// It assembles on load, turns slowly, follows the mouse, can be dragged, blasts apart while you hold the mouse
// and while you scroll. Three thin lines cross the screen through points on the logo; pulses run along them,
// and touching a line throws sparks to the other lines.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

const host = document.getElementById('wHero3d');
const hero = document.getElementById('wHero');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (host && hero) init();

function init() {
  const PIECES = JSON.parse(host.dataset.paths);
  let W = innerWidth, H = innerHeight;
  const dpr = () => Math.min(devicePixelRatio || 1, W < 768 ? 1 : 1.5);
  const S = {
    scrollP: 0, tScrollP: 0, intro: reduce ? 0 : 1, rotX: .3, rotY: .4, dragging: false, px: 0, py: 0,
    holding: false, holdT: 0, burst: 0, vib: 0, vibPh: 0, mx: 0, my: 0, sx: -9999, sy: -9999,
    lineT: 0, undraw: 0, lineProg: [0, 0, 0], weld: 0, sparkLeft: 0, sparkAway: true, sparks: [],
    pulses: [{ l: 0, ph: 0, sp: 1.4, len: .03, on: false, rest: .5, dir: 1 }, { l: 1, ph: 0, sp: 1.3, len: .03, on: false, rest: 2.2, dir: 1 }, { l: 2, ph: 0, sp: 1.35, len: .03, on: false, rest: 4.1, dir: 1 }],
    envReady: false, frame: 0, visible: true
  };

  // ---------- renderer + 2D line layer ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(W, H); renderer.setPixelRatio(dpr());
  renderer.setClearColor(0x0B0B0B, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  host.appendChild(renderer.domElement);
  const lc = document.createElement('canvas'); lc.className = 'w-lines'; host.appendChild(lc);
  const ctx = lc.getContext('2d');
  const sizeLines = () => { const r = dpr(); lc.width = W * r; lc.height = H * r; lc.style.width = W + 'px'; lc.style.height = H + 'px'; ctx.setTransform(r, 0, 0, r, 0, 0) };
  sizeLines();

  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0B0B0B);
  const view = () => W > 1440 ? { fov: 42, z: 6, sc: 1, x: 1.25, y: 0 } : W >= 1024 ? { fov: 40, z: 6.3, sc: .92, x: 1.1, y: -.02 } : W >= 768 ? { fov: 38, z: 7.6, sc: .86, x: .6, y: -.04 } : { fov: 36, z: 9.4, sc: .78, x: 0, y: .35 };
  let V = view();
  const cam = new THREE.PerspectiveCamera(V.fov, W / H, .1, 200); cam.position.set(0, 0, V.z);

  // lights: cool fills from every side + three moving orange point lights (brand colour where trionn uses red)
  scene.add(new THREE.AmbientLight(0x2a3040, 2.8));
  [[0xffffff, 1.6, 4, 5, 4], [0x889aaa, .8, -4, 1, -2], [0xccddee, 1.5, 0, -3, -5], [0x889aaa, 1, -3, 2, 6], [0xaabbcc, 1, 0, 8, 2], [0x6677aa, 1.2, 0, 0, -8], [0x6677aa, 1, -8, 0, 0], [0x6677aa, 1, 8, 0, 0], [0x6677aa, 1, 0, -8, 0]]
    .forEach(([c, i, x, y, z]) => { const l = new THREE.DirectionalLight(c, i); l.position.set(x, y, z); scene.add(l) });
  const p1 = new THREE.PointLight(0xFF7A00, 14, 22); p1.position.set(3, -1, 3); scene.add(p1);
  const p2 = new THREE.PointLight(0xE65A00, 10, 20); p2.position.set(-3, 2, -2); scene.add(p2);
  const p3 = new THREE.PointLight(0xFF9A3D, 6, 14); p3.position.set(0, 4, 3); scene.add(p3);

  // orange dust
  const dustG = new THREE.BufferGeometry(), dp = new Float32Array(600);
  for (let i = 0; i < 600; i++) dp[i] = (Math.random() - .5) * 20;
  dustG.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dustG, new THREE.PointsMaterial({ color: 0xFF7A00, size: .022, transparent: true, opacity: .35 }));
  scene.add(dust);

  // reflections come from a cube camera that renders the scene around the logo
  const cubeRT = new THREE.WebGLCubeRenderTarget(256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  const cubeCam = new THREE.CubeCamera(.1, 100, cubeRT); scene.add(cubeCam);
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x464a52, emissive: new THREE.Color(0x1c2230), emissiveIntensity: .2, metalness: 1, roughness: .08,
    transmission: .35, ior: 2.4, transparent: true, opacity: .88, reflectivity: 1, clearcoat: 1, clearcoatRoughness: .05,
    envMap: cubeRT.texture, envMapIntensity: 3.4, side: THREE.DoubleSide
  });
  const edgeA = new THREE.LineBasicMaterial({ color: 0x5a6478, transparent: true, opacity: .22 });
  const edgeB = new THREE.LineBasicMaterial({ color: 0x5a6478, transparent: true, opacity: .12 });

  // ---------- the icon: 10 SVG pieces extruded, each split into front / back / side shells that fly apart ----------
  const SC = 2.7 / 646, DEPTH = .42 / SC, CX = 301, CY = 419;
  const group = new THREE.Group(), inner = new THREE.Group();
  inner.scale.set(SC, -SC, SC); group.add(inner); scene.add(group);
  const parts = [];
  const loader = new SVGLoader();
  PIECES.forEach((d, idx) => {
    const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
    const shapes = data.paths.flatMap(p => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.4, bevelSegments: 1, curveSegments: 10 });
    geo.translate(-CX, -CY, -DEPTH / 2);
    const g2 = geo.index ? geo.toNonIndexed() : geo;
    g2.computeBoundingBox(); const ctr = new THREE.Vector3(); g2.boundingBox.getCenter(ctr);
    const pos = g2.attributes.position.array, nor = g2.attributes.normal.array, tris = pos.length / 9, buckets = {};
    for (let t = 0; t < tris; t++) {
      const nz = nor[t * 9 + 2], nx = nor[t * 9], ny = nor[t * 9 + 1];
      // front, back, and side walls split into four by direction, so curved walls break into a few chunks
      const key = nz > .7 ? 'f' : nz < -.7 ? 'b' : 's' + (Math.abs(nx) > Math.abs(ny) ? (nx > 0 ? 'r' : 'l') : (ny > 0 ? 'u' : 'd'));
      (buckets[key] = buckets[key] || []).push(t);
    }
    Object.values(buckets).forEach(list => {
      const P = [], N = []; let sx = 0, sy = 0, sz = 0, ax = 0, ay = 0, az = 0;
      list.forEach(t => { for (let k = 0; k < 9; k++) { P.push(pos[t * 9 + k]); N.push(nor[t * 9 + k]) } sx += pos[t * 9] + pos[t * 9 + 3] + pos[t * 9 + 6]; sy += pos[t * 9 + 1] + pos[t * 9 + 4] + pos[t * 9 + 7]; sz += pos[t * 9 + 2] + pos[t * 9 + 5] + pos[t * 9 + 8]; ax += nor[t * 9]; ay += nor[t * 9 + 1]; az += nor[t * 9 + 2] });
      const n = list.length * 3; sx /= n; sy /= n; sz /= n;
      const bg = new THREE.BufferGeometry();
      bg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
      bg.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(N), 3));
      const mesh = new THREE.Mesh(bg, glass.clone());
      const dir = new THREE.Vector3(sx, -sy, sz).normalize().multiplyScalar(.6).add(new THREE.Vector3(ax, -ay, az).normalize().multiplyScalar(.4)).normalize();
      inner.add(mesh);
      parts.push({ mesh, dir, axis: new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize(), spin: (Math.random() - .5) * .8, delay: Math.random() * .25, idx });
    });
    const eg = new THREE.EdgesGeometry(geo, 8);
    const e1 = new THREE.LineSegments(eg, edgeA), e2 = new THREE.LineSegments(eg, edgeB); e2.scale.setScalar(1.004);
    inner.add(e1, e2);
    parts.push({ mesh: e1, dir: new THREE.Vector3(), axis: new THREE.Vector3(0, 1, 0), spin: 0, delay: 0, idx, edge: true }, { mesh: e2, dir: new THREE.Vector3(), axis: new THREE.Vector3(0, 1, 0), spin: 0, delay: 0, idx, edge: true });
  });
  const place = () => { V = view(); cam.fov = V.fov; cam.position.z = V.z; cam.aspect = W / H; cam.updateProjectionMatrix(); group.scale.setScalar(V.sc); group.position.set(V.x, V.y, 0) };
  place();

  // three anchor points on the logo the lines pass through: flame tip, diamond, base of the G
  const anchors = [new THREE.Vector3((430 - CX) * SC, -(120 - CY) * SC, .21), new THREE.Vector3((300 - CX) * SC, -(560 - CY) * SC, .21), new THREE.Vector3((170 - CX) * SC, -(600 - CY) * SC, .21)];
  const tmp = new THREE.Vector3();
  const project = v => { tmp.copy(v).applyMatrix4(group.matrixWorld); const z = tmp.z; tmp.project(cam); return { x: (tmp.x + 1) / 2 * W, y: (-tmp.y + 1) / 2 * H, z } };

  // a gently waving quadratic curve from (x0,y0) to (x1,y1) that passes through (mx,my)
  const curve = (x0, y0, mx, my, x1, y1, seed) => {
    const cx = 2 * mx - .5 * x0 - .5 * x1, cy = 2 * my - .5 * y0 - .5 * y1, out = [], len = Math.hypot(x1 - x0, y1 - y0) || 1;
    for (let i = 0; i <= 160; i++) {
      const a = i / 160, h = 1 - a, px = h * h * x0 + 2 * h * a * cx + a * a * x1, py = h * h * y0 + 2 * h * a * cy + a * a * y1;
      const dx = 2 * h * (cx - x0) + 2 * a * (x1 - cx), dy = 2 * h * (cy - y0) + 2 * a * (y1 - cy), dl = Math.hypot(dx, dy) || 1;
      const w = (.75 * Math.sin(.38 * S.lineT + 2.1 * seed + a * Math.PI * 1.1) + .25 * Math.sin(.19 * S.lineT + .9 * seed + a * Math.PI * 1.9)) * Math.sin(a * Math.PI) * (.01 * len);
      out.push({ x: px - dy / dl * w, y: py + dx / dl * w, t: a });
    }
    return out;
  };
  // line draws out from its middle; it fades near the logo centre so it reads as passing behind
  const drawLine = (pts, prog, undraw, cx, cy, rad) => {
    const n = pts.length, mid = Math.floor(n / 2), d = Math.round(n / 2 * prog), u = Math.round(n / 2 * undraw), a = Math.max(0, mid - d + u), b = Math.min(n - 1, mid + d - u);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = .85; ctx.strokeStyle = 'rgb(70,74,84)';
    const seg = (i, j) => { const p = pts[i], f = Math.max(0, 1 - Math.hypot(p.x - cx, p.y - cy) / rad); ctx.globalAlpha = .45 * (1 - .65 * f); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke() };
    for (let i = mid; i > a; i--) seg(i, i - 1);
    for (let i = mid; i < b; i++) seg(i, i + 1);
    ctx.restore();
  };
  // a pulse: a short bright run along the line, orange at the head fading to warm white
  const drawPulse = (pts, head, len) => {
    const L = 1.4 * len, seg = pts.filter(p => head - p.t >= 0 && head - p.t < L);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = .9;
    for (let i = 0; i < seg.length - 1; i++) {
      const r = (head - seg[i].t) / L, k = Math.pow(1 - r, .5);
      ctx.strokeStyle = r < .45 ? `rgb(255,${Math.round(122 + 60 * r)},${Math.round(20 * r)})` : `rgb(255,${Math.round(200 + 40 * (r - .45))},${Math.round(160 + 80 * (r - .45))})`;
      ctx.globalAlpha = .95 * k; ctx.beginPath(); ctx.moveTo(seg[i].x, seg[i].y); ctx.lineTo(seg[i + 1].x, seg[i + 1].y); ctx.stroke();
    }
    ctx.restore();
  };
  const nearLine = pts => { for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy; if (l < .001) continue; const t = Math.max(0, Math.min(1, ((S.sx - a.x) * dx + (S.sy - a.y) * dy) / l)), x = a.x + t * dx, y = a.y + t * dy; if ((x - S.sx) ** 2 + (y - S.sy) ** 2 < 196) return { x, y } } return null };
  // spark: a jagged bolt from the touch point to the nearest point of another line
  const bolt = (from, to) => { const pts = [from], n = 9, dx = to.x - from.x, dy = to.y - from.y, len = Math.hypot(dx, dy) || 1, s = Math.random() > .5 ? 1 : -1; for (let i = 1; i < n; i++) { const u = i / n, j = Math.min(.18 * len, 26) * Math.sin(u * Math.PI); pts.push({ x: from.x + dx * u + (Math.random() - .5) * j - dy / len * j * .4 * s, y: from.y + dy * u + (Math.random() - .5) * j + dx / len * j * .4 * s }) } pts.push(to); return { pts, life: .05 + .09 * Math.random(), max: 0, col: ['#ffffff', '#FFB066', '#FF7A00', '#ffd9b0'][Math.floor(Math.random() * 4)] } };

  // ---------- input ----------
  const vib = ['w-h1', 'wCta'].map(id => document.getElementById(id)).filter(Boolean);
  addEventListener('pointermove', e => {
    S.mx = e.clientX / W * 2 - 1; S.my = -(e.clientY / H) * 2 + 1; S.sx = e.clientX; S.sy = e.clientY;
    if (S.dragging) { S.rotY += (e.clientX - S.px) * .025; S.rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, S.rotX + (e.clientY - S.py) * .025)); S.px = e.clientX; S.py = e.clientY }
  }, { passive: true });
  hero.addEventListener('pointerdown', e => { if (e.target.closest('a,button')) return; S.holding = true; S.holdT = 0; S.dragging = e.pointerType === 'mouse'; S.px = e.clientX; S.py = e.clientY });
  addEventListener('pointerup', () => { S.holding = false; S.dragging = false });
  addEventListener('pointercancel', () => { S.holding = false; S.dragging = false });
  addEventListener('resize', () => { W = innerWidth; H = innerHeight; renderer.setSize(W, H); renderer.setPixelRatio(dpr()); sizeLines(); place() });
  new IntersectionObserver(([en]) => { S.visible = en.isIntersecting }, { threshold: 0 }).observe(hero);

  // ---------- loop ----------
  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    if (!S.visible) return;
    const dt = Math.min(.05, clock.getDelta()), k = dt * 60, t = clock.elapsedTime;
    const o = Math.max(0, -hero.getBoundingClientRect().top) / H;   // viewports scrolled through the hero
    S.tScrollP = o <= .1 ? 0 : o <= 1 ? (o - .1) / .9 : 1;
    S.scrollP += (S.tScrollP - S.scrollP) * Math.min(1, .06 * k);
    S.intro = S.intro > .001 ? S.intro * Math.pow(.975, k) : 0;
    if (!S.dragging) { S.rotY += (reduce ? .0015 : .0042) * k; group.rotation.x += (S.rotX + .22 * S.my - group.rotation.x) * .06; group.rotation.y += (S.rotY + .22 * S.mx - group.rotation.y) * .06 } else { group.rotation.x = S.rotX; group.rotation.y = S.rotY }
    // hold to blast: shake, then burst
    if (S.holding) { S.holdT += dt; S.vib = 1; if (S.holdT >= .5) { S.vib *= .88; S.burst = Math.min(1, S.burst + .02) } } else { S.vib = Math.max(0, S.vib - .08); S.burst = Math.max(0, S.burst - .025) }
    S.vibPh += 1.1;
    vib.forEach((el, i) => {
      if (S.holding && S.holdT < .7) { el.style.transition = 'none'; el.style.transform = `translate(${Math.sin(S.vibPh) * S.vib * 2.5}px,${Math.cos(1.3 * S.vibPh) * S.vib * 1.5}px)` }
      else if (S.burst > .01) { const a = i * Math.PI, k = .8 * t; el.style.transition = 'none'; el.style.transform = `perspective(600px) translate(${Math.sin(k + a) * S.burst * 30}px,${Math.cos(.6 * k + a) * S.burst * 20}px) rotateX(${Math.sin(k + a) * S.burst * 25}deg) rotateY(${Math.cos(.7 * k + a) * S.burst * 20}deg)` }
      else if (el.style.transform && !el._reset) { el.style.transition = 'transform .7s cubic-bezier(.25,.46,.45,.94)'; el.style.transform = 'none'; el._reset = true }
      if (S.holding || S.burst > .01) el._reset = false;
    });
    const P = Math.max(S.scrollP, S.scrollP < .15 ? S.burst : 0, S.intro);
    parts.forEach(p => {
      const n = Math.max(0, P - p.delay), a = 5.5 * n / SC, ph = p.idx * (2 * Math.PI / 10);
      const fx = .012 * Math.sin(.4 * t + ph) * (1 - P) / SC, fy = .008 * Math.cos(.35 * t + ph) * (1 - P) / SC;
      const sh = .018 * S.vib * (1 - S.burst) / SC;
      p.mesh.position.set(p.dir.x * a + fx + Math.sin(S.vibPh + 20 * p.delay) * sh, -(p.dir.y * a + fy + Math.cos(1.3 * S.vibPh + 2 * p.idx) * sh), p.dir.z * a);
      p.mesh.rotation.set(p.axis.x * p.spin * n * Math.PI, p.axis.y * p.spin * n * Math.PI, p.axis.z * p.spin * n * Math.PI);
    });
    p1.position.set(4 * Math.sin(.6 * t), 2 * Math.cos(.4 * t), 3 * Math.cos(.5 * t) + 2);
    p2.position.set(4 * Math.cos(.5 * t), 2 * Math.sin(.7 * t), 3 * Math.sin(.3 * t) - 1);
    dust.rotation.y = t * .02;
    group.visible = false;
    if (!S.envReady || (S.frame++ % 6 === 0 && (S.burst > .01 || S.holding))) { cubeCam.update(renderer, scene); S.envReady = true }
    group.visible = true;
    renderer.render(scene, cam);

    // ---------- lines ----------
    ctx.clearRect(0, 0, W, H);
    S.lineT += dt;
    const und = Math.max(0, Math.min(1, (o - .08) / .44)); S.undraw += (und - S.undraw) * Math.min(1, .045 * k);
    if (S.undraw >= .995) return;
    S.lineProg = S.lineProg.map(v => (v < 1 && S.undraw < .1 && S.intro < .25) ? Math.min(1, v + .0205 * k) : v);
    const A = anchors.map(project), C = project(new THREE.Vector3()), rad = .13 * W;
    const L = [curve(0, H - .15 * H, A[0].x, A[0].y, W, .2 * H, 1), curve(0, H + .13 * H, A[2].x, A[2].y, W, .1 * H, 3), curve(0, H - .07 * H, A[1].x, A[1].y, W, -.065 * H, 2)];
    // touching a line throws sparks to the other lines
    S.weld -= dt;
    let hit = null, hi = -1;
    if (o < .08 && S.undraw < .02 && S.lineProg.every(v => v >= .995)) for (let i = 0; i < 3 && !hit; i++) { const h = nearLine(L[i]); if (h) { hit = h; hi = i } }
    if (hit) {
      if (S.sparkAway) { S.sparkLeft = 5 + Math.floor(2 * Math.random()); S.sparkAway = false }
      if (S.weld <= 0 && S.sparkLeft > 0) {
        [0, 1, 2].filter(i => i !== hi).sort(() => Math.random() - .5).slice(0, Math.random() > .5 ? 1 : 2).forEach(i => {
          let best = null, bd = 1e9; L[i].forEach(p => { const d = (p.x - hit.x) ** 2 + (p.y - hit.y) ** 2; if (d < bd) { bd = d; best = p } });
          if (best) for (let k = 0; k < 2; k++) { const b = bolt(hit, best); b.max = b.life; S.sparks.push(b) }
        });
        S.weld = .04 + .06 * Math.random(); S.sparkLeft--;
      }
    } else { S.sparkAway = true; S.sparkLeft = 0 }
    L.forEach((pts, i) => drawLine(pts, S.lineProg[i], S.undraw, C.x, C.y, rad));
    S.pulses.forEach((p, i) => {
      if (p.on) {
        p.ph += p.dir * p.sp * dt;
        if (p.dir === 1 ? p.ph >= .5 + p.len : p.ph <= .5 - p.len) { p.on = false; p.rest = 1.5 + 2.5 * Math.abs(Math.sin(7.3 * S.lineT + 3.1 * i)) }
        const pts = L[p.l]; p.dir === 1 ? drawPulse(pts, p.ph, p.len) : drawPulse(pts.slice().reverse().map((q, k) => ({ ...q, t: k / (pts.length - 1) })), 1 - p.ph, p.len);
      } else { p.rest -= dt; if (p.rest <= 0) { p.on = true; p.dir = Math.random() > .5 ? 1 : -1; p.ph = p.dir === 1 ? -p.len : 1 + p.len } }
    });
    // anchor dots on the logo with a breathing ring
    const fade = S.undraw < .95 ? 1 : Math.max(0, 1 - (S.undraw - .95) / .05), now = performance.now() / 1000;
    A.forEach((a, i) => {
      const m = L[[0, 2, 1][i]][80], u = (Math.sin(1.8 * now + 2.1 * i) + 1) / 2, dz = fade * Math.max(.15, Math.min(1, 1.5 * a.z + .6));
      ctx.save(); ctx.globalAlpha = .7 * dz; ctx.fillStyle = 'rgb(200,190,180)'; ctx.beginPath(); ctx.arc(m.x, m.y, 1.8, 0, 7); ctx.fill();
      ctx.globalAlpha = .6 * (1 - u) * .18 * dz; ctx.strokeStyle = 'rgb(255,154,61)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(m.x, m.y, 4 + 3 * u, 0, 7); ctx.stroke(); ctx.restore();
    });
    // sparks
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    S.sparks = S.sparks.filter(b => (b.life -= dt) > 0);
    S.sparks.forEach(b => {
      const k = b.life / b.max * (.7 + .3 * Math.random());
      [[6, .08], [3, .2], [1.2, .9]].forEach(([w, a]) => { ctx.globalAlpha = a * k; ctx.lineWidth = w; ctx.strokeStyle = w > 2 ? '#FF7A00' : b.col; ctx.beginPath(); ctx.moveTo(b.pts[0].x, b.pts[0].y); b.pts.forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke() });
    });
    ctx.restore();
  };
  tick();
  host.classList.add('on');
}

