/**
 * THEME PRESETS & MODE ENGINE (MCP CAROUSEL ENGINE v3.3)
 * Author: Said KOMI (Ingénieur Réseaux & Système)
 * 
 * Curated, industry-tailored color palettes and mode selections:
 * - 'cloud-devops'    : AWS Orange (#FF9900) + Emerald (#10B981)
 * - 'cybersecurity'   : Terminal Matrix Green (#10B981) + Laser Cyan (#00F0FF) / Crimson Alert
 * - 'fintech-systems' : International Klein Blue (#0052FF) + Electric Cyan (#06B6D4)
 * - 'ai-deeptech'     : Quantum Violet (#8B5CF6) + Cyber Cyan (#06B6D4)
 * - 'monochrome-swiss': Swiss High-Contrast Ink (#0A0A0A) + Architectural Zinc (#71717A)
 */

export type ThemePresetId =
  | 'cloud-devops'
  | 'cybersecurity'
  | 'fintech-systems'
  | 'ai-deeptech'
  | 'monochrome-swiss';

export type ThemeMode = 'hybrid' | 'dark' | 'light';

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  industry: string;
  description: string;
  primaryAccent: string;
  secondaryAccent: string;
  glowColor: string;
  defaultMode: ThemeMode;
  keywords: string[];
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  'cloud-devops': {
    id: 'cloud-devops',
    name: 'Cloud & DevOps Architecture (Signature)',
    industry: 'Cloud, Infrastructure & SRE',
    description: 'AWS Orange and Emerald Green on dark canvas. The authoritative standard for cloud architects and DevOps leads.',
    primaryAccent: '#FF9900',
    secondaryAccent: '#10B981',
    glowColor: 'rgba(255, 153, 0, 0.45)',
    defaultMode: 'hybrid',
    keywords: [
      'cloud', 'aws', 'devops', 'kubernetes', 'k8s', 'docker', 'terraform', 'infrastructure',
      'network', 'reseau', 'vpc', 'scalabilite', 'haute disponibilite', 'sla', 'p99', 'ci/cd',
      'kafka', 'redis', 'gateway', 'envoy', 'graviton', 'sre', 'ansible'
    ],
  },

  'cybersecurity': {
    id: 'cybersecurity',
    name: 'Cyber Security & Zero-Trust Defense',
    industry: 'Cybersecurity, SecOps & Compliance',
    description: 'Terminal Matrix Green with laser accents and crimson alert badges. Built for CISOs, pentesters and SOC analysts.',
    primaryAccent: '#10B981',
    secondaryAccent: '#00F0FF',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    defaultMode: 'hybrid',
    keywords: [
      'cyber', 'securite', 'security', 'zero trust', 'zero-trust', 'soc', 'siem', 'cve',
      'vulnerabilite', 'pentest', 'audit', 'iso 27001', 'iso27001', 'soc 2', 'soc2',
      'firewall', 'hacker', 'chiffrement', 'mtls', 'cryptographie', 'malware', 'edr', 'xdr', 'iam'
    ],
  },

  'fintech-systems': {
    id: 'fintech-systems',
    name: 'Fintech Systems & Micro-Latency',
    industry: 'Fintech, Banking & High-Frequency Systems',
    description: 'International Klein Blue and Electric Cyan. Engineered for payment gateways, ledger consensus and low-latency engines.',
    primaryAccent: '#0052FF',
    secondaryAccent: '#06B6D4',
    glowColor: 'rgba(0, 82, 255, 0.40)',
    defaultMode: 'hybrid',
    keywords: [
      'fintech', 'finance', 'banque', 'banking', 'paiement', 'payment', 'stripe', 'trading',
      'crypto', 'bourse', 'ledger', 'micro-latence', 'transaction', 'reconciliation', 'dsp2',
      'pci-dss', 'blockchain', 'bourse', 'liquidite', 'swift', 'sepa'
    ],
  },

  'ai-deeptech': {
    id: 'ai-deeptech',
    name: 'AI Engineering & DeepTech',
    industry: 'Artificial Intelligence, LLMs & MLOps',
    description: 'Quantum Violet and Cyber Cyan on deep space canvas. Designed for LLM researchers, AI engineers and GPU architects.',
    primaryAccent: '#8B5CF6',
    secondaryAccent: '#06B6D4',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    defaultMode: 'hybrid',
    keywords: [
      'ai', 'ia', 'deeptech', 'llm', 'gpt', 'transformers', 'neural', 'gpu', 'inference',
      'rag', 'machine learning', 'diffusion', 'agentic', 'langchain', 'llama', 'openai',
      'anthropic', 'deepseek', 'cuda', 'h100', 'fine-tuning', 'prompt'
    ],
  },

  'monochrome-swiss': {
    id: 'monochrome-swiss',
    name: 'Swiss Radical Monochrome',
    industry: 'Executive Architecture & Pure Engineering',
    description: 'Zero chromatic distraction. 100% Obsidian Ink, Architectural Zinc, and Pure White. Absolute typographic authority.',
    primaryAccent: '#FFFFFF',
    secondaryAccent: '#71717A',
    glowColor: 'rgba(255, 255, 255, 0.20)',
    defaultMode: 'hybrid',
    keywords: [
      'monochrome', 'swiss', 'noir et blanc', 'minimal', 'manifeste', 'leadership',
      'architecture pure', 'brutaliste', 'philosophie', 'principles', 'clean code', 'craftsmanship'
    ],
  },
};

