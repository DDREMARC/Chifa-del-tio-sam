# Design

Diorama nocturno: una calle de Barrios Altos dentro de una caja de laca oscura, iluminada por faroles de papel. Mide el diseño por una pregunta: ¿se siente una sola noche, con una sola luz?

## Color (OKLCH, en `css/style.css`)

| Token | Valor | Uso |
|---|---|---|
| `--noche-0…3` | L .145 / .185 / .225 / .275, C .012–.018, H 45 | Planos del fondo al frente: página, secciones, tarjetas, hover |
| `--papel / -2 / -3` | L .945 / .80 / .72, H 80–88 | Texto principal, secundario y atenuado con contraste reforzado |
| `--farol` (+ `-claro`, `-hondo`) | L .80, C .135, H 78 | La única luz: botón principal, marcas activas, foco |
| `--bermellon` | L .62, C .16, H 32 | Solo en los faroles y en estados de error |
| `--linea / --linea-fuerte` | papel al 10 % / 20 % | Filos de 1 px; la profundidad sale de planos de tono, no de sombras |

Fuera de esto no se inventan colores. El bermellón no se usa para texto.

## Tipografía

- **Cormorant Garamond** (`--font-display`): serif editorial, pesos 400–700 (Google Fonts). Títulos, nombres de plato, menú y datos grandes; `font-variant-numeric: lining-nums` alinea las cifras.
- **DM Sans** (`--font-body`): sans geométrica limpia, 400–700 con eje óptico 9–40 (Google Fonts). Texto, filas de la carta, botones y números tabulares en los precios.
- **Sin cursivas.** `em, i, cite, dfn, var, address` quedan en `font-style: normal` y `font-synthesis: none`; el énfasis sale de peso, tamaño o color (el "CHIFA" de la portada es un rótulo en mayúsculas con interletrado, en ámbar). Georgia es el respaldo serif; DM Sans conserva el respaldo métrico calibrado.
- Máximo 6rem en pantalla; sin rótulos sobre los títulos ni numeración de secciones; interletrado entre −0.015em y 0.

## Forma y espacio

- Espaciado: escala fluida `--s-1…--s-10` con límites `clamp()` para adaptar el ritmo entre móvil y escritorio.
- Radios: 8 (etiquetas), 12 (botones, campos), 16 (tarjetas, mapa, fotos). Sin píldoras.
- Área táctil mínima de 48 px. Contenedor máximo 1120 px, `--gutter` fluido.
- Más aire sobre un título que debajo; secciones de la carta separadas por 44–80 px.
- La profundidad sale de los planos de tono y filos finos; no se usan sombras decorativas.

## Movimiento

Tres capas, de la más ligera a la más pesada. Cada una degrada sola si falla la siguiente.

1. **CSS y navegador** (sin librerías): transiciones y muelles `linear()`, `@view-transition` entre páginas, scroll-driven animations (barra de progreso, faroles, foto de cada plato), `position: sticky` en pestañas y títulos de sección.
2. **JS propio** (sin librerías): menú lateral, pestañas, entradas de la carta con IntersectionObserver y Web Animations.
3. **GSAP 3.15 + ScrollTrigger + SplitText y Lenis 1.3.26** (jsDelivr, versión fijada): scroll suave, títulos por letras, revelados de portada y contacto, la película del recorrido.

**Dos modos** (`html[data-motion]`, lo decide `js/precarga.js`):

| Modo | Cuándo | Qué hace |
|---|---|---|
| `full` | normal | todo lo anterior |
| `calm` | el sistema pide "reducir animaciones" (en Windows basta con apagar *Efectos de animación*) | solo fundidos, cambios de color y respuesta al pulsar. Sin scroll suave, parallax, desplazamientos, telón, WebGL ni faroles que se mecen |

`?motion=full` fuerza `full` en esa pestaña. Un sitio totalmente quieto no es "reducir": se siente roto.

**Valores** (en `css/style.css`):

