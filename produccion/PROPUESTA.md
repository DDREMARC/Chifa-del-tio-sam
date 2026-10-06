# El Tío Sam Chifa — Propuesta "Next Level" (scroll-world)

> Estado: **código funcionando con escenas provisionales**. Los vídeos y stills reales
> se generan con `produccion/render.sh` (Monid/Higgsfield). La experiencia **es la portada**
> (`html/index.html`); carta y contacto comparten las animaciones vía `js/sitio.js`.

## 0. Estructura del sitio (sin duplicados)

| Archivo | Para qué |
|---|---|
| `index.html` (raíz) | Redirige a `html/index.html` |
| `html/index.html` | Portada inmersiva (scroll-world) |
| `html/carta.html`, `html/contacto.html` | Páginas interiores con las mismas animaciones |
| `css/style.css` | Estilos comunes + animaciones compartidas |
| `css/experiencia.css` | Solo la portada |
| `css/option-wheel.css`, `css/staggered-menu.css` | Componentes (ruleta de la carta, menú) |
| `js/precarga.js` | En `<head>`: `?motion=full` y el telón de entrada |
| `js/sitio.js` | Común: menú (su única configuración), Lenis, telón entre páginas, animaciones por atributos `data-anim` |
| `js/experiencia.js` + `js/scroll-world.js` | Solo la portada |
| `js/main.js`, `js/menu-data.js`, `js/option-wheel.js`, `js/staggered-menu.js` | Carta, ruleta y menú |
| `php/` | Reservas en línea (en pausa: **Próximamente**) |

**Animar algo nuevo en cualquier página** no requiere JS: basta un atributo en el HTML.
`data-anim="letras"` (titular letra por letra), `"subir"`, `"cascada"` (hijos en escalera),
`"mascara"` (revelado de imagen), `"sello"` (gira con el scroll) o `data-parallax="60"`.

---

## 1. Enfoque elegido: híbrido

| Capa | Técnica | Por qué |
|---|---|---|
| **Hero + historia** (5 escenas) | **Video scrubbing**: película pre-renderizada con IA; el scroll mueve `currentTime` | Calidad cinematográfica real (luz, humo, fuego) imposible de igualar en tiempo real sin un equipo 3D. El coste en GPU es solo decodificar un vídeo. |
| **Contenido** (clásicos, carta, testimonio, CTA) | **DOM + GSAP ScrollTrigger + un solo lienzo WebGL** | Texto real (SEO, accesibilidad, editable); el WebGL se usa solo donde aporta: distorsión de las fotos. |
| Desplazamiento | **Lenis** (rueda/trackpad) | Inercia orgánica en escritorio. En táctil se deja el scroll nativo (ver §5). |

**Por qué no Three.js para todo:** una escena 3D en tiempo real necesita modelos, texturas y
dirección de arte 3D a medida (semanas de trabajo), pesa más y castiga los móviles de gama
media. **Framer Motion** queda fuera porque el sitio no usa React; GSAP ya estaba cargado.

## 2. Dirección de arte

- **Mundo:** diorama de arcilla mate, isométrico, efecto *tilt-shift*, **de noche**, iluminado por farolillos
  rojos y guirnaldas doradas. Flota sobre el granate de la marca `#2B0A0A`, que también es el fondo
  de la página: las escenas se funden con ella.
- **Paleta (la de tu `style.css`):** granate `#2B0A0A` · rojo `#BE1A1A` · bermellón `#D0311E` ·
  dorado `#F7D87F` · crema `#F8EBAB`, con toques de verde (cebolla china).
- **Tipografía:** Fraunces (titulares) + Work Sans (texto), las mismas de ahora.
- **Cámara:** *"volar por el mundo"*. En cada escena la cámara entra desde arriba y se mete en el
  diorama; entre escenas sube, cruza el barrio en miniatura y baja a la siguiente.

**Las 5 escenas:** `barrio` (portada china, balcones limeños, el chifa en la esquina) → `mercado`
(kion, cebolla china, sillao) → `wok` (fuego vivo, el arroz en el aire) → `salon` (mesas redondas
con giratoria) → `plato` (un aeropuerto gigante flotando).

## 3. Mapa de beats

Duración de la película final: **11,2 viewports de scroll** (5 escenas + 4 conectores).

