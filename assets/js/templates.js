/* =============================================================
   templates.js — HTML de las cards (ÚNICA fuente)
   Lo usan tanto el navegador (app.js) como el build (scripts/build.js),
   así el markup nunca se desincroniza.
   ============================================================= */
(function (root) {
  "use strict";

  const BRANDS = ["Unilever", "Dove", "Rexona", "AXE", "CIF", "Technogym", "C.A. Lanús", "Griffin", "Merz", "DACAL", "Nómada"];
  const SIZES  = ["big", "tall", "", "", "tall", "big"];   // ritmo de la grilla asimétrica

  const esc = (s) => String(s == null ? "" : s);

  function wcard(p, i, sizeClass, previewUrl) {
    const num = String(i + 1).padStart(2, "0");
    const initial = (p.title || "?").trim().charAt(0).toUpperCase();
    const tags = (p.tags || []).map((t, k) => `<span class="wcard__tag${k === 0 ? " on" : ""}">${esc(t)}</span>`).join("");
    const cover = p.cover ? `<img class="wcard__img" src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy" onerror="this.remove()">` : "";
    return `
      <a class="wcard ${sizeClass}" href="${esc(p.drive)}" target="_blank" rel="noopener"
         data-reveal data-type="marca" data-cat="${esc(p.category)}" ${previewUrl ? `data-preview="${esc(previewUrl)}"` : ""} aria-label="${esc(p.title)} — abrir en Drive">
        <div class="wcard__bg" style="background:linear-gradient(150deg,#1b1d26,#0c0d11);"></div>
        <span class="wcard__initial" aria-hidden="true">${initial}</span>
        ${cover}
        <span class="wcard__scrim"></span>
        <span class="wcard__num">(${num})</span>
        <span class="wcard__play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
        <div class="wcard__body">
          <div class="wcard__tags">${tags}</div>
          <h3 class="wcard__title">${esc(p.title)}</h3>
          <div class="wcard__client">${esc(p.client)} · ${esc(p.year)}</div>
          <span class="wcard__cta">Ver en Drive ↗</span>
        </div>
      </a>`;
  }

  function moreRow(p, n) {
    const cat = (p.tags && p.tags[0]) ? p.tags[0] : "";
    return `
      <a class="more__row" href="${esc(p.drive)}" target="_blank" rel="noopener" data-reveal aria-label="${esc(p.title)} — abrir en Drive">
        <span class="more__n">${esc(n)}</span>
        <span class="more__name">${esc(p.title)}</span>
        <span class="more__cat">${esc(cat)} · ${esc(p.year)}</span>
        <span class="more__arrow">↗</span>
      </a>`;
  }

  function featuredHTML(PROJECTS) {
    const featured = PROJECTS.filter(p => p.featured);
    return featured.map((p, i) =>
      wcard(p, i, SIZES[i % SIZES.length], `assets/video/preview-${p.slug}.mp4`)).join("");
  }

  function moreHTML(PROJECTS) {
    const featured = PROJECTS.filter(p => p.featured);
    const rest = PROJECTS.filter(p => !p.featured);
    // Tarjetas más chicas (uniformes). Cada una lista para imagen (cover) y/o
    // video de fondo (preview-<slug>.mp4). Si no hay media, cae al placeholder.
    return rest.map((p, i) =>
      wcard(p, featured.length + i, "sm", `assets/video/preview-${p.slug}.mp4`)).join("");
  }

  function brandsHTML() {
    const one = BRANDS.map(b => `<span class="brands__i">${esc(b)}</span><span class="brands__i brands__sep">✦</span>`).join("");
    return one + one;   // duplicado para el loop sin corte
  }

  // Página Marcas: grilla uniforme de TODOS los trabajos + filtros por rubro
  function allHTML(PROJECTS) {
    return PROJECTS.map((p, i) =>
      wcard(p, i, "md", `assets/video/preview-${p.slug}.mp4`)).join("");
  }
  function catsHTML(CATEGORIES) {
    return (CATEGORIES || []).map((c, i) =>
      `<button class="filter${i === 0 ? " active" : ""}" data-filter="${esc(c.key)}">${esc(c.label)}</button>`).join("");
  }

  // ---- Videoclips (YouTube) ----
  function ytId(url) {
    if (!url) return "";
    const s = String(url).trim();
    const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    if (m) return m[1];
    if (/^[\w-]{11}$/.test(s)) return s;   // ya es un ID
    return "";
  }
  function vcardHTML(v, i) {
    const num = String(i + 1).padStart(2, "0");
    const id = ytId(v.yt);
    const initial = (v.artist || v.title || "?").trim().charAt(0).toUpperCase();
    const thumb = id
      ? `<img class="wcard__img" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${esc(v.artist)} — ${esc(v.title)}" loading="lazy" onerror="this.remove()">`
      : "";
    const cta = id
      ? `<span class="wcard__cta">Ver en YouTube ↗</span>`
      : `<span class="wcard__cta wcard__cta--soon">Próximamente</span>`;
    const attrs = id
      ? `href="https://youtu.be/${id}" target="_blank" rel="noopener"`
      : `href="#" aria-disabled="true" tabindex="-1" onclick="return false"`;
    const play = id ? `<span class="wcard__play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>` : "";
    return `
      <a class="wcard vcard${id ? "" : " is-empty"}" ${attrs} data-reveal data-type="videoclip"${id ? ` data-preview="assets/video/preview-vc-${id}.mp4"` : ""} aria-label="${esc(v.artist)} — ${esc(v.title)}">
        <div class="wcard__bg" style="background:linear-gradient(150deg,#1b1d26,#0c0d11);"></div>
        <span class="wcard__initial" aria-hidden="true">${initial}</span>
        ${thumb}
        <span class="wcard__scrim"></span>
        <span class="wcard__num">(${num})</span>
        ${play}
        <div class="wcard__body">
          <div class="wcard__tags"><span class="wcard__tag on">Videoclip</span></div>
          <h3 class="wcard__title">${esc(v.title)}</h3>
          <div class="wcard__client">${esc(v.artist)}</div>
          ${cta}
        </div>
      </a>`;
  }
  function videoclipsHTML(VIDEOCLIPS) {
    return (VIDEOCLIPS || []).map((v, i) => vcardHTML(v, i)).join("");
  }

  // ---- Página "Trabajos" (marcas + videoclips unificados) ----
  function trabajosHTML(PROJECTS, VIDEOCLIPS) {
    const marcas = (PROJECTS || []).map((p, i) => wcard(p, i, "", `assets/video/preview-${p.slug}.mp4`));
    const clips  = (VIDEOCLIPS || []).map((v, i) => vcardHTML(v, i));
    return marcas.concat(clips).join("");
  }
  function trabajosFiltersHTML(CATEGORIES) {
    const types = [
      { key: "todos",     label: "Todos" },
      { key: "marca",     label: "Marcas" },
      { key: "videoclip", label: "Videoclips" }
    ];
    const rubros = (CATEGORIES || []).filter(c => c.key && c.key !== "todos");
    const t = types.map((c, i) => `<button class="filter${i === 0 ? " active" : ""}" data-filter="${esc(c.key)}">${esc(c.label)}</button>`).join("");
    const r = rubros.map(c => `<button class="filter filter--rubro" data-filter="${esc(c.key)}">${esc(c.label)}</button>`).join("");
    // Rubros de industria: solo aplican a Marcas. Se ocultan en Videoclips (ver app.js).
    return t + `<span class="filters__rubros" id="rubros"><span class="filters__sep" aria-hidden="true"></span>${r}</span>`;
  }

  const api = { wcard, moreRow, featuredHTML, moreHTML, brandsHTML, allHTML, catsHTML, ytId, vcardHTML, videoclipsHTML, trabajosHTML, trabajosFiltersHTML, BRANDS, SIZES };
  if (typeof module !== "undefined" && module.exports) module.exports = api;   // Node (build)
  else root.TPL = api;                                                          // navegador
})(typeof window !== "undefined" ? window : globalThis);
