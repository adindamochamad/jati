import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

await build({
  entryPoints: ["packages/jati/src/index.ts"],
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  outfile: "dist/jati.browser.js",
  logLevel: "silent",
});

const mentah = readFileSync("dist/jati.browser.js");
const gzip = gzipSync(mentah).length;
const paket = JSON.parse(readFileSync("packages/jati/package.json", "utf8")) as { dependencies?: Record<string, string> };
const jumlah = Object.keys(paket.dependencies ?? {}).length;
console.log(`dependensi runtime ${jumlah}`);
console.log(`bundle gzip ${gzip}`);
if (jumlah > 2 || gzip >= 30 * 1024) process.exit(1);
