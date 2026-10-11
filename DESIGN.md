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

- Curvas: `--ease-out` (entradas), `--ease-in` (salidas), `--ease-in-out` (telón, bandas).
- Entradas ≈ 440 ms con cascada de 45 ms (máx. 8); salidas ≈ 150 ms; pulsar = `scale(.97)`.
- Solo `transform` y `opacity`. Interrumpible: estados en CSS, no en temporizadores.
- `prefers-reduced-motion` quita el movimiento; `?motion=full` lo fuerza para probar.

## Componentes clave

- **Cabecera de página** (`.cabecera`) con faroles que cuelgan y se mecen apenas.
- **Menú lateral** (`css/staggered-menu.css`): dos capas de laca preceden al panel; abre lento, cierra rápido.
- **Pestañas de categoría** (`.categorias`): fijas bajo la cabecera, marca ámbar que se desliza.
- **Plato con foto** (`.plato--foto`) y **fila** (`.plato--fila`); el precio sin confirmar usa `data-sin-precio`.
- **Mapa** (`.mapa`): iframe de Google filtrado a tono noche; los datos van en lista (`.datos`), no en tarjetas.
- **Logo oficial** `img/logo_tio_sam.jpeg`: portada, pie, telón y cabecera. Recortado en círculo.

## No hacer

Rojo o dorado planos a pantalla completa · cristal/`backdrop-filter` · halos de color · degradado en texto · tarjetas iguales de icono + título + texto · rótulos sobre títulos · numeración de secciones · inventar platos, precios, horarios o reseñas.
