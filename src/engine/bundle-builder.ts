import fs from 'fs';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer';
import { DesignDNA, ThemeMode } from '../registry/types.js';
import { DESIGN_DNA_STORE, matchDesignDNA } from '../registry/dna-store.js';
import { resolveThemePreset } from '../registry/theme-presets.js';
import { generateSlideHtml, SlideRenderData } from '../archetypes/template-generator.js';
import { verifyLicense, LicenseStatus } from './license-manager.js';

export interface CarouselProjectData {
  topic: string;
  industry?: string;
  tone?: string;
  dnaId?: string;
  themeColor?: string;
  preset?: string;
  themeMode?: ThemeMode;
  licenseKey?: string;
  author: {
    name: string;
    title: string;
    handle: string;
    avatarPath?: string;
  };
  slides: SlideRenderData[];
  outputDirectory: string;
}

export interface RenderResult {
  outputDirectory: string;
  previewHtmlPath: string;
  exportedImages: string[];
  linkedinPdfPath?: string;
  dnaUsed: DesignDNA;
  presetUsed: string;
  themeModeUsed: ThemeMode;
  licenseStatus: LicenseStatus;
  durationMs: number;
}

/**
 * Resolves local Google Chrome installation if Puppeteer bundled Chromium is unavailable.
 */
function getChromeExecutablePath(): string | undefined {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return undefined;
}

/**
 * Master compilation pipeline: HTML generation + Headless Chromium automated rendering.
 */
