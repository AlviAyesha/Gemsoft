/* eslint-disable */

// Contact hero (trionn.com/contact "hanging lion"): the GEMSOFT icon in orange metal and chrome hangs from a thin cable.
// It drops in on a bouncy cable after the page curtain, swings like a pendulum, slowly twists on the cable,
// gets pushed by the mouse when you sweep across it, and can be grabbed and thrown.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const host = document.getElementById('cHang');
const hero = document.getElementById('cHero');
if (host && hero && !document.documentElement.classList.contains('rm')) { try { init() } catch (err) { console.warn('hang3d', err) } }

function init() {
  const PIECES = JSON.parse(host.dataset.paths);
  let W = host.clientWidth, H = host.clientHeight;
  const R = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  R.setPixelRatio(Math.min(devicePixelRatio || 1, W < 768 ? 1.5 : 2)); R.setSize(W, H); R.setClearColor(0x000000, 0);
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  host.appendChild(R.domElement);

  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xFF7A00, 4); rim.position.set(-6, 1, -4); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xFF9A3D, 2.5); rim2.position.set(6, -2, -5); scene.add(rim2);
  scene.add(new THREE.AmbientLight(0x606060, 1.2));
  const front = new THREE.PointLight(0xffffff, 18, 30); front.position.set(0, 1, 7); scene.add(front);
  const cam = new THREE.PerspectiveCamera(30, W / H, .1, 100); cam.position.set(0, 0, 12);

  // ---------- the icon: same pieces and materials as the turning gem on the home page ----------
  const flame = new THREE.MeshPhysicalMaterial({ color: 0xFF7A00, metalness: .55, roughness: .28, clearcoat: 1, clearcoatRoughness: .15, envMapIntensity: 1.1 });
  const facet = new THREE.MeshPhysicalMaterial({ color: 0xe8ebf0, metalness: .9, roughness: .12, clearcoat: 1, clearcoatRoughness: .05, envMapIntensity: 3.2 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, metalness: .8, roughness: .35 });
  const SC = 1 / 646, DEPTH = .09 / SC, CX = 301, CY = 419;
  const inner = new THREE.Group(); inner.scale.set(SC, -SC, SC);
  const loader = new SVGLoader();
  let top = { x: 0, y: Infinity };   // highest point of the icon (smallest SVG y): the cable ties on there
  PIECES.forEach((d, i) => {
    const sh = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`).paths.flatMap(p => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(sh, { depth: DEPTH, bevelEnabled: true, bevelThickness: 6, bevelSize: 4, bevelSegments: 3, curveSegments: 16 });
    geo.translate(-CX, -CY, -DEPTH / 2);
    const p = geo.attributes.position.array;
    for (let k = 0; k < p.length; k += 3) if (p[k + 1] < top.y) top = { x: p[k], y: p[k + 1] };
    inner.add(new THREE.Mesh(geo, i < 3 ? flame : facet));
  });
  // the icon hangs with its tip at the origin; centre of the drawing sits below the tip
  const icon = new THREE.Group(); icon.add(inner); inner.position.set(-top.x * SC, top.y * SC, 0);
  const bead = new THREE.Mesh(new THREE.TorusGeometry(.016, .006, 8, 20), steel); bead.position.y = .01; icon.add(bead);
  const twist = new THREE.Group(); twist.add(icon);
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 6), steel);
  const swing = new THREE.Group(); swing.add(cable, twist); scene.add(swing);
  const centre = new THREE.Vector3(-top.x * SC, top.y * SC - .5, 0);   // icon centre in icon space, before scaling

  // ---------- layout: icon fills the top of the hero, title sits below it ----------
  let vh = 1, size = 1, len = 1;
  const layout = () => {
    W = host.clientWidth; H = host.clientHeight; cam.aspect = W / H; cam.updateProjectionMatrix(); R.setSize(W, H);
    vh = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)); const vw = vh * cam.aspect, mob = W < 768;
    size = Math.min(vh * (mob ? .4 : .48), vw * (mob ? .56 : .5) / .61);
    swing.position.y = vh / 2 + .02;
    len = vh * (mob ? .2 : .17) + .02;
    icon.scale.setScalar(size);
    cable.scale.set(mob ? .006 : .0045, len, mob ? .006 : .0045); cable.position.y = -len / 2;
  };
  layout();

  // ---------- motion: pendulum (swing) + twist on the cable + drop-in ----------
  const S = { a: 0, va: 0, b: 0, vb: 0, tw: -.6, vtw: 0, drop: 1, vdrop: 0, live: false, grab: false, gx: 0, t: 0, vis: true, hover: false };
  const g = 2.6, damp = .45;
  const start = () => { if (S.live) return; S.live = true; S.va = .35; S.vtw = .8 };
  addEventListener('cp-intro', start, { once: true }); setTimeout(start, 3200);

  // screen position of the icon centre, for hit tests
  const sc = new THREE.Vector3();
  const iconScreen = () => { sc.copy(centre).multiplyScalar(size); twist.localToWorld(sc); sc.project(cam); const r = host.getBoundingClientRect(); return { x: r.left + (sc.x + 1) / 2 * W, y: r.top + (1 - sc.y) / 2 * H, rad: size / vh * H * .5 } };
  let lastX = null;
  addEventListener('pointermove', ev => {
    if (!S.vis) return;
    const dx = lastX == null ? 0 : ev.clientX - lastX; lastX = ev.clientX;
    const c = iconScreen(), d = Math.hypot(ev.clientX - c.x, ev.clientY - c.y);
    S.hover = d < c.rad * 1.05; host.style.cursor = S.grab ? 'grabbing' : S.hover ? 'grab' : '';
    if (S.grab) { S.gx = ev.clientX; return }
    if (d < c.rad * 1.35 && S.live) { S.va += dx * .0016; S.vtw += dx * .004; S.vb += (ev.clientY > c.y ? 1 : -1) * Math.abs(dx) * .0006 }
  }, { passive: true });
  host.addEventListener('pointerdown', ev => { if (!S.hover || !S.live) return; S.grab = true; S.gx = ev.clientX; host.setPointerCapture(ev.pointerId); host.style.cursor = 'grabbing' });
  const release = () => { if (!S.grab) return; S.grab = false; host.style.cursor = S.hover ? 'grab' : '' };
  host.addEventListener('pointerup', release); host.addEventListener('pointercancel', release);

  // render only while the hero is on screen (checked by position: the pin moves the hero around in the DOM)
  const seen = () => { const r = hero.getBoundingClientRect(); S.vis = r.bottom > 0 && r.top < innerHeight };
  addEventListener('scroll', seen, { passive: true }); seen();
  addEventListener('resize', layout);

  let prev = performance.now(), first = true;
  const loop = now => {
    requestAnimationFrame(loop);
    const dt = Math.max(0, Math.min(.05, (now - prev) / 1000)); prev = now;
    if (!S.vis || document.hidden) return;
    S.t += dt;
    if (S.grab) {   // the icon follows the pointer sideways; the cable angle comes from the pointer position
      const r = host.getBoundingClientRect(), wx = ((S.gx - r.left) / W * 2 - 1) * vh * cam.aspect / 2;
      const want = Math.atan2(wx, len + size * .5) * .9, na = S.a + (want - S.a) * .25; S.va = (na - S.a) / Math.max(dt, .001) * .9; S.a = na;
    } else {
      S.va += (-g * Math.sin(S.a) - damp * S.va) * dt; S.a += S.va * dt;
    }
    S.vb += (-g * 1.2 * Math.sin(S.b) - damp * S.vb) * dt; S.b += S.vb * dt;
    // the twist drifts gently around a slow idle turn, like a hanging sign
    const idle = Math.sin(S.t * .32) * .55;
    S.vtw += ((idle - S.tw) * .9 - .6 * S.vtw) * dt; S.tw += S.vtw * dt;
    // drop-in: falls from above the screen and bounces on the cable
    if (S.live) { S.vdrop += (-S.drop * 38 - S.vdrop * 5.5) * dt; S.drop += S.vdrop * dt }
    swing.rotation.z = S.a; swing.rotation.x = S.b * .5;
    twist.position.y = -len + S.drop * (len + size * 1.3);
    const cl = Math.max(.001, -twist.position.y); cable.scale.y = cl; cable.position.y = -cl / 2; cable.visible = cl > .01;
    twist.rotation.y = S.tw;
    R.render(scene, cam);
    if (first) { first = false; host.classList.add('on') }
  };
  requestAnimationFrame(loop);
}

