import { chmodSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const akar = dirname(fileURLToPath(new URL(".", import.meta.url)));
const dist = join(akar, "packages/jati/dist");
const berkasBin = join(dist, "bin/jati.js");
const shebangLama = "#!/usr/bin/env -S node --experimental-strip-types\n";
const shebangBaru = "#!/usr/bin/env node\n";

function berkasDeklarasi(folder: string): void {
  for (const nama of readdirSync(folder)) {
    const path = join(folder, nama);
    if (statSync(path).isDirectory()) {
      berkasDeklarasi(path);
      continue;
    }
    if (!nama.endsWith(".d.ts")) continue;
    const asli = readFileSync(path, "utf8");
    const tanpaShebang = asli.startsWith("#!") ? asli.slice(asli.indexOf("\n") + 1) : asli;
    const baru = tanpaShebang.replaceAll(/from "(\.[^"]+)\.ts"/g, 'from "$1.js"');
    if (baru !== asli) writeFileSync(path, baru);
  }
}

berkasDeklarasi(dist);

const bin = readFileSync(berkasBin, "utf8");
if (!bin.startsWith(shebangLama)) throw new Error("Shebang bin terbit tidak dikenali.");
writeFileSync(berkasBin, shebangBaru + bin.slice(shebangLama.length));
chmodSync(berkasBin, 0o755);

await build({
  absWorkingDir: akar,
  entryPoints: ["packages/jati/src/index.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: "packages/jati/dist/cjs/index.cjs",
  logLevel: "silent",
  banner: {
    js: "// jose 6 dan canonicalize 5 hanya menyediakan ESM. Berkas ini membundel keduanya supaya require() tetap jalan.",
  },
});