- Curvas: `--ease-out` `cubic-bezier(.16,1,.3,1)` para desaceleraciones; `--ease-in` para salidas y `--ease-in-out` para telón y bandas.
- Entradas ≈ 440 ms con cascada de 45 ms (máx. 8); las fotos de carta se descubren en 480 ms y su texto aparece 90 ms después; pulsación y navegación responden en 180–300 ms.
- `--dist` (14 px, 0 en `calm`), `--zoom` y `--desenfoque` controlan cuánto se mueve y se enfoca una entrada.
- Solo `transform`, `opacity` y (acotado) `filter`. Hover solo con `@media (hover:hover)`. Estados en CSS para que se puedan interrumpir.

**Momento central: la luz del farol.** Al cambiar de página la nueva "se enciende" desde donde tocaste (View Transitions, `clip-path: circle`); al cerrar la portada, la luz del farol se abre sobre la mesa. Sin View Transitions (Firefox, navegadores viejos) entra el telón de `sitio.js`.

## Componentes clave

- **Cabecera de página** (`.cabecera`) con faroles que cuelgan y se mecen apenas.
- **Menú lateral** (`css/staggered-menu.css`): dos capas de laca preceden al panel; abre lento, cierra rápido. En pantallas bajas (menos de 560 px de alto, p. ej. el móvil acostado) se compacta para que el botón de WhatsApp quede a la vista, y si no cabe el panel se desplaza.
- **Pestañas de categoría** (`.categorias`): fijas bajo la cabecera, marca ámbar que se desliza.
- **Plato con foto** (`.plato--foto`) y **fila** (`.plato--fila`); el precio sin confirmar usa `data-sin-precio`. La foto se descubre de abajo hacia arriba como una cortina (`clip-path`, 950 ms) mientras un zoom leve se asienta; el texto llega 280 ms después. En `calm` solo funde.
- **Letrero "Próximamente"** (`.letrero`, en `contacto.html`): una placa `--noche-2` con filete ámbar doble cuelga sobre el formulario de reservas mientras su `<fieldset>` tenga `disabled`, y en el celular acompaña a quien baja (`position: sticky`). Al quitar `disabled` se oculta solo (`:has()`). Es solo visual (`aria-hidden`): el aviso para lectores de pantalla va en el título y en el texto de arriba.
- **Formulario de contacto** (hoy desactivado, "Próximamente"): el rótulo se enciende en ámbar al enfocar, un hilo de luz crece bajo el campo, el botón se hunde al pulsar (90 ms) y vuelve con muelle, el error solo aparece tras escribir (`:user-invalid`).
- **Mapa** (`.mapa`): iframe de Google filtrado a tono noche; los datos van en lista (`.datos`), no en tarjetas.
- **Logo oficial** `img/logo_tio_sam.jpeg`: portada, pie, telón y cabecera. Recortado en círculo.

## Piezas de React Bits (`js/reactbits.js`)

Tres componentes visibles de reactbits.dev pasados a JS sin React y llevados a la luz del diorama. Se apagan en `calm` y solo corren mientras se ven; TiltedCard y ClickSpark quedan sin activar.

| Pieza | Origen | Dónde | Qué hace |
|---|---|---|---|
| Luz del farol | LightRays | cabeceras de Carta y Contacto | Haces ámbar que nacen en el farol grande y bajan; con ratón se tuercen apenas hacia el cursor. Intensidad baja: el título conserva su contraste. |
| Sello giratorio | CircularText | logo del hero (portada) | "El Tío Sam · Chifa · Barrios Altos" en un anillo que gira (28 s por vuelta) y acelera 4× con el ratón encima. |
| Letrero de platos | ScrollVelocity | portada, entre los clásicos y la carta rápida | Dos filas con nombres reales de la carta (la segunda solo con el filo de la letra) que corren y se aceleran con la velocidad del scroll. |

## No hacer

Rojo o dorado planos a pantalla completa · cristal/`backdrop-filter` · halos de color · degradado en texto · tarjetas iguales de icono + título + texto · rótulos sobre títulos · numeración de secciones · inventar platos, precios, horarios o reseñas.
