import { DesignDNA, ThemeMode } from '../registry/types.js';
import { calcAdaptiveTypography } from '../engine/typography-engine.js';
import { ChartDataConfig, renderSvgChart } from '../engine/chart-engine.js';
import { LicenseStatus, renderViralWatermarkHtml } from '../engine/license-manager.js';

export type SlideLayoutPattern =
  | 'auto'
  | 'classic-card'
  | 'stat-highlight'
  | 'comparison-versus'
  | 'flow-pipeline'
  | 'code-terminal'
  | 'manifesto-quote'
  | 'metric-chart';

export interface SlideRenderData {
  type: 'cover' | 'card' | 'signature';
  pattern?: SlideLayoutPattern;
  title1?: string;
  title2?: string;
  boldTitle?: string;
  thinTitle?: string;
  description?: string;
  bulletPoints?: string[];
  features?: string[];
  pillTag?: string;
  pillText?: string;
  topicTag?: string;
  ctaText?: string;
  // Specialized Creative Fields
  statValue?: string;
  statLabel?: string;
  statSubtext?: string;
  versus?: {
    badTitle?: string;
    badPoints?: string[];
    goodTitle?: string;
    goodPoints?: string[];
  };
  steps?: Array<{ title: string; desc?: string }> | string[];
  codeSnippet?: string;
  codeLanguage?: string;
  codeFilename?: string;
  quote?: string;
  quoteAuthor?: string;
  // Technical Data Visualization Fields
  chart?: ChartDataConfig;
}

/**
 * Automatically infers the most impactful layout pattern based on provided fields.
 */
export function resolveSlidePattern(slide: SlideRenderData): SlideLayoutPattern {
  if (slide.type === 'cover' || slide.type === 'signature') return 'classic-card';
  if (slide.pattern && slide.pattern !== 'auto') return slide.pattern;
  if (slide.chart) return 'metric-chart';
  if (slide.statValue) return 'stat-highlight';
  if (slide.versus) return 'comparison-versus';
  if (slide.steps && slide.steps.length > 0) return 'flow-pipeline';
  if (slide.codeSnippet) return 'code-terminal';
  if (slide.quote) return 'manifesto-quote';
  return 'classic-card';
}

/**
 * Generates an isolated, ultra-high-definition 1080x1350 HTML slide document.
 */
export function generateSlideHtml(params: {
  slide: SlideRenderData;
  dna: DesignDNA;
  author: { name: string; title: string; handle: string; avatarPath?: string };
  slideIndex: number;
  totalSlides: number;
  topic?: string;
  industry?: string;
  themeMode?: ThemeMode;
  licenseStatus?: LicenseStatus;
}): string {
  const { slide, dna } = params;
  const pattern = resolveSlidePattern(slide);

  const itemsCount = slide.features?.length || slide.bulletPoints?.length || 0;
  const fullTitle = [slide.boldTitle, slide.thinTitle, slide.title1, slide.title2].filter(Boolean).join(' ');
  const typo = calcAdaptiveTypography({
    title: fullTitle || 'Architecture',
    description: slide.description,
    bulletPointsCount: itemsCount,
    statValue: slide.statValue,
  });

  if (dna.archetypeId === 'swiss-editorial-clean') {
    return renderSwissEditorialHtml(params, typo, pattern);
  } else if (dna.archetypeId === 'cyber-glass-bento') {
    return renderCyberBentoHtml(params, typo, pattern);
  } else if (dna.archetypeId === 'paper-light-editorial') {
    return renderPaperLightHtml(params, typo, pattern);
  } else {
    // Formule Souveraine Neo-Geometric Master : Carte Centrale 980px, Sphères 3D,
    // Grille Wireframe, Hanging Pill Badges et Typographie Monumentale.
    return renderNeoGeometricHtml(params, typo, pattern);
  }
}

/**
 * 1. NEO-GEOMETRIC MASTER (Said KOMI Formula — Hybrid / Dark / Light Modes)
 */
