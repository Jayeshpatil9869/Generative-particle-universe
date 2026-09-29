export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform float uMouseActive;
  uniform float uTurbulence;

  attribute vec3 aTargetPosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aRandom;

  varying vec3 vColor;
  varying float vRandom;
  varying float vDepth;

  // Simple 3D noise helper
  vec3 curlNoise(vec3 p) {
    float x = sin(p.y * 1.5 + uTime * 0.6) * cos(p.z * 1.5);
    float y = sin(p.z * 1.5 + uTime * 0.6) * cos(p.x * 1.5);
    float z = sin(p.x * 1.5 + uTime * 0.6) * cos(p.y * 1.5);
    return vec3(x, y, z);
  }

  void main() {
    vColor = aColor;
    vRandom = aRandom;

    // Smooth cubic easing for transition progress
    float progress = smoothstep(0.0, 1.0, uProgress);

    // Primary morph between current position and target position
    vec3 mixedPos = mix(position, aTargetPosition, progress);

    // Arching organic dispersion during transformation midpoint (prevents sterile straight lines)
    float midArc = sin(uProgress * 3.14159265);
    vec3 dispersionDir = normalize(mixedPos + vec3(sin(aRandom * 6.28), cos(aRandom * 6.28), sin(aRandom * 3.14)));
    vec3 morphDisp = dispersionDir * midArc * (0.85 + aRandom * 0.65);

    // Continuous idle organic shimmer and micro-drift
    vec3 idleDrift = vec3(
      sin(uTime * 0.7 + aRandom * 6.2831),
      cos(uTime * 0.6 + aRandom * 6.2831),
      sin(uTime * 0.8 + aRandom * 3.1415)
    ) * 0.06;

    // Fast scroll turbulence
    vec3 turbulenceOffset = curlNoise(mixedPos * 0.4) * (uTurbulence * 0.35);

    // Cursor 3D interactive force
    vec3 mouseOffset = vec3(0.0);
    if (uMouseActive > 0.5) {
      vec3 diff = mixedPos - uMouse;
      float d = length(diff);
      float influenceRadius = 2.4;
      if (d < influenceRadius) {
        float force = (1.0 - smoothstep(0.0, influenceRadius, d)) * 0.6;
        // Ripple & slight repulsion
        mouseOffset = normalize(diff + vec3(0.0001)) * force * (1.0 + sin(uTime * 6.0 - d * 8.0) * 0.2);
      }
    }

    vec3 finalPos = mixedPos + morphDisp + idleDrift + turbulenceOffset + mouseOffset;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Pass depth for atmospheric attenuation
    vDepth = -mvPosition.z;

    // Perspective point size calculation with depth attenuation
    // Calibrated for soft, glowing micro-stardust points matching the reference screenshots
    float attenuation = 25.0 / max(1.0, -mvPosition.z);
    gl_PointSize = uSize * aSize * attenuation * uPixelRatio;

    // Guaranteed soft radius bounds (1.2px up to 8.5px max)
    gl_PointSize = clamp(gl_PointSize, 1.2, 8.5);
  }
`;

export const particleFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vRandom;
  varying float vDepth;
  uniform float uTime;

  void main() {
    // Exact center distance from point sprite: 0.0 at center, 0.5 at boundary
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    // Hard clip outside radius to keep perfect circular boundary
    if (dist > 0.5) {
      discard;
    }

    // --- Circular Radial Falloff using gl_PointCoord ---
    // Normalized distance from center: 0.0 (center) to 1.0 (perimeter)
    float r = dist * 2.0;

    // 1. Soft outer halo with quadratic falloff (completely eliminates hard pixel edges)
    float halo = pow(clamp(1.0 - r, 0.0, 1.0), 1.85);

    // 2. Middle radiant body with exponential gaussian falloff
    float body = exp(-dist * dist * 16.0);

    // 3. Dense intense glowing inner core
    float core = exp(-dist * dist * 52.0);

    // Dynamic micro-twinkle & shimmer
    float twinkle = 0.85 + 0.15 * sin(uTime * 3.4 + vRandom * 62.83);

    // Combined smooth radial alpha for soft, organic light points
    float alpha = (halo * 0.42 + body * 0.58) * twinkle;

    // --- Enhanced Bloom Intensity for Core Emerald & Mint Particles ---
    // Detect Emerald (#00F5A0) and Mint (#72FFD2) based on high green/cyan chromaticity
    float isEmerald = smoothstep(0.72, 0.95, vColor.g) * (1.0 - smoothstep(0.1, 0.45, vColor.r));
    float isMint = smoothstep(0.8, 0.98, vColor.g) * smoothstep(0.65, 0.85, vColor.b) * (1.0 - smoothstep(0.6, 0.92, vColor.r));
    float bloomWeight = max(isEmerald, isMint);

    // Core emerald and mint particles receive heightened emission bloom (up to 2.6x)
    float emissionBoost = 1.0 + bloomWeight * 1.6;

    // Radiate vibrant emerald/mint tint into the corona
    vec3 glowingColor = vColor * emissionBoost;

    // Center core reaches hot starlight white for deep luminous punch
    vec3 hotCoreColor = mix(glowingColor, vec3(1.0, 1.0, 1.0), core * 0.72);

    // Add extra additive glow for emerald/mint particles in the immediate aura
    hotCoreColor += vec3(0.0, 0.38, 0.22) * bloomWeight * body;

    gl_FragColor = vec4(hotCoreColor, alpha);
  }
`;
