'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ParticleEngine } from '@/components/particle/ParticleEngine';
import { HeaderNav } from '@/components/navigation/HeaderNav';
import { AwardBadge } from '@/components/ui/AwardBadge';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { StoryOverlay } from '@/components/ui/StoryOverlay';
import { AboutModal } from '@/components/modals/AboutModal';
import { ProjectsModal } from '@/components/modals/ProjectsModal';
import { ContactModal } from '@/components/modals/ContactModal';
import { ParticleEngineControlsModal } from '@/components/modals/ParticleEngineControlsModal';
import { audioSynthesizer } from '@/lib/audio-synthesizer';
import { FORMATIONS_METADATA } from '@/lib/particle-formations';
import { ParticleSizeMode, ParticleDensityMode } from '@/types/particles';

export default function Home() {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'contact'>('projects');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  // Configuration
  const [lang, setLang] = useState<'EN' | 'FR' | 'IN'>('IN');
  const [audioActive, setAudioActive] = useState(false);
  const [sizeMode, setSizeMode] = useState<ParticleSizeMode>('fine'); // Fine stardust by default
  const [densityMode, setDensityMode] = useState<ParticleDensityMode>('balanced');
  const [activeFormationIndex, setActiveFormationIndex] = useState(0);

  // Smooth Scroll State
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);

  // Loader State
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);

  // Ref tracking smooth scroll math
  const scrollTargetRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastProgressRef = useRef(0);

  // Fake progressive asset load for cinematic arrival
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 12;
      if (current >= 100) {
        current = 100;
        setLoadPercent(100);
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 350);
      } else {
        setLoadPercent(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Native window scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const rawProgress = Math.max(0, Math.min(scrollY / maxScroll, 1));
      scrollTargetRef.current = rawProgress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Silky Inertia Damping Loop (Lenis-like silky smoothing)
  useEffect(() => {
    let rafId: number;

    const loop = () => {
      // Smooth lerp: 0.12 gives natural weighted inertia
      const target = scrollTargetRef.current;
      const current = currentProgressRef.current;
      const next = current + (target - current) * 0.12;

      const delta = next - lastProgressRef.current;
      lastProgressRef.current = next;
      currentProgressRef.current = next;

      setSmoothProgress(next);
      setVelocity(delta * 60); // approx velocity

      // Sync audio modulation
      if (audioSynthesizer.getActive()) {
        audioSynthesizer.updateScroll(next, delta * 60);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Jump to specific formation
  const handleJumpToFormation = useCallback((index: number) => {
    const totalFormations = FORMATIONS_METADATA.length;
    const targetProgress = index / (totalFormations - 1);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: 'smooth',
    });
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        const next = Math.min(activeFormationIndex + 1, FORMATIONS_METADATA.length - 1);
        handleJumpToFormation(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        const prev = Math.max(activeFormationIndex - 1, 0);
        handleJumpToFormation(prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFormationIndex, handleJumpToFormation]);

  // Audio Toggle
  const handleToggleAudio = () => {
    const active = audioSynthesizer.toggle();
    setAudioActive(active);
  };

  // Nav Tab Handler
  const handleSelectTab = (tab: 'about' | 'projects' | 'contact') => {
    setActiveTab(tab);
    if (tab === 'about') setIsAboutOpen(true);
    if (tab === 'projects') setIsProjectsOpen(true);
    if (tab === 'contact') setIsContactOpen(true);
  };

  // Language toggle
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'EN' ? 'FR' : prev === 'FR' ? 'IN' : 'EN'));
  };

  return (
    <main className="relative min-h-screen bg-[#030303] text-white overflow-x-hidden">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Cinematic Initial Loading Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] text-white">
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-light tracking-[0.3em] uppercase text-white/70">
              Milan Companion
            </span>
            <div className="w-36 h-[1px] bg-white/10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 bg-[#00F5A0] transition-all duration-100 ease-out"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-[#00F5A0]">
              GENERATING PARTICLES {loadPercent}%
            </span>
          </div>
        </div>
      )}

      {/* Fixed 3D WebGL Particle Universe Canvas */}
      <ParticleEngine
        scrollProgress={smoothProgress}
        scrollVelocity={velocity}
        sizeMode={sizeMode}
        densityMode={densityMode}
        onFormationChange={(index) => setActiveFormationIndex(index)}
      />

      {/* Fixed Top Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
        sizeMode={sizeMode}
        onChangeSizeMode={setSizeMode}
        densityMode={densityMode}
        onChangeDensityMode={setDensityMode}
        onOpenControls={() => setIsControlsOpen(true)}
      />

      {/* Fixed Right Side Awwwards Nominee Badge */}
      <AwardBadge />

      {/* Fixed Spatial Story / Section Overlay HUD */}
      <StoryOverlay
        activeIndex={activeFormationIndex}
        scrollProgress={smoothProgress}
        onJumpToFormation={handleJumpToFormation}
        particleCount={
          densityMode === 'cinematic' ? 110000 : densityMode === 'balanced' ? 78000 : 45000
        }
      />

      {/* Modals & Dialogs */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        activeFormationIndex={activeFormationIndex}
        onSelectFormation={handleJumpToFormation}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ParticleEngineControlsModal
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        sizeMode={sizeMode}
        onChangeSizeMode={setSizeMode}
        densityMode={densityMode}
        onChangeDensityMode={setDensityMode}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
        activeFormationIndex={activeFormationIndex}
        onSelectFormation={handleJumpToFormation}
      />

      {/* Physical Scroll Track Height to drive continuous scroll (10 formations = 1000vh) */}
      <div className="relative w-full h-[1000vh] pointer-events-none" />
    </main>
  );
}
