/* =============================================================
   optimize-video.js  —  comprime un video para la web
   -------------------------------------------------------------
   Uso:
     node scripts/optimize-video.js <entrada> [nombre-salida]

   Ej:
     node scripts/optimize-video.js "mi-reel.mp4" reel
     -> genera en assets/video/:  reel.mp4  reel.webm  reel.jpg (poster)

   Variables opcionales:
     WIDTH=1280   ancho máximo (no agranda)   [def 1280]
     CRF=30       calidad H.264 (18=alta..32=chica) [def 30]
     WEBM=1       generar también .webm (VP9)  [def 1]
     MUTE=0       1 = sin audio                [def 0]
   ============================================================= */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const FF = require("ffmpeg-static");
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets", "video");

const input = process.argv[2];
if (!input) { console.error("Falta la entrada.\n  node scripts/optimize-video.js <entrada> [nombre]"); process.exit(1); }
if (!fs.existsSync(input)) { console.error("No existe: " + input); process.exit(1); }

const base = (process.argv[3] || path.basename(input, path.extname(input)))
  .replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();

const WIDTH = parseInt(process.env.WIDTH || "1280", 10);
const CRF   = parseInt(process.env.CRF || "30", 10);
const WEBM  = process.env.WEBM === "1";   // en clips cortos el mp4 suele ganar; webm es opt-in
const MUTE  = process.env.MUTE === "1";
const SS    = process.env.SS || "";       // segundo de inicio (recorte)
const DUR   = process.env.DUR || "";       // duración máxima en segundos (recorte)

const inArgs  = SS ? ["-ss", SS, "-i", input] : ["-i", input];
const durArgs = DUR ? ["-t", DUR] : [];

fs.mkdirSync(OUT_DIR, { recursive: true });
const mp4  = path.join(OUT_DIR, base + ".mp4");
const webm = path.join(OUT_DIR, base + ".webm");
const jpg  = path.join(OUT_DIR, base + ".jpg");
const vf = `scale='min(${WIDTH},iw)':-2:flags=lanczos`;
const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(2) + " MB";
const run = (args) => execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

console.log(`\n→ Optimizando "${input}"  (ancho≤${WIDTH}, CRF ${CRF}${MUTE ? ", sin audio" : ""})\n`);

// MP4 (H.264) — compatibilidad universal
run([
  ...inArgs, "-vf", vf,
  "-c:v", "libx264", "-crf", String(CRF), "-preset", "slow", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  ...(MUTE ? ["-an"] : ["-c:a", "aac", "-b:a", "96k"]),
  ...durArgs, mp4
]);
console.log("  ✓ " + path.basename(mp4) + "  " + mb(mp4));

// WebM (VP9) — más chico en navegadores modernos
if (WEBM) {
  run([
    ...inArgs, "-vf", vf,
    "-c:v", "libvpx-vp9", "-crf", String(CRF + 4), "-b:v", "0", "-row-mt", "1", "-deadline", "good",
    ...(MUTE ? ["-an"] : ["-c:a", "libopus", "-b:a", "96k"]),
    ...durArgs, webm
  ]);
  console.log("  ✓ " + path.basename(webm) + "  " + mb(webm));
}

// Poster (frame representativo)
run(["-ss", SS || "1", "-i", input, "-vf", vf + ",thumbnail", "-frames:v", "1", "-q:v", "3", jpg]);
console.log("  ✓ " + path.basename(jpg) + "  " + mb(jpg));

console.log("\nListo. Archivos en assets/video/\n");
