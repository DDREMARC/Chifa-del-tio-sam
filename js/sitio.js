/* =========================================================
   El Tío Sam Chifa — sitio.js
   Comportamiento común de TODAS las páginas (una sola copia):
   1. Redes sociales y menú de navegación
   2. Smooth scroll (Lenis) + anclas internas + bloqueo de scroll
   3. Telón entre páginas
   4. Animaciones por atributos en el HTML:
        data-anim="letras"   titular letra por letra con máscara
        data-anim="subir"    el bloque sube y aparece
        data-anim="cascada"  sus hijos entran en escalera
        data-anim="mascara"  revelado de abajo hacia arriba
        data-parallax="60"   parallax en px (positivo baja, negativo sube)
   5. Botones .magnetic y barra de progreso
   Expone window.TioSam para experiencia.js (portada) y main.js (carta).
   Todo respeta "reducir movimiento" y funciona sin GSAP (sin animar).
   ========================================================= */
(function () {
  "use strict";

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(hover: none) and (pointer: coarse)").matches;
  const hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  /* Redes sociales: pega aquí la dirección real de cada una (https://…).
     Mientras estén vacías no se muestra ningún icono ni enlace muerto. */
  const REDES = {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  };
  const REDES_NOMBRE = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" };
  const urlSegura = (u) => (/^https?:\/\//i.test(u) ? u : "");

  /* Escapa texto antes de meterlo en innerHTML: nombres, precios y rutas
     vienen de menu-data.js y pueden llevar & < > " ' */
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* Bloqueo de scroll con contador: el menú y cualquier otra capa pueden
     bloquear a la vez sin pisarse. También pausa Lenis. */
  let bloqueos = 0;
  function lockScroll() {
    bloqueos += 1;
    document.documentElement.classList.add("bloqueado");
    if (TioSam.lenis) TioSam.lenis.stop();
  }
  function unlockScroll() {
    bloqueos = Math.max(0, bloqueos - 1);
    if (bloqueos) return;
    document.documentElement.classList.remove("bloqueado");
    if (TioSam.lenis) TioSam.lenis.start();
  }

  const TioSam = (window.TioSam = { reduce, coarse, hasGSAP, lenis: null, split, escapeHtml, lockScroll, unlockScroll });

  const LOGO = '<img src="../img/logo_tio_sam.jpeg" alt="" width="132" height="132" decoding="async">';

  /* ---------------------------------------------------------
     1. Redes y menú
  --------------------------------------------------------- */
  function initRedes() {
    let alguna = false;
    document.querySelectorAll("[data-red]").forEach((a) => {
      const url = urlSegura(REDES[a.dataset.red]);
      if (!url) return;
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.hidden = false;
      alguna = true;
    });
    document.querySelectorAll("[data-redes]").forEach((bloque) => { bloque.hidden = !alguna; });
  }

  function initMenu() {
    const el = document.getElementById("staggeredMenu");
    if (!el || typeof createStaggeredMenu !== "function") return;
    createStaggeredMenu(el, {
      actual: location.pathname.split("/").pop() || "index.html",
      items: [
        { label: "Inicio", ariaLabel: "Ir al inicio", link: "index.html" },
        { label: "Carta", ariaLabel: "Ver la carta", link: "carta.html" },
        { label: "Contacto", ariaLabel: "Contáctanos", link: "contacto.html" },
      ],
      cta: { label: "Pedir por WhatsApp", href: "https://wa.me/51987654321" },
      direccion: "Jr. Cantón 245, Barrios Altos, Lima",
      socialItems: Object.keys(REDES)
        .map((k) => ({ label: REDES_NOMBRE[k], link: urlSegura(REDES[k]) }))
        .filter((s) => s.link),
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
      if (TioSam.lenis) TioSam.lenis.scrollTo(target, { immediate: instant, duration: 1.4, offset: -70 });
      else target.scrollIntoView();
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------
     3. Telón entre páginas: cae la noche al salir, se retira al entrar
  --------------------------------------------------------- */
  function initTelon() {
    const root = document.documentElement;
    const anim = hasGSAP && !reduce;
    if (!anim) { root.classList.remove("telon-entrada"); return; }

    const telon = document.createElement("div");
    telon.className = "telon";
    telon.setAttribute("aria-hidden", "true");
    telon.innerHTML = LOGO;
    document.body.appendChild(telon);
    const logo = telon.firstChild;

    if (root.classList.contains("telon-entrada")) {
      // precarga.js ya pintó la página cubierta: tomamos el relevo y la descubrimos
      gsap.set(telon, { yPercent: 0, visibility: "visible" });
      gsap.set(logo, { opacity: 0 });
      root.classList.remove("telon-entrada");
      gsap.to(telon, {
        yPercent: -100, duration: 0.7, ease: "expo.inOut", delay: 0.05,
        onComplete: () => gsap.set(telon, { visibility: "hidden" }),
      });
      // Red de seguridad: si el navegador pausa las animaciones, nunca dejar la página tapada
      setTimeout(() => {
        if (gsap.getProperty(telon, "yPercent") > -100) gsap.set(telon, { yPercent: -100, visibility: "hidden" });
      }, 2000);
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
      // Navega al terminar el telón, o a los 700 ms pase lo que pase (animaciones pausadas)
      let fue = false;
      const ir = () => { if (!fue) { fue = true; location.href = url.href; } };
      setTimeout(ir, 700);
      gsap.timeline({ onComplete: ir })
        .fromTo(telon, { yPercent: 100, visibility: "visible" }, { yPercent: 0, duration: 0.5, ease: "expo.inOut" })
        .fromTo(logo, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }, 0.2);
    });

    // Al volver con "atrás" (bfcache) la página regresa con el telón puesto
    window.addEventListener("pageshow", (ev) => {
      if (ev.persisted) gsap.set(telon, { yPercent: 100, visibility: "hidden" });
    });
  }

  /* ---------------------------------------------------------
     4. Animaciones por atributos (sutiles: poco recorrido, salida fuerte)
  --------------------------------------------------------- */
  function initAnimaciones() {
    document.querySelectorAll('[data-anim="letras"]').forEach((el) => {
      split(el, "chars");
      gsap.from(el.querySelectorAll(".c"), {
        yPercent: 105, duration: 0.9, ease: "expo.out", stagger: 0.02,
        scrollTrigger: { trigger: el, start: "top 92%" },
      });
    });
    document.querySelectorAll('[data-anim="subir"]').forEach((el) => {
      gsap.from(el, {
        y: 18, opacity: 0, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 92%" },
      });
    });
    document.querySelectorAll('[data-anim="cascada"]').forEach((el) => {
      gsap.from(el.children, {
        y: 16, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
    document.querySelectorAll('[data-anim="mascara"]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onComplete: () => gsap.set(el, { clearProps: "clipPath" }) });
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
     5. Botones magnéticos (solo puntero fino) y barra de progreso
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
        bx(near ? dx * 0.3 : 0); by(near ? dy * 0.3 : 0);
        lx(near ? dx * 0.12 : 0); ly(near ? dy * 0.12 : 0);
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
  initRedes();
  initMenu();
  initTelon();
  initAnchors();
  if (!hasGSAP) return;
  gsap.registerPlugin(ScrollTrigger);
  initSmoothScroll();
  if (reduce) return;
  initAnimaciones();
  initMagnetic();
  initProgreso();
})();