| % película | Scroll (vh) | Clip | Qué hace la cámara | Qué hace la interfaz |
|---|---|---|---|---|
| 0–14 % | 0–1,6 | Escena **barrio** | Baja desde lo alto hacia la puerta iluminada del chifa; el techo se abre | **Hero**: sello estampado + "El Tío Sam / Chifa" que sube letra a letra. Con el **primer px de scroll** las palabras se desarman (giro X 75°, suben 130 %), el sello gira y se encoge; a 0,9 vh el hero desaparece |
| 14–22 % | 1,6–2,5 | Conector 1 | Sale por arriba, cruza el barrio, baja al mercado | Brasas flotando; la barra de progreso avanza; el rail derecho pasa a "El mercado" |
| 22–34 % | 2,5–3,8 | Escena **mercado** | Vuelo bajo hacia las cajas de kion y cebolla china | Copy 02 sube y entra en fundido, con su pico a mitad de escena |
| 34–42 % | 3,8–4,7 | Conector 2 | Sube y baja hacia la cocina | — |
| 42–56 % | 4,7–6,3 | Escena **wok** (`linger 0.45`) | Entra a la cocina y **se posa** en el wok en llamas | Copy 03 "Wok a fuego vivo.": la cámara frena justo cuando el texto está al máximo |
| 56–64 % | 6,3–7,2 | Conector 3 | Hacia el salón | — |
| 64–76 % | 7,2–8,5 | Escena **salón** | Se mete hasta la mesa redonda | Copy 04 "Con alma de hogar." |
| 76–84 % | 8,5–9,4 | Conector 4 | El mundo se disuelve hacia el plato gigante | — |
| 84–100 % | 9,4–11,2 | Escena **plato** (`linger 0.5`) | Empuja hasta el montón humeante | Copy 05 "Y aterriza el aeropuerto." + CTA (aparece al 40 % y se queda) |

**Después de la película** (contenido normal en el DOM):

| Tramo | Efecto |
|---|---|
| Telón (1 vh) | La película se congela en su último cuadro, sube 10 vh y se oscurece un 60 %; "Los clásicos" sube encima con esquinas de 32 px. Cubierto el todo, las capas fijas dejan de componerse. |
| Los clásicos | Titular letra a letra con máscara. 3 fotos con **revelado de máscara** de abajo arriba y zoom 1,15→1 (1,6 s, expo.out), **parallax asimétrico** (+70 / −50 / +110 px) y **WebGL**: la foto se curva con la inercia del scroll, separa RGB y hace una onda bajo el cursor. |
| Carta rápida | Tu FlowingMenu actual, con el marquee al pasar el ratón. |
| Testimonio | Las palabras se encienden con el scroll (14 % → 100 % de opacidad). |
| CTA (fijado 1,2 vh) | 0–50 %: un disco dorado se expande desde el centro (`clip-path: circle`). 50–75 %: "¿Se te antojó?" letra a letra. 75–100 %: texto y botones. Botón de WhatsApp **magnético** (solo con ratón). |
| Footer | El de ahora. |

## 4. Prompts de producción

Los textos completos y canónicos están en `produccion/prompts/*.txt` y es lo que lee el
script. Están en inglés porque los modelos rinden mejor. El **preámbulo de estilo es
idéntico byte a byte** en todas las escenas: eso es lo que hace que parezcan un solo mundo.

### 4.1 Preámbulo de estilo (todas las escenas salvo la final)

```
Isometric low-poly 3D diorama floating as a small rounded island on a plain solid #2B0A0A dark
maroon background with a soft contact shadow beneath it. Soft matte clay 3D render, rounded
toy-model shapes, tilt-shift miniature look, evening scene lit by warm glowing red paper lanterns
and golden string lights, soft long shadows, gentle rim light. Cohesive color palette of deep red
#BE1A1A, vermilion #D0311E, warm gold #F7D87F, cream #F8EBAB and dark maroon #2B0A0A, with small
accents of fresh green. Highly detailed, centered composition with headroom, absolutely no text,
no letters, no numbers, no logos, no signage characters.
```

La escena final (`plato`) cambia solo la primera frase: *"A single oversized centerpiece floating
on a plain solid #2B0A0A dark maroon background…"*. Es el producto héroe, sin isla.
"No signage characters" evita letreros chinos ilegibles, que la IA inventa con facilidad.

