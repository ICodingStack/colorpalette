/**
 * ColorPalette — color-picker.js
 * Advanced canvas-based color picker with smooth dragging + fixed jitter
 */

"use strict";

const ColorPicker = (() => {
  let state = {
    hue: 200,
    saturation: 70,
    value: 85,
    alpha: 1,
    hex: "#2ab5d4",
    activeTab: "hex",
  };

  let dragging = { spectrum: false, hue: false, alpha: false };
  let els = {};
  let onChangeCb = null;
  let rafId = null;

  function init(onChange) {
    onChangeCb = onChange;

    els = {
      spectrumCanvas: document.getElementById("spectrum-canvas"),
      spectrumCursor: document.getElementById("spectrum-cursor"),
      hueCanvas: document.getElementById("hue-canvas"),
      hueThumb: document.getElementById("hue-thumb"),
      alphaCanvas: document.getElementById("alpha-canvas"),
      alphaThumb: document.getElementById("alpha-thumb"),
      preview: document.getElementById("color-preview-swatch"),
      inputFields: document.getElementById("color-input-fields"),
      tabs: document.querySelectorAll(".cp-tab[data-tab]"),
    };

    // Initial draw
    drawSpectrum();
    drawHueSlider();
    drawAlphaSlider();
    updateCursors();
    renderInputFields();

    // Events
    els.spectrumCanvas.addEventListener("mousedown", startSpectrumDrag);
    els.spectrumCanvas.addEventListener("touchstart", startSpectrumDrag, {
      passive: false,
    });

    els.hueCanvas.addEventListener("mousedown", startHueDrag);
    els.hueCanvas.addEventListener("touchstart", startHueDrag, {
      passive: false,
    });

    els.alphaCanvas.addEventListener("mousedown", startAlphaDrag);
    els.alphaCanvas.addEventListener("touchstart", startAlphaDrag, {
      passive: false,
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchend", stopDragging);

    // Tab switching
    els.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        els.tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        state.activeTab = tab.dataset.tab;
        renderInputFields();
      });
    });

    // Preview copy
    els.preview.addEventListener("click", () => {
      Utils.copyToClipboard(state.hex);
      Utils.showToast(`Copied ${state.hex}`, state.hex);
      Utils.createRipple(els.preview, {
        clientX: els.preview.getBoundingClientRect().left + 30,
        clientY: els.preview.getBoundingClientRect().top + 30,
      });
    });

    setHex("#3a87e0");
  }

  // Drag Start
  function startSpectrumDrag(e) {
    dragging.spectrum = true;
    handleSpectrumDrag(e);
  }
  function startHueDrag(e) {
    dragging.hue = true;
    handleHueDrag(e);
  }
  function startAlphaDrag(e) {
    dragging.alpha = true;
    handleAlphaDrag(e);
  }

  function stopDragging() {
    dragging.spectrum = dragging.hue = dragging.alpha = false;
  }

  function onMouseMove(e) {
    if (dragging.spectrum) handleSpectrumDrag(e);
    if (dragging.hue) handleHueDrag(e);
    if (dragging.alpha) handleAlphaDrag(e);
  }

  function onTouchMove(e) {
    if (dragging.spectrum) handleSpectrumDrag(e.touches[0]);
    if (dragging.hue) handleHueDrag(e.touches[0]);
    if (dragging.alpha) handleAlphaDrag(e.touches[0]);
    e.preventDefault();
  }

  // Drag Handlers
  function handleSpectrumDrag(e) {
    const rect = els.spectrumCanvas.getBoundingClientRect();
    const x = Utils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const y = Utils.clamp((e.clientY - rect.top) / rect.height, 0, 1);

    state.saturation = Math.round(x * 100);
    state.value = Math.round((1 - y) * 100);
    updateFromHsv();
  }

  function handleHueDrag(e) {
    const rect = els.hueCanvas.getBoundingClientRect();
    const x = Utils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
    state.hue = Math.round(x * 360);

    drawSpectrum();
    drawAlphaSlider();
    updateFromHsv();
  }

  function handleAlphaDrag(e) {
    const rect = els.alphaCanvas.getBoundingClientRect();
    state.alpha = Utils.clamp((e.clientX - rect.left) / rect.width, 0, 1);
    updateFromHsv();
  }

  // State Update with RAF (لمنع الاهتزاز)
  function updateFromHsv() {
    const rgb = Utils.hsvToRgb({
      h: state.hue,
      s: state.saturation,
      v: state.value,
    });
    state.hex = Utils.rgbToHex(rgb);

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateCursors();
      updatePreview();
      renderInputFields();
      if (onChangeCb) onChangeCb(state.hex, state.alpha);
    });
  }

  function updatePreview() {
    const rgb = Utils.hexToRgb(state.hex);
    els.preview.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${state.alpha})`;
  }

  // Canvas Drawing Functions
  function drawSpectrum() {
    const canvas = els.spectrumCanvas;
    const ctx = canvas.getContext("2d");
    const w = canvas.width,
      h = canvas.height;

    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, "#ffffff");
    gradH.addColorStop(1, `hsl(${state.hue}, 100%, 50%)`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, h);

    const gradV = ctx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, "transparent");
    gradV.addColorStop(1, "#000000");
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, h);
  }

  function drawHueSlider() {
    const canvas = els.hueCanvas;
    const ctx = canvas.getContext("2d");
    const w = canvas.width,
      h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    const stops = [0, 60, 120, 180, 240, 300, 360];
    stops.forEach((deg) =>
      grad.addColorStop(deg / 360, `hsl(${deg}, 100%, 50%)`),
    );

    ctx.fillStyle = grad;
    const r = h / 2;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.lineTo(w, h - r);
    ctx.arcTo(w, h, w - r, h, r);
    ctx.lineTo(r, h);
    ctx.arcTo(0, h, 0, h - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();
  }

  function drawAlphaSlider() {
    const canvas = els.alphaCanvas;
    const ctx = canvas.getContext("2d");
    const w = canvas.width,
      h = canvas.height;

    // Checkered background
    const size = 6;
    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        ctx.fillStyle = (x / size + y / size) % 2 === 0 ? "#ccc" : "#999";
        ctx.fillRect(x, y, size, size);
      }
    }

    const rgb = Utils.hslToRgb({ h: state.hue, s: state.saturation, l: 50 });
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
    grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
    ctx.fillStyle = grad;

    const r = h / 2;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.lineTo(w, h - r);
    ctx.arcTo(w, h, w - r, h, r);
    ctx.lineTo(r, h);
    ctx.arcTo(0, h, 0, h - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();
  }

  function updateCursors() {
    // Spectrum
    const sRect = els.spectrumCanvas.getBoundingClientRect();
    const sx = (state.saturation / 100) * sRect.width;
    const sy = ((100 - state.value) / 100) * sRect.height;
    els.spectrumCursor.style.left = `${sx}px`;
    els.spectrumCursor.style.top = `${sy}px`;
    els.spectrumCursor.style.borderColor =
      state.value > 50 ? "white" : "rgba(255,255,255,0.6)";

    // Hue
    const huePercent = state.hue / 360;
    els.hueThumb.style.left = `${huePercent * els.hueCanvas.getBoundingClientRect().width}px`;
    els.hueThumb.style.background = `hsl(${state.hue}, 100%, 50%)`;

    // Alpha
    const alphaPercent = state.alpha;
    els.alphaThumb.style.left = `${alphaPercent * els.alphaCanvas.getBoundingClientRect().width}px`;
    els.alphaThumb.style.background = state.hex;
  }

  // Input Fields (مختصرة هنا - انسخ باقي الدوال من نسختك القديمة إذا لزم الأمر)
  function renderInputFields() {
    const container = els.inputFields;
    container.innerHTML = "";

    switch (state.activeTab) {
      case "hex":
        renderHexInput(container);
        break;
      case "rgb":
        renderRgbInputs(container);
        break;
      case "hsl":
        renderHslInputs(container);
        break;
      case "oklch":
        renderOklchInputs(container);
        break;
    }
    updatePreview();
  }

  function makeInput(val, label, onInput, onBlur) {
    const wrap = document.createElement("div");
    wrap.className = "cp-input-group";
    const lbl = document.createElement("span");
    lbl.className = "cp-input-label";
    lbl.textContent = label;
    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "cp-input";
    inp.value = val;
    inp.addEventListener("input", (e) => onInput(e.target.value));
    inp.addEventListener("blur", (e) => onBlur && onBlur(e.target.value));
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") inp.blur();
    });
    wrap.append(lbl, inp);
    return wrap;
  }

  function renderHexInput(container) {
    container.appendChild(
      makeInput(
        state.hex,
        "HEX",
        (val) => {
          const clean = val.startsWith("#") ? val : "#" + val;
          if (/^#[0-9a-f]{6}$/i.test(clean)) setHex(clean);
        },
        (val) => {
          const clean = val.startsWith("#") ? val : "#" + val;
          if (/^#[0-9a-f]{6}$/i.test(clean)) setHex(clean);
        },
      ),
    );
  }

  function renderRgbInputs(container) {
    const { r, g, b } = Utils.hexToRgb(state.hex);
    ["r", "g", "b"].forEach((ch, i) => {
      const val = [r, g, b][i];
      container.appendChild(
        makeInput(String(Math.round(val)), ch.toUpperCase(), (v) => {
          const n = parseInt(v);
          if (!isNaN(n) && n >= 0 && n <= 255) {
            const cur = Utils.hexToRgb(state.hex);
            cur[ch] = n;
            setHex(Utils.rgbToHex(cur));
          }
        }),
      );
    });
  }

  function renderHslInputs(container) {
    const { h, s, l } = Utils.rgbToHsl(Utils.hexToRgb(state.hex));
    [
      { label: "H", val: Math.round(h), min: 0, max: 360, key: "h" },
      { label: "S", val: Math.round(s), min: 0, max: 100, key: "s" },
      { label: "L", val: Math.round(l), min: 0, max: 100, key: "l" },
    ].forEach(({ label, val, min, max, key }) => {
      container.appendChild(
        makeInput(String(val), label, (v) => {
          const n = parseFloat(v);
          if (!isNaN(n) && n >= min && n <= max) {
            const cur = Utils.rgbToHsl(Utils.hexToRgb(state.hex));
            cur[key] = n;
            setHex(Utils.rgbToHex(Utils.hslToRgb(cur)));
          }
        }),
      );
    });
  }

  function renderOklchInputs(container) {
    const { l, c, h } = Utils.rgbToOklch(Utils.hexToRgb(state.hex));
    [
      { label: "L", val: l, min: 0, max: 100, key: "l" },
      { label: "C", val: c, min: 0, max: 40, key: "c" },
      { label: "H", val: h, min: 0, max: 360, key: "h" },
    ].forEach(({ label, val, key }) => {
      container.appendChild(
        makeInput(String(val), label, (v) => {
          const n = parseFloat(v);
          if (!isNaN(n)) {
            const cur = Utils.rgbToOklch(Utils.hexToRgb(state.hex));
            cur[key] = n;
            try {
              const rgb = Utils.oklchToRgb(cur);
              setHex(Utils.rgbToHex(rgb));
            } catch (e) {}
          }
        }),
      );
    });
  }

  // Public API
  function setHex(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return;
    state.hex = hex;
    const rgb = Utils.hexToRgb(hex);
    const hsv = Utils.rgbToHsv(rgb);
    state.hue = hsv.h;
    state.saturation = hsv.s;
    state.value = hsv.v;

    drawSpectrum();
    drawAlphaSlider();
    updateCursors();
    renderInputFields();

    if (onChangeCb) onChangeCb(state.hex, state.alpha);
  }

  function getHex() {
    return state.hex;
  }
  function getAlpha() {
    return state.alpha;
  }
  function getState() {
    return { ...state };
  }

  window.addEventListener("resize", () => {
    drawSpectrum();
    drawHueSlider();
    drawAlphaSlider();
    updateCursors();
  });

  return { init, setHex, getHex, getAlpha, getState };
})();
