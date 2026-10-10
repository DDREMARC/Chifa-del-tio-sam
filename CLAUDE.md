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

**Script layering.** Every page loads, in order: `js/precarga.js` (in `<head>`, blocking: reduced-motion override and the page-transition curtain), then GSAP + ScrollTrigger and Lenis from CDNs, then page-specific scripts, then `js/sitio.js`, then `js/main.js`.
- `js/sitio.js` is the shared behavior for all pages: staggered menu config, Lenis smooth scroll, page curtain, and the `data-anim` attribute animations. It exposes `window.TioSam` for the home page. Shared behavior goes here, not copied per page.
- `js/experiencia.js` + `js/scroll-world.js` are home-only. `scroll-world.js` is the scroll-scrubbed film engine.
- `js/main.js` handles the carta page: rendering and filtering the menu, spotlight cards, and the FlowingMenu. The menu data itself is in `js/menu-data.js`, kept separate so content can change without touching logic.
- `js/option-wheel.js` and `js/staggered-menu.js` are components used by the carta and the menu.

**Animations are declarative.** To animate a new element on any page, add a `data-anim` attribute in the HTML (`letras`, `subir`, `cascada`, `mascara`, `sello`) or `data-parallax="<px>"`. No new JS is needed. The full list is in the header comment of `js/sitio.js`.

**Home film (scroll-world).** The home hero is a scroll-scrubbed video, with WebGL on the classics section. `js/experiencia.js` has an `ASSETS` block (around line 17) that switches between the provisional SVG posters in `assets/world/*.svg` and the rendered `.webp` stills and `.mp4` clips. Those flags stay `false` until `produccion/render.sh encode` has produced the files. Flipping them without the files present breaks the home page. `produccion/PROPUESTA.md` documents the scene and beat design.

**Reservations are paused.** `php/reservar.php` has `RESERVAS_ACTIVAS = false`, and the form in `html/contacto.html` is visually disabled ("Próximamente"). Do not add or promise a booking flow. Reservations are by phone or WhatsApp.

**Content rules.** Prices, the final carta, and testimonials are not confirmed in this repo. Do not invent dishes, prices, hours, reviews, or awards. The logo `img/logo.jpg` is temporary: don't build the visual identity around it. The name "El Tío Sam Chifa" is fixed.

## Other notes

- The `.claude/` directory and `PRODUCT.md` are untracked in git. `PRODUCT.md` is the product brief (users, positioning, constraints) and is worth reading before design or copy changes.
- `php/tiosam_chifa.sql` is the reservations schema for the paused module. It does nothing for the static site.
