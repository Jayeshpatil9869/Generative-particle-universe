'use client';

import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { FORMATIONS_METADATA } from '@/lib/particle-formations';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFormationIndex: number;
  onSelectFormation: (index: number) => void;
}

export function ProjectsModal({
  isOpen,
  onClose,
  activeFormationIndex,
  onSelectFormation,
}: ProjectsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-3xl bg-[#080808] border border-white/10 rounded-2xl p-6 md:p-10 text-white shadow-2xl overflow-y-auto max-h-[88vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#00F5A0] mb-2 block">
          Spatial Archive & Installations
        </span>
        <h2 className="text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-white mb-2">
          Formations Catalogue
        </h2>
        <p className="text-xs text-neutral-400 mb-6 font-light">
          Ten distinct geometric and biological particle architectures computed in real-time WebGL. Click any study to morph the universe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FORMATIONS_METADATA.map((f, i) => {
            const isActive = activeFormationIndex === i;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onSelectFormation(i);
                  onClose();
                }}
                className={`p-4 rounded-xl border text-left transition-all group ${
                  isActive
                    ? 'border-[#00F5A0] bg-[#00F5A0]/10 shadow-[0_0_16px_rgba(0,245,160,0.15)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-[#00F5A0]">
                    STUDY {String(i + 1).padStart(2, '0')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-medium tracking-wide text-white uppercase mb-1">
                  {f.label}
                </h3>
                <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                  {f.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <span>Continuous Morphing Pipeline</span>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-[#00F5A0] transition-colors"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
}
