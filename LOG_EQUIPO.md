# LOG_EQUIPO.md

Registro compartido del equipo de agentes. Leer antes de actuar.
Al terminar cada tarea, añadir una entrada en tu sección: archivos modificados, funciones añadidas o cambiadas, y el commit.

**Roles**
- Claude 1: DOM y seguridad
- Claude 2: assets y documentación
- Claude 3: UI/UX
- Claude 4: lead QA

**Rama de integración:** `claude/funny-rubin-qqu1yz` (Lead QA). Aquí se unieron las ramas de Claude 1, 2 y 3; después pasa a `main`. Las ramas de herramientas antiguas (`install-7-skills`, `levoble-import`, `vibrant-einstein`) no se unen.

## Estado general (2026-10-11)

- Unificado: 38 platos reales en **6 categorías** (Sopas, Chaufas, Aeropuertos, Combinados y Tallarines, Platos Saltados, Platos Dulces), cristal nocturno de Claude 3, `escapeHtml` y 48px de Claude 1, fotos reales de la portada y logo `logo_tio_sam.jpeg` de Claude 2.
- Sin testimonios inventados (portada y Contacto). Todos los enlaces de Maps usan `https://maps.app.goo.gl/sFH6uKQQWRxwaUtH8`.
- Panel móvil: si GSAP no carga, el menú lateral ya no bloquea los toques (ver Claude 4).

## Pendientes

| Tema | Responsable sugerido | Estado |
|---|---|---|
| `MENU_WHATSAPP = "51987654321"` y el teléfono del pie parecen de prueba | Dueño / Lead QA | Pendiente: número real |
| Precios (`S/ —`) y descripciones de la mayoría de los 38 platos | Dueño | Pendiente: datos reales |
| `mostrito.jpeg` y `orjita_china.jpeg` sin plato asignado (no figuran en la carta impresa) | Dueño | Pendiente |
| Animaciones GSAP sin verificar: el CDN no carga en el entorno de prueba | Claude 3, Claude 4 | Pendiente: prueba con CDN en un móvil real |
| Horario "martes a domingo 12:00–10:00" y redes (`href="#"`) sin confirmar | Dueño | Pendiente |
| Rama `claude/stoic-hypatia-5pmjcf` (solo carta, 38 platos con otra versión) | Lead QA | Superada por la carta unificada; no se une |

## Claude 1 — DOM y seguridad

### 2026-10-11

- **Sincronización con `main`:** `git checkout main` y `git pull origin main` (avance rápido a `fd058d8`). No hubo cambios en archivos. Después volví a la rama de trabajo.
- **Verificación de `escapeHtml`:** en la rama de trabajo, `buildItemCard` escapa `item.name`, `item.desc` y `item.price` (`js/main.js`, líneas 171 a 173). En `main` no existe.
- **`ab9412b`:** área táctil de 48px.
  - Archivos: `css/style.css`, `css/option-wheel.css`, `css/staggered-menu.css`.
  - Funciones: ninguna (solo CSS).
- **`c961617`:** escape en tarjetas, enlaces de Maps.
  - Archivos: `js/main.js`, `html/index.html`, `html/carta.html`, `html/contacto.html`, `css/style.css`.
  - Funciones: `buildItemCard` (modificada); helper `escapeHtml` (creado en `main.js`, luego movido).
- **`5209cce`:** escape compartido.
  - Archivos: `js/sitio.js`, `js/main.js`, `js/experiencia.js`.
  - Funciones: `escapeHtml` añadida en `js/sitio.js` y expuesta como `TioSam.escapeHtml`; `renderFlowing` modificada en `js/experiencia.js`.
- **`7e98936`:** merge de `origin/main` en la rama de trabajo, sin conflictos.
- **`c3abe1d`:** 38 platos y logo nuevo.
  - Archivos: `js/menu-data.js` (38 platos, 5 categorías), `html/carta.html` (descripción y subtítulo), `html/index.html`, `html/contacto.html`, `index.html`, `js/staggered-menu.js` (logo `img/logo_tio_sam.jpeg`).
  - Funciones: ninguna.
