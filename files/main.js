/* =========================================================
   El Tío Sam Chifa — main.js
   - Revela secciones al hacer scroll
   - Marca el ítem activo del menú inferior
   - Renderiza y filtra la carta (si la página lo requiere)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  setupScrollReveal();
  setupMenuPage();
  setupSpotlightCards();
  setupFlowingMenu();
});

/* ---------------------------------------------------------
   Bloqueo de scroll del body (con contador)
   Permite que varios overlays (ruleta, menú hamburguesa)
   bloqueen el scroll a la vez sin pisarse el estado entre sí.
--------------------------------------------------------- */
window.lockBodyScroll = function lockBodyScroll() {
  const n = (Number(document.body.dataset.scrollLocks) || 0) + 1;
  document.body.dataset.scrollLocks = String(n);
  document.body.style.overflow = "hidden";
};
window.unlockBodyScroll = function unlockBodyScroll() {
  const n = Math.max(0, (Number(document.body.dataset.scrollLocks) || 0) - 1);
  document.body.dataset.scrollLocks = String(n);
  if (n === 0) document.body.style.overflow = "";
};

/* ---------------------------------------------------------
   Nav inferior: resalta la página actual
--------------------------------------------------------- */
function markActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".bottomnav a").forEach((link) => {
    const target = link.getAttribute("href");
    if (target === path || (path === "" && target === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ---------------------------------------------------------
   Revelado de secciones al hacer scroll
--------------------------------------------------------- */
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Página de la carta: pinta ítems y filtra por categoría
--------------------------------------------------------- */
function setupMenuPage() {
  const grid = document.getElementById("menuGrid");
  const wheelEl = document.getElementById("categoryWheel");
  const trigger = document.getElementById("wheelTrigger");
  const triggerLabel = document.getElementById("wheelTriggerLabel");
  const overlay = document.getElementById("wheelOverlay");
  const backdrop = document.getElementById("wheelBackdrop");
  if (!grid || !wheelEl || typeof MENU_ITEMS === "undefined") return;

  const categories = [{ id: "todos", label: "Todos" }, ...MENU_CATEGORIES];
  let currentCat = "todos";

  const BREAKPOINT = 720;
  let isMobile = window.innerWidth < BREAKPOINT;

  function buildWheel(selectedIndex) {
    return createOptionWheel(wheelEl, {
      items: categories.map((c) => c.label),
      defaultSelected: selectedIndex,
      textColor: "rgba(248,235,171,.4)",
      activeColor: "#F7D87F",
      side: "left",
      fontSize: isMobile ? 1.2 : 1.6,
      spacing: isMobile ? 1.6 : 1.8,
      tilt: 10,
      curve: 1,
      blur: isMobile ? 1 : 2,
      fade: 0.25,
      inset: isMobile ? 20 : 24,
      smoothing: 180,
      loop: false,
      draggable: true,
      onChange(index) {
        currentCat = categories[index].id;
        triggerLabel.textContent = categories[index].label;
        renderMenu(currentCat);
        // Cierra el overlay solo si el cambio vino de una selección
        // real del usuario (el overlay ya estaba abierto).
        if (overlay.classList.contains("is-visible")) {
          setTimeout(closeOverlay, 260);
        }
      },
    });
  }

  let wheel = buildWheel(0);

  // Recalcula el tamaño de la ruleta si el usuario gira el teléfono
  // o cruza el breakpoint de escritorio (destroy() limpia sus listeners
  // antes de reconstruirla, así no quedan handlers duplicados).
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nowMobile = window.innerWidth < BREAKPOINT;
      if (nowMobile !== isMobile) {
        isMobile = nowMobile;
        const selected = wheel.getSelected();
        wheel.destroy();
        wheel = buildWheel(selected);
      }
    }, 200);
  });

  function openOverlay() {
    overlay.classList.add("is-visible");
    trigger.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    window.lockBodyScroll();
  }

  function closeOverlay() {
    overlay.classList.remove("is-visible");
    trigger.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    window.unlockBodyScroll();
  }

  trigger.addEventListener("click", openOverlay);
  backdrop.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  renderMenu("todos");

  function renderMenu(filter) {
    grid.style.opacity = "0";
    setTimeout(() => {
      grid.innerHTML = "";

      if (filter === "todos") {
        MENU_CATEGORIES.forEach((cat) => {
          appendCategoryBlock(cat);
        });
      } else {
        const cat = MENU_CATEGORIES.find((c) => c.id === filter);
        if (cat) appendCategoryBlock(cat, false);
      }

      grid.style.opacity = "1";
    }, 250);
  }

  function appendCategoryBlock(cat, showTitle = true) {
    const items = MENU_ITEMS.filter((i) => i.cat === cat.id);
    if (!items.length) return;

    if (showTitle) {
      const title = document.createElement("div");
      title.className = "menu-category-title";
      title.textContent = cat.label;
      grid.appendChild(title);
    }

    const wrap = document.createElement("div");
    wrap.className = "menu-grid";

    items.forEach((item) => wrap.appendChild(buildItemCard(item)));
    grid.appendChild(wrap);
  }

  function buildItemCard(item) {
    const card = document.createElement("div");
    card.className = "menu-item";
    card.innerHTML = `
      <div class="menu-item__icon">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-item__body">
        <div class="menu-item__top">
          <span class="menu-item__name">${item.name}</span>
          <span class="menu-item__price">${item.price}</span>
        </div>
        <p class="menu-item__desc">${item.desc}</p>
      </div>
    `;
    return card;
  }
}

