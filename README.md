# Restaurant Davo — Sitio web oficial

Sitio web multipágina, responsive y listo para producción para **Restaurant
Davo** (Laraquete, Región del Biobío, Chile), construido en HTML5 semántico,
CSS propio (sistema de diseño "Coastal Noir") y JavaScript ES6 sin
dependencias de build. No usa React, Tailwind CDN ni ningún framework: abre
directamente en el navegador o se despliega en cualquier hosting estático.

## Cómo ejecutarlo localmente

No requiere instalación. Basta un servidor estático simple (necesario para
que las rutas `/carta/`, `/contacto/`, etc. funcionen igual que en
producción):

```bash
cd restaurant-davo
python3 -m http.server 8000
# abrir http://localhost:8000
```

O con Node: `npx serve .`

## Cómo desplegarlo

Cualquier hosting estático sirve (Netlify, Vercel, GitHub Pages con dominio
propio, cPanel, S3+CloudFront, etc.). Solo sube el contenido de esta carpeta
tal cual, manteniendo la estructura de carpetas (cada página vive en su
propia carpeta como `index.html`, lo que le da su URL "linda" sin necesidad
de configurar reescrituras).

**Importante antes de publicar:** este proyecto usa
`https://www.restaurantdavo.cl` como dominio de referencia en las etiquetas
`canonical`, Open Graph, Twitter Card, `sitemap.xml` y el `robots.txt`
porque no se proporcionó un dominio real. Antes de publicar, reemplaza ese
dominio por el definitivo con una búsqueda y reemplazo global en todos los
archivos `.html`, `sitemap.xml` y `robots.txt`.

**Rutas relativas (importante para GitHub Pages):** todos los enlaces
internos y los archivos de `assets/` usan rutas relativas (`carta/`,
`../assets/css/style.css`, etc.), no absolutas. Esto es a propósito: así el
sitio funciona igual si lo publicas en la raíz de un dominio propio
(`midominio.cl/`) o en un repositorio de proyecto de GitHub Pages, que se
sirve en una subcarpeta (`usuario.github.io/nombre-repo/`). Si ves el sitio
sin estilos o con el menú roto en GitHub Pages, revisa que no hayas
editado esas rutas a mano agregándoles una `/` inicial.

## Estructura del proyecto

```
/index.html                index (Inicio)
/carta/index.html          Carta completa
/especialidades/index.html Especialidades de la Casa
/nosotros/index.html       Historia y tradición familiar
/terraza/index.html        Terraza & Bar
/eventos/index.html        Eventos y reservas especiales
/galeria/index.html        Galería
/ubicacion/index.html      Ubicación
/contacto/index.html       Contacto y reservas
/assets/css/style.css      Sistema de diseño compartido
/assets/js/main.js         Interacciones (menú móvil, scroll, formularios)
/assets/img/og-cover.png   Imagen para Open Graph / Twitter Card
/favicon.svg
/robots.txt
/sitemap.xml
```

Cada página es HTML real e independiente (no es una SPA): la navegación
recarga la página y cada URL es directamente enlazable y compartible.

## Fuente de contenido

Todos los productos, precios, descripciones, teléfono, horario e Instagram
provienen exclusivamente de `RESTAURANT_DAVO_final.txt` (carta oficial
adjunta). Se verificó automáticamente que **ningún precio publicado en el
sitio esté ausente del documento fuente**. Algunos textos del PDF original
llegaron fragmentados (nombre y precio separados por la extracción del
diseño en columnas); se reconstruyeron siguiendo el orden de aparición del
documento. Un solo plato de la carta ("De locura", en Platos Fríos) no tenía
un precio identificable de forma confiable en el texto fuente: se muestra
con la etiqueta "Consultar valor" en vez de inventar una cifra.

## Decisiones de diseño que quiero que conozcas

