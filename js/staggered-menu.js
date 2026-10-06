/* =========================================================
   StaggeredMenu — vanilla JS port
   React Bits "StaggeredMenu" adapted for plain HTML/CSS/JS
   Requires: GSAP (loaded via CDN in the HTML)
   ========================================================= */

function createStaggeredMenu(rootEl, options = {}) {
  const {
    position = 'right',
    colors = ['#B497CF', '#5227FF'],
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    accentColor = '#F7D87F',
    menuButtonColor = '#fff',
    openMenuButtonColor = '#fff',
    changeMenuColorOnOpen = true,
    closeOnClickAway = true,
    onMenuOpen = null,
    onMenuClose = null,
  } = options;

  let open = false;
  let busy = false;
  let openTl = null;
  let closeTween = null;
  let spinTween = null;
  let textCycleAnim = null;
  let colorTween = null;
  let itemEntranceTween = null;

  rootEl.classList.add('staggered-menu-wrapper', 'fixed-wrapper');
  rootEl.setAttribute('data-position', position);
  if (accentColor) rootEl.style.setProperty('--sm-accent', accentColor);

  /* ── Build HTML ── */
  const layerColors = (() => {
    const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
    let arr = [...raw];
    if (arr.length >= 3) { const mid = Math.floor(arr.length / 2); arr.splice(mid, 1); }
    return arr;
  })();

  rootEl.innerHTML = `
    <div class="sm-prelayers" aria-hidden="true">
      ${layerColors.map(c => `<div class="sm-prelayer" style="background:${c}"></div>`).join('')}
    </div>
    <header class="staggered-menu-header" aria-label="Main navigation header">
      <div class="sm-logo" aria-label="Logo">
        <img class="sm-logo-img" src="../img/logo.jpg" alt="El Tío Sam Chifa" draggable="false">
        <span class="sm-logo-text">El Tío Sam<small>Chifa</small></span>
      </div>
      <button class="sm-toggle" aria-label="Open menu" aria-expanded="false" type="button">
        <span class="sm-toggle-textWrap" aria-hidden="true">
          <span class="sm-toggle-textInner">
            <span class="sm-toggle-line">Menu</span>
            <span class="sm-toggle-line">Close</span>
          </span>
        </span>
        <span class="sm-icon" aria-hidden="true">
          <span class="sm-icon-line"></span>
          <span class="sm-icon-line sm-icon-line-v"></span>
        </span>
      </button>
    </header>
    <aside class="staggered-menu-panel" aria-hidden="true">
      <div class="sm-panel-inner">
        <ul class="sm-panel-list" role="list" ${displayItemNumbering ? 'data-numbering' : ''}>
          ${items.map((it, idx) => `
            <li class="sm-panel-itemWrap">
              <a class="sm-panel-item" href="${it.link}" aria-label="${it.ariaLabel || it.label}" data-index="${idx + 1}">
                <span class="sm-panel-itemLabel">${it.label}</span>
              </a>
            </li>
          `).join('')}
        </ul>
        ${displaySocials && socialItems.length ? `
          <div class="sm-socials" aria-label="Social links">
            <h3 class="sm-socials-title">Socials</h3>
            <ul class="sm-socials-list" role="list">
              ${socialItems.map(s => `
                <li class="sm-socials-item">
                  <a href="${s.link}" target="_blank" rel="noopener noreferrer" class="sm-socials-link">${s.label}</a>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </aside>
  `;

  /* ── Refs ── */
  const panel = rootEl.querySelector('.staggered-menu-panel');
  const preContainer = rootEl.querySelector('.sm-prelayers');
  const preLayers = Array.from(rootEl.querySelectorAll('.sm-prelayer'));
  const plusH = rootEl.querySelector('.sm-icon-line');
  const plusV = rootEl.querySelector('.sm-icon-line-v');
  const icon = rootEl.querySelector('.sm-icon');
  const textInner = rootEl.querySelector('.sm-toggle-textInner');
  const textWrap = rootEl.querySelector('.sm-toggle-textWrap');
  const toggleBtn = rootEl.querySelector('.sm-toggle');

  /* ── Init GSAP positions ── */
  const offscreen = position === 'left' ? -100 : 100;
  gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
  if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });
  gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
  gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
  gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
  gsap.set(textInner, { yPercent: 0 });
  gsap.set(toggleBtn, { color: menuButtonColor });

  /* ── Animate text cycling ── */
  function animateText(opening) {
    textCycleAnim?.kill();
    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    textInner.innerHTML = seq.map(l => `<span class="sm-toggle-line">${l}</span>`).join('');
    gsap.set(textInner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnim = gsap.to(textInner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }

  /* ── Animate icon ── */
  function animateIconOpen() {
    spinTween?.kill();
    spinTween = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
  }
  function animateIconClose() {
    spinTween?.kill();
    spinTween = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
  }

  /* ── Animate button color ── */
  function animateColor(isOpen) {
    colorTween?.kill();
    if (changeMenuColorOnOpen) {
      const targetColor = isOpen ? openMenuButtonColor : menuButtonColor;
      colorTween = gsap.to(toggleBtn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.set(toggleBtn, { color: menuButtonColor });
    }
  }

  /* ── Build open timeline ── */
  function buildOpenTimeline() {
    openTl?.kill();
    closeTween?.kill();
    closeTween = null;
    itemEntranceTween?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    preLayers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = preLayers.length ? (preLayers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (preLayers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(itemEls, {
        yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out',
        stagger: { each: 0.1, from: 'start' }
      }, itemsStart);
      if (numberEls.length) {
        tl.to(numberEls, {
          duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1,
          stagger: { each: 0.08, from: 'start' }
        }, itemsStart + 0.1);
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' }
        }, socialsStart + 0.04);
      }
    }

    openTl = tl;
    return tl;
  }

  /* ── Play open ── */
  function playOpen() {
    if (busy) return;
    busy = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { busy = false; });
      tl.play(0);
    } else {
      busy = false;
    }
  }

  /* ── Play close ── */
  function playClose() {
    openTl?.kill();
    openTl = null;
    itemEntranceTween?.kill();

    const all = [...preLayers, panel];
    closeTween?.kill();
    closeTween = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busy = false;
      }
    });
  }

  /* ── Toggle ── */
  function toggleMenu() {
    open = !open;
    rootEl.setAttribute('data-open', open || '');
    panel.setAttribute('aria-hidden', !open);
    toggleBtn.setAttribute('aria-expanded', open);
    toggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    if (open) {
      onMenuOpen?.();
      playOpen();
      window.lockBodyScroll?.();
    } else {
      onMenuClose?.();
      playClose();
      window.unlockBodyScroll?.();
    }
    open ? animateIconOpen() : animateIconClose();
    animateColor(open);
    animateText(open);
  }

  function closeMenu() {
    if (!open) return;
    open = false;
    rootEl.setAttribute('data-open', '');
    panel.setAttribute('aria-hidden', true);
    toggleBtn.setAttribute('aria-expanded', false);
    toggleBtn.setAttribute('aria-label', 'Open menu');
    onMenuClose?.();
    playClose();
    window.unlockBodyScroll?.();
    animateIconClose();
    animateColor(false);
    animateText(false);
  }

  /* ── Events ── */
  toggleBtn.addEventListener('click', toggleMenu);

  if (closeOnClickAway) {
    document.addEventListener('pointerdown', (e) => {
      if (open && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ── Close on nav link click ── */
  panel.querySelectorAll('.sm-panel-item').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  return { toggle: toggleMenu, close: closeMenu, isOpen: () => open };
}
