import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, cp, mkdir } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { build } from "esbuild";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode") as {
  toFile(path: string, teks: string, opsi: { errorCorrectionLevel: "L"; margin: number }): Promise<void>;
};

const akar = join(process.cwd(), "apps/cek/dist");
const tipe: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

await mkdir(akar, { recursive: true });
await build({
  entryPoints: ["apps/cek/src/utama.ts"],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: join(akar, "aplikasi.js"),
  logLevel: "silent",
});
await cp("apps/cek/index.html", join(akar, "index.html"));
await cp("apps/cek/gaya.css", join(akar, "gaya.css"));
await cp("apps/cek/sw.js", join(akar, "sw.js"));
await cp("fixtures/valid.json", join(akar, "contoh.json"));
await cp("fixtures/penerbit.public.jwks.json", join(akar, "jwks.json"));
await cp("fixtures/cabut.json", join(akar, "cabut.json"));
await QRCode.toFile(join(akar, "contoh-qr.png"), await readFile("fixtures/valid.json", "utf8"), {
  errorCorrectionLevel: "L",
  margin: 1,
});

function jalurAman(url: string): string | undefined {
  let path = "/";
  try {
    path = decodeURIComponent(new URL(url, "http://127.0.0.1").pathname);
  } catch {
    return undefined;
  }
  const relatif = normalize(path).replace(/^(\.\.(\/|\\|$))+/, "");
  const nama = relatif === "/" || relatif === "." || relatif === sep ? "index.html" : relatif.replace(/^[/\\]/, "");
  const penuh = join(akar, nama);
  if (penuh !== akar && !penuh.startsWith(akar.endsWith(sep) ? akar : akar + sep)) return undefined;
  return penuh;
}

const port = Number(process.env["PORT"] ?? 4173);
const server = createServer((req, res) => {
  const penuh = jalurAman(req.url ?? "/");
  if (!penuh) {
    res.writeHead(400);
    res.end();
    return;
  }
  void readFile(penuh)
    .then((isi) => {
      const nama = extname(penuh);
      const header: Record<string, string> = { "content-type": tipe[nama] ?? "application/octet-stream" };
      if (penuh.endsWith(`${sep}cabut.json`)) header["cache-control"] = "no-store";
      res.writeHead(200, header);
      res.end(isi);
    })
    .catch(() => {
      res.writeHead(404);
      res.end();
    });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