function renderNeoGeometricHtml(params: any, typo: any, pattern: SlideLayoutPattern): string {
  const { slide, dna, author, slideIndex, totalSlides, topic, industry, themeMode = 'hybrid', licenseStatus = { isPro: false, tier: 'free', storeUrl: 'https://polar.sh/saidkomi' } } = params;
  const p = dna.palette;
  const isDark = themeMode === 'dark';
  const isLight = themeMode === 'light';
  const isHybrid = themeMode === 'hybrid';
  const isCover = slide.type === 'cover';
  const isSignature = slide.type === 'signature';

  // Topic tag computation: prioritize slide-specific tag, then carousel topic, then industry
  const rawTag = slide.topicTag || topic || slide.pillTag || slide.pillText || industry || 'INTELLIGENCE ARTIFICIELLE';
  const displayTopic = rawTag.replace(/^guide\s*::\s*/i, '').replace(/::.*$/, '').trim().toUpperCase();

  // Dynamic 3D Orbs Choreography behind the white card
  const orbConfig = [
    { primary: { size: 240, top: '30px', left: '-30px' }, secondary: { size: 160, bottom: '300px', right: '-50px' } },
    { primary: { size: 230, top: '50px', right: '-40px' }, secondary: { size: 170, bottom: '260px', left: '-40px' } },
    { primary: { size: 250, top: '25px', left: '-40px' }, secondary: { size: 160, bottom: '320px', right: '-40px' } },
    { primary: { size: 220, top: '60px', right: '-30px' }, secondary: { size: 180, bottom: '280px', left: '-50px' } },
  ][slideIndex % 4];

  // Resolve titles:
  let boldTitle = slide.boldTitle || slide.title1 || 'concept';
  let thinTitle = slide.thinTitle || slide.title2 || '';

  // If user only provided a single boldTitle with multiple words, split it if thinTitle is empty
  if (!thinTitle && boldTitle.includes(' ') && !isCover) {
    const parts = boldTitle.split(' ');
    boldTitle = parts[0];
    thinTitle = parts.slice(1).join(' ');
  }

  const featuresList = slide.features || slide.bulletPoints || [];
  const pillText = slide.pillText || slide.pillTag || 'standard :: production';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    body {
      width: 1080px; height: 1350px;
      background: ${isLight ? '#F6F5F0' : '#000000'};
      color: ${isLight ? '#0A0A0A' : '#FFFFFF'};
      font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden;
      display: flex; flex-direction: column; justify-content: space-between; padding: 76px 64px;
      box-sizing: border-box;
    }
    .grid-line-h { position: absolute; left: 0; right: 0; height: 1.5px; background: ${isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)'}; pointer-events: none; z-index: 1; }
    .grid-line-v { position: absolute; top: 0; bottom: 0; width: 1.5px; background: ${isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)'}; pointer-events: none; z-index: 1; }
    .crosshair {
      position: absolute; font-family: 'JetBrains Mono', monospace; font-size: 14px;
      color: ${isLight ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.45)'}; font-weight: 700; transform: translate(-50%, -50%); z-index: 1;
    }

    /* Volumetric 3D Orbs */
    .sphere-orange-3d {
      position: absolute; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${p.primaryAccent} 35%, ${p.secondaryAccent || '#994400'} 80%, ${isLight ? '#D4D4D8' : '#000000'} 100%);
      box-shadow: 0 20px 60px ${p.glowColor || 'rgba(255, 136, 0, 0.45)'};
    }
    .sphere-emerald-3d {
      position: absolute; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${p.secondaryAccent || '#10B981'} 35%, ${p.primaryAccent} 80%, ${isLight ? '#D4D4D8' : '#000000'} 100%);
      box-shadow: 0 20px 60px ${p.glowColor || 'rgba(16, 185, 129, 0.4)'};
    }

    .top-bar {
      display: flex; justify-content: space-between; align-items: center; z-index: 10; position: relative;
    }
    .topic-tag {
      display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace;
      font-size: 16px; font-weight: 700; color: ${p.primaryAccent}; letter-spacing: 0.08em;
    }
    .author-handle {
      font-size: 28px; font-weight: 500; color: ${isLight ? '#0A0A0A' : '#FFFFFF'}; letter-spacing: -0.01em;
    }

    /* Center Rounded Card — Sovereign Contrast */
    .center-card {
      width: 100%; height: 960px;
      background-color: ${isDark ? '#0C0D11' : '#FFFFFF'};
      color: ${isDark ? '#FFFFFF' : '#000000'};
      border: ${isDark ? `2px solid ${p.primaryAccent}` : isLight ? '1.5px solid rgba(0, 0, 0, 0.08)' : 'none'};
      border-radius: 72px; padding: 76px 64px 74px 64px; display: flex; flex-direction: column;
      justify-content: space-between; position: relative;
      box-shadow: ${isDark ? `0 0 70px ${p.glowColor || 'rgba(16, 185, 129, 0.35)'}, 0 40px 120px rgba(0, 0, 0, 0.98)` : isLight ? '0 30px 90px rgba(0, 0, 0, 0.06)' : '0 40px 120px rgba(0, 0, 0, 0.85)'};
      z-index: 4; box-sizing: border-box;
    }

    /* Hanging Pill Badge — High Contrast Solid Precision */
    .hanging-pill {
      position: absolute; bottom: -34px; left: 56px;
      background: ${isDark ? '#FFFFFF' : '#0A0A0A'};
      border: 2.5px solid ${p.primaryAccent};
      color: ${isDark ? '#000000' : '#FFFFFF'};
      padding: 18px 44px; border-radius: 60px; font-size: 24px;
      font-weight: 800; letter-spacing: -0.01em; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
      white-space: nowrap; z-index: 10;
    }

    /* Carousel dots */
    .carousel-dots {
      display: flex; justify-content: center; gap: 16px; align-items: center; margin-top: 32px; z-index: 10;
    }
    .carousel-dot {
      width: 14px; height: 14px; border-radius: 50%;
      background-color: ${isLight ? 'rgba(0, 0, 0, 0.20)' : 'rgba(255, 255, 255, 0.25)'};
    }
    .carousel-dot.active {
      background-color: ${p.primaryAccent}; box-shadow: 0 0 20px ${p.primaryAccent};
    }
  </style>
</head>
<body>
  <!-- Architectural Grid -->
  <div class="grid-line-h" style="top: 200px;"></div>
  <div class="grid-line-h" style="top: ${isCover ? '760px' : '1200px'};"></div>
  <div class="grid-line-v" style="left: ${isCover ? '200px' : '600px'};"></div>
  <div class="grid-line-v" style="right: ${isCover ? '180px' : '120px'};"></div>
  <div class="crosshair" style="top: 200px; left: 200px;">+</div>
  <div class="crosshair" style="top: 200px; right: 180px;">+</div>
  ${!isCover ? `<div class="crosshair" style="top: 1200px; left: 600px;">+</div>` : `<div class="crosshair" style="top: 760px; left: 380px;">+</div>`}

  ${isCover ? `
    <!-- Cover Specific 3D Orbs -->
    <div class="sphere-orange-3d" style="width: 140px; height: 140px; top: 310px; left: 350px; z-index: 2;"></div>

    <!-- CTA Arrow Circle on the Right Border -->
    <div style="position: absolute; right: -40px; bottom: 240px; width: 200px; height: 200px; z-index: 4; display: flex; align-items: center; justify-content: center;">
      <div class="sphere-emerald-3d" style="width: 200px; height: 200px; right: 0; top: 0;"></div>
      <svg width="160" height="48" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: -30px; z-index: 5;">
        <line x1="0" y1="12" x2="70" y2="12" stroke="white" stroke-width="3" />
        <path d="M58 2L70 12L58 22" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <div class="top-bar">
      <div class="topic-tag"><span>//</span><span>${displayTopic}</span></div>
      ${author?.handle ? `<div class="author-handle">${author.handle}</div>` : ''}
    </div>

    <!-- Cover Content -->
    ${(() => {
      const coverTitle1 = slide.title1 || slide.thinTitle || 'intelligence';
      const coverTitle2 = slide.title2 || slide.boldTitle || 'générative';
      const coverT1Size = coverTitle1.length > 12 ? 96 : coverTitle1.length > 9 ? 112 : 130;
      const coverT2Size = coverTitle2.length > 12 ? 120 : coverTitle2.length > 9 ? 144 : 175;
      return `
      <div style="margin-top: auto; margin-bottom: auto; display: flex; flex-direction: column; position: relative; z-index: 3;">
        <div style="font-size: ${coverT1Size}px; font-weight: 800; line-height: 0.94; letter-spacing: -0.04em; text-transform: lowercase; color: ${isLight ? '#0A0A0A' : '#FFFFFF'};">
          ${coverTitle1}
        </div>
        <div style="font-size: ${coverT2Size}px; font-weight: 900; line-height: 0.90; letter-spacing: -0.05em; text-transform: lowercase; margin-top: -6px; color: ${isLight ? '#0A0A0A' : '#FFFFFF'};">
          ${coverTitle2}
        </div>
        <div style="margin-top: 28px; display: flex; align-items: center;">
          <div style="background: #0A0A0A; border: 2.5px solid ${p.primaryAccent}; color: #FFFFFF; padding: 18px 42px; border-radius: 60px; font-size: 28px; font-weight: 700; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45); letter-spacing: 0.02em;">
            ${slide.pillTag || slide.pillText || 'guide :: 10 concepts clés'}
          </div>
        </div>
      </div>
      `;
    })()}
  ` : `
    <!-- 3D Orbs Layered Behind White Card -->
    <div class="sphere-orange-3d" style="width: ${orbConfig.primary.size}px; height: ${orbConfig.primary.size}px; top: ${orbConfig.primary.top}; ${orbConfig.primary.left ? `left: ${orbConfig.primary.left};` : `right: ${orbConfig.primary.right};`} z-index: 2;"></div>
    <div class="sphere-emerald-3d" style="width: ${orbConfig.secondary.size}px; height: ${orbConfig.secondary.size}px; bottom: ${orbConfig.secondary.bottom}; ${orbConfig.secondary.right ? `right: ${orbConfig.secondary.right};` : `left: ${orbConfig.secondary.left};`} z-index: 2;"></div>

    <div class="top-bar">
      <div class="topic-tag"><span>//</span><span>${displayTopic}</span></div>
      ${author?.handle ? `<div class="author-handle">${author.handle}</div>` : ''}
    </div>

    ${isSignature ? `
    <!-- Signature Slide in Center Card -->
    <div class="center-card" style="align-items: center; text-align: center; justify-content: center; gap: 32px;">
      <div style="width: 180px; height: 180px; border-radius: 50%; padding: 4px; border: 3.5px solid ${p.primaryAccent}; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.15);">
        ${author.avatarPath ? `<img src="${author.avatarPath}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: center 8%;" />` : `<div style="width: 100%; height: 100%; border-radius: 50%; background: #222; display: flex; align-items: center; justify-content: center; color: #FFF; font-size: 52px; font-weight: 900;">${author.name[0]}</div>`}
      </div>
      <div>
        <h2 style="font-size: 48px; font-weight: 900; color: ${isDark ? '#FFFFFF' : '#000000'}; letter-spacing: -0.03em;">${author.name}</h2>
        <div style="font-size: 20px; font-weight: 700; color: ${p.primaryAccent}; font-family: 'JetBrains Mono', monospace; margin-top: 8px;">${author.title}</div>
        <div style="font-family: 'JetBrains Mono', monospace; color: ${isDark ? '#A1A1AA' : '#6B7280'}; margin-top: 6px; font-size: 16px;">${author.handle}</div>
      </div>
      <p style="font-size: 24px; font-weight: 500; color: ${isDark ? '#D4D4D8' : '#374151'}; max-width: 640px; line-height: 1.5;">
        ${slide.description || "Partagez ce carrousel avec votre réseau pour élever le niveau d'ingénierie."}
      </p>
      <div class="hanging-pill" style="left: 50%; transform: translateX(-50%); padding: 22px 56px; font-size: 26px; font-weight: 700;">
        ${slide.ctaText || 'REJOINDRE MON RÉSEAU SUR LINKEDIN [ ➔ ]'}
      </div>
    </div>
    ` : pattern === 'comparison-versus' && slide.versus ? `
    <!-- [PATTERN] Versus / Face-à-Face Split inside Center Card -->
    <div class="center-card" style="padding: 56px 52px 74px 52px;">
      <div>
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 36px;">
          <div style="font-size: ${typo.titleFontSize * 0.55}px; font-weight: 900; line-height: 1.0; letter-spacing: -0.04em; text-transform: lowercase; color: ${isDark ? '#FFFFFF' : '#000000'};">${boldTitle || 'versus'}</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1px 1fr; gap: 0; height: 640px;">
          <!-- Colonne Gauche — Mauvaise pratique -->
          <div style="padding: 32px 28px; background: ${isDark ? 'rgba(255,0,60,0.08)' : 'rgba(255,0,60,0.04)'}; border-radius: 20px 0 0 20px; border: 1px solid rgba(255,0,60,${isDark ? '0.25' : '0.12'}); border-right: none; display: flex; flex-direction: column; gap: 18px;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: #CC0030; letter-spacing: 0.06em;">[✗] ${slide.versus.badTitle || 'APPROCHE VULNÉRABLE'}</div>
            ${(slide.versus.badPoints || []).map((pt: string) => `
              <div style="display: flex; align-items: flex-start; gap: 12px; font-size: ${typo.bulletFontSize}px; font-weight: 600; color: ${isDark ? '#FAFAFA' : '#1A1A1A'}; line-height: 1.4;">
                <span style="flex-shrink: 0; margin-top: 6px; width: 6px; height: 6px; border-radius: 50%; background: #CC0030;"></span>
                <span>${pt}</span>
              </div>
            `).join('')}
          </div>
          <!-- Séparateur vertical -->
          <div style="background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};"></div>
          <!-- Colonne Droite — Bonne pratique -->
          <div style="padding: 32px 28px; background: ${isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.04)'}; border-radius: 0 20px 20px 0; border: 1px solid rgba(16,185,129,${isDark ? '0.25' : '0.12'}); border-left: none; display: flex; flex-direction: column; gap: 18px;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: #10B981; letter-spacing: 0.06em;">[✓] ${slide.versus.goodTitle || 'STANDARD RECOMMANDÉ'}</div>
            ${(slide.versus.goodPoints || []).map((pt: string) => `
              <div style="display: flex; align-items: flex-start; gap: 12px; font-size: ${typo.bulletFontSize}px; font-weight: 600; color: ${isDark ? '#FAFAFA' : '#1A1A1A'}; line-height: 1.4;">
                <span style="flex-shrink: 0; margin-top: 6px; width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
                <span>${pt}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="hanging-pill">${pillText}</div>
    </div>

    ` : pattern === 'stat-highlight' ? `
    <!-- [PATTERN] Stat Highlight — Chiffre Monumental -->
    <div class="center-card" style="align-items: center; text-align: center; justify-content: center; gap: 20px;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: ${p.primaryAccent}; letter-spacing: 0.1em; text-transform: uppercase;">${slide.pillTag || slide.pillText || 'MÉTRIQUE CLÉ'}</div>
        <div style="font-size: ${typo.statFontSize}px; font-weight: 900; line-height: 0.88; letter-spacing: -0.05em; color: #000000; background: linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.55) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${slide.statValue || '0'}</div>
        <div style="font-size: 32px; font-weight: 800; color: #000000; letter-spacing: -0.02em; text-transform: uppercase; margin-top: 8px;">${slide.statLabel || slide.boldTitle || 'INDICATEUR'}</div>
        <div style="width: 64px; height: 3px; background: ${p.primaryAccent}; border-radius: 2px; margin: 4px auto;"></div>
        <div style="font-size: ${typo.descriptionFontSize}px; color: #374151; line-height: ${typo.descriptionLineHeight}; max-width: 680px; font-weight: 500;">${slide.statSubtext || slide.description || ''}</div>
      </div>
      <div class="hanging-pill" style="left: 50%; transform: translateX(-50%);">${pillText}</div>
    </div>

    ` : pattern === 'flow-pipeline' && slide.steps && slide.steps.length > 0 ? `
    <!-- [PATTERN] Flow Pipeline — Étapes Séquentielles -->
    <div class="center-card" style="padding: 64px 56px 74px 56px;">
      <div style="display: flex; flex-direction: column; gap: 0;">
        <div style="margin-bottom: 32px;">
          <div style="font-size: ${typo.titleFontSize * 0.6}px; font-weight: 900; line-height: 1.0; letter-spacing: -0.04em; text-transform: lowercase; color: #000000;">${boldTitle}</div>
          ${thinTitle ? `<div style="font-size: ${typo.titleFontSize * 0.6}px; font-weight: 300; line-height: 1.0; letter-spacing: -0.04em; text-transform: lowercase; color: #000000;">${thinTitle}</div>` : ''}
          ${slide.description ? `<div style="font-size: ${typo.descriptionFontSize}px; color: #374151; line-height: ${typo.descriptionLineHeight}; margin-top: 20px; max-width: 820px; font-weight: 500;">${slide.description}</div>` : ''}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0; flex: 1;">
          ${(Array.isArray(slide.steps) ? slide.steps : []).map((step: any, i: number, arr: any[]) => {
            const isStr = typeof step === 'string';
            const title = isStr ? step : step.title;
            const desc = isStr ? '' : (step.desc || '');
            const isLast = i === arr.length - 1;
            return `
            <div style="display: flex; align-items: flex-start; gap: 0;">
              <div style="display: flex; flex-direction: column; align-items: center; flex-shrink: 0; margin-right: 24px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: ${p.primaryAccent}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: #000000; flex-shrink: 0;">${String(i + 1).padStart(2, '0')}</div>
                ${!isLast ? `<div style="width: 2px; flex: 1; min-height: 32px; background: linear-gradient(180deg, ${p.primaryAccent} 0%, rgba(0,0,0,0.08) 100%); margin: 4px 0;"></div>` : ''}
              </div>
              <div style="padding-bottom: ${isLast ? '0' : '28px'};">
                <div style="font-size: 24px; font-weight: 800; color: #000000; line-height: 1.2;">${title}</div>
                ${desc ? `<div style="font-size: 20px; color: #4B5563; line-height: 1.4; margin-top: 6px; font-weight: 500;">${desc}</div>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="hanging-pill">${pillText}</div>
    </div>

    ` : pattern === 'code-terminal' && slide.codeSnippet ? `
    <!-- [PATTERN] Code Terminal — Bloc de Code Technique -->
    <div class="center-card" style="padding: 52px 48px 74px 48px; gap: 0;">
      <div style="flex: 1; display: flex; flex-direction: column; gap: 20px; overflow: hidden;">
        ${boldTitle ? `
        <div>
          <div style="font-size: ${typo.titleFontSize * 0.58}px; font-weight: 900; line-height: 1.0; letter-spacing: -0.04em; text-transform: lowercase; color: ${isDark ? '#FFFFFF' : '#000000'};">${boldTitle}</div>
          ${slide.description ? `<div style="font-size: ${typo.descriptionFontSize - 2}px; color: ${isDark ? '#A1A1AA' : '#4B5563'}; line-height: 1.45; margin-top: 16px; font-weight: 500;">${slide.description}</div>` : ''}
        </div>` : ''}
        <!-- Terminal Block -->
        <div style="background: ${isDark ? '#09090B' : '#0D1117'}; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); flex: 1;">
          <!-- Terminal Header Bar -->
          <div style="padding: 12px 20px; background: ${isDark ? '#18181B' : '#161B22'}; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid ${isDark ? '#27272A' : 'rgba(255,255,255,0.08)'};">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #FF5F57;"></div>
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #FEBC2E;"></div>
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #28C840;"></div>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(255,255,255,0.4); margin-left: 12px;">${slide.codeFilename || 'main.tf'}</span>
          </div>
          <!-- Code Content -->
          <pre style="padding: 28px 28px; font-family: 'JetBrains Mono', monospace; font-size: 21px; line-height: 1.65; color: #E6EDF3; white-space: pre-wrap; word-break: break-all; overflow: hidden; margin: 0;">${slide.codeSnippet.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
        </div>
      </div>
      <div class="hanging-pill">${pillText}</div>
    </div>

    ` : pattern === 'manifesto-quote' && slide.quote ? `
    <!-- [PATTERN] Manifesto Quote — Citation d'Autorité -->
    <div class="center-card" style="align-items: flex-start; justify-content: center; gap: 0; padding: 72px 64px 74px 64px;">
      <div style="display: flex; flex-direction: column; gap: 32px; width: 100%;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: ${p.primaryAccent}; letter-spacing: 0.1em;">${slide.pillTag || '// CITATION D\'AUTORITÉ'}</div>
        <!-- Giant Opening Quote mark -->
        <div style="font-size: 180px; font-weight: 900; line-height: 0.5; color: ${p.primaryAccent}; opacity: 0.15; margin-bottom: -20px;">&ldquo;</div>
        <div style="font-size: ${Math.min(typo.descriptionFontSize + 6, 36)}px; font-weight: 700; color: ${isDark ? '#FAFAFA' : '#0A0A0A'}; line-height: 1.4; letter-spacing: -0.02em; max-width: 860px;">${slide.quote}</div>
        ${slide.quoteAuthor ? `
        <div style="display: flex; align-items: center; gap: 16px; margin-top: 8px;">
          <div style="width: 40px; height: 3px; background: ${p.primaryAccent}; border-radius: 2px;"></div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: ${isDark ? '#D4D4D8' : '#374151'};">${slide.quoteAuthor}</div>
        </div>` : ''}
        ${slide.description ? `<div style="font-size: ${typo.descriptionFontSize - 2}px; color: ${isDark ? '#A1A1AA' : '#6B7280'}; line-height: 1.5; max-width: 820px; font-weight: 500; margin-top: 12px;">${slide.description}</div>` : ''}
      </div>
      <div class="hanging-pill">${pillText}</div>
    </div>

    ` : pattern === 'metric-chart' && slide.chart ? `
    <!-- [PATTERN] Metric Chart — Graphique SVG Vectoriel Vector-Pure -->
    <div class="center-card" style="padding: 56px 52px 64px 52px; display: flex; flex-direction: column; justify-content: space-between; height: 960px;">
      <!-- Bloc En-Tête -->
      <div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${p.primaryAccent}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">
          ${slide.pillTag || '// PERFORMANCE & TÉLÉMÉTRIE'}
        </div>
        <div style="font-size: ${typo.titleFontSize * 0.58}px; font-weight: 900; line-height: 0.95; letter-spacing: -0.04em; text-transform: lowercase; color: ${isDark ? '#FFFFFF' : '#000000'};">
          ${boldTitle || 'benchmark'}
        </div>
        ${thinTitle ? `<div style="font-size: ${typo.titleFontSize * 0.58}px; font-weight: 300; line-height: 0.95; letter-spacing: -0.04em; text-transform: lowercase; color: ${isDark ? '#E4E4E7' : '#000000'}; margin-top: 4px;">${thinTitle}</div>` : ''}
        ${slide.description ? `
          <div style="font-size: ${typo.descriptionFontSize - 2}px; color: ${isDark ? '#A1A1AA' : '#374151'}; line-height: 1.45; margin-top: 14px; max-width: 820px; font-weight: 500;">
            ${slide.description}
          </div>
        ` : ''}
      </div>

      <!-- Bloc Graphique SVG Mathématique (Grand & Imposant) -->
      ${(() => {
        const isSelfContained = slide.chart.type === 'radial-gauge' || slide.chart.type === 'pipeline-flow';
        const chartH = isSelfContained ? 540 : 440;
        return `
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; margin: auto 0;">
          ${renderSvgChart(slide.chart, { primaryAccent: p.primaryAccent, secondaryAccent: p.secondaryAccent || p.primaryAccent, isDarkCard: isDark }, 876, chartH)}
        </div>

        ${!isSelfContained && (slide.chart.metric || slide.chart.delta) ? `
        <!-- Bloc Métriques Résumé / KPI Footer (Solide & Épuré - Zéro Pastel) -->
        <div style="display: grid; grid-template-columns: ${slide.chart.delta ? '1fr 1fr' : '1fr'}; gap: 16px; margin-bottom: 6px;">
          <div style="background: ${isDark ? '#18181B' : '#F4F4F5'}; border: 1.5px solid ${isDark ? '#27272A' : '#E4E4E7'}; border-radius: 14px; padding: 14px 22px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${isDark ? '#A1A1AA' : '#71717A'}; text-transform: uppercase;">
              ${slide.chart.metricLabel || 'VALEUR ENREGISTRÉE'}
            </span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 900; color: ${isDark ? '#FFFFFF' : '#0A0A0A'};">
              ${slide.chart.metric || (slide.chart.points ? `${slide.chart.points[slide.chart.points.length - 1]}${slide.chart.unit || ''}` : '')}
            </span>
          </div>
          ${slide.chart.delta ? `
          <div style="background: #0A0A0A; border: 1.5px solid ${isDark ? p.primaryAccent : '#000000'}; border-radius: 14px; padding: 14px 22px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: #A1A1AA; text-transform: uppercase;">
              IMPACT MESURÉ
            </span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 900; color: ${p.primaryAccent};">
              ${slide.chart.delta}
            </span>
          </div>
          ` : ''}
        </div>
        ` : ''}
        `;
      })()}

      <div class="hanging-pill">${pillText}</div>
    </div>

    ` : `
    <!-- [PATTERN] Classic Card — Layout Standard Said KOMI Formula avec Remplissage Adaptatif Mathématique -->
    <div class="center-card" style="display: flex; flex-direction: column; justify-content: space-between; height: 960px; padding: ${featuresList.length >= 4 ? '56px 64px 48px 64px' : '68px 64px 62px 64px'};">
      <!-- Bloc Supérieur : Titres & Description -->
      <div>
        <div style="font-size: ${typo.titleFontSize}px; font-weight: 900; line-height: 0.90; letter-spacing: -0.05em; text-transform: lowercase; color: ${isDark ? '#FFFFFF' : '#000000'};">${boldTitle}</div>
        ${thinTitle ? `<div style="font-size: ${featuresList.length >= 4 ? Math.min(typo.titleFontSize, 60) : typo.titleFontSize}px; font-weight: 300; line-height: 0.90; letter-spacing: -0.05em; text-transform: lowercase; color: ${isDark ? '#E4E4E7' : '#000000'}; margin-top: 4px;">${thinTitle}</div>` : ''}
        ${slide.description ? `
        <div style="font-size: ${typo.descriptionFontSize}px; color: ${isDark ? '#A1A1AA' : '#222222'}; line-height: ${typo.descriptionLineHeight}; font-weight: 500; margin-top: ${featuresList.length >= 4 ? '14px' : '20px'}; max-width: 820px;">
          ${slide.description}
        </div>` : ''}
      </div>

      <!-- Bloc Items Adaptatif Mathématique (Bento Rows ou Compact List) sans vide central -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: ${featuresList.length <= 2 ? 'center' : 'space-evenly'}; gap: ${typo.itemLayoutMode === 'bento-row' ? typo.itemGap : (featuresList.length >= 4 ? '10px' : '16px')}; margin-top: 18px; margin-bottom: ${featuresList.length >= 4 ? '8px' : '16px'};">
        ${featuresList.map((feat: string, i: number) => {
          const colonIdx = feat.indexOf(' : ');
          let itemTitle = '';
          let itemDesc = feat;
          if (colonIdx !== -1) {
            itemTitle = feat.substring(0, colonIdx).trim();
            itemDesc = feat.substring(colonIdx + 3).trim();
          }

          let badgeText = `[0${i + 1}]`;
          const numMatch = itemTitle.match(/^(\d{2}|\d)\.\s*(.*)$/);
          if (numMatch) {
            badgeText = `[§${numMatch[1].padStart(2, '0')}]`;
            itemTitle = numMatch[2].trim();
          }

          if (typo.itemLayoutMode === 'bento-row') {
            if (itemTitle) {
              return `
              <div style="background: ${isDark ? '#141417' : '#F8FAFC'}; border: 1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}; border-radius: ${typo.itemBorderRadius}px; padding: ${typo.itemPadding}; display: flex; flex-direction: column; justify-content: center; gap: ${featuresList.length >= 4 ? '5px' : '8px'};">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${p.primaryAccent}; padding: 3px 9px; background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}; border-radius: 6px; letter-spacing: 0.04em; flex-shrink: 0;">
                    ${badgeText}
                  </div>
                  <div style="font-size: ${typo.itemTitleFontSize || 22}px; font-weight: 800; color: ${isDark ? '#FFFFFF' : '#0A0A0A'}; letter-spacing: -0.02em;">
                    ${itemTitle}
                  </div>
                </div>
                <div style="font-size: ${typo.bulletFontSize}px; font-weight: 500; color: ${isDark ? '#D4D4D8' : '#27272A'}; line-height: 1.42;">
                  ${itemDesc}
                </div>
              </div>`;
            } else {
              return `
              <div style="background: ${isDark ? '#141417' : '#F8FAFC'}; border: 1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}; border-radius: ${typo.itemBorderRadius}px; padding: ${typo.itemPadding}; display: flex; align-items: center; gap: 18px;">
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: ${p.primaryAccent}; padding: 4px 10px; background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}; border-radius: 6px; flex-shrink: 0;">
                  [${i < 9 ? '0' : ''}${i + 1}]
                </div>
                <div style="font-size: ${typo.bulletFontSize}px; font-weight: 600; color: ${isDark ? '#FAFAFA' : '#0A0A0A'}; line-height: 1.4;">
                  ${feat}
                </div>
              </div>`;
            }
          } else {
            return `
            <div style="font-size: ${typo.bulletFontSize}px; font-weight: 600; color: ${isDark ? '#FAFAFA' : '#111111'}; display: flex; align-items: flex-start; gap: 14px; margin-bottom: ${typo.bulletMarginBottom}px;">
              <span style="display: inline-block; width: 12px; height: 3px; background-color: ${p.primaryAccent}; margin-top: 8px; flex-shrink: 0;"></span>
              <span style="line-height: 1.35;">${feat}</span>
            </div>`;
          }
        }).join('')}
      </div>

      <div class="hanging-pill">${pillText}</div>
    </div>
    `}
  `}

  <!-- Carousel Dots -->
  <div class="carousel-dots">
    ${Array.from({ length: totalSlides }).map((_, idx) => `
      <div class="carousel-dot ${idx === slideIndex ? 'active' : ''}"></div>
    `).join('')}
  </div>

  ${renderViralWatermarkHtml(licenseStatus, isLight)}
</body>
</html>`;
}

/**
 * 2. SWISS EDITORIAL CLEAN (+ Multi-Patterns)
 */
function renderSwissEditorialHtml(params: any, typo: any, pattern: SlideLayoutPattern): string {
  const { slide, dna, author, slideIndex, totalSlides, topic, industry, licenseStatus = { isPro: false, tier: 'free', storeUrl: 'https://polar.sh/saidkomi' } } = params;
  const p = dna.palette;
  const isCover = slide.type === 'cover';
  const isSignature = slide.type === 'signature';

  const rawTag = slide.topicTag || topic || slide.pillTag || slide.pillText || industry || dna.industry || 'SWISS ARCHITECTURE';
  const displayTopic = rawTag.replace(/^guide\s*::\s*/i, '').replace(/::.*$/, '').trim().toUpperCase();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    body {
      width: 1080px; height: 1350px; background: ${p.background}; color: ${p.textPrimary};
      font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden;
      display: flex; flex-direction: column; justify-content: space-between; padding: 80px 72px;
    }
    .meta-header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid ${p.textPrimary}; padding-bottom: 24px; }
    .meta-tag { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; color: ${p.primaryAccent}; }
    .meta-index { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; }

    .monumental-headline {
      font-size: ${Math.min(typo.titleFontSize * 1.1, 120)}px; font-weight: 900; line-height: 0.92; letter-spacing: -0.04em;
      text-transform: uppercase; color: ${p.textPrimary}; margin: 40px 0;
    }
    .editorial-card {
      background: ${p.cardSurface}; border: 1px solid ${p.borderHairline}; border-radius: 24px; padding: 56px 48px;
      display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; margin: 24px 0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    }
    .accent-block {
      background: ${p.primaryAccent}; color: #FFFFFF; padding: 6px 14px; font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 800; display: inline-block; margin-bottom: 24px; border-radius: 4px;
    }

    .meta-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid ${p.borderHairline}; padding-top: 24px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${p.textMuted}; }
  </style>
