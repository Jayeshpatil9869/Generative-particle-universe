'use client';

import React from 'react';
import { FORMATIONS_METADATA } from '@/lib/particle-formations';
import { ChevronDown, ArrowDown, Sparkles } from 'lucide-react';

interface StoryOverlayProps {
  activeIndex: number;
  scrollProgress: number;
  onJumpToFormation: (index: number) => void;
  particleCount: number;
}

export function StoryOverlay({
  activeIndex,
  scrollProgress,
  onJumpToFormation,
  particleCount,
}: StoryOverlayProps) {
  const currentMeta = FORMATIONS_METADATA[activeIndex] || FORMATIONS_METADATA[0];

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-6 md:p-12">
      {/* Top spacer to clear header */}
      <div className="h-16" />

      {/* Center Subdued Editorial Headline - fades subtly based on formation */}
      <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4 opacity-90 transition-opacity duration-700">
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#00F5A0] mb-2">
          {currentMeta.subtitle}
        </span>
        <h1 className="text-xl md:text-3xl font-light tracking-[0.2em] uppercase text-white/95 leading-tight text-wrap">
          {currentMeta.tagline}
        </h1>
        <p className="text-xs md:text-sm font-light text-neutral-400 mt-3 max-w-md tracking-wide leading-relaxed">
          {currentMeta.description}
        </p>
      </div>

      {/* Bottom Interface Zone */}
      <div className="flex flex-col md:flex-row items-end md:items-end justify-between gap-6 pointer-events-auto">
        {/* Left: Active Chapter & Jump Navigation */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base font-mono font-medium text-[#00F5A0] tracking-wider">
              {String(activeIndex + 1).padStart(2, '0')} / {String(FORMATIONS_METADATA.length).padStart(2, '0')}
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-xs md:text-sm font-medium tracking-[0.18em] uppercase text-white/90">
              {currentMeta.label}
            </span>
          </div>

          {/* Quick-jump formation selector dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {FORMATIONS_METADATA.map((formation, idx) => (
              <button
                key={formation.id}
                type="button"
                onClick={() => onJumpToFormation(idx)}
                title={`${formation.label} (${idx + 1}/${FORMATIONS_METADATA.length})`}
                className={`group relative py-2 px-1 transition-all`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-6 bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]'
                      : 'w-1.5 bg-white/25 hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Center: Scroll down indicator */}
        <div className="hidden lg:flex flex-col items-center gap-2 text-neutral-400 animate-pulse">
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono">
            Scroll to morph
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-[#00F5A0]" />
        </div>

        {/* Right: Telemetry / Particle Count */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-ping" />
            <span className="text-neutral-300">
              {particleCount.toLocaleString()}
            </span>
            <span className="text-neutral-500">Particles</span>
          </div>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">
            {Math.round(scrollProgress * 100)}% Orbit
          </span>
        </div>
      </div>
    </div>
  );
}
