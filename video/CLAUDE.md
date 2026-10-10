# Videos con Remotion — El Tío Sam Chifa

Proyecto de vídeo aparte de la web (`../html`, `../css`, `../js`). Cualquier vídeo para redes o la web sale de aquí.

## Comandos

Todos se ejecutan dentro de `video/`, con las dependencias locales (no instalar nada global):

- `npm run studio`: abre Remotion Studio en el navegador para previsualizar y ajustar en vivo.
- `npx remotion compositions src/index.ts`: lista las composiciones disponibles.
- `npx remotion still src/index.ts <id> out/<nombre>.png --frame=<n>`: exporta un fotograma para revisar diseño sin renderizar el vídeo entero.
- `npx remotion render src/index.ts <id> out/<nombre>.mp4`: render completo a MP4 (H.264).
- `npm run typecheck`: comprueba tipos antes de renderizar.

## Estructura

- `src/index.ts`: registra la raíz (no tocar salvo para añadir una raíz nueva).
- `src/Root.tsx`: declara las composiciones (`id`, duración, fps, tamaño, props por defecto).
- `src/ChifaPromo.tsx`: promo vertical 1080x1920, 30 fps, 12 s (360 frames). Escenas: intro de marca, tres platos, cierre.
- `src/theme.ts`: paleta y fuentes de la web (Fraunces + Work Sans vía `@remotion/google-fonts`).
- `public/img/`: fotos del chaufa, copiadas de `../img/`. Se leen con `staticFile()`.
- `remotion.config.ts`: codec, formato y navegador de render.
- `out/`: salidas (ignorado por git).

## Cómo animar en Remotion

- Toda animación depende de `useCurrentFrame()`. Nunca usar `setTimeout`, CSS transitions/animations ni `requestAnimationFrame`: el render sale a fotogramas y deben ser deterministas.
- Para entradas con rebote o muelle: `spring({frame, fps, config: {damping, stiffness}})`. Para recorridos lineales o con curva: `interpolate(frame, [in, out], [from, to], {easing, extrapolateRight: 'clamp'})`.
- Un bloque de tiempo = `<Sequence from={n} durationInFrames={m}>`. Dentro de una secuencia, `useCurrentFrame()` empieza en 0: las animaciones de cada escena arrancan solas.
- Usar `<Img>` y `<Video>` de Remotion, no `<img>`/`<video>`, para que el render espere a que carguen.
- Tamaño de texto y márgenes pensados para vertical 1080x1920 (zona segura inferior ~260 px para no tapar la UI de las apps).

## Reglas de marca

- Paleta: granate `#2B0A0A`, rojo `#BE1A1A`, bermellón `#D0311E`, dorado `#F7D87F`, crema `#F8EBAB`. Usar solo estos colores; no inventar otros.
- El nombre "El Tío Sam Chifa" no cambia. El logo (`../img/logo.jpg`) es provisional: no usarlo como marca fija en los vídeos; si hace falta, dejarlo como parámetro de props.
- Sin reservas en línea mientras el módulo esté en pausa: no prometer ni mostrar un flujo de reserva.
- No inventar precios, platos, testimonios ni datos. Si la carta no está confirmada, dejar el texto como prop para que el dueño lo cambie.
- Fotos reales de la carta en `../img/` antes que ilustraciones genéricas.

## Dirección creativa (de `../PRODUCT.md` y `../produccion/PROPUESTA.md`)

- **Carácter:** un chifa de barrio con sazón propia, atención cercana y wok a fuego vivo. Cálido, directo, con orgullo de casa. Nada de estética de cadena ni de fast food.
- **Mundo visual de la web:** diorama de arcilla mate, isométrico, con efecto tilt-shift, **de noche**, iluminado por farolillos rojos y guirnaldas doradas, sobre fondo granate. Ese mismo ambiente nocturno y cálido es el que debe sentirse en el vídeo.
- **Luz y color:** luz cálida (dorado y crema) sobre fondos oscuros granate. Los destellos rojos y bermellón se usan para acentos, no como fondo completo.
- **Tipografía:** titulares en Fraunces (serif de peso alto, 600–900), texto en Work Sans. Mayúsculas espaciadas solo para etiquetas cortas.
- **Movimiento:** con intención, no decorativo. Entradas con muelle (`spring`) que rebotan con firmeza y se asientan; letras que suben de una en una; zoom lento sobre la comida. Evitar movimientos bruscos, parpadeos o efectos de "video de Instagram" genéricos.
- **Comida como protagonista:** el plato ocupa la pantalla; el texto va encima, centrado, con velo oscuro para leerlo, sin tapar el arroz más de lo necesario.
- **Lo que no es:** nada de estética de comida rápida, ni colores fluorescentes, ni tipografías de impacto genéricas, ni promesas de reserva o de premio.

## Skills de Remotion

Instaladas con `npx remotion skills add` (repositorio oficial `remotion-dev/skills`, no npm) en `.agents/skills/` y enlazadas a Claude Code. Son guías técnicas: animación, markup, render, Studio y documentación de la API. Para cualquier duda de API o render, consultarlas antes de inventar la sintaxis. La regla de Studio de la skill (abrir la vista previa antes de renderizar) se aplica: **no renderizar a MP4 salvo que el usuario lo pida explícitamente**.

## Flujo de trabajo

1. Escribir o ajustar la composición en `src/`. Declarar las props que el usuario pueda querer cambiar (titular, dirección, duración de escena).
2. `npm run typecheck`.
3. Exportar 1–2 fotogramas clave con `still` (intro, mitad de escena, cierre). Revisar: texto cortado, contraste, solapes con bordes.
4. Corregir en un solo lote y renderizar el MP4 completo. No iterar en bucle: una pasada de revisión y una de confirmación.
5. Dejar el MP4 en `out/` y decir al usuario la ruta y la duración.

## Problemas conocidos en esta máquina

- El `chrome-headless-shell` que descarga Remotion está bloqueado por una directiva de Control de aplicaciones de Windows (`spawn UNKNOWN` / "Una directiva de Control de aplicaciones bloqueó este archivo"). Por eso `remotion.config.ts` usa Microsoft Edge instalado en `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. No intentar saltarse la directiva. Si Edge no está, pedir al usuario que instale Chrome o Edge y ajustar esa ruta.
- Las fotos originales de `../img/` tienen baja resolución para 1080 px de ancho; se ven algo suaves al ampliarlas. Si el usuario puede aportar fotos más grandes, reemplazarlas en `public/img/`.
