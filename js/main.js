/**
 * ColorPalette — main.js
 * Application orchestrator: connects picker, generator, preview, history, favorites,
 * export, mood grid, color library, particle background, and live preview mockups.
 */

"use strict";

// ─── App State ────────────────────────────────────────────────
const App = {
  currentPalette: [],
  currentPaletteName: "",
  history: [],
  favorites: [],
  previewMode: "card", // 'card' | 'phone' | 'poster'
  MAX_HISTORY: 30,
};

// ─── LocalStorage ─────────────────────────────────────────────
const Storage = {
  save() {
    try {
      localStorage.setItem("cp_history", JSON.stringify(App.history));
      localStorage.setItem("cp_favorites", JSON.stringify(App.favorites));
    } catch (e) {}
  },
  load() {
    try {
      App.history = JSON.parse(localStorage.getItem("cp_history") || "[]");
      App.favorites = JSON.parse(localStorage.getItem("cp_favorites") || "[]");
    } catch (e) {
      App.history = [];
      App.favorites = [];
    }
  },
};

// ─── Palette Rendering ────────────────────────────────────────

// ─── Palette Rendering (النسخة النهائية المحسنة) ────────────────────────────────────────
function renderPaletteBar(colors, name) {
  const bar = document.getElementById("palette-bar");
  const nameEl = document.getElementById("palette-name");

  if (!bar) return;

  // Fade out
  bar.style.transition = "opacity 0.2s ease";
  bar.style.opacity = "0";

  setTimeout(() => {
    bar.innerHTML = "";
    bar.classList.add("stagger");

    colors.forEach((hex, i) => {
      const colorName = Utils.getColorName(hex);
      const contrastColor = Utils.getContrastColor(hex);

      const swatch = document.createElement("div");
      swatch.className = "palette-swatch swatch-pop";
      swatch.style.cssText = `background:${hex}; animation-delay:${i * 40}ms`;
      swatch.setAttribute("role", "button");
      swatch.setAttribute("tabindex", "0");
      swatch.setAttribute("aria-label", `${colorName}: ${hex}`);

      // Info overlay
      const info = document.createElement("div");
      info.className = "swatch-info";
      info.innerHTML = `
        <span class="swatch-name">${colorName}</span>
        <span class="swatch-hex">${hex.toUpperCase()}</span>
      `;

      // Copy button
      const copyBtn = document.createElement("button");
      copyBtn.className = "swatch-copy-btn";
      copyBtn.setAttribute("aria-label", `Copy ${hex}`);
      copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

      copyBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await Utils.copyToClipboard(hex);
        Utils.showToast(`Copied ${hex}`, hex);
        Utils.createRipple(copyBtn, e);
      });

      swatch.addEventListener("click", () => openColorModal(hex, colorName));
      swatch.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openColorModal(hex, colorName);
      });

      swatch.appendChild(info);
      swatch.appendChild(copyBtn);
      bar.appendChild(swatch);
    });

    // Fade in + update everything
    bar.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    bar.style.opacity = "1";
    bar.style.transform = "scaleX(1)";

    if (nameEl) nameEl.textContent = `— ${name || "Mixed Media"}`;

    updateBackgroundAccent(colors);
    renderLivePreview(colors);
    updateLogoGradient(colors);
    renderContrastChecker(colors);

    announceToScreenReader(
      `Palette updated: ${name || "Mixed Media"}. ${colors.length} colors.`,
    );
  }, 180);
}

function updateBackgroundAccent(colors) {
  if (!colors.length) return;
  const root = document.documentElement;
  root.style.setProperty("--palette-accent-1", colors[0]);
  root.style.setProperty(
    "--palette-accent-2",
    colors[Math.floor(colors.length / 2)] || colors[0],
  );
  root.style.setProperty("--palette-accent-3", colors[colors.length - 1]);
}

