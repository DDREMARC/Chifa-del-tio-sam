/* =========================================================
   Menú de navegación — vanilla JS, sin GSAP
   Aquí solo se arma el HTML y se cuida el comportamiento (teclado,
   foco, bloqueo de scroll). Todo el movimiento vive en
   css/staggered-menu.css: por eso se puede abrir y cerrar a media
   animación sin saltos y funciona aunque el CDN no cargue.
   ========================================================= */

function createStaggeredMenu(rootEl, options = {}) {
  const {
    items = [],
    socialItems = [],
    cta = null,                 // { label, href } botón de acción al pie del panel
    direccion = "",
    actual = "",                // archivo de la página actual, p. ej. "carta.html"
    closeOnClickAway = true,
    onMenuOpen = null,
    onMenuClose = null,
  } = options;

  const esc = (window.TioSam && window.TioSam.escapeHtml) || ((s) => String(s));
  const TS = () => window.TioSam || {};
  let open = false;

  rootEl.classList.add("staggered-menu-wrapper");
  rootEl.dataset.open = "false";

  const redes = socialItems.filter((s) => s.link);

  /* La cabecera (logo + botón) ya viene escrita en el HTML de cada página: así existe desde el primer
     cuadro y la transición entre páginas del navegador la ve en la página nueva (si la creara este
     script, que corre al final, la cabecera se apagaría y volvería a aparecer). Esta copia solo se usa
     si una página nueva olvida ponerla: debe quedar igual a la del HTML. */
  const cabeceraHtml = `
    <header class="sm-header">
      <a class="sm-logo" href="index.html" aria-label="El Tío Sam Chifa, ir al inicio">
        <img class="sm-logo-img" src="../img/logo_tio_sam.jpeg" alt="" width="40" height="40" draggable="false">
        <span class="sm-logo-text">El Tío Sam<small>Chifa</small></span>
      </a>
      <button class="sm-toggle" type="button" aria-expanded="false" aria-controls="smPanel" aria-label="Abrir menú">
        <span class="sm-toggle-textWrap" aria-hidden="true">
          <span class="sm-toggle-textInner"><span>Menú</span><span>Cerrar</span></span>
        </span>
        <span class="sm-icon" aria-hidden="true"><i></i><i></i></span>
      </button>
    </header>`;
  const capasHtml = `
    <div class="sm-scrim"></div>
    <div class="sm-capas" aria-hidden="true"><span class="sm-capa"></span><span class="sm-capa"></span></div>`;
  const panelHtml = `
    <aside class="sm-panel" id="smPanel" aria-label="Navegación principal" data-lenis-prevent inert>
      <nav aria-label="Páginas">
        <ul class="sm-lista">
          ${items.map((it, i) => `
            <li><a class="sm-item" href="${esc(it.link)}" style="--i:${i}"${it.link === actual ? ' aria-current="page"' : ""}${it.ariaLabel ? ` aria-label="${esc(it.ariaLabel)}"` : ""}><span>${esc(it.label)}</span></a></li>`).join("")}
        </ul>
      </nav>
      <div class="sm-pie">
        ${cta ? `<a class="btn btn--farol btn--bloque" href="${esc(cta.href)}" target="_blank" rel="noopener noreferrer">${esc(cta.label)}</a>` : ""}
        ${direccion ? `<p class="sm-direccion">${esc(direccion)}</p>` : ""}
        ${redes.length ? `<div class="sm-redes">${redes.map((s) => `<a href="${esc(s.link)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join("")}</div>` : ""}
      </div>
    </aside>`;

  const cabeceraPrevia = rootEl.querySelector(".sm-header");
  if (cabeceraPrevia) {
    cabeceraPrevia.insertAdjacentHTML("beforebegin", capasHtml);   // el orden del DOM es: velo, capas, cabecera, panel
    cabeceraPrevia.insertAdjacentHTML("afterend", panelHtml);
  } else {
    rootEl.innerHTML = capasHtml + cabeceraHtml + panelHtml;
  }

  const panel = rootEl.querySelector(".sm-panel");
  const scrim = rootEl.querySelector(".sm-scrim");
  const toggleBtn = rootEl.querySelector(".sm-toggle");

  function focusables() {
    return Array.from(rootEl.querySelectorAll(".sm-header a, .sm-header button, .sm-panel a")).filter((el) => !el.closest("[inert]"));
  }

  function setOpen(value) {
    if (value === open) return;
    open = value;
    rootEl.dataset.open = String(open);
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    panel.toggleAttribute("inert", !open);
    if (open) {
      if (onMenuOpen) onMenuOpen();
      if (TS().lockScroll) TS().lockScroll();
      requestAnimationFrame(() => {
        const first = panel.querySelector(".sm-item");
        if (first) first.focus({ preventScroll: true });
      });
    } else {
      if (onMenuClose) onMenuClose();
      if (TS().unlockScroll) TS().unlockScroll();
      if (panel.contains(document.activeElement)) toggleBtn.focus({ preventScroll: true });
    }
  }

  toggleBtn.addEventListener("click", () => setOpen(!open));
  if (closeOnClickAway) scrim.addEventListener("click", () => setOpen(false));
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key !== "Tab") return;
    // El foco da la vuelta dentro del menú mientras está abierto
    const list = focusables();
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  return { toggle: () => setOpen(!open), close: () => setOpen(false), isOpen: () => open };
}
