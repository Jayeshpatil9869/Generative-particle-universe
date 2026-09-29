'use client';

import React from 'react';
import { Volume2, VolumeX, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ParticleSizeMode, ParticleDensityMode } from '@/types/particles';

interface HeaderNavProps {
  activeTab: 'about' | 'projects' | 'contact';
  onSelectTab: (tab: 'about' | 'projects' | 'contact') => void;
  lang: 'EN' | 'FR' | 'IN';
  onToggleLang: () => void;
  audioActive: boolean;
  onToggleAudio: () => void;
  sizeMode: ParticleSizeMode;
  onChangeSizeMode: (mode: ParticleSizeMode) => void;
  densityMode: ParticleDensityMode;
  onChangeDensityMode: (mode: ParticleDensityMode) => void;
  onOpenControls: () => void;
}

export function HeaderNav({
  activeTab,
  onSelectTab,
  lang,
  onToggleLang,
  audioActive,
  onToggleAudio,
  sizeMode,
  onChangeSizeMode,
  densityMode,
  onChangeDensityMode,
  onOpenControls,
}: HeaderNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 pointer-events-none select-none">
      {/* Zone 1: Brand title */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <a
          href="#top"
          className="text-xs md:text-sm font-light tracking-[0.28em] text-white/90 hover:text-white uppercase transition-colors"
        >
          MILAN COMPANION
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav
        aria-label="Main Navigation"
        className="flex items-center gap-8 md:gap-12 text-xs md:text-sm pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => onSelectTab('about')}
          className={`relative transition-colors duration-200 tracking-wider ${
            activeTab === 'about'
              ? 'text-[#00F5A0] font-medium'
              : 'text-white/60 hover:text-white'
          }`}
        >
          About
          {activeTab === 'about' && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('projects')}
          className={`relative transition-colors duration-200 tracking-wider ${
            activeTab === 'projects'
              ? 'text-[#00F5A0] font-medium'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Projects
          {activeTab === 'projects' && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('contact')}
          className={`relative transition-colors duration-200 tracking-wider ${
            activeTab === 'contact'
              ? 'text-[#00F5A0] font-medium'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Contact
          {activeTab === 'contact' && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]" />
          )}
        </button>
      </nav>

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-4 md:gap-6 text-xs pointer-events-auto">
        {/* Particle Controls Trigger */}
        <button
          type="button"
          onClick={onOpenControls}
          title="Particle Customizer"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-3 h-3 text-[#00F5A0]" />
          <span className="text-[11px] tracking-wider uppercase">Engine</span>
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          title={audioActive ? 'Mute Ambient Audio' : 'Play Ambient Audio'}
          className={`p-2 rounded-full border transition-all ${
            audioActive
              ? 'border-[#00F5A0]/40 bg-[#00F5A0]/10 text-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.3)]'
              : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          {audioActive ? (
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Language Switch */}
        <button
          type="button"
          onClick={onToggleLang}
          className="text-xs font-mono tracking-widest text-white/60 hover:text-white transition-colors"
        >
          {lang === 'FR' ? 'FR / EN' : lang === 'IN' ? 'FR / IN' : 'EN / FR'}
        </button>
      </div>
    </header>
  );
}
