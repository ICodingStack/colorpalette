/**
 * ColorPalette — palette-generator.js
 * Generates harmonious color palettes using color theory algorithms.
 * Includes mood-based, complementary, analogous, triadic, and random generators.
 */

'use strict';

const PaletteGenerator = (() => {

  // ─── Mood Definitions ─────────────────────────────────────────
  // Each mood has seed hues, saturation/lightness ranges, and a name pool

  const MOODS = [
    {
      id: 'calm',
      label: '🌊 Calm',
      emoji: '🌊',
      names: [
        'Tranquil Waters', 'Morning Mist', 'Soft Tide', 'Quiet Horizon',
        'Still Lagoon', 'Pale Shore', 'Drift', 'Serenity'
      ],
      generate: () => moodPalette({ hues: [200, 210, 220, 195, 185], s: [20, 45], l: [55, 80] }),
    },
    {
      id: 'energetic',
      label: '⚡ Energetic',
      emoji: '⚡',
      names: [
        'Electric Rush', 'Neon Charge', 'Power Surge', 'Ignition',
        'Spark Storm', 'Flash Point', 'High Voltage', 'Pulse'
      ],
      generate: () => moodPalette({ hues: [15, 45, 280, 350, 160], s: [85, 100], l: [50, 65] }),
    },
    {
      id: 'professional',
      label: '💼 Professional',
      emoji: '💼',
      names: [
        'Corporate Slate', 'Executive Blue', 'Boardroom', 'Authority',
        'Prestige', 'The Suite', 'Formal Edge', 'Power Meeting'
      ],
      generate: () => moodPalette({ hues: [215, 220, 225, 0, 0], s: [15, 55], l: [20, 75], includeNeutrals: true }),
    },
    {
      id: 'creative',
      label: '🎨 Creative',
      emoji: '🎨',
      names: [
        'Studio Session', 'Painted Dreams', 'Artist\'s Block', 'Color Theory',
        'Mixed Media', 'Abstract Play', 'The Palette', 'Imagination'
      ],
      generate: () => moodPalette({ hues: [280, 340, 50, 170, 210], s: [65, 90], l: [50, 70] }),
    },
    {
      id: 'luxury',
      label: '✦ Luxury',
      emoji: '✦',
      names: [
        'Noir et Or', 'Black Tie', 'The Vault', 'Gilded Edge',
        'Midnight Gala', 'Opulent', 'The Reserve', 'Prestige Noir'
      ],
      generate: () => luxuryPalette(),
    },
    {
      id: 'nature',
      label: '🌿 Nature',
      emoji: '🌿',
      names: [
        'Forest Floor', 'Morning Dew', 'Wildgrove', 'Earth Song',
        'Sunlit Canopy', 'Ancient Root', 'The Garden', 'Natural State'
      ],
      generate: () => moodPalette({ hues: [120, 140, 90, 35, 160], s: [30, 70], l: [35, 70] }),
    },
    {
      id: 'minimal',
      label: '◻ Minimal',
      emoji: '◻',
      names: [
        'White Space', 'Clean Slate', 'Monochrome Edit', 'Zero Noise',
        'Stripped Back', 'Essential', 'Bare Canvas', 'Reduction'
      ],
      generate: () => minimalPalette(),
    },
    {
      id: 'vibrant',
      label: '🌈 Vibrant',
      emoji: '🌈',
      names: [
        'Chromatic Burst', 'Festival', 'Spectrum Dance', 'Vivid Life',
        'Candy Drop', 'Full Saturation', 'Rainbow Bridge', 'Pop!'
      ],
      generate: () => vibrantPalette(),
    },
  ];


  // ─── Palette Generation Algorithms ───────────────────────────

  /** Generic mood palette from hue/saturation/lightness ranges */
  function moodPalette({ hues, s, l, includeNeutrals = false }) {
    const count = Utils.randomInt(5, 7);
    const palette = [];

    // Shuffle hues and pick from them
    const shuffled = [...hues].sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      const hue = shuffled[i % shuffled.length] + Utils.randomInRange(-12, 12);
      const sat = includeNeutrals && i >= count - 2
        ? Utils.randomInRange(5, 20)
        : Utils.randomInRange(s[0], s[1]);
      const light = Utils.randomInRange(l[0], l[1]);

      const hex = Utils.rgbToHex(Utils.hslToRgb({
        h: (hue + 360) % 360,
        s: sat,
        l: light,
      }));
      palette.push(hex);
    }

    return palette;
  }

  /** Luxury: deep blacks, warm golds, silvers */
  function luxuryPalette() {
    const goldHue = Utils.randomInRange(38, 52);
    return [
      Utils.rgbToHex(Utils.hslToRgb({ h: goldHue, s: Utils.randomInRange(60, 80), l: Utils.randomInRange(48, 62) })),
      Utils.rgbToHex(Utils.hslToRgb({ h: goldHue + 5, s: Utils.randomInRange(30, 50), l: Utils.randomInRange(25, 40) })),
      Utils.rgbToHex(Utils.hslToRgb({ h: 0, s: 0, l: Utils.randomInRange(10, 20) })),
      Utils.rgbToHex(Utils.hslToRgb({ h: goldHue - 5, s: Utils.randomInRange(20, 40), l: Utils.randomInRange(65, 80) })),
      Utils.rgbToHex(Utils.hslToRgb({ h: 0, s: 0, l: Utils.randomInRange(75, 92) })),
      Utils.rgbToHex(Utils.hslToRgb({ h: goldHue, s: Utils.randomInRange(45, 65), l: Utils.randomInRange(35, 50) })),
    ];
  }

  /** Minimal: near-whites, near-blacks, one muted accent */
  function minimalPalette() {
    const accentHue = Utils.randomInRange(0, 360);
    return [
      Utils.rgbToHex(Utils.hslToRgb({ h: 0, s: 0, l: 97 })),
      Utils.rgbToHex(Utils.hslToRgb({ h: 0, s: 0, l: 88 })),
      Utils.rgbToHex(Utils.hslToRgb({ h: 0, s: 0, l: 65 })),
      Utils.rgbToHex(Utils.hslToRgb({ h: accentHue, s: Utils.randomInRange(20, 50), l: Utils.randomInRange(45, 60) })),
      Utils.rgbToHex(Utils.hslToRgb({ h: 0, s: 0, l: Utils.randomInRange(12, 22) })),
    ];
  }

  /** Vibrant: fully saturated across the spectrum */
  function vibrantPalette() {
    const startHue = Utils.randomInRange(0, 60);
    const count = Utils.randomInt(5, 7);
    return Array.from({ length: count }, (_, i) => {
      const hue = (startHue + (i * (360 / count))) % 360;
      return Utils.rgbToHex(Utils.hslToRgb({
        h: hue,
        s: Utils.randomInRange(80, 100),
        l: Utils.randomInRange(50, 65),
      }));
    });
  }

  /** Complementary: base + complement + shades */
  function complementaryPalette(baseHex) {
    const hsl = Utils.rgbToHsl(Utils.hexToRgb(baseHex));
    const compHue = (hsl.h + 180) % 360;
    const count = Utils.randomInt(5, 7);
    const palette = [];

    // Base shades
    palette.push(Utils.rgbToHex(Utils.hslToRgb({ h: hsl.h, s: hsl.s, l: hsl.l })));
    palette.push(Utils.rgbToHex(Utils.hslToRgb({ h: hsl.h, s: hsl.s * 0.7, l: Math.min(hsl.l + 20, 90) })));

    // Complement shades
    palette.push(Utils.rgbToHex(Utils.hslToRgb({ h: compHue, s: hsl.s, l: hsl.l })));
    palette.push(Utils.rgbToHex(Utils.hslToRgb({ h: compHue, s: hsl.s * 0.7, l: Math.min(hsl.l + 20, 90) })));

    // Neutral connector
    palette.push(Utils.rgbToHex(Utils.hslToRgb({ h: hsl.h, s: 8, l: Utils.randomInRange(85, 95) })));

    if (count > 5) {
      palette.push(Utils.rgbToHex(Utils.hslToRgb({ h: hsl.h, s: hsl.s * 0.9, l: Math.max(hsl.l - 25, 10) })));
    }
    if (count > 6) {
      palette.push(Utils.rgbToHex(Utils.hslToRgb({ h: compHue, s: hsl.s * 0.9, l: Math.max(hsl.l - 20, 10) })));
    }

    return palette;
  }

  /** Analogous: neighboring hues */
  function analogousPalette(baseHex) {
    const hsl = Utils.rgbToHsl(Utils.hexToRgb(baseHex));
    const spread = Utils.randomInRange(20, 45);
    const count = Utils.randomInt(5, 7);

    return Array.from({ length: count }, (_, i) => {
      const offset = (i - Math.floor(count / 2)) * spread / Math.floor(count / 2);
      const hue = (hsl.h + offset + 360) % 360;
      const lightVariation = Utils.randomInRange(-15, 15);
      return Utils.rgbToHex(Utils.hslToRgb({
        h: hue,
        s: hsl.s * Utils.randomInRange(0.8, 1.1),
        l: Utils.clamp(hsl.l + lightVariation, 15, 90),
      }));
    });
  }

  /** Triadic: three evenly spaced hues */
  function triadicPalette(baseHex) {
    const hsl = Utils.rgbToHsl(Utils.hexToRgb(baseHex));
    const hues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];
    const palette = [];

    hues.forEach(hue => {
      palette.push(Utils.rgbToHex(Utils.hslToRgb({
        h: hue,
        s: hsl.s,
        l: hsl.l,
      })));
      palette.push(Utils.rgbToHex(Utils.hslToRgb({
        h: hue,
        s: hsl.s * 0.6,
        l: Math.min(hsl.l + 25, 90),
      })));
    });

    // Trim to 5-6 colors
    return palette.slice(0, Utils.randomInt(5, 6));
  }

  /** Split complementary */
  function splitComplementaryPalette(baseHex) {
    const hsl = Utils.rgbToHsl(Utils.hexToRgb(baseHex));
    const split1 = (hsl.h + 150) % 360;
    const split2 = (hsl.h + 210) % 360;

    return [
      baseHex,
      Utils.rgbToHex(Utils.hslToRgb({ h: hsl.h, s: hsl.s * 0.7, l: Math.min(hsl.l + 20, 90) })),
      Utils.rgbToHex(Utils.hslToRgb({ h: split1, s: hsl.s, l: hsl.l })),
      Utils.rgbToHex(Utils.hslToRgb({ h: split2, s: hsl.s, l: hsl.l })),
      Utils.rgbToHex(Utils.hslToRgb({ h: hsl.h, s: 5, l: 92 })),
      Utils.rgbToHex(Utils.hslToRgb({ h: hsl.h, s: hsl.s * 0.9, l: Math.max(hsl.l - 25, 10) })),
    ];
  }

  /** Monochromatic: single hue, varied lightness/saturation */
  function monochromaticPalette(baseHex) {
    const hsl = Utils.rgbToHsl(Utils.hexToRgb(baseHex));
    const count = Utils.randomInt(5, 7);

    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      return Utils.rgbToHex(Utils.hslToRgb({
        h: hsl.h + Utils.randomInRange(-5, 5),
        s: Utils.lerp(20, Math.min(hsl.s + 10, 100), t),
        l: Utils.lerp(85, 20, t),
      }));
    });
  }


  // ─── "Surprise Me" — premium random palette ──────────────────

  const HARMONY_TYPES = [
    'complementary', 'analogous', 'triadic',
    'splitComplementary', 'monochromatic',
    'luxury', 'vibrant',
  ];

  function surprisePalette() {
    const type = HARMONY_TYPES[Utils.randomInt(0, HARMONY_TYPES.length - 1)];
    const randomHue = Utils.randomInRange(0, 360);
    const randomSat = Utils.randomInRange(50, 90);
    const randomLight = Utils.randomInRange(40, 65);
    const baseHex = Utils.rgbToHex(Utils.hslToRgb({ h: randomHue, s: randomSat, l: randomLight }));

    switch (type) {
      case 'complementary':     return { colors: complementaryPalette(baseHex), type: 'Complementary' };
      case 'analogous':         return { colors: analogousPalette(baseHex), type: 'Analogous' };
      case 'triadic':           return { colors: triadicPalette(baseHex), type: 'Triadic' };
      case 'splitComplementary':return { colors: splitComplementaryPalette(baseHex), type: 'Split-Complementary' };
      case 'monochromatic':     return { colors: monochromaticPalette(baseHex), type: 'Monochromatic' };
      case 'luxury':            return { colors: luxuryPalette(), type: 'Luxury' };
      case 'vibrant':           return { colors: vibrantPalette(), type: 'Vibrant' };
      default:                  return { colors: analogousPalette(baseHex), type: 'Analogous' };
    }
  }


  // ─── From Base Color ─────────────────────────────────────────

  function fromColor(baseHex) {
    const types = ['complementary', 'analogous', 'triadic', 'splitComplementary', 'monochromatic'];
    const type = types[Utils.randomInt(0, types.length - 1)];

    switch (type) {
      case 'complementary':     return { colors: complementaryPalette(baseHex), type: 'Complementary' };
      case 'analogous':         return { colors: analogousPalette(baseHex), type: 'Analogous' };
      case 'triadic':           return { colors: triadicPalette(baseHex), type: 'Triadic' };
      case 'splitComplementary':return { colors: splitComplementaryPalette(baseHex), type: 'Split-Complementary' };
      case 'monochromatic':     return { colors: monochromaticPalette(baseHex), type: 'Monochromatic' };
      default:                  return { colors: analogousPalette(baseHex), type: 'Analogous' };
    }
  }


  // ─── Palette Naming ──────────────────────────────────────────

  const PALETTE_ADJECTIVES = [
    'Gentle', 'Bold', 'Muted', 'Vivid', 'Deep', 'Soft', 'Rich',
    'Warm', 'Cool', 'Bright', 'Dark', 'Pale', 'Subtle', 'Strong',
    'Ancient', 'Modern', 'Dreamy', 'Sharp', 'Refined', 'Wild',
  ];

  const PALETTE_NOUNS = [
    'Horizon', 'Reverie', 'Mirage', 'Eclipse', 'Bloom', 'Solstice',
    'Dusk', 'Dawn', 'Abyss', 'Ember', 'Frost', 'Tide', 'Glow',
    'Shadow', 'Prism', 'Veil', 'Storm', 'Mist', 'Flame', 'Shore',
  ];

  function generateName() {
    const adj = PALETTE_ADJECTIVES[Utils.randomInt(0, PALETTE_ADJECTIVES.length - 1)];
    const noun = PALETTE_NOUNS[Utils.randomInt(0, PALETTE_NOUNS.length - 1)];
    return `${adj} ${noun}`;
  }


  // ─── Export Formats ──────────────────────────────────────────

  function exportPalette(colors, format) {
    switch (format) {
      case 'css':
        return exportCSS(colors);
      case 'tailwind':
        return exportTailwind(colors);
      case 'scss':
        return exportSCSS(colors);
      case 'json':
        return exportJSON(colors);
      default:
        return '';
    }
  }

  function exportCSS(colors) {
    const lines = [':root {'];
    colors.forEach((hex, i) => {
      const name = Utils.getColorName(hex).toLowerCase().replace(/\s+/g, '-');
      lines.push(`  --color-${i + 1}: ${hex}; /* ${name} */`);
      const rgb = Utils.hexToRgb(hex);
      lines.push(`  --color-${i + 1}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`);
    });
    lines.push('}');
    return lines.join('\n');
  }

  function exportTailwind(colors) {
    const lines = ['// tailwind.config.js', 'module.exports = {', '  theme: {', '    extend: {', '      colors: {'];
    colors.forEach((hex, i) => {
      lines.push(`        'palette-${i + 1}': '${hex}',`);
    });
    lines.push('      },', '    },', '  },', '};');
    return lines.join('\n');
  }

  function exportSCSS(colors) {
    const lines = ['// ColorPalette Export'];
    colors.forEach((hex, i) => {
      const name = Utils.getColorName(hex).toLowerCase().replace(/\s+/g, '-');
      lines.push(`$color-${i + 1}: ${hex}; // ${name}`);
    });
    lines.push('', '$palette: (');
    colors.forEach((hex, i) => {
      lines.push(`  '${i + 1}': ${hex},`);
    });
    lines.push(');');
    return lines.join('\n');
  }

  function exportJSON(colors) {
    const obj = {
      name: generateName(),
      colors: colors.map((hex, i) => ({
        id: i + 1,
        hex,
        rgb: Utils.hexToRgb(hex),
        hsl: (() => {
          const hsl = Utils.rgbToHsl(Utils.hexToRgb(hex));
          return { h: Math.round(hsl.h), s: Math.round(hsl.s), l: Math.round(hsl.l) };
        })(),
        name: Utils.getColorName(hex),
        contrast: Utils.getContrastColor(hex),
      })),
    };
    return JSON.stringify(obj, null, 2);
  }


  // ─── PNG Export ──────────────────────────────────────────────

  function exportPNG(colors, paletteName = 'ColorPalette') {
    const swatchW = 160;
    const swatchH = 200;
    const labelH = 60;
    const padding = 20;
    const totalW = colors.length * swatchW + padding * 2;
    const totalH = swatchH + labelH + padding * 2;

    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, totalW, totalH);

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(paletteName, totalW / 2, 18);

    // Swatches
    colors.forEach((hex, i) => {
      const x = padding + i * swatchW;
      const y = padding + 8;

      // Rounded swatch
      const radius = 12;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + swatchW - radius, y);
      ctx.arcTo(x + swatchW, y, x + swatchW, y + radius, radius);
      ctx.lineTo(x + swatchW, y + swatchH - radius);
      ctx.arcTo(x + swatchW, y + swatchH, x + swatchW - radius, y + swatchH, radius);
      ctx.lineTo(x + radius, y + swatchH);
      ctx.arcTo(x, y + swatchH, x, y + swatchH - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
      ctx.fillStyle = hex;
      ctx.fill();

      // Hex label
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '11px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(hex.toUpperCase(), x + swatchW / 2, y + swatchH + 18);

      // Color name
      const name = Utils.getColorName(hex);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px "DM Sans", sans-serif';
      ctx.fillText(name.slice(0, 12), x + swatchW / 2, y + swatchH + 34);
    });

    // Watermark
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '10px "DM Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('colorpalette.app', totalW - 12, totalH - 8);

    // Download
    const link = document.createElement('a');
    link.download = `${paletteName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }


  // ─── Public API ───────────────────────────────────────────────
  return {
    MOODS,
    surprisePalette,
    fromColor,
    generateName,
    exportPalette,
    exportPNG,

    // Individual algorithms exposed for variety
    complementaryPalette,
    analogousPalette,
    triadicPalette,
    monochromaticPalette,
    moodPalette,
  };
})();
