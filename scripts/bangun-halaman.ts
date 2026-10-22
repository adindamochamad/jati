import { createRequire } from "node:module";
import { cp, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode") as {
  toFile(path: string, teks: string, opsi: { errorCorrectionLevel: "L"; margin: number }): Promise<void>;
};

export async function bangunHalaman(): Promise<string> {
  const akar = join(process.cwd(), "apps/cek/dist");
  await mkdir(join(akar, ".well-known"), { recursive: true });
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
  await cp("fixtures/penerbit.public.jwks.json", join(akar, ".well-known/jati.json"));
  await cp("fixtures/cabut.json", join(akar, "cabut.json"));
  await QRCode.toFile(join(akar, "contoh-qr.png"), await readFile("fixtures/valid.json", "utf8"), {
    errorCorrectionLevel: "L",
    margin: 1,
  });
  return akar;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await bangunHalaman();
}
