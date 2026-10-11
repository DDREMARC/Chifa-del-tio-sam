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
- **Logo oficial:** `img/logo_tio_sam.jpeg`. Reemplaza al antiguo `img/logo.jpg` (ya borrado); todas las páginas y el menú lateral apuntan a este.
- **Ubicación:** https://maps.app.goo.gl/sFH6uKQQWRxwaUtH8 (enlace directo de Google Maps; todos los botones "Cómo llegar" de home, carta y contacto ya lo usan).

## Evidence on Hand

- Fotos reales de platos en `img/` (`chaufa_especial.jpeg`, `lomo_saltado.jpeg`, `aeropuerto_especial.jpeg`, `sopa_especial.jpeg`, `tallarin_saltado.jpeg`, `chancho_piña.jpeg`; `carta_tio_sam.jpeg` es la carta impresa; un lantern) y ilustraciones de escena en `assets/world/`.
- Vídeos y stills de la película aún provisionales; se generan con `produccion/render.sh`.
- Ausentes: testimonios, reseñas, premios o datos de clientes. No añadirlos sin evidencia real.

## Product Principles

- Sabor y atención son la promesa: el contenido debe sonar a casa, no a marketing.
- La carta es la herramienta principal: llegar a los platos debe ser rápido en móvil.
- No prometer lo que no existe: sin reservas en línea mientras el módulo esté en pausa.
- El nombre es estable; el logo puede cambiar: el sistema visual no debe depender de él.

## Assets en reserva

- `img/mostrito.jpeg` y `img/orjita_china.jpeg`: reservadas para asignaciones especiales en la carta. Aún sin plato asignado; no usarlas en otro lugar ni inventarles nombre o precio.

## Estado de la carta

- Carta real en `js/menu-data.js`: 38 platos en 6 categorías (Sopas, Chaufas, Aeropuertos, Combinados y Tallarines, Platos Saltados, Platos Dulces), tomada de la foto de la carta impresa (`img/carta_tio_sam.jpeg`).
- Precios: sin confirmar (la carta impresa no los muestra); se muestran como "S/ —".
- Fotos reservadas, sin plato asignado hasta que el cliente confirme: `mostrito.jpeg`, `orjita_china.jpeg`.