/* ---------------------------------------------------------
   Spotlight Cards: efecto de brillo que sigue el mouse
--------------------------------------------------------- */
function setupSpotlightCards() {
  const cards = document.querySelectorAll(".spotlight-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const glow = card.querySelector(".spotlight-card__glow");
    if (!glow) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.setProperty("--mx", x + "px");
      glow.style.setProperty("--my", y + "px");
    });
  });
}

/* ---------------------------------------------------------
   FlowingMenu: menú fullscreen con marquee animado
   Inspirado en React Bits FlowingMenu (sin GSAP)
--------------------------------------------------------- */
function setupFlowingMenu() {
  const items = document.querySelectorAll(".flowing .menu__item");
  if (!items.length) return;

  items.forEach((item) => {
    const link = item.querySelector(".menu__item-link");
    const marquee = item.querySelector(".marquee");
    const inner = item.querySelector(".marquee__inner");
    if (!link || !marquee || !inner) return;

    /* ── detectar borde más cercano ── */
    function closestEdge(mx, my, w, h) {
      const topD = (mx - w / 2) ** 2 + my ** 2;
      const botD = (mx - w / 2) ** 2 + (my - h) ** 2;
      return topD < botD ? "top" : "bottom";
    }

    /* ── animación del marquee (scroll infinito con requestAnimationFrame) ── */
    let raf = null;
    let pos = 0;
    let speed = 1.8;

    function measureAndReset() {
      const firstPart = inner.querySelector(".marquee__part");
      if (!firstPart) return;
      const partW = firstPart.offsetWidth;
      if (partW > 0) pos = pos % partW || 0;
    }

    function tick() {
      pos -= speed;
      const firstPart = inner.querySelector(".marquee__part");
      if (firstPart) {
        const partW = firstPart.offsetWidth;
        if (partW > 0 && Math.abs(pos) >= partW) pos += partW;
      }
      inner.style.transform = "translateX(" + pos + "px)";
      raf = requestAnimationFrame(tick);
    }

    function startMarquee() {
      measureAndReset();
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function stopMarquee() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    /* ── mouseenter ── */
    link.addEventListener("mouseenter", (e) => {
      const rect = item.getBoundingClientRect();
      const edge = closestEdge(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);

      item.classList.remove("marquee-from-bottom", "is-leaving");
      if (edge === "bottom") item.classList.add("marquee-from-bottom");

      void item.offsetWidth;
      item.classList.add("is-entering");
      startMarquee();
    });

    /* ── mouseleave ── */
    link.addEventListener("mouseleave", (e) => {
      const rect = item.getBoundingClientRect();
      const edge = closestEdge(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);

      item.classList.remove("is-entering");
      item.classList.add("is-leaving");

      if (edge === "bottom") {
        item.classList.add("marquee-from-bottom");
      } else {
        item.classList.remove("marquee-from-bottom");
      }

      setTimeout(() => {
        if (!item.classList.contains("is-entering")) {
          item.classList.remove("is-leaving", "marquee-from-bottom");
          stopMarquee();
        }
      }, 580);
    });
  });
}
