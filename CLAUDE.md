# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Static website for El Tío Sam Chifa (Barrios Altos, Lima): an immersive landing page, a digital menu (carta), and a contact page. Plain HTML/CSS/JS, no build step, no package manager at the root. The video sub-project in `video/` has its own `video/CLAUDE.md` (Remotion) — read it before touching anything there.

Content is in Spanish. Keep user-facing copy in Spanish and match the existing tone (see `PRODUCT.md`).

## Commands

There is no build, lint, or test tooling at the root. Nothing to run for CI.

Serve the site over HTTP (not `file://`; WebGL and video clips are blocked from `file://`). The project's documented way, from `produccion/PROPUESTA.md`:

```bash
/c/xampp/php/php.exe -S 127.0.0.1:5519 -t "C:/Users/HP/OneDrive/Desktop/TODO/El tio Sam - Chifa"
```

Then open `http://localhost:5519/`. Add `?motion=full` once to force animations on when Windows has "reduce motion" enabled.

Asset pipeline (only when regenerating the film): `bash produccion/render.sh check` first, then see the workflow in `produccion/PROPUESTA.md` §7. Run it with `bash`, not `sh`.

## Architecture

**Entry and pages.** Root `index.html` only redirects to `html/index.html`. The real pages live in `html/` (`index.html` home, `carta.html` menu, `contacto.html` contact) and reference `../css`, `../js`, `../img`, `../assets` with relative paths. Keep that in mind when adding a page or moving a file.

**Script layering.** Every page loads, in order: `js/precarga.js` (in `<head>`, blocking: decides `html[data-motion=full|calm]`, the `vt-nativo` class, and the tap coordinates for the native page transition), then GSAP 3.15.0 + ScrollTrigger + SplitText and Lenis 1.3.26 (+ `lenis.css`) from jsDelivr with **pinned versions** (never `@latest`), then page-specific scripts, then `js/reactbits.js`, then `js/sitio.js`, then the page's own script.
- `js/sitio.js` is the shared behavior for all pages: the nav menu config, the `REDES` block (social URLs), Lenis smooth scroll, scroll lock, the JS page curtain (only for browsers without View Transitions), SplitText titles (`TioSam.dividir`; the word masks get the class `split-word-mask`, which is padded so Newsreader accents and `¿` are not clipped — SplitText has no `maskClass` option), and the `data-anim` attribute animations. It exposes `window.TioSam` (`calm`, `lockScroll`, `escapeHtml`, `dividir`, `lenis`…). Shared behavior goes here, not copied per page.
- `js/reactbits.js` holds five React Bits components ported to plain JS (no React, no ogl, no GSAP), exposed as `window.ReactBits`: `LuzFarol` (LightRays, raw WebGL rays from the header lantern), `TextoCircular` (CircularText, ring around the home hero logo), `LetreroVelocidad` (ScrollVelocity, home band of real dish names from `menu-data.js`), `PlatoInclinado` (TiltedCard, carta photo cards; mouse only, uses the `rotate`/`scale` properties so it never fights the entrance/exit `transform`) and `ChispasWok` (ClickSpark, amber sparks on `wa.me` links and `.btn--farol`). Each one returns `null` in `calm` mode, runs its loop only while visible, and keeps the React Bits MIT + Commons Clause notice in the file header (keep it). Wiring: sparks and lantern light in `sitio.js` (`initReactBits`), ring and band in `experiencia.js`, tilt in `main.js`.
- `js/staggered-menu.js` builds the nav panel. It has no GSAP: all its motion is CSS in `css/staggered-menu.css`, so it can be opened and closed mid-animation without jumps. The header (logo + toggle) is written statically inside `#staggeredMenu` in every page's HTML, so it exists in the first frame and the native page transition sees it in the new page (if the script created it, it ends up last and the header fades out and back in). The script only adds scrim, layers and panel, and keeps a fallback copy of the header: keep both copies identical, and put the static one in any new page. The panel carries `data-lenis-prevent`: while Lenis is stopped (menu open) it cancels wheel/touch events, so any new scrollable container needs that attribute too.
- `js/experiencia.js` + `js/scroll-world.js` are home-only (`scroll-world.js` is the vendored scroll-scrubbed film engine; do not edit it, override its look in `css/experiencia.css`). `experiencia.js` also owns the home's quick-carta rows and their hover band.
- `js/main.js` is carta-only: renders the carta from `js/menu-data.js` (one section per category, photo dishes as cards, the rest as list rows), the category tabs (`#chaufas` deep links work), and the exit/enter animations (Web Animations API + IntersectionObserver, no GSAP, so the carta still animates if the CDN fails).
- Each page loads only its own stylesheet next to the shared ones: `style.css` (tokens, base, buttons, footer, native page transition) + `staggered-menu.css` + one of `carta.css`, `contacto.css`, `experiencia.css`.
- **Motion modes.** `full` = everything; `calm` (the OS asks to reduce animations — on Windows this is simply "Animation effects" off, very common on modest laptops) = fades, colour changes and press feedback only: no Lenis, parallax, WebGL, curtain or large translations. Never go back to "reduced = nothing moves": a frozen site feels broken. `?motion=full` forces `full`. Anything new that moves must read `--dist`/`--zoom` (CSS) or `TioSam.calm` (JS).