- **Verificación:** sintaxis correcta en los archivos JS. Prueba en navegador a 375px: sin scroll horizontal, 38 platos renderizados con nombres exactos (16 con `+`), ningún botón visible menor de 48px, enlaces de Maps correctos.
- **Commit de esta entrada:** ver `git log` (queda después de este archivo).

## Claude 2 — assets y documentación

### 2026-10-11

Rama de trabajo propia: `claude/stoic-archimedes-y1rvtt` (PR 1 hacia `main`: https://github.com/DDREMARC/Chifa-del-tio-sam/pull/1). No se escribió en `main`.

- **Sincronización:** `git checkout main` y `git pull origin main` (ya estaba en `fd058d8`). `LOG_EQUIPO.md` no existe en `main`; lo copié desde `origin/claude/vibrant-wright-0n45bh`.
- **`ac2c2f0`:** portada con fotos reales.
  - Archivos: `html/index.html` (sección "clásicos": `chaufa_especial.jpeg`, `lomo_saltado.jpeg`, `aeropuerto_especial.jpeg`; título "Tres clásicos de la casa"), `CLAUDE.md`, `PRODUCT.md`.
- **`2e778d1`:** logo oficial en todas partes.
  - Archivos: `html/index.html`, `html/carta.html`, `html/contacto.html`, `index.html`, `js/staggered-menu.js`, `video/CLAUDE.md` (de `logo.jpg` a `logo_tio_sam.jpeg`); `js/menu-data.js` (solo un comentario de ejemplo).
- **`94bcde0`:** Maps y estado de la carta.
  - Archivos: `html/index.html`, `html/carta.html`, `html/contacto.html` (5 enlaces a `https://maps.app.goo.gl/sFH6uKQQWRxwaUtH8` con `rel="noopener noreferrer"`), `CLAUDE.md`, `PRODUCT.md`.
- **Documentación vigente** (`CLAUDE.md`, `PRODUCT.md`): logo oficial `img/logo_tio_sam.jpeg`, ubicación de Maps, imágenes en reserva `mostrito.jpeg` y `orjita_china.jpeg`, y estado de la carta (38 platos en 5 secciones, no 6).
- **Funciones:** ninguna añadida ni cambiada (solo HTML y documentación).
- **Para el lead QA:** esta rama y `claude/vibrant-wright-0n45bh` cambian las mismas líneas de logo y Maps en los HTML. Al unirlas habrá conflictos menores; el resultado debe quedarse con `logo_tio_sam.jpeg` y la URL `sFH6uKQQWRxwaUtH8`. Mi rama no tiene los 38 platos ni el escape de texto: vienen de la otra.
- **No verificado:** no se probó en navegador; solo se comprobó que cada ruta de imagen apunte a un archivo existente.
- **Commit de esta entrada:** ver `git log` (queda después de este archivo).

## Claude 3 — UI/UX

### 2026-10-11

- **Rama:** `claude/vigilant-fermat-k32czj` → PR #2 hacia `main` (https://github.com/DDREMARC/Chifa-del-tio-sam/pull/2). Ya incluye la rama del equipo (merge `268bc28`).
- **Sincronización:** `git checkout main` y `git pull origin main`: sin cambios (`fd058d8`). Merge de `origin/claude/vibrant-wright-0n45bh` en mi rama.
  - Conflictos resueltos: se quedan los 38 platos del equipo, mi diseño y `rel="noopener noreferrer"`.
- **`6aade96`:** carta nocturna, respuesta táctil y tarjeta de Maps.
  - Tokens nuevos en `css/style.css`: `--night: #0D0D0D`, `--gold-line: #E5A93B`, `--ease-tactil: cubic-bezier(0.16, 1, 0.3, 1)`.
  - `html/carta.html`: `<body class="carta-noche">`, con fondo de noche y resplandor de farolillos. Títulos de categoría en dorado, con filete.
  - `.menu-item`: cristal oscuro `rgba(13,13,13,.8)`, borde `rgba(229,169,59,.25)`, `backdrop-filter: blur(12px)`.
  - `.menu-item__order`: dorado, 48px, alineado al pie de la tarjeta.
  - `:active` → `scale(0.96)` con `transform .15s var(--ease-tactil)` en `.btn`, `.menu-item__order`, `.maps-card`, `.foot-maps`, `.wheel-trigger`, `.sm-toggle`, `.clasicos__more` y `.foot-social a`. Solo anima `transform`.
  - `html/contacto.html`: `.maps-card`, tarjeta táctil de 64px con la dirección.
  - Corrige imágenes rotas en la portada: "Los clásicos" usa `chaufa_especial`, `aeropuerto_especial` y `lomo_saltado`. Esto resuelve la fila de la tabla de pendientes.
- **`752ef37`:** viñeta radial en las fotos (`.menu-item__icon::after`).
  - "Cómo llegar" del pie pasa a `.foot-maps`, botón de 48px en las 3 páginas.
  - Contraste AA en el texto del pie.
- **`268bc28`:** merge con los 38 platos.
  - Fotos reales asignadas: Sopa o wantan especial, Chaufa especial, Aeropuerto especial, Tallarín saltado mixto, Lomo saltado + chaufa, Chancho con piña + chaufa.
  - Sus descripciones parten del texto de la carta y añaden kion, sillao, cebolla china y wok a fuego vivo. Los otros 32 platos siguen con "Descripción por confirmar.".
  - `a[href*="maps.app.goo.gl"]` ahora excluye `.maps-card` y `.foot-maps`, para no pisar su layout.
- **Verificación en Chromium (390px y 1280px):**
  - Los 38 `.menu-item` tienen `rgba(13,13,13,0.8)`, borde `rgba(229,169,59,0.25)` 1px y `blur(12px)`.
  - Los 38 botones de pedido miden 48px.
  - Al pulsar, `transform: matrix(0.96…)`.
  - Sin scroll horizontal ni errores 404.
- **Fotos sin plato:** `mostrito.jpeg` y `orjita_china.jpeg`, porque esos platos no figuran en la carta del local.

## Claude 4 — lead QA

### 2026-10-11

- **Unificación en `claude/funny-rubin-qqu1yz`** (merge en orden: Claude 1, Claude 2, Claude 3).
  - `js/menu-data.js`: se mantiene la carta de 6 categorías y 38 platos con fotos asignadas; no entró la carta de 23 platos.
  - `css/style.css`: se mantiene el acabado de Claude 3 (`rgba(13,13,13,.8)`, borde `#E5A93B`, `blur(12px)`, `scale(.96)`). Se quitó el bloque duplicado propio y la tarjeta `.ruta-card` (queda `.maps-card`).
  - `js/main.js`: `escapeHtml` de Claude 1 + `renderTimer` (si se cambia rápido de categoría, solo se pinta la última).
  - HTML: logo, fotos de la portada y `rel="noopener noreferrer"` de Claude 1/2.
- **Testimonios:** quitados el de "Carlos M." (portada) y las 3 reseñas inventadas de `html/contacto.html`.
- **Fix panel móvil sin GSAP:** `css/staggered-menu.css` (`.staggered-menu-panel` con `pointer-events:none`, solo `.is-active` lo activa; modo `.sm-sin-gsap` con transición CSS) y `js/staggered-menu.js` (clase `is-active` y ruta sin GSAP en lugar de lanzar error).
- **Limpieza:** se borraron de `img/` las copias de `chaufa_carne/pollo/chancho.jpg` (ya no se usan; siguen en `video/public/img/`). Tarjetas sin descripción: espacio de 14px antes del botón.
- **Verificación (Chromium 390px, CDN bloqueado = sin GSAP):** las 3 páginas cargan sin errores; la carta pinta 38 tarjetas; sin scroll horizontal; con el menú cerrado el panel no intercepta toques y abierto sí; Maps correcto en todas; "Carlos" no aparece en la portada.
- **No verificado:** animaciones con GSAP, filtro de las 6 categorías a 60 fps en un móvil real.


## Rediseño nocturno (UI/UX)

### 2026-10-11

- **Dirección de arte:** diorama nocturno. Planos de laca oscura (`--noche-0…3`), texto papel de arroz, una sola luz ámbar (`--farol`), bermellón solo en los faroles. Se acabaron el rojo plano, el dorado plano y el cristal con blur. Detalle en `DESIGN.md`.
- **Tipografía:** Gloock (títulos, un solo peso) + Hanken Grotesk (texto). Reemplazan a Fraunces + Work Sans.
- **CSS reorganizado:** `style.css` (tokens, base, botones, pie), `staggered-menu.css`, y una hoja por página: `carta.css`, `contacto.css`, `experiencia.css`. Se borraron `option-wheel.css` y `js/option-wheel.js`.
- **Carta:** la ruleta de categorías se cambió por pestañas siempre visibles con marca deslizante y enlace directo (`carta.html#chaufas`). Los platos con foto son tarjetas; el resto, filas de lista (se acabó el "Foto próximamente" repetido). Precio sin confirmar ("S/ —") atenuado. Botón de pedido de las filas: icono de 48px con `aria-label` por plato.
- **Movimiento:** salida de 150 ms y entrada escalonada de 440 ms en la carta (Web Animations + IntersectionObserver, sin GSAP). Menú lateral 100 % CSS: se interrumpe sin saltos, con Escape, foco atrapado e `inert` cerrado. Todo respeta "reducir movimiento".
- **Contacto:** mapa grande (tono noche) + datos en lista; se quitaron las tarjetas icono+título+texto, el velo girado de reservas y las redes con `href="#"`.
- **Redes:** `REDES` en `js/sitio.js`. Mientras una dirección esté vacía, ese icono no se muestra. Para activarlas, pegar la URL real.
- **Logo:** el sello dibujado se cambió por `img/logo_tio_sam.jpeg` en la portada, el pie y el telón de transición.
- **Arreglo previo:** el telón entre páginas nunca llegaba a cubrir (un `transform` del CSS se sumaba al de GSAP). Corregido en `style.css`.
- **Portada:** quitados rótulos sobre títulos y numeración del motor, textos "ESCENA PROVISIONAL" de los pósters (siguen siendo dibujos provisionales, ahora en la paleta nocturna). WebGL de los clásicos más sutil. Botones de acción en el hero (Ver la carta / Cómo llegar). Cierre sin pin: la luz del farol se abre al llegar.
- **Verificación (Chromium, GSAP local):** 37 comprobaciones automáticas de carta, menú, teclado, clics rápidos, movimiento reducido, navegación y móvil (390 px sin scroll horizontal). **No verificado:** mapa de Google (bloqueado en el entorno; el filtro oscuro del iframe está sin ver), animaciones en un móvil real, rendimiento del WebGL.
- **Pendiente heredado:** teléfono/WhatsApp `51987654321` y horario siguen sin confirmar.


## Movimiento v2 y tipografía premium

### 2026-10-11

- **Tipografía:** Cormorant Garamond (títulos, serif de alto contraste) + DM Sans (texto y botones), por Google Fonts. Reemplazan a Gloock + Hanken Grotesk. Sin cursivas ni fuentes del sistema; respaldos con métricas calzadas para que el texto no salte al cargar; cifras alineadas. Detalle en `DESIGN.md`.
- **Portada:** el "CHIFA" bajo el título pasó de cursiva a rótulo en mayúsculas, con interletrado y en ámbar.
- **Títulos animados (SplitText):** la máscara de cada palabra hereda el nombre de la clase de la palabra + `-mask` (`.split-word-mask`); no existe una opción `maskClass`. Con relleno de más ya no se cortan los acentos ni la "¿" ni la cola de la "j".
- **Carta:** la foto de cada plato se descubre de abajo hacia arriba (cortina) y el texto llega después. El "+" de los nombres usa la letra de texto.
- **Contacto (formulario, hoy desactivado):** rótulo ámbar al enfocar, hilo de luz bajo el campo, botón táctil (se hunde y vuelve con muelle), selector con flecha propia, error solo tras escribir.
- **Movimiento:** modo `full`/`calm` (con "reducir animaciones" el sitio sigue vivo, solo funde), transición nativa entre páginas (View Transitions) con telón de GSAP solo de respaldo, animaciones ligadas al scroll con CSS, GSAP 3.15.0 + ScrollTrigger + SplitText y Lenis 1.3.26 con versión fijada en jsDelivr. Framer Motion no se usó: es para React, y su versión sin React (`motion`) sumaba unos 48 KB y repetía lo que ya hacen GSAP y CSS.
- **Verificación (Chromium, librerías en local):** 29 comprobaciones de la carta, 8 de menú y navegación, 10 sin CDN; axe sin violaciones en las 3 páginas (escritorio y móvil); desplazamiento de diseño ≤ 0.01; scroll a 16.7 ms por cuadro (p95) con la CPU frenada 4×. **No verificado:** jsDelivr y Google Fonts en línea desde un navegador real (el entorno bloquea parte), el filtro oscuro del mapa, un móvil de verdad.
- **Letrero "Próximamente" en reservas:** una placa con filete ámbar cuelga sobre el formulario (en el celular lo acompaña al bajar). Se muestra solo mientras el `<fieldset>` tenga `disabled`: al abrir las reservas basta quitar ese atributo. Es solo visual; la etiqueta del título y el texto de arriba siguen avisando a los lectores de pantalla. Probado en escritorio, tableta y 320 px, con movimiento reducido y sin librerías externas.
- **Revisión con la investigación de movimiento (cuatro arreglos medidos):**
  - La cabecera se apagaba y volvía a aparecer en cada cambio de página (la creaba el JS al final y la transición nativa no la veía en la página nueva). Ahora viene escrita en el HTML de las 3 páginas y el JS solo agrega velo, capas y panel (queda una copia de respaldo en `staggered-menu.js`: mantener ambas iguales).
  - En móvil acostado o ventana baja el panel del menú no se podía desplazar (Lenis detenido cancelaba la rueda y el toque) y el botón de WhatsApp quedaba fuera de pantalla: el panel lleva `data-lenis-prevent` y se compacta con menos de 560 px de alto.
  - Navegando con el teclado (Enter) la luz del farol salía de la esquina superior izquierda; ahora sale del centro del enlace.
  - El botón magnético de la portada no se hundía al pulsar (GSAP pisaba la escala) y su transición CSS iba encadenada con la de GSAP; ahora GSAP hace la pulsación y no hay transición CSS sobre transform.
- **Pendiente heredado:** teléfono/WhatsApp `51987654321` y horario siguen sin confirmar.


## Piezas de React Bits (Claude 3, UI/UX)

### 2026-10-11

- **Pedido:** subir el nivel del sitio con componentes de https://reactbits.dev. Se clonó el repositorio oficial (`DavidHDev/react-bits`) y se eligieron 5 de ~200 que encajan con `DESIGN.md` (una sola luz, sin cristal, sin texto con degradado, sin halos).
- **Nuevo `js/reactbits.js`:** los 5 pasados a JS sin React ni librerías (`window.ReactBits`). Lleva el aviso de licencia de React Bits (MIT + Commons Clause): no quitarlo.
  - `LuzFarol` ← LightRays: WebGL puro (sin ogl), haces ámbar desde el farol de la cabecera de Carta y Contacto; DPR máx. 1,5 (1,25 en táctil), se pausa fuera de pantalla y con la pestaña oculta.
  - `TextoCircular` ← CircularText: anillo "El Tío Sam · Chifa · Barrios Altos" alrededor del logo del hero; acelera con el ratón encima.
  - `LetreroVelocidad` ← ScrollVelocity: banda de la portada con nombres reales de `menu-data.js` (sin "+ chaufa"), dos filas en sentidos opuestos que se aceleran con el scroll. `aria-hidden`.
  - `PlatoInclinado` ← TiltedCard: tarjetas con foto de la carta, giro 3D con muelle (damping 30, stiffness 100, mass 2) y luz soft-light que sigue al cursor. Solo con ratón; usa `rotate`/`scale` para no pisar el `transform` de las entradas y salidas.
  - `ChispasWok` ← ClickSpark: chispas ámbar al pulsar enlaces `wa.me` y `.btn--farol`; un solo lienzo fijo que solo dibuja mientras hay chispas.
- **Archivos:**
  - `html/index.html`: `.xp-hero__sello` envuelve el logo; `#letreroPlatos` entre los clásicos y la carta rápida.
  - Las 3 páginas cargan `reactbits.js` antes de `sitio.js`.
  - CSS: `css/style.css` (bloque "Piezas de React Bits"), `css/experiencia.css` (sello) y `css/carta.css` (perspectiva y luz de la tarjeta).
  - JS: `js/sitio.js` (`initReactBits`: chispas + luz), `js/experiencia.js` (`initSello`, `initLetrero`; la animación del hero ahora mueve `.xp-hero__sello`) y `js/main.js` (inclinación tras pintar).
  - Docs: `CLAUDE.md` y `DESIGN.md` (tabla de piezas).
- **Modo calmo:** ninguna pieza se mueve. El anillo y el letrero se muestran quietos; no hay luz WebGL ni chispas. Ninguna depende de GSAP.
- **Verificación (Chromium con GSAP local, 1440 y 390 px):**
  - Sin errores en consola en las 3 páginas.
  - Luz encendida en Carta y Contacto.
  - Anillo de 37 letras girando y letrero en movimiento.
  - Tarjeta inclinada (`rotate` 6,3°, `scale` 1,02) y de vuelta a cero al salir.
  - Chispas visibles al pulsar.
  - Modo calmo comprobado.
  - El detector de impeccable no suma avisos nuevos: los 3 que da ya estaban en `main`.
- **No verificado:** rendimiento del WebGL de la cabecera en un móvil real de gama media.


## Revisión visual móvil y tipografía

### 2026-10-11

- **Hallazgos del video** (`WhatsApp Video 2026-10-11 at 5.51.55 PM.mp4`): durante desplazamientos rápidos algunas filas podían quedar transparentes si el navegador saltaba el umbral del `IntersectionObserver`; las tarjetas con foto mantenían una cortina larga y dejaban el texto oculto un momento; las pestañas laterales de la carta se veían cortadas sin indicar que el riel continuaba.
- **Correcciones:** `js/main.js` amplía el margen de observación, recupera al desplazarse las piezas que quedaron atrás sin animarse y comunica el desborde del riel con fundidos laterales que se actualizan al moverlo, cambiar el tamaño o cargar la fuente. `css/carta.css` reduce la cortina de las fotos a 480 ms y el retraso del texto a 90 ms.
- **Tipografía:** Newsreader reemplaza a Cormorant Garamond en títulos y nombres de platos; DM Sans se mantiene para lectura y controles. Se actualizaron los tres enlaces a Google Fonts, el fallback serif y la configuración de la portada. Detalles en `DESIGN.md`.
- **Archivos:** `js/main.js`, `css/carta.css`, `css/style.css`, `css/experiencia.css`, `html/index.html`, `html/carta.html`, `html/contacto.html`, `DESIGN.md`, `CLAUDE.md`, `LOG_EQUIPO.md`.
- **Verificación:** revisión del video en cuadros de móvil y comparación con el flujo de entrada de las tarjetas. No se ejecutaron pruebas automatizadas; falta confirmar la apariencia en un teléfono real y la carga de Google Fonts en producción.
