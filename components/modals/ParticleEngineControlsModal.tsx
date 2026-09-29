'use client';

import React from 'react';
import { X, Sparkles, Volume2, VolumeX, Eye, Layers } from 'lucide-react';
import { ParticleSizeMode, ParticleDensityMode } from '@/types/particles';
import { FORMATIONS_METADATA } from '@/lib/particle-formations';

interface ParticleEngineControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sizeMode: ParticleSizeMode;
  onChangeSizeMode: (mode: ParticleSizeMode) => void;
  densityMode: ParticleDensityMode;
  onChangeDensityMode: (mode: ParticleDensityMode) => void;
  audioActive: boolean;
  onToggleAudio: () => void;
  activeFormationIndex: number;
  onSelectFormation: (index: number) => void;
}

export function ParticleEngineControlsModal({
  isOpen,
  onClose,
  sizeMode,
  onChangeSizeMode,
  densityMode,
  onChangeDensityMode,
  audioActive,
  onToggleAudio,
  activeFormationIndex,
  onSelectFormation,
}: ParticleEngineControlsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg bg-[#080808] border border-white/10 rounded-2xl p-6 md:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F5A0]" />
            <h2 className="text-sm font-semibold tracking-wider uppercase text-white">
              Particle Engine Configuration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Particle Size Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Particle Size
              </label>
              <span className="text-[11px] font-mono text-[#00F5A0]">
                {sizeMode === 'ultra_fine' ? 'Ultra Fine (0.55×)' : sizeMode === 'fine' ? 'Micro Fine / Default (0.85×)' : 'Standard (1.2×)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['ultra_fine', 'fine', 'normal'] as ParticleSizeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChangeSizeMode(mode)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                    sizeMode === mode
                      ? 'border-[#00F5A0] bg-[#00F5A0]/10 text-[#00F5A0]'
                      : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode === 'ultra_fine' ? 'Ultra Fine' : mode === 'fine' ? 'Micro Fine (Default)' : 'Standard'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1.5 font-light">
              Fine sizes render high-density micro stardust points matching the reference aesthetics.
            </p>
          </div>

          {/* Particle Density */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Particle Density Count
              </label>
              <span className="text-[11px] font-mono text-[#00F5A0]">
                {densityMode === 'cinematic' ? '~110,000 pts' : densityMode === 'balanced' ? '~78,000 pts' : '~45,000 pts'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'balanced', 'cinematic'] as ParticleDensityMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChangeDensityMode(mode)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                    densityMode === mode
                      ? 'border-[#00F5A0] bg-[#00F5A0]/10 text-[#00F5A0]'
                      : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode === 'low' ? 'Eco (~45k)' : mode === 'balanced' ? 'Balanced (~78k)' : 'Cinematic (~110k)'}
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Cosmic Sound */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              {audioActive ? (
                <Volume2 className="w-4 h-4 text-[#00F5A0]" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-500" />
              )}
              <div>
                <p className="text-xs font-medium text-white">Generative Ambient Sound</p>
                <p className="text-[11px] text-neutral-400">Harmonic cosmic drones that react to scroll</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                audioActive
                  ? 'border-[#00F5A0] bg-[#00F5A0]/15 text-[#00F5A0]'
                  : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              {audioActive ? 'Active' : 'Muted'}
            </button>
          </div>

          {/* Direct Morph Switcher */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Jump to Formation
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {FORMATIONS_METADATA.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    onSelectFormation(i);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs border text-left transition-all ${
                    activeFormationIndex === i
                      ? 'border-[#00F5A0] bg-[#00F5A0]/10 text-white font-medium'
                      : 'border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{f.label}</span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-black bg-[#00F5A0] hover:bg-[#72FFD2] rounded-lg transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
