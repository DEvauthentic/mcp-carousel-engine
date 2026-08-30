import fs from 'fs';
import path from 'path';

export interface SlideData {
  type: 'cover' | 'card' | 'signature';
  title1?: string;
  title2?: string;
  boldTitle?: string;
  thinTitle?: string;
  description?: string;
  bulletPoints?: string[];
  pillTag?: string;
  ctaText?: string;
}

export interface CarouselProjectData {
  topic: string;
  themeColor: string; // e.g. "orange", "emerald", "cyan", "violet", "red"
  author: {
    name: string;
    title: string;
    handle: string;
    avatarPath?: string;
  };
  slides: SlideData[];
  outputDirectory: string;
}

/**
 * Generates an ultra-premium, interactive web previewer (index.html) in the destination folder.
 */
export function generateInteractiveViewer(data: CarouselProjectData): string {
  const previewPath = path.join(data.outputDirectory, 'index.html');

  const themeColors: Record<string, { primary: string; glow: string }> = {
    orange: { primary: '#FF9900', glow: 'rgba(255, 153, 0, 0.4)' },
    emerald: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
    cyan: { primary: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)' },
    violet: { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' },
    red: { primary: '#FF3B30', glow: 'rgba(255, 59, 48, 0.4)' },
  };

  const currentTheme = themeColors[data.themeColor] || themeColors.orange;

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.topic} — Carrousel Master (${data.author.name})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0A0D14;
      --card-bg: #111622;
      --accent: ${currentTheme.primary};
      --accent-glow: ${currentTheme.glow};
      --text: #F3F4F6;
      --text-muted: #9CA3AF;
      --border: rgba(255, 255, 255, 0.1);
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
      padding: 40px 20px 80px;
    }
    header {
      text-align: center;
      max-width: 800px;
      margin-bottom: 40px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 16px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    h1 {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 12px;
    }
    .subtitle {
      font-size: 16px;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .author-info {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-top: 18px;
      padding: 8px 20px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 40px;
    }
    .author-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent);
      object-fit: cover;
    }
    .author-name { font-weight: 800; font-size: 14px; color: #FFF; }
    .author-role { font-size: 13px; color: var(--accent); font-weight: 600; }
    
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 32px;
      width: 100%;
      max-width: 1320px;
      margin-top: 20px;
    }
    .slide-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    }
    .slide-card:hover {
      transform: translateY(-6px);
      border-color: var(--accent);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .slide-header {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      background: rgba(0,0,0,0.2);
    }
    .slide-num { font-weight: 800; font-size: 13px; color: var(--accent); }
    .slide-type { font-size: 12px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
    
    .slide-preview-frame {
      aspect-ratio: 4 / 5;
      width: 100%;
      background: #000;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .slide-preview-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .download-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px;
      background: rgba(255, 255, 255, 0.04);
      color: #FFF;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      border-top: 1px solid var(--border);
      transition: background 0.2s ease, color 0.2s ease;
    }
    .download-btn:hover {
      background: var(--accent);
      color: #000;
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">Master Carousel Recipe :: Said KOMI</div>
    <h1>${data.topic}</h1>
    <p class="subtitle">Carrousel 4:5 vertical (${data.slides.length} slides) généré avec le moteur MCP haute fidélité sans émojis.</p>
    
    <div class="author-info">
      <div class="author-avatar"></div>
      <span class="author-name">${data.author.name}</span>
      <span>•</span>
      <span class="author-role">${data.author.title}</span>
      <span>•</span>
      <span style="color: var(--text-muted); font-size: 13px;">${data.author.handle}</span>
    </div>
  </header>

  <div class="grid-container">
    ${data.slides.map((s, idx) => {
      const filename = `0${idx + 1}_Slide_${s.type}.png`;
      return `
      <div class="slide-card">
        <div class="slide-header">
          <span class="slide-num">SLIDE 0${idx + 1} / 0${data.slides.length}</span>
          <span class="slide-type">[${s.type.toUpperCase()}]</span>
        </div>
        <div class="slide-preview-frame">
          <img src="${filename}" alt="Slide ${idx + 1}" onerror="this.parentElement.innerHTML='<div style=\\'padding:30px;text-align:center;color:#666;font-size:14px;\\'>Export en cours ou rendu prêt : <strong>${filename}</strong></div>'">
        </div>
        <a href="${filename}" download class="download-btn">
          TÉLÉCHARGER LE VISUEL HD (1080x1350) [ ➔ ]
        </a>
      </div>
      `;
    }).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(previewPath, htmlContent, 'utf-8');
  return previewPath;
}
