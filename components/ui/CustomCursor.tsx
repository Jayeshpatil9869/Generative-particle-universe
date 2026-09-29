'use client';

import React, { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hasMoved = false;

    // Detect if hover capability exists
    document.documentElement.classList.add('custom-cursor-active');

    const handlePointerMove = (e: PointerEvent) => {
      // Discard touch events to allow native touch scroll on mobile
      if (e.pointerType === 'touch') {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
        return;
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        ringX = mouseX;
        ringY = mouseY;
        setIsVisible(true);
        if (containerRef.current) {
          containerRef.current.style.display = 'block';
        }
      }

      // Direct 1:1 instant transform on the center dot for zero-latency feedback
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check hover state on interactive targets
      const targetEl = e.target as HTMLElement | null;
      if (
        targetEl &&
        (targetEl.tagName === 'BUTTON' ||
          targetEl.tagName === 'A' ||
          targetEl.tagName === 'INPUT' ||
          targetEl.tagName === 'SELECT' ||
          targetEl.tagName === 'TEXTAREA' ||
          targetEl.closest('button') ||
          targetEl.closest('a') ||
          targetEl.getAttribute('role') === 'button' ||
          targetEl.classList.contains('cursor-pointer'))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handlePointerLeave = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
    };

    const handlePointerEnter = () => {
      if (hasMoved && containerRef.current) {
        containerRef.current.style.opacity = '1';
      }
    };

    const handleTouchStart = () => {
      // If user touches screen, hide custom cursor
      if (containerRef.current) {
        containerRef.current.style.display = 'none';
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    // High performance RAF loop: smoothly damps the outer ring towards mouseX, mouseY
    let rafId: number;
    const loop = () => {
      if (hasMoved) {
        // Smooth lerp 0.28 for fluid trailing ring
        ringX += (mouseX - ringX) * 0.28;
        ringY += (mouseY - ringY) * 0.28;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      window.removeEventListener('touchstart', handleTouchStart);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ display: 'none' }}
    >
      {/* Outer Circle Ring (Smoothly lags behind mouse for Awwwards fluid feel) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
            isHovering
              ? 'w-9 h-9 border-[#00F5A0] bg-[#00F5A0]/15 scale-110 shadow-[0_0_12px_rgba(0,245,160,0.6)]'
              : 'w-5 h-5 border-[1.5px] border-white/90 bg-white/[0.03] shadow-[0_0_6px_rgba(255,255,255,0.4)]'
          }`}
        />
      </div>

      {/* Center Starlight Dot (Moves 1:1 instantly with pointer for razor precision) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
            isHovering
              ? 'w-2 h-2 bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]'
              : 'w-1 h-1 bg-white shadow-[0_0_5px_#ffffff]'
          }`}
        />
      </div>
    </div>
  );
}
