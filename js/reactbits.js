/* =========================================================
   El Tío Sam Chifa — reactbits.js
   Cinco piezas de React Bits pasadas a JS sin React ni librerías,
   con la paleta del diorama (una sola luz: el farol).

     LuzFarol       ← LightRays      rayos de luz que bajan del farol (WebGL puro, sin ogl)
     TextoCircular  ← CircularText   rótulo que gira alrededor del logo
     LetreroVelocidad ← ScrollVelocity  nombres de platos que corren con el scroll
     PlatoInclinado ← TiltedCard     la tarjeta se inclina hacia el puntero y la luz la recorre
     ChispasWok     ← ClickSpark     chispas ámbar al pedir

   Cada pieza: se apaga en modo calmo (TioSam.calm) o devuelve null si no
   hay soporte; solo corre su bucle mientras se ve; nada depende de GSAP.

   Basado en React Bits — https://reactbits.dev
   Copyright (c) 2026 David Haz. Licencia MIT + Commons Clause:
   https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
   ========================================================= */
(function () {
  "use strict";

  const calm = () => document.documentElement.dataset.motion === "calm";
  const punteroFino = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
  const FAROL = [0.93, 0.698, 0.3];          // --farol oklch(.80 .135 78) en sRGB

  /* Corre fn solo mientras el elemento está en pantalla y la pestaña visible */
  function mientrasSeVea(el, alEntrar, alSalir) {
    let enPantalla = false;
    const cambiar = () => {
      const activo = enPantalla && !document.hidden;
      activo ? alEntrar() : alSalir();
    };
    const io = new IntersectionObserver(([e]) => { enPantalla = e.isIntersecting; cambiar(); }, { threshold: 0 });
    io.observe(el);
    document.addEventListener("visibilitychange", cambiar);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", cambiar); alSalir(); };
  }

  /* =========================================================
     1. LuzFarol (LightRays): haces de luz que nacen en el farol y
        caen sobre la cabecera. Un triángulo a pantalla completa y un
        fragment shader; la intensidad es baja para no tapar el título.
  ========================================================= */
  const VERT = `
attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

  const FRAG = `precision highp float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float fadeDistance;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float intensity;

float noise(vec2 st){ return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123); }

float rayStrength(vec2 src, vec2 dir, vec2 coord, float seedA, float seedB, float speed){
  vec2 v = coord - src;
  float cosAngle = dot(normalize(v), dir);
  float a = cosAngle + distortion * sin(iTime * 2.0 + length(v) * 0.01) * 0.2;
  float spread = pow(max(a, 0.0), 1.0 / max(lightSpread, 0.001));
  float d = length(v);
  float maxD = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxD - d) / maxD, 0.0, 1.0);
  float fadeFalloff = clamp((iResolution.x * fadeDistance - d) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float base = clamp(
    (0.45 + 0.15 * sin(a * seedA + iTime * speed)) +
    (0.30 + 0.20 * cos(-a * seedB + iTime * speed)), 0.0, 1.0);
  return base * lengthFalloff * fadeFalloff * spread;
}

