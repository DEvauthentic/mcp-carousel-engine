#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ARCHETYPES } from './archetypes/Archetypes.js';
import { DESIGN_DNA_STORE, matchDesignDNA } from './registry/dna-store.js';
import { THEME_PRESETS } from './registry/theme-presets.js';
import { ThemeMode } from './registry/types.js';
import { renderCarouselProject, CarouselProjectData } from './engine/bundle-builder.js';
import path from 'path';

const server = new Server(
  {
    name: 'mcp-carousel-engine',
    version: '3.3.0',
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

/**
 * MANDATORY DESIGN & CODE RULES ENFORCED BY THE MCP SERVER v3.3 (Said KOMI)
 */
const SYSTEM_DESIGN_RULES = `
=======================================================================
MCP CAROUSEL ENGINE v3.3 — CORE DESIGN RULES & FORMULA (Said KOMI)
=======================================================================
1. RATIO & RESOLUTION :
   - Every slide MUST be exactly 1080px (width) by 1350px (height) (4:5 vertical).
   - Outer container enforces 'overflow: hidden' and 'box-sizing: border-box'.
   - Zero-overflow guaranteed via adaptive typography calculations.

2. SOVEREIGN HYBRID FORMULA (SIGNATURE SAID KOMI) :
   - Background Canvas: Pure space black (#000000) with subtle wireframe grid & coordinates.
   - Ambient Elements: Shaded 3D volumetric spheres (radial lighting + colored glow).
   - Floating Center Card: PURE WHITE (#FFFFFF), 960px height, 72px radius, deep elevation.
   - Hanging Pill Badge: Obsidian black (#0A0A0A) with 2.5px vibrant neon border, overlapping
     the bottom border of the white card onto the black canvas.
   - Typography inside card: Monumental ink black (#000000) 900 weight titles, high-contrast subtitles.

3. ZERO EMOJI POLICY (STRICT) :
   - Absolutely NO emojis allowed anywhere (no 🚀, 🔥, 💻, etc.).
   - Use crisp typographic glyphs, ASCII tokens ('::', '//', '[+]', '[✓]', '->'), or pure SVG vectors.

4. MATHEMATICAL MICRO-CHARTS (SVG) :
   - 'area-sparkline' : Bézier spline with clean flat area tint and baseline SLA line.
   - 'bento-bars'     : High-contrast horizontal benchmarks; winning bar in solid primary accent.
   - 'radial-gauge'   : 260° high-contrast telemetry with monumental centered metrics.
   - 'pipeline-flow'  : Node-based network topologie with latency indicators & highlighted mesh.

5. 5 CURATED THEME PRESETS :
   - 'cloud-devops'    : AWS Orange (#FF9900) + Emerald (#10B981)
   - 'cybersecurity'   : Matrix Green (#10B981) + Laser Cyan (#00F0FF)
   - 'fintech-systems' : Klein Blue (#0052FF) + Electric Cyan (#06B6D4)
   - 'ai-deeptech'     : Quantum Violet (#8B5CF6) + Cyber Cyan (#06B6D4)
   - 'monochrome-swiss': Swiss High-Contrast Ink (#0A0A0A) + Architectural Zinc (#71717A)

6. PROFILE & SIGNATURE FRAMING :
   - Avatar photo in closing slide must NEVER crop top of the head/hair (center 8% position).
   - Dual-halo luminous ring with author professional title & handle.

7. NATIVE CHROMIUM 1:1 RENDERING :
   - Automated Headless Chromium captures lossless 1080x1350 PNG images with 2x Retina scale.
   - Generates native multi-page LinkedIn PDF + interactive web gallery (index.html).
=======================================================================
`;

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_design_rules',
        description:
          'Returns the mandatory design rules, aspect ratios (4:5 vertical 1080x1350), zero-emoji policy, and typography standards for creating world-class carousels.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_creative_archetypes',
        description:
          'Returns the catalogue of creative layout archetypes (Neo-Geometric Dark, Swiss Editorial Clean, Cyber Glass Bento, Paper Light Editorial) with palette, pattern specifications, and DNA profile IDs.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'match_design_dna',
        description:
          'Semantically matches a user topic/industry/tone with the optimal Design DNA profile and returns its palette, typography and layout guidelines.',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'Subject or theme of the carousel (e.g. "Cloud Security", "Fintech API", "Cancer Diagnostics")' },
            industry: { type: 'string', description: 'Industry or domain (e.g. "DevOps", "Health", "Finance", "Cyber")' },
            tone: { type: 'string', description: 'Visual tone (e.g. "authoritative", "clinical", "minimal", "tactical")' },
          },
          required: ['topic'],
        },
      },
      {
        name: 'list_design_primitives',
        description:
          'Lists all available React design primitives (SlideCanvas, WireframeGrid, ShadedOrb3D, LayeredCard, PillBadge, GradientMaskText, ProfileMedal, CarouselDots) with their props.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_theme_presets',
        description:
          'Lists all 5 curated industry theme presets (cloud-devops, cybersecurity, fintech-systems, ai-deeptech, monochrome-swiss) and the 3 visual modes (hybrid, dark, light).',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'render_carousel_project',
        description:
          'Compiles a 5 to 7 slide carousel into lossless 1080x1350 PNG images via automated Headless Chromium rendering and creates an interactive web viewer.',
        inputSchema: {
          type: 'object',
          properties: {
            outputDirectory: {
              type: 'string',
              description: 'Destination directory path for the exported PNG images and preview index.html.',
            },
            topic: {
              type: 'string',
              description: 'The title / theme of the carousel (e.g. "AWS VPC Architecture", "FHIR Interoperability").',
            },
            preset: {
              type: 'string',
              enum: ['cloud-devops', 'cybersecurity', 'fintech-systems', 'ai-deeptech', 'monochrome-swiss'],
              description: 'Optional curated industry theme preset. Auto-inferred from topic/industry if omitted ("cloud-devops", "cybersecurity", "fintech-systems", "ai-deeptech", "monochrome-swiss").',
            },
            themeMode: {
              type: 'string',
              enum: ['hybrid', 'dark', 'light'],
              description: 'Visual mode: "hybrid" (Said KOMI signature: black canvas + white floating card), "dark" (Full Dark Terminal: black canvas + graphite #111113 card + crisp zinc/white text), or "light" (warm paper #F6F5F0 canvas + white card). Defaults to preset default or "hybrid".',
            },
            dnaId: {
              type: 'string',
              description: 'Optional specific DNA profile ID. Available: "dna-aws-cloud" (cloud/infra), "dna-health-tech" (medtech/clinical), "dna-swiss-fintech" (finance/banking), "dna-cyber-defense" (cybersecurity/SOC), "dna-minimal-luxury" (strategy/CEO/executive), "dna-light-editorial" (business/reporting/press/annual). Auto-selected from topic if omitted.',
            },
            themeColor: {
              type: 'string',
              description: 'Optional accent color override (e.g. "orange", "emerald", "cyan", "violet", "red", "lime").',
            },
            licenseKey: {
              type: 'string',
              description: 'Optional Pro License Key (e.g. from polar.sh/saidkomi or env CAROUSEL_LICENSE_KEY). Unlocks 100% white-label (removes watermark badge) and unlocks priority features.',
            },
            author: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Author full name (e.g. "Said KOMI")' },
                title: { type: 'string', description: 'Professional title (e.g. "Ingénieur Réseaux & Système")' },
                handle: { type: 'string', description: 'Social handle (e.g. "@saidkomi")' },
                avatarPath: { type: 'string', description: 'Path to avatar photo image' },
              },
              required: ['name', 'title', 'handle'],
            },
            slides: {
              type: 'array',
              description: 'List of 5 to 7 slides to generate and render.',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['cover', 'card', 'signature'],
                    description: 'Slide layout type',
                  },
                  title1: { type: 'string', description: 'First headline line or tag' },
                  title2: { type: 'string', description: 'Main bold title line' },
                  boldTitle: { type: 'string', description: 'Monumental bold card title (e.g. "transformers")' },
                  thinTitle: { type: 'string', description: 'Monumental light subtitle (e.g. "attention")' },
                  description: { type: 'string', description: 'Main explanatory technical narrative' },
                  features: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of technical features/bullet points with signature tick bars',
                  },
                  bulletPoints: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Alternative list of bullet points',
                  },
                  pillTag: { type: 'string', description: 'Technical badge capsule text (e.g. "// CLOUD ARCHITECTURE")' },
                  pillText: { type: 'string', description: 'Alternative technical badge capsule text' },
                  topicTag: { type: 'string', description: 'Top header topic tag (e.g. "INTELLIGENCE ARTIFICIELLE")' },
                  ctaText: { type: 'string', description: 'Call-to-action text for signature slide' },
                  // ── Advanced Layout Pattern Fields (v3.2) ──────────────────────────
                  layoutPattern: {
                    type: 'string',
                    enum: ['classic-card', 'comparison-versus', 'stat-highlight', 'flow-pipeline', 'code-terminal', 'manifesto-quote', 'metric-chart'],
                    description: 'Explicit layout pattern for this slide. classic-card=default; comparison-versus=requires versus{badTitle,badPoints,goodTitle,goodPoints}; stat-highlight=requires statValue+statLabel; flow-pipeline=requires steps[]; code-terminal=requires codeSnippet; manifesto-quote=requires quote; metric-chart=requires chart{type, ...}.',
                  },
                  chart: {
                    type: 'object',
                    description: 'For metric-chart: mathematical SVG technical data visualization (area-sparkline, bento-bars, radial-gauge, pipeline-flow).',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['area-sparkline', 'bento-bars', 'radial-gauge', 'pipeline-flow'],
                        description: 'Chart archetype',
                      },
                      metric: { type: 'string', description: 'Headline metric value (e.g. "42ms", "-78%", "99.9%")' },
                      metricLabel: { type: 'string', description: 'Label for metric (e.g. "Latence P99 Edge")' },
                      delta: { type: 'string', description: 'Delta / Gain badge (e.g. "▼ -78%", "[+] 11x PLUS RAPIDE")' },
                      deltaType: { type: 'string', enum: ['positive', 'negative', 'neutral'], description: 'positive=green, negative=red' },
                      baselineValue: { type: 'number', description: 'For area-sparkline: target threshold horizontal line' },
                      baselineLabel: { type: 'string', description: 'For area-sparkline: label for threshold line (e.g. "TARGET SLA")' },
                      points: { type: 'array', items: { type: 'number' }, description: 'For area-sparkline: numeric data points (e.g. [190, 160, 120, 85, 42])' },
                      labels: { type: 'array', items: { type: 'string' }, description: 'For area-sparkline: x-axis labels (e.g. ["S1", "S2", "S3", "S4", "S5"])' },
                      unit: { type: 'string', description: 'Unit for numbers (e.g. "ms", "%", "req/s")' },
                      bars: {
                        type: 'array',
                        description: 'For bento-bars: list of comparison bars',
                        items: {
                          type: 'object',
                          properties: {
                            label: { type: 'string' },
                            value: { type: 'number' },
                            displayValue: { type: 'string' },
                            highlight: { type: 'boolean' },
                            deltaBadge: { type: 'string' },
                          },
                        },
                      },
                      percentage: { type: 'number', description: 'For radial-gauge: gauge percentage 0-100' },
                      gaugeLabel: { type: 'string', description: 'For radial-gauge: subtitle inside or below gauge' },
                      gaugeSubtext: { type: 'string', description: 'For radial-gauge: secondary explanatory text' },
                      nodes: {
                        type: 'array',
                        description: 'For pipeline-flow: topology nodes',
                        items: {
                          type: 'object',
                          properties: {
                            title: { type: 'string' },
                            subtitle: { type: 'string' },
                            tag: { type: 'string' },
                            latency: { type: 'string' },
                            highlight: { type: 'boolean' },
                          },
                        },
                      },
                    },
                    required: ['type'],
                  },
                  versus: {
                    type: 'object',
                    description: 'For comparison-versus pattern: contrasts two approaches side by side.',
                    properties: {
                      badTitle: { type: 'string', description: 'Left column header (bad practice)' },
                      badPoints: { type: 'array', items: { type: 'string' }, description: 'List of bad practice points' },
                      goodTitle: { type: 'string', description: 'Right column header (good practice)' },
                      goodPoints: { type: 'array', items: { type: 'string' }, description: 'List of good practice points' },
                    },
                  },
                  statValue: { type: 'string', description: 'For stat-highlight: the big monumental metric value (e.g. "99.9%", "< 10ms", "100 Gbps")' },
                  statLabel: { type: 'string', description: 'For stat-highlight: the label under the metric (e.g. "UPTIME GARANTI")' },
                  statSubtext: { type: 'string', description: 'For stat-highlight: explanatory text under the metric' },
                  steps: {
                    type: 'array',
                    description: 'For flow-pipeline: ordered steps. Each step can be a string or {title, desc}.',
                    items: {
                      oneOf: [
                        { type: 'string' },
                        { type: 'object', properties: { title: { type: 'string' }, desc: { type: 'string' } } },
                      ],
                    },
                  },
                  codeSnippet: { type: 'string', description: 'For code-terminal: the code block content (plain text, will be escaped)' },
                  codeFilename: { type: 'string', description: 'For code-terminal: filename shown in terminal header (e.g. "vpc.tf", "api.py")' },
                  quote: { type: 'string', description: 'For manifesto-quote: the citation text' },
                  quoteAuthor: { type: 'string', description: 'For manifesto-quote: the citation author/source' },
                },
                required: ['type'],
              },
            },
          },
          required: ['outputDirectory', 'topic', 'author', 'slides'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_design_rules') {
    return {
      content: [{ type: 'text', text: SYSTEM_DESIGN_RULES }],
    };
  }

  if (name === 'list_creative_archetypes') {
    return {
      content: [{ type: 'text', text: JSON.stringify(ARCHETYPES, null, 2) }],
    };
  }

  if (name === 'match_design_dna') {
    const topic = (args?.topic as string) || '';
    const industry = args?.industry as string | undefined;
    const tone = args?.tone as string | undefined;

    const matched = matchDesignDNA({ topic, industry, tone });
    return {
      content: [
        {
          type: 'text',
          text: `[Design DNA Matcher] Matched "${matched.name}" (${matched.id})\n• Archetype: ${matched.archetypeId}\n• Industry: ${matched.industry}\n• Palette: Background=${matched.palette.background}, Accent=${matched.palette.primaryAccent}\n• Guidance: ${matched.promptGuidance}`,
        },
      ],
    };
  }

  if (name === 'list_design_primitives') {
    const primitivesDocs = `
AVAILABLE REACT DESIGN PRIMITIVES:
1. <SlideCanvas backgroundColor="#000000" padding="76px 64px">
   - Base 1080x1350 (4:5) container guaranteeing zero overflow.
2. <WireframeGrid hLines={[220, 1120]} vLines={[200, 880]} />
   - Subtle geometric line grid with '+' intersection markers.
3. <ShadedOrb3D size={140} colorTheme="orange|emerald|cyan|violet" />
   - Parametric 3D volumetric sphere with multi-stop radial lighting and colored glow.
4. <LayeredCard variant="white|frosted-dark|glass-tinted" height={980}>
   - Center high-contrast card sitting above the wireframe grid.
5. <PillBadge text="tag :: value" />
   - Glowing gradient capsule with optional rotation.
6. <GradientMaskText text="title" fontSize={130} />
   - Text masked with smooth linear gradient.
7. <ProfileMedal name="Said KOMI" title="Ingénieur Réseaux & Système" />
   - Circular avatar with dual-gradient luminous halo and zero top-of-head crop.
8. <CarouselDots activeIndex={0} total={6} />
   - Synchronized bottom pagination dots.
`;
    return {
      content: [{ type: 'text', text: primitivesDocs }],
    };
  }

  if (name === 'list_theme_presets') {
    const presetsList = Object.values(THEME_PRESETS).map(p => ({
      id: p.id,
      name: p.name,
      industry: p.industry,
      defaultMode: p.defaultMode,
      description: p.description,
      accents: {
        primary: p.primaryAccent,
        secondary: p.secondaryAccent,
      },
    }));

    const modesInfo = {
      hybrid: 'Signature Said KOMI : Fond noir absolu (#000000) + Carte centrale blanche (#FFFFFF) flottante à fort contraste + Accents néon + Badges suspendus.',
      dark: 'Full Dark Terminal : Fond noir (#000000) + Carte centrale graphite (#111113) + Typographie blanche pure (#FFFFFF) et zinc (#A1A1AA) + Accents luminescents.',
      light: 'Paper Light Editorial : Toile papier chaud (#F6F5F0) + Carte centrale blanche (#FFFFFF) + Typographie encre sombre (#0A0A0A) + Accents de couleur.',
    };

    return {
      content: [
        {
          type: 'text',
          text: `THEME PRESETS (5 Curated Profiles) :\n${JSON.stringify(presetsList, null, 2)}\n\nVISUAL MODES (3 Flavors) :\n${JSON.stringify(modesInfo, null, 2)}`,
        },
      ],
    };
  }

  if (name === 'render_carousel_project') {
    const outDir = path.resolve((args?.outputDirectory as string) || './exports');
    const topic = (args?.topic as string) || 'Creative Carousel';
    const dnaId = args?.dnaId as string | undefined;
    const themeColor = args?.themeColor as string | undefined;
    const preset = args?.preset as string | undefined;
    const themeMode = args?.themeMode as ThemeMode | undefined;
    const licenseKey = (args?.licenseKey as string | undefined) || process.env.CAROUSEL_LICENSE_KEY;
    const rawSlides = (args?.slides as any[]) || [];
    // Map layoutPattern -> pattern (MCP schema alias to internal field)
    const slides = rawSlides.map((s: any) => ({
      ...s,
      pattern: s.pattern || s.layoutPattern || undefined,
    }));
    const author = (args?.author as any) || {
      name: 'Said KOMI',
      title: 'Ingénieur Réseaux & Système',
      handle: '@saidkomi',
    };

    const projectData: CarouselProjectData = {
      topic,
      dnaId,
      themeColor,
      preset,
      themeMode,
      licenseKey,
      author,
      slides,
      outputDirectory: outDir,
    };

    const result = await renderCarouselProject(projectData);

    const tierStatusMsg = result.licenseStatus.isPro
      ? `[PRO TIER ACTIF] Licence Validée (${result.licenseStatus.licensee || 'Client Pro'}) — Zéro watermark, rendu white-label.`
      : `[FREE TIER ACTIF] Watermark viral inclus. Débloquez la version Pro White-Label sur ${result.licenseStatus.storeUrl}`;

    return {
      content: [
        {
          type: 'text',
          text: `[MCP Carousel Engine v3.3] Carrousel compilé avec succès pour "${topic}" (${slides.length} slides) en ${result.durationMs}ms.\n• Statut Licence : ${tierStatusMsg}\n• Dossier de sortie : ${result.outputDirectory}\n• Thème & Mode : Preset "${result.presetUsed}" • Mode [${result.themeModeUsed.toUpperCase()}]\n• ADN Design appliqué : ${result.dnaUsed.name} [${result.dnaUsed.archetypeId}]\n• Images PNG rendues (1080x1350 Retina 2x) : ${result.exportedImages.length} fichiers\n• Studio Interactif (viewer web) : ${result.previewHtmlPath}${result.linkedinPdfPath ? '\n• PDF LinkedIn Natif (multipages) : ' + result.linkedinPdfPath : ''}\n• Profil Auteur : ${author.name} — ${author.title}`,
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

/**
 * MCP PROMPTS: Structured blueprints for AI Assistants (Said KOMI Standards)
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'compose_technical_carousel',
        description:
          'Generates a high-retention 5-slide technical architecture carousel blueprint for Said KOMI, formatted ready to call render_carousel_project.',
        arguments: [
          {
            name: 'topic',
            description: 'Core subject (e.g. "Architecture Zero-Trust", "Kafka Event-Driven", "SLA 99.999% Microservices")',
            required: true,
          },
          {
            name: 'industry',
            description: 'Technical industry (DevOps, Cloud, Fintech, Cybersecurity, AI/MLOps)',
            required: false,
          },
          {
            name: 'targetMetric',
            description: 'Key numerical proof point (e.g. "-85% latence P99", "50k req/s", "120 clusters durcis")',
            required: false,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: promptArgs } = request.params;

  if (name === 'compose_technical_carousel') {
    const topic = (promptArgs?.topic as string) || 'Architecture Cloud & Haute Disponibilité';
    const targetMetric = (promptArgs?.targetMetric as string) || '99.99% Résilience';

    return {
      description: `Plan de carrousel LinkedIn haute autorité pour : ${topic}`,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Tu es le Directeur Artistique & Lead Architecte pour Said KOMI (Ingénieur Réseaux & Système).
Génère la structure JSON complète pour appeler le tool "render_carousel_project" sur le sujet : "${topic}".

RÈGLES D'OR DU DESIGN :
1. Formule Hybride Souveraine : Canvas noir #000000 + Carte blanche #FFFFFF + Sphères 3D volumétriques.
2. Zéro émoji : Utiliser uniquement des tokens ASCII ('//', '::', '➔', '▲', '★') ou labels techniques.
3. 5 Slides exactement :
   - Slide 1 (cover) : Hook monumental (title1 en minuscules fines, title2 en 900 bold percutant).
   - Slide 2 (card, pattern='metric-chart') : Comparatif bento-bars (Legacy vs Modern) avec la barre gagnante en accent vibrant.
   - Slide 3 (card, pattern='metric-chart') : area-sparkline avec ligne de baseline SLA (ou pipeline-flow).
   - Slide 4 (card, pattern='metric-chart') : radial-gauge télémétrie 260° affichant le score cible ("${targetMetric}").
   - Slide 5 (signature) : Outro avec badge expertise, photo d'auteur et appel à la discussion.

Génère l'appel au tool "render_carousel_project" avec tous les champs structurés.`,
          },
        },
      ],
    };
  }

  throw new Error(`Prompt not found: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Carousel Engine v3.3 server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error running MCP Carousel Engine v3.3:', error);
  process.exit(1);
});
