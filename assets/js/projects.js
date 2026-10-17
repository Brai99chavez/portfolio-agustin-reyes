/* =============================================================
   DATA DE PROYECTOS — Agustín Reyes
   -------------------------------------------------------------
   👉 CÓMO EDITAR (para Agustín / editor):

   Cada trabajo es una TARJETA CON IMAGEN que, al hacer clic,
   abre su CARPETA DE GOOGLE DRIVE en una pestaña nueva.

   • "drive":  link de la carpeta de Drive de ESE trabajo.
     (Botón derecho sobre la carpeta en Drive → "Copiar vínculo".)
     ⚠️ La carpeta debe estar compartida como "Cualquier persona con
        el enlace", si no a quien entre le pide permiso.

   • "cover":  imagen de portada. Por convención:  assets/img/<slug>.jpg
     Poné el archivo con ese nombre y aparece solo. Si no hay imagen,
     se muestra un placeholder de color con la inicial (no rompe nada).
     Sirve .jpg / .png / .webp — ajustá la extensión en "cover" si hace falta.

   • "featured": true  ->  aparece destacado en el Home.
   ============================================================= */

/* Carpeta general (fallback / índice de todo) */
const PARENT_DRIVE = "https://drive.google.com/drive/folders/1soHwBRpJC058Xdcevwgn-eGfhyd99_RG";

const CATEGORIES = [
  { key: "todos",   label: "Todos" },
  { key: "consumo", label: "Consumo Masivo" },
  { key: "moda",    label: "Moda" },
  { key: "deporte", label: "Deporte & Fitness" },
  { key: "salud",   label: "Salud & Estética" },
  { key: "otros",   label: "Real Estate & Medios" }
];

/* Helper: portada por convención (assets/img/<slug>.jpg) */
const cover = (slug) => `assets/img/${slug}.jpg`;

