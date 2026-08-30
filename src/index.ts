#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ARCHETYPES } from './archetypes/Archetypes.js';
import { generateInteractiveViewer, CarouselProjectData } from './engine/bundle-builder.js';
import fs from 'fs';
import path from 'path';

const server = new Server(
  {
    name: 'mcp-carousel-engine',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * MANDATORY DESIGN & CODE RULES ENFORCED BY THE MCP SERVER
 */
const SYSTEM_DESIGN_RULES = `
=======================================================================
MCP CAROUSEL ENGINE — CORE DESIGN RULES & CONSTRAINTS (Said KOMI)
=======================================================================
1. RATIO & RESOLUTION :
   - Every slide MUST be exactly 1080px (width) by 1350px (height) (4:5 vertical).
   - The outer container must use 'overflow: hidden' and 'box-sizing: border-box'.
   - Never allow any text or card to overflow beyond the 1080x1350 bounds.

2. ZERO EMOJI POLICY :
   - Absolutely NO emojis allowed anywhere (no icons like 🚀, 🔥, 💻, etc.).
   - Use crisp typographic glyphs, ASCII tokens ('::', '//', '[+]', '[✓]', '->'), or pure SVG vectors.

3. VOLUMETRIC 3D LIGHTING & CONTRAST :
   - Use realistic multi-stop radial gradients for 3D spheres with soft ambient colored glow.
   - High typographic contrast: Massive bold display titles (font-weight 800/900, 120-180px) paired with thin hair-weight subtitles (font-weight 300).
   - Gradient text masks: -webkit-background-clip: text with smooth linear gradients.

4. PROFILE & SIGNATURE FRAMING :
   - The avatar photo in the closing slide must NEVER crop the top of the head/hair.
   - Always use objectFit: 'cover' with objectPosition: 'center 8%'.
   - Surround the avatar with a luminous dual-halo gradient ring.

5. NATIVE CHROMIUM RENDERING :
   - Never rely on html2canvas for exports (it causes gradient shifting and layout bugs).
   - Render exclusively via native headless Chromium for 100% pixel-perfect output.
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
          'Returns a catalogue of creative layout archetypes (Dark Neo-Geometric, Frosted Glass Blueprints, Minimal Luxury Monolith) with color palettes and layout suggestions.',
        inputSchema: {
          type: 'object',
          properties: {},
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
        name: 'render_carousel_project',
        description:
          'Renders a complete 5 to 7 slide carousel into lossless 1080x1350 PNG images and creates an interactive HTML preview.',
        inputSchema: {
          type: 'object',
          properties: {
            outputDirectory: {
              type: 'string',
              description: 'Absolute or relative destination path for the exported PNG images and preview.',
            },
            topic: {
              type: 'string',
              description: 'The title / theme of the carousel (e.g. "AWS VPC", "Docker Networking", "React Performance").',
            },
            themeColor: {
              type: 'string',
              description: 'Primary 3D orb / accent color (e.g. "orange", "red", "emerald", "cyan", "violet").',
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
              description: 'List of 5 to 6 slides to generate and render.',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['cover', 'card', 'signature'],
                    description: 'Slide layout type',
                  },
                  title1: { type: 'string', description: 'First word/phrase (masked gradient)' },
                  title2: { type: 'string', description: 'Second word/phrase (bold title)' },
                  description: { type: 'string', description: 'Main explanatory paragraph' },
                  bulletPoints: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 3 technical bullet points',
                  },
                  pillTag: { type: 'string', description: 'Technical tag for bottom glowing capsule' },
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
      content: [
        {
          type: 'text',
          text: SYSTEM_DESIGN_RULES,
        },
      ],
    };
  }

  if (name === 'list_creative_archetypes') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(ARCHETYPES, null, 2),
        },
      ],
    };
  }

  if (name === 'list_design_primitives') {
    const primitivesDocs = `
AVAILABLE REACT DESIGN PRIMITIVES:

1. <SlideCanvas backgroundColor="#000000" padding="76px 64px">
   - Base 1080x1350 (4:5) container guaranteeing zero overflow.

2. <WireframeGrid hLines={[200, 760, 1170]} vLines={[200, 380, 900]} crosses={[...]} />
   - Subtle geometric line grid with '+' intersection markers.

3. <ShadedOrb3D size={140} colorTheme="orange|red|emerald|cyan|violet" top={...} left={...} />
   - Parametric 3D volumetric sphere with multi-stop radial lighting and colored glow.

4. <LayeredCard variant="white|frosted-dark|glass-tinted" height={960} borderRadius={72}>
   - Center high-contrast card sitting above the wireframe grid.

5. <PillBadge text="tag :: value" gradient="linear-gradient(...)" rotation={0} />
   - Glowing gradient capsule with optional rotation angle.

6. <GradientMaskText text="title" fontSize={130} gradient="linear-gradient(...)" />
   - Text masked with smooth linear gradient (white into dark tones).

7. <ProfileMedal name="Said KOMI" title="Ingénieur Réseaux & Système" avatarSrc="..." />
   - Circular avatar with dual-gradient luminous halo and zero top-of-head crop.

8. <CarouselDots activeIndex={0} total={6} activeColor="#FF8800" />
   - Synchronized bottom pagination dots.
`;
    return {
      content: [
        {
          type: 'text',
          text: primitivesDocs,
        },
      ],
    };
  }

  if (name === 'render_carousel_project') {
    const outDir = path.resolve((args?.outputDirectory as string) || './exports');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const topic = (args?.topic as string) || 'Creative Carousel';
    const themeColor = (args?.themeColor as string) || 'orange';
    const slides = (args?.slides as any[]) || [];
    const author = (args?.author as any) || {
      name: 'Said KOMI',
      title: 'Ingénieur Réseaux & Système',
      handle: '@saidkomi',
    };

    const projectData: CarouselProjectData = {
      topic,
      themeColor,
      author,
      slides,
      outputDirectory: outDir,
    };

    const previewPath = generateInteractiveViewer(projectData);

    return {
      content: [
        {
          type: 'text',
          text: `[MCP Carousel Engine] Carrousel successfully built for "${topic}" (${slides.length} slides).\n• Output Folder: ${outDir}\n• Interactive Web Previewer: ${previewPath}\n• Author Profile: ${author.name} — ${author.title}\n• Resolution: 1080x1350 (4:5 Vertical) Native Chromium Compliant.`,
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Carousel Engine server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error running MCP Carousel Engine:', error);
  process.exit(1);
});
