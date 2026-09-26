/**
 * DESIGN DNA & ARCHETYPE TYPES (MCP CAROUSEL ENGINE v2.0)
 * Author: Said KOMI (Ingénieur Réseaux & Système)
 */

export type DesignArchetypeId = 
  | 'neo-geometric-dark' 
  | 'swiss-editorial-clean' 
  | 'cyber-glass-bento'
  | 'paper-light-editorial';

export type ThemeMode = 'hybrid' | 'dark' | 'light';

export type ThemePresetId =
  | 'cloud-devops'
  | 'cybersecurity'
  | 'fintech-systems'
  | 'ai-deeptech'
  | 'monochrome-swiss';

export interface DesignPalette {
  background: string;
  cardSurface: string;
  cardSurfaceAlt?: string;
  primaryAccent: string;
  secondaryAccent: string;
  textPrimary: string;
  textMuted: string;
  borderHairline: string;
  glowColor: string;
}

export interface DesignTypography {
  headlineFont: string;
  bodyFont: string;
  monoFont: string;
  headlineWeight: number;
}

export interface DesignGeometry {
  cardRadius: number;
  has3DOrbs: boolean;
  hasWireframe: boolean;
  bentoLayout: boolean;
  pillRotation?: number;
}

export interface DesignDNA {
  id: string;
  archetypeId: DesignArchetypeId;
  name: string;
  industry: string;
  description: string;
  tags: string[];
  palette: DesignPalette;
  typography: DesignTypography;
  geometry: DesignGeometry;
  promptGuidance: string;
}
