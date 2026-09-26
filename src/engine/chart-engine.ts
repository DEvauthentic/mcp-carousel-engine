/**
 * MATHEMATICAL SVG CHART ENGINE v2.0 (Solid Precision & High Impact)
 * Zero-dependency, vector-pure, 2x Retina native charting for technical slides.
 * 
 * Design Principles:
 *  - Solid, clean, disciplined color usage (No gradient clutter, no rainbow pastel scatter).
 *  - Maximized scale and visual presence (Fills the slide cleanly without awkward dead space).
 *  - Guaranteed breathing room (Zero overlap between numbers, labels, arcs, and axes).
 * 
 * Supports:
 *  - 'area-sparkline' : Smooth cubic Bézier trend curve with flat subtle tint & baseline threshold
 *  - 'bento-bars'     : High-impact solid benchmark comparisons with crisp delta badges
 *  - 'radial-gauge'   : 260° telemetry gauge with generous radius & separated status banner
 *  - 'pipeline-flow'  : Full-height (260px) architecture topology with integrated node telemetry
 *
 * Author: Said KOMI & Antigravity pair programming
 */

export interface ChartBarItem {
  label: string;
  value: number;
  displayValue?: string;
  unit?: string;
  highlight?: boolean;
  deltaBadge?: string;
}

export interface ChartPipelineNode {
  title: string;
  subtitle?: string;
  tag?: string;
  latency?: string;
  highlight?: boolean;
}

export interface ChartDataConfig {
  type: 'area-sparkline' | 'bento-bars' | 'radial-gauge' | 'pipeline-flow';
  title?: string;
  subtitle?: string;
  metric?: string;
  metricLabel?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  badge?: string;
  showKpiFooter?: boolean;
  // Area sparkline data
  points?: number[];
  labels?: string[];
  unit?: string;
  baselineValue?: number;
  baselineLabel?: string;
  // Bento bars data
  bars?: ChartBarItem[];
  // Radial gauge data
  percentage?: number;
  gaugeMin?: number;
  gaugeMax?: number;
  gaugeLabel?: string;
  gaugeSubtext?: string;
  // Pipeline flow data
  nodes?: ChartPipelineNode[];
}

export interface ChartPalette {
  primaryAccent: string;
  secondaryAccent?: string;
  background?: string;
  textMain?: string;
  isDarkCard?: boolean;
}

/**
 * Main entry point: Renders a razor-sharp, self-contained SVG chart.
 */
export function renderSvgChart(
  config: ChartDataConfig,
  palette: ChartPalette,
  width: number = 860,
  height: number = 480
): string {
  switch (config.type) {
    case 'area-sparkline':
      return renderAreaSparkline(config, palette, width, height);
    case 'bento-bars':
      return renderBentoBars(config, palette, width, height);
    case 'radial-gauge':
      return renderRadialGauge(config, palette, width, height);
    case 'pipeline-flow':
      return renderPipelineFlow(config, palette, width, height);
    default:
      return renderAreaSparkline(config, palette, width, height);
  }
}

/**
 * 1. AREA SPARKLINE (Smooth Solid Bézier Spline + Subtle Flat Tint)
 * Clean, high-contrast, zero multi-color gradient noise.
 */