### 4.2 Stills (`gpt_image_2`, 3:2, 2k, calidad alta). Preámbulo + `Subject:`

| Escena | Subject |
|---|---|
| barrio | a narrow old street corner of Barrios Altos in Lima at dusk: a traditional red Chinese gate arch with a curved golden-tiled roof spanning the street, two-storey colonial houses with carved dark-wood enclosed balconies, strings of red lanterns criss-crossing overhead, and on the corner a small family chifa restaurant with a red awning and warm light spilling from its open doorway; a few tiny clay people strolling, a bicycle, an old street lamp. |
| mercado | a lively neighbourhood market stall under a striped red-and-cream canopy: wooden crates overflowing with fresh ginger roots, bunches of green spring onions, yellow aji peppers, red tomatoes and onions, burlap sacks of white rice, rows of dark soy sauce bottles, a tiny clay vendor weighing produce on a brass scale, small lanterns hanging from the canopy. |
| wok | an open restaurant kitchen shown as a cutaway: a row of black woks on roaring gas burners with tall orange flames leaping up, a tiny clay cook in white tossing fried rice high in the air from a wok, soft clouds of steam, a cleaver and chopping block with sliced vegetables, stacks of white plates, hanging ladles, red tiled walls. |
| salon | a cozy chifa dining room shown as a cutaway: round wooden tables with red tablecloths and lazy-susan turntables loaded with shared dishes, small clay families seated around them, porcelain teapots and cups, red paper lanterns hanging from the ceiling, a round moon-gate doorway, warm golden light. |
| plato | one oversized white porcelain plate piled high with 'aeropuerto': golden fried rice mixed with stir-fried yellow noodles, pieces of chicken and beef, scrambled egg and chopped spring onions, glistening and gently steaming; a pair of wooden chopsticks resting on the rim; a few tiny props orbiting around it: a small red lantern, a little soy sauce dish, a sprig of spring onion, tiny golden sparks. |

### 4.3 Escenas en vídeo (Seedance 2.0, 16:9, 8 s, `first_frame` = el still)

Plantilla, con la parte que cambia entre [corchetes]:

```
Single continuous cinematic camera move, no cuts. Begin high and far, looking down at all of
[the street corner] from outside like a tiny model. The camera slowly glides forward and descends
toward it, sweeping in toward [the restaurant's glowing open doorway], as if flying inside. As the
camera pushes in, the roof and upper structure gently lift and open away to reveal the warm
interior. Soft matte clay diorama, tilt-shift miniature, warm lantern light, palette of [PALETA].
Smooth, graceful, slow motion, subtle parallax. No text, no captions.
```

| Escena | Punto focal | Movimiento |
|---|---|---|
| barrio | the restaurant's glowing open doorway | desciende; el techo se abre |
| mercado | the crates of ginger and spring onions on the counter | vuelo bajo (no hay techo) |
| wok | the flaming wok and the rice tossed in mid-air | desciende; el techo se abre |
| salon | the central round table with its turning lazy susan | desciende; el techo se abre |
| plato | the steaming heap of rice and noodles | empuja de lejos hacia el plato; los props pasan en parallax |

### 4.4 Conectores (Seedance 2.0, 16:9, 5 s)

`first_frame` = **último cuadro real** de la escena i y `last_frame` = **primer cuadro real** de
la escena i+1, ambos **extraídos de los vídeos renderizados, nunca de los stills**. Es la regla que
evita el "salto" en las costuras.

```
Single continuous cinematic camera move, no cuts. The camera smoothly pulls up and back out of
[the street corner], rising into the evening sky, then glides forward across the connected
miniature lantern-lit neighbourhood and arrives above [the market stall], beginning to descend
toward it. One connected miniature clay world, seamless flowing aerial transition. [ESTILO]
Smooth graceful slow motion. No text, no captions.
```

El conector 4 (salón → plato) termina distinto: *"…as the miniature world dissolves toward a
single giant plate of fried rice and noodles floating in soft dark maroon space, arriving in
front of it."*

### 4.5 Versión móvil (opcional)

Es otra cadena completa, nativa en **9:16**: los mismos prompts precedidos de *"Vertical portrait
composition, the diorama centered with generous dark maroon #2B0A0A space above and below."*,
con lienzos verticales como imagen inicial y costuras extraídas de sus propios vídeos. No es un
recorte del 16:9.

