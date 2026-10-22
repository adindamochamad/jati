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
    const cek = jalan(dir, ["cek", "kartu.json", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(cek.status, 0, cek.stderr);
    assert.equal(cek.stdout, "Kartu asli. Pemilik: PT Contoh. Berlaku sampai 31 Des 2026.\n");
    const tanpa = jalan(dir, ["cek", "kartu.json", "--tanpa-cabut", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(tanpa.status, 1);
    assert.equal(tanpa.stdout, "Tidak pasti. Pencabutan belum bisa dicek.\n");
    const inggris = jalan(dir, ["cek", "kartu.json", "--en", "--sekarang", "2026-10-21T12:00:00+07:00"]);
    assert.equal(inggris.stdout, "Genuine card. Owner: PT Contoh. Valid until 31 Des 2026.\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