function renderAreaSparkline(
  config: ChartDataConfig,
  palette: ChartPalette,
  w: number,
  h: number
): string {
  const points = config.points && config.points.length >= 2 ? config.points : [100, 75, 45, 28, 14];
  const labels = config.labels || points.map((_, i) => `T${i + 1}`);
  const unit = config.unit || '';
  const primary = palette.primaryAccent || '#FF9900';

  const padLeft = 80;
  const padRight = 40;
  const padTop = 60;
  const padBottom = 55;

  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const minVal = Math.min(...points, config.baselineValue !== undefined ? config.baselineValue : Infinity);
  const maxVal = Math.max(...points, config.baselineValue !== undefined ? config.baselineValue : -Infinity);
  const valRange = maxVal === minVal ? 1 : maxVal - minVal;
  const paddedMin = Math.max(0, minVal - valRange * 0.1);
  const paddedMax = maxVal + valRange * 0.15;
  const effectiveRange = paddedMax - paddedMin;

  // Coordinate mapping
  const coords: Array<{ x: number; y: number; val: number; label: string }> = points.map((val, i) => {
    const x = padLeft + (i / (points.length - 1)) * chartW;
    const y = padTop + chartH - ((val - paddedMin) / effectiveRange) * chartH;
    return { x, y, val, label: labels[i] || '' };
  });

  // Smooth Catmull-Rom to Cubic Bézier calculation
  let pathD = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  // Area under curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${(padTop + chartH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`;

  const isDark = palette.isDarkCard === true;

  // Grid Lines
  const gridSteps = 3;
  let gridSvg = '';
  for (let s = 0; s <= gridSteps; s++) {
    const yVal = paddedMin + (effectiveRange * s) / gridSteps;
    const yPos = padTop + chartH - (s / gridSteps) * chartH;
    gridSvg += `
      <line x1="${padLeft}" y1="${yPos.toFixed(1)}" x2="${w - padRight}" y2="${yPos.toFixed(1)}" stroke="${isDark ? 'rgba(255,255,255,0.08)' : '#E4E4E7'}" stroke-width="1.5" stroke-dasharray="4,4" />
      <text x="${padLeft - 14}" y="${(yPos + 4).toFixed(1)}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="${isDark ? '#A1A1AA' : '#71717A'}" text-anchor="end">${Math.round(yVal)}${unit}</text>
    `;
  }

  // Baseline / SLA Target Line
  let baselineSvg = '';
  if (config.baselineValue !== undefined) {
    const bY = padTop + chartH - ((config.baselineValue - paddedMin) / effectiveRange) * chartH;
    baselineSvg = `
      <g>
        <line x1="${padLeft}" y1="${bY.toFixed(1)}" x2="${w - padRight}" y2="${bY.toFixed(1)}" stroke="#E11D48" stroke-width="2" stroke-dasharray="6,4" />
        <rect x="${padLeft + 16}" y="${(bY - 26).toFixed(1)}" width="154" height="24" rx="6" fill="#0A0A0A" />
        <text x="${padLeft + 93}" y="${(bY - 10).toFixed(1)}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">${config.baselineLabel || 'TARGET SLA'}</text>
      </g>
    `;
  }

  // Data Dots and Values
  const dotsSvg = coords.map((c, i) => {
    const isFirst = i === 0;
    const isLast = i === coords.length - 1;
    const isFirstOrLast = isFirst || isLast;
    const tooltipWidth = 76;
    const tooltipX = isFirst ? c.x + 8 : (isLast ? c.x - tooltipWidth : c.x - tooltipWidth / 2);
    const textX = tooltipX + tooltipWidth / 2;

    return `
      <g>
        <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="7" fill="${isDark ? '#111113' : '#FFFFFF'}" stroke="${primary}" stroke-width="3.5" />
        ${isFirstOrLast ? `
          <rect x="${tooltipX.toFixed(1)}" y="${(c.y - 36).toFixed(1)}" width="${tooltipWidth}" height="26" rx="6" fill="#0A0A0A" stroke="${isDark ? primary : 'none'}" stroke-width="${isDark ? '1' : '0'}" />
          <text x="${textX.toFixed(1)}" y="${(c.y - 19).toFixed(1)}" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">${c.val}${unit}</text>
        ` : ''}
        <text x="${c.x.toFixed(1)}" y="${(padTop + chartH + 28).toFixed(1)}" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="${isDark ? '#A1A1AA' : '#52525B'}" text-anchor="middle">${c.label}</text>
      </g>
    `;
  }).join('');

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; width: 100%; height: auto;">
      <!-- Background Grid -->
      ${gridSvg}
      ${baselineSvg}

      <!-- Clean Flat Area Tint (No gradient soup) -->
      <path d="${areaD}" fill="${primary}" fill-opacity="${isDark ? '0.12' : '0.08'}" />

      <!-- Solid Crisp Curve Line -->
      <path d="${pathD}" fill="none" stroke="${primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Points & Monospace Axis Labels -->
      ${dotsSvg}
    </svg>
  `;
}

/**
 * 2. BENTO BARS (Solid High-Contrast Horizontal Benchmarks)
 * Chunky, bold, solid colors with zero gradient clutter.
 */
function renderBentoBars(
  config: ChartDataConfig,
  palette: ChartPalette,
  w: number,
  h: number
): string {
  const bars = config.bars && config.bars.length > 0 ? config.bars : [
    { label: 'Architecture Monolithe (Avant)', value: 420, displayValue: '420 ms', highlight: false },
    { label: 'Edge Microservices + Cache (Après)', value: 38, displayValue: '38 ms', highlight: true, deltaBadge: '-91% LATENCE' },
  ];

  const primary = palette.primaryAccent || '#FF9900';
  const maxVal = Math.max(...bars.map(b => b.value), 1);
  const barAreaW = w - 60;
  const rowCount = bars.length;
  const rowHeight = Math.min(130, Math.floor((h - 20) / rowCount));
  const trackHeight = 44;

  const isDark = palette.isDarkCard === true;
  let barsSvg = '';

  bars.forEach((bar, idx) => {
    const y = 10 + idx * rowHeight;
    const ratio = Math.max(0.08, bar.value / maxVal);
    const barWidth = Math.round(barAreaW * ratio);
    const isHighlight = bar.highlight === true;

    // High contrast solid bar styling
    let barBg = '';
    let barBorder = 'none';

    if (isDark) {
      if (isHighlight) {
        barBg = primary;
      } else {
        barBg = '#2A2D35';
        barBorder = '1px solid rgba(255,255,255,0.12)';
      }
    } else {
      if (isHighlight) {
        barBg = primary;
      } else {
        barBg = '#E4E4E7';
      }
    }

    const textColor = isDark ? (isHighlight ? '#FFFFFF' : '#D4D4D8') : (isHighlight ? '#0A0A0A' : '#52525B');
    const valueColor = isHighlight ? primary : (isDark ? '#A1A1AA' : '#71717A');

    barsSvg += `
      <!-- Bar Item Row ${idx + 1} -->
      <g transform="translate(30, ${y})">
        <!-- Label and Value Top Row -->
        <text x="0" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="19" font-weight="${isHighlight ? '800' : '600'}" fill="${textColor}">
          ${bar.label}
        </text>
        <text x="${barAreaW}" y="24" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="900" fill="${valueColor}" text-anchor="end">
          ${bar.displayValue || `${bar.value}${bar.unit || ''}`}
        </text>

        <!-- Track Container -->
        <rect x="0" y="38" width="${barAreaW}" height="${trackHeight}" rx="12" fill="${isDark ? '#141519' : '#F4F4F5'}" />

        <!-- Filled Bar Solid -->
        <rect x="0" y="38" width="${barWidth}" height="${trackHeight}" rx="12" fill="${barBg}" stroke="${isDark && !isHighlight ? 'rgba(255,255,255,0.12)' : 'none'}" stroke-width="${isDark && !isHighlight ? '1' : '0'}" />

        ${bar.deltaBadge ? `
          <!-- Delta Badge -->
          <g transform="translate(${Math.min(barAreaW - 146, Math.max(barWidth + 18, 140))}, 44)">
            <rect x="0" y="0" width="140" height="32" rx="8" 
              fill="${isHighlight ? '#0A0A0A' : (isDark ? '#222328' : '#E4E4E7')}" 
              stroke="${isHighlight && isDark ? primary : 'none'}" 
              stroke-width="${isHighlight && isDark ? '1' : '0'}" />
            <text x="70" y="21" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="800" 
              fill="${isHighlight ? (isDark ? primary : '#FFFFFF') : (isDark ? '#A1A1AA' : '#52525B')}" 
              text-anchor="middle">
              ${bar.deltaBadge}
            </text>
          </g>
        ` : ''}
      </g>
    `;
  });

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; width: 100%; height: auto;">
      ${barsSvg}
    </svg>
  `;
}