function updateLogoGradient(colors) {
  if (!colors.length) return;
  const logo = document.querySelector(".logo-mark");
  if (logo)
    logo.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[colors.length - 1]})`;
}

// ─── Accessibility Helpers ───────────────────────────────────

function announceToScreenReader(message) {
  const live = document.getElementById("a11y-live");
  if (live) {
    live.textContent = ""; // clear first
    setTimeout(() => {
      live.textContent = message;
    }, 50);
  }
}

// تحسين renderPaletteBar ليشمل Contrast Checker + ARIA أفضل
function renderPaletteBar(colors, name) {
  const bar = document.getElementById("palette-bar");
  const nameEl = document.getElementById("palette-name");

  bar.style.opacity = "0";
  bar.style.transform = "scaleX(0.96)";

  setTimeout(() => {
    bar.innerHTML = "";
    bar.classList.add("stagger");

    colors.forEach((hex, i) => {
      const colorName = Utils.getColorName(hex);
      const contrastColor = Utils.getContrastColor(hex);
      const contrastRatio = Utils.getLuminance(hex) > 0.179 ? "High" : "Low"; // بسيط

      const swatch = document.createElement("div");
      swatch.className = "palette-swatch swatch-pop";
      swatch.style.cssText = `background:${hex}; animation-delay:${i * 40}ms`;
      swatch.setAttribute("role", "button"); // غيرنا من listitem إلى button
      swatch.setAttribute("tabindex", "0");
      swatch.setAttribute(
        "aria-label",
        `${colorName}: ${hex}. Contrast: ${contrastColor === "#ffffff" ? "White text" : "Black text"}`,
      );

      // Info overlay
      const info = document.createElement("div");
      info.className = "swatch-info";
      info.innerHTML = `
        <span class="swatch-name">${colorName}</span>
        <span class="swatch-hex">${hex.toUpperCase()}</span>
      `;

      // Copy button (نفس الكود القديم)
      const copyBtn = document.createElement("button");
      copyBtn.className = "swatch-copy-btn";
      copyBtn.setAttribute("aria-label", `Copy ${hex}`);
      copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

      copyBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await Utils.copyToClipboard(hex);
        Utils.showToast(`Copied ${hex}`, hex);
        Utils.createRipple(copyBtn, e);
      });

      swatch.addEventListener("click", () => openColorModal(hex, colorName));
      swatch.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openColorModal(hex, colorName);
      });

      swatch.appendChild(info);
      swatch.appendChild(copyBtn);
      bar.appendChild(swatch);
    });

    bar.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    bar.style.opacity = "1";
    bar.style.transform = "scaleX(1)";

    if (nameEl) nameEl.textContent = `— ${name}`;

    updateBackgroundAccent(colors);
    renderLivePreview(colors);
    updateLogoGradient(colors);
    renderContrastChecker(colors);
    // Accessibility Announcement
    announceToScreenReader(
      `Palette updated: ${name}. ${colors.length} colors generated.`,
    );
  }, 200);
}

// ─── Generate & Set Palette ───────────────────────────────────

function setPalette(colors, name, saveToHistory = true) {
  App.currentPalette = colors;
  App.currentPaletteName = name;

  renderPaletteBar(colors, name);

  if (saveToHistory) {
    addToHistory({ colors, name, timestamp: Date.now(), id: Utils.uid() });
  }
}

function addToHistory(entry) {
  // Avoid duplicates
  App.history = App.history.filter(
    (h) => h.colors.join() !== entry.colors.join(),
  );
  App.history.unshift(entry);
  if (App.history.length > App.MAX_HISTORY) {
    App.history = App.history.slice(0, App.MAX_HISTORY);
  }
  Storage.save();
  renderHistoryPanel();
  renderFavoritesPanel();
}

// ─── Live Preview Mockups ─────────────────────────────────────

function renderLivePreview(colors) {
  const container = document.getElementById("preview-container");
  if (!container || !colors.length) return;

  switch (App.previewMode) {
    case "card":
      renderCardPreview(container, colors);
      break;
    case "phone":
      renderPhonePreview(container, colors);
      break;
    case "poster":
      renderPosterPreview(container, colors);
      break;
  }
}

function renderCardPreview(container, colors) {
  const c = (i) => colors[Math.min(i, colors.length - 1)];
  const contrast = Utils.getContrastColor(c(0));
  const contrastBody = Utils.getContrastColor(c(4) || c(3) || "#ffffff");

  container.innerHTML = `
    <div class="preview-card w-full" style="background:${c(4) || "#f5f5f5"}">
      <div class="preview-card-header" style="background:${c(0)}">
        <div class="preview-card-avatar" style="background:${c(1)}"></div>
        <div>
          <div class="preview-card-text-a" style="background:${contrast}; opacity:0.9"></div>
          <div class="preview-card-text-b" style="background:${contrast}"></div>
        </div>
      </div>
      <div class="preview-card-body">
        <div style="height:8px; border-radius:4px; background:${c(2)}; opacity:0.8; width:85%; margin-bottom:8px"></div>
        <div style="height:8px; border-radius:4px; background:${contrastBody}; opacity:0.3; width:70%; margin-bottom:8px"></div>
        <div style="height:8px; border-radius:4px; background:${contrastBody}; opacity:0.3; width:55%"></div>
        <div class="preview-card-btn" style="background:${c(2)}"></div>
      </div>
    </div>
  `;
}

function renderPhonePreview(container, colors) {
  const c = (i) => colors[Math.min(i, colors.length - 1)];

  container.innerHTML = `
    <div class="preview-phone" style="background:${c(3) || c(2)}">
      <div class="preview-phone-notch"></div>
      <div class="preview-phone-screen">
        <div style="height:45%; background:${c(0)}; display:flex; align-items:flex-end; padding:12px;">
          <div style="color:${Utils.getContrastColor(c(0))}; font-size:14px; font-family:Cormorant Garamond,serif; opacity:0.9">Hello.</div>
        </div>
        <div style="padding:10px; display:flex; gap:6px; flex-direction:column;">
          <div style="height:8px; border-radius:4px; background:${c(1)}; width:80%"></div>
          <div style="height:6px; border-radius:3px; background:${c(2)}; opacity:0.6; width:60%"></div>
          <div style="height:6px; border-radius:3px; background:${c(2)}; opacity:0.4; width:70%"></div>
          <div style="margin-top:8px; height:24px; border-radius:12px; background:${c(1)}; width:70%"></div>
        </div>
      </div>
    </div>
  `;
}

function renderPosterPreview(container, colors) {
  const c = (i) => colors[Math.min(i, colors.length - 1)];
  const names = colors.map((h) => Utils.getColorName(h));

  container.innerHTML = `
    <div class="preview-poster" style="background:${c(0)}; padding:20px;">
      <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${colors.map((h) => `<div style="width:20px;height:20px;border-radius:50%;background:${h};border:1px solid rgba(255,255,255,0.2)"></div>`).join("")}
        </div>
        <div>
          <div style="font-family:Cormorant Garamond,serif; font-size:22px; color:${Utils.getContrastColor(c(0))}; opacity:0.95; line-height:1.1; margin-bottom:6px">${App.currentPaletteName || "Palette"}</div>
          <div style="font-family:DM Mono,monospace; font-size:9px; color:${Utils.getContrastColor(c(0))}; opacity:0.5; letter-spacing:0.15em; text-transform:uppercase">COLOR PALETTE</div>
        </div>
      </div>
      <div style="display:flex; gap:4px; margin-top:12px;">
        ${colors.map((h) => `<div style="flex:1; height:40px; border-radius:8px; background:${h}; box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`).join("")}
      </div>
    </div>
  `;
}

// ─── History Panel ────────────────────────────────────────────

function renderHistoryPanel() {
  const list = document.getElementById("history-list");
  const empty = document.getElementById("history-empty");
  if (!list) return;

  list.innerHTML = "";

  if (App.history.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  App.history.forEach((entry) => {
    const item = createPaletteItem(entry, {
      showDelete: true,
      onLoad: () => {
        setPalette(entry.colors, entry.name, false);
        Utils.showToast(`Loaded "${entry.name}"`);
      },
      onDelete: () => {
        App.history = App.history.filter((h) => h.id !== entry.id);
        Storage.save();
        renderHistoryPanel();
      },
    });
    list.appendChild(item);
  });
}

// ─── Favorites Panel ──────────────────────────────────────────

function renderFavoritesPanel() {
  const list = document.getElementById("favorites-list");
  const empty = document.getElementById("favorites-empty");
  const count = document.getElementById("favorites-count");
  if (!list) return;

  list.innerHTML = "";

  if (count) count.textContent = App.favorites.length;

  if (App.favorites.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  App.favorites.forEach((entry) => {
    const item = createPaletteItem(entry, {
      showDelete: true,
      onLoad: () => {
        setPalette(entry.colors, entry.name, false);
        Utils.showToast(`Loaded "${entry.name}"`);
      },
      onDelete: () => {
        App.favorites = App.favorites.filter((f) => f.id !== entry.id);
        Storage.save();
        renderFavoritesPanel();
      },
    });
    list.appendChild(item);
  });
}

function createPaletteItem(entry, { showDelete, onLoad, onDelete }) {
  const item = document.createElement("div");
  item.className = "palette-history-item";
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.setAttribute("aria-label", `Load palette: ${entry.name}`);

  // Swatches
  const swatches = document.createElement("div");
  swatches.className = "history-swatches";
  entry.colors.forEach((hex) => {
    const s = document.createElement("div");
    s.className = "history-swatch";
    s.style.background = hex;
    swatches.appendChild(s);
  });

  // Meta
  const meta = document.createElement("div");
  meta.className = "history-meta";
  meta.innerHTML = `
    <div class="history-name">${entry.name}</div>
    <div class="history-time">${Utils.timeAgo(entry.timestamp)}</div>
  `;

  // Actions
  const actions = document.createElement("div");
  actions.className = "history-actions";

  if (showDelete) {
    const delBtn = document.createElement("button");
    delBtn.className = "history-action-btn";
    delBtn.innerHTML = "×";
    delBtn.setAttribute("aria-label", "Remove from list");
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      item.style.opacity = "0";
      item.style.transform = "translateX(20px)";
      item.style.transition = "all 0.3s ease";
      setTimeout(() => {
        onDelete();
      }, 300);
    });
    actions.appendChild(delBtn);
  }

  item.appendChild(swatches);
  item.appendChild(meta);
  item.appendChild(actions);

  item.addEventListener("click", onLoad);
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onLoad();
  });

  return item;
}

// ─── Color Modal ──────────────────────────────────────────────

function openColorModal(hex, name) {
  const modal = document.getElementById("color-modal");
  const swatch = document.getElementById("modal-swatch");
  const nameEl = document.getElementById("modal-color-name");
  const familyEl = document.getElementById("modal-color-family");
  const valuesEl = document.getElementById("modal-values");

  if (!modal) return;

  swatch.style.background = hex;
  nameEl.textContent = name;

  // Detect color family
  const hsl = Utils.rgbToHsl(Utils.hexToRgb(hex));
  let family = "Neutral";
  if (hsl.s > 20) {
    if (hsl.h < 30 || hsl.h >= 330) family = "Red";
    else if (hsl.h < 60) family = "Orange";
    else if (hsl.h < 90) family = "Yellow";
    else if (hsl.h < 170) family = "Green";
    else if (hsl.h < 260) family = "Blue";
    else if (hsl.h < 300) family = "Purple";
    else family = "Pink";
  }
  familyEl.textContent = family;

  // Value rows
  const formats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: Utils.formatRgb(hex) },
    { label: "HSL", value: Utils.formatHsl(hex) },
    { label: "OKLCH", value: Utils.formatOklch(hex) },
  ];

  valuesEl.innerHTML = "";
  formats.forEach(({ label, value }) => {
    const row = document.createElement("div");
    row.className = "modal-value-row";
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.setAttribute("aria-label", `Copy ${label}: ${value}`);
    row.innerHTML = `
      <span class="modal-value-label">${label}</span>
      <span class="modal-value-text">${value}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.4"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    `;
    row.addEventListener("click", async () => {
      await Utils.copyToClipboard(value);
      Utils.showToast(`Copied ${label}`, hex);
    });
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter") row.click();
    });
    valuesEl.appendChild(row);
  });

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeColorModal() {
  const modal = document.getElementById("color-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// ─── Mood Grid ────────────────────────────────────────────────

function renderMoodGrid() {
  const grid = document.getElementById("mood-grid");
  if (!grid) return;

  PaletteGenerator.MOODS.forEach((mood) => {
    const preview = mood.generate();

    const card = document.createElement("div");
    card.className = "mood-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Generate ${mood.label} palette`);

    const swatchRow = document.createElement("div");
    swatchRow.className = "mood-swatches";
    preview.slice(0, 4).forEach((hex) => {
      const s = document.createElement("div");
      s.className = "mood-swatch-mini";
      s.style.background = hex;
      swatchRow.appendChild(s);
    });

    const label = document.createElement("div");
    label.className = "mood-label";
    label.textContent = mood.label;

    card.appendChild(swatchRow);
    card.appendChild(label);

    card.addEventListener("click", () => {
      const colors = mood.generate();
      const name = mood.names[Utils.randomInt(0, mood.names.length - 1)];
      setPalette(colors, name);
      Utils.showToast(`${mood.emoji} ${name}`);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") card.click();
    });

    grid.appendChild(card);
  });
}

// ─── Color Library ────────────────────────────────────────────

function renderColorLibrary(filter = "") {
  const container = document.getElementById("color-library-container");
  if (!container) return;

  container.innerHTML = "";

  const lowerFilter = filter.toLowerCase();

  Utils.COLOR_LIBRARY.forEach((group) => {
    const filtered = group.colors.filter(
      (c) =>
        !filter ||
        c.name.toLowerCase().includes(lowerFilter) ||
        c.hex.toLowerCase().includes(lowerFilter),
    );

    if (!filtered.length) return;

    const groupEl = document.createElement("div");

    const title = document.createElement("div");
    title.className = "library-group-title";
    title.textContent = group.group;

    const swatches = document.createElement("div");
    swatches.className = "library-swatches";

    filtered.forEach((color) => {
      const s = document.createElement("div");
      s.className = "lib-swatch";
      s.style.background = color.hex;
      s.setAttribute("title", `${color.name} — ${color.hex}`);
      s.setAttribute("role", "button");
      s.setAttribute("tabindex", "0");
      s.setAttribute("aria-label", `${color.name}: ${color.hex}`);

      s.addEventListener("click", () => {
        ColorPicker.setHex(color.hex);
        const result = PaletteGenerator.fromColor(color.hex);
        setPalette(result.colors, `${color.name} — ${result.type}`);
        Utils.showToast(`${color.name}`, color.hex);
      });

      s.addEventListener("keydown", (e) => {
        if (e.key === "Enter") s.click();
      });

      swatches.appendChild(s);
    });

    groupEl.appendChild(title);
    groupEl.appendChild(swatches);
    container.appendChild(groupEl);
  });
}

// ─── Export Panel ─────────────────────────────────────────────

function showExportPanel() {
  const panel = document.getElementById("export-panel");
  if (panel) {
    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function hideExportPanel() {
  const panel = document.getElementById("export-panel");
  const codeBlock = document.getElementById("export-code-block");
  if (panel) panel.classList.add("hidden");
  if (codeBlock) codeBlock.classList.add("hidden");
}

// ─── Panel Toggle ─────────────────────────────────────────────

function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const isHidden = panel.classList.contains("hidden");

  ["history-panel", "favorites-panel", "export-panel"].forEach((id) => {
    const p = document.getElementById(id);
    if (p) p.classList.add("hidden");
  });

  if (isHidden) {
    panel.classList.remove("hidden");

    panel.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    panel.style.opacity = "0";
    panel.style.transform = "translateY(20px)";
    requestAnimationFrame(() => {
      panel.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      panel.style.opacity = "1";
      panel.style.transform = "translateY(0)";
    });
  }
}

// ─── Particle Background ─────────────────────────────────────

function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Utils.randomInRange(1, 3);
      this.speedX = Utils.randomInRange(-0.3, 0.3);
      this.speedY = Utils.randomInRange(-0.4, -0.1);
      this.opacity = Utils.randomInRange(0.05, 0.3);
      this.life = 0;
      this.maxLife = Utils.randomInRange(200, 400);

      // Color from current palette
      const palette = App.currentPalette;
      this.color = palette.length
        ? palette[Utils.randomInt(0, palette.length - 1)]
        : "#c9a96e";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      if (this.life > this.maxLife || this.y < -10) this.reset();
    }

    draw() {
      const progress = this.life / this.maxLife;
      const fade =
        progress < 0.1
          ? progress * 10
          : progress > 0.9
            ? (1 - progress) * 10
            : 1;

      ctx.save();
      ctx.globalAlpha = this.opacity * fade;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  init();
  animate();
}

// ─── Theme Toggle ─────────────────────────────────────────────

function initTheme() {
  const btn = document.getElementById("btn-theme");
  const html = document.documentElement;
  const iconMoon = btn?.querySelector(".icon-moon");
  const iconSun = btn?.querySelector(".icon-sun");

  const savedTheme = localStorage.getItem("cp_theme") || "dark";
  html.classList.toggle("light", savedTheme === "light");
  html.classList.toggle("dark", savedTheme === "dark");

  function updateIcons() {
    const isLight = html.classList.contains("light");
    if (iconMoon) iconMoon.classList.toggle("hidden", isLight);
    if (iconSun) iconSun.classList.toggle("hidden", !isLight);
  }

  updateIcons();

  btn?.addEventListener("click", () => {
    html.classList.toggle("light");
    html.classList.toggle("dark");
    const theme = html.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("cp_theme", theme);
    updateIcons();
  });
}

// ─── Preview Tabs ─────────────────────────────────────────────

function initPreviewTabs() {
  const tabs = document.querySelectorAll("[data-preview]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      App.previewMode = tab.dataset.preview;
      renderLivePreview(App.currentPalette);
    });
  });
}

