import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { verifikasi, type JWKS, type KartuJati } from "../packages/jati/src/index.ts";

const kartu = JSON.parse(readFileSync("fixtures/valid.json", "utf8")) as KartuJati;
const jwks = JSON.parse(readFileSync("fixtures/penerbit.public.jwks.json", "utf8")) as JWKS;
const diubah = structuredClone(kartu);
diubah.pemilik.id = "CONTOH-124";
const sekarang = "2026-10-21T12:00:00+07:00";

const kasus = [
  { nama: "valid", kartu, sekarang, dicabut: [] as string[] },
  { nama: "diubah", kartu: diubah, sekarang, dicabut: [] as string[] },
  { nama: "kedaluwarsa", kartu, sekarang: "2027-01-01T00:00:00+07:00", dicabut: [] as string[] },
  { nama: "dicabut", kartu, sekarang, dicabut: [kartu.id] },
  { nama: "lewat-limit", kartu, sekarang, dicabut: [] as string[], aksi: "bayar", jumlah: 300001 },
];

const keluar = {
  jati: "0.1",
  keterangan:
    "Vektor uji kartu Jati 0.1 untuk implementasi lain. Kunci privat tidak ikut. sekarang, dicabut, aksi, dan jumlah adalah masukan pemeriksa.",
  jwks,
  kasus: [] as Record<string, unknown>[],
};

for (const item of kasus) {
  const hasil = await verifikasi(item.kartu, {
    jwksTepercaya: jwks,
    sekarang: new Date(item.sekarang),
    dicabut: item.dicabut,
    ...("aksi" in item ? { aksi: item.aksi } : {}),
    ...("jumlah" in item ? { jumlah: item.jumlah } : {}),
  });
  keluar.kasus.push({
    ...item,
    harapan: {
      boleh: hasil.boleh,
      status: hasil.status,
      kode: hasil.kode,
      kalimat: hasil.kalimat,
    },
  });
}

mkdirSync("spec/vectors", { recursive: true });
writeFileSync("spec/vectors/v0.1.json", `${JSON.stringify(keluar, null, 2)}\n`);
