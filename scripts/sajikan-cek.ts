import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { bangunHalaman } from "./bangun-halaman.ts";

const akar = await bangunHalaman();
const tipe: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

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
