/**
 * ColorPalette — utils.js
 * Color conversion, naming, and helper utilities
 */

"use strict";

const Utils = (() => {
  // ─── Color Name Database ───────────────────────────────────────
  // A curated set of evocative color names mapped to hex values
  const COLOR_NAMES = [
    // Reds
    { name: "Crimson Dusk", hex: "#dc143c" },
    { name: "Rose Quartz", hex: "#f28b82" },
    { name: "Venetian Red", hex: "#c80815" },
    { name: "Coral Flame", hex: "#ff6b6b" },
    { name: "Dusty Rose", hex: "#dcb4b0" },
    { name: "Cherry Blossom", hex: "#ffb7c5" },
    { name: "Alizarin", hex: "#e32636" },
    { name: "Garnet", hex: "#733635" },

    // Oranges
    { name: "Amber Glow", hex: "#ff8c00" },
    { name: "Burnt Sienna", hex: "#e97451" },
    { name: "Tangerine Dream", hex: "#f28500" },
    { name: "Autumn Ember", hex: "#cc5500" },
    { name: "Peach Whisper", hex: "#ffcba4" },
    { name: "Apricot Mist", hex: "#fbceb1" },
    { name: "Terra Cotta", hex: "#e2725b" },
    { name: "Marigold", hex: "#eaa221" },

    // Yellows
    { name: "Citrine Gold", hex: "#e4d00a" },
    { name: "Champagne", hex: "#f7e7ce" },
    { name: "Saffron", hex: "#f4c430" },
    { name: "Lemon Zest", hex: "#fff44f" },
    { name: "Honey Gold", hex: "#d4a017" },
    { name: "Pale Wheat", hex: "#f5deb3" },
    { name: "Golden Hour", hex: "#ffb347" },
    { name: "Butter Cream", hex: "#f3e5ab" },

    // Greens
    { name: "Emerald Isle", hex: "#009473" },
    { name: "Sage Breath", hex: "#bcbf9a" },
    { name: "Forest Canopy", hex: "#228b22" },
    { name: "Mint Frost", hex: "#98ff98" },
    { name: "Olive Whisper", hex: "#8c8a5e" },
    { name: "Spring Meadow", hex: "#7cfc00" },
    { name: "Celadon Silk", hex: "#ace1af" },
    { name: "Pistachio Dream", hex: "#93c572" },
    { name: "Verdigris", hex: "#43b3ae" },
    { name: "Sea Glass", hex: "#74b5a5" },

    // Blues
    { name: "Electric Indigo", hex: "#6f00ff" },
    { name: "Cerulean Sky", hex: "#007ba7" },
    { name: "Cobalt Depth", hex: "#0047ab" },
    { name: "Soft Dawn", hex: "#b4c8e5" },
    { name: "Periwinkle", hex: "#ccccff" },
    { name: "Teal Abyss", hex: "#00827f" },
    { name: "Azure Horizon", hex: "#f0ffff" },
    { name: "Sapphire Night", hex: "#082567" },
    { name: "Powder Blue", hex: "#b0e0e6" },
    { name: "Ultramarine", hex: "#120a8f" },

    // Purples
    { name: "Amethyst Haze", hex: "#9966cc" },
    { name: "Lavender Cloud", hex: "#e6e6fa" },
    { name: "Royal Plum", hex: "#4b0082" },
    { name: "Mauve Dusk", hex: "#e0b0ff" },
    { name: "Violet Mist", hex: "#7f00ff" },
    { name: "Iris Dream", hex: "#5a4fcf" },
    { name: "Orchid Blush", hex: "#da70d6" },
    { name: "Heather", hex: "#b784a7" },

    // Pinks
    { name: "Rose Petal", hex: "#ff66b2" },
    { name: "Fuchsia Burst", hex: "#ff00ff" },
    { name: "Bubblegum", hex: "#ff69b4" },
    { name: "Blush Ivory", hex: "#f9dcd9" },
    { name: "Hot Pink Neon", hex: "#ff1493" },
    { name: "Carnation", hex: "#ffa6c9" },
    { name: "Flamingo", hex: "#fc8eac" },
    { name: "Peony", hex: "#e0457b" },

    // Browns & Neutrals
    { name: "Espresso", hex: "#4b2f1a" },
    { name: "Warm Sand", hex: "#d4b896" },
    { name: "Cinnamon Spice", hex: "#a0522d" },
    { name: "Linen", hex: "#faf0e6" },
    { name: "Sepia Tone", hex: "#704214" },
    { name: "Wheat Field", hex: "#e8d5b7" },
    { name: "Taupe", hex: "#483c32" },
    { name: "Mocha Cream", hex: "#8b6347" },

    // Grays & Whites
    { name: "Silver Mist", hex: "#c0c0c0" },
    { name: "Charcoal Smoke", hex: "#36454f" },
    { name: "Platinum", hex: "#e5e4e2" },
    { name: "Graphite", hex: "#474a51" },
    { name: "Alabaster", hex: "#f2f0eb" },
    { name: "Obsidian", hex: "#0b1215" },
    { name: "Pearl", hex: "#f8f6f0" },
    { name: "Ash Gray", hex: "#b2beb5" },

    // Special
    { name: "Midnight Noir", hex: "#0d0d0d" },
    { name: "Ivory Dusk", hex: "#fffff0" },
    { name: "Copper Patina", hex: "#6d8b74" },
    { name: "Bronze Age", hex: "#cd7f32" },
    { name: "Gold Leaf", hex: "#daa520" },
    { name: "Antique Silver", hex: "#9e9e8c" },
  ];

  // ─── Hex ↔ RGB ────────────────────────────────────────────────

  /** Parse hex string → {r, g, b} */
  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const full =
      clean.length === 3
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean;
    const num = parseInt(full, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  /** {r,g,b} → '#rrggbb' */
  function rgbToHex({ r, g, b }) {
    return (
      "#" +
      [r, g, b]
        .map((v) => {
          const hex = Math.round(clamp(v, 0, 255)).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  // ─── RGB ↔ HSL ────────────────────────────────────────────────

  function rgbToHsl({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToRgb({ h, s, l }) {
    h = ((h % 360) + 360) % 360;
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  // ─── RGB ↔ HSV ────────────────────────────────────────────────

  function rgbToHsv({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const v = max;
    const s = max === 0 ? 0 : (max - min) / max;
    let h = 0;

    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
  }

  function hsvToRgb({ h, s, v }) {
    h = ((h % 360) + 360) % 360;
    s /= 100;
    v /= 100;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r, g, b;
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  // ─── OKLCH ────────────────────────────────────────────────────
  // Simplified OKLCH ↔ RGB (via linear RGB and OKLAB)

  function linearize(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function delinearize(c) {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }

  function rgbToOklch({ r, g, b }) {
    // Normalize
    let rl = linearize(r / 255);
    let gl = linearize(g / 255);
    let bl = linearize(b / 255);

    // Linear RGB → LMS (approximate)
    const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
    const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
    const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

    const l_ = Math.cbrt(l),
      m_ = Math.cbrt(m),
      s_ = Math.cbrt(s);

    // LMS → OKLab
    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    const C = Math.sqrt(A * A + B * B);
    let H = Math.atan2(B, A) * (180 / Math.PI);
    if (H < 0) H += 360;

    return {
      l: +(L * 100).toFixed(1),
      c: +(C * 100).toFixed(3),
      h: +H.toFixed(1),
    };
  }

  function oklchToRgb({ l, c, h }) {
    const L = l / 100;
    const C = c / 100;
    const H = h * (Math.PI / 180);

    const A = C * Math.cos(H);
    const B = C * Math.sin(H);

    const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
    const s_ = L - 0.0894841775 * A - 1.291485548 * B;

    const lv = l_ * l_ * l_;
    const mv = m_ * m_ * m_;
    const sv = s_ * s_ * s_;

    let rl = 4.0767416621 * lv - 3.3077115913 * mv + 0.2309699292 * sv;
    let gl = -1.2684380046 * lv + 2.6097574011 * mv - 0.3413193965 * sv;
    let bl = -0.0041960863 * lv - 0.7034186147 * mv + 1.707614701 * sv;

    return {
      r: Math.round(clamp(delinearize(rl), 0, 1) * 255),
      g: Math.round(clamp(delinearize(gl), 0, 1) * 255),
      b: Math.round(clamp(delinearize(bl), 0, 1) * 255),
    };
  }

  // ─── Color Name Lookup ─────────────────────────────────────────

  /** Find closest named color using Euclidean distance in RGB space */
  function getColorName(hex) {
    const rgb = hexToRgb(hex);
    let closest = COLOR_NAMES[0];
    let minDist = Infinity;

    for (const entry of COLOR_NAMES) {
      const c = hexToRgb(entry.hex);
      const dist = Math.sqrt(
        (rgb.r - c.r) ** 2 + (rgb.g - c.g) ** 2 + (rgb.b - c.b) ** 2,
      );
      if (dist < minDist) {
        minDist = dist;
        closest = entry;
      }
    }
    return closest.name;
  }

  // ─── Perceived Contrast ───────────────────────────────────────

  /** Returns 'white' or 'black' for best contrast against bg */
  function getContrastColor(hex) {
    const { r, g, b } = hexToRgb(hex);
    // Relative luminance (WCAG)
    const toLinear = (c) => {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const L =
      0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    return L > 0.179 ? "#000000" : "#ffffff";
  }

  /** Returns luminance 0–1 */
  function getLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    const toL = (c) => {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toL(r) + 0.7152 * toL(g) + 0.0722 * toL(b);
  }

  // ─── Color Manipulation ───────────────────────────────────────

  function lighten(hex, amount) {
    const hsl = rgbToHsl(hexToRgb(hex));
    return rgbToHex(
      hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l + amount, 0, 100) }),
    );
  }

  function darken(hex, amount) {
    return lighten(hex, -amount);
  }

  function saturate(hex, amount) {
    const hsl = rgbToHsl(hexToRgb(hex));
    return rgbToHex(
      hslToRgb({ h: hsl.h, s: clamp(hsl.s + amount, 0, 100), l: hsl.l }),
    );
  }

  function adjustHue(hex, degrees) {
    const hsl = rgbToHsl(hexToRgb(hex));
    return rgbToHex(
      hslToRgb({ h: (hsl.h + degrees + 360) % 360, s: hsl.s, l: hsl.l }),
    );
  }

  // ─── Format Conversion ────────────────────────────────────────

  function formatRgb(hex) {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function formatHsl(hex) {
    const { h, s, l } = rgbToHsl(hexToRgb(hex));
    return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  }

  function formatOklch(hex) {
    const { l, c, h } = rgbToOklch(hexToRgb(hex));
    return `oklch(${l}% ${c} ${h})`;
  }

  // ─── Helpers ──────────────────────────────────────────────────

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(randomInRange(min, max + 1));
  }

  /** Create a ripple effect on an element */
  function createRipple(el, event) {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.cssText = `left:${x}px;top:${y}px;width:${rect.width * 2}px;height:${rect.width * 2}px;margin-left:${-rect.width}px;margin-top:${-rect.width}px;`;
    el.classList.add("ripple-container");
    el.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }

  /** Show a toast notification */
  function showToast(message, color = null) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "cp-toast";

    if (color) {
      const dot = document.createElement("span");
      dot.className = "toast-dot";
      dot.style.background = color;
      toast.appendChild(dot);
    }

    toast.appendChild(document.createTextNode(message));
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-out");
      toast.addEventListener("animationend", () => toast.remove(), {
        once: true,
      });
    }, 2200);
  }

  /** Copy text to clipboard */
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return true;
    }
  }

  /** Format relative time */
  function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  /** Generate a UUID-like ID */
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ─── Color Library Data ───────────────────────────────────────
  // Extensive curated palette for the color library panel
  // ─── Color Library Data (Comprehensive Groups) ───────────────────
  const COLOR_LIBRARY = [
    {
      group: "🔴 Reds & Warm",
      colors: [
        { name: "Crimson", hex: "#dc143c" },
        { name: "Scarlet", hex: "#ff2400" },
        { name: "Ruby", hex: "#9b111e" },
        { name: "Red", hex: "#ff0000" },
        { name: "FireBrick", hex: "#b22222" },
        { name: "DarkRed", hex: "#8b0000" },
        { name: "IndianRed", hex: "#cd5c5c" },
        { name: "LightCoral", hex: "#f08080" },
        { name: "Salmon", hex: "#fa8072" },
        { name: "DarkSalmon", hex: "#e9967a" },
        { name: "Coral", hex: "#ff7f50" },
        { name: "Tomato", hex: "#ff6347" },
        { name: "OrangeRed", hex: "#ff4500" },
        { name: "Vermilion", hex: "#e34234" },
      ],
    },
    {
      group: "🟠 Oranges & Golds",
      colors: [
        { name: "Orange", hex: "#ffa500" },
        { name: "DarkOrange", hex: "#ff8c00" },
        { name: "Gold", hex: "#ffd700" },
        { name: "Goldenrod", hex: "#daa520" },
        { name: "DarkGoldenrod", hex: "#b8860b" },
        { name: "Amber", hex: "#ffbf00" },
        { name: "Saffron", hex: "#f4c430" },
        { name: "Marigold", hex: "#eaa221" },
        { name: "Chocolate", hex: "#d2691e" },
        { name: "Peru", hex: "#cd853f" },
        { name: "SandyBrown", hex: "#f4a460" },
        { name: "BurlyWood", hex: "#deb887" },
      ],
    },
    {
      group: "🟡 Yellows & Creams",
      colors: [
        { name: "Yellow", hex: "#ffff00" },
        { name: "LemonChiffon", hex: "#fffacd" },
        { name: "LightYellow", hex: "#ffffe0" },
        { name: "PaleGoldenrod", hex: "#eee8aa" },
        { name: "Khaki", hex: "#f0e68c" },
        { name: "DarkKhaki", hex: "#bdb76b" },
        { name: "YellowGreen", hex: "#9acd32" },
        { name: "GreenYellow", hex: "#adff2f" },
        { name: "Chartreuse", hex: "#7fff00" },
        { name: "LawnGreen", hex: "#7cfc00" },
        { name: "Beige", hex: "#f5f5dc" },
        { name: "Wheat", hex: "#f5deb3" },
      ],
    },
    {
      group: "🟢 Greens & Nature",
      colors: [
        { name: "Green", hex: "#008000" },
        { name: "Lime", hex: "#00ff00" },
        { name: "LimeGreen", hex: "#32cd32" },
        { name: "ForestGreen", hex: "#228b22" },
        { name: "SeaGreen", hex: "#2e8b57" },
        { name: "MediumSeaGreen", hex: "#3cb371" },
        { name: "DarkGreen", hex: "#006400" },
        { name: "Olive", hex: "#808000" },
        { name: "OliveDrab", hex: "#6b8e23" },
        { name: "DarkOliveGreen", hex: "#556b2f" },
        { name: "PaleGreen", hex: "#98fb98" },
        { name: "LightGreen", hex: "#90ee90" },
        { name: "SpringGreen", hex: "#00ff7f" },
        { name: "MediumSpringGreen", hex: "#00fa9a" },
        { name: "MediumAquamarine", hex: "#66cdaa" },
        { name: "Aquamarine", hex: "#7fffd4" },
      ],
    },
    {
      group: "🔵 Blues & Ocean",
      colors: [
        { name: "Aqua", hex: "#00ffff" },
        { name: "Cyan", hex: "#00ffff" },
        { name: "Turquoise", hex: "#40e0d0" },
        { name: "MediumTurquoise", hex: "#48d1cc" },
        { name: "DarkTurquoise", hex: "#00ced1" },
        { name: "CadetBlue", hex: "#5f9ea0" },
        { name: "Teal", hex: "#008080" },
        { name: "DarkCyan", hex: "#008b8b" },
        { name: "LightSeaGreen", hex: "#20b2aa" },
        { name: "DarkSeaGreen", hex: "#8fbc8b" },
        { name: "SkyBlue", hex: "#87ceeb" },
        { name: "LightSkyBlue", hex: "#87cefa" },
        { name: "DeepSkyBlue", hex: "#00bfff" },
        { name: "DodgerBlue", hex: "#1e90ff" },
        { name: "CornflowerBlue", hex: "#6495ed" },
        { name: "SteelBlue", hex: "#4682b4" },
        { name: "LightSteelBlue", hex: "#b0c4de" },
        { name: "PowderBlue", hex: "#b0e0e6" },
        { name: "LightBlue", hex: "#add8e6" },
        { name: "RoyalBlue", hex: "#4169e1" },
        { name: "Blue", hex: "#0000ff" },
        { name: "MediumBlue", hex: "#0000cd" },
        { name: "DarkBlue", hex: "#00008b" },
        { name: "Navy", hex: "#000080" },
        { name: "MidnightBlue", hex: "#191970" },
      ],
    },
    {
      group: "🟣 Purples & Mystical",
      colors: [
        { name: "Lavender", hex: "#e6e6fa" },
        { name: "Thistle", hex: "#d8bfd8" },
        { name: "Plum", hex: "#dda0dd" },
        { name: "Violet", hex: "#ee82ee" },
        { name: "Orchid", hex: "#da70d6" },
        { name: "Fuchsia", hex: "#ff00ff" },
        { name: "Magenta", hex: "#ff00ff" },
        { name: "MediumOrchid", hex: "#ba55d3" },
        { name: "MediumPurple", hex: "#9370db" },
        { name: "RebeccaPurple", hex: "#663399" },
        { name: "BlueViolet", hex: "#8a2be2" },
        { name: "DarkViolet", hex: "#9400d3" },
        { name: "DarkOrchid", hex: "#9932cc" },
        { name: "DarkMagenta", hex: "#8b008b" },
        { name: "Purple", hex: "#800080" },
        { name: "Indigo", hex: "#4b0082" },
        { name: "SlateBlue", hex: "#6a5acd" },
        { name: "DarkSlateBlue", hex: "#483d8b" },
        { name: "MediumSlateBlue", hex: "#7b68ee" },
      ],
    },
    {
      group: "🟤 Earth & Neutrals",
      colors: [
        { name: "Pink", hex: "#ffc0cb" },
        { name: "LightPink", hex: "#ffb6c1" },
        { name: "HotPink", hex: "#ff69b4" },
        { name: "DeepPink", hex: "#ff1493" },
        { name: "MediumVioletRed", hex: "#c71585" },
        { name: "PaleVioletRed", hex: "#db7093" },
        { name: "Brown", hex: "#a52a2a" },
        { name: "Maroon", hex: "#800000" },
        { name: "Sienna", hex: "#a0522d" },
        { name: "SaddleBrown", hex: "#8b4513" },
        { name: "RosyBrown", hex: "#bc8f8f" },
        { name: "Tan", hex: "#d2b48c" },
        { name: "Moccasin", hex: "#ffe4b5" },
        { name: "PeachPuff", hex: "#ffdab9" },
        { name: "PapayaWhip", hex: "#ffefd5" },
        { name: "NavajoWhite", hex: "#ffdead" },
        { name: "Bisque", hex: "#ffe4c4" },
        { name: "BlanchedAlmond", hex: "#ffebcd" },
        { name: "Cornsilk", hex: "#fff8dc" },
      ],
    },
    {
      group: "⚪ Grayscale & White",
      colors: [
        { name: "White", hex: "#ffffff" },
        { name: "Snow", hex: "#fffafa" },
        { name: "Honeydew", hex: "#f0fff0" },
        { name: "MintCream", hex: "#f5fffa" },
        { name: "Azure", hex: "#f0ffff" },
        { name: "AliceBlue", hex: "#f0f8ff" },
        { name: "GhostWhite", hex: "#f8f8ff" },
        { name: "WhiteSmoke", hex: "#f5f5f5" },
        { name: "SeaShell", hex: "#fff5ee" },
        { name: "FloralWhite", hex: "#fffaf0" },
        { name: "Ivory", hex: "#fffff0" },
        { name: "AntiqueWhite", hex: "#faebd7" },
        { name: "Linen", hex: "#faf0e6" },
        { name: "LavenderBlush", hex: "#fff0f5" },
        { name: "MistyRose", hex: "#ffe4e1" },
        { name: "Gainsboro", hex: "#dcdcdc" },
        { name: "LightGray", hex: "#d3d3d3" },
        { name: "Silver", hex: "#c0c0c0" },
        { name: "DarkGray", hex: "#a9a9a9" },
        { name: "Gray", hex: "#808080" },
        { name: "DimGray", hex: "#696969" },
        { name: "LightSlateGray", hex: "#778899" },
        { name: "SlateGray", hex: "#708090" },
        { name: "DarkSlateGray", hex: "#2f4f4f" },
        { name: "Black", hex: "#000000" },
      ],
    },
  ];

  // ─── Public API ───────────────────────────────────────────────
  return {
    // Conversions
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
    rgbToHsv,
    hsvToRgb,
    rgbToOklch,
    oklchToRgb,

    // Formatting
    formatRgb,
    formatHsl,
    formatOklch,

    // Color utilities
    getColorName,
    getContrastColor,
    getLuminance,
    lighten,
    darken,
    saturate,
    adjustHue,

    // Helpers
    clamp,
    lerp,
    randomInRange,
    randomInt,
    createRipple,
    showToast,
    copyToClipboard,
    timeAgo,
    uid,

    // Data
    COLOR_LIBRARY,
    COLOR_NAMES,
  };
})();
