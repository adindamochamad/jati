import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
function baca(nama: string): string {
  return readFileSync(new URL(`../../../${nama}`, import.meta.url), "utf8");
}

test("halaman cek tetap di origin sendiri", () => {
  const html = baca("apps/cek/index.html");
  const sw = baca("apps/cek/sw.js");
  const css = baca("apps/cek/gaya.css");
  assert.match(html, /connect-src 'self'/);
  assert.doesNotMatch(html, /unsafe-inline/);
  assert.match(html, /lang="id"/);
  assert.match(html, /for="kartu"/);
  assert.match(html, /id="lompat"/);
  assert.match(css, /font-size:\s*18px/);
  assert.match(css, /\.baris button \{ width: 100%; \}/);
  assert.doesNotMatch(css, /(^|\n)\s*button \{ width: 100%/);
  const halaman = baca("apps/cek/src/utama.ts");
  assert.match(halaman, /Langsung ke hasil/);
  assert.match(halaman, /Skip to result/);
  assert.match(halaman, /The result appears here/);
  assert.match(halaman, /daftarDariBerkas/);
  assert.doesNotMatch(halaman, /dicabut\?: unknown/);
  assert.match(halaman, /Daftar origin ini yang dipakai/);
  assert.match(halaman, /This origin's list was used/);
  assert.match(halaman, /bukan daftar akar/);
  assert.match(halaman, /not a root list/);
  assert.match(halaman, /Nama pemilik adalah klaim, bukan KTP/);
  assert.match(halaman, /The owner name is a claim, not an ID card/);
  assert.match(halaman, /Menyalin berkas kartu cukup/);
  assert.match(halaman, /Copying the card file is enough/);
  assert.match(html, /id="jumlah"/);
  assert.match(html, /id="terpakai"/);
  assert.match(html, /id="arti"/);
  assert.match(sw, /pathname\.endsWith\("\/cabut\.json"\)/);
  assert.match(html, /href="gaya.css"/);
  assert.match(html, /src="aplikasi.js"/);
  assert.match(halaman, /fetch\("cabut\.json"/);
  assert.doesNotMatch(sw, /ASET = \[[^\]]*cabut/);
});

test("dependensi runtime hanya canonicalize dan jose", () => {
  const paket = JSON.parse(baca("packages/jati/package.json")) as { dependencies: Record<string, string> };
  assert.deepEqual(Object.keys(paket.dependencies).sort(), ["canonicalize", "jose"]);
});