## 5. Rendimiento (FPS estables)

| Decisión | Efecto |
|---|---|
| Clips cargados como **Blob** en memoria | El scrub funciona aunque el hosting no sirva *byte-ranges* (vídeo "congelado" en el cuadro 0). |
| Codificación nativa, `crf 20`, **GOP 8**, `+faststart`, sin audio | Seeks baratos sin inflar el peso (all-intra ≈ 25 MB por clip; GOP 8 ≈ 8 MB). |
| Móvil: 720 de ancho, **GOP 4**, `crf 23` | Un teléfono decodifica la mitad de cuadros por seek. |
| Seeks coalescentes + interpolación en rAF | Un *flick* rápido no apila seeks ni congela el vídeo. |
| Precarga solo de los clips cercanos (±1,6 vh) | Memoria y red bajo control. |
| **Un único** contexto WebGL para todas las fotos, activo solo con fotos en pantalla (IntersectionObserver) y DPR limitado (2 / 1,5 en móvil) | Sin 3 contextos ni bucles ociosos. |
| Película y WebGL **nunca a la vez** | Al cubrirse la película, sus capas fijas pasan a `visibility:hidden`. |
| Sin `backdrop-filter` sobre el vídeo (cabecera con degradado) | Es de lo más caro en móviles. |
| Lenis solo en rueda/trackpad (`syncTouch:false`) | En táctil la inercia nativa ya es orgánica y no compite con el decodificador. |
| Solo `transform`/`opacity`/`clip-path` en las animaciones | Nada fuerza layout por fotograma. |

## 6. Accesibilidad (WCAG)

- **Contraste** del texto sobre el fondo de marca `#2B0A0A`: crema 15,2:1 · dorado 13,1:1 · ámbar
  `#E9B949` 10,0:1 · llama `#FF7A3D` 7,0:1 · coral `#FF6B5A` 6,5:1. Todos superan el AA (4,5:1).
  Sobre vídeo, el texto lleva debajo un velo del color de fondo. **Cuando lleguen los vídeos reales
  hay que repetir la comprobación** (pendiente en §8).
- El split text guarda el texto completo en `aria-label` y oculta las letras sueltas.
- Hay un enlace "Saltar el recorrido" al principio de la página.
- Con `prefers-reduced-motion` no se carga vídeo: los stills se funden entre sí, y no hay Lenis,
  WebGL, máscaras, pin ni efecto magnético.
- Si el CDN de GSAP falla, la página sigue siendo usable.

## 7. Producción paso a paso

**Herramientas que faltan en este PC:** Monid CLI (vídeo, por defecto), Higgsfield CLI (stills y
vídeo de respaldo) y un **ffmpeg moderno con libwebp**. El que tienes en `Python312\Scripts` es de
2013 y no soporta `-sseof` ni `scale=-2`. Instala uno moderno (`winget install Gyan.FFmpeg`) y deja
el viejo fuera del PATH. El script ya no usa Python: el JSON lo lee `produccion/json.php` con el PHP
de XAMPP y las imágenes las procesa ffmpeg. `bash produccion/render.sh check` revisa todo esto.

**Coste estimado** (tarifas medidas por la skill en jul-2026; Monid cobra por clip en USD):

| Fase | Clips | Coste |
|---|---|---|
| Stills (Higgsfield `gpt_image_2`) | 5 | ~75 créditos (≈15 c/u) + repeticiones |
| **Previz** 480p (aprobar el recorrido) | 5 escenas + 4 conectores | ≈ **$2,80** |
| **Final** 1080p, escritorio | 5 + 4 | ≈ **$22,40** (+15 % de margen ≈ **$26**) |
| Móvil 9:16 a 720p (opcional) | 5 + 4 | ≈ **$9** (+15 % ≈ **$10,50**) |
| Alternativa: todo con créditos Higgsfield | 9 clips | ≈ 40–55 créditos por clip → 360–500 créditos |

**Orden de trabajo:**

```bash
bash produccion/render.sh check
bash produccion/render.sh stills          # revisar que las 5 parezcan UN mundo; repetir las que no
VRES=480p bash produccion/render.sh dives
VRES=480p bash produccion/render.sh frames
VRES=480p bash produccion/render.sh connectors
bash produccion/render.sh encode          # mirar la previz en el navegador
# aprobado → repetir dives/frames/connectors/encode con VRES=1080p
```

