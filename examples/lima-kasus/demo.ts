import { readFileSync } from "node:fs";
import { verifikasi, type JWKS, type KartuJati } from "../../packages/jati/src/index.ts";

const kartu = JSON.parse(readFileSync("fixtures/valid.json", "utf8")) as KartuJati;
const jwks = JSON.parse(readFileSync("fixtures/penerbit.public.jwks.json", "utf8")) as JWKS;
const sekarang = new Date("2026-10-21T12:00:00+07:00");
const dasar = { jwksTepercaya: jwks, sekarang, dicabut: [] as readonly string[] };

const kasus = [
  ["tanpa kartu", await verifikasi(undefined, dasar)],
  ["lewat limit", await verifikasi(kartu, { ...dasar, aksi: "bayar", jumlah: 300001 })],
  ["dicabut", await verifikasi(kartu, { ...dasar, dicabut: [kartu.id] })],
  ["kedaluwarsa", await verifikasi(kartu, { ...dasar, sekarang: new Date("2027-01-01T00:00:00+07:00") })],
  ["diterima", await verifikasi(kartu, { ...dasar, aksi: "bayar", jumlah: 300000 })],
] as const;

const harapan = [
  "Kartu tidak sesuai format.",
  "Tolak. Jumlah Rp300.001 melewati batas per transaksi Rp300.000.",
  "Kartu sudah dicabut.",
  "Kartu kedaluwarsa.",
  "Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.",
];

let gagal = false;
for (let i = 0; i < kasus.length; i += 1) {
  const baris = kasus[i];
  const kalimat = baris?.[1].kalimat;
  const nama = baris?.[0];
  const cocok = kalimat === harapan[i];
  if (!cocok) gagal = true;
  console.log(`${cocok ? "ok" : "gagal"} ${nama}: ${kalimat}`);
}
console.log("Ini lima kasus pustaka lokal. Bukan demo AgentPay.");
process.exit(gagal ? 1 : 0);
