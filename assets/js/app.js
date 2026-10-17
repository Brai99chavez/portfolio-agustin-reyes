/* =============================================================
   AGUSTÍN REYES — "Editor's Cut" · app.js
   Reel con sonido, marcas, render de trabajos, reveal, cursor.
   ============================================================= */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const yEl = $("#y"); if (yEl) yEl.textContent = new Date().getFullYear();

  const hasProjects  = typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine   = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ---------- Nav scrolled ---------- */
  const nav = $("#nav");
  if (nav) {
    const onS = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onS(); window.addEventListener("scroll", onS, { passive: true });
  }

  /* ---------- Menú mobile (hamburguesa) ---------- */
  const burger = $("#burger"), mobileMenu = $("#mobileMenu");
  if (burger && mobileMenu) {
    const setOpen = (open) => {
      burger.classList.toggle("open", open);
      mobileMenu.classList.toggle("open", open);
      document.body.classList.toggle("no-scroll", open);
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", () => setOpen(!mobileMenu.classList.contains("open")));
    $$("a", mobileMenu).forEach(a => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- Reel: sonido on/off ---------- */
  const reel = $("#reel"), ctrl = $("#reelCtrl"), ico = $("#reelIco"), txt = $("#reelTxt");
  const ICON_MUTE = '<path d="M11 5 6 9H2v6h4l5 4z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
  const ICON_ON   = '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>';
  if (reel && ctrl) {
    const VOL = 0.6;                 // 60% para que no sea ruidoso
    reel.volume = VOL;
    const sync = () => {
      ico.innerHTML = reel.muted ? ICON_MUTE : ICON_ON;
      txt.textContent = reel.muted ? "Sonido" : "Silenciar";
      ctrl.setAttribute("aria-label", reel.muted ? "Activar sonido del reel" : "Silenciar el reel");
    };
    const unmute = () => {
      reel.muted = false; reel.volume = VOL;
      const p = reel.play(); if (p && p.catch) p.catch(() => {});
      sync();
    };
    // Arranca muteado (autoplay); el usuario activa el sonido con el botón.
    // Al desmutear queda a 60% de volumen (VOL).
    ctrl.addEventListener("click", () => { if (reel.muted) unmute(); else { reel.muted = true; sync(); } });
    sync();
  }

  /* ---------- Render ----------
     Si el HTML NO viene pre-construido (dev, sin build), lo arma acá desde
     projects.js + templates.js. Si el build ya lo pre-renderizó (deploy),
     se saltea y solo se engancha el comportamiento de más abajo. */
  const TPL = (typeof window !== "undefined" && window.TPL) ? window.TPL : null;

  const track = $("#brandsTrack");
  if (track && TPL && !track.children.length) track.innerHTML = TPL.brandsHTML();

  const hasCats = typeof CATEGORIES !== "undefined" && Array.isArray(CATEGORIES);
  const hasVclips = typeof VIDEOCLIPS !== "undefined" && Array.isArray(VIDEOCLIPS);
  if (hasProjects && TPL) {
    const grid = $("#featured");
    if (grid && !grid.querySelector(".wcard")) grid.innerHTML = TPL.featuredHTML(PROJECTS);
    const all = $("#all");
    if (all && !all.querySelector(".wcard")) all.innerHTML = TPL.trabajosHTML(PROJECTS, hasVclips ? VIDEOCLIPS : []);
    const filt = $("#filters");
    if (filt && !filt.querySelector(".filter") && hasCats) filt.innerHTML = TPL.trabajosFiltersHTML(CATEGORIES);
  }

  /* ---------- Filtros de Trabajos (tipo + rubro) con re-layout FLIP ---------- */
  const allGrid = $("#all");
  const filtersWrap = $("#filters");
  if (allGrid && filtersWrap) {
    const cards = $$(".wcard", allGrid);
    const matches = (c, key) => {
      if (key === "todos") return true;
      if (key === "marca") return c.dataset.type === "marca";
      if (key === "videoclip") return c.dataset.type === "videoclip";
      return c.dataset.type === "marca" && c.dataset.cat === key;   // rubro (solo marcas)
    };
    const applyFilter = (key) => {
      const first = new Map(), wasHidden = new Map();
      cards.forEach(c => { wasHidden.set(c, c.classList.contains("is-hidden")); first.set(c, c.getBoundingClientRect()); });
      cards.forEach(c => c.classList.toggle("is-hidden", !matches(c, key)));
      if (reduce) return;
      cards.forEach(c => {
        if (c.classList.contains("is-hidden")) return;
        const last = c.getBoundingClientRect();
        if (wasHidden.get(c)) {
          c.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(0.16,1,0.3,1)" });
        } else {
          const prev = first.get(c), dx = prev.left - last.left, dy = prev.top - last.top;
          if (dx || dy) c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0,0)" }], { duration: 500, easing: "cubic-bezier(0.16,1,0.3,1)" });
        }
      });
    };
    const rubros = filtersWrap.querySelector("#rubros");
    const activate = (key) => {
      const btn = filtersWrap.querySelector(`.filter[data-filter="${key}"]`);
      if (!btn) return;
      $$(".filter", filtersWrap).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (rubros) rubros.style.display = (key === "videoclip") ? "none" : "";   // rubros solo para marcas
      applyFilter(key);
    };
    filtersWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (btn) activate(btn.dataset.filter);
    });
    // filtro inicial por hash (ej: trabajos.html#videoclip)
    const h = (location.hash || "").replace("#", "").trim();
    if (h) activate(h);
  }

  /* ---------- Preview en video ----------
     Desktop (puntero fino): reproduce al pasar el mouse.
     Mobile / touch: autoplay en loop SIEMPRE (tocar la card = abrir Drive).
     En mobile el video se carga recién al entrar en viewport, para no
     malgastar datos, y se pausa fuera de pantalla (imperceptible al scrollear). */
  if (!reduce) {
    const pcards = $$(".wcard[data-preview]");

    const makeVideo = (card) => {
      const v = document.createElement("video");
      v.className = "wcard__video";
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
      v.addEventListener("canplay", () => v.classList.add("playing"));
      v.addEventListener("error", () => { try { v.remove(); } catch (e) {} card._err = true; });
      v.src = card.dataset.preview;   // recién acá empieza a bajar
      card.appendChild(v);
      card._video = v;
      return v;
    };
    const playCard = (card) => {
      if (card._err) return;
      const v = card._video || makeVideo(card);
      v.classList.add("playing");
      const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
    };
    const pauseCard = (card, hide) => {
      const v = card._video; if (!v) return;
      if (hide) v.classList.remove("playing");
      try { v.pause(); } catch (e) {}
    };

    if (fine) {
      // Desktop: hover
      pcards.forEach((card) => {
        card.addEventListener("mouseenter", () => playCard(card));
        card.addEventListener("mouseleave", () => pauseCard(card, true));
      });
    } else if ("IntersectionObserver" in window) {
      // Mobile: autoplay en loop cuando está (cerca de) la pantalla
      const io = new IntersectionObserver((ents) => {
        ents.forEach((e) => { if (e.isIntersecting) playCard(e.target); else pauseCard(e.target, false); });
      }, { rootMargin: "150px 0px", threshold: 0.1 });
      pcards.forEach((c) => io.observe(c));
    } else {
      // Fallback: reproducir todas
      pcards.forEach(playCard);
    }
  }

  /* (los videoclips ahora usan preview local vía data-preview, igual que las marcas) */

  /* ---------- Reveal ---------- */
  const revEls = $$("[data-reveal]");
  if (!("IntersectionObserver" in window) || reduce) {
    revEls.forEach(el => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revEls.forEach(el => io.observe(el));
  }

  /* ---------- Cursor eléctrico ---------- */
  if (fine && !reduce) {
    document.body.classList.add("has-cursor");
    const cur = $(".cur");
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      cx += (mx - cx) * 0.25; cy += (my - cy) * 0.25;
      if (cur) { cur.style.left = cx + "px"; cur.style.top = cy + "px"; }
      requestAnimationFrame(loop);
    })();
    const sel = "a, button, .wcard, .more__row, .reel-ctrl";
    document.addEventListener("mouseover", (e) => { if (cur && e.target.closest(sel)) cur.classList.add("link"); });
    document.addEventListener("mouseout",  (e) => { if (cur && e.target.closest(sel)) cur.classList.remove("link"); });
  }
})();
