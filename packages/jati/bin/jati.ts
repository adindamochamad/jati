#!/usr/bin/env -S node --experimental-strip-types
import { randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { exportJWK, generateKeyPair, type JWK } from "jose";
import { buatKartu } from "../src/buat.ts";
import { daftarDariBerkas } from "../src/cabut.ts";
import { tandatangani, verifikasi, type JWKS } from "../src/index.ts";

function gagal(id: string, en: string): never {
  console.error(`${id}\n${en}`);
  process.exit(2);
}

function parse(args: string[]): { posisi: string[]; opsi: Map<string, string | true> } {
  const posisi: string[] = [];
  const opsi = new Map<string, string | true>();
  const bernilai = new Set([
    "--pemilik",
    "--limit",
    "--per-hari",
    "--jenis",
    "--kunci",
    "--keluar",
    "--terbit",
    "--sampai",
    "--agen",
    "--id-pemilik",
    "--jwks",
    "--cabut",
    "--sekarang",
    "--aksi",
    "--jumlah",
    "--terpakai",
  ]);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === undefined || arg === "--") continue;
    if (arg.startsWith("--")) {
      if (!bernilai.has(arg)) {
        opsi.set(arg, true);
        continue;
      }
      const nilai = args[i + 1];
      if (nilai === undefined || nilai.startsWith("--")) gagal(`Nilai ${arg} tidak ada.`, `Missing value for ${arg}.`);
      opsi.set(arg, nilai);
      i += 1;
      continue;
    }
    posisi.push(arg);
  }
  return { posisi, opsi };
}

function teks(opsi: Map<string, string | true>, nama: string): string | undefined {
  const nilai = opsi.get(nama);
  return typeof nilai === "string" ? nilai : undefined;
}

function wajib(opsi: Map<string, string | true>, nama: string): string {
  const nilai = teks(opsi, nama);
  if (!nilai) gagal(`Nilai ${nama} tidak ada.`, `Missing value for ${nama}.`);
  return nilai;
}

function bilangan(nilai: string, nama: string): number {
  if (!/^\d+$/.test(nilai)) gagal(`${nama} harus bilangan bulat.`, `${nama} must be an integer.`);
  const angka = Number(nilai);
  if (!Number.isSafeInteger(angka)) gagal(`${nama} terlalu besar.`, `${nama} is too large.`);
  return angka;
}

