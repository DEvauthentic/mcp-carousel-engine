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
  const storeUrl = process.env.CAROUSEL_STORE_URL || DEFAULT_STORE_URL;

  // 1. Resolve key from argument or environment variables
  const key = (
    providedKey ||
    process.env.CAROUSEL_LICENSE_KEY ||
    process.env.CAROUSEL_PRO_KEY ||
    ''
  ).trim();

  // If no key provided -> Standard Free Tier (Viral mode active)
  if (!key) {
    return {
      isPro: false,
      tier: 'free',
      message: 'Mode Gratuit Actif — Watermark viral inclus. Passez à la vitesse supérieure sur ' + storeUrl,
      storeUrl,
    };
  }

  // 2. Check in-memory cache
  const cached = licenseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.status;
  }

  // 3. Fast-path: Developer / Master VIP keys (works offline)
  if (
    key.startsWith('KOMI-PRO-') ||
    key.startsWith('SAID-VIP-') ||
    key === 'DEV-TEST-PRO-KEY'
  ) {
    const devStatus: LicenseStatus = {
      isPro: true,
      tier: 'pro',
      licensee: 'Said KOMI VIP Member',
      message: 'Licence Pro Vérifiée (Master Key). Watermark désactivé, tous presets débloqués.',
      storeUrl,
    };
    licenseCache.set(key, { status: devStatus, timestamp: Date.now() });
    return devStatus;
  }

  // 4. Online Validation against Polar / LemonSqueezy API (with 2.5s strict timeout)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // Default to Polar.sh license validation endpoint (can be customized via env)
    const validationUrl =
      process.env.POLAR_VALIDATION_URL ||
      `https://api.polar.sh/v1/licenses/validate`;

    const response = await fetch(validationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MCP-Carousel-Engine/3.3 (Said KOMI)',
      },
      body: JSON.stringify({ key }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as any;
      if (data.valid || data.status === 'active') {
        const proStatus: LicenseStatus = {
          isPro: true,
          tier: 'pro',
          licensee: data.customer_name || data.user_email || 'Client Pro',
          message: 'Licence Pro Active. Zéro Watermark & Accès Illimité.',
          storeUrl,
        };
        licenseCache.set(key, { status: proStatus, timestamp: Date.now() });
        return proStatus;
      }
    }
  } catch (err) {
    // If network fails but key follows standard license format, allow graceful fallback
    if (key.length >= 16) {
      const fallbackStatus: LicenseStatus = {
        isPro: true,
        tier: 'pro',
        licensee: 'Client Pro (Mode Hors-Ligne)',
        message: 'Licence Pro validée localement en mode hors-ligne.',
        storeUrl,
      };
      return fallbackStatus;
    }
  }

  // Invalid key fallback
  const invalidStatus: LicenseStatus = {
    isPro: false,
    tier: 'free',
    message: 'Clé de licence invalide ou expirée. Repli sur le mode Gratuit.',
    storeUrl,
  };
  licenseCache.set(key, { status: invalidStatus, timestamp: Date.now() });
  return invalidStatus;
}

/**
 * Generates the sleek, luxury ASCII watermark badge for Free Tier slides.
 * Injected seamlessly outside the white card on the bottom-right of the black canvas.
 */
export function renderViralWatermarkHtml(status: LicenseStatus, isLightCanvas: boolean = false): string {
  if (status.isPro) {
    return ''; // Zero watermark for Pro users!
  }

  const textColor = isLightCanvas ? 'rgba(10, 10, 10, 0.40)' : 'rgba(255, 255, 255, 0.45)';
  const linkColor = isLightCanvas ? '#002FA7' : '#00F0FF';
  const dotColor = isLightCanvas ? '#002FA7' : '#10B981';

  return `
    <!-- Viral Freemium Watermark (Said KOMI Engine) -->
    <div style="
      position: absolute;
      bottom: 28px;
      right: 64px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: ${textColor};
      letter-spacing: 0.04em;
      z-index: 20;
      pointer-events: none;
    ">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${dotColor}; box-shadow: 0 0 8px ${dotColor};"></span>
      <span>STUDIO CAROUSEL SAID KOMI</span>
      <span style="color: ${textColor}; opacity: 0.6;">::</span>
      <span style="color: ${linkColor}; text-decoration: none; font-weight: 800;">PRO [ ${status.storeUrl.replace(/^https?:\/\//, '')} ]</span>
    </div>
  `;
}
