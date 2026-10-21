import type { BufferGeometry } from "three";
import {
  Color,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TetrahedronGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { createLinkBuffer, createParticles, type Particles } from "./particles";

// Port of uniqtrix.com's init3DBackground: drifting points joined by faint
// "constellation" lines, low-opacity wireframe solids, and a camera that
// eases toward the pointer. Differences from the original: theme-aware
// colours, a preallocated line buffer, pause while hidden, reduced-motion
// (one static frame), resize handling, and full disposal on unmount.

interface Palette {
  point: Color;
  a: Color;
  b: Color;
  c: Color;
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    new Color(css.getPropertyValue(name).trim() || fallback);
  return {
    point: read("--scene-point", "#10b981"),
    a: read("--scene-a", "#10b981"),
    b: read("--scene-b", "#22d3ee"),
    c: read("--scene-c", "#34d399"),
  };
}

function createShapes(scene: Scene, palette: Palette) {
  const materials = [
    new MeshBasicMaterial({
      color: palette.a,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    }),
    new MeshBasicMaterial({
      color: palette.b,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
    }),
    new MeshBasicMaterial({
      color: palette.c,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    }),
  ] as const;
  const geometries = [
    new OctahedronGeometry(4),
    new TetrahedronGeometry(3),
    new IcosahedronGeometry(2.5),
    new OctahedronGeometry(2.5),
    new TetrahedronGeometry(2),
    new OctahedronGeometry(1.8),
  ];
  const shapes = geometries.map((geometry, i) => {
    const mesh = new Mesh(geometry, materials[i % 3]);
    mesh.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20 - 5,
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(mesh);
    return {
      mesh,
      speed: Math.random() * 0.004 + 0.001,
      dir: Math.random() > 0.5 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
    };
  });

  const ringA = new Mesh(
    new TorusGeometry(8, 0.3, 16, 80),
    new MeshBasicMaterial({
      color: palette.a,
      transparent: true,
      opacity: 0.05,
      wireframe: true,
    }),
  );
  ringA.position.set(25, -10, -15);
  const ringB = new Mesh(
    new TorusGeometry(5, 0.2, 12, 60),
    new MeshBasicMaterial({
      color: palette.b,
      transparent: true,
      opacity: 0.04,
      wireframe: true,
    }),
  );
  ringB.position.set(-30, 15, -20);
  scene.add(ringA, ringB);

  return { shapes, rings: [ringA, ringB] as const, materials };
}

function createRenderer(canvas: HTMLCanvasElement) {
  try {
    // No antialiasing: the scene is soft, ambient detail, and MSAA is the
    // costliest part of each frame on weak GPUs.
    return new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
  } catch {
    return undefined;
  }
}

function disposeScene(scene: Scene) {
  scene.traverse((object) => {
    if (
      object instanceof Mesh ||
      object instanceof Points ||
      object instanceof LineSegments
    ) {
      (object.geometry as BufferGeometry).dispose();
      const material = object.material as
        { dispose: () => void } | { dispose: () => void }[];
      for (const m of Array.isArray(material) ? material : [material])
        m.dispose();
    }
  });
}

const FRAME_MS = 1000 / 30;

export function createConstellation(
  canvas: HTMLCanvasElement,
): (() => void) | undefined {
  const renderer = createRenderer(canvas);
  if (!renderer) return undefined; // No WebGL: the CSS glows stay.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 30;

  let palette = readPalette();
  const particles: Particles = createParticles(
    window.innerWidth < 768 ? 60 : 150,
  );
  const pointsMaterial = new PointsMaterial({
    color: palette.point,
    size: 0.28,
    transparent: true,
    opacity: 0.65,
  });
  const points = new Points(particles.geometry, pointsMaterial);
  scene.add(points);

  const links = createLinkBuffer(particles);
  const lineMaterial = new LineBasicMaterial({
    color: palette.a,
    transparent: true,
    opacity: 0.07,
  });
  scene.add(new LineSegments(links.geometry, lineMaterial));

  const { shapes, rings, materials } = createShapes(scene, palette);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0, y: 0 };
  let frame = 0;
  let raf = 0;
  let last = 0;

  const render = () => {
    renderer.render(scene, camera);
  };
  // Capped at 30 fps; the scene is ambient and doesn't need more.
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (now - last < FRAME_MS) return;
    last = now;
    frame += 1;
    particles.step();
    points.rotation.y += 0.0004;
    for (const s of shapes) {
      s.mesh.rotation.x += s.speed * s.dir;
      s.mesh.rotation.y += s.speed;
      s.mesh.position.y += Math.sin(frame * 0.01 + s.phase) * 0.015;
    }
    rings[0].rotation.x += 0.003;
    rings[0].rotation.y += 0.002;
    rings[1].rotation.x += 0.002;
    rings[1].rotation.z += 0.003;
    if (frame % 30 === 0) links.update();
    camera.position.x += (pointer.x * 12 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 8 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    render();
  };
  const paused = () =>
    reduceMotion.matches ||
    document.hidden ||
    document.documentElement.dataset.motion === "paused";
  const play = () => {
    cancelAnimationFrame(raf);
    if (paused()) {
      links.update();
      render();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 1.8;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 1.2;
  };
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    render();
  };
  const theme = new MutationObserver(() => {
    palette = readPalette();
    pointsMaterial.color.copy(palette.point);
    lineMaterial.color.copy(palette.a);
    materials[0].color.copy(palette.a);
    materials[1].color.copy(palette.b);
    materials[2].color.copy(palette.c);
    play();
  });

  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", play);
  reduceMotion.addEventListener("change", play);
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-motion"],
  });
  play();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", play);
    reduceMotion.removeEventListener("change", play);
    theme.disconnect();
    disposeScene(scene);
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
