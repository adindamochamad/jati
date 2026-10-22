import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { verifikasi } from "../src/verifikasi.ts";
import type { JWKS, KartuJati } from "../src/tipe.ts";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const sekarang = new Date("2026-10-21T12:00:00+07:00");

function baca(nama: string): string {
  return readFileSync(new URL(`../../../${nama}`, import.meta.url), "utf8");
}

test("kartu contoh utuh lolos dengan kunci publik", async () => {
  const kartu = JSON.parse(baca("fixtures/valid.json")) as KartuJati;
  const jwks = JSON.parse(baca("fixtures/penerbit.public.jwks.json")) as JWKS;
  const daftar = JSON.parse(baca("fixtures/cabut.json")) as { dicabut: string[] };
  const hasil = await verifikasi(kartu, { jwksTepercaya: jwks, sekarang, dicabut: daftar.dicabut });
  assert.equal(hasil.boleh, true);
  assert.equal(hasil.kalimat, "Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.");
  assert.notEqual(kartu.agen.kunciPublik, jwks.keys[0]?.x);
  assert.equal("d" in (jwks.keys[0] ?? {}), false);
});

test("satu karakter pada kartu contoh terdeteksi", async () => {
  const kartu = JSON.parse(baca("fixtures/valid.json")) as KartuJati;
  const jwks = JSON.parse(baca("fixtures/penerbit.public.jwks.json")) as JWKS;
  kartu.pemilik.id = "CONTOH-124";
  const hasil = await verifikasi(kartu, { jwksTepercaya: jwks, sekarang });
  assert.equal(hasil.kalimat, "Kartu sudah diubah.");
});

test("kunci privat contoh tidak dilacak git", () => {
  const penerbit = execFileSync("git", ["check-ignore", "keys/contoh-penerbit.private.jwk.json"], {
    cwd: root,
    encoding: "utf8",
  });
  const agen = execFileSync("git", ["check-ignore", "keys/contoh-agen.private.jwk.json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.match(penerbit, /^keys\//);
  assert.match(agen, /^keys\//);
  assert.equal(baca("fixtures/valid.json").includes('"d":'), false);
  assert.equal(baca("fixtures/penerbit.public.jwks.json").includes('"d":'), false);
});
