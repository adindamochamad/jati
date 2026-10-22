import { readFileSync } from "node:fs";
import { daftarDariBerkas } from "../../packages/jati/src/cabut.ts";
import { verifikasi, type JWKS, type KartuJati } from "../../packages/jati/src/index.ts";

const kartu = JSON.parse(readFileSync("fixtures/valid.json", "utf8")) as KartuJati;
const jwks = JSON.parse(readFileSync("fixtures/penerbit.public.jwks.json", "utf8")) as JWKS;
const dicabut = daftarDariBerkas(JSON.parse(readFileSync("fixtures/cabut.json", "utf8")) as unknown);
if (!dicabut) throw new Error("Daftar cabut tidak sah");

const hasil = await verifikasi(kartu, {
  jwksTepercaya: jwks,
  dicabut,
  sekarang: new Date("2026-10-21T12:00:00+07:00"),
});
console.log(hasil.kalimat);
process.exit(hasil.boleh ? 0 : 1);
