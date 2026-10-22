import { readFileSync } from "node:fs";
import { daftarDariBerkas } from "../packages/jati/src/cabut.ts";
import { verifikasi } from "../packages/jati/src/index.ts";
import type { JWKS } from "../packages/jati/src/index.ts";

const args = process.argv.slice(2);
const posisi: string[] = [];
let sekarang: Date | undefined;
let ditemukan = false;
let tanpaCabut = false;
let pathCabut: string | undefined;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--sekarang") {
    const teks = args[i + 1];
    if (!teks) {
      console.error("Waktu --sekarang tidak ada.\nMissing --sekarang time.");
      process.exit(2);
    }
    sekarang = new Date(teks);
    if (Number.isNaN(sekarang.getTime())) {
      console.error("Waktu --sekarang tidak sah.\nThe --sekarang time is not valid.");
      process.exit(2);
    }
    i += 1;
  } else if (arg === "--ditemukan") {
    ditemukan = true;
  } else if (arg === "--tanpa-cabut") {
    tanpaCabut = true;
  } else if (arg === "--cabut") {
    const teks = args[i + 1];
    if (!teks) {
      console.error("Path --cabut tidak ada.\nMissing --cabut path.");
      process.exit(2);
    }
    pathCabut = teks;
    i += 1;
  } else if (arg !== undefined && arg !== "--") {
    posisi.push(arg);
  }
}

const pathKartu = posisi[0] ?? "fixtures/valid.json";
const pathJwks = posisi[1] ?? "fixtures/penerbit.public.jwks.json";

let kartu: unknown;
let jwks: JWKS;
try {
  kartu = JSON.parse(readFileSync(pathKartu, "utf8")) as unknown;
} catch {
  console.log("Kartu tidak sesuai format.");
  process.exit(1);
}
try {
  jwks = JSON.parse(readFileSync(pathJwks, "utf8")) as JWKS;
} catch {
  console.error("JWKS tidak bisa dibaca.\nThe JWKS could not be read.");
  process.exit(2);
}

let dicabut: readonly string[] | undefined;
if (!tanpaCabut) {
  const path = pathCabut ?? "fixtures/cabut.json";
  try {
    dicabut = daftarDariBerkas(JSON.parse(readFileSync(path, "utf8")) as unknown);
  } catch {
    dicabut = undefined;
  }
  if (!dicabut) {
    console.error("Daftar cabut tidak sah.\nThe revocation list is not valid.");
    process.exit(2);
  }
}

try {
  const hasil = await verifikasi(kartu, {
    ...(ditemukan ? { jwksDitemukan: jwks } : { jwksTepercaya: jwks }),
    ...(sekarang ? { sekarang } : {}),
    ...(dicabut ? { dicabut } : {}),
  });
  console.log(hasil.kalimat);
  if (hasil.status === "asli") process.exit(0);
  if (hasil.status === "penerbit_belum_dikenal") process.exit(3);
  process.exit(1);
} catch (galat) {
  console.error(galat instanceof Error ? galat.message : "Verifikasi gagal.");
  process.exit(2);
}
