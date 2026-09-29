'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  FORMATIONS_METADATA,
  generateFormationPositions,
  generateParticleAttributes,
} from '@/lib/particle-formations';
import { particleVertexShader, particleFragmentShader } from '@/lib/particle-shaders';
import { createDeepStarfield } from '@/lib/starfield-generator';
import { audioSynthesizer } from '@/lib/audio-synthesizer';
import { ParticleSizeMode, ParticleDensityMode } from '@/types/particles';

interface ParticleEngineProps {
  scrollProgress: number; // 0.0 to 1.0
  scrollVelocity: number;
  sizeMode: ParticleSizeMode;
  densityMode: ParticleDensityMode;
  onFormationChange?: (index: number) => void;
}

export function ParticleEngine({
  scrollProgress,
  scrollVelocity,
  sizeMode,
  densityMode,
  onFormationChange,
}: ParticleEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References to keep Three.js state persistent across re-renders
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    pointsMesh: THREE.Points | null;
    starfield: THREE.Points | null;
    material: THREE.ShaderMaterial | null;
    geometry: THREE.BufferGeometry | null;
    formationCache: Float32Array[];
    currentFormationIndex: number;
    targetFormationIndex: number;
    currentSection: number;
    mouse: THREE.Vector3;
    mouseRayTarget: THREE.Vector3;
    mouseActive: boolean;
    rafId: number | null;
    lastTime: number;
    clock: THREE.Clock | null;
    count: number;
    lastChimeSection: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    pointsMesh: null,
    starfield: null,
    material: null,
    geometry: null,
    formationCache: [],
    currentFormationIndex: 0,
    targetFormationIndex: 1,
    currentSection: -1,
    mouse: new THREE.Vector3(0, 0, 0),
    mouseRayTarget: new THREE.Vector3(0, 0, 0),
    mouseActive: false,
    rafId: null,
    lastTime: 0,
    clock: null,
    count: 65000,
    lastChimeSection: -1,
  });

  // Calculate particle count based on density mode & screen
  const getParticleCount = useCallback((mode: ParticleDensityMode) => {
    if (typeof window === 'undefined') return 60000;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return mode === 'cinematic' ? 42000 : mode === 'balanced' ? 28000 : 16000;
    }
    return mode === 'cinematic' ? 110000 : mode === 'balanced' ? 78000 : 45000;
  }, []);

  // Update particle size uniform based on sizeMode
  useEffect(() => {
    if (!stateRef.current.material) return;
    let sizeVal = 0.85; // Default micro stardust (matches screenshots)
    if (sizeMode === 'ultra_fine') sizeVal = 0.55;
    if (sizeMode === 'normal') sizeVal = 1.2;
    stateRef.current.material.uniforms.uSize.value = sizeVal;
  }, [sizeMode]);

  // Main Three.js Scene Setup & Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const count = getParticleCount(densityMode);
    stateRef.current.count = count;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.015);
    stateRef.current.scene = scene;

    // 2. Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 120);
    camera.position.set(0, 0, 10.5);
    stateRef.current.camera = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x030303, 1);
    stateRef.current.renderer = renderer;

    // 4. Secondary deep starfield
    const starfield = createDeepStarfield(window.innerWidth < 768 ? 1600 : 3600);
    scene.add(starfield);
    stateRef.current.starfield = starfield;

    // 5. Pre-generate all formation positions
    const formations: Float32Array[] = FORMATIONS_METADATA.map((meta) =>
      generateFormationPositions(meta.id, count)
    );
    stateRef.current.formationCache = formations;

    // 6. Generate attributes: colors, sizes, randoms
    const { colors, sizes, randoms } = generateParticleAttributes(count);

    // 7. Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(formations[0]), 3));
    geometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(new Float32Array(formations[1]), 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    stateRef.current.geometry = geometry;

    // 8. Custom Shader Material
    let sizeMultiplier = 0.85;
    if (sizeMode === 'ultra_fine') sizeMultiplier = 0.55;
    if (sizeMode === 'normal') sizeMultiplier = 1.2;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uProgress: { value: 0.0 },
        uSize: { value: sizeMultiplier },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uMouseActive: { value: 0.0 },
        uTurbulence: { value: 0.0 },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    stateRef.current.material = material;

    // 9. Particle Points Mesh
    const pointsMesh = new THREE.Points(geometry, material);
    scene.add(pointsMesh);
    stateRef.current.pointsMesh = pointsMesh;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      if (material) {
        material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
      }
    };

    window.addEventListener('resize', handleResize);

    // Mouse Move & Raycast Projection
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ndcMouse.set(x, y);

      raycaster.setFromCamera(ndcMouse, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        stateRef.current.mouseRayTarget.copy(intersectPoint);
        stateRef.current.mouseActive = true;
      }
    };

    const handlePointerLeave = () => {
      stateRef.current.mouseActive = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    stateRef.current.clock = clock;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update uniforms
      if (material) {
        material.uniforms.uTime.value = elapsedTime;

        // Smooth mouse target lerp
        stateRef.current.mouse.lerp(stateRef.current.mouseRayTarget, 0.12);
        material.uniforms.uMouse.value.copy(stateRef.current.mouse);
        material.uniforms.uMouseActive.value = THREE.MathUtils.lerp(
          material.uniforms.uMouseActive.value,
          stateRef.current.mouseActive ? 1.0 : 0.0,
          0.08
        );
      }

      // Update secondary starfield
      if (starfield && (starfield.material as THREE.ShaderMaterial).uniforms) {
        (starfield.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsedTime;
        starfield.rotation.y = elapsedTime * 0.008;
      }

      // Particle mesh slow spatial rotation
      if (pointsMesh) {
        const curMeta = FORMATIONS_METADATA[stateRef.current.currentFormationIndex] || FORMATIONS_METADATA[0];
        pointsMesh.rotation.y += curMeta.rotationSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);

      // Clean up WebGL resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [densityMode, getParticleCount, sizeMode]);

  // Handle Scroll Progress & Formation Transitions
  useEffect(() => {
    const state = stateRef.current;
    if (!state.geometry || !state.material || !state.formationCache.length) return;

    const totalFormations = FORMATIONS_METADATA.length;
    // Map scroll progress (0..1) across totalFormations - 1 segments
    const scaled = Math.max(0, Math.min(scrollProgress * (totalFormations - 1), totalFormations - 1));
    const sectionIndex = Math.min(Math.floor(scaled), totalFormations - 2);
    const progressWithinSection = scaled - sectionIndex;

    const fromIndex = sectionIndex;
    const toIndex = Math.min(sectionIndex + 1, totalFormations - 1);

    // Check if section changed
    if (state.currentSection !== sectionIndex) {
      state.currentSection = sectionIndex;
      state.currentFormationIndex = fromIndex;
      state.targetFormationIndex = toIndex;

      // Update geometry buffers for position and aTargetPosition
      const posAttr = state.geometry.getAttribute('position') as THREE.BufferAttribute;
      const targetAttr = state.geometry.getAttribute('aTargetPosition') as THREE.BufferAttribute;

      if (posAttr && targetAttr) {
        posAttr.copyArray(state.formationCache[fromIndex]);
        targetAttr.copyArray(state.formationCache[toIndex]);
        posAttr.needsUpdate = true;
        targetAttr.needsUpdate = true;
      }

      // Notify parent of active formation
      if (onFormationChange) {
        onFormationChange(progressWithinSection > 0.5 ? toIndex : fromIndex);
      }

      // Play soft harmonic chime if section changed
      if (state.lastChimeSection !== sectionIndex) {
        state.lastChimeSection = sectionIndex;
        audioSynthesizer.triggerChime(sectionIndex);
      }
    }

    // Set uniform progress
    state.material.uniforms.uProgress.value = progressWithinSection;

    // Turbulence uniform from velocity
    const turb = Math.min(2.5, Math.abs(scrollVelocity) * 0.04);
    state.material.uniforms.uTurbulence.value = turb;

    // Smooth Camera Choreography
    if (state.camera) {
      const fromMeta = FORMATIONS_METADATA[fromIndex];
      const toMeta = FORMATIONS_METADATA[toIndex];

      const targetZ = THREE.MathUtils.lerp(fromMeta.cameraZ, toMeta.cameraZ, progressWithinSection);
      const targetY = THREE.MathUtils.lerp(fromMeta.cameraY, toMeta.cameraY, progressWithinSection);

      // Subtle mouse tilt for deep 3D presence
      const mouseTiltX = state.mouseRayTarget.x * 0.15;
      const mouseTiltY = state.mouseRayTarget.y * 0.15;

      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY + mouseTiltY, 0.08);
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseTiltX, 0.08);
      state.camera.lookAt(0, 0, 0);
    }
  }, [scrollProgress, scrollVelocity, onFormationChange]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 w-full h-full pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none pointer-events-auto"
      />
    </div>
  );
}
