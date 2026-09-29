'use client';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying: boolean = false;

  public init(): boolean {
    if (this.ctx) return true;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      // Warm low-pass filter for cosmic atmosphere
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Create 3 harmonic oscillators (cosmic chord: D2, A2, F#3)
      const freqs = [73.42, 110.0, 185.0];
      this.oscillators = freqs.map((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        const oscGain = this.ctx!.createGain();
        oscGain.gain.setValueAtTime(0.28 / (i + 1), this.ctx!.currentTime);

        // Subtle LFO modulation
        const lfo = this.ctx!.createOscillator();
        lfo.frequency.setValueAtTime(0.08 + i * 0.04, this.ctx!.currentTime);
        const lfoGain = this.ctx!.createGain();
        lfoGain.gain.setValueAtTime(2.5, this.ctx!.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(this.filter!);
        osc.start();
        return osc;
      });

      return true;
    } catch (err) {
      console.warn('Web Audio not available:', err);
      return false;
    }
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
    }
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      // Fade out
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      this.isPlaying = false;
    } else {
      // Fade in gently
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 2.0);
      this.isPlaying = true;
    }
    return this.isPlaying;
  }

  public updateScroll(progress: number, velocity: number) {
    if (!this.isPlaying || !this.ctx || !this.filter) return;
    try {
      // Modulate filter cutoff with scroll position and speed
      const targetFreq = 260 + progress * 420 + Math.min(600, Math.abs(velocity) * 80);
      this.filter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.2);
    } catch {
      // ignore
    }
  }

  public triggerChime(formationIndex: number) {
    if (!this.isPlaying || !this.ctx) return;
    try {
      // Shimmering celestial bell when arriving at a new formation
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const scale = [440, 554.37, 659.25, 830.61, 880, 1108.73, 1318.51, 1661.22];
      const pitch = scale[formationIndex % scale.length];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.0);
    } catch {
      // ignore
    }
  }

  public getActive(): boolean {
    return this.isPlaying;
  }
}

export const audioSynthesizer = new AudioSynthesizer();
