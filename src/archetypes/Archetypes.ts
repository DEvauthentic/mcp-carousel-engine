/**
 * CREATIVE CAROUSEL ARCHETYPES
 * High-end layout presets that agents can remix, extend, or use as creative launchpads.
 */

export interface ArchetypeDefinition {
  id: string;
  name: string;
  description: string;
  recommendedPalette: {
    background: string;
    primary3D: string;
    accent3D: string;
    textMain: string;
    pillGradient: string;
  };
  structure: {
    hook: string;
    bodySlides: string;
    outro: string;
  };
  sampleCodeSnippet: string;
}

export const ARCHETYPES: Record<string, ArchetypeDefinition> = {
  'neo-geometric-dark': {
    id: 'neo-geometric-dark',
    name: 'Dark Neo-Geometric 4:5 Master (Said KOMI Formula)',
    description: 'High-contrast dark canvas (#000000) with wireframe grid, volumetric 3D spheres, pure white rounded cards, gradient-masked typography, and zero emojis.',
    recommendedPalette: {
      background: '#000000',
      primary3D: 'Orange AWS (#FF9900) or Crimson (#FF0033)',
      accent3D: 'Emerald Security (#10B981) or Lime Neon (#BAF700)',
      textMain: '#FFFFFF / #000000 (inside cards)',
      pillGradient: 'linear-gradient(90deg, #FF9900 0%, #CC6600 100%)',
    },
    structure: {
      hook: 'Slide 1: Giant masked typography + 3D orb + directional arrow orb + glowing capsule.',
      bodySlides: 'Slides 2-5: Pure white center cards (960px height, 72px radius) with 3D orbs peeking in corners + tech pill badge at bottom.',
      outro: 'Slide 6: White vector bookmark + author profile avatar with luminous dual-halo ring + bold follow CTA.',
    },
    sampleCodeSnippet: `
<SlideCanvas backgroundColor="#000000">
  <WireframeGrid />
  <ShadedOrb3D size={140} colorTheme="orange" top={310} left={350} />
  <GradientMaskText text="amazon" fontSize={130} />
  <div style={{ fontSize: 180, fontWeight: 900, color: '#FFF' }}>vpc</div>
  <PillBadge text="la forteresse du cloud" />
  <CarouselDots activeIndex={0} />
</SlideCanvas>
    `,
  },

  'frosted-glass-blueprint': {
    id: 'frosted-glass-blueprint',
    name: 'Frosted Glass & Cyber Blueprints',
    description: 'Translucent frosted glass cards (backdrop-filter blur 40px) floating above metallic cyan geometries and laser coordinate markers.',
    recommendedPalette: {
      background: '#05070B',
      primary3D: 'Electric Cyan (#06B6D4)',
      accent3D: 'Ultraviolet (#8B5CF6)',
      textMain: '#FFFFFF',
      pillGradient: 'linear-gradient(90deg, #06B6D4 0%, #0284C7 100%)',
    },
    structure: {
      hook: 'Slide 1: Blueprint wireframe grid + illuminated cyan torus + futuristic bold title.',
      bodySlides: 'Slides 2-5: Frosted glass translucent cards with glowing cyan/violet borders and monospaced spec badges.',
      outro: 'Slide 6: Spatial signature card with avatar in cyan neon ring + network join CTA.',
    },
    sampleCodeSnippet: `
<SlideCanvas backgroundColor="#05070B">
  <WireframeGrid color="rgba(6, 182, 212, 0.15)" />
  <ShadedOrb3D size={180} colorTheme="cyan" top={200} right={80} />
  <LayeredCard variant="frosted-dark" height={940}>
    <GradientMaskText text="architecture" fontSize={110} />
  </LayeredCard>
</SlideCanvas>
    `,
  },

  'minimal-luxury-monolith': {
    id: 'minimal-luxury-monolith',
    name: 'Minimalist Luxury Monolith (Inverted Palette)',
    description: 'Architectural bone/chalk white canvas (#F4F3EF) with a deep jet-black floating monolithic card, sharp typography, and a single amber 3D gemstone.',
    recommendedPalette: {
      background: '#F4F3EF',
      primary3D: 'Amber Incandescent (#FF9500)',
      accent3D: 'Obsidian Black (#0A0A0A)',
      textMain: '#0A0A0A / #FFFFFF (inside monolith)',
      pillGradient: 'linear-gradient(90deg, #FF9500 0%, #D97706 100%)',
    },
    structure: {
      hook: 'Slide 1: Crisp chalk canvas + massive obsidian typography + floating amber 3D jewel.',
      bodySlides: 'Slides 2-5: Deep jet-black monolithic cards with high-contrast white text and razor-sharp borders.',
      outro: 'Slide 6: Executive signature card with gold/amber halo.',
    },
    sampleCodeSnippet: `
<SlideCanvas backgroundColor="#F4F3EF" padding="80px 60px">
  <ShadedOrb3D size={150} colorTheme="orange" top={180} left={80} />
  <div style={{ color: '#0A0A0A', fontSize: 120, fontWeight: 900 }}>LEADERSHIP</div>
</SlideCanvas>
    `,
  },
};
