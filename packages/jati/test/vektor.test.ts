import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { verifikasi, type JWKS, type KartuJati } from "../src/index.ts";

type Kasus = {
  nama: string;
  kartu: KartuJati;
  sekarang: string;
  dicabut: string[];
  aksi?: string;
  jumlah?: number;
  harapan: { boleh: boolean; status: string; kode: string; kalimat: string };
};

const berkas = JSON.parse(readFileSync(new URL("../../../spec/vectors/v0.1.json", import.meta.url), "utf8")) as {
  jati: string;
  jwks: JWKS;
  kasus: Kasus[];
};

test("vektor v0.1 memuat lima kasus dan kunci publik", () => {
  assert.equal(berkas.jati, "0.1");
  assert.deepEqual(
    berkas.kasus.map((item) => item.nama),
    ["valid", "diubah", "kedaluwarsa", "dicabut", "lewat-limit"],
  );
  assert.equal(JSON.stringify(berkas.jwks).includes('"d"'), false);
});

test("pustaka menghasilkan kalimat vektor v0.1", async () => {
  for (const item of berkas.kasus) {
    const hasil = await verifikasi(item.kartu, {
      jwksTepercaya: berkas.jwks,
      sekarang: new Date(item.sekarang),
      dicabut: item.dicabut,
      ...(item.aksi !== undefined ? { aksi: item.aksi } : {}),
      ...(item.jumlah !== undefined ? { jumlah: item.jumlah } : {}),
    });
    assert.equal(hasil.kode, item.harapan.kode, item.nama);
    assert.equal(hasil.status, item.harapan.status, item.nama);
    assert.equal(hasil.boleh, item.harapan.boleh, item.nama);
    assert.equal(hasil.kalimat, item.harapan.kalimat, item.nama);
  }
});