Las generaciones tardan de 3 a 8 minutos cada una y el script lanza en paralelo las que puede. Si
una falla o la marca el filtro NSFW (pasa a veces en interiores), se repite solo esa:
`bash produccion/render.sh dive salon`. Si sigue fallando, quita palabras conflictivas del prompt
o genera ese clip con `BACKEND=higgsfield VMODEL=kling3_0`.

## 8. Integración y QA

1. Al renderizar, los stills quedan en `assets/world/*.webp` y los clips en `assets/video/*.mp4`.
2. En `js/experiencia.js`, bloque `ASSETS`, cambia `stills: true` y `video: true` (y `mobile:
   true` si hiciste la cadena 9:16). No hay que tocar nada más.
3. **QA de costuras:** al cruzar cada costura, los dos cuadros deben ser casi idénticos en
   composición. Si hay "salto", el conector se hizo con el still en lugar del cuadro real.
4. **Contraste del texto sobre los vídeos reales** en las 5 escenas.
5. Móvil: CPU ralentizada ×4–6, scroll rápido y comprobar que el vídeo no se congela. En iOS Safari,
   que la primera escena nunca se vea en negro.

**Para verla:** sírvela con el servidor de PHP de XAMPP. Con doble clic (`file://`), Chrome
bloquea las texturas WebGL y la carga de los clips, y el formulario de reservas necesita PHP.

```bash
/c/xampp/php/php.exe -S 127.0.0.1:5519 -t "C:/Users/HP/OneDrive/Desktop/TODO/El tio Sam - Chifa"
```

`-t` sirve **solo** el proyecto, sea cual sea la carpeta desde la que lo ejecutes, y `127.0.0.1`
impide que otros equipos de la red lo vean. Después abre `http://localhost:5519/`.
Si Windows tiene las animaciones desactivadas, el navegador informa "reducir movimiento" y verás la
versión estática; añade `?motion=full` a la URL una vez y se mantendrá en toda la pestaña.

## 8b. Reservas en línea — PRÓXIMAMENTE (PHP + MySQL, como en `proyecto_01`)

**Ahora mismo están en pausa.** En `html/contacto.html#reservar` se ve el formulario atenuado con
el sello "Próximamente" y se remite al teléfono y WhatsApp. `php/reservar.php` tiene
`RESERVAS_ACTIVAS = false`: aunque alguien envíe datos, no guarda nada. Los botones de la portada
ya no ofrecen "Reservar mesa".

**Para activarlas cuando toque:**

1. En `php/reservar.php`, pon `RESERVAS_ACTIVAS = true`.
2. En `html/contacto.html`, quita `disabled` del `<fieldset>` y el bloque `.reserva-form__velo`
   (y el badge "Próximamente" del título).
3. Abre el **XAMPP Control Panel** y pulsa **Start** en **MySQL**.
4. La base `tiosam_chifa` (tabla `reservas`) ya está creada en tu MySQL. En otro equipo,
   impórtala desde phpMyAdmin con `php/tiosam_chifa.sql`.
5. Las reservas se ven en phpMyAdmin → `tiosam_chifa` → `reservas`.

Diferencias con `envio.php` del proyecto anterior: consultas **preparadas** (los datos nunca se
pegan dentro del SQL), **validación en el servidor** (teléfono, fecha desde hoy, lunes cerrado,
hora de 12:00 a 21:30, de 1 a 30 personas) y mensajes que no muestran detalles internos de la base
si falla la conexión.

## 9. Decisiones pendientes (tuyas)

1. **Estilo de cámara.** Recomiendo *volar por el mundo* (arriba). Alternativas: *recorrido continuo*
   (siempre hacia delante, más realista) o *isométrico fijo* (ángulo constante, el más calmado y barato
   de repetir). Si cambias, se reescriben los prompts de vídeo.
2. **¿Versión móvil 9:16?** Suma unos $10,50.
3. **Presupuesto:** previz a 480p primero (~$3) y final a 1080p (~$26).
4. **Textos:** los de las escenas y "Los clásicos" son un borrador sobre la carta actual. Revisa
   precios y horarios, y que el chaufa de carne, pollo y chancho exista tal cual en la carta.
