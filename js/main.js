/* =========================================================
   El Tío Sam Chifa — main.js (solo la carta, html/carta.html)
   - Pinta la carta desde menu-data.js, una sección por categoría
   - Pestañas de categoría con marca deslizante y enlace directo (#chaufas)
   - Salida rápida del contenido viejo y entrada escalonada del nuevo
   Lo común (menú, Lenis, anclas) viene de sitio.js, que carga antes.
   ========================================================= */
(function () {
  "use strict";

  const TS = window.TioSam || {};
  const escapeHtml = TS.escapeHtml || ((s) => String(s));
  const calm = !!TS.calm;   // movimiento reducido: las piezas solo funden

  const grid = document.getElementById("menuGrid");
  const riel = document.getElementById("categorias");
  const estado = document.getElementById("estadoCarta");
  if (!grid || !riel || typeof MENU_ITEMS === "undefined") return;

  const CATEGORIAS = [{ id: "todos", label: "Todos" }, ...MENU_CATEGORIES];
  const ICONO_WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg>';

  let actual = null;      // categoría mostrada
  let turno = 0;          // cada cambio de categoría cancela al anterior

  /* ---------------------------------------------------------
     Pestañas de categoría
  --------------------------------------------------------- */
  riel.innerHTML = CATEGORIAS.map((c) =>
    `<button type="button" class="categorias__tab" data-cat="${escapeHtml(c.id)}" aria-pressed="false">${escapeHtml(c.label)}</button>`
  ).join("") + '<span class="categorias__marca" aria-hidden="true"></span>';
  const tabs = Array.from(riel.querySelectorAll(".categorias__tab"));

  function colocarMarca(conAnimacion) {
    const tab = tabs.find((t) => t.getAttribute("aria-pressed") === "true");
    if (!tab) return;
    const relleno = parseFloat(getComputedStyle(tab).paddingLeft) || 0;   // la marca subraya solo el texto
    riel.style.setProperty("--x", tab.offsetLeft + relleno + "px");
    riel.style.setProperty("--w", tab.offsetWidth - relleno * 2 + "px");
    riel.classList.toggle("is-listo", !!conAnimacion);
    // Mantiene a la vista la pestaña elegida (en móvil el riel se desplaza)
    const izq = tab.offsetLeft - (riel.clientWidth - tab.offsetWidth) / 2;
    riel.scrollTo({ left: Math.max(0, izq), behavior: conAnimacion && !calm ? "smooth" : "auto" });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => elegir(tab.dataset.cat)));
  function actualizarBordesRiel() {
    const max = riel.scrollWidth - riel.clientWidth;
    riel.dataset.inicio = String(riel.scrollLeft > 2);
    riel.dataset.final = String(max > 2 && riel.scrollLeft < max - 2);
  }
  riel.addEventListener("scroll", actualizarBordesRiel, { passive: true });
  actualizarBordesRiel();
  let rafResize = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(rafResize);
    rafResize = requestAnimationFrame(() => { colocarMarca(false); actualizarBordesRiel(); });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { colocarMarca(false); actualizarBordesRiel(); });

  /* ---------------------------------------------------------
     HTML de cada pieza
  --------------------------------------------------------- */
  const pedidoUrl = (nombre) =>
    `https://wa.me/${MENU_WHATSAPP}?text=${encodeURIComponent(`Hola, quisiera pedir: ${nombre}`)}`;

  // Sin dígitos = precio sin confirmar: se muestra, pero atenuado
  const precioHtml = (precio) =>
    `<span class="plato__precio"${/\d/.test(precio) ? "" : " data-sin-precio"}>${escapeHtml(precio)}</span>`;

  // El "+" de los nombres ("Lomo saltado + chaufa") se dibuja con la letra de texto: en la serif de títulos el + sale fino y diminuto
  const conMas = (nombre) => escapeHtml(nombre).replace(/ \+ /g, ' <span class="mas">+</span> ');

  function platoFoto(item) {
    const nombre = escapeHtml(item.name);
    return `
      <article class="plato plato--foto revelar">
        <div class="plato__foto"><img src="${escapeHtml(item.img)}" alt="${nombre}" loading="lazy" decoding="async"></div>
        <div class="plato__cuerpo">
          <h3 class="plato__nombre">${conMas(item.name)}</h3>
          ${item.desc ? `<p class="plato__desc">${escapeHtml(item.desc)}</p>` : ""}
          <div class="plato__pie">
            ${precioHtml(item.price)}
            <a class="btn btn--borde" href="${escapeHtml(pedidoUrl(item.name))}" target="_blank" rel="noopener noreferrer">${ICONO_WA}Pedir por WhatsApp</a>
          </div>
        </div>
      </article>`;
  }

  function platoFila(item) {
    const nombre = escapeHtml(item.name);
    return `
      <li class="plato plato--fila revelar">
        <div class="plato__texto">
          <h3 class="plato__nombre">${conMas(item.name)}</h3>
          <p class="plato__desc">${escapeHtml(item.desc)}</p>
        </div>
        ${precioHtml(item.price)}
        <a class="plato__pedir" href="${escapeHtml(pedidoUrl(item.name))}" target="_blank" rel="noopener noreferrer" aria-label="Pedir ${nombre} por WhatsApp" title="Pedir por WhatsApp">${ICONO_WA}</a>
      </li>`;
  }

  function seccion(cat) {
    const platos = MENU_ITEMS.filter((i) => i.cat === cat.id);
    if (!platos.length) return "";
    const fotos = platos.filter((i) => i.img);
    const resto = platos.filter((i) => !i.img);
    const modo = fotos.length === 0 ? "lista" : fotos.length === 1 ? "lado" : "arriba";
    const n = platos.length;
    return `
      <section class="seccion-carta seccion-carta--${modo}" id="cat-${escapeHtml(cat.id)}" aria-labelledby="t-${escapeHtml(cat.id)}">
        <div class="seccion-carta__cab revelar">
          <h2 id="t-${escapeHtml(cat.id)}">${escapeHtml(cat.label)}</h2>
          <p class="seccion-carta__n">${n} ${n === 1 ? "plato" : "platos"}</p>
        </div>
        <div class="seccion-carta__cuerpo">
          ${fotos.length ? `<div class="fotos">${fotos.map(platoFoto).join("")}</div>` : ""}
          ${resto.length ? `<ul class="lista">${resto.map(platoFila).join("")}</ul>` : ""}
        </div>
      </section>`;
  }

  /* ---------------------------------------------------------
     Entradas: cada pieza aparece al entrar en pantalla, en tandas
     escalonadas. Al terminar se limpia la clase para que el hover
     vuelva a usar sus propias transiciones.
  --------------------------------------------------------- */
  const observador = "IntersectionObserver" in window
    ? new IntersectionObserver((entradas) => {
        entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((e, i) => {
            const el = e.target;
            const retraso = Math.min(i, 7) * 45;
            el.style.setProperty("--d", retraso + "ms");
            el.classList.add("es-visible");
            observador.unobserve(el);
            setTimeout(() => {
              el.classList.remove("revelar", "es-visible");
              el.style.removeProperty("--d");
            }, retraso + 1500);
          });
      }, { rootMargin: "12% 0px 12% 0px", threshold: 0.02 })
    : null;

  function observarEntradas() {
    const piezas = grid.querySelectorAll(".revelar");
    if (!observador) { piezas.forEach((p) => p.classList.remove("revelar")); return; }
    piezas.forEach((p) => observador.observe(p));
  }

  // Una pasada rápida puede saltar el umbral del IntersectionObserver. Si una pieza ya
  // quedó detrás de la vista, quita su estado inicial oculto para que siga legible al volver.
  let rafRecuperar = 0;
  function recuperarPiezasOmitidas() {
    rafRecuperar = 0;
    grid.querySelectorAll(".revelar").forEach((pieza) => {
      if (pieza.getBoundingClientRect().bottom > 0) return;
      if (observador) observador.unobserve(pieza);
      pieza.classList.remove("revelar", "es-visible");
      pieza.style.removeProperty("--d");
    });
  }
  window.addEventListener("scroll", () => {
    if (rafRecuperar) return;
    rafRecuperar = requestAnimationFrame(recuperarPiezasOmitidas);
  }, { passive: true });

  /* ---------------------------------------------------------
     Salidas: lo que se ve sale rápido (y en cascada corta) antes
     de cambiar el contenido. Salir es más veloz que entrar.
  --------------------------------------------------------- */
  function salir() {
    if (!grid.firstElementChild) return Promise.resolve();
    const alto = window.innerHeight;
    const visibles = Array.from(grid.querySelectorAll(".seccion-carta__cab, .plato"))
      .filter((el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < alto; })
      .slice(0, 12);
    if (!visibles.length) return Promise.resolve();
    const animaciones = visibles.map((el, i) => el.animate(
      calm
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-6px)" }],
      { duration: calm ? 120 : 150, delay: i * (calm ? 0 : 12), easing: "cubic-bezier(.55, 0, 1, .45)", fill: "forwards" }
    ));
    const fin = Promise.all(animaciones.map((a) => a.finished.catch(() => {})));
    return Promise.race([fin, new Promise((ok) => setTimeout(ok, 450))]);
  }

  /* ---------------------------------------------------------
     Cambio de categoría
  --------------------------------------------------------- */
  function pintar(id) {
    const lista = id === "todos" ? MENU_CATEGORIES : MENU_CATEGORIES.filter((c) => c.id === id);
    grid.innerHTML = lista.map(seccion).join("");
    const total = id === "todos" ? MENU_ITEMS.length : MENU_ITEMS.filter((i) => i.cat === id).length;
    const nombre = (CATEGORIAS.find((c) => c.id === id) || {}).label || "";
    if (estado) estado.textContent = `${nombre}: ${total} platos`;
  }

  // Si el visitante ya bajó, el contenido nuevo debe empezar a la vista
  function volverAlInicio() {
    const cabecera = document.querySelector(".sm-header");
    const alto = (cabecera ? cabecera.offsetHeight : 72) + riel.offsetHeight + 12;
    const tope = grid.getBoundingClientRect().top + window.scrollY - alto;
    if (window.scrollY <= tope) return;
    if (TS.lenis) TS.lenis.scrollTo(tope, { immediate: true });
    else window.scrollTo(0, tope);
  }

  async function elegir(id, { desdeHash = false } = {}) {
    if (!CATEGORIAS.some((c) => c.id === id)) id = "todos";
    if (id === actual) return;
    const mio = ++turno;
    const primera = actual === null;
    actual = id;

    tabs.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.cat === id)));
    colocarMarca(!primera);
    if (!desdeHash) {
      history.replaceState(null, "", id === "todos" ? location.pathname + location.search : "#" + id);
    }

    if (!primera) await salir();
    if (mio !== turno) return;          // el visitante ya eligió otra
    pintar(id);
    if (!primera) volverAlInicio();
    observarEntradas();
    // Plato inclinado (TiltedCard, js/reactbits.js): solo con ratón y fuera del modo calmo
    if (window.ReactBits) grid.querySelectorAll(".plato--foto").forEach((t) => ReactBits.PlatoInclinado(t));
  }

  const categoriaDeHash = () => decodeURIComponent(location.hash.slice(1));
  window.addEventListener("hashchange", () => elegir(categoriaDeHash() || "todos", { desdeHash: true }));
  elegir(categoriaDeHash() || "todos", { desdeHash: true });
})();