</head>
<body>
  <div class="meta-header">
    <span class="meta-tag">:: ${displayTopic}</span>
    <span class="meta-index">P. 0${slideIndex + 1} / 0${totalSlides}</span>
  </div>

  ${isCover ? `
  <div>
    <div class="accent-block">SWISS INTERNATIONAL EDITORIAL</div>
    <div class="monumental-headline">
      ${slide.title1 || 'FINTECH'}<br>
      <span style="color:${p.primaryAccent}">${slide.title2 || slide.boldTitle || 'ARCHITECTURE'}</span>
    </div>
    <div style="font-size: 26px; color: ${p.textMuted}; line-height: 1.4; max-width: 800px; font-weight: 500;">
      ${slide.description || "Conçu selon les principes de la grille suisse et de l'autorité technique."}
    </div>
  </div>
  ` : isSignature ? `
  <div class="editorial-card" style="align-items:center;text-align:center;justify-content:center;">
    <div class="accent-block">:: EXPERTISE CERTIFIÉE</div>
    <h2 style="font-size: 44px; font-weight: 900; margin-bottom: 8px;">${author.name}</h2>
    <div style="font-family:'JetBrains Mono',monospace; color:${p.textMuted}; margin-bottom: 24px; font-size: 16px;">
      ${author.title} // ${author.handle}
    </div>
    <p style="font-size: 24px; color:${p.textMuted}; max-width: 600px; line-height: 1.4; margin-bottom: 36px;">
      ${slide.description || 'Pour concevoir des architectures robustes et sans compromis.'}
    </p>
    <div style="background:${p.primaryAccent};color:#FFF;padding:18px 40px;border-radius:8px;font-weight:800;font-size:16px;">
      ${slide.ctaText || 'REJOINDRE LE RÉSEAU PROFESSIONNEL'}
    </div>
  </div>
  ` : pattern === 'stat-highlight' ? `
  <div class="editorial-card" style="justify-content:center;text-align:center;">
    <div class="accent-block" style="margin:0 auto 20px;">STATISTIQUE CLÉ</div>
    <div style="font-size:${typo.statFontSize}px;font-weight:900;letter-spacing:-0.05em;color:${p.primaryAccent};line-height:0.9;">
      ${slide.statValue || '0.8ms'}
    </div>
    <div style="font-size:32px;font-weight:800;text-transform:uppercase;margin:24px 0 12px;">
      ${slide.statLabel || slide.boldTitle || 'LATENCE P99'}
    </div>
    <div style="font-size:22px;color:${p.textMuted};max-width:680px;margin:0 auto;line-height:1.4;">
      ${slide.statSubtext || slide.description || ''}
    </div>
  </div>
  ` : pattern === 'metric-chart' && slide.chart ? `
  <div class="editorial-card" style="display:flex;flex-direction:column;justify-content:space-between;">
    <div>
      <div class="accent-block">${slide.pillTag || 'DATA BENCHMARK'}</div>
      <h2 style="font-size:${Math.min(typo.titleFontSize, 52)}px;font-weight:900;line-height:1.05;margin-bottom:12px;">
        ${slide.boldTitle || slide.title1 || 'MÉTRIQUES CLÉS'}
      </h2>
      ${slide.description ? `<p style="font-size:${typo.descriptionFontSize - 2}px;line-height:1.4;color:${p.textMuted};margin-bottom:16px;">${slide.description}</p>` : ''}
    </div>
    <div style="width:100%;margin:16px 0;">
      ${renderSvgChart(slide.chart, { primaryAccent: p.primaryAccent, secondaryAccent: p.primaryAccent }, 780, 360)}
    </div>
    <div style="display:flex;justify-content:space-between;border-top:1px solid ${p.borderHairline};padding-top:16px;">
      <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${p.textMuted};">${slide.chart.metricLabel || 'INDICATEUR'}</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:900;color:${p.primaryAccent};">${slide.chart.metric || ''}</span>
    </div>
  </div>
  ` : `
  <div class="editorial-card">
    <div>
      <div class="accent-block">${slide.pillTag || 'SPECIFICATION'}</div>
      <h2 style="font-size:${Math.min(typo.titleFontSize, 64)}px;font-weight:900;line-height:1.05;margin-bottom:20px;">
        ${slide.boldTitle || slide.title1}
      </h2>
      <p style="font-size:${typo.descriptionFontSize}px;line-height:${typo.descriptionLineHeight};color:${p.textMuted};margin-bottom:32px;">
        ${slide.description || ''}
      </p>
      <div>
        ${(slide.bulletPoints || []).map((b: string, i: number) => `
          <div style="display:flex;align-items:baseline;gap:16px;padding:18px 0;border-bottom:1px solid ${p.borderHairline};font-size:${typo.bulletFontSize}px;font-weight:700;">
            <span style="font-family:'JetBrains Mono',monospace;color:${p.primaryAccent};font-size:14px;font-weight:800;">[§0${i + 1}]</span>
            <span>${b}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `}

  <div class="meta-footer">
    <span>AUTHOR : ${author.name.toUpperCase()}</span>
    <span>RATIO 4:5 // 1080x1350</span>
  </div>

  ${renderViralWatermarkHtml(licenseStatus, true)}
</body>
</html>`;
}