/**
 * Resolves or automatically infers the optimal theme preset and mode based on context.
 */
export function resolveThemePreset(params: {
  preset?: string;
  themeMode?: string;
  topic?: string;
  industry?: string;
  tone?: string;
}): {
  preset: ThemePreset;
  themeMode: ThemeMode;
} {
  const normalizedPreset = (params.preset || '').toLowerCase().trim();
  let matchedPreset: ThemePreset = THEME_PRESETS['cloud-devops'];

  // 1. Direct Explicit Match
  if (normalizedPreset && THEME_PRESETS[normalizedPreset as ThemePresetId]) {
    matchedPreset = THEME_PRESETS[normalizedPreset as ThemePresetId];
  } else if (normalizedPreset) {
    // Fuzzy matching aliases
    if (normalizedPreset.includes('cyber') || normalizedPreset.includes('sec')) {
      matchedPreset = THEME_PRESETS['cybersecurity'];
    } else if (normalizedPreset.includes('fintech') || normalizedPreset.includes('bank') || normalizedPreset.includes('blue')) {
      matchedPreset = THEME_PRESETS['fintech-systems'];
    } else if (normalizedPreset.includes('ai') || normalizedPreset.includes('ia') || normalizedPreset.includes('violet') || normalizedPreset.includes('purple')) {
      matchedPreset = THEME_PRESETS['ai-deeptech'];
    } else if (normalizedPreset.includes('mono') || normalizedPreset.includes('swiss') || normalizedPreset.includes('black')) {
      matchedPreset = THEME_PRESETS['monochrome-swiss'];
    } else if (normalizedPreset.includes('cloud') || normalizedPreset.includes('devops') || normalizedPreset.includes('orange')) {
      matchedPreset = THEME_PRESETS['cloud-devops'];
    }
  } else {
    // 2. Intelligent Keyword Weighted Inference
    const textCorpus = `${params.topic || ''} ${params.industry || ''} ${params.tone || ''}`.toLowerCase();
    let highestScore = 0;

    for (const preset of Object.values(THEME_PRESETS)) {
      let score = 0;
      for (const kw of preset.keywords) {
        if (textCorpus.includes(kw.toLowerCase())) {
          score += kw.includes(' ') || kw.includes('-') ? 3 : 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        matchedPreset = preset;
      }
    }
  }

  // 3. Resolve Mode (Explicit user choice overrides preset default)
  let resolvedMode: ThemeMode = matchedPreset.defaultMode;
  if (params.themeMode) {
    const m = params.themeMode.toLowerCase().trim();
    if (m === 'dark' || m === 'light' || m === 'hybrid') {
      resolvedMode = m as ThemeMode;
    }
  }

  return {
    preset: matchedPreset,
    themeMode: resolvedMode,
  };
}
