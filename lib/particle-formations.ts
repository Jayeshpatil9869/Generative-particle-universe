import { FormationId, FormationInfo } from '@/types/particles';

export const FORMATIONS_METADATA: FormationInfo[] = [
  {
    id: 'scattered_universe',
    index: 0,
    label: 'Cosmic Field',
    subtitle: 'Interstellar Dispersion',
    tagline: 'EVERYTHING IS IN MOTION.',
    description: 'A loose, expansive particle field drifting through deep celestial space.',
    cameraZ: 10.5,
    cameraY: 0.0,
    rotationSpeed: 0.0006,
  },
  {
    id: 'sphere_core',
    index: 1,
    label: 'Celestial Core',
    subtitle: 'Spherical Ingathering',
    tagline: 'MATTER CONDENSES INTO MASS.',
    description: 'Thousands of micro-particles converge into a dense, breathing celestial sphere.',
    cameraZ: 8.8,
    cameraY: 0.2,
    rotationSpeed: 0.0012,
  },
  {
    id: 'diamond_star',
    index: 2,
    label: 'Astroid Star',
    subtitle: 'Geometric Astroid',
    tagline: 'FORM EMERGES FROM CHAOS.',
    description: 'Curved razor-sharp arms taper into the iconic four-pointed diamond star.',
    cameraZ: 8.2,
    cameraY: 0.0,
    rotationSpeed: 0.0015,
  },
  {
    id: 'vortex_accretion',
    index: 3,
    label: 'Accretion Disk',
    subtitle: 'Gravitational Well',
    tagline: 'SPACE CURVES TOWARD THE VOID.',
    description: 'A swirling accretion vortex wrapping around an invisible central singularity.',
    cameraZ: 9.0,
    cameraY: 1.2,
    rotationSpeed: 0.0022,
  },
  {
    id: 'twin_columns',
    index: 4,
    label: 'Twin Pillars',
    subtitle: 'Resonant Portal',
    tagline: 'DUAL ENERGY STREAMS.',
    description: 'Vertical stardust columns flank a central geometric crystallization.',
    cameraZ: 9.5,
    cameraY: 0.0,
    rotationSpeed: 0.001,
  },
  {
    id: 'double_helix',
    index: 5,
    label: 'Double Helix',
    subtitle: 'Biomorphic Architecture',
    tagline: 'THE ALGORITHM OF LIFE.',
    description: 'Intertwined counter-rotating ribbons forming the molecular blueprint of matter.',
    cameraZ: 8.6,
    cameraY: 0.3,
    rotationSpeed: 0.0018,
  },
  {
    id: 'infinity_knot',
    index: 6,
    label: 'Trefoil Infinity',
    subtitle: 'Non-Euclidean Loop',
    tagline: 'WITHOUT BEGINNING OR END.',
    description: 'A continuous three-dimensional ribbon weaving through topological space.',
    cameraZ: 8.4,
    cameraY: 0.4,
    rotationSpeed: 0.0014,
  },
  {
    id: 'cosmic_explosion',
    index: 7,
    label: 'Kinetic Expansion',
    subtitle: 'Supernova Dispersion',
    tagline: 'ENERGY RELEASED TO THE VOID.',
    description: 'Structures break apart into a volumetric cloud of high-velocity stardust.',
    cameraZ: 11.2,
    cameraY: 0.0,
    rotationSpeed: 0.0008,
  },
  {
    id: 'organic_wave',
    index: 8,
    label: 'Quantum Wave',
    subtitle: 'Undulating Lattice',
    tagline: 'CONTINUOUS VIBRATIONAL FIELD.',
    description: 'Harmonic sine interference creates a living, breathing particle landscape.',
    cameraZ: 8.8,
    cameraY: 1.8,
    rotationSpeed: 0.0012,
  },
  {
    id: 'master_constellation',
    index: 9,
    label: 'Master Formation',
    subtitle: 'Culmination Portal',
    tagline: 'THE UNIVERSE REMEMBERS ITSELF.',
    description: 'The synthesis of geometric diamond symmetry, orbital ring, and ethereal haze.',
    cameraZ: 8.0,
    cameraY: 0.0,
    rotationSpeed: 0.0016,
  },
];