/**
 * 3. CYBER GLASS BENTO (+ Multi-Patterns)
 */
function renderCyberBentoHtml(params: any, typo: any, pattern: SlideLayoutPattern): string {
  const { slide, dna, author, slideIndex, totalSlides, topic, industry, licenseStatus = { isPro: false, tier: 'free', storeUrl: 'https://polar.sh/saidkomi' } } = params;
  const p = dna.palette;
  const isCover = slide.type === 'cover';
  const isSignature = slide.type === 'signature';

  const rawTag = slide.topicTag || topic || slide.pillTag || slide.pillText || industry || dna.industry || 'CYBER SECURITY TELEMETRY';
  const displayTopic = rawTag.replace(/^guide\s*::\s*/i, '').replace(/::.*$/, '').trim().toUpperCase();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    body {
      width: 1080px; height: 1350px; background: ${p.background}; color: ${p.textPrimary};
      font-family: 'Plus Jakarta Sans', sans-serif; position: relative; overflow: hidden;
      display: flex; flex-direction: column; justify-content: space-between; padding: 68px 56px;
    }
    .laser-border { position: absolute; inset: 24px; border: 1px solid rgba(0, 240, 255, 0.15); border-radius: 40px; pointer-events: none; }
    .cyber-header { display: flex; justify-content: space-between; align-items: center; z-index: 10; }
    .cyber-tag { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${p.primaryAccent}; text-shadow: 0 0 12px ${p.glowColor}; }

    .bento-container { display: flex; flex-direction: column; gap: 24px; margin: auto 0; z-index: 10; }
    .bento-card-main {
      background: ${p.cardSurface}; backdrop-filter: blur(28px); border: 1px solid ${p.borderHairline};
      border-radius: 36px; padding: 48px 42px; box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    }
    .cyber-pill {
      display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
      background: rgba(0, 240, 255, 0.1); border: 1px solid ${p.primaryAccent}; border-radius: 999px;
      font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: ${p.primaryAccent}; margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="laser-border"></div>

  <div class="cyber-header">
    <div class="cyber-tag">[!] ${displayTopic}</div>
    <div style="font-family:'JetBrains Mono',monospace;color:#9CA3AF;font-size:13px;">NODE 0${slideIndex + 1} / 0${totalSlides}</div>
  </div>

  ${isCover ? `
  <div class="bento-container">
    <div class="bento-card-main">
      <div class="cyber-pill">CYBER SECURITY TELEMETRY</div>
      <h1 style="font-size:${typo.titleFontSize}px;font-weight:900;line-height:0.95;letter-spacing:-0.03em;margin-bottom:20px;">
        ${slide.title1 || 'ZERO TRUST'}<br>
        <span style="color:${p.primaryAccent}">${slide.title2 || slide.boldTitle || 'ARCHITECTURE'}</span>
      </h1>
      <p style="font-size:24px;color:#9CA3AF;line-height:1.45;">
        ${slide.description || 'Protocole de défense périmétrique haute performance pour infrastructures critiques.'}
      </p>
    </div>
  </div>
  ` : isSignature ? `
  <div class="bento-container">
    <div class="bento-card-main" style="text-align:center;padding:60px 40px;">
      <div style="width:130px;height:130px;border-radius:50%;margin:0 auto 20px;border:2px solid ${p.primaryAccent};padding:4px;box-shadow:0 0 30px ${p.glowColor};">
        ${author.avatarPath ? `<img src="${author.avatarPath}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:center 8%;" />` : `<div style="width:100%;height:100%;border-radius:50%;background:#1F2937;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:${p.primaryAccent}">${author.name[0]}</div>`}
      </div>
      <h2 style="font-size:36px;font-weight:900;margin-bottom:6px;">${author.name}</h2>
      <div style="font-family:'JetBrains Mono',monospace;color:${p.primaryAccent};font-size:15px;margin-bottom:20px;">${author.title}</div>
      <p style="font-size:21px;color:#9CA3AF;max-width:540px;margin:0 auto 30px;line-height:1.4;">
        ${slide.description || 'Audit, sécurisation et déploiement de systèmes durcis.'}
      </p>
      <div style="background:${p.primaryAccent};color:#000;padding:16px 36px;border-radius:12px;font-weight:800;font-size:16px;display:inline-block;">
        ${slide.ctaText || 'CONNEXION RÉSEAU SÉCURISÉ [ ➔ ]'}
      </div>
    </div>
  </div>
  ` : pattern === 'stat-highlight' ? `
  <div class="bento-container">
    <div class="bento-card-main" style="text-align:center;padding:64px 40px;">
      <div class="cyber-pill">${slide.pillTag || 'TÉLÉMÉTRIE'}</div>
      <div style="font-size:130px;font-weight:900;color:${p.primaryAccent};letter-spacing:-0.05em;line-height:0.95;text-shadow:0 0 40px ${p.glowColor};">
        ${slide.statValue || '0 BREACH'}
      </div>
      <div style="font-size:30px;font-weight:800;margin:20px 0 10px;text-transform:uppercase;">
        ${slide.statLabel || slide.boldTitle || 'POSTURE DE SÉCURITÉ'}
      </div>
      <p style="font-size:21px;color:#9CA3AF;max-width:600px;margin:0 auto;line-height:1.4;">
        ${slide.statSubtext || slide.description || ''}
      </p>
    </div>
  </div>
  ` : pattern === 'metric-chart' && slide.chart ? `
  <div class="bento-container">
    <div class="bento-card-main" style="display:flex;flex-direction:column;justify-content:space-between;padding:48px 40px;">
      <div>
        <div class="cyber-pill">${slide.pillTag || 'TÉLÉMÉTRIE GRAPHIQUE'}</div>
        <h2 style="font-size:${Math.min(typo.titleFontSize, 52)}px;font-weight:800;margin-bottom:12px;line-height:1.1;">
          ${slide.boldTitle || slide.title1 || 'ANALYSE DE PERFORMANCE'}
        </h2>
        ${slide.description ? `<p style="font-size:${typo.descriptionFontSize - 2}px;color:#9CA3AF;line-height:1.4;">${slide.description}</p>` : ''}
      </div>
      <div style="width:100%;margin:16px 0;">
        ${renderSvgChart(slide.chart, { primaryAccent: p.primaryAccent, secondaryAccent: p.primaryAccent }, 780, 360)}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 20px;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#9CA3AF;">${slide.chart.metricLabel || 'STATUS'}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:900;color:${p.primaryAccent};">${slide.chart.metric || ''}</span>
      </div>
    </div>
  </div>
  ` : `
  <div class="bento-container">
    <div class="bento-card-main">
      <div class="cyber-pill">${slide.pillTag || 'ANALYSE TECHNIQUE'}</div>
      <h2 style="font-size:${Math.min(typo.titleFontSize, 62)}px;font-weight:800;margin-bottom:18px;line-height:1.1;">
        ${slide.boldTitle || slide.title1}
      </h2>
      <p style="font-size:${typo.descriptionFontSize}px;color:#9CA3AF;line-height:${typo.descriptionLineHeight};margin-bottom:28px;">
        ${slide.description || ''}
      </p>

      <div>
        ${(slide.bulletPoints || []).map((b: string, i: number) => `
          <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:16px;font-size:${typo.bulletFontSize}px;color:#E5E7EB;line-height:1.35;">
            <span style="color:${p.primaryAccent};font-family:'JetBrains Mono',monospace;font-weight:800;font-size:13px;">[0${i + 1}]</span>
            <span>${b}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  `}

  <div style="display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:12px;color:#6B7280;z-index:10;">
    <span>SEC_ID // ${author.handle}</span>
    <span>RESOLUTION // 1080x1350 VERTICAL</span>
  </div>

  ${renderViralWatermarkHtml(licenseStatus, false)}
</body>
</html>`;
}

/**
 * 4. PAPER LIGHT EDITORIAL (Business Intelligence & Press)
 * Ivory canvas — deep ink — single precision accent — mathematical grid
 */
function renderPaperLightHtml(params: any, typo: any, pattern: SlideLayoutPattern): string {
  const { slide, dna, author, slideIndex, totalSlides, topic, licenseStatus = { isPro: false, tier: 'free', storeUrl: 'https://polar.sh/saidkomi' } } = params;
  const p = dna.palette;
  const isCover = slide.type === 'cover' || slideIndex === 0;
  const isOutro = slide.type === 'outro' || slideIndex === totalSlides - 1;

  const boldTitle = slide.boldTitle || slide.title1 || '';
  const thinTitle = slide.thinTitle || slide.title2 || '';
  const featuresList: string[] = slide.bulletPoints || slide.features || [];

  // Subtle SVG grain texture (math/procedural — no raster images)
  const grainSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic || 'Carrousel'} — Slide ${slideIndex + 1}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      background-color: ${p.background};
      background-image: ${grainSvg};
      font-family: ${dna.typography.bodyFont};
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* ── Accent Bar verticale gauche (signature éditoriale) ─────────────── */
    .accent-bar {
      position: absolute;
      left: 0;
      top: 0;
      width: 8px;
      height: 100%;
      background: ${p.primaryAccent};
      z-index: 5;
    }

    /* ── Header ─────────────────────────────────────────────────────────── */
    .page-header {
      padding: 48px 64px 0 80px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid ${p.borderHairline};
      padding-bottom: 22px;
      margin-bottom: 0;
    }
    .org-name {
      font-family: ${dna.typography.monoFont};
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${p.primaryAccent};
    }
    .slide-counter {
      font-family: ${dna.typography.monoFont};
      font-size: 12px;
      font-weight: 500;
      color: ${p.textMuted};
      letter-spacing: 0.06em;
    }

    /* ── Main Content Area ──────────────────────────────────────────────── */
    .content-area {
      flex: 1;
      padding: 52px 64px 40px 80px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── Footer ────────────────────────────────────────────────────────── */
    .page-footer {
      padding: 20px 64px 32px 80px;
      border-top: 1px solid ${p.borderHairline};
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-author {
      font-family: ${dna.typography.monoFont};
      font-size: 12px;
      font-weight: 600;
      color: ${p.textMuted};
      letter-spacing: 0.04em;
    }
    .progress-dots {
      display: flex;
      gap: 6px;
    }
    .pdot {
      width: 18px;
      height: 3px;
      border-radius: 2px;
      background: ${p.borderHairline};
    }
    .pdot.active {
      background: ${p.primaryAccent};
      width: 30px;
    }

    /* ── Typography Atoms ───────────────────────────────────────────────── */
    .headline-bold {
      font-size: ${typo.titleFontSize}px;
      font-weight: 900;
      line-height: 0.92;
      letter-spacing: -0.04em;
      color: ${p.textPrimary};
      text-transform: lowercase;
    }
    .headline-thin {
      font-size: ${typo.titleFontSize}px;
      font-weight: 300;
      line-height: 0.92;
      letter-spacing: -0.04em;
      color: ${p.textPrimary};
    }
    .body-text {
      font-size: ${typo.descriptionFontSize}px;
      color: #3D3D3D;
      line-height: ${typo.descriptionLineHeight};
      font-weight: 500;
    }
    .label-mono {
      font-family: ${dna.typography.monoFont};
      font-size: 13px;
      font-weight: 700;
      color: ${p.primaryAccent};
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .hairline {
      width: 100%;
      height: 1px;
      background: ${p.borderHairline};
      margin: 28px 0;
    }
    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      font-size: ${typo.bulletFontSize}px;
      font-weight: 600;
      color: ${p.textPrimary};
      line-height: 1.4;
    }
    .bullet-dash {
      flex-shrink: 0;
      margin-top: 9px;
      width: 20px;
      height: 2px;
      background: ${p.primaryAccent};
    }
  </style>
</head>
<body>

  <!-- Signature Accent Bar Gauche -->
  <div class="accent-bar"></div>

  <!-- Header -->
  <div class="page-header">
    <div>
      <div class="org-name">${author.name}</div>
      <div style="font-size:11px;color:${p.textMuted};margin-top:3px;font-family:${dna.typography.monoFont};">${author.title}</div>
    </div>
    <div class="slide-counter">${String(slideIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}</div>
  </div>

  <!-- Main Content -->
  <div class="content-area">
    ${isCover ? `
    <!-- ── COVER SLIDE — Masthead Layout ─────────────────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div class="label-mono" style="margin-bottom:28px;">${slide.pillTag || topic || 'ANALYSE'}</div>
        <!-- Typographic Masthead Block -->
        <div style="border-left: 5px solid ${p.primaryAccent}; padding-left: 28px; margin-bottom: 40px;">
          <div class="headline-bold">${boldTitle}</div>
          ${thinTitle ? `<div class="headline-thin" style="margin-top:6px;">${thinTitle}</div>` : ''}
        </div>
        ${slide.description ? `
        <div class="hairline" style="margin:0 0 28px 0;"></div>
        <div class="body-text" style="max-width:820px;">${slide.description}</div>` : ''}
      </div>
      <!-- Cover Bottom Band -->
      <div style="background:${p.primaryAccent};border-radius:8px;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;">
        <div style="color:#FFFFFF;font-size:18px;font-weight:800;letter-spacing:-0.01em;">${slide.pillText || topic || 'ÉDITION SPÉCIALE'}</div>
        <div style="font-family:${dna.typography.monoFont};font-size:14px;font-weight:700;color:rgba(255,255,255,0.75);">${author.handle}</div>
      </div>
    </div>

    ` : isOutro ? `
    <!-- ── OUTRO SLIDE ──────────────────────────────────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:32px;">
      <div class="label-mono">${slide.pillTag || '// CONCLUSION'}</div>
      <div class="headline-bold" style="font-size:${typo.titleFontSize * 0.75}px;">${boldTitle || 'Merci'}</div>
      ${thinTitle ? `<div class="headline-thin" style="font-size:${typo.titleFontSize * 0.75}px;">${thinTitle}</div>` : ''}
      <div class="hairline"></div>
      ${slide.description ? `<div class="body-text">${slide.description}</div>` : ''}
      <div style="display:flex;align-items:center;gap:16px;margin-top:12px;">
        <div style="font-family:${dna.typography.monoFont};font-size:16px;font-weight:800;color:${p.textPrimary};">${author.name}</div>
        <div style="color:${p.primaryAccent};font-family:${dna.typography.monoFont};font-size:14px;">${author.handle}</div>
      </div>
    </div>

    ` : pattern === 'stat-highlight' ? `
    <!-- ── STAT HIGHLIGHT ───────────────────────────────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:20px;">
      <div class="label-mono">${slide.pillTag || 'DONNÉE CLÉ'}</div>
      <div style="font-size:${typo.statFontSize}px;font-weight:900;line-height:0.88;letter-spacing:-0.05em;color:${p.primaryAccent};">${slide.statValue || '—'}</div>
      <div style="font-size:30px;font-weight:800;color:${p.textPrimary};letter-spacing:-0.02em;text-transform:uppercase;">${slide.statLabel || boldTitle || 'INDICATEUR'}</div>
      <div class="hairline"></div>
      <div class="body-text" style="max-width:680px;">${slide.statSubtext || slide.description || ''}</div>
    </div>

    ` : pattern === 'flow-pipeline' && slide.steps && slide.steps.length > 0 ? `
    <!-- ── FLOW PIPELINE ────────────────────────────────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;gap:0;">
      <div class="label-mono" style="margin-bottom:20px;">${slide.pillTag || '// PROCESSUS'}</div>
      <div style="border-left:5px solid ${p.primaryAccent};padding-left:24px;margin-bottom:28px;">
        <div class="headline-bold" style="font-size:${typo.titleFontSize * 0.65}px;">${boldTitle}</div>
        ${slide.description ? `<div class="body-text" style="margin-top:14px;">${slide.description}</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:0;flex:1;">
        ${(Array.isArray(slide.steps) ? slide.steps : []).map((step: any, i: number, arr: any[]) => {
          const isStr = typeof step === 'string';
          const title = isStr ? step : step.title;
          const desc = isStr ? '' : (step.desc || '');
          const isLast = i === arr.length - 1;
          return `
          <div style="display:flex;align-items:flex-start;gap:0;">
            <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;margin-right:20px;">
              <div style="width:36px;height:36px;border-radius:4px;background:${p.primaryAccent};display:flex;align-items:center;justify-content:center;font-family:${dna.typography.monoFont};font-size:14px;font-weight:800;color:#FFF;">${String(i + 1).padStart(2, '0')}</div>
              ${!isLast ? `<div style="width:2px;flex:1;min-height:24px;background:${p.borderHairline};margin:4px 0;"></div>` : ''}
            </div>
            <div style="padding-bottom:${isLast ? '0' : '22px'};">
              <div style="font-size:22px;font-weight:800;color:${p.textPrimary};line-height:1.2;">${title}</div>
              ${desc ? `<div style="font-size:18px;color:#5A5A5A;line-height:1.4;margin-top:4px;font-weight:500;">${desc}</div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    ` : pattern === 'comparison-versus' && slide.versus ? `
    <!-- ── COMPARISON VERSUS ────────────────────────────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;gap:20px;">
      <div class="label-mono">${slide.pillTag || '// COMPARAISON'}</div>
      <div class="headline-bold" style="font-size:${typo.titleFontSize * 0.65}px;">${boldTitle}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;flex:1;">
        <!-- Colonne Gauche -->
        <div style="padding:24px;background:#FFF5F5;border:1px solid rgba(200,16,46,0.15);border-radius:8px;display:flex;flex-direction:column;gap:14px;">
          <div style="font-family:${dna.typography.monoFont};font-size:12px;font-weight:800;color:${p.primaryAccent};">[✗] ${slide.versus.badTitle || 'APPROCHE RISQUÉE'}</div>
          ${(slide.versus.badPoints || []).map((pt: string) => `<div class="bullet-item"><div class="bullet-dash" style="background:#C8102E;"></div><span>${pt}</span></div>`).join('')}
        </div>
        <!-- Colonne Droite -->
        <div style="padding:24px;background:#F0FFF8;border:1px solid rgba(16,185,129,0.15);border-radius:8px;display:flex;flex-direction:column;gap:14px;">
          <div style="font-family:${dna.typography.monoFont};font-size:12px;font-weight:800;color:#10B981;">[✓] ${slide.versus.goodTitle || 'BONNE PRATIQUE'}</div>
          ${(slide.versus.goodPoints || []).map((pt: string) => `<div class="bullet-item"><div class="bullet-dash" style="background:#10B981;"></div><span>${pt}</span></div>`).join('')}
        </div>
      </div>
    </div>

    ` : pattern === 'code-terminal' && slide.codeSnippet ? `
    <!-- ── CODE TERMINAL ───────────────────────────────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;gap:16px;overflow:hidden;">
      <div class="label-mono">${slide.pillTag || '// CODE REFERENCE'}</div>
      ${boldTitle ? `<div class="headline-bold" style="font-size:${typo.titleFontSize * 0.6}px;">${boldTitle}</div>` : ''}
      ${slide.description ? `<div class="body-text">${slide.description}</div>` : ''}
      <div style="background:#0D1117;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);flex:1;">
        <div style="padding:10px 18px;background:#161B22;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="width:9px;height:9px;border-radius:50%;background:#FF5F57;"></div>
          <div style="width:9px;height:9px;border-radius:50%;background:#FEBC2E;"></div>
          <div style="width:9px;height:9px;border-radius:50%;background:#28C840;"></div>
          <span style="font-family:${dna.typography.monoFont};font-size:11px;color:rgba(255,255,255,0.4);margin-left:10px;">${slide.codeFilename || 'script.py'}</span>
        </div>
        <pre style="padding:24px;font-family:${dna.typography.monoFont};font-size:19px;line-height:1.6;color:#E6EDF3;white-space:pre-wrap;word-break:break-all;overflow:hidden;margin:0;">${slide.codeSnippet.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>
      </div>
    </div>

    ` : pattern === 'manifesto-quote' && slide.quote ? `
    <!-- ── MANIFESTO QUOTE ─────────────────────────────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:24px;">
      <div class="label-mono">${slide.pillTag || '// RÉFÉRENCE'}</div>
      <div style="font-size:120px;font-weight:900;line-height:0.4;color:${p.primaryAccent};opacity:0.2;">&ldquo;</div>
      <div style="font-size:${Math.min(typo.descriptionFontSize + 6, 34)}px;font-weight:700;color:${p.textPrimary};line-height:1.4;letter-spacing:-0.02em;max-width:860px;margin-top:8px;">${slide.quote}</div>
      ${slide.quoteAuthor ? `
      <div style="display:flex;align-items:center;gap:14px;margin-top:8px;">
        <div style="width:32px;height:2px;background:${p.primaryAccent};"></div>
        <div style="font-family:${dna.typography.monoFont};font-size:14px;font-weight:700;color:${p.textMuted};">${slide.quoteAuthor}</div>
      </div>` : ''}
      ${slide.description ? `<div class="hairline"></div><div class="body-text" style="max-width:820px;">${slide.description}</div>` : ''}
    </div>

    ` : `
    <!-- ── CLASSIC CARD — Layout Standard Éditorial ─────────────────── -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-start;gap:0;">
      <div class="label-mono" style="margin-bottom:20px;">${slide.pillTag || slide.pillText || ''}</div>
      <div style="border-left:5px solid ${p.primaryAccent};padding-left:24px;margin-bottom:32px;">
        <div class="headline-bold">${boldTitle}</div>
        ${thinTitle ? `<div class="headline-thin" style="margin-top:4px;">${thinTitle}</div>` : ''}
      </div>
      ${slide.description ? `<div class="body-text" style="margin-bottom:28px;max-width:840px;">${slide.description}</div>` : ''}
      <div class="hairline" style="${!featuresList.length ? 'display:none;' : ''}"></div>
      <div style="display:flex;flex-direction:column;gap:${typo.bulletMarginBottom}px;">
        ${featuresList.map((feat: string) => `<div class="bullet-item"><div class="bullet-dash"></div><span>${feat}</span></div>`).join('')}
      </div>
    </div>
    `}
  </div>

  <!-- Footer -->
  <div class="page-footer">
    <div class="footer-author">${author.handle} — ${topic || ''}</div>
    <div class="progress-dots">
      ${Array.from({ length: totalSlides }).map((_, idx) => `<div class="pdot ${idx === slideIndex ? 'active' : ''}"></div>`).join('')}
    </div>
  </div>

  ${renderViralWatermarkHtml(licenseStatus, true)}
</body>
</html>`;
}
