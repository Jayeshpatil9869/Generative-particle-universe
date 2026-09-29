'use client';

import React from 'react';
import { X, Sparkles, Orbit, Cpu, Compass } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-2xl p-6 md:p-10 text-white shadow-2xl overflow-y-auto max-h-[88vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#00F5A0] mb-2 block">
          Manifesto & Technical Direction
        </span>
        <h2 className="text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-white mb-6">
          Everything is made of particles.
        </h2>

        <div className="space-y-6 text-sm text-neutral-300 font-light leading-relaxed">
          <p>
            <strong className="text-white font-normal">Milan Companion</strong> is an experimental digital observatory exploring matter, motion, and spatial transformation. Rather than rendering static backgrounds or flat 2D canvas effects, the entire interface is governed by a volumetric generative particle architecture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-[#00F5A0] text-xs font-mono">
                <Cpu className="w-4 h-4" />
                <span>GPU-Accelerated Shaders</span>
              </div>
              <p className="text-xs text-neutral-400 leading-normal">
                Direct GLSL 3.0 point sprites with cubic hermite interpolation, dynamic size attenuation, and additive luminous blending.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-[#00F5A0] text-xs font-mono">
                <Orbit className="w-4 h-4" />
                <span>Mathematical Formations</span>
              </div>
              <p className="text-xs text-neutral-400 leading-normal">
                Astroid superquadrics, Fibonacci spherical lattices, double helices, and accretion vortex vectors calculated in 3D.
              </p>
            </div>
          </div>

          <p>
            As you scroll through the timeline, the particles reorganize continuously between states: from scattered stardust clouds to razor-sharp geometric stars, vertical resonant pillars, swirling event horizons, and kinetic supernova explosions.
          </p>

          <div className="border-t border-white/10 pt-5 flex items-center justify-between text-xs text-neutral-400">
            <span>Spatial Engine · Three.js & GLSL</span>
            <button
              type="button"
              onClick={onClose}
              className="text-[#00F5A0] hover:underline"
            >
              Return to Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
