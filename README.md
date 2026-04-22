# ColorPalette
### *The Most Elegant & Artistic Color Palette Generator*

> **"Artistic Palettes That Inspire"** — A premium, glassmorphism-based color tool that feels luxurious, addictive, and unlike anything else on the internet.

---

## ✦ Features

### Color Picker
- Canvas-based spectrum picker (Hue/Saturation/Value)
- Hue and opacity sliders with live drag interaction
- Multi-format support: **HEX, RGB, HSL, OKLCH**
- Click the swatch to copy the current color

### Palette Generation
- **Complementary** — opposite hues for bold contrast
- **Analogous** — neighboring hues for harmony
- **Triadic** — three evenly-spaced hues
- **Split-Complementary** — nuanced contrast
- **Monochromatic** — single hue, varied lightness
- **"Surprise Me"** — random premium palette every time

### Mood Palettes
| Mood | Description |
|------|-------------|
| 🌊 Calm | Soft blues and aquas |
| ⚡ Energetic | Bold, saturated contrasts |
| 💼 Professional | Corporate blues and neutrals |
| 🎨 Creative | Rich, imaginative hues |
| ✦ Luxury | Golds, blacks, silvers |
| 🌿 Nature | Greens, earths, botanicals |
| ◻ Minimal | Near-whites with one accent |
| 🌈 Vibrant | Full-saturation spectrum |

### Color Library
- 84+ curated colors across 7 families
- Real-time search filtering
- Click any swatch to generate a matching palette

### Live Preview Mockups
- **Card** — UI card with header, avatar, body text
- **Phone** — Mobile screen layout
- **Poster** — Typographic color poster

### Export Formats
| Format | Output |
|--------|--------|
| CSS Variables | `--color-1: #hex;` |
| Tailwind Config | `tailwind.config.js` colors |
| SCSS | `$color-1: #hex;` variables |
| JSON | Full palette with RGB, HSL, names |
| PNG | Beautiful downloadable swatch image |

### Persistence
- **History** — Last 30 palettes auto-saved to `localStorage`
- **Favorites** — Heart palettes to save them permanently

---

## 🚀 Getting Started

No build step required. Just open `index.html` in a browser:

```bash
# Using any static server
npx serve .
# or
python -m http.server 8080
# or just double-click index.html
```

---

## 📁 Project Structure

```
colorpalette/
├── index.html              # App shell
├── css/
│   └── style.css           # All styles (glassmorphism, animations)
├── js/
│   ├── utils.js            # Color math, conversions, helpers
│   ├── color-picker.js     # Canvas-based picker module
│   ├── palette-generator.js# Generation algorithms + export
│   └── main.js             # App orchestrator
├── assets/
│   └── icons/              # SVG icons (inline in HTML)
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🎨 Design System

| Token | Dark | Light |
|-------|------|-------|
| Background | `#0a0a0f` | `#f4f1eb` |
| Card | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.7)` |
| Text | `#f0eee8` | `#1a1814` |
| Accent | Dynamic from palette | Dynamic from palette |

**Typography:**
- Display: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (serif, luxury feel)
- Body: [DM Sans](https://fonts.google.com/specimen/DM+Sans) (clean, modern)
- Mono: [DM Mono](https://fonts.google.com/specimen/DM+Mono) (precise, technical)

---

## 🛠 Technical Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, glassmorphism, keyframe animations
- **Tailwind CSS** — Via CDN for utility classes
- **Vanilla JavaScript** — Zero dependencies, pure ES6+
- **Web APIs** — Canvas 2D, localStorage, Clipboard

---

## 📄 License

MIT © ColorPalette — See [LICENSE](./LICENSE)
