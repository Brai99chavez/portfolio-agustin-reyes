# Portfolio de Agustín Reyes — notas de desarrollo

Sitio de dos páginas (inicio y trabajos) para Agustín Reyes, realizador y editor audiovisual.
Video-first, tipografía cinética, negro alto contraste + acento eléctrico.
HTML + CSS + JS puro (con un paso de build simple que pre-renderiza y arma `dist/`).

## 🚀 Cómo verlo

```bash
npm start          # = node serve.js
#  ▶  http://localhost:5173
```

## 📁 Estructura

```
Portfolios/
├── index.html              # El sitio (fuente, con marcadores de build)
├── serve.js                # Server local (con soporte de Range para video)
├── assets/
│   ├── css/site.css
│   ├── js/
│   │   ├── projects.js     # ⭐ Data de los trabajos (links de Drive, portadas)
│   │   ├── templates.js    # HTML de las cards (fuente única: navegador + build)
│   │   └── app.js          # Interactividad (reel, previews, cursor, animaciones)
│   ├── img/                # Portadas: <slug>.jpg
│   └── video/              # reel.mp4/.jpg + preview-<slug>.mp4 (optimizados)
├── scripts/
│   ├── build.js            # Arma dist/ para deploy
│   └── optimize-video.js   # Comprime videos para la web
├── dist/                   # ← lo ÚNICO que se sube (se genera con npm run build)
└── _videos-sin-usar/       # Material crudo (NO se sube; borrable si tenés backup)
```

## 🎬 Optimizar videos (¡importante para que no pese!)

Nunca subas un video crudo (pesan decenas de MB). Comprimilos primero:

```bash
npm run optimize -- "ruta/al/video.mp4" nombre-salida
# genera en assets/video/:  nombre-salida.mp4  +  nombre-salida.jpg (poster)
```

Ejemplo — reemplazar el reel del hero por el real:

```bash
npm run optimize -- "C:/ruta/mi-reel.mp4" reel
```

Opciones (variables de entorno):

- `WIDTH=1280` ancho máximo (no agranda) · `CRF=30` calidad (18=alta … 32=chica)
- `WEBM=1` genera también `.webm` · `MUTE=1` sin audio

> El reel del hero (`assets/video/reel.mp4`, 8,8 MB) se comprimió con este script. Usá el mismo flujo
> para cualquier video que sumes.
>
> Requiere las dependencias: `npm install` (trae un ffmpeg estático, solo para
> comprimir — **no** forma parte del sitio).

## ✏️ Editar los trabajos

Todo en **`assets/js/projects.js`**:

- `drive` — link de la carpeta de Drive (compartida como *"Cualquier persona con el enlace"*).
- `cover` — portada `assets/img/<slug>.jpg` (si falta, se ve un placeholder con la inicial).
- `featured: true` — aparece en la grilla de **destacados** del home (el resto va a la lista "más trabajos").

## 🏗️ Build (importante antes de publicar)

El contenido (cards, lista, marcas) sale de `assets/js/projects.js` pero se
**pre-renderiza en `index.html`** para que el sitio sea plano: carga instantánea,
buen SEO, previews de links en redes, y a prueba de fallos de JS. El JS del sitio
queda solo para lo interactivo (reel, previews al hover, cursor, animaciones).

```bash
npm run build     # pre-renderiza index.html y arma dist/ (lo único que se sube)
```

Corré esto **cada vez que edites `projects.js`** (o antes de publicar).
En desarrollo, si abrís sin buildear, el JS igual rellena las cards como fallback.

## 🚀 Deploy en Netlify

Solo se sube **`dist/`** (~50 MB, ya optimizado). `node_modules/` y
`_videos-sin-usar/` **nunca** se despliegan.

**Opción A — arrastrar (simple):**
1. `npm run build`
2. Andá a [netlify.com/drop](https://app.netlify.com/drop) y **arrastrá la carpeta `dist/`**. Listo.

**Opción B — con repositorio (auto):**
Conectá el repo; `netlify.toml` ya tiene `command = "npm run build"` y `publish = "dist"`,
así Netlify buildea y publica solo `dist/` en cada push. `.gitignore` deja fuera
`node_modules/`, `dist/` y `_videos-sin-usar/`. `ffmpeg-static` es dependencia
*opcional*: si su descarga fallara en Netlify, el deploy no se rompe (el build no lo usa).

## 🎨 Identidad

- Fondo `#0B0B0D` · texto `#F3F1EC` · acento eléctrico `#2E5BFF` (cambialo en `:root` de `site.css`).
- Tipografías: **Bebas Neue** (titulares), **Inter** (texto), **Space Mono** (labels).
- WhatsApp: `+54 9 2945 64-9461` (`wa.me/5492945649461`).
