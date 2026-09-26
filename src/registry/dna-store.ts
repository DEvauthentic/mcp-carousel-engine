import { DesignDNA } from './types.js';

/**
 * MASTER DESIGN DNA REGISTRY
 * Curated, mathematical design formulas engineered to prevent AI slop.
 */
export const DESIGN_DNA_STORE: Record<string, DesignDNA> = {
  'dna-aws-cloud': {
    id: 'dna-aws-cloud',
    archetypeId: 'neo-geometric-dark',
    name: 'AWS Cloud Architecture Signature',
    industry: 'Cloud & DevOps',
    description: 'High-contrast dark canvas with wireframe grid, volumetric AWS Orange & Emerald 3D spheres, pure white floating cards, and glowing pill tags.',
    tags: ['aws', 'cloud', 'devops', 'infrastructure', 'network', 'docker', 'kubernetes', 'vpc', 'terraforma'],
    palette: {
      background: '#000000',
      cardSurface: '#FFFFFF',
      primaryAccent: '#FF9900', // AWS Orange
      secondaryAccent: '#10B981', // Emerald Green
      textPrimary: '#000000',
      textMuted: '#6B7280',
      borderHairline: 'rgba(255, 255, 255, 0.12)',
      glowColor: 'rgba(255, 153, 0, 0.45)',
    },
    typography: {
      headlineFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      headlineWeight: 900,
    },
    geometry: {
      cardRadius: 64,
      has3DOrbs: true,
      hasWireframe: true,
      bentoLayout: false,
      pillRotation: -1.5,
    },
    promptGuidance: 'Use bold architectural hooks, concrete networking terms (CIDR, Subnet, Gateway, Route), and high-contrast numerical highlights.',
  },

  'dna-health-tech': {
    id: 'dna-health-tech',
    archetypeId: 'neo-geometric-dark',
    name: 'HealthTech & Medical Clinical High-Tech',
    industry: 'Healthcare & Biotech',
    description: 'Clinical ultra-clean dark architecture with luminous Cyan Clinical & Emerald bio-security orbs, pure white central cards, and medical precision badges.',
    tags: ['health', 'sante', 'medical', 'clinique', 'pharmacie', 'patient', 'hopital', 'fhir', 'hl7', 'biotech'],
    palette: {
      background: '#000000',
      cardSurface: '#FFFFFF',
      primaryAccent: '#00D2FF', // Clinical Cyan
      secondaryAccent: '#10B981', // Medical Green
      textPrimary: '#000000',
      textMuted: '#4B5563',
      borderHairline: 'rgba(0, 210, 255, 0.15)',
      glowColor: 'rgba(0, 210, 255, 0.4)',
    },
    typography: {
      headlineFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      headlineWeight: 900,
    },
    geometry: {
      cardRadius: 64,
      has3DOrbs: true,
      hasWireframe: true,
      bentoLayout: false,
      pillRotation: 0,
    },
    promptGuidance: 'Emphasize patient care, real-time telemetry, regulatory compliance (HDS/RGPD), and interoperability standards.',
  },

  'dna-swiss-fintech': {
    id: 'dna-swiss-fintech',
    archetypeId: 'swiss-editorial-clean',
    name: 'Swiss International Editorial & Fintech',
    industry: 'Fintech, Banking & High Finance',
    description: 'Monumental asymmetric typography inspired by the International Typographic Style. Warm parchment chalk canvas, International Klein Blue, razor-sharp technical grid.',
    tags: ['fintech', 'finance', 'banking', 'crypto', 'bourse', 'investing', 'venture', 'saas', 'enterprise', 'swiss', 'editorial'],
    palette: {
      background: '#F6F5F0', // Warm Chalk / Paper
      cardSurface: '#FFFFFF',
      cardSurfaceAlt: '#EBE9E1',
      primaryAccent: '#002FA7', // International Klein Blue
      secondaryAccent: '#FF3B00', // Safety Orange
      textPrimary: '#0A0D14', // Deep Ink
      textMuted: '#525866',
      borderHairline: 'rgba(10, 13, 20, 0.12)',
      glowColor: 'rgba(0, 47, 167, 0.15)',
    },
    typography: {
      headlineFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      headlineWeight: 900,
    },
    geometry: {
      cardRadius: 28,
      has3DOrbs: false,
      hasWireframe: true,
      bentoLayout: true,
      pillRotation: 0,
    },
    promptGuidance: 'Monumental headlines, precise percentage metrics, rigid 16-column layout alignments, and executive-level authority.',
  },

  'dna-cyber-defense': {
    id: 'dna-cyber-defense',
    archetypeId: 'cyber-glass-bento',
    name: 'Cyber Security & Zero-Trust Defense',
    industry: 'Cybersecurity & Telemetry',
    description: 'Bento-grid compartments floating in deep night space with frosted glass translucency, electric cyan laser borders, and crimson threat alert badges.',
    tags: ['security', 'cyber', 'securite', 'soc', 'siem', 'pentest', 'zero-trust', 'firewall', 'encryption', 'hacker', 'defense'],
    palette: {
      background: '#060911', // Deep Space Night
      cardSurface: 'rgba(17, 24, 39, 0.72)', // Frosted glass
      cardSurfaceAlt: 'rgba(23, 32, 51, 0.85)',
      primaryAccent: '#00F0FF', // Laser Cyan
      secondaryAccent: '#FF003C', // Alert Crimson
      textPrimary: '#F9FAFB',
      textMuted: '#9CA3AF',
      borderHairline: 'rgba(0, 240, 255, 0.25)',
      glowColor: 'rgba(0, 240, 255, 0.35)',
    },
    typography: {
      headlineFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      headlineWeight: 800,
    },
    geometry: {
      cardRadius: 36,
      has3DOrbs: false,
      hasWireframe: true,
      bentoLayout: true,
      pillRotation: 0,
    },
    promptGuidance: 'Multi-compartment Bento grids, real telemetry readouts, CVE tags, zero-trust protocols, and tactical cyber tone.',
  },

  'dna-minimal-luxury': {
    id: 'dna-minimal-luxury',
    archetypeId: 'swiss-editorial-clean',
    name: 'Minimalist Luxury & Executive Leadership',
    industry: 'Executive, Strategy & AI Agency',
    description: 'Chalk canvas with obsidian black card blocks, single incandescent amber gemstone, and ultra-sparse, razor-sharp typography.',
    tags: ['luxury', 'leadership', 'strategy', 'executive', 'conseil', 'minimal', 'monolith', 'ai', 'agency', 'ceo'],
    palette: {
      background: '#ECEAE4', // Warm chalk
      cardSurface: '#0E1015', // Obsidian Black
      primaryAccent: '#FF9900', // Incandescent Amber
      secondaryAccent: '#0E1015',
      textPrimary: '#0E1015',
      textMuted: '#5A5E6B',
      borderHairline: 'rgba(14, 16, 21, 0.1)',
      glowColor: 'rgba(255, 153, 0, 0.2)',
    },
    typography: {
      headlineFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      headlineWeight: 900,
    },
    geometry: {
      cardRadius: 32,
      has3DOrbs: false,
      hasWireframe: false,
      bentoLayout: false,
      pillRotation: 0,
    },
    promptGuidance: 'High-conviction visionary statements, philosophical hooks, extreme whitespace, and absolute typographic restraint.',
  },

  'dna-light-editorial': {
    id: 'dna-light-editorial',
    archetypeId: 'neo-geometric-dark',
    name: 'Executive Editorial & Business Intelligence (Said KOMI Formula)',
    industry: 'Business, Finance, Management & Intelligence',
    description: 'High-contrast executive layout with crimson & gold 3D spheres, pure white card, glowing pill badges, and monumental typography for strategic business, finance, finops, and quarterly reports.',
    tags: ['editorial', 'business', 'rapport', 'trimestriel', 'annuel', 'analyse', 'intelligence', 'management', 'consulting', 'audit', 'reporting', 'market', 'insight', 'economy', 'performance', 'bilan', 'annual', 'review', 'note', 'presse', 'communique', 'press', 'finops'],
    palette: {
      background: '#04060A',
      cardSurface: '#FFFFFF',
      cardSurfaceAlt: '#F8F9FA',
      primaryAccent: '#E60039',   // Rouge Crimson Exécutif
      secondaryAccent: '#FFB800', // Or Solaire 3D
      textPrimary: '#0D0D0D',
      textMuted: '#6B7280',
      borderHairline: 'rgba(255, 255, 255, 0.12)',
      glowColor: 'rgba(230, 0, 57, 0.45)',
    },
    typography: {
      headlineFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      headlineWeight: 900,
    },
    geometry: {
      cardRadius: 72,
      has3DOrbs: true,
      hasWireframe: true,
      bentoLayout: true,
      pillRotation: 0,
    },
    promptGuidance: 'Monumental executive headlines, high-impact numerical cards, structured Bento rows with counters, and radiant 3D volumetric spheres.',
  },
};

/**
 * Intelligent Weighted Semantic DNA Matching
 */
export function matchDesignDNA(params: {
  topic: string;
  industry?: string;
  tone?: string;
}): DesignDNA {
  const query = `${params.topic} ${params.industry || ''} ${params.tone || ''}`.toLowerCase();

  let bestDNA = DESIGN_DNA_STORE['dna-aws-cloud'];
  let maxScore = 0;

  for (const dna of Object.values(DESIGN_DNA_STORE)) {
    let score = 0;
    for (const tag of dna.tags) {
      if (query.includes(tag.toLowerCase())) {
        // Multi-word tags like "zero-trust" or "dossier patient" carry higher weight
        score += tag.includes('-') || tag.includes(' ') ? 3 : 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestDNA = dna;
    }
  }

  return bestDNA;
}
