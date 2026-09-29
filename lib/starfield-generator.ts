import * as THREE from 'three';

export function createDeepStarfield(count: number = 3200): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Deep 3D volume
    positions[i3] = (Math.random() - 0.5) * 55.0;
    positions[i3 + 1] = (Math.random() - 0.5) * 35.0;
    positions[i3 + 2] = (Math.random() - 0.5) * 40.0 - 10.0;

    // Mostly dim white with occasional cyan/emerald starlight
    const colorRoll = Math.random();
    if (colorRoll > 0.85) {
      colors[i3] = 0.45;
      colors[i3 + 1] = 0.95;
      colors[i3 + 2] = 0.75;
    } else {
      const b = 0.6 + Math.random() * 0.4;
      colors[i3] = b;
      colors[i3 + 1] = b;
      colors[i3 + 2] = b * 1.05;
    }

    // Very small point sizes
    sizes[i] = 0.7 + Math.random() * 1.4;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1.0 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 color;
      attribute float size;
      varying vec3 vColor;
      varying float vRand;
      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vColor = color;
        vRand = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);

        vec3 pos = position;
        // Extremely slow celestial drift
        pos.y += sin(uTime * 0.15 + vRand * 6.28) * 0.15;
        pos.x += cos(uTime * 0.1 + vRand * 6.28) * 0.15;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Depth size
        gl_PointSize = size * (20.0 / -mvPosition.z) * uPixelRatio;
        gl_PointSize = clamp(gl_PointSize, 0.4, 2.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vRand;
      uniform float uTime;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) discard;

        float d = length(coord);
        float alpha = exp(-d * d * 20.0) * 0.55;
        float twinkle = 0.7 + 0.3 * sin(uTime * 1.5 + vRand * 50.0);

        gl_FragColor = vec4(vColor, alpha * twinkle);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const starfield = new THREE.Points(geometry, material);
  return starfield;
}