**Animations are declarative.** To animate a new element on any page, add a `data-anim` attribute in the HTML (`letras`, `subir`, `cascada`, `mascara`) or `data-parallax="<px>"`. No new JS is needed. The full list is in the header comment of `js/sitio.js`. Keep them subtle (short travel, strong ease-out); the carta cards use their own CSS/IO entrances in `main.js` + `carta.css`.

**Design system.** Night diorama: warm lacquer-black planes (`--noche-0…3`), rice-paper text (`--papel…`), one lantern-amber light (`--farol`), vermilion only in the lanterns. Depth comes from tone steps and hairlines, not shadows or glass. Display type is Newsreader (editorial serif, 400–700, lining numerals) with Georgia fallback; body/buttons use DM Sans with metric-matched fallback. No italics (`em`/`i`/`cite` are reset to `font-style:normal`). See `DESIGN.md` for tokens and rules. No eyebrows above headings, no section numbers, no `backdrop-filter`.

**Home film (scroll-world).** The home hero is a scroll-scrubbed video, with WebGL on the classics section. `js/experiencia.js` has an `ASSETS` block (around line 17) that switches between the provisional SVG posters in `assets/world/*.svg` and the rendered `.webp` stills and `.mp4` clips. Those flags stay `false` until `produccion/render.sh encode` has produced the files. Flipping them without the files present breaks the home page. `produccion/PROPUESTA.md` documents the scene and beat design.

**Logo.** The big mark is the official image `img/logo_tio_sam.jpeg` (home hero, footer, page curtain, header), clipped to a circle. The old hand-drawn SVG seal is gone; do not bring it back.

**Social links.** Fill the `REDES` block in `js/sitio.js` with real URLs; icons and links appear only for the ones that are set (no `href="#"` placeholders).

**Reservations are paused.** `php/reservar.php` has `RESERVAS_ACTIVAS = false`, and the form in `html/contacto.html` is visually disabled ("Próximamente"). A "Próximamente" sign (`.letrero-capa` in `html/contacto.html`, styled in `css/contacto.css`) hangs over the form and hides itself when the `<fieldset>` loses `disabled`. Do not add or promise a booking flow. Reservations are by phone or WhatsApp.

**Content rules.** Prices, the final carta, and testimonials are not confirmed in this repo. Do not invent dishes, prices, hours, reviews, or awards. The official logo is `img/logo_tio_sam.jpeg` (it replaces the old `img/logo.jpg`, which was deleted; all pages and `js/staggered-menu.js` now point to the official one). Official location link: https://maps.app.goo.gl/sFH6uKQQWRxwaUtH8 — use it for contact/"Cómo llegar". The name "El Tío Sam Chifa" is fixed.

## Other notes

- The `.claude/` directory and `PRODUCT.md` are untracked in git. `PRODUCT.md` is the product brief (users, positioning, constraints) and is worth reading before design or copy changes.
- `php/tiosam_chifa.sql` is the reservations schema for the paused module. It does nothing for the static site.
- Reserved assets: `img/mostrito.jpeg` and `img/orjita_china.jpeg` are held for special assignments in the carta. Don't use them elsewhere until assigned.
- Home "clásicos" use real photos: `chaufa_especial.jpeg`, `lomo_saltado.jpeg`, `aeropuerto_especial.jpeg`.
- Carta status: `js/menu-data.js` holds the real carta, 38 dishes in 6 categories (Sopas, Chaufas, Aeropuertos, Combinados y Tallarines, Platos Saltados, Platos Dulces), taken from the printed menu photo `img/carta_tio_sam.jpeg`. Prices stay "S/ —" until confirmed.
- All "Cómo llegar" links (home, carta, contacto) point to the official Maps URL with `target="_blank" rel="noopener noreferrer"`.
