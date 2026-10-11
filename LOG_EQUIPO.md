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