/**
 * 3. RADIAL GAUGE (Generous 260° Circular Telemetry Gauge)
 * Clean separation: Huge number inside center, subtext in dedicated bottom banner.
 * Zero text overlapping with arc stroke.
 */
function renderRadialGauge(
  config: ChartDataConfig,
  palette: ChartPalette,
  w: number,
  h: number
): string {
  const percentage = Math.min(100, Math.max(0, config.percentage !== undefined ? config.percentage : 99.9));
  const primary = palette.primaryAccent || '#FF9900';
  const isDark = palette.isDarkCard === true;

  const cx = w / 2;
  const cy = 220;
  const radius = 175;

  const startAngle = 140; // in degrees
  const totalArc = 260;
  const activeArc = (percentage / 100) * totalArc;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, start: number, end: number) => {
    const p1 = polarToCartesian(x, y, r, end);
    const p2 = polarToCartesian(x, y, r, start);
    const arcSweep = end - start <= 180 ? '0' : '1';
    return `M ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} A ${r} ${r} 0 ${arcSweep} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  };

  const bgPath = describeArc(cx, cy, radius, startAngle, startAngle + totalArc);
  const activePath = describeArc(cx, cy, radius, startAngle, startAngle + activeArc);

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; width: 100%; height: auto;">
      <!-- Track Background Arc (Solid Light Gray or Subtle Dark Trace) -->
      <path d="${bgPath}" fill="none" stroke="${isDark ? 'rgba(255,255,255,0.08)' : '#E4E4E7'}" stroke-width="26" stroke-linecap="round" />

      <!-- Active Solid Arc (Solid Accent, No Gradient) -->
      <path d="${activePath}" fill="none" stroke="${primary}" stroke-width="26" stroke-linecap="round" />

      <!-- Center Monumental Value (Ample breathing room) -->
      <text x="${cx}" y="${cy - 10}" font-family="'Plus Jakarta Sans', sans-serif" font-size="94" font-weight="900" fill="${isDark ? '#FFFFFF' : '#0A0A0A'}" text-anchor="middle" letter-spacing="-0.04em">
        ${config.metric || `${percentage}%`}
      </text>

      <!-- Center Subtitle Label (Clean Monospace) -->
      <text x="${cx}" y="${cy + 38}" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="${isDark ? '#A1A1AA' : '#71717A'}" text-anchor="middle" letter-spacing="0.1em">
        ${config.gaugeLabel || config.metricLabel || 'CONFORMITÉ CIS BENCHMARK'}
      </text>

      ${config.gaugeSubtext ? `
        <!-- Subtext Container cleanly separated below the arc -->
        <g transform="translate(${cx - 350}, 430)">
          <rect x="0" y="0" width="700" height="56" rx="16" fill="${isDark ? '#18181B' : '#F4F4F5'}" stroke="${isDark ? '#27272A' : '#E4E4E7'}" stroke-width="1.5" />
          <text x="350" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="600" fill="${isDark ? '#D4D4D8' : '#3F3F46'}" text-anchor="middle">
            ${config.gaugeSubtext}
          </text>
        </g>
      ` : ''}
    </svg>
  `;
}

