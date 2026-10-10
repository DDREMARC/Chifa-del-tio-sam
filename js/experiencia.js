/* =========================================================
   El Tío Sam Chifa — experiencia.js (solo la portada, index.html)
   1. Monta el mundo scroll-world (vídeo pre-renderizado, scrubbeado por scroll)
   2. Hero: título letra por letra que se desarma con el primer scroll
   3. Telón: la carta sube sobre el último cuadro de la película
   4. Los clásicos: máscara + parallax asimétrico + distorsión WebGL
   5. Testimonio palabra a palabra · CTA con disco dorado
   Lo común (menú, Lenis, anclas, split, botón magnético) viene de sitio.js.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. Assets — pon en true cada bloque cuando copies los archivos
        renderizados (ver produccion/PROPUESTA.md → "Integración")
  --------------------------------------------------------- */
  const ASSETS = {
    stills: false, // assets/world/<id>.webp            (false = posters SVG provisionales)
    video: false,  // assets/video/<id>.mp4 + conn1..conn4.mp4
    mobile: false, // assets/video/<id>-m.mp4, conn<i>-m.mp4, assets/world/<id>-m.webp (cadena 9:16)
  };
  const BASE = '../assets/';

  const TS = window.TioSam || {};
  const reduce = !!TS.reduce;
  const coarse = !!TS.coarse;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const split = TS.split || (() => []);

  /* Escenas del recorrido (orden = orden de la película).
     scroll = alto de scroll en viewports; linger = la cámara "se posa" a mitad de escena. */
  const SCENES = [
    { id: 'barrio', label: 'El barrio', accent: '#F7D87F', scroll: 1.6, linger: 0.35 }, // copy = hero
    {
      id: 'mercado', label: 'El mercado', accent: '#E9B949', scroll: 1.3,
      eyebrow: 'Ingredientes del día', title: 'Todo empieza en el mercado.',
      body: 'Kion, cebolla china, sillao y arroz: la base de todo buen chifa.',
      tags: ['Kion', 'Cebolla china', 'Sillao'],
    },
    {
      id: 'wok', label: 'El wok', accent: '#FF7A3D', scroll: 1.6, linger: 0.45,
      eyebrow: 'Preparado al momento', title: 'Wok a fuego vivo.',
      body: 'Cada plato se saltea al momento, a fuego alto, y llega humeante a tu mesa.',
      tags: ['Al momento', 'Fuego alto'],
    },
    {
      id: 'salon', label: 'El salón', accent: '#FF6B5A', scroll: 1.3,
      eyebrow: 'Sabor de barrio', title: 'Con alma de hogar.',
      body: 'Mesas para compartir, platos al centro y la familia alrededor.',
      tags: ['Para compartir'],
    },
    {
      id: 'plato', label: 'El plato', accent: '#F7D87F', scroll: 1.8, linger: 0.5,
      eyebrow: 'El clásico de dos mundos', title: 'Y aterriza el aeropuerto.',
      body: 'Chaufa y tallarín saltado en un solo plato. En Jr. Cantón 245, Barrios Altos.',
      tags: ['Martes a domingo', '12:00 – 22:00'],
      cta: {
        primary: { label: 'Ver los clásicos', href: '#clasicos' },
        secondary: { label: 'Pedir por WhatsApp', href: 'https://wa.me/51987654321' },
      },
    },
  ];

  const worldEl = document.getElementById('world');

  /* ---------------------------------------------------------
     1. Carta rápida (FlowingMenu). Sale de menu-data.js, la misma
        fuente que carta.html: nombres y precios siempre coinciden.
        Se pinta ANTES de que main.js corra setupFlowingMenu().
  --------------------------------------------------------- */
  // Una fila por categoría: no depende de nombres de platos concretos,
  // así sigue funcionando mientras la carta tenga marcadores.
  function filasCarta() {
    if (typeof MENU_ITEMS === 'undefined' || typeof MENU_CATEGORIES === 'undefined') return [];
    return MENU_CATEGORIES.map((c) => {
      const items = MENU_ITEMS.filter((i) => i.cat === c.id);
      if (!items.length) return null;
      const conFoto = items.find((i) => i.img);
      return {
        name: c.label,
        price: items.length + (items.length === 1 ? ' plato' : ' platos'),
        src: conFoto ? conFoto.img : '',
        short: c.label,
      };
    }).filter(Boolean);
  }

  function renderFlowing() {
    const nav = document.getElementById('flowingMenu');
    if (!nav) return;
    const arrow = '<svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
    nav.innerHTML = filasCarta().map(({ name, price, src, short }) => {
      const img = src ? `<div class="marquee__img" style="background-image:url('${src}')"></div>` : '';
      const part = `<div class="marquee__part"><span>${short}</span>${img}<div class="marquee__dot"></div></div>`;
      return `<div class="menu__item">
        <a class="menu__item-link" href="carta.html">
          ${src ? `<span class="item-emoji"><img src="${src}" alt="" loading="lazy"></span>` : ''}
          <span class="item-info"><span class="item-name">${name}</span><span class="item-price">${price}</span></span>
          ${arrow}
        </a>
        <div class="marquee" aria-hidden="true"><div class="marquee__inner-wrap"><div class="marquee__inner">${part.repeat(6)}</div></div></div>
      </div>`;
    }).join('');
  }

  /* ---------------------------------------------------------
     2. Mundo scroll-world
  --------------------------------------------------------- */
  function mountWorld() {
    if (!worldEl || typeof mountScrollWorld !== 'function') return;
    const sections = SCENES.map((s) => {
      const c = Object.assign({}, s);
      c.still = BASE + 'world/' + s.id + (ASSETS.stills ? '.webp' : '.svg');
      // Sin clip el motor anima el still (zoom suave); nunca le pasamos una URL que no exista.
      if (ASSETS.video) c.clip = BASE + 'video/' + s.id + '.mp4';
      if (ASSETS.mobile) {
        c.clipMobile = BASE + 'video/' + s.id + '-m.mp4';
        c.stillMobile = BASE + 'world/' + s.id + '-m.webp';
      }
      return c;
    });
    const conn = (suffix) => SCENES.slice(1).map((_, i) => BASE + 'video/conn' + (i + 1) + suffix + '.mp4');

    mountScrollWorld(worldEl, {
      nav: false,
      hint: 'Desliza para entrar al barrio',
      diveScroll: 1.3,
      connScroll: 0.9,
      sections,
      connectors: ASSETS.video ? conn('') : [],
      connectorsMobile: ASSETS.mobile ? conn('-m') : [],
    });
  }

  /* Estado compartido entre GSAP (revelado/hover) y el renderer WebGL */
  const imgState = new Map();
  function stateOf(img) {
    if (!imgState.has(img)) imgState.set(img, { reveal: 1, hover: 0, hoverT: 0, mx: 0.5, my: 0.5, tmx: 0.5, tmy: 0.5 });
    return imgState.get(img);
  }

  /* ---------------------------------------------------------
     2. Hero — entra letra por letra; el primer scroll lo desarma
  --------------------------------------------------------- */
  function initHero() {
    const hero = document.querySelector('.xp-hero');
    if (!hero) return;
    const inner = hero.querySelector('.xp-hero__inner');
    const end = () => window.innerHeight * 0.9;

    if (reduce) {
      gsap.to(inner, { opacity: 0, ease: 'none', scrollTrigger: { start: 0, end, scrub: true } });
      ScrollTrigger.create({
        start: end, end: 'max',
        onEnter: () => { hero.style.visibility = 'hidden'; },
        onLeaveBack: () => { hero.style.visibility = ''; },
      });
      return;
    }

    const title = hero.querySelector('[data-split]');
    const words = split(title, 'chars');
    gsap.set(words, { transformPerspective: 700 });

    // Intro (al cargar): las letras suben desde su máscara
    gsap.from(title.querySelectorAll('.c'), { yPercent: 115, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.035, delay: 0.35 });
    gsap.from([hero.querySelector('.xp-hero__eyebrow'), hero.querySelector('.xp-hero__tag')],
      { opacity: 0, y: 16, duration: 0.9, ease: 'power3.out', stagger: 0.15, delay: 0.7 });

    // Scroll: palabras, sello y bloque se desarman mientras la cámara entra
    gsap.timeline({ scrollTrigger: { start: 0, end, scrub: 0.6 } })
      .to(words, { yPercent: -130, rotationX: 75, opacity: 0, stagger: 0.07, ease: 'power2.in' }, 0)
      .to(hero.querySelector('.xp-hero__sealwrap'), { scale: 0.3, rotation: -120, opacity: 0, ease: 'power2.in' }, 0)
      .to(inner, { y: -70, opacity: 0, ease: 'power1.in' }, 0.15)
      .set(hero, { visibility: 'hidden' });
  }

  /* ---------------------------------------------------------
     5. Telón — la carta sube sobre el último cuadro de la película
  --------------------------------------------------------- */
  function initCurtain() {
    const after = document.querySelector('.after-world');
    if (!after || !worldEl) return;
    ScrollTrigger.create({
      trigger: after,
      start: 'top bottom',
      end: 'top top',
      onUpdate(self) {
        worldEl.style.setProperty('--curtain', self.progress.toFixed(4));
        worldEl.classList.toggle('sw-hold-last', self.progress > 0);
      },
      onLeave: () => worldEl.classList.add('is-covered'),
      onEnterBack: () => worldEl.classList.remove('is-covered'),
      onLeaveBack() {
        worldEl.style.setProperty('--curtain', '0');
        worldEl.classList.remove('sw-hold-last');
      },
    });
  }

  /* ---------------------------------------------------------
     6. Los clásicos — máscara, parallax asimétrico y captions
  --------------------------------------------------------- */
  function initClasicos() {
    const h2 = document.querySelector('.clasicos__head h2');
    if (!h2) return;
    if (reduce) return;

    split(h2, 'chars');
    gsap.from(h2.querySelectorAll('.c'), {
      yPercent: 115, duration: 1, ease: 'expo.out', stagger: 0.02,
      scrollTrigger: { trigger: h2, start: 'top 82%' },
    });
    gsap.from(['.clasicos .eyebrow', '.clasicos__lede'], {
      opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: '.clasicos__head', start: 'top 80%' },
    });

    const narrow = matchMedia('(max-width: 860px)').matches;
    document.querySelectorAll('.dish').forEach((fig) => {
      const media = fig.querySelector('.dish__media');
      const st = stateOf(fig.querySelector('img'));

      // Revelado con máscara: el mismo valor alimenta el clip-path (DOM) y el shader (WebGL)
      st.reveal = 0;
      media.style.setProperty('--reveal', '0');
      gsap.to(st, {
        reveal: 1, duration: 1.6, ease: 'expo.out',
        onUpdate: () => media.style.setProperty('--reveal', st.reveal.toFixed(4)),
        scrollTrigger: { trigger: fig, start: 'top 85%' },
      });
      gsap.from(fig.querySelectorAll('.dish__cap > *'), {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.35,
        scrollTrigger: { trigger: fig, start: 'top 85%' },
      });

      // Parallax asimétrico: cada plato viaja a su propia velocidad
      const sp = parseFloat(fig.dataset.speed || '0') * (narrow ? 0.5 : 1);
      gsap.fromTo(fig, { y: sp }, {
        y: -sp, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---------------------------------------------------------
     7. WebGL — un solo lienzo dibuja todas las fotos en la posición
        de su <img>: curvatura por inercia del scroll, separación RGB
        y onda al pasar el mouse. Si algo falla, queda el <img>.
  --------------------------------------------------------- */
  function initGL() {
    const canvas = document.querySelector('.gl-stage');
    const imgs = Array.from(document.querySelectorAll('img[data-gl]'));
    if (!canvas || !imgs.length || reduce) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return;

    const VS = `
      attribute vec2 aPos;
      uniform vec4 uRect;   // x, y, ancho, alto en px CSS (origen arriba-izquierda)
      uniform vec2 uView;   // viewport en px CSS
      uniform float uVel;   // velocidad de scroll suavizada (-1..1)
      varying vec2 vUv;
      void main() {
        vUv = aPos;
        vec2 p = uRect.xy + aPos * uRect.zw;
        p.y += sin(aPos.x * 3.14159265) * uVel * 48.0;   // la foto se curva con la inercia
        vec2 clip = p / uView * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      }`;
    // uRect/uVel se comparten con el vertex shader (highp): deben tener la misma precisión
    const FS = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      uniform sampler2D uTex;
      uniform vec4 uRect;
      uniform vec2 uCover;  // equivalente a object-fit: cover
      uniform vec2 uMouse;  // 0..1 dentro de la foto
      uniform float uHover, uTime, uVel, uReveal, uRadius;
      varying vec2 vUv;
      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      }
      void main() {
        if (vUv.y < 1.0 - uReveal) discard;                       // máscara: se descubre de abajo hacia arriba
        float edge = 1.0 - smoothstep(-1.0, 0.5, roundedBox((vUv - 0.5) * uRect.zw, uRect.zw * 0.5, uRadius));
        float zoom = 1.0 - 0.15 * (1.0 - uReveal);                // entra con zoom 1.15 → 1
        vec2 uv = (vUv - 0.5) * uCover * zoom + 0.5;
        vec2 m = vUv - uMouse;
        float d = length(m * vec2(uRect.z / uRect.w, 1.0));
        uv += normalize(m + 1e-5) * sin(d * 26.0 - uTime * 4.0) * exp(-d * 5.0) * 0.014 * uHover;
        float shift = uVel * 0.01;
        vec4 c = texture2D(uTex, clamp(uv, 0.0, 1.0));
        float r = texture2D(uTex, clamp(uv + vec2(0.0, shift), 0.0, 1.0)).r;
        float b = texture2D(uTex, clamp(uv - vec2(0.0, shift), 0.0, 1.0)).b;
        gl_FragColor = vec4(r, c.g, b, 1.0) * edge;               // alfa premultiplicado
      }`;

    function shader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    const vs = shader(gl.VERTEX_SHADER, VS), fs = shader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    // Malla subdividida (24×24) para que la curvatura sea suave
    const SEG = 24, verts = [], idx = [];
    for (let y = 0; y <= SEG; y++) for (let x = 0; x <= SEG; x++) verts.push(x / SEG, y / SEG);
    for (let y = 0; y < SEG; y++) for (let x = 0; x < SEG; x++) {
      const i = y * (SEG + 1) + x;
      idx.push(i, i + 1, i + SEG + 1, i + 1, i + SEG + 2, i + SEG + 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

    const U = {};
    ['uRect', 'uView', 'uVel', 'uCover', 'uMouse', 'uHover', 'uTime', 'uReveal', 'uRadius']
      .forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const root = document.documentElement;
    let failed = false;
    function disable() {   // vuelta al <img> si el navegador bloquea la textura (p. ej. file://)
      failed = true;
      root.classList.remove('has-gl');
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    const items = imgs.map((img) => {
      const it = { img, st: stateOf(img), tex: null, aspect: 1, visible: false };
      const upload = () => {
        if (failed) return;
        try {
          const tex = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          it.tex = tex;
          it.aspect = img.naturalWidth / img.naturalHeight;
        } catch (err) {
          disable();
        }
      };
      if (img.complete && img.naturalWidth) upload();
      else img.addEventListener('load', upload, { once: true });

      // Hover: posición del puntero relativa a la foto
      const host = img.closest('.dish') || img.parentElement;
      host.addEventListener('pointermove', (e) => {
        const r = img.getBoundingClientRect();
        it.st.tmx = (e.clientX - r.left) / r.width;
        it.st.tmy = (e.clientY - r.top) / r.height;
        it.st.hoverT = 1;
      });
      host.addEventListener('pointerleave', () => { it.st.hoverT = 0; });
      return it;
    });
    if (failed) return;
    root.classList.add('has-gl');

    // Solo trabajamos cuando alguna foto está cerca del viewport
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const it = items.find((i) => i.img === en.target);
        if (it) it.visible = en.isIntersecting;
      });
    }, { rootMargin: '25% 0px' });
    items.forEach((it) => io.observe(it.img));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    let vel = 0, lastY = window.scrollY, cleared = true;
    gsap.ticker.add((time) => {
      if (failed) return;
      const y = window.scrollY;
      // En táctil el fling nativo es muy rápido: la mitad de curvatura
      vel += (Math.max(-1, Math.min(1, (y - lastY) / (coarse ? 160 : 80))) - vel) * 0.12;
      lastY = y;

      const active = items.filter((i) => i.visible && i.tex);
      if (!active.length) {
        if (!cleared) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); cleared = true; }
        return;
      }
      cleared = false;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uView, window.innerWidth, window.innerHeight);
      gl.uniform1f(U.uVel, vel);
      gl.uniform1f(U.uTime, time);
      gl.uniform1f(U.uRadius, 24);

      active.forEach((it) => {
        const r = it.img.getBoundingClientRect();
        if (r.bottom < -120 || r.top > window.innerHeight + 120 || !r.width) return;
        const st = it.st;
        st.hover += (st.hoverT - st.hover) * 0.08;
        st.mx += (st.tmx - st.mx) * 0.15;
        st.my += (st.tmy - st.my) * 0.15;
        const ra = r.width / r.height;
        gl.uniform4f(U.uRect, r.left, r.top, r.width, r.height);
        if (ra > it.aspect) gl.uniform2f(U.uCover, 1, it.aspect / ra);
        else gl.uniform2f(U.uCover, ra / it.aspect, 1);
        gl.uniform2f(U.uMouse, st.mx, st.my);
        gl.uniform1f(U.uHover, st.hover);
        gl.uniform1f(U.uReveal, st.reveal);
        gl.bindTexture(gl.TEXTURE_2D, it.tex);
        gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
      });
    });
  }

  /* ---------------------------------------------------------
     8. Testimonio — las palabras se encienden con el scroll
  --------------------------------------------------------- */
  function initQuote() {
    const q = document.querySelector('[data-words]');
    if (!q || reduce) return;
    const words = split(q, 'words');
    gsap.fromTo(words, { opacity: 0.14 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: q, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  }

  /* ---------------------------------------------------------
     9. CTA final — sección fijada: un disco dorado se expande,
        sube el titular y aparecen los botones
  --------------------------------------------------------- */
  function initCTA() {
    const sec = document.querySelector('.xp-cta');
    if (!sec || reduce) return;
    const h2 = sec.querySelector('h2');
    split(h2, 'chars');
    gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=120%', scrub: 0.8, pin: true, anticipatePin: 1 } })
      .fromTo(sec.querySelector('.xp-cta__disc'),
        { clipPath: 'circle(0% at 50% 60%)' },
        { clipPath: 'circle(150% at 50% 60%)', ease: 'power2.inOut', duration: 1 })
      .from(h2.querySelectorAll('.c'), { yPercent: 115, ease: 'expo.out', stagger: 0.025, duration: 0.5 }, 0.5)
      .from([sec.querySelector('p'), sec.querySelector('.xp-cta__btns')],
        { y: 30, opacity: 0, stagger: 0.1, duration: 0.3 }, 0.75);
  }

  /* Sin GSAP (CDN caído): página usable, el hero se desvanece al bajar */
  function fallbackWithoutGSAP() {
    const hero = document.querySelector('.xp-hero');
    if (!hero) return;
    const onScroll = () => {
      const o = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.6));
      hero.style.opacity = o;
      hero.style.visibility = o ? 'visible' : 'hidden';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     Arranque
  --------------------------------------------------------- */
  renderFlowing();
  mountWorld();
  if (!hasGSAP) { fallbackWithoutGSAP(); return; }
  gsap.registerPlugin(ScrollTrigger);
  initHero();
  initCurtain();
  initGL();
  initClasicos();
  initQuote();
  initCTA();
})();