void main(){
  vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
  vec2 dir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 m = normalize(mousePos * iResolution - rayPos);
    dir = normalize(mix(rayDir, m, mouseInfluence));
  }
  float s = rayStrength(rayPos, dir, coord, 36.2214, 21.11349, 1.5 * raysSpeed) * 0.5
          + rayStrength(rayPos, dir, coord, 22.3991, 18.0234, 1.1 * raysSpeed) * 0.4;
  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    s *= 1.0 - noiseAmount + noiseAmount * n;
  }
  // La luz se apaga hacia abajo (el original además viraba a azul: aquí solo ámbar)
  float caida = 0.25 + 0.75 * (1.0 - coord.y / iResolution.y);
  float alpha = clamp(s * caida * intensity, 0.0, 1.0);
  gl_FragColor = vec4(raysColor, alpha);
}`;

  function LuzFarol(contenedor, opciones = {}) {
    if (calm()) return null;
    const o = Object.assign({
      origen: null,            // () => [x, y] en px CSS dentro del contenedor; por defecto arriba al centro
      color: FAROL,
      velocidad: 0.6,
      apertura: 0.85,          // lightSpread
      largo: 1.5,              // rayLength
      desvanecer: 1.1,         // fadeDistance
      ruido: 0.06,
      distorsion: 0.04,
      intensidad: 0.55,
      seguirPuntero: 0.06,     // 0 = no sigue al ratón
    }, opciones);

    const canvas = document.createElement("canvas");
    canvas.className = "luz-farol";
    canvas.setAttribute("aria-hidden", "true");
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return null;

    function compilar(tipo, src) {
      const s = gl.createShader(tipo);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    const vs = compilar(gl.VERTEX_SHADER, VERT);
    const fs = compilar(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    // Un triángulo que cubre toda la pantalla (lo mismo que Triangle de ogl)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ["iTime", "iResolution", "rayPos", "rayDir", "raysColor", "raysSpeed", "lightSpread", "rayLength",
      "fadeDistance", "mousePos", "mouseInfluence", "noiseAmount", "distortion", "intensity"]
      .forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
    gl.uniform3fv(U.raysColor, o.color);
    gl.uniform1f(U.raysSpeed, o.velocidad);
    gl.uniform1f(U.lightSpread, o.apertura);
    gl.uniform1f(U.rayLength, o.largo);
    gl.uniform1f(U.fadeDistance, o.desvanecer);
    gl.uniform1f(U.noiseAmount, o.ruido);
    gl.uniform1f(U.distortion, o.distorsion);
    gl.uniform1f(U.intensity, o.intensidad);
    gl.uniform2f(U.rayDir, 0, 1);
    const sigue = o.seguirPuntero > 0 && punteroFino();
    gl.uniform1f(U.mouseInfluence, sigue ? o.seguirPuntero : 0);
    gl.uniform2f(U.mousePos, 0.5, 1);
    gl.clearColor(0, 0, 0, 0);

    contenedor.prepend(canvas);

    let dpr = 1;
    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, punteroFino() ? 1.5 : 1.25);
      const w = contenedor.clientWidth, h = contenedor.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.iResolution, canvas.width, canvas.height);
      const [x, y] = o.origen ? o.origen() : [w / 2, -0.2 * h];
      gl.uniform2f(U.rayPos, x * dpr, y * dpr);
    }
    const ro = new ResizeObserver(medir);
    ro.observe(contenedor);
    medir();

    // El ratón tuerce un poco los haces, con suavizado (como el original: 0.92 por cuadro)
    const raton = { x: 0.5, y: 1 }, suave = { x: 0.5, y: 1 };
    const alMover = (e) => {
      const r = contenedor.getBoundingClientRect();
      raton.x = (e.clientX - r.left) / r.width;
      raton.y = (e.clientY - r.top) / r.height;
    };
    if (sigue) addEventListener("pointermove", alMover, { passive: true });

    let raf = 0;
    const t0 = performance.now();
    function cuadro(t) {
      gl.uniform1f(U.iTime, (t - t0) * 0.001);
      if (sigue) {
        suave.x = suave.x * 0.92 + raton.x * 0.08;
        suave.y = suave.y * 0.92 + raton.y * 0.08;
        gl.uniform2f(U.mousePos, suave.x, suave.y);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(cuadro);
    }
    const parar = mientrasSeVea(contenedor,
      () => { if (!raf) { canvas.classList.add("is-on"); raf = requestAnimationFrame(cuadro); } },
      () => { cancelAnimationFrame(raf); raf = 0; });

    return {
      destruir() {
        parar(); ro.disconnect();
        removeEventListener("pointermove", alMover);
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
        canvas.remove();
      },
    };
  }

  /* =========================================================
     2. TextoCircular (CircularText): letras repartidas en un anillo
        que gira. Con el puntero encima acelera (onHover="speedUp")
        y frena con suavidad al salir. El giro lo hace JS para que el
        cambio de velocidad no salte.
  ========================================================= */
  function TextoCircular(anillo, texto, opciones = {}) {
    const o = Object.assign({ vuelta: 28, alPasar: 4, zonaHover: anillo }, opciones);
    const letras = Array.from(texto);
    anillo.classList.add("texto-circular");
    anillo.setAttribute("aria-hidden", "true");
    anillo.innerHTML = letras
      .map((l, i) => `<span style="transform:rotate(${((360 / letras.length) * i).toFixed(3)}deg)">${l === " " ? "&nbsp;" : l}</span>`)
      .join("");
    if (calm()) return null;

    let angulo = 0, vel = 360 / o.vuelta, objetivo = vel, raf = 0, antes = 0;
    const base = 360 / o.vuelta;
    function cuadro(t) {
      const dt = Math.min(0.05, (t - (antes || t)) / 1000);
      antes = t;
      vel += (objetivo - vel) * Math.min(1, dt * 4);   // acelera y frena como un muelle blando
      angulo = (angulo + vel * dt) % 360;
      anillo.style.transform = `rotate(${angulo.toFixed(2)}deg)`;
      raf = requestAnimationFrame(cuadro);
    }
    if (punteroFino()) {
      o.zonaHover.addEventListener("pointerenter", () => { objetivo = base * o.alPasar; });
      o.zonaHover.addEventListener("pointerleave", () => { objetivo = base; });
    }
    const parar = mientrasSeVea(anillo,
      () => { if (!raf) { antes = 0; raf = requestAnimationFrame(cuadro); } },
      () => { cancelAnimationFrame(raf); raf = 0; });
    return { destruir: parar };
  }

  /* =========================================================
     3. LetreroVelocidad (ScrollVelocity): filas de texto que corren
        solas y se aceleran (o cambian de sentido) con la velocidad
        del scroll. Filas pares a la izquierda, impares a la derecha.
  ========================================================= */
  function LetreroVelocidad(seccion, filas, opciones = {}) {
    const o = Object.assign({ velocidad: 40, copias: 4, mapa: [0, 1000, 0, 5], amortiguar: 50, rigidez: 400 }, opciones);
    seccion.classList.add("letrero");
    seccion.setAttribute("aria-hidden", "true");
    seccion.innerHTML = filas.map((html) =>
      `<div class="letrero__fila"><div class="letrero__riel">${
        Array.from({ length: o.copias }, () => `<span class="letrero__copia">${html}</span>`).join("")
      }</div></div>`).join("");
    if (calm()) return null;

    const rieles = Array.from(seccion.querySelectorAll(".letrero__riel"));
    // Todas parten con sentido 1; el signo de `base` ya manda las impares hacia el otro lado
    const estado = rieles.map((riel, i) => ({ riel, x: 0, ancho: 0, sentido: 1, base: i % 2 ? -o.velocidad : o.velocidad }));
    const medir = () => estado.forEach((e) => { e.ancho = e.riel.firstElementChild.offsetWidth; });
    const ro = new ResizeObserver(medir);
    ro.observe(seccion);
    medir();

    // Velocidad del scroll suavizada con un muelle (useSpring del original: damping 50, stiffness 400)
    let ultimoY = window.scrollY, velScroll = 0, velSuave = 0, velMuelle = 0, raf = 0, antes = 0;
    const envolver = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };
    function cuadro(t) {
      const dt = Math.min(0.05, (t - (antes || t)) / 1000);
      antes = t;
      if (dt > 0) {
        const y = window.scrollY;
        velScroll = (y - ultimoY) / dt;
        ultimoY = y;
        const fuerza = o.rigidez * (velScroll - velSuave) - o.amortiguar * velMuelle;
        velMuelle += fuerza * dt;
        velSuave += velMuelle * dt;
      }
      const [a, b, c, d] = o.mapa;
      const factor = c + ((velSuave - a) / (b - a)) * (d - c);
      estado.forEach((e) => {
        if (factor < 0) e.sentido = -1; else if (factor > 0) e.sentido = 1;
        let mover = e.sentido * e.base * dt;
        mover += mover * Math.abs(factor);
        e.x += mover;
        if (e.ancho) e.riel.style.transform = `translate3d(${envolver(-e.ancho, 0, e.x).toFixed(2)}px,0,0)`;
      });
      raf = requestAnimationFrame(cuadro);
    }
    const parar = mientrasSeVea(seccion,
      () => { if (!raf) { antes = 0; ultimoY = window.scrollY; raf = requestAnimationFrame(cuadro); } },
      () => { cancelAnimationFrame(raf); raf = 0; });
    return { destruir() { parar(); ro.disconnect(); } };
  }

  /* =========================================================
     4. PlatoInclinado (TiltedCard): la tarjeta gira en 3D hacia el
        puntero con física de muelle (damping 30, stiffness 100, mass 2)
        y una luz cálida sigue al cursor sobre la foto.
        Usa la propiedad `rotate` (eje-ángulo) y `scale`, así no pisa
        el `transform` de las animaciones de entrada y salida.
        Solo con ratón: en táctil no hace nada (el original avisaba).
  ========================================================= */
  function PlatoInclinado(tarjeta, opciones = {}) {
    if (calm() || !punteroFino()) return null;
    const o = Object.assign({ amplitud: 7, escala: 1.02 }, opciones);
    const M = { damping: 30, stiffness: 100, mass: 2 };
    const ejes = { rx: { v: 0, vel: 0, obj: 0 }, ry: { v: 0, vel: 0, obj: 0 }, s: { v: 1, vel: 0, obj: 1 } };
    let raf = 0, antes = 0;

    function paso(m, dt) {
      const a = (-M.stiffness * (m.v - m.obj) - M.damping * m.vel) / M.mass;
      m.vel += a * dt;
      m.v += m.vel * dt;
    }
    function cuadro(t) {
      const dt = Math.min(0.032, (t - (antes || t)) / 1000);
      antes = t;
      // Paso fijo pequeño: el muelle es rígido y con dt grande se vuelve inestable
      for (let k = 0; k < 4; k++) Object.values(ejes).forEach((m) => paso(m, dt / 4));
      const { rx, ry, s } = ejes;
      const ang = Math.hypot(rx.v, ry.v);
      tarjeta.style.rotate = ang > 0.01 ? `${(rx.v / ang).toFixed(4)} ${(ry.v / ang).toFixed(4)} 0 ${ang.toFixed(3)}deg` : "";
      tarjeta.style.scale = Math.abs(s.v - 1) > 0.0005 ? s.v.toFixed(4) : "";
      // Asentado en su objetivo: el bucle se detiene (vuelve a arrancar con el próximo movimiento)
      const quieto = Object.values(ejes).every((m) => Math.abs(m.v - m.obj) < 0.002 && Math.abs(m.vel) < 0.002);
      if (quieto) {
        if (rx.obj === 0 && ry.obj === 0 && s.obj === 1) { tarjeta.style.rotate = ""; tarjeta.style.scale = ""; }
        raf = 0; antes = 0; return;
      }
      raf = requestAnimationFrame(cuadro);
    }
    const arrancar = () => { if (!raf) raf = requestAnimationFrame(cuadro); };

    function alMover(e) {
      const r = tarjeta.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      ejes.rx.obj = (dy / (r.height / 2)) * -o.amplitud;
      ejes.ry.obj = (dx / (r.width / 2)) * o.amplitud;
      tarjeta.style.setProperty("--luz-x", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      tarjeta.style.setProperty("--luz-y", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      arrancar();
    }
    function alEntrar() { ejes.s.obj = o.escala; tarjeta.classList.add("is-inclinado"); arrancar(); }
    function alSalir() {
      ejes.rx.obj = 0; ejes.ry.obj = 0; ejes.s.obj = 1;
      tarjeta.classList.remove("is-inclinado");
      arrancar();
    }
    tarjeta.addEventListener("pointermove", alMover);
    tarjeta.addEventListener("pointerenter", alEntrar);
    tarjeta.addEventListener("pointerleave", alSalir);
    return {
      destruir() {
        cancelAnimationFrame(raf);
        tarjeta.removeEventListener("pointermove", alMover);
        tarjeta.removeEventListener("pointerenter", alEntrar);
        tarjeta.removeEventListener("pointerleave", alSalir);
        tarjeta.style.rotate = ""; tarjeta.style.scale = "";
      },
    };
  }

  /* =========================================================
     5. ChispasWok (ClickSpark): al pulsar un botón de pedido saltan
        chispas ámbar desde el dedo, como del wok. Un solo lienzo fijo
        para toda la página (no hay que envolver cada botón) que solo
        dibuja mientras quedan chispas vivas.
  ========================================================= */
  function ChispasWok(selector, opciones = {}) {
    if (calm()) return null;
    const o = Object.assign({ color: "#f4c56c" /* --farol-claro */, tamano: 10, radio: 22, cantidad: 8, duracion: 420 }, opciones);
    const canvas = document.createElement("canvas");
    canvas.className = "chispas-wok";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let chispas = [], raf = 0, dpr = 1;

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
    }
    medir();
    addEventListener("resize", medir, { passive: true });

    const ease = (t) => t * (2 - t);   // ease-out del original
    function cuadro(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.strokeStyle = o.color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      chispas = chispas.filter((c) => {
        const p = (t - c.t0) / o.duracion;
        if (p >= 1) return false;
        const e = ease(Math.max(0, p));
        const d = e * o.radio, largo = o.tamano * (1 - e);
        const cos = Math.cos(c.ang), sin = Math.sin(c.ang);
        ctx.globalAlpha = 1 - e * 0.6;
        ctx.beginPath();
        ctx.moveTo(c.x + d * cos, c.y + d * sin);
        ctx.lineTo(c.x + (d + largo) * cos, c.y + (d + largo) * sin);
        ctx.stroke();
        return true;
      });
      raf = chispas.length ? requestAnimationFrame(cuadro) : 0;
      if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
    }

    function alPulsar(e) {
      if (e.button > 0 || !e.target.closest || !e.target.closest(selector)) return;
      const t0 = performance.now();
      // Un leve giro al azar para que dos toques seguidos no dibujen la misma estrella
      const giro = Math.random() * Math.PI;
      for (let i = 0; i < o.cantidad; i++) {
        chispas.push({ x: e.clientX, y: e.clientY, ang: giro + (2 * Math.PI * i) / o.cantidad, t0 });
      }
      if (!raf) raf = requestAnimationFrame(cuadro);
    }
    addEventListener("pointerdown", alPulsar, { passive: true });
    return {
      destruir() {
        removeEventListener("pointerdown", alPulsar);
        removeEventListener("resize", medir);
        cancelAnimationFrame(raf);
        canvas.remove();
      },
    };
  }

  window.ReactBits = { LuzFarol, TextoCircular, LetreroVelocidad, PlatoInclinado, ChispasWok };
})();