/**
 * 4. PIPELINE FLOW (Monumental Architecture Topology — 360px Height)
 * Large, prominent nodes filling the slide height with clear telemetry capsules.
 */
function renderPipelineFlow(
  config: ChartDataConfig,
  palette: ChartPalette,
  w: number,
  h: number
): string {
  const nodes = config.nodes && config.nodes.length >= 2 ? config.nodes : [
    { title: 'Edge CDN', tag: 'Cloudflare', latency: '< 5ms' },
    { title: 'API Gateway', tag: 'Envoy Proxy', latency: '< 12ms' },
    { title: 'Worker K8s', tag: 'ARM Graviton', latency: '< 18ms', highlight: true },
    { title: 'Data Cache', tag: 'Redis Cluster', latency: '< 2ms' },
  ];

  const primary = palette.primaryAccent || '#FF9900';
  const isDark = palette.isDarkCard === true;
  const nodeCount = nodes.length;
  const padX = 20;
  const availableW = w - padX * 2;
  const gap = 24;
  const nodeWidth = Math.floor((availableW - (nodeCount - 1) * gap) / nodeCount);
  const nodeHeight = 350; // Monumental full-height nodes to absorb all vertical dead space!
  const centerY = 50;

  let nodesSvg = '';

  nodes.forEach((node, i) => {
    const x = padX + i * (nodeWidth + gap);
    const isHighlight = node.highlight === true;

    const nodeBg = isHighlight ? (isDark ? '#0A0A0C' : '#0A0A0A') : (isDark ? '#18181B' : '#FFFFFF');
    const nodeBorder = isHighlight ? primary : (isDark ? '#27272A' : '#E4E4E7');
    const badgeBg = isHighlight ? primary : (isDark ? '#27272A' : '#F4F4F5');
    const badgeText = isHighlight ? '#000000' : (isDark ? '#A1A1AA' : '#52525B');
    const titleColor = isHighlight ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#0A0A0A');
    const subtitleColor = isHighlight ? '#A1A1AA' : (isDark ? '#A1A1AA' : '#71717A');
    const dividerColor = isHighlight ? '#27272A' : (isDark ? '#27272A' : '#E4E4E7');
    const protocolColor = isHighlight ? '#FFFFFF' : (isDark ? '#E4E4E7' : '#18181B');
    const capsuleBg = isHighlight ? (isDark ? '#18181B' : '#18181B') : (isDark ? '#27272A' : '#F4F4F5');
    const capsuleBorder = isHighlight ? primary : (isDark ? 'rgba(255,255,255,0.08)' : '#E4E4E7');
    const capsuleText = isHighlight ? primary : (isDark ? '#FAFAFA' : '#0A0A0A');

    nodesSvg += `
      <!-- Node ${i + 1} -->
      <g transform="translate(${x}, ${centerY})">
        <!-- Node Box -->
        <rect x="0" y="0" width="${nodeWidth}" height="${nodeHeight}" rx="24" fill="${nodeBg}" stroke="${nodeBorder}" stroke-width="${isHighlight ? '3.5' : '2'}" />

        <!-- Tag / Step Monospace Badge -->
        <rect x="22" y="24" width="48" height="24" rx="6" fill="${badgeBg}" />
        <text x="46" y="40" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="800" fill="${badgeText}" text-anchor="middle">
          0${i + 1}
        </text>

        <!-- Node Title (Large & Bold) -->
        <text x="22" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="900" fill="${titleColor}">
          ${node.title}
        </text>

        <!-- Node Subtitle / Tech Tag -->
        <text x="22" y="132" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="${subtitleColor}">
          ${node.tag || node.subtitle || ''}
        </text>

        <!-- Node Mid-section Spec Divider -->
        <line x1="22" y1="175" x2="${nodeWidth - 22}" y2="175" stroke="${dividerColor}" stroke-width="1.5" />

        <!-- Node Status Metric -->
        <text x="22" y="210" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="${isHighlight ? '#71717A' : '#A1A1AA'}" letter-spacing="0.08em">
          PROTOCOLE
        </text>
        <text x="22" y="235" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="800" fill="${protocolColor}">
          ${i === 0 ? 'HTTP/3 ANYCAST' : i === 1 ? 'gRPC PROXY' : i === 2 ? 'ZERO GC RUN' : 'SHARDED IN-MEM'}
        </text>

        <!-- Internal Telemetry Capsule at Bottom of Node -->
        <rect x="18" y="280" width="${nodeWidth - 36}" height="46" rx="12" fill="${capsuleBg}" stroke="${capsuleBorder}" stroke-width="1" />
        <text x="${nodeWidth / 2}" y="309" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="800" fill="${capsuleText}" text-anchor="middle">
          ${node.latency ? `LATENCE ${node.latency}` : 'STATUS OK'}
        </text>
      </g>
    `;

    // Connector Arrow to next node
    if (i < nodeCount - 1) {
      const arrowX = x + nodeWidth;
      const arrowY = centerY + nodeHeight / 2;

      nodesSvg += `
        <!-- Arrow connector -->
        <g transform="translate(${arrowX}, ${arrowY})">
          <line x1="2" y1="0" x2="${gap - 6}" y2="0" stroke="${primary}" stroke-width="3" stroke-dasharray="4,3" />
          <polygon points="${gap - 8},-6 ${gap - 1},0 ${gap - 8},6" fill="${primary}" />
        </g>
      `;
    }
  });

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; width: 100%; height: auto;">
      ${nodesSvg}
    </svg>
  `;
}
