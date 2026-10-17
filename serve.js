/* Servidor estático local — sirve TODO el árbol (los 3 portfolios).
   Uso:  node serve.js   ->   http://localhost:5173
   - /                -> selector de diseños (index.html en la raíz)
   - /portfolio-1/    -> diseño 1
   - /portfolio-2/    -> diseño 2
   - /portfolio-3/    -> diseño 3                                  */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 5173;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml",
  ".gif": "image/gif", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".mp4": "video/mp4", ".webm": "video/webm"
};

http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    let filePath = path.join(ROOT, urlPath);

    // /portfolio-2/  ->  /portfolio-2/index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath)) {
      res.writeHead(404); return res.end("Not found: " + urlPath);
    }

    const stat = fs.statSync(filePath);
    const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range;

    // Range (necesario para reproducir <video> de forma fiable)
    if (range && /^bytes=/.test(range)) {
      const [s, e] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(s, 10);
      const end = e ? parseInt(e, 10) : stat.size - 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": type
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, { "Content-Length": stat.size, "Content-Type": type, "Accept-Ranges": "bytes" });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500); res.end("Server error");
  }
}).listen(PORT, () => console.log(`\n  ▶  Portfolios en:  http://localhost:${PORT}\n     (Ctrl+C para detener)\n`));
