'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Mail, MapPin } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('creative_direction');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg bg-[#080808] border border-white/10 rounded-2xl p-6 md:p-8 text-white shadow-2xl overflow-y-auto max-h-[88vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#00F5A0] mb-2 block">
          Inquiries & Collaborations
        </span>
        <h2 className="text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-white mb-2">
          Contact Milan Studio
        </h2>
        <p className="text-xs text-neutral-400 mb-6 font-light">
          Available for experimental digital installations, WebGL development, and spatial generative art commissions.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#00F5A0]/10 border border-[#00F5A0]/40 text-[#00F5A0] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium tracking-wide uppercase text-white">
              Transmission Received
            </h3>
            <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed">
              Thank you for reaching out. We will review your transmission and respond within 24 hours.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 px-5 py-2 text-xs font-medium text-black bg-[#00F5A0] hover:bg-[#72FFD2] rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:border-[#00F5A0] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@studio.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:border-[#00F5A0] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Inquiry Type
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-[#0e0e0e] text-white text-xs focus:outline-none focus:border-[#00F5A0] transition-colors"
              >
                <option value="creative_direction">Generative Art & Creative Direction</option>
                <option value="webgl_engineering">3D WebGL / Shader Engineering</option>
                <option value="exhibition_curation">Exhibition & Museum Interactive</option>
                <option value="general_press">Press & Architectural Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Project Scope or Note
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your vision, timeline, or spatial installation requirements..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs focus:outline-none focus:border-[#00F5A0] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-medium text-black bg-[#00F5A0] hover:bg-[#72FFD2] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Transmitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#00F5A0]" />
            Milan · Paris · Zurich
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            studio@milancompanion.art
          </span>
        </div>
      </div>
    </div>
  );
}
