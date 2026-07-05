# Ruleta de Entradas · Chuflay

Sitio estático listo para GitHub Pages.

## Qué hace
- Muestra una ruleta animada.
- Elige 1 integrante al azar con la misma probabilidad.
- Revela el QR correspondiente.
- Funciona solo con HTML, CSS y JavaScript.

## Estructura
- `index.html`
- `styles.css`
- `app.js`
- `assets/qr-ferru.png`
- `assets/qr-pollo.png`
- `assets/qr-piki.png`
- `assets/qr-sam.png`
- `assets/qr-koca.png`

## Cómo publicarlo en GitHub Pages
1. Crea un repositorio nuevo en GitHub.
2. Sube todos estos archivos a la raíz del repo.
3. Ve a **Settings** → **Pages**.
4. En **Build and deployment**, elige:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Guarda los cambios y espera a que GitHub publique la página.

## Cómo usarlo en el afiche
Cuando tengas la URL publicada de GitHub Pages, genera un QR único que apunte a esa dirección y pon ese QR en el flyer.

## Cómo cambiar los enlaces
En `app.js`, edita el array `options`:
- `name` = nombre del integrante
- `qr` = imagen QR de ese integrante
- `link` = enlace opcional de pago

Si `link` está vacío, solo se mostrará el QR.
