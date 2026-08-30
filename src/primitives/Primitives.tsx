import React from 'react';

/**
 * STRICT CANVAS CONSTANTS
 * All carousels must conform to exact 1080x1350 (4:5 vertical) dimensions.
 */
export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;

/**
 * 1. Base Slide Canvas Container (Guarantees zero-overflow, non-distorted frame)
 */
export const SlideCanvas: React.FC<{
  backgroundColor?: string;
  padding?: string | number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  backgroundColor = '#000000',
  padding = '76px 64px',
  children,
  style,
}) => {
  return (
    <div
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor,
        color: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * 2. Background Wireframe Grid with Crosshairs
 */
export const WireframeGrid: React.FC<{
  hLines?: number[];
  vLines?: number[];
  crosses?: Array<{ top: number; left?: number; right?: number }>;
  color?: string;
}> = ({
  hLines = [200, 760, 1170],
  vLines = [200, 380, 900],
  crosses = [
    { top: 200, left: 200 },
    { top: 200, right: 180 },
    { top: 760, left: 380 },
    { top: 1170, left: 380 },
  ],
  color = 'rgba(255, 255, 255, 0.12)',
}) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {hLines.map((top, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top,
            height: 1.5,
            backgroundColor: color,
          }}
        />
      ))}
      {vLines.map((pos, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            ...(pos > 540 ? { right: CANVAS_WIDTH - pos } : { left: pos }),
            width: 1.5,
            backgroundColor: color,
          }}
        />
      ))}
      {crosses.map((c, i) => (
        <div
          key={`c-${i}`}
          style={{
            position: 'absolute',
            top: c.top,
            ...(c.left !== undefined ? { left: c.left } : { right: c.right }),
            width: 18,
            height: 18,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 0,
              width: 18,
              height: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 8,
              width: 2,
              height: 18,
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
            }}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * 3. Parametric Volumetric 3D Shaded Orb
 */
export const ShadedOrb3D: React.FC<{
  size: number;
  colorTheme?: 'orange' | 'red' | 'emerald' | 'cyan' | 'violet' | 'custom';
  customGradient?: string;
  glowColor?: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  zIndex?: number;
}> = ({
  size,
  colorTheme = 'orange',
  customGradient,
  glowColor,
  top,
  left,
  right,
  bottom,
  zIndex = 2,
}) => {
  const gradients: Record<string, { bg: string; glow: string }> = {
    orange: {
      bg: 'radial-gradient(circle at 35% 30%, #FFBA3B 0%, #FF8800 45%, #994400 85%, #2E1200 100%)',
      glow: 'rgba(255, 136, 0, 0.45)',
    },
    red: {
      bg: 'radial-gradient(circle at 35% 30%, #FF453A 0%, #D80027 45%, #66000B 85%, #1A0003 100%)',
      glow: 'rgba(216, 0, 39, 0.4)',
    },
    emerald: {
      bg: 'radial-gradient(circle at 35% 30%, #4ADE80 0%, #10B981 45%, #065F46 85%, #02231A 100%)',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    cyan: {
      bg: 'radial-gradient(circle at 35% 30%, #67E8F9 0%, #06B6D4 45%, #0E7490 85%, #083344 100%)',
      glow: 'rgba(6, 182, 212, 0.45)',
    },
    violet: {
      bg: 'radial-gradient(circle at 35% 30%, #C084FC 0%, #8B5CF6 45%, #5B21B6 85%, #2E1065 100%)',
      glow: 'rgba(139, 92, 246, 0.45)',
    },
  };

  const selected = gradients[colorTheme] || gradients.orange;
  const bg = customGradient || selected.bg;
  const glow = glowColor || selected.glow;

  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: '50%',
        background: bg,
        boxShadow: `0 20px 60px ${glow}`,
        zIndex,
      }}
    />
  );
};

/**
 * 4. Layered Center Card (White Opaque or Frosted Glass)
 */
export const LayeredCard: React.FC<{
  variant?: 'white' | 'frosted-dark' | 'glass-tinted';
  height?: number;
  borderRadius?: number;
  padding?: string | number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  variant = 'white',
  height = 960,
  borderRadius = 72,
  padding = '88px 68px 74px 68px',
  children,
  style,
}) => {
  const isWhite = variant === 'white';
  const isFrosted = variant === 'frosted-dark';

  return (
    <div
      style={{
        backgroundColor: isWhite ? '#FFFFFF' : isFrosted ? 'rgba(13, 16, 24, 0.75)' : 'rgba(255, 255, 255, 0.08)',
        color: isWhite ? '#000000' : '#FFFFFF',
        borderRadius,
        padding,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height,
        width: '100%',
        position: 'relative',
        boxShadow: isWhite ? '0 40px 120px rgba(0, 0, 0, 0.85)' : '0 30px 80px rgba(0, 0, 0, 0.9)',
        border: isWhite ? 'none' : '1.5px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: isWhite ? 'none' : 'blur(40px)',
        zIndex: 4,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * 5. Luminous Gradient Pill Badge (with optional rotation)
 */
export const PillBadge: React.FC<{
  text: string;
  gradient?: string;
  color?: string;
  fontSize?: number;
  padding?: string;
  rotation?: number;
  glow?: string;
  style?: React.CSSProperties;
}> = ({
  text,
  gradient = 'linear-gradient(90deg, #FF9900 0%, #E67A00 80%, #994400 100%)',
  color = '#FFFFFF',
  fontSize = 28,
  padding = '18px 44px',
  rotation = 0,
  glow = 'rgba(255, 153, 0, 0.45)',
  style,
}) => {
  return (
    <div
      style={{
        background: gradient,
        color,
        fontSize,
        fontWeight: 700,
        padding,
        borderRadius: 60,
        transform: rotation ? `rotate(${rotation}deg)` : 'none',
        boxShadow: `0 16px 50px ${glow}`,
        display: 'inline-flex',
        alignItems: 'center',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/**
 * 6. Masked Gradient Text
 */
export const GradientMaskText: React.FC<{
  text: string;
  fontSize?: number;
  fontWeight?: number;
  gradient?: string;
  lineHeight?: number;
  letterSpacing?: string;
  style?: React.CSSProperties;
}> = ({
  text,
  fontSize = 130,
  fontWeight = 800,
  gradient = 'linear-gradient(180deg, #FFFFFF 15%, #555555 100%)',
  lineHeight = 0.94,
  letterSpacing = '-0.04em',
  style,
}) => {
  return (
    <div
      style={{
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
        textTransform: 'lowercase',
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/**
 * 7. Profile & Avatar Medal (Guarantees zero-crop on head/hair)
 */
export const ProfileMedal: React.FC<{
  name: string;
  title: string;
  avatarSrc: string;
  size?: number;
  haloGradient?: string;
}> = ({
  name,
  title,
  avatarSrc,
  size = 190,
  haloGradient = 'linear-gradient(135deg, #FF9900 0%, #10B981 100%)',
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: -5,
            borderRadius: '50%',
            background: haloGradient,
            boxShadow: '0 0 35px rgba(255, 153, 0, 0.65)',
          }}
        />
        <img
          src={avatarSrc}
          alt={name}
          style={{
            position: 'relative',
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center 8%', // Guarantees full head/forehead visibility
            border: '4px solid #000000',
            zIndex: 2,
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
          }}
        >
          {name}
        </div>

        <div
          style={{
            fontSize: 26,
            color: '#FFBA3B',
            fontWeight: 700,
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

/**
 * 8. Synchronized Carousel Page Dots
 */
export const CarouselDots: React.FC<{
  activeIndex: number;
  total?: number;
  activeColor?: string;
}> = ({
  activeIndex,
  total = 6,
  activeColor = '#FF8800',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        alignItems: 'center',
        marginTop: 32,
      }}
    >
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: idx === activeIndex ? activeColor : 'rgba(255, 255, 255, 0.25)',
            boxShadow: idx === activeIndex ? `0 0 20px ${activeColor}` : 'none',
          }}
        />
      ))}
    </div>
  );
};
