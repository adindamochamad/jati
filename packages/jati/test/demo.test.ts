import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../..", import.meta.url));

test("lima kasus lokal", () => {
  const hasil = spawnSync(process.execPath, ["--experimental-strip-types", "examples/lima-kasus/demo.ts"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(hasil.status, 0, hasil.stdout + hasil.stderr);
  assert.match(hasil.stdout, /ok tanpa kartu/);
  assert.match(hasil.stdout, /ok lewat limit/);
  assert.match(hasil.stdout, /ok dicabut/);
  assert.match(hasil.stdout, /ok kedaluwarsa/);
  assert.match(hasil.stdout, /ok diterima/);
  assert.match(hasil.stdout, /Bukan demo AgentPay/);
});

test("cuplikan node memeriksa kartu contoh", () => {
  const hasil = spawnSync(process.execPath, ["--experimental-strip-types", "examples/node/cek.ts"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(hasil.status, 0, hasil.stderr);
  assert.equal(hasil.stdout, "Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.\n");
});
