/* =========================================================
   El Tío Sam Chifa — sitio.js
   Comportamiento común de TODAS las páginas (una sola copia):
   1. Menú escalonado (su configuración vive solo aquí)
   2. Smooth scroll (Lenis) + anclas internas
   3. Telón entre páginas
   4. Animaciones por atributos en el HTML:
        data-anim="letras"   titular letra por letra con máscara
        data-anim="subir"    el bloque sube y aparece
        data-anim="cascada"  sus hijos entran en escalera
        data-anim="mascara"  revelado de abajo hacia arriba (+ zoom de la imagen)
        data-anim="sello"    gira y baja con el scroll (decorativo)
        data-parallax="60"   parallax en px (positivo baja, negativo sube)
   5. Carta: las tarjetas entran cada vez que se pintan
   6. Botones .magnetic y barra de progreso
   Expone window.TioSam para experiencia.js (portada).
   Todo respeta "reducir movimiento" y funciona sin GSAP (sin animar).
   ========================================================= */
(function () {
  "use strict";

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const TioSam = (window.TioSam = { reduce, coarse, hasGSAP, lenis: null, split });

  const SELLO = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2.6 4" opacity=".75"/><path fill="currentColor" d="M50,50 C50,34 63,25 76,31 C83,34 83,45 76,48 C70,50.5 64,47 63,52 C61,60 68,65 62,70 C55,75 48,64 50,50 Z"/><path fill="currentColor" transform="rotate(180 50 50)" d="M50,50 C50,34 63,25 76,31 C83,34 83,45 76,48 C70,50.5 64,47 63,52 C61,60 68,65 62,70 C55,75 48,64 50,50 Z"/></svg>';

  /* ---------------------------------------------------------
     1. Menú escalonado
  --------------------------------------------------------- */
  function initMenu() {
    const el = document.getElementById("staggeredMenu");
    if (!el || typeof createStaggeredMenu !== "function") return;
    createStaggeredMenu(el, {
      position: "right",
      colors: ["#BE1A1A", "#2B0A0A"],
      accentColor: "#F7D87F",
      menuButtonColor: "#F7D87F",
      openMenuButtonColor: "#F7D87F",
      changeMenuColorOnOpen: true,
      displaySocials: true,
      displayItemNumbering: true,
      items: [
        { label: "Inicio", ariaLabel: "Ir al inicio", link: "index.html" },
        { label: "Carta", ariaLabel: "Ver la carta", link: "carta.html" },
        { label: "Contacto", ariaLabel: "Contáctanos", link: "contacto.html" },
      ],
      socialItems: [
        { label: "Facebook", link: "#" },
        { label: "Instagram", link: "#" },
        { label: "TikTok", link: "#" },
        { label: "WhatsApp", link: "https://wa.me/51987654321" },
      ],
    });
  }

  /* ---------------------------------------------------------
     Split text accesible: el lector de pantalla lee el texto
     completo (aria-label); las letras sueltas quedan ocultas.
  --------------------------------------------------------- */
  function split(el, mode) {
    if (!el || el.dataset.splitDone) return [];
    el.dataset.splitDone = "1";
    el.classList.add("split");
    const chars = mode !== "words";
    if (chars) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    const out = [];
    (function walk(node) {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 1) { walk(n); return; }
        if (n.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = chars ? "w" : "wd";
          if (chars) {
            w.setAttribute("aria-hidden", "true");
            Array.from(tok).forEach((ch) => {
              const c = document.createElement("span");
              c.className = "c";
              c.textContent = ch;
              w.appendChild(c);
            });
          } else {
            w.textContent = tok;
          }
          out.push(w);
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      });
    })(el);
    return out;
  }

  /* ---------------------------------------------------------
     2. Smooth scroll — Lenis solo en rueda/trackpad. En táctil
        se deja el scroll nativo: su inercia ya es la "orgánica".
  --------------------------------------------------------- */
  function initSmoothScroll() {
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (reduce || typeof Lenis === "undefined") return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    TioSam.lenis = lenis;
  }

  function initAnchors() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      // El skip-link salta al instante (accesibilidad); el resto viaja suave.
      const instant = a.classList.contains("skip-link") || !TioSam.lenis;
      if (TioSam.lenis) TioSam.lenis.scrollTo(target, { immediate: instant, duration: 1.8, offset: -70 });
      else target.scrollIntoView();
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------
     3. Telón entre páginas: cubre al salir, se retira al entrar
  --------------------------------------------------------- */
  function initTelon() {
    const root = document.documentElement;
    const anim = hasGSAP && !reduce;
    if (!anim) { root.classList.remove("telon-entrada"); return; }

    const telon = document.createElement("div");
    telon.className = "telon";
    telon.setAttribute("aria-hidden", "true");
    telon.innerHTML = SELLO;
    document.body.appendChild(telon);
    const sello = telon.firstChild;

    if (root.classList.contains("telon-entrada")) {
      // precarga.js ya pintó la página cubierta: tomamos el relevo y la descubrimos
      gsap.set(telon, { yPercent: 0, visibility: "visible" });
      gsap.set(sello, { opacity: 0 });
      root.classList.remove("telon-entrada");
      gsap.to(telon, {
        yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.05,
        onComplete: () => gsap.set(telon, { visibility: "hidden" }),
      });
      // Red de seguridad: si el navegador pausa las animaciones, nunca dejar la página tapada
      setTimeout(() => {
        if (gsap.getProperty(telon, "yPercent") > -100) gsap.set(telon, { yPercent: -100, visibility: "hidden" });
      }, 2500);
    } else {
      gsap.set(telon, { yPercent: 100, visibility: "hidden" });
    }

    document.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return; // misma página: lo resuelve el ancla
      e.preventDefault();
      try { sessionStorage.setItem("tsTelon", "1"); } catch (err) { /* sin telón de entrada */ }
      // Navega al terminar el telón, o a los 900 ms pase lo que pase (animaciones pausadas)
      let fue = false;
      const ir = () => { if (!fue) { fue = true; location.href = url.href; } };
      setTimeout(ir, 900);
      gsap.timeline({ onComplete: ir })
        .fromTo(telon, { yPercent: 100, visibility: "visible" }, { yPercent: 0, duration: 0.65, ease: "expo.inOut" })
        .fromTo(sello, { opacity: 0, scale: 0.6, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.6)" }, 0.3);
    });

    // Al volver con "atrás" (bfcache) la página regresa con el telón puesto
    window.addEventListener("pageshow", (ev) => {
      if (ev.persisted) gsap.set(telon, { yPercent: 100, visibility: "hidden" });
    });
  }

  /* ---------------------------------------------------------
     4. Animaciones por atributos
  --------------------------------------------------------- */
  function mascara(el, scrollTrigger) {
    const img = el.querySelector("img");
    const tl = gsap.timeline(scrollTrigger ? { scrollTrigger } : {});
    tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.out" });
    if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.4, ease: "expo.out" }, 0);
    return tl;
  }

  function initAnimaciones() {
    document.querySelectorAll('[data-anim="letras"]').forEach((el) => {
      split(el, "chars");
      gsap.from(el.querySelectorAll(".c"), {
        yPercent: 115, rotate: 5, duration: 1, ease: "expo.out", stagger: 0.025,
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
    document.querySelectorAll('[data-anim="subir"]').forEach((el) => {
      gsap.from(el, {
        y: 36, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
    document.querySelectorAll('[data-anim="cascada"]').forEach((el) => {
      gsap.from(el.children, {
        y: 36, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
    document.querySelectorAll('[data-anim="mascara"]').forEach((el) => {
      mascara(el, { trigger: el, start: "top 88%" });
    });
    document.querySelectorAll('[data-anim="sello"]').forEach((el) => {
      gsap.to(el, {
        rotation: 140, yPercent: 35, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true },
      });
    });
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const d = parseFloat(el.dataset.parallax) * (coarse ? 0.5 : 1);
      gsap.fromTo(el, { y: -d }, {
        y: d, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }

  /* ---------------------------------------------------------
     5. Carta: main.js avisa con "carta:render" cada vez que pinta
  --------------------------------------------------------- */
  function initCarta() {
    let triggers = [];
    document.addEventListener("carta:render", (e) => {
      triggers.forEach((t) => t.kill());
      triggers = [];
      const grid = e.detail.grid;

      grid.querySelectorAll(".menu-category-title").forEach((title) => {
        const tw = gsap.from(title, {
          x: -24, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: title, start: "top 92%" },
        });
        triggers.push(tw.scrollTrigger);
      });

      // La tarjeta tiene "transition: transform" para el hover: se apaga mientras anima
      const cards = grid.querySelectorAll(".menu-item");
      gsap.set(cards, { opacity: 0, y: 40, transition: "none" });
      triggers = triggers.concat(ScrollTrigger.batch(cards, {
        start: "top 94%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08,
            onComplete: () => gsap.set(batch, { clearProps: "transform,opacity,transition" }),
          });
          batch.forEach((card, i) => {
            const icon = card.querySelector(".menu-item__icon");
            if (icon) mascara(icon).delay(i * 0.08);
          });
        },
      }));
      ScrollTrigger.refresh();
    });
  }

  /* ---------------------------------------------------------
     6. Botones magnéticos (solo puntero fino) y barra de progreso
  --------------------------------------------------------- */
  function initMagnetic() {
    if (coarse) return;
    document.querySelectorAll(".magnetic").forEach((btn) => {
      const zone = btn.closest("section") || btn.parentElement;
      const label = btn.querySelector(".magnetic__label");
      const opt = { duration: 0.6, ease: "power3" };
      const bx = gsap.quickTo(btn, "x", opt), by = gsap.quickTo(btn, "y", opt);
      const lx = label ? gsap.quickTo(label, "x", opt) : () => {};
      const ly = label ? gsap.quickTo(label, "y", opt) : () => {};
      zone.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2 - gsap.getProperty(btn, "x");
        const cy = r.top + r.height / 2 - gsap.getProperty(btn, "y");
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.95;
        bx(near ? dx * 0.35 : 0); by(near ? dy * 0.35 : 0);
        lx(near ? dx * 0.15 : 0); ly(near ? dy * 0.15 : 0);
      });
      zone.addEventListener("pointerleave", () => { bx(0); by(0); lx(0); ly(0); });
    });
  }

  function initProgreso() {
    if (document.getElementById("world")) return; // la portada ya trae su barra
    const bar = document.createElement("div");
    bar.className = "progreso";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  }

  /* ---------------------------------------------------------
     Arranque
  --------------------------------------------------------- */
  initMenu();
  initTelon();
  initAnchors();
  if (!hasGSAP) return;
  gsap.registerPlugin(ScrollTrigger);
  initSmoothScroll();
  if (reduce) return;
  initAnimaciones();
  initCarta();
  initMagnetic();
  initProgreso();
})();
