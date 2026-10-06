/* =========================================================
   El Tío Sam Chifa — precarga.js
   Va en el <head> (bloqueante y diminuto): decide cosas que
   deben estar listas ANTES del primer pintado.
   ========================================================= */
(function () {
  "use strict";
  try {
    // 1. Vista previa: ?motion=full ignora "reducir movimiento" del sistema
    //    (Windows con animaciones desactivadas lo activa). Se recuerda en la pestaña.
    if (/[?&]motion=full\b/.test(location.search)) sessionStorage.setItem("tsMotion", "full");
    if (sessionStorage.getItem("tsMotion") === "full") {
      const mm = window.matchMedia.bind(window);
      window.matchMedia = (q) => mm(/prefers-reduced-motion/.test(q) ? "not all" : q);
    }

    // 2. Transición entre páginas: si venimos de un enlace interno, la página
    //    nace cubierta por el telón (sitio.js lo retira con animación).
    const conTelon = sessionStorage.getItem("tsTelon") === "1";
    sessionStorage.removeItem("tsTelon");
    if (conTelon && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("telon-entrada");
    }
  } catch (e) {
    /* sessionStorage bloqueado: la página funciona igual, sin estos extras */
  }
})();
