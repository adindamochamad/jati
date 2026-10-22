import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { verifikasi, type JWKS, type KartuJati, type OpsiVerifikasi } from "../src/index.ts";

const require = createRequire(import.meta.url);
const akarPaket = fileURLToPath(new URL("..", import.meta.url));
const berkasEsm = fileURLToPath(new URL("../dist/src/index.js", import.meta.url));

test("berkas ESM, CJS, tipe, dan bin ikut terbit", async () => {
  const esm = (await import(berkasEsm)) as { verifikasi: typeof verifikasi };
  const cjs = require("../dist/cjs/index.cjs") as { verifikasi: (kartu: unknown, opsi: OpsiVerifikasi) => Promise<Awaited<ReturnType<typeof verifikasi>>> };
  const kartu = JSON.parse(readFileSync(new URL("../../../fixtures/valid.json", import.meta.url), "utf8")) as KartuJati;
  const jwks = JSON.parse(readFileSync(new URL("../../../fixtures/penerbit.public.jwks.json", import.meta.url), "utf8")) as JWKS;
  const opsi = { jwksTepercaya: jwks, sekarang: new Date("2026-10-21T12:00:00+07:00"), dicabut: [] as string[] };
  const dariEsm = await esm.verifikasi(kartu, opsi);
  const dariCjs = await cjs.verifikasi(kartu, opsi);
  assert.equal(dariEsm.kode, "JATI_OK");
  assert.equal(dariCjs.kode, "JATI_OK");
  assert.equal(dariCjs.kalimat, dariEsm.kalimat);
  const tipe = readFileSync(new URL("../dist/src/index.d.ts", import.meta.url), "utf8");
  assert.match(tipe, /verifikasi/);
  assert.doesNotMatch(tipe, /\.ts"/);
  const bin = readFileSync(new URL("../dist/bin/jati.js", import.meta.url), "utf8");
  assert.match(bin, /^#!\/usr\/bin\/env node\n/);
  assert.doesNotMatch(bin, /strip-types/);
  const jalan = spawnSync(process.execPath, [fileURLToPath(new URL("../dist/bin/jati.js", import.meta.url))], {
    encoding: "utf8",
  });
  assert.equal(jalan.status, 2);
  assert.match(jalan.stderr, /kunci-baru/);
  const pak = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: akarPaket,
    encoding: "utf8",
  });
  assert.equal(pak.status, 0, pak.stderr);
  const daftar = JSON.parse(pak.stdout) as { files: { path: string }[] }[];
  const path = daftar[0]?.files.map((berkas) => berkas.path) ?? [];
  for (const nama of ["dist/src/index.js", "dist/src/index.d.ts", "dist/cjs/index.cjs", "dist/bin/jati.js"]) {
    assert.equal(path.some((item) => item === nama || item.endsWith(`/${nama}`)), true, nama);
  }
  assert.equal(path.some((nama) => nama.includes("private")), false);
});
