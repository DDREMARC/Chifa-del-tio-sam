/* =========================================================
   El Tío Sam Chifa — precarga.js
   Va en el <head> (bloqueante y diminuto): decide cosas que
   deben estar listas ANTES del primer pintado.

   Modo de movimiento (html[data-motion]):
     full  → todo el movimiento.
     calm  → el sistema pide "reducir animaciones" (en Windows basta con
             tener "Efectos de animación" apagado, algo muy común en
             portátiles modestos). No se apaga todo: se quitan el scroll
             suave, el parallax, los desplazamientos grandes y el telón,
             pero se mantienen fundidos, cambios de color y la respuesta
             al pulsar, para que el sitio no se sienta congelado.
   ?motion=full fuerza "full" (se recuerda en la pestaña).
   ========================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var modo = "full";
  // ¿El navegador hace la transición entre páginas por sí mismo? (Chrome/Edge 126+, Safari 18.2+)
  var vtNativo = "PageRevealEvent" in window && "PageSwapEvent" in window;
  if (vtNativo) root.classList.add("vt-nativo");
  try {
    if (/[?&]motion=full\b/.test(location.search)) sessionStorage.setItem("tsMotion", "full");
    var forzado = sessionStorage.getItem("tsMotion") === "full";
    if (forzado) {
      // Los demás scripts (y el motor del recorrido) consultan la media query: se la ocultamos
      var mm = window.matchMedia.bind(window);
      window.matchMedia = function (q) { return mm(/prefers-reduced-motion/.test(q) ? "not all" : q); };
    } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      modo = "calm";
    }

    // Transición entre páginas con el telón de JS: solo en modo full y solo si el
    // navegador NO hace la transición nativa entre documentos (View Transitions).
    var conTelon = sessionStorage.getItem("tsTelon") === "1";
    sessionStorage.removeItem("tsTelon");
    if (conTelon && modo === "full" && !vtNativo) root.classList.add("telon-entrada");
  } catch (e) {
    /* sessionStorage bloqueado: la página funciona igual, sin estos extras */
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) modo = "calm";
  }
  root.setAttribute("data-motion", modo);

  /* Transición nativa entre páginas (View Transitions entre documentos). La luz del farol
     se abre desde donde se tocó el enlace: aquí se guardan y recuperan esas coordenadas.
     Va en el <head> porque "pagereveal" se dispara antes del primer pintado. */
  if (vtNativo) {
    var ultimo = null;
    addEventListener("click", function (e) {
      var x = e.clientX, y = e.clientY;
      if (e.detail === 0 || (!x && !y)) {
        // Clic hecho con el teclado: el navegador da 0,0 y la luz saldría de la esquina. Sale del centro del enlace.
        var a = e.target && e.target.closest ? e.target.closest("a") : null;
        if (a) { var r = a.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
        else { x = innerWidth / 2; y = innerHeight * 0.6; }
      }
      ultimo = [Math.round(x), Math.round(y)];
    }, true);
    addEventListener("pageswap", function (e) {
      try {
        var tipo = e.activation && e.activation.navigationType;
        if (e.viewTransition && ultimo && tipo !== "traverse") sessionStorage.setItem("tsVt", ultimo.join(","));
        else sessionStorage.removeItem("tsVt");
      } catch (err) { /* sin coordenadas: la luz se abre desde el centro */ }
    });
    addEventListener("pagereveal", function (e) {
      var xy = null;
      try { xy = (sessionStorage.getItem("tsVt") || "").split(","); sessionStorage.removeItem("tsVt"); } catch (err) { xy = null; }
      if (e.viewTransition && xy && xy.length === 2 && xy[0] !== "") {
        root.style.setProperty("--vt-x", xy[0] + "px");
        root.style.setProperty("--vt-y", xy[1] + "px");
      }
    });
  }
})();