const PROJECTS = [
  {
    slug: "axe",
    title: "Axe Kansas — Mundial 2026",
    client: "AXE · Unilever", category: "consumo",
    tags: ["Campaña", "Video"], year: "2026",
    desc: "Contenido de campaña para el lanzamiento Axe Kansas rumbo al Mundial 2026: recaps, mini entrevistas y presentaciones.",
    cover: cover("axe"), featured: true,
    drive: "https://drive.google.com/drive/folders/134AcseM6E_UDLWrl-gb70-jvUW2mZwi6"
  },
  {
    slug: "rexona",
    title: "Rexona",
    client: "Rexona · Unilever", category: "consumo",
    tags: ["Activaciones", "Video"], year: "2025—26",
    desc: "Cobertura audiovisual de activaciones Rexona: Carrera, Copa, Rexona Point MDQ, torneos de influencers y backstage en Bariloche.",
    cover: cover("rexona"), featured: true,
    drive: "https://drive.google.com/drive/folders/11mn0mqDr2pqlWnFlrW2UzJyDbD9FA0-5"
  },
  {
    slug: "cif-ala-skip",
    title: "CIF · ALA · SKIP",
    client: "Unilever", category: "consumo",
    tags: ["Producto", "Multimarca"], year: "2025",
    desc: "Piezas del plan de innovación para el portfolio de limpieza y cuidado del hogar de Unilever.",
    cover: cover("cif-ala-skip"), featured: true,
    drive: "https://drive.google.com/drive/folders/1mx0SNe8KcTbuCVcCwsix4ghcl9V8kDjq"
  },
  {
    slug: "dove",
    title: "Dove",
    client: "Dove · Unilever", category: "consumo",
    tags: ["Branded Content", "Video"], year: "2026",
    desc: "Recap audiovisual para la marca de cuidado personal Dove.",
    cover: cover("dove"), featured: true,
    drive: "https://drive.google.com/drive/folders/1loItCM0drE9eFF1LP1rJGJK_J3YVdn5k"
  },
  {
    slug: "griffin",
    title: "Griffin",
    client: "Griffin · Indumentaria", category: "moda",
    tags: ["Lookbook", "Video"], year: "2025—26",
    desc: "Contenido de moda para Griffin: drops, exteriores, backstage y piezas cortas para redes.",
    cover: cover("griffin"), featured: true,
    drive: "https://drive.google.com/drive/folders/1tq79glt2B09b6gs3gnQ1Bdc9lvVPvrSJ"
  },
  {
    slug: "fedelite",
    title: "Fedelite — Cherry",
    client: "Fedelite", category: "otros",
    tags: ["Producto", "Video"], year: "2026",
    desc: "Demo y recap de producto para Fedelite (línea Cherry).",
    cover: cover("fedelite"), featured: true,
    drive: "https://drive.google.com/drive/folders/1Lci1rnIQEzi4TfIj0jpSkipodHuPYw0k"
  },

  /* ---- Resto de trabajos ---- */
  {
    slug: "u-talks",
    title: "Unilever U-TALKS",
    client: "Unilever", category: "consumo",
    tags: ["Corporativo", "Video"], year: "2025",
    desc: "Registro y edición de la serie de charlas internas U-TALKS.",
    cover: cover("u-talks"), featured: false,
    drive: "https://drive.google.com/drive/folders/1mEGu2TimVomGxY4nyjyoEmoqyZqodl3W"
  },
  {
    slug: "aaaj-cif",
    title: "AAAJ — CIF",
    client: "CIF · Unilever", category: "consumo",
    tags: ["Foto", "Producto"], year: "2024",
    desc: "Sesión de producto y contenido de marca para CIF.",
    cover: cover("aaaj-cif"), featured: false,
    drive: "https://drive.google.com/drive/folders/174SbIABcBhxzHGHrM5mfpBwnOkF6tIt7"
  },
  {
    slug: "julien",
    title: "Julien",
    client: "Julien · Indumentaria", category: "moda",
    tags: ["Editorial", "Foto"], year: "2025",
    desc: "Editorial de moda y contenido para redes de la marca Julien.",
    cover: cover("julien"), featured: false,
    drive: "https://drive.google.com/drive/folders/122n_TutWW4LMCVsdvZVxEfjOj9flb3yN"
  },
  {
    slug: "raco",
    title: "Racó de la Loixe",
    client: "Racó · Indumentaria", category: "moda",
    tags: ["Lookbook", "Video"], year: "2024",
    desc: "Campaña de temporada y contenido audiovisual de indumentaria.",
    cover: cover("raco"), featured: false,
    drive: "https://drive.google.com/drive/folders/10orm661olv-AZG0F09x_V0ItHRRZZT4S"
  },
  {
    slug: "roda",
    title: "Roda Polo",
    client: "Roda · Indumentaria", category: "moda",
    tags: ["Producto", "Foto"], year: "2024",
    desc: "Sesión de producto e imagen de marca para Roda Polo.",
    cover: cover("roda"), featured: false,
    drive: "https://drive.google.com/drive/folders/1960QVxAdTMApAHTB1VoK75Q9QZ0sVv32"
  },
  {
    slug: "lanus",
    title: "Club Atlético Lanús",
    client: "C.A. Lanús · SUIG", category: "deporte",
    tags: ["Deporte", "Video"], year: "2025",
    desc: "Contenido audiovisual institucional para el Club Atlético Lanús (SUIG).",
    cover: cover("lanus"), featured: false,
    drive: "https://drive.google.com/drive/folders/1gH0mDQbz2fMU4EApTJrMWRH4vuSAzQ8L"
  },
  {
    slug: "technogym",
    title: "Technogym — Ponzio",
    client: "Technogym", category: "deporte",
    tags: ["Fitness", "Video"], year: "2025",
    desc: "Producción de contenido fitness para Technogym junto a Ponzio.",
    cover: cover("technogym"), featured: false,
    drive: "https://drive.google.com/drive/folders/1-_pg1esIYCT_bk3X8GGtNxRte3DS9VBl"
  },
  {
    slug: "nomada",
    title: "Nómada Trail",
    client: "Nómada · Outdoor", category: "deporte",
    tags: ["Trail", "Video"], year: "2024",
    desc: "Cobertura de trail running y contenido outdoor para Nómada.",
    cover: cover("nomada"), featured: false,
    drive: "https://drive.google.com/drive/folders/1jKtMiRGMl2fqxHofGmjp89utOTxR3JBt"
  },
  {
    slug: "merz",
    title: "Merz — Estérica",
    client: "Merz · Estética", category: "salud",
    tags: ["Estética", "Video"], year: "2025",
    desc: "Contenido para el rubro estético y dermatológico junto a Merz.",
    cover: cover("merz"), featured: false,
    drive: "https://drive.google.com/drive/folders/1sbarc1EjL7LZyCnmkgD3USgVRqQo83wM"
  },
  {
    slug: "dacal",
    title: "Inmobiliaria DACAL",
    client: "DACAL · Real Estate", category: "otros",
    tags: ["Inmobiliaria", "Video"], year: "2024",
    desc: "Tours audiovisuales y contenido de propiedades para Inmobiliaria DACAL.",
    cover: cover("dacal"), featured: false,
    drive: "https://drive.google.com/drive/folders/1olNex2_pIxVN4_etLFByDAiiCas8ATWv"
  },
  {
    slug: "conectados",
    title: "Conectados TV",
    client: "Conectados · Medios", category: "otros",
    tags: ["TV", "Edición"], year: "2024",
    desc: "Producción y edición de contenido para el programa Conectados TV.",
    cover: cover("conectados"), featured: false,
    drive: "https://drive.google.com/drive/folders/1gKCGRG-SE17us-gMRsfgT6RvFeT41EqH"
  }
];

function projectBySlug(slug) {
  return PROJECTS.find(p => p.slug === slug) || null;
}