function tulis(path: string, nilai: unknown, rahasia = false): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(nilai, null, 2)}\n`, { mode: rahasia ? 0o600 : 0o644 });
}

function baca(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as unknown;
  } catch {
    return undefined;
  }
}

function waktuWib(saat: Date): string {
  const geser = new Date(saat.getTime() + 7 * 60 * 60 * 1000);
  const pad = (angka: number) => String(angka).padStart(2, "0");
  return `${geser.getUTCFullYear()}-${pad(geser.getUTCMonth() + 1)}-${pad(geser.getUTCDate())}T${pad(geser.getUTCHours())}:${pad(geser.getUTCMinutes())}:${pad(geser.getUTCSeconds())}+07:00`;
}

function sampaiDari(terbit: string): string {
  const tahun = Number(terbit.slice(0, 4)) + 1;
  return `${tahun}${terbit.slice(4).replace(/T[0-9]{2}:[0-9]{2}:[0-9]{2}/, "T23:59:59")}`;
}

async function kunciBaru(): Promise<void> {
  const { privateKey, publicKey } = await generateKeyPair("EdDSA", { crv: "Ed25519", extractable: true });
  const privat = await exportJWK(privateKey);
  const publik = await exportJWK(publicKey);
  privat.kid = "penerbit-1";
  privat.alg = "EdDSA";
  privat.use = "sig";
  publik.kid = "penerbit-1";
  publik.alg = "EdDSA";
  publik.use = "sig";
  tulis("penerbit.private.jwk.json", privat, true);
  tulis("penerbit.public.jwks.json", { keys: [publik] });
  console.log("Kunci publik: penerbit.public.jwks.json");
  console.log("Kunci privat: penerbit.private.jwk.json");
  console.log("Jangan menyimpan kunci privat di git.");
}

async function terbit(opsi: Map<string, string | true>): Promise<void> {
  const pemilik = wajib(opsi, "--pemilik");
  const limit = bilangan(wajib(opsi, "--limit"), "--limit");
  const perHariTeks = teks(opsi, "--per-hari");
  const perHari = perHariTeks ? bilangan(perHariTeks, "--per-hari") : limit;
  const jenis = teks(opsi, "--jenis") ?? "badan_usaha";
  if (jenis !== "orang" && jenis !== "badan_usaha") gagal("Jenis pemilik tidak sah.", "Owner kind is not valid.");
  const pathKunci = teks(opsi, "--kunci") ?? "penerbit.private.jwk.json";
  const mentah = baca(pathKunci);
  if (!mentah || typeof mentah !== "object" || Array.isArray(mentah)) {
    gagal("Kunci privat tidak ada. Jalankan kunci-baru dulu.", "Private key missing. Run kunci-baru first.");
  }
  const kunci = mentah as JWK;
  if (typeof kunci.d !== "string" || typeof kunci.kid !== "string") {
    gagal("Kunci privat tidak sah.", "The private key is not valid.");
  }
  const { privateKey, publicKey } = await generateKeyPair("EdDSA", { crv: "Ed25519", extractable: true });
  const agenPrivat = await exportJWK(privateKey);
  const agenPublik = await exportJWK(publicKey);
  if (typeof agenPublik.x !== "string") gagal("Kunci agen gagal dibuat.", "Could not create the agent key.");
  const terbitPada = teks(opsi, "--terbit") ?? waktuWib(new Date());
  const sampai = teks(opsi, "--sampai") ?? sampaiDari(terbitPada);
  let kartu: Record<string, unknown>;
  try {
    kartu = buatKartu({
      id: `urn:jati:lokal:${randomBytes(4).toString("hex")}`,
      namaAgen: teks(opsi, "--agen") ?? `Agen ${pemilik}`,
      kunciPublikAgen: agenPublik.x,
      namaPemilik: pemilik,
      jenisPemilik: jenis,
      idPemilik: teks(opsi, "--id-pemilik") ?? "LOKAL",
      izin: ["bayar"],
      perTransaksi: limit,
      perHari,
      namaPenanggung: pemilik,
      kontak: "https://contoh.id/kontak",
      terbit: terbitPada,
      berlakuSampai: sampai,
      pencabutan: "https://contoh.id/cabut.json",
      penerbit: "https://contoh.id/.well-known/jati.json",
    });
  } catch {
    gagal("Kartu tidak sesuai format.", "The card does not match the format.");
  }
  const ditandatangani = await tandatangani(kartu, kunci, { kid: kunci.kid });
  const pathKartu = teks(opsi, "--keluar") ?? "kartu.json";
  tulis(pathKartu, ditandatangani);
  tulis("agen.private.jwk.json", { ...agenPrivat, kid: "agen-1" }, true);
  if (!baca("cabut.json")) {
    tulis("cabut.json", { jati: "0.1", dicabut: [] });
    console.error("cabut.json lokal kosong dibuat. Berkas ini bukan layanan pencabutan.\nAn empty local cabut.json was created. It is not a revocation service.");
  }
  console.error("Kartu mandiri. jati cek tanpa --percaya menulis: Tanda tangan cocok, penerbit belum dikenal.\nSelf-issued card. jati cek without --percaya prints: Tanda tangan cocok, penerbit belum dikenal.");
  console.error("Bawaan fiktif: izin bayar, kontak https://contoh.id/kontak.\nFictional defaults: bayar permission, contact https://contoh.id/kontak.");
  console.error("cek tidak membaca agen.private.jwk.json. Menyalin kartu.json cukup untuk mendapat kalimat yang sama.\ncek does not read agen.private.jwk.json. Copying kartu.json is enough to get the same sentence.");
  console.log(pathKartu);
}

async function cek(posisi: readonly string[], opsi: Map<string, string | true>): Promise<void> {
  const pathKartu = posisi[0];
  if (!pathKartu) gagal("Path kartu tidak ada.", "Missing card path.");
  const kartu = baca(pathKartu);
  if (kartu === undefined) {
    console.log("Kartu tidak sesuai format.");
    process.exit(1);
  }
  const jwksMentah = baca(teks(opsi, "--jwks") ?? "penerbit.public.jwks.json");
  if (!jwksMentah || typeof jwksMentah !== "object") gagal("JWKS tidak bisa dibaca.", "The JWKS could not be read.");
  let dicabut: readonly string[] | undefined;
  if (!opsi.has("--tanpa-cabut")) {
    const daftar = daftarDariBerkas(baca(teks(opsi, "--cabut") ?? "cabut.json"));
    if (!daftar) gagal("Daftar cabut tidak sah atau tidak ada.", "The revocation list is missing or not valid.");
    dicabut = daftar;
  }
  const sekarangTeks = teks(opsi, "--sekarang");
  const sekarang = sekarangTeks ? new Date(sekarangTeks) : undefined;
  if (sekarang && Number.isNaN(sekarang.getTime())) gagal("Waktu --sekarang tidak sah.", "The --sekarang time is not valid.");
  const jumlahTeks = teks(opsi, "--jumlah");
  const terpakaiTeks = teks(opsi, "--terpakai");
  const aksi = teks(opsi, "--aksi");
  if (opsi.has("--percaya") && opsi.has("--ditemukan")) {
    gagal("Pakai --percaya atau --ditemukan, jangan keduanya.", "Use --percaya or --ditemukan, not both.");
  }
  const percaya = opsi.has("--percaya");
  const hasil = await verifikasi(kartu, {
    ...(percaya ? { jwksTepercaya: jwksMentah as JWKS } : { jwksDitemukan: jwksMentah as JWKS }),
    ...(dicabut ? { dicabut } : {}),
    ...(sekarang ? { sekarang } : {}),
    ...(aksi ? { aksi } : {}),
    ...(jumlahTeks ? { jumlah: bilangan(jumlahTeks, "--jumlah") } : {}),
    ...(terpakaiTeks ? { terpakaiHariIni: bilangan(terpakaiTeks, "--terpakai") } : {}),
  });
  if (percaya && hasil.status === "asli") {
    console.error(
      "Anda menyatakan percaya pada kunci ini. Nama pemilik tetap klaim, bukan KTP.\nYou chose to trust this key. The owner name remains a claim, not an identity card.",
    );
  }
  console.log(opsi.has("--en") ? hasil.kalimatEn : hasil.kalimat);
  process.exit(kodeKeluar(hasil.status));
}

function kodeKeluar(status: string): number {
  if (status === "asli") return 0;
  if (status === "penerbit_belum_dikenal") return 3;
  return 1;
}

const { posisi, opsi } = parse(process.argv.slice(2));
const perintah = posisi[0];
if (perintah === "kunci-baru") {
  await kunciBaru();
} else if (perintah === "terbit") {
  await terbit(opsi);
} else if (perintah === "cek") {
  await cek(posisi.slice(1), opsi);
} else {
  gagal(
    "Perintah: jati kunci-baru | jati terbit --pemilik NAMA --limit RUPIAH | jati cek kartu.json | jati cek kartu.json --percaya",
    "Commands: jati kunci-baru | jati terbit --pemilik NAME --limit RUPIAH | jati cek card.json | jati cek card.json --percaya",
  );
}
