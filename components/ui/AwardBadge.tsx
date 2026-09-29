'use client';

import React, { useState } from 'react';
import { ExternalLink, X, Trophy, Sparkles } from 'lucide-react';

export function AwardBadge() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Pinned Right Vertical Badge */}
      <aside
        aria-label="Recognition Badge"
        className="fixed top-1/2 right-0 -translate-y-1/2 z-40 select-none pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group flex flex-col items-center justify-between w-9 md:w-11 py-4 bg-white text-black hover:bg-neutral-100 transition-all duration-300 shadow-2xl cursor-pointer"
          title="Awwwards Site of the Day Nominee"
        >
          {/* Top 'W.' Logo mark */}
          <span className="font-extrabold text-base md:text-lg tracking-tight font-serif">
            W.
          </span>

          {/* Vertical Separator line */}
          <div className="w-[1px] h-6 bg-black/15 my-2 group-hover:scale-y-110 transition-transform" />

          {/* 'Nominee' text rotated vertically */}
          <span
            className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase py-2"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Nominee
          </span>
        </button>
      </aside>

      {/* Award Recognition Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-serif font-black text-lg">
                W.
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-white">
                  Awwwards Recognition
                </h3>
                <p className="text-xs text-[#00F5A0]">Official Nominee · Digital Art & WebGL</p>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-light">
              Milan Companion is recognized for exceptional technical and visual execution in
              real-time WebGL particle simulation, responsive GPU spatial morphing, and immersive
              scroll storytelling.
            </p>

            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-neutral-400">
              <span>Category: Generative 3D Experience</span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white hover:text-[#00F5A0] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
