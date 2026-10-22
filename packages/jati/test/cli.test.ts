import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const bin = fileURLToPath(new URL("../bin/jati.ts", import.meta.url));

function jalan(cwd: string, args: string[]) {
  return spawnSync(process.execPath, ["--experimental-strip-types", bin, ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("kunci-baru, terbit, dan cek", () => {
  const dir = mkdtempSync(join(tmpdir(), "jati-cli-"));
  try {
    const kunci = jalan(dir, ["kunci-baru"]);
    assert.equal(kunci.status, 0, kunci.stderr);
    assert.equal(readFileSync(join(dir, "penerbit.public.jwks.json"), "utf8").includes('"d"'), false);
    const terbit = jalan(dir, [
      "terbit",
      "--pemilik",
      "PT Contoh",
      "--limit",
      "500000",
      "--terbit",
      "2026-10-21T00:00:00+07:00",
      "--sampai",
      "2026-12-31T23:59:59+07:00",
    ]);
    assert.equal(terbit.status, 0, terbit.stderr);
    assert.match(terbit.stderr, /Kartu mandiri/);
    const mandiri = jalan(dir, ["cek", "kartu.json", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(mandiri.status, 1, mandiri.stderr);
    assert.equal(mandiri.stdout, "Tanda tangan cocok, penerbit belum dikenal.\n");
    const uji = jalan(dir, [
      "terbit",
      "--pemilik",
      "PT Uji",
      "--limit",
      "500000",
      "--terbit",
      "2026-10-21T00:00:00+07:00",
      "--sampai",
      "2026-12-31T23:59:59+07:00",
      "--keluar",
      "uji.json",
    ]);
    assert.equal(uji.status, 0, uji.stderr);
    const cekUji = jalan(dir, ["cek", "uji.json", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(cekUji.status, 1);
    assert.equal(cekUji.stdout, "Tanda tangan cocok, penerbit belum dikenal.\n");
    const cek = jalan(dir, ["cek", "kartu.json", "--percaya", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(cek.status, 0, cek.stderr);
    assert.equal(cek.stdout, "Kartu asli. Pemilik: PT Contoh. Berlaku sampai 31 Des 2026.\n");
    assert.match(cek.stderr, /Nama pemilik tetap klaim/);
    const tanpa = jalan(dir, ["cek", "kartu.json", "--percaya", "--tanpa-cabut", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(tanpa.status, 1);
    assert.equal(tanpa.stdout, "Tidak pasti. Pencabutan belum bisa dicek.\n");
    const inggris = jalan(dir, ["cek", "kartu.json", "--percaya", "--en", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(inggris.stdout, "Genuine card. Owner: PT Contoh. Valid until 31 Des 2026.\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
