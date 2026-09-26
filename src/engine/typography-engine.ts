/**
 * OPTICAL TYPOGRAPHY & ZERO-OVERFLOW ADAPTIVE ENGINE
 * Mathematically balances text density within strict 1080x1350 boundaries.
 * Author: Said KOMI
 */

export interface AdaptiveTypographyConfig {
  titleFontSize: number;
  titleLineHeight: number;
  descriptionFontSize: number;
  descriptionLineHeight: number;
  bulletFontSize: number;
  bulletMarginBottom: number;
  badgeScale: number;
  statFontSize: number;
  // Adaptive Filling & Compact Density
  itemLayoutMode: 'bento-row' | 'compact-list';
  itemPadding: string;
  itemBorderRadius: number;
  itemGap: number;
  itemTitleFontSize?: number;
}

export function calcAdaptiveTypography(params: {
  title: string;
  description?: string;
  bulletPointsCount?: number;
  cardVariant?: 'standard' | 'bento' | 'monolith';
  statValue?: string;
}): AdaptiveTypographyConfig {
  const titleLen = params.title.trim().length;
  const descLen = (params.description || '').trim().length;
  const count = params.bulletPointsCount || 0;
  const statLen = (params.statValue || '').trim().length;

  // 1. Calculate Headline Metrics
  let titleFontSize = 96;
  let titleLineHeight = 1.05;

  if (titleLen <= 12) {
    titleFontSize = 125;
    titleLineHeight = 0.95;
  } else if (titleLen <= 24) {
    titleFontSize = 104;
    titleLineHeight = 0.98;
  } else if (titleLen <= 42) {
    titleFontSize = 84;
    titleLineHeight = 1.05;
  } else if (titleLen <= 70) {
    titleFontSize = 66;
    titleLineHeight = 1.12;
  } else {
    titleFontSize = 52;
    titleLineHeight = 1.18;
  }

  // Anti-overflow: When 4 or more content items are present, constrain title font size
  if (count >= 4) {
    titleFontSize = Math.min(titleFontSize, 66);
    titleLineHeight = 0.94;
  }

  // 2. Calculate Description Metrics
  let descriptionFontSize = 26;
  let descriptionLineHeight = 1.5;

  if (count >= 4) {
    descriptionFontSize = 22;
    descriptionLineHeight = 1.40;
  } else if (descLen > 240) {
    descriptionFontSize = 21;
    descriptionLineHeight = 1.4;
  } else if (descLen > 150) {
    descriptionFontSize = 24;
    descriptionLineHeight = 1.45;
  } else if (descLen < 90) {
    // Description courte : donner du poids
    descriptionFontSize = count <= 3 ? 30 : 28;
    descriptionLineHeight = 1.55;
  }

  // 3. Mathematical Adaptive Item Presentation & Density
  let bulletFontSize = 24;
  let bulletMarginBottom = 16;
  let itemLayoutMode: 'bento-row' | 'compact-list' = 'bento-row';
  let itemPadding = '22px 28px';
  let itemBorderRadius = 18;
  let itemGap = 18;
  let itemTitleFontSize = 26;

  if (count > 0 && count <= 2) {
    // 1 ou 2 items : Impact maximal, grands blocs Bento aérés, zéro vide central
    itemLayoutMode = 'bento-row';
    bulletFontSize = descLen > 180 ? 23 : 25;
    itemTitleFontSize = 28;
    bulletMarginBottom = 20;
    itemPadding = '24px 28px';
    itemBorderRadius = 18;
    itemGap = 20;
  } else if (count === 3) {
    // 3 items : Structure en triptyque équilibré
    itemLayoutMode = 'bento-row';
    bulletFontSize = descLen > 180 ? 20.5 : 22;
    itemTitleFontSize = 24;
    bulletMarginBottom = 14;
    itemPadding = '18px 22px';
    itemBorderRadius = 16;
    itemGap = 14;
  } else if (count === 4) {
    // 4 items : 4 Bento Rows structurés sans vide central
    itemLayoutMode = 'bento-row';
    bulletFontSize = 19;
    itemTitleFontSize = 21;
    bulletMarginBottom = 10;
    itemPadding = '13px 18px';
    itemBorderRadius = 14;
    itemGap = 10;
  } else if (count >= 5) {
    // 5+ items : Mode haute capacité anti-débordement
    itemLayoutMode = 'compact-list';
    bulletFontSize = 18;
    itemTitleFontSize = 19;
    bulletMarginBottom = 8;
    itemPadding = '0px';
    itemBorderRadius = 0;
    itemGap = 0;
    titleFontSize = Math.min(titleFontSize, 58);
    descriptionFontSize = Math.min(descriptionFontSize, 20);
  }

  // 4. Calculate Stat Metric Metrics (prevent overflow for values like +1,450,000 or 99.999%)
  let statFontSize = 168;
  if (statLen > 9) {
    statFontSize = 104;
  } else if (statLen > 6) {
    statFontSize = 128;
  } else if (statLen > 4) {
    statFontSize = 148;
  }

  return {
    titleFontSize,
    titleLineHeight,
    descriptionFontSize,
    descriptionLineHeight,
    bulletFontSize,
    bulletMarginBottom,
    badgeScale: titleLen > 50 ? 0.9 : 1.0,
    statFontSize,
    itemLayoutMode,
    itemPadding,
    itemBorderRadius,
    itemGap,
    itemTitleFontSize,
  };
}