// ─── Scroll to Picker ─────────────────────────────────────────

function initScrollButton() {
  const btn = document.getElementById("btn-scroll-to-picker");
  btn?.addEventListener("click", () => {
    document
      .getElementById("color-picker-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ─── Main Event Bindings ──────────────────────────────────────

function bindEvents() {
  // Surprise Me
  document.getElementById("btn-surprise")?.addEventListener("click", (e) => {
    const result = PaletteGenerator.surprisePalette();
    const name = PaletteGenerator.generateName();
    setPalette(result.colors, `${name} · ${result.type}`);
    Utils.showToast(`✦ ${name}`);
    Utils.createRipple(e.currentTarget, e);
  });

  // Favorite current palette
  document
    .getElementById("btn-favorite-current")
    ?.addEventListener("click", () => {
      if (!App.currentPalette.length) return;

      const id = Utils.uid();
      const entry = {
        id,
        colors: [...App.currentPalette],
        name: App.currentPaletteName,
        timestamp: Date.now(),
      };

      const already = App.favorites.find(
        (f) => f.colors.join() === entry.colors.join(),
      );
      if (already) {
        Utils.showToast("Already saved ♥");
        return;
      }

      App.favorites.unshift(entry);
      Storage.save();
      renderFavoritesPanel();

      const btn = document.getElementById("btn-favorite-current");
      btn?.classList.add("btn-favorited");
      setTimeout(() => btn?.classList.remove("btn-favorited"), 1500);

      Utils.showToast("Saved to favorites ♥", App.currentPalette[0]);
    });

  // Export button
  document.getElementById("btn-export")?.addEventListener("click", () => {
    showExportPanel();
  });

  document
    .getElementById("btn-close-export")
    ?.addEventListener("click", hideExportPanel);

  // Export format buttons
  document.querySelectorAll(".cp-export-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const format = btn.dataset.format;

      if (format === "png") {
        PaletteGenerator.exportPNG(App.currentPalette, App.currentPaletteName);
        Utils.showToast("PNG downloaded ↓");
        return;
      }

      const code = PaletteGenerator.exportPalette(App.currentPalette, format);
      const codeBlock = document.getElementById("export-code-block");
      const codePre = document.getElementById("export-code");

      if (codeBlock && codePre) {
        codePre.textContent = code;
        codeBlock.classList.remove("hidden");
      }
    });
  });

  // Copy export
  document
    .getElementById("btn-copy-export")
    ?.addEventListener("click", async () => {
      const code = document.getElementById("export-code")?.textContent;
      if (code) {
        await Utils.copyToClipboard(code);
        Utils.showToast("Copied to clipboard");
      }
    });

  // History panel
  document.getElementById("btn-history")?.addEventListener("click", () => {
    togglePanel("history-panel");
    renderHistoryPanel();
  });

  // Favorites panel
  document.getElementById("btn-favorites")?.addEventListener("click", () => {
    togglePanel("favorites-panel");
  });

  // Clear history
  document
    .getElementById("btn-clear-history")
    ?.addEventListener("click", () => {
      App.history = [];
      Storage.save();
      renderHistoryPanel();
      Utils.showToast("History cleared");
    });

  // Modal close
  document
    .getElementById("modal-close")
    ?.addEventListener("click", closeColorModal);
  document
    .getElementById("modal-backdrop")
    ?.addEventListener("click", closeColorModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeColorModal();
  });

  // Color search
  document.getElementById("color-search")?.addEventListener("input", (e) => {
    renderColorLibrary(e.target.value);
  });
}

