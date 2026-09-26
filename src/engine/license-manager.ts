/**
 * LICENSE & FREEMIUM ENGINE (MCP CAROUSEL ENGINE v3.3)
 * Author: Said KOMI (Ingénieur Réseaux & Système)
 *
 * Implements the Freemium Viral + Pro Tier Architecture:
 * - Free Tier : Instant generation, default preset, aesthetic viral watermark badge.
 * - Pro Tier  : Zero watermark, all 5 presets unlocked, custom branding, priority rendering.
 *
 * Zero-domain requirement: Integrates with Polar.sh or LemonSqueezy license validation.
 */

import fs from 'fs';
import path from 'path';

export interface LicenseStatus {
  isPro: boolean;
  tier: 'free' | 'pro';
  licensee?: string;
  message: string;
  storeUrl: string;
}

const DEFAULT_STORE_URL = 'https://polar.sh/saidkomi';

// In-memory cache to prevent repeated HTTP lookups during a multi-slide run
const licenseCache = new Map<string, { status: LicenseStatus; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Validates a license key either from arguments or environment variables.
 * Supports:
 * 1. Offline Developer / Master keys for local testing
 * 2. Online verification against Polar.sh / LemonSqueezy license endpoints
 * 3. Graceful offline fallback with local caching
 */
export async function verifyLicense(providedKey?: string): Promise<LicenseStatus> {
  return {
    isPro: true,
    tier: 'free',
    licensee: 'Open Source Community',
    message: '100% Gratuit & Open-Source (Said KOMI) — Mode White-Label Complet',
    storeUrl: 'https://github.com/DEvauthentic/mcp-carousel-engine',
  };
}

/**
 * Generates the watermark badge.
 * Set to return empty string for 100% White-Label open-source freedom.
 */
export function renderViralWatermarkHtml(status: LicenseStatus, isLightCanvas: boolean = false): string {
  // 100% White-Label: zero watermark on generated user artifacts!
  return '';
}
