# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitantes que quieren conocer El Tío Sam Chifa antes de ir o pedir: vecinos y turistas de Barrios Altos, Lima, que buscan dónde comer y qué hay en la carta. *(Inferido del encargo: la web funciona como carta digital interactiva con presentación, ubicación, redes y contacto directo. Confirmar si hay otro público relevante.)*

## Product Purpose

Presentar el chifa y servir de carta digital interactiva. La web muestra la historia y el ambiente del local, la carta, la ubicación y las redes, y ofrece contacto directo. Éxito: que el visitante entienda qué es el chifa, qué come allí y cómo llegar o escribirles.

## Positioning

Un chifa de barrio con sazón propia, gran variedad de arroz chaufa y una atención al cliente cuidada. La web debe transmitir ese trato cercano y la cocina al momento, no una cadena genérica.

## Operating Context

- Sin reservas en línea por ahora: el módulo en `php/` está en pausa y la web no debe prometerlo ni mostrar un flujo de reserva.
- La carta se consulta como carta digital en el móvil y en escritorio, y el contacto se hace por teléfono, redes o visita directa.
- Dirección: Jr. Cantón 245, Barrios Altos, Lima.

## Capabilities and Constraints

- Stack existente: HTML, CSS y JavaScript estático en `html/`, `css/` y `js/`; scripts de producción y render en `produccion/`; PHP solo para reservas (en pausa).
- Portada inmersiva con película scrubbeada por scroll; carta, contacto y clásicos comparten animaciones (`js/sitio.js`).
- Terminología: "chifa", "chaufa", "kion", "sillao", "cebolla china", "wok a fuego vivo".
- Undecided: contenido final de la carta y precios no están confirmados en el repositorio; no inventarlos.

## Brand Commitments

- **Nombre fijo:** El Tío Sam Chifa no cambia.
- **Logo provisional:** `img/logo.jpg` es temporal y va a cambiar. No construir la identidad visual alrededor de este logo ni darle un tratamiento de marca definitivo.

## Evidence on Hand

- Fotos de platos en `img/` (chaufa de pollo, chancho y carne; un lantern) y ilustraciones de escena en `assets/world/`.
- Vídeos y stills de la película aún provisionales; se generan con `produccion/render.sh`.
- Ausentes: testimonios, reseñas, premios o datos de clientes. No añadirlos sin evidencia real.

## Product Principles

- Sabor y atención son la promesa: el contenido debe sonar a casa, no a marketing.
- La carta es la herramienta principal: llegar a los platos debe ser rápido en móvil.
- No prometer lo que no existe: sin reservas en línea mientras el módulo esté en pausa.
- El nombre es estable, el logo no: el sistema visual debe poder cambiar de logo sin rehacerse.