1. **Fotografía real pendiente.** No recibí fotografías del restaurante, sus
   platos o el local, y el prototipo de Stitch tampoco las incluye (usa
   imágenes de stock genéricas de Google como placeholder). En vez de
   rellenar un sitio "de producción" con fotos de stock que no son de Davo
   ni pueden redistribuirse con garantías, diseñé un lenguaje visual propio:
   línea dorada fina, el motivo de la cruz de andalucita del río Las Cruces
   (mencionado en el propio texto de Laraquete) y texturas sutiles sobre el
   fondo "Coastal Noir". Todos los bloques de imagen (`.plate`) están
   listos para recibir fotografía real: solo hay que reemplazar el `<div
   class="plate">` por una etiqueta `<img>` (o `background-image`) con la
   foto correspondiente — el texto alternativo/label que ya está en cada
   bloque indica exactamente qué foto va ahí. Recomiendo fotografía de
   4:5 o 1:1 para los especiales y 16:9 para las escenas de ambiente.

2. **GSAP → IntersectionObserver.** El brief pedía GSAP/ScrollTrigger para
   animaciones sutiles. Usé una implementación propia con
   `IntersectionObserver` (sin dependencias externas) porque logra el mismo
   efecto de revelado al hacer scroll sin depender de que un CDN de
   terceros esté disponible en producción, evitando justamente el tipo de
   "configuración frágil" que pediste evitar. Respeta
   `prefers-reduced-motion` en todos los casos.

3. **Testimonios e imagen Open Graph.** Los tres testimonios de la portada
   son representativos/de relleno (no hay reseñas reales en el material
   fuente); están marcados con una nota bajo la sección invitando a
   reemplazarlos por reseñas reales. La imagen de Open Graph
   (`assets/img/og-cover.png`) fue generada para que el link previsualice
   correctamente al compartirlo; puedes reemplazarla por una foto real
   cuando esté disponible.

4. **Mapa y "Cómo llegar".** El mapa embebido y el botón "Cómo llegar" usan
   una búsqueda de Google Maps por dirección textual (Ruta 160, Laraquete),
   no coordenadas inventadas, tal como pediste. Si más adelante confirmas
   la ubicación exacta en Google Maps (o el link de Google Business del
   restaurant), puedo reemplazarlo por el embed oficial con el pin exacto.

5. **Formularios.** Los formularios de Contacto y Eventos validan en el
   navegador y arman automáticamente un mensaje de WhatsApp pre-rellenado
   con los datos ingresados (usando el número oficial
   `+56 9 7360 3573`), ya que el sitio es 100% estático y no tiene backend
   propio para recibir correos. Si más adelante quieres que lleguen por
   email también, se puede integrar un servicio como Formspree o Netlify
   Forms sin cambiar el diseño.

## Checklist de calidad ya verificado

- Todos los precios del sitio existen textualmente en el TXT oficial (0
  discrepancias).
- Los 9 enlaces de navegación (desktop y móvil) resuelven a una página real
  en las 9 páginas.
- Las 17 anclas de categorías de la Carta coinciden 1:1 con sus secciones.
- Contraste de color verificado (WCAG AA en todos los pares texto/fondo
  usados).
- CSS y JavaScript sintácticamente válidos (0 errores).
- Cada `<label>` de formulario está correctamente asociado a su campo.
- `prefers-reduced-motion` respetado en animaciones, scroll suave y marquee.
- SEO: `title`/`meta description` exactos según el brief, Open Graph,
  Twitter Card, `Schema.org Restaurant`, `robots.txt` y `sitemap.xml`.

## Pendiente antes de publicar (checklist para el cliente)

- [ ] Reemplazar `www.restaurantdavo.cl` por el dominio real.
- [ ] Reemplazar los bloques `.plate` por fotografía real del restaurante.
- [ ] Reemplazar los 3 testimonios de ejemplo por reseñas reales (o quitar
      la sección).
- [ ] Confirmar el pin exacto en Google Maps si está disponible.
- [ ] Revisar que el horario y los precios sigan vigentes antes de cada
      temporada alta.