// Helper: Pseudo-random generator with deterministic seed
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generate 3D positions for a given formation
 */
export function generateFormationPositions(
  formationId: FormationId,
  count: number
): Float32Array {
  const positions = new Float32Array(count * 3);
  const rand = createSeededRandom(1337);

  switch (formationId) {
    case 'scattered_universe': {
      // Loose deep space field (Image 4 & 8)
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Natural Gaussian-like falloff from center with deep Z range
        const u = rand();
        const v = rand();
        const theta = rand() * Math.PI * 2;
        const phi = Math.acos(2 * rand() - 1);
        const radius = Math.pow(u, 0.45) * 11.5 + (v * 2.0);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta) * 1.35;
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.95;
        positions[i3 + 2] = (radius * Math.cos(phi) * 1.6) + (rand() * 4.0 - 2.0);
      }
      break;
    }

    case 'sphere_core': {
      // Fibonacci / Volume sphere with dense core (Image 3 & 7)
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const y = 1 - (i / (count - 1)) * 2; // -1 to 1
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        // Density distribution: slightly concentrated towards inner core
        const rFactor = Math.pow(rand(), 0.5) * 0.7 + 0.3;
        const baseRadius = 3.6 * rFactor;
        const noise = (rand() - 0.5) * 0.4;
        const r = baseRadius + noise;

        positions[i3] = Math.cos(theta) * radiusAtY * r;
        positions[i3 + 1] = y * r;
        positions[i3 + 2] = Math.sin(theta) * radiusAtY * r;
      }
      break;
    }

    case 'diamond_star': {
      // Astroid 4-point concave star (Images 1 & 6)
      // Equation: |x|^(2/3) + |y|^(2/3) <= R^(2/3)
      const starScale = 4.2;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const angle = rand() * Math.PI * 2;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        // Astroid curve: cos^3 and sin^3 create the sharp 4 points
        const astroidX = Math.sign(cosA) * Math.pow(Math.abs(cosA), 3);
        const astroidY = Math.sign(sinA) * Math.pow(Math.abs(sinA), 3);

        // Fill the interior with concentration towards center
        const fill = Math.pow(rand(), 0.4);
        const px = astroidX * fill * starScale;
        const py = astroidY * fill * starScale;

        // Z thickness: thicker in center, tapering to needle tips
        const distFromCenter = Math.sqrt(px * px + py * py) / starScale;
        const zThickness = Math.max(0.04, (1.0 - distFromCenter * 0.85) * 1.4);
        const pz = (rand() - 0.5) * zThickness * (1.0 + rand() * 0.5);

        // Subtle organic noise jitter so particles look natural
        const jitter = 0.08 * (rand() - 0.5);

        positions[i3] = px + jitter;
        positions[i3 + 1] = py + jitter;
        positions[i3 + 2] = pz + (rand() - 0.5) * 0.2;
      }
      break;
    }

    case 'vortex_accretion': {
      // Swirling black hole accretion disk with central void (Image 2)
      const innerRadius = 0.9;
      const outerRadius = 5.0;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const u = rand();
        // Accretion disk radial density
        const r = innerRadius + Math.pow(u, 0.75) * (outerRadius - innerRadius);
        // Logarithmic spiral arms
        const arms = 2;
        const armOffset = (Math.floor(rand() * arms) * Math.PI * 2) / arms;
        const spiralAngle = Math.log(r / innerRadius) * 2.8 + armOffset;
        const theta = spiralAngle + (rand() - 0.5) * 0.85;

        // Disk tilt in 3D
        const diskX = r * Math.cos(theta);
        const diskZ = r * Math.sin(theta);
        // Disk thickness increases slightly with radius
        const diskY = (rand() - 0.5) * (0.15 + (r / outerRadius) * 0.6);

        // Tilt disk 25 degrees
        const tilt = 0.42;
        positions[i3] = diskX;
        positions[i3 + 1] = diskY * Math.cos(tilt) - diskZ * Math.sin(tilt);
        positions[i3 + 2] = diskY * Math.sin(tilt) + diskZ * Math.cos(tilt);
      }
      break;
    }

    case 'twin_columns': {
      // Twin vertical particle columns flanking central diamond star (Image 5)
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const isCenter = rand() < 0.35; // 35% in center diamond, 65% in twin columns

        if (isCenter) {
          // Central mini-diamond
          const angle = rand() * Math.PI * 2;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const astroidX = Math.sign(cosA) * Math.pow(Math.abs(cosA), 3);
          const astroidY = Math.sign(sinA) * Math.pow(Math.abs(sinA), 3);
          const fill = Math.pow(rand(), 0.5) * 1.8;
          positions[i3] = astroidX * fill;
          positions[i3 + 1] = astroidY * fill;
          positions[i3 + 2] = (rand() - 0.5) * 0.9;
        } else {
          // Twin columns: left (x ≈ -3.8) or right (x ≈ +3.8)
          const isLeft = rand() < 0.5;
          const colX = isLeft ? -3.8 : 3.8;
          const colY = (rand() - 0.5) * 11.0;
          const colZ = (rand() - 0.5) * 1.8;
          const radiusJitter = (rand() - 0.5) * 1.1;

          positions[i3] = colX + radiusJitter;
          positions[i3 + 1] = colY;
          positions[i3 + 2] = colZ;
        }
      }
      break;
    }

    case 'double_helix': {
      // Double DNA helix with cross rungs
      const turns = 4.2;
      const height = 8.5;
      const radius = 2.4;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const t = (rand() - 0.5) * Math.PI * 2 * turns;
        const y = (t / (Math.PI * 2 * turns)) * height;
        const isStrandA = rand() < 0.45;
        const isStrandB = rand() < 0.45;

        let strandAngle = t;
        let r = radius;

        if (isStrandA) {
          strandAngle = t;
        } else if (isStrandB) {
          strandAngle = t + Math.PI;
        } else {
          // Cross bridging rung between strands
          strandAngle = t + (rand() < 0.5 ? 0 : Math.PI);
          r = radius * rand();
        }

        const jitter = (rand() - 0.5) * 0.35;
        positions[i3] = (r + jitter) * Math.cos(strandAngle);
        positions[i3 + 1] = y + jitter;
        positions[i3 + 2] = (r + jitter) * Math.sin(strandAngle);
      }
      break;
    }

    case 'infinity_knot': {
      // Parametric Trefoil Knot / Infinity Loop
      const scale = 1.35;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const t = rand() * Math.PI * 2;
        // Trefoil knot equations
        const cx = Math.sin(t) + 2 * Math.sin(2 * t);
        const cy = Math.cos(t) - 2 * Math.cos(2 * t);
        const cz = -Math.sin(3 * t);

        // Tube volume around curve
        const tubeRadius = 0.55 * Math.pow(rand(), 0.5);
        const tubeAngle = rand() * Math.PI * 2;
        const ox = tubeRadius * Math.cos(tubeAngle);
        const oy = tubeRadius * Math.sin(tubeAngle);
        const oz = (rand() - 0.5) * 0.4;

        positions[i3] = (cx + ox) * scale;
        positions[i3 + 1] = (cy + oy) * scale;
        positions[i3 + 2] = (cz + oz) * scale;
      }
      break;
    }

    case 'cosmic_explosion': {
      // High-velocity radial explosion (Images 9 & 10)
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const theta = rand() * Math.PI * 2;
        const phi = Math.acos(2 * rand() - 1);
        const speed = Math.pow(rand(), 0.35) * 8.5 + 0.8;

        // Direction with directional turbulence
        positions[i3] = Math.sin(phi) * Math.cos(theta) * speed * 1.3;
        positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed * 0.9;
        positions[i3 + 2] = Math.cos(phi) * speed * 1.4;
      }
      break;
    }

    case 'organic_wave': {
      // 3D undulating quantum wave field
      const width = 8.5;
      const depth = 8.5;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = (rand() - 0.5) * width;
        const z = (rand() - 0.5) * depth;
        // Harmonic wave equations
        const dist = Math.sqrt(x * x + z * z);
        const y = Math.sin(dist * 1.8) * 1.1 + Math.cos(x * 1.2) * 0.6 + (rand() - 0.5) * 0.25;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }
      break;
    }

    case 'master_constellation': {
      // Grand Finale: Astroid diamond with an orbital celestial ring and halo
      const starScale = 3.6;
      const ringRadius = 4.8;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const role = rand();

        if (role < 0.55) {
          // Central diamond star
          const angle = rand() * Math.PI * 2;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const astroidX = Math.sign(cosA) * Math.pow(Math.abs(cosA), 3);
          const astroidY = Math.sign(sinA) * Math.pow(Math.abs(sinA), 3);
          const fill = Math.pow(rand(), 0.5);
          positions[i3] = astroidX * fill * starScale;
          positions[i3 + 1] = astroidY * fill * starScale;
          positions[i3 + 2] = (rand() - 0.5) * 0.9;
        } else if (role < 0.85) {
          // Orbital halo ring
          const ringAngle = rand() * Math.PI * 2;
          const r = ringRadius + (rand() - 0.5) * 0.6;
          const tilt = 0.55;
          const rx = r * Math.cos(ringAngle);
          const rz = r * Math.sin(ringAngle);
          const ry = (rand() - 0.5) * 0.4;

          positions[i3] = rx;
          positions[i3 + 1] = ry * Math.cos(tilt) - rz * Math.sin(tilt);
          positions[i3 + 2] = ry * Math.sin(tilt) + rz * Math.cos(tilt);
        } else {
          // Distant outer halo dust
          const theta = rand() * Math.PI * 2;
          const phi = Math.acos(2 * rand() - 1);
          const rad = 5.5 + rand() * 3.5;
          positions[i3] = rad * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = rad * Math.cos(phi);
        }
      }
      break;
    }
  }

  return positions;
}

