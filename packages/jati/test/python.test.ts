import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { assertSpawn } from "./spawn-bantu.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const python = process.env["PYTHON"] ?? "python3";

function pythonCek(kartu: string, jwks: string, sekarang = "2026-10-21T12:00:00+07:00") {
  const hasil = spawnSync(python, ["examples/python/cek.py", kartu, jwks], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, JATI_SEKARANG: sekarang },
  });
  assertSpawn(hasil, `python cek ${kartu}`);
  return hasil;
}

test("cuplikan python memverifikasi tanda tangan contoh", () => {
  const hasil = pythonCek("fixtures/valid.json", "fixtures/penerbit.public.jwks.json");
  assert.equal(hasil.status, 0, hasil.stderr);
  assert.match(hasil.stdout, /Tanda tangan cocok/);
  assert.doesNotMatch(hasil.stdout, /Kartu asli/);
});

test("cuplikan python menolak kartu yang pustaka Node anggap kedaluwarsa", () => {
  const hasil = pythonCek("fixtures/valid.json", "fixtures/penerbit.public.jwks.json", "2027-01-01T00:00:00+07:00");
  assert.equal(hasil.status, 1, hasil.stderr);
  assert.match(hasil.stdout, /Kartu kedaluwarsa/);
  assert.doesNotMatch(hasil.stdout, /Kartu asli/);
});

test("cuplikan python menolak kartu yang belum berlaku", () => {
  const hasil = pythonCek("fixtures/valid.json", "fixtures/penerbit.public.jwks.json", "2026-10-20T23:59:59+07:00");
  assert.equal(hasil.status, 1);
  assert.match(hasil.stdout, /Kartu belum berlaku/);
});

test("batas akhir masa berlaku masih lolos di cuplikan python", () => {
  const hasil = pythonCek("fixtures/valid.json", "fixtures/penerbit.public.jwks.json", "2026-12-31T23:59:59+07:00");
  assert.equal(hasil.status, 0, hasil.stderr);
  assert.match(hasil.stdout, /Tanda tangan cocok/);
});

test("cuplikan python menolak kartu yang diubah", () => {
  const dir = mkdtempSync(join(tmpdir(), "jati-py-"));
  try {
    const kartu = JSON.parse(readFileSync(new URL("../../../fixtures/valid.json", import.meta.url), "utf8")) as { pemilik: { id: string } };
    kartu.pemilik.id = "CONTOH-124";
    const path = join(dir, "rusak.json");
    writeFileSync(path, JSON.stringify(kartu));
    const hasil = pythonCek(path, "fixtures/penerbit.public.jwks.json");
    assert.equal(hasil.status, 1);
    assert.match(hasil.stdout, /Kartu sudah diubah/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
