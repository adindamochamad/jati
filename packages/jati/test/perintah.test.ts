import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../..", import.meta.url));

function jalankan(args: string[]) {
  return spawnSync(process.execPath, ["--experimental-strip-types", "scripts/verifikasi.ts", ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("perintah verifikasi menerima kartu contoh", () => {
  const hasil = jalankan(["--", "--sekarang", "2026-10-21T12:00:00+07:00"]);
  assert.equal(hasil.status, 0, hasil.stderr);
  assert.equal(hasil.stdout, "Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.\n");
});

test("perintah tanpa daftar cabut tidak menulis kartu asli", () => {
  const hasil = jalankan(["--tanpa-cabut", "--sekarang", "2026-10-21T12:00:00+07:00"]);
  assert.equal(hasil.status, 1);
  assert.equal(hasil.stdout, "Tidak pasti. Pencabutan belum bisa dicek.\n");
});

test("perintah --ditemukan tidak menganggap penerbit dikenal", () => {
  const hasil = jalankan(["--ditemukan", "--sekarang", "2026-10-21T12:00:00+07:00"]);
  assert.equal(hasil.status, 1);
  assert.equal(hasil.stdout, "Tanda tangan cocok, penerbit belum dikenal.\n");
});
