// Generates printable QR assets that point at the tracker page (NOT Venmo).
import QRCode from "qrcode";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL = "https://mikejones.online/july4";
const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const opts = { errorCorrectionLevel: "M", margin: 2, width: 900 };

const svg = await QRCode.toString(URL, { ...opts, type: "svg" });
writeFileSync(join(outDir, "july4-qr.svg"), svg);
await QRCode.toFile(join(outDir, "july4-qr.png"), URL, opts);

const printHtml = `<!doctype html><html><head><meta charset="utf-8">
<title>Dolphin Slide — Scan to Chip In</title>
<style>
  body { font-family: system-ui, sans-serif; text-align: center; padding: 6vh 5vw; color: #0f172a; }
  h1 { font-size: 2.5rem; margin: 0 0 .25em; }
  p { font-size: 1.4rem; color: #334155; margin: .25em 0; }
  img { width: min(70vw, 480px); height: auto; margin: 2vh auto; }
  .url { font-weight: 700; font-size: 1.6rem; color: #2563eb; }
  @media print { .noprint { display: none; } }
</style></head>
<body>
  <h1>🐬 The Great Dolphin Slide 🎆</h1>
  <p>Scan to chip in for the 4th of July slide!</p>
  <img src="./july4-qr.png" alt="QR code to mikejones.online/july4">
  <p class="url">mikejones.online/july4</p>
  <button class="noprint" onclick="window.print()" style="margin-top:2vh;padding:.6em 1.4em;font-size:1.1rem;">Print this</button>
</body></html>`;
writeFileSync(join(outDir, "july4-qr-print.html"), printHtml);

console.log("QR assets written to site/public/: july4-qr.svg, july4-qr.png, july4-qr-print.html");