/**
 * Generate per-particle colors, sizes, and random attributes
 */
export function generateParticleAttributes(count: number): {
  colors: Float32Array;
  sizes: Float32Array;
  randoms: Float32Array;
} {
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const randoms = new Float32Array(count);

  const rand = createSeededRandom(42);

  // Color Palette as specified in user guidelines:
  // Primary Emerald: #00F5A0 (0.0, 0.96, 0.628) ~ 60%
  // Mint: #72FFD2 (0.447, 1.0, 0.824) ~ 25%
  // Crisp White: #FFFFFF (1.0, 1.0, 1.0) ~ 10%
  // Dark Green: #064D3D (0.024, 0.302, 0.239) ~ 5%

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const rVal = rand();

    if (rVal < 0.6) {
      // Emerald
      colors[i3] = 0.0 + (rand() * 0.05);
      colors[i3 + 1] = 0.92 + (rand() * 0.08);
      colors[i3 + 2] = 0.60 + (rand() * 0.08);
    } else if (rVal < 0.85) {
      // Mint / Cyan highlight
      colors[i3] = 0.42 + (rand() * 0.08);
      colors[i3 + 1] = 0.98 + (rand() * 0.02);
      colors[i3 + 2] = 0.80 + (rand() * 0.1);
    } else if (rVal < 0.95) {
      // Starlight White
      colors[i3] = 0.96;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 0.98;
    } else {
      // Dark emerald / deep spatial depth
      colors[i3] = 0.02;
      colors[i3 + 1] = 0.28;
      colors[i3 + 2] = 0.22;
    }

    // Size distribution: Calibrated for tiny, fine glistening stardust (as in images)
    // 93% are tiny micro-stardust points: 0.45 to 0.95
    // 6% are subtle sparkle highlights: 1.05 to 1.6
    // 1% are gentle accent stars: 1.8 to 2.4
    const sizeRoll = rand();
    if (sizeRoll < 0.93) {
      sizes[i] = 0.45 + rand() * 0.5;
    } else if (sizeRoll < 0.99) {
      sizes[i] = 1.05 + rand() * 0.55;
    } else {
      sizes[i] = 1.8 + rand() * 0.6;
    }

    randoms[i] = rand();
  }

  return { colors, sizes, randoms };
}
