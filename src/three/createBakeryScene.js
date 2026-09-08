import * as THREE from 'three';

export function createBakeryScene(host, isPaused, onContextLost) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Una pastelera con delantal rosa decora un pastel en una mesa de reposteria, escena 3D animada');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 2, -2, 0.1, 50);
  camera.position.set(4.4, 3.5, 7.5);
  camera.lookAt(0, 1.55, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc48f9e, 2.1));
  const light = new THREE.DirectionalLight(0xfff7ef, 2.6);
  light.position.set(-3, 7, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, { left: -4, right: 4, top: 5, bottom: -4 });
  light.shadow.normalBias = 0.035;
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xffd0df, 1.5);
  fill.position.set(4, 3, -3);
  scene.add(fill);

  const materials = {};
  for (const [name, color] of Object.entries({ white: '#fff9fb', pink: '#ed7396', pale: '#f9bad0', coral: '#ff2440', skin: '#eab699', hair: '#583737', dark: '#332528', gold: '#e5b85c', mint: '#9fbfa8' })) {
    materials[name] = new THREE.MeshStandardMaterial({ color, roughness: 0.68 });
  }
  function mesh(geometry, material, position, parent = scene) {
    const item = new THREE.Mesh(geometry, materials[material]);
    item.position.set(...position);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }
  function ball(position, scale, material, parent = scene) {
    const item = mesh(new THREE.SphereGeometry(1, 24, 16), material, position, parent);
    item.scale.set(...scale);
    return item;
  }
  function cylinder(position, radius, height, material, parent = scene) {
    return mesh(new THREE.CylinderGeometry(radius, radius, height, 48), material, position, parent);
  }
  function limb(start, end, radius, material, parent = scene) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const item = mesh(new THREE.CapsuleGeometry(radius, Math.max(0.01, a.distanceTo(b) - radius * 2), 6, 12), material, a.clone().add(b).multiplyScalar(0.5).toArray(), parent);
    item.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    return item;
  }

  // A compact, complete tabletop composition, with no external model downloads.
  cylinder([0, 0.72, 0.1], 1.85, 0.14, 'white');
  cylinder([0, 0.35, 0.1], 0.22, 0.65, 'pale');
  cylinder([0, 0.045, 0.1], 0.8, 0.09, 'pale');
  const chef = new THREE.Group();
  chef.position.set(-0.75, 0, -0.55);
  scene.add(chef);
  ball([0, 1.03, 0], [0.32, 0.25, 0.26], 'white', chef);
  for (const x of [-0.17, 0.17]) {
    limb([x, 0.98, 0], [x, 0.17, 0], 0.12, 'white', chef);
    ball([x, 0.12, 0.1], [0.14, 0.1, 0.23], 'pink', chef);
  }
  ball([0, 1.57, 0], [0.43, 0.68, 0.31], 'white', chef);
  ball([0, 1.48, 0.23], [0.34, 0.49, 0.1], 'pink', chef);
  limb([-0.22, 1.99, 0.24], [-0.17, 1.56, 0.33], 0.035, 'pink', chef);
  limb([0.22, 1.99, 0.24], [0.17, 1.56, 0.33], 0.035, 'pink', chef);
  ball([0, 1.35, 0.335], [0.17, 0.12, 0.018], 'pale', chef);
  cylinder([0, 2.16, 0], 0.12, 0.22, 'skin', chef);
  const head = new THREE.Group();
  head.position.y = 2.52;
  chef.add(head);
  ball([0, 0.04, -0.06], [0.37, 0.41, 0.31], 'hair', head);
  ball([0, 0, 0.035], [0.34, 0.36, 0.3], 'skin', head);
  ball([-0.29, 0.17, 0.1], [0.1, 0.22, 0.2], 'hair', head);
  ball([0.28, 0.17, 0.1], [0.1, 0.2, 0.18], 'hair', head);
  const eyes = [];
  for (const x of [-0.115, 0.115]) {
    eyes.push(ball([x, 0.025, 0.312], [0.027, 0.04, 0.018], 'dark', head));
    ball([x * 1.7, -0.075, 0.282], [0.053, 0.024, 0.014], 'pink', head);
  }
  ball([0, -0.03, 0.33], [0.036, 0.046, 0.033], 'skin', head);
  const smile = mesh(new THREE.TorusGeometry(0.064, 0.009, 8, 20, Math.PI), 'hair', [0, -0.105, 0.31], head);
  smile.rotation.z = Math.PI;
  cylinder([0, 0.35, 0], 0.31, 0.15, 'white', head);
  for (const [x, y, z, s] of [[-0.2, 0.52, 0, 0.23], [0.06, 0.61, -0.03, 0.27], [0.24, 0.48, 0.04, 0.21], [0, 0.49, 0.2, 0.22]]) {
    ball([x, y, z], [s, s, s], 'white', head);
  }
  limb([-0.34, 1.99, 0.02], [-0.5, 1.59, 0.29], 0.14, 'white', chef);
  limb([-0.5, 1.59, 0.29], [0.05, 1.18, 0.88], 0.095, 'skin', chef);
  ball([0.05, 1.18, 0.88], [0.12, 0.08, 0.1], 'skin', chef);
  const arm = new THREE.Group();
  chef.add(arm);
  limb([0.34, 2.0, 0], [0.68, 1.94, 0.27], 0.135, 'white', arm);
  limb([0.68, 1.94, 0.27], [1.04, 2.03, 0.65], 0.09, 'skin', arm);
  ball([1.04, 2.03, 0.65], [0.105, 0.095, 0.1], 'skin', arm);
  const bag = mesh(new THREE.ConeGeometry(0.15, 0.44, 24), 'pale', [1.15, 1.91, 0.69], arm);
  bag.rotation.z = Math.PI;
  const nozzle = mesh(new THREE.ConeGeometry(0.042, 0.13, 16), 'white', [1.15, 1.635, 0.69], arm);
  nozzle.rotation.z = Math.PI;

  const cake = new THREE.Group();
  cake.position.set(0.62, 0.8, 0.47);
  scene.add(cake);
  cylinder([0, 0.035, 0], 0.69, 0.06, 'gold', cake);
  cylinder([0, 0.38, 0], 0.57, 0.64, 'pink', cake);
  cylinder([0, 0.705, 0], 0.58, 0.055, 'white', cake);
  for (let i = 0; i < 22; i++) {
    const angle = i / 22 * Math.PI * 2;
    const x = Math.cos(angle) * 0.525;
    const z = Math.sin(angle) * 0.525;
    ball([x, 0.75, z], [0.075, 0.075, 0.075], 'white', cake);
    ball([x, 0.09, z], [0.065, 0.046, 0.065], 'pale', cake);
    if (i % 2 === 0) ball([x * 1.065, 0.61, z * 1.065], [0.045, 0.13 + (i % 3) * 0.025, 0.045], 'white', cake);
  }
  for (const x of [-0.22, 0, 0.22]) {
    ball([x, 0.8, 0.08], [0.075, 0.085, 0.075], 'coral', cake);
    limb([x, 0.85, 0.08], [x + 0.025, 0.94, 0.08], 0.012, 'mint', cake);
  }
  // Two small tools balance the composition without filling the scene with props.
  ball([-1.13, 0.87, 0.75], [0.28, 0.13, 0.28], 'pale');
  cylinder([-1.13, 0.95, 0.75], 0.25, 0.02, 'white');
  limb([-1.11, 0.94, 0.75], [-1.37, 1.26, 0.76], 0.023, 'gold');
  cylinder([1.35, 0.87, -0.12], 0.14, 0.16, 'pale');
  ball([1.35, 1.01, -0.12], [0.15, 0.12, 0.15], 'white');
  ball([1.35, 1.13, -0.12], [0.045, 0.045, 0.045], 'coral');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let frame = 0;
  let previous = 0;
  let time = 0;
  let disposed = false;
  let contextLost = false;
  const render = () => renderer.render(scene, camera);
  function tick(now) {
    frame = requestAnimationFrame(tick);
    if (now - previous < 33) return;
    const delta = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    if (contextLost || !visible || document.hidden || reduced.matches || isPaused()) return;
    time += delta;
    arm.rotation.y = Math.sin(time * 0.8) * 0.035;
    head.rotation.z = Math.sin(time * 0.55) * 0.025;
    cake.rotation.y = Math.sin(time * 0.5) * 0.08;
    const blink = time % 6.5 > 6.32 ? 0.15 : 1;
    eyes.forEach((eye) => { eye.scale.y = 0.04 * blink; });
    render();
  }
  const resizeScene = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height || disposed || contextLost) return;
    const aspect = width / height;
    const viewHeight = Math.max(4.45, 4.8 / aspect);
    camera.left = -viewHeight * aspect / 2;
    camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  };
  const resize = new ResizeObserver(resizeScene);
  resize.observe(host);
  resizeScene();
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  observer.observe(host);
  const lost = (event) => { event.preventDefault(); contextLost = true; canvas.style.visibility = 'hidden'; onContextLost(); };
  canvas.addEventListener('webglcontextlost', lost);
  frame = requestAnimationFrame(tick);
  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', lost);
      scene.traverse((object) => object.geometry?.dispose());
      Object.values(materials).forEach((material) => material.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}
