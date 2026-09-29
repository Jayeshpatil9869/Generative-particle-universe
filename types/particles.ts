export type FormationId =
  | 'scattered_universe'
  | 'sphere_core'
  | 'diamond_star'
  | 'vortex_accretion'
  | 'twin_columns'
  | 'double_helix'
  | 'infinity_knot'
  | 'cosmic_explosion'
  | 'organic_wave'
  | 'master_constellation';

export interface FormationInfo {
  id: FormationId;
  index: number;
  label: string;
  subtitle: string;
  tagline: string;
  description: string;
  cameraZ: number;
  cameraY: number;
  rotationSpeed: number;
}

export type ParticleSizeMode = 'ultra_fine' | 'fine' | 'normal';
export type ParticleDensityMode = 'low' | 'balanced' | 'cinematic';

export interface ParticleEngineConfig {
  count: number;
  sizeMode: ParticleSizeMode;
  densityMode: ParticleDensityMode;
  audioActive: boolean;
  bloomEnabled: boolean;
  reducedMotion: boolean;
}

export interface ScrollState {
  progress: number; // 0.0 to 1.0
  activeSectionIndex: number;
  sectionProgress: number; // 0.0 to 1.0 within current section
  velocity: number;
  direction: 'down' | 'up';
}
