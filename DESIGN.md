# Design

Diorama nocturno: una calle de Barrios Altos dentro de una caja de laca oscura, iluminada por faroles de papel. Mide el diseño por una pregunta: ¿se siente una sola noche, con una sola luz?

## Color (OKLCH, en `css/style.css`)

| Token | Valor | Uso |
|---|---|---|
| `--noche-0…3` | L .145 / .185 / .225 / .275, C .012–.018, H 45 | Planos del fondo al frente: página, secciones, tarjetas, hover |
| `--papel / -2 / -3` | L .945 / .80 / .68, H 80–88 | Texto principal, secundario, atenuado (todos ≥ 4.5:1 sobre noche) |
| `--farol` (+ `-claro`, `-hondo`) | L .80, C .135, H 78 | La única luz: botón principal, marcas activas, foco |
| `--bermellon` | L .62, C .16, H 32 | Solo en los faroles y en estados de error |
| `--linea / --linea-fuerte` | papel al 10 % / 20 % | Filos de 1 px; la profundidad sale de planos de tono, no de sombras |

Fuera de esto no se inventan colores. El bermellón no se usa para texto.

## Tipografía

- **Gloock** (`--font-display`): un solo peso, 400. Nunca poner `font-weight` mayor (`font-synthesis:none`). Títulos, nombres de plato en tarjeta, menú.
- **Hanken Grotesk** (`--font-body`): 400–700. Texto, filas de la carta, botones, números tabulares en precios.
- Máximo 6rem en pantalla; sin rótulos sobre los títulos ni numeración de secciones; interletrado entre −0.015em y 0.

## Forma y espacio

- Radios: 8 (etiquetas), 12 (botones, campos), 16 (tarjetas, mapa, fotos). Sin píldoras.
- Área táctil mínima de 48 px. Contenedor máximo 1120 px, `--gutter` fluido.
- Más aire sobre un título que debajo; secciones de la carta separadas por 44–80 px.
- Una sola elevación por pieza (tono + filo). La única sombra es la hoja que sube sobre la película en la portada.

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

- Curvas: `--ease-out` `cubic-bezier(.23,1,.32,1)` (entradas), `--ease-in` (salidas), `--ease-in-out` (telón y bandas), `--spring` (`linear()`, ζ .82, rebasa 1,1 %: marca de pestañas, soltar botones, icono del menú).
- Entradas ≈ 440 ms con cascada de 45 ms (máx. 8); salidas ≈ 150 ms; pulsar = `scale(.97)` en 90 ms y volver en ~380 ms; menú: abre 560–720 ms con cascada, cierra 300 ms sin cascada.
- `--dist` (14 px, 0 en `calm`), `--zoom` y `--desenfoque` controlan cuánto se mueve y se enfoca una entrada.
- Solo `transform`, `opacity` y (acotado) `filter`. Hover solo con `@media (hover:hover)`. Estados en CSS para que se puedan interrumpir.

**Momento central: la luz del farol.** Al cambiar de página la nueva "se enciende" desde donde tocaste (View Transitions, `clip-path: circle`); al cerrar la portada, la luz del farol se abre sobre la mesa. Sin View Transitions (Firefox, navegadores viejos) entra el telón de `sitio.js`.

## Componentes clave

- **Cabecera de página** (`.cabecera`) con faroles que cuelgan y se mecen apenas.
- **Menú lateral** (`css/staggered-menu.css`): dos capas de laca preceden al panel; abre lento, cierra rápido.
- **Pestañas de categoría** (`.categorias`): fijas bajo la cabecera, marca ámbar que se desliza.
- **Plato con foto** (`.plato--foto`) y **fila** (`.plato--fila`); el precio sin confirmar usa `data-sin-precio`.
- **Mapa** (`.mapa`): iframe de Google filtrado a tono noche; los datos van en lista (`.datos`), no en tarjetas.
- **Logo oficial** `img/logo_tio_sam.jpeg`: portada, pie, telón y cabecera. Recortado en círculo.

## No hacer

Rojo o dorado planos a pantalla completa · cristal/`backdrop-filter` · halos de color · degradado en texto · tarjetas iguales de icono + título + texto · rótulos sobre títulos · numeración de secciones · inventar platos, precios, horarios o reseñas.
