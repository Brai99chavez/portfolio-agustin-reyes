/* =============================================================
   build.js — pre-renderiza las cards y arma dist/ para deploy
   -------------------------------------------------------------
   1) Vuelca projects.js + templates.js dentro de index.html
      (entre los marcadores <!-- BUILD:x --> ... <!-- /BUILD:x -->).
   2) Copia SOLO lo necesario a dist/ (index.html + assets, sin basura).

   dist/ es lo ÚNICO que se sube a Netlify. Todo lo demás
   (node_modules, _videos-sin-usar, scripts, etc.) queda afuera.

   Uso:  npm run build   (o  node scripts/build.js)
   ============================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TPL = require(path.join(ROOT, "assets", "js", "templates.js"));
const INDEX = path.join(ROOT, "index.html");
const PROJECTS_JS = path.join(ROOT, "assets", "js", "projects.js");
const DIST = path.join(ROOT, "dist");

function loadData() {
  const src = fs.readFileSync(PROJECTS_JS, "utf8");
  return new Function(src + "\nreturn { PROJECTS: (typeof PROJECTS!=='undefined'?PROJECTS:[]), CATEGORIES: (typeof CATEGORIES!=='undefined'?CATEGORIES:[]) };")();
}
function loadVideoclips() {
  const p = path.join(ROOT, "assets", "js", "videoclips.js");
  if (!fs.existsSync(p)) return [];
  const src = fs.readFileSync(p, "utf8");
  return new Function(src + "\nreturn (typeof VIDEOCLIPS!=='undefined'?VIDEOCLIPS:[]);")();
}
function replaceBlock(html, key, inner) {
  const re = new RegExp(`(<!-- BUILD:${key} -->)([\\s\\S]*?)(<!-- /BUILD:${key} -->)`);
  if (!re.test(html)) { console.warn(`  ! marcador BUILD:${key} no encontrado`); return html; }
  return html.replace(re, `$1\n${inner}\n$3`);
}
function dirSize(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    n += e.isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return n;
}

/* Qué marcadores lleva cada página */
const { PROJECTS, CATEGORIES } = loadData();
const VIDEOCLIPS = loadVideoclips();
const RENDER = {
  brands:   () => TPL.brandsHTML(),
  featured: () => TPL.featuredHTML(PROJECTS),
  filters:  () => TPL.trabajosFiltersHTML(CATEGORIES),          // toggle tipo + rubros
  grid:     () => TPL.trabajosHTML(PROJECTS, VIDEOCLIPS),       // marcas + videoclips unificados
};
const PAGES = [
  { file: "index.html",    blocks: ["brands", "featured"] },     // inicio: marquee + destacados
  { file: "trabajos.html", blocks: ["filters", "grid"] },        // marcas + videoclips en una grilla
];

/* 1) Pre-render de cada página (en el lugar; sirve también para el dev local) */
for (const page of PAGES) {
  const fp = path.join(ROOT, page.file);
  if (!fs.existsSync(fp)) { console.warn(`  ! falta ${page.file}`); continue; }
  let h = fs.readFileSync(fp, "utf8");
  for (const b of page.blocks) h = replaceBlock(h, b, RENDER[b]());
  fs.writeFileSync(fp, h);
}

/* 2) Armar dist/ limpio (solo las páginas + assets) */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const page of PAGES) {
  const fp = path.join(ROOT, page.file);
  if (fs.existsSync(fp)) fs.copyFileSync(fp, path.join(DIST, page.file));
}
fs.cpSync(path.join(ROOT, "assets"), path.join(DIST, "assets"), {
  recursive: true,
  filter: (src) => !/LEEME\.txt$/i.test(src)   // notas locales, no van al deploy
});

/* netlify.toml dentro de dist (headers de cache) — para deploy por arrastre */
fs.writeFileSync(path.join(DIST, "netlify.toml"),
`# Deploy estático (dist/). Sin build: ya está todo pre-renderizado.
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
`);

const featured = PROJECTS.filter(p => p.featured).length;
const mb = (dirSize(DIST) / 1048576).toFixed(1);
console.log(`\n✓ Build listo`);
console.log(`  ${PROJECTS.length} trabajos · ${featured} destacados · ${PROJECTS.length - featured} en lista`);
console.log(`  dist/  =  ${mb} MB  (esto es lo único que se sube a Netlify)\n`);