export async function renderCarouselProject(
  data: CarouselProjectData
): Promise<RenderResult> {
  const startTime = Date.now();
  const outDir = path.resolve(data.outputDirectory);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 0. Verify License (Freemium Viral Badge vs Pro White-Label)
  const licenseStatus = await verifyLicense(data.licenseKey);

  // 1. Resolve Theme Preset & Mode
  const resolvedTheme = resolveThemePreset({
    preset: data.preset,
    topic: data.topic,
    industry: data.industry,
    tone: data.tone,
    themeMode: data.themeMode,
  });

  // 1.1 Resolve Design DNA
  let selectedDNA: DesignDNA;
  if (data.dnaId && DESIGN_DNA_STORE[data.dnaId]) {
    selectedDNA = DESIGN_DNA_STORE[data.dnaId];
  } else {
    selectedDNA = matchDesignDNA({
      topic: data.topic,
      industry: data.industry,
      tone: data.tone,
    });
    // Ensure all theme presets leverage the sovereign Said KOMI Neo-Geometric formula
    selectedDNA = {
      ...selectedDNA,
      archetypeId: 'neo-geometric-dark',
    };
  }

  // Apply calibrated preset palette onto selectedDNA
  selectedDNA = {
    ...selectedDNA,
    palette: {
      ...selectedDNA.palette,
      primaryAccent: resolvedTheme.preset.primaryAccent,
      secondaryAccent: resolvedTheme.preset.secondaryAccent,
      glowColor: resolvedTheme.preset.glowColor,
    },
  };

  // Allow custom accent overrides if explicitly specified
  if (data.themeColor) {
    const colorMap: Record<string, string> = {
      orange: '#FF9900',
      emerald: '#10B981',
      cyan: '#00F0FF',
      violet: '#8B5CF6',
      red: '#FF003C',
      lime: '#BAF700',
    };
    if (colorMap[data.themeColor.toLowerCase()]) {
      selectedDNA = {
        ...selectedDNA,
        palette: {
          ...selectedDNA.palette,
          primaryAccent: colorMap[data.themeColor.toLowerCase()],
        },
      };
    }
  }

  // 1.5. Resolve Author Avatar & Convert to Base64 Data URL
  const authorData = { ...data.author };
  let candidateAvatar = authorData.avatarPath;

  if (!candidateAvatar) {
    const defaultSearchPaths = [
      path.resolve(process.cwd(), 'photo-auteur.png'),
      path.resolve(process.cwd(), '..', 'photo-auteur.png'),
      'c:/VEILLE TECHNOLOGIQUE/laboratoires/agentic-google/photo-auteur.png',
    ];
    for (const p of defaultSearchPaths) {
      if (fs.existsSync(p)) {
        candidateAvatar = p;
        break;
      }
    }
  }

  if (candidateAvatar) {
    let resolvedAvatarPath = candidateAvatar;
    if (!fs.existsSync(resolvedAvatarPath)) {
      const candidates = [
        path.resolve(candidateAvatar),
        path.resolve(process.cwd(), candidateAvatar),
        path.resolve(process.cwd(), '..', candidateAvatar),
        path.resolve('c:/VEILLE TECHNOLOGIQUE/laboratoires/agentic-google', candidateAvatar),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          resolvedAvatarPath = cand;
          break;
        }
      }
    }
    if (fs.existsSync(resolvedAvatarPath)) {
      const ext = path.extname(resolvedAvatarPath).toLowerCase().replace('.', '') || 'png';
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png';
      const fileBuffer = fs.readFileSync(resolvedAvatarPath);
      authorData.avatarPath = `data:${mime};base64,${fileBuffer.toString('base64')}`;
    }
  }

  // 2. Generate individual HTML files for each slide
  const slideFiles: Array<{ htmlPath: string; pngPath: string; filename: string }> = [];

  for (let i = 0; i < data.slides.length; i++) {
    const slide = data.slides[i];
    const numStr = String(i + 1).padStart(2, '0');
    const filenameBase = `${numStr}_Slide_${slide.type}`;
    const htmlFilename = `${filenameBase}.html`;
    const pngFilename = `${filenameBase}.png`;
    const htmlPath = path.join(outDir, htmlFilename);
    const pngPath = path.join(outDir, pngFilename);

    const htmlContent = generateSlideHtml({
      slide,
      dna: selectedDNA,
      author: authorData,
      slideIndex: i,
      totalSlides: data.slides.length,
      topic: data.topic,
      industry: data.industry,
      themeMode: resolvedTheme.themeMode,
      licenseStatus,
    });

    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
    slideFiles.push({ htmlPath, pngPath, filename: pngFilename });
  }

  // 3. Automated Headless Chromium rendering
  let browser: Browser | null = null;
  const exportedImages: string[] = [];
  let linkedinPdfPath: string | undefined;

  try {
    const execPath = getChromeExecutablePath();
    browser = await puppeteer.launch({
      headless: true,
      executablePath: execPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
        '--force-color-profile=srgb',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1350,
      deviceScaleFactor: 2, // 2x Retina crispness (2160x2700 actual render downscaled lossless)
    });
    for (const item of slideFiles) {
      const fileUrl = `file://${item.htmlPath.replace(/\\/g, '/')}`;
      await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // [FIX] Garantie robuste de rendu des polices web avant la capture
      try {
        await page.evaluate(() => (document as any).fonts.ready);
      } catch (_) { /* graceful — polices système si Google Fonts échoue */ }
      // Pause de sécurité supplémentaire pour le rendu CSS final
      await new Promise((r) => setTimeout(r, 350));

      await page.screenshot({
        path: item.pngPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1080, height: 1350 },
      });
      exportedImages.push(item.pngPath);
    }

    // [NEW] Export PDF LinkedIn Natif Multipages (une slide = une page A4 1080x1350)
    if (exportedImages.length > 0) {
      linkedinPdfPath = path.join(outDir, 'linkedin_carousel.pdf');
      try {
        // Utiliser un buffer HTML multi-sections pour générer un PDF à une page par slide
        const pdfHtml = `<!DOCTYPE html><html><head><style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          .slide-page { width: 1080px; height: 1350px; page-break-after: always; overflow: hidden; }
          .slide-page:last-child { page-break-after: auto; }
          img { width: 1080px; height: 1350px; object-fit: cover; display: block; }
        </style></head><body>
        ${exportedImages.map(imgPath => {
          const base64 = fs.readFileSync(imgPath).toString('base64');
          const mime = 'image/png';
          return `<div class="slide-page"><img src="data:${mime};base64,${base64}" /></div>`;
        }).join('\n')}
        </body></html>`;

        const pdfPage = await browser!.newPage();
        await pdfPage.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
        await pdfPage.setContent(pdfHtml, { waitUntil: 'domcontentloaded' });
        await pdfPage.pdf({
          path: linkedinPdfPath,
          width: '1080px',
          height: '1350px',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });
        await pdfPage.close();
        console.error(`[MCP Carousel Engine] PDF LinkedIn généré : ${linkedinPdfPath}`);
      } catch (pdfErr: any) {
        console.error('[MCP Carousel Engine] PDF export warning:', pdfErr.message);
        linkedinPdfPath = undefined;
      }
    }

  } catch (err: any) {
    console.error('[MCP Carousel Engine] Chromium render warning:', err.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  // 4. Generate Interactive Studio Web Viewer
  const previewHtmlPath = generateInteractiveViewer({
    ...data,
    dna: selectedDNA,
    preset: resolvedTheme.preset,
    themeMode: resolvedTheme.themeMode,
    slideFiles,
    linkedinPdfPath,
  });

  const durationMs = Date.now() - startTime;

  return {
    outputDirectory: outDir,
    previewHtmlPath,
    exportedImages,
    linkedinPdfPath,
    dnaUsed: selectedDNA,
    presetUsed: resolvedTheme.preset.id,
    themeModeUsed: resolvedTheme.themeMode,
    licenseStatus,
    durationMs,
  };
}

/**
 * Generates an ultra-premium interactive viewer (index.html) with keyboard navigation and instant downloads.
 */
function generateInteractiveViewer(data: any): string {
  const previewPath = path.join(data.outputDirectory, 'index.html');
  const dna: DesignDNA = data.dna;
  const p = dna.palette;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.topic} — Studio Carrousel (${data.author.name})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090B10;
      --card: #121620;
      --border: rgba(255, 255, 255, 0.1);
      --accent: ${p.primaryAccent};
      --text: #F9FAFB;
      --text-muted: #9CA3AF;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px 80px;
    }
    header {
      text-align: center; max-width: 860px; margin-bottom: 30px;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05);
      border: 1px solid var(--border); padding: 6px 18px; border-radius: 999px;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
      color: var(--accent); margin-bottom: 16px; text-transform: uppercase;
    }
    h1 {
      font-size: 36px; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 8px;
    }
    .author-badge {
      display: inline-flex; align-items: center; gap: 12px; background: var(--card);
      border: 1px solid var(--border); padding: 8px 20px; border-radius: 40px; margin-top: 14px;
      font-size: 13px; font-family: 'JetBrains Mono', monospace;
    }

    /* Single Stage Navigator */
    .stage-container {
      display: flex; flex-direction: column; align-items: center; margin-bottom: 40px;
    }
    .nav-bar {
      display: flex; justify-content: space-between; align-items: center; width: 540px; margin-bottom: 14px;
    }
    .nav-btn {
      background: var(--card); border: 1px solid var(--border); color: #FFF;
      padding: 8px 18px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;
      font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .nav-btn:hover { background: var(--accent); color: #000; border-color: var(--accent); }
    .stage-frame {
      width: 540px; height: 675px; border-radius: 16px; overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.85); border: 1px solid var(--border);
      position: relative; background: #000;
    }
    .stage-frame img { width: 100%; height: 100%; object-fit: contain; }

    /* Grid Gallery */
    .grid-section {
      width: 100%; max-width: 1280px; margin-top: 30px;
    }
    .section-title {
      font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--accent);
      text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.08em;
    }
    .grid-cards {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;
    }
    .card-item {
      background: var(--card); border: 1px solid var(--border); border-radius: 20px;
      overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, border-color 0.2s;
    }
    .card-item:hover { transform: translateY(-4px); border-color: var(--accent); }
    .card-header {
      padding: 12px 18px; display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace;
      font-size: 12px; color: var(--text-muted); border-bottom: 1px solid var(--border);
    }
    .card-thumb { aspect-ratio: 4/5; width: 100%; background: #000; overflow: hidden; }
    .card-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .card-download {
      padding: 14px; text-align: center; text-decoration: none; color: #FFF;
      font-size: 13px; font-weight: 700; border-top: 1px solid var(--border);
      background: rgba(255,255,255,0.02); transition: background 0.2s, color 0.2s;
    }
    .card-download:hover { background: var(--accent); color: #000; }
  </style>
</head>
<body>
  <header>
    <div class="badge">ADN :: ${dna.name} • PRESET :: ${(data.preset?.name || 'CUSTOM').toUpperCase()} • MODE :: ${(data.themeMode || 'hybrid').toUpperCase()}</div>
    <h1>${data.topic}</h1>
    <p style="color:var(--text-muted);font-size:15px;">Carrousel 4:5 vertical (${data.slides.length} slides) — Chromium Headless Retina 2x.</p>
    ${data.linkedinPdfPath ? `<div style="margin-top:12px;"><a href="linkedin_carousel.pdf" download style="display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#000;padding:10px 24px;border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:800;text-decoration:none;">TÉLÉCHARGER PDF LINKEDIN [ ➔ ]</a></div>` : ''}
    <div class="author-badge">
      <span style="font-weight:800;color:#FFF;">${data.author.name}</span>
      <span>•</span>
      <span style="color:var(--accent);">${data.author.title}</span>
      <span>•</span>
      <span style="color:var(--text-muted);">${data.author.handle}</span>
    </div>
  </header>

  <!-- Interactive Slide Viewer -->
  <div class="stage-container">
    <div class="nav-bar">
      <button class="nav-btn" onclick="prevSlide()">[ &#8592; ] PREV</button>
      <span id="slide-indicator" style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;">SLIDE 01 / 0${data.slides.length}</span>
      <button class="nav-btn" onclick="nextSlide()">NEXT [ &#8594; ]</button>
    </div>
    <div class="stage-frame">
      <img id="active-slide-img" src="${data.slideFiles[0].filename}" alt="Slide 1">
    </div>
  </div>

  <!-- Gallery Overview -->
  <div class="grid-section">
    <div class="section-title">// EXPORT COMPLET HAUTE DÉFINITION (1080x1350) //</div>
    <div class="grid-cards">
      ${data.slideFiles.map((sf: any, idx: number) => `
        <div class="card-item">
          <div class="card-header">
            <span>SLIDE 0${idx + 1}</span>
            <span style="color:var(--accent);">${data.slides[idx].type.toUpperCase()}</span>
          </div>
          <div class="card-thumb">
            <img src="${sf.filename}" alt="Slide ${idx + 1}" />
          </div>
          <a href="${sf.filename}" download class="card-download">TÉLÉCHARGER PNG HD [ ➔ ]</a>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    const slides = ${JSON.stringify(data.slideFiles.map((s: any) => s.filename))};
    let currentIndex = 0;

    function updateView() {
      document.getElementById('active-slide-img').src = slides[currentIndex];
      document.getElementById('slide-indicator').textContent = 'SLIDE 0' + (currentIndex + 1) + ' / 0' + slides.length;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateView();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateView();
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(previewPath, html, 'utf-8');
  return previewPath;
}