// ─── Init ─────────────────────────────────────────────────────

function init() {
  // Load persisted data
  Storage.load();

  // Init theme
  initTheme();

  // Init particle canvas
  initParticles();

  // Init color picker
  ColorPicker.init((hex, alpha) => {
    // Generate palette from picked color
    const result = PaletteGenerator.fromColor(hex);
    const name = PaletteGenerator.generateName();
    setPalette(result.colors, `${name} · ${result.type}`);
  });

  // Render mood grid
  renderMoodGrid();

  // Render color library
  renderColorLibrary();

  // Init preview tabs
  initPreviewTabs();

  // Bind events
  bindEvents();

  // Scroll button
  initScrollButton();

  // Initial palette: surprise
  const result = PaletteGenerator.surprisePalette();
  const name = PaletteGenerator.generateName();
  setPalette(result.colors, `${name} · ${result.type}`, false);

  // Render panels
  renderHistoryPanel();
  renderFavoritesPanel();

  // Entrance animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.6s ease";
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
}
function renderContrastChecker(colors) {
  const container = document.getElementById("contrast-checker");
  if (!container) return;
  container.innerHTML = "";

  colors.forEach((hex, i) => {
    const isLight = Utils.getLuminance(hex) > 0.179;
    const recommendedText = isLight ? "Black text" : "White text";
    const status = isLight
      ? "✅ Good for light backgrounds"
      : "✅ Good for dark backgrounds";

    const div = document.createElement("div");
    div.className = `px-3 py-1 rounded-lg border ${isLight ? "border-gray-300 bg-white text-black" : "border-gray-700 bg-black text-white"}`;
    div.innerHTML = `
      <span style="color:${hex};">■</span> 
      ${hex} 
      <span class="opacity-70">→ ${recommendedText}</span>
    `;
    div.title = status;
    container.appendChild(div);
  });
}

// Boot
document.addEventListener("DOMContentLoaded", init);
