import { BufferAttribute, BufferGeometry } from "three";

const BOUNDS = { x: 40, y: 30 } as const;
const LINK_DISTANCE = 14;
const MAX_LINKS = 900;

export interface Particles {
  geometry: BufferGeometry;
  positions: Float32Array;
  count: number;
  step: () => void;
}

export function createParticles(count: number): Particles {
  const positions = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    velocity[i * 2] = (Math.random() - 0.5) * 0.018;
    velocity[i * 2 + 1] = (Math.random() - 0.5) * 0.018;
  }
  const geometry = new BufferGeometry();
  const attribute = new BufferAttribute(positions, 3);
  geometry.setAttribute("position", attribute);

  const step = () => {
    for (let i = 0; i < count; i++) {
      const x = i * 3;
      const vx = i * 2;
      positions[x] = (positions[x] ?? 0) + (velocity[vx] ?? 0);
      positions[x + 1] = (positions[x + 1] ?? 0) + (velocity[vx + 1] ?? 0);
      if (Math.abs(positions[x] ?? 0) > BOUNDS.x)
        velocity[vx] = -(velocity[vx] ?? 0);
      if (Math.abs(positions[x + 1] ?? 0) > BOUNDS.y)
        velocity[vx + 1] = -(velocity[vx + 1] ?? 0);
    }
    attribute.needsUpdate = true;
  };

  return { geometry, positions, count, step };
}

/**
 * Line segments between particles closer than LINK_DISTANCE. One buffer is
 * allocated up front and only its draw range changes, instead of building a
 * new geometry on every rebuild as the original did.
 */
export function createLinkBuffer({ positions, count }: Particles) {
  const buffer = new Float32Array(MAX_LINKS * 6);
  const geometry = new BufferGeometry();
  const attribute = new BufferAttribute(buffer, 3);
  geometry.setAttribute("position", attribute);
  const limit = LINK_DISTANCE * LINK_DISTANCE;

  const update = () => {
    let links = 0;
    for (let i = 0; i < count && links < MAX_LINKS; i++) {
      const ax = positions[i * 3] ?? 0;
      const ay = positions[i * 3 + 1] ?? 0;
      const az = positions[i * 3 + 2] ?? 0;
      for (let j = i + 1; j < count && links < MAX_LINKS; j++) {
        const dx = ax - (positions[j * 3] ?? 0);
        const dy = ay - (positions[j * 3 + 1] ?? 0);
        const dz = az - (positions[j * 3 + 2] ?? 0);
        if (dx * dx + dy * dy + dz * dz >= limit) continue;
        buffer.set(
          [
            ax,
            ay,
            az,
            positions[j * 3] ?? 0,
            positions[j * 3 + 1] ?? 0,
            positions[j * 3 + 2] ?? 0,
          ],
          links * 6,
        );
        links += 1;
      }
    }
    geometry.setDrawRange(0, links * 2);
    attribute.needsUpdate = true;
  };

  update();
  return { geometry, update };
}
