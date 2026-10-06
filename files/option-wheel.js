/* =========================================================
   OptionWheel — vanilla JS port
   React Bits "OptionWheel" adapted for plain HTML/CSS/JS
   ========================================================= */

function createOptionWheel(rootEl, options = {}) {
  const {
    items = [],
    defaultSelected = 0,
    textColor = '#a6a6a6',
    activeColor = '#ffffff',
    side = 'left',
    fontSize = 3,
    spacing = 1.4,
    curve = 1,
    tilt = 6,
    blur = 2,
    fade = 0.25,
    minOpacity = 0.05,
    smoothing = 200,
    inset = 80,
    loop = false,
    draggable = true,
    onChange = null,
  } = options;

  const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  const cfg = {
    count: items.length,
    items,
    rowH: Math.max(fontSize * spacing * remPx, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
  };

  let pos = defaultSelected;
  let target = defaultSelected;
  let rafId = null;
  let lastTime = 0;
  let selectedIdx = defaultSelected;
  let wheelTimer = null;
  let drag = null;
  let dragMoved = false;

  rootEl.classList.add('option-wheel');
  if (side === 'right') rootEl.classList.add('option-wheel--right');
  rootEl.setAttribute('role', 'listbox');
  rootEl.setAttribute('tabindex', '0');
  rootEl.setAttribute('aria-label', 'Option wheel');
  rootEl.style.setProperty('--ow-text-color', textColor);
  rootEl.style.setProperty('--ow-active-color', activeColor);
  rootEl.style.setProperty('--ow-font-size', `${fontSize}rem`);
  rootEl.style.setProperty('--ow-inset', `${inset}px`);

  rootEl.innerHTML = '';
  const itemEls = items.map((label, i) => {
    const el = document.createElement('div');
    el.className = 'option-wheel__item' + (i === defaultSelected ? ' option-wheel__item--selected' : '');
    el.setAttribute('role', 'option');
    el.setAttribute('aria-selected', i === defaultSelected ? 'true' : 'false');
    el.textContent = label;
    el.addEventListener('click', () => onItemClick(i));
    rootEl.appendChild(el);
    return el;
  });

  function runFrame(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const tau = Math.max(cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let next = pos + (target - pos) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    pos = next;

    const n = cfg.count;
    const mirror = cfg.side === 'right' ? -1 : 1;
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;

    for (let i = 0; i < n; i++) {
      const el = itemEls[i];
      if (!el) continue;
      let d = i - next;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const dist = Math.abs(d);
      let x = 0;
      let y = d * cfg.rowH;
      let rot = 0;
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
        rot = (mirror * ang * 180) / Math.PI;
      }
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
    }

    rafId = settled ? null : requestAnimationFrame(runFrame);
  }

  function startLoop() {
    if (rafId != null) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(runFrame);
  }

  function applyTarget(value, snap) {
    let v = value;
    if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
    if (snap) v = Math.round(v);
    target = v;
    const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
    if (idx !== selectedIdx) {
      selectedIdx = idx;
      itemEls.forEach((el, i) => {
        const sel = i === idx;
        el.classList.toggle('option-wheel__item--selected', sel);
        el.setAttribute('aria-selected', sel ? 'true' : 'false');
      });
      if (onChange) onChange(idx, cfg.items[idx]);
    }
    startLoop();
  }

  function onItemClick(index) {
    if (dragMoved) return;
    const cur = target;
    let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
    if (cfg.loop && cfg.count > 1) {
      if (d > cfg.count / 2) d -= cfg.count;
      else if (d < -cfg.count / 2) d += cfg.count;
    }
    applyTarget(cur + d, true);
  }

  /* ── Limpieza: todos los listeners del root usan este signal,
     así destroy() los remueve de verdad y la rueda se puede
     reconstruir sobre el mismo elemento sin duplicar handlers ── */
  const abortCtrl = new AbortController();
  const { signal } = abortCtrl;

  /* ── Wheel / touchpad ── */
  rootEl.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
    const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
    applyTarget(target + step, false);
    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => applyTarget(target, true), 140);
  }, { passive: false, signal });

  /* ── Pointer drag ── */
  rootEl.addEventListener('pointerdown', e => {
    if (!cfg.draggable) return;
    drag = { y: e.clientY, start: target, id: e.pointerId };
    dragMoved = false;
    rootEl.classList.add('option-wheel--dragging');
  }, { signal });

  rootEl.addEventListener('pointermove', e => {
    if (!drag) return;
    const dy = e.clientY - drag.y;
    if (!dragMoved && Math.abs(dy) > 4) {
      dragMoved = true;
      rootEl.setPointerCapture(drag.id);
    }
    if (dragMoved) applyTarget(drag.start - dy / cfg.rowH, false);
  }, { signal });

  rootEl.addEventListener('pointerup', () => {
    if (!drag) return;
    drag = null;
    rootEl.classList.remove('option-wheel--dragging');
    if (dragMoved) applyTarget(target, true);
  }, { signal });
  rootEl.addEventListener('pointercancel', () => {
    drag = null;
    rootEl.classList.remove('option-wheel--dragging');
  }, { signal });

  /* ── Keyboard ── */
  rootEl.addEventListener('keydown', e => {
    let delta = null;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
    if (delta == null) return;
    e.preventDefault();
    applyTarget(Math.round(target) + delta, true);
  }, { signal });

  /* ── Init ── */
  applyTarget(defaultSelected, false);

  return {
    select(index) { applyTarget(index, true); },
    getSelected() { return selectedIdx; },
    destroy() {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (wheelTimer) clearTimeout(wheelTimer);
      abortCtrl.abort();
    }
  };
}
