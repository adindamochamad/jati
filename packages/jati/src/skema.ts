import { dariBase64Url, keBase64Url } from "./byte.ts";
import type { KartuJati } from "./tipe.ts";

const POLA_ID = /^urn:jati:[a-z0-9][a-z0-9:-]{0,118}$/;
const POLA_PEMILIK = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/;
const POLA_AKSI = /^[a-z][a-z0-9_]{0,63}$/;
const POLA_WAKTU = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[+-][0-9]{2}:[0-9]{2}$/;
const POLA_HTTPS = /^https:\/\/\S+$/;
const POLA_JWS = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const POLA_KUNCI_AGEN = /^[A-Za-z0-9_-]{43}$/;
const POLA_NAMA = /^[^\u0000-\u001F\u007F-\u009F\u2028\u2029]{1,200}$/;
const MAKS_UANG = 9007199254740991;

function objek(nilai: unknown): nilai is Record<string, unknown> {
  return typeof nilai === "object" && nilai !== null && !Array.isArray(nilai);
}

function kunciPas(nilai: Record<string, unknown>, daftar: readonly string[]): boolean {
  const kunci = Object.keys(nilai);
  return kunci.length === daftar.length && daftar.every((nama) => Object.hasOwn(nilai, nama));
}

function teks(nilai: unknown, pola: RegExp, maks?: number): nilai is string {
  return typeof nilai === "string" && (maks === undefined || nilai.length <= maks) && pola.test(nilai);
}

function nama(nilai: unknown): nilai is string {
  return typeof nilai === "string" && POLA_NAMA.test(nilai);
}

function uang(nilai: unknown): nilai is number {
  return typeof nilai === "number" && Number.isInteger(nilai) && nilai >= 0 && nilai <= MAKS_UANG;
}

function https(nilai: unknown): nilai is string {
  return teks(nilai, POLA_HTTPS, 500);
}

function agenSah(nilai: unknown): boolean {
  if (!objek(nilai) || !kunciPas(nilai, ["nama", "kunciPublik"])) return false;
  return nama(nilai["nama"]) && teks(nilai["kunciPublik"], POLA_KUNCI_AGEN);
}

function pemilikSah(nilai: unknown): boolean {
  if (!objek(nilai) || !kunciPas(nilai, ["nama", "jenis", "id"])) return false;
  return nama(nilai["nama"]) && (nilai["jenis"] === "orang" || nilai["jenis"] === "badan_usaha") && teks(nilai["id"], POLA_PEMILIK);
}

function izinSah(nilai: unknown): boolean {
  if (!Array.isArray(nilai) || nilai.length < 1 || nilai.length > 32) return false;
  if (!nilai.every((aksi) => teks(aksi, POLA_AKSI))) return false;
  return new Set(nilai).size === nilai.length;
}

function batasSah(nilai: unknown): boolean {
  if (!objek(nilai) || !kunciPas(nilai, ["mataUang", "perTransaksi", "perHari"])) return false;
  return nilai["mataUang"] === "IDR" && uang(nilai["perTransaksi"]) && uang(nilai["perHari"]);
}

function jawabSah(nilai: unknown): boolean {
  if (!objek(nilai) || !kunciPas(nilai, ["nama", "kontak"])) return false;
  return nama(nilai["nama"]) && https(nilai["kontak"]);
}

function isiSah(nilai: Record<string, unknown>): boolean {
  return (
    nilai["jati"] === "0.1" &&
    teks(nilai["id"], POLA_ID) &&
    agenSah(nilai["agen"]) &&
    pemilikSah(nilai["pemilik"]) &&
    izinSah(nilai["izin"]) &&
    batasSah(nilai["batasBelanja"]) &&
    jawabSah(nilai["penanggungJawab"]) &&
    teks(nilai["terbit"], POLA_WAKTU) &&
    teks(nilai["berlakuSampai"], POLA_WAKTU) &&
    https(nilai["pencabutan"]) &&
    https(nilai["penerbit"])
  );
}

const KUNCI_PAYLOAD = [
  "jati",
  "id",
  "agen",
  "pemilik",
  "izin",
  "batasBelanja",
  "penanggungJawab",
  "terbit",
  "berlakuSampai",
  "pencabutan",
  "penerbit",
] as const;

export function payloadSesuaiSkema(nilai: unknown): boolean {
  return objek(nilai) && kunciPas(nilai, KUNCI_PAYLOAD) && isiSah(nilai);
}

export function kartuSesuaiSkema(nilai: unknown): nilai is KartuJati {
  return (
    objek(nilai) &&
    kunciPas(nilai, [...KUNCI_PAYLOAD, "tandaTangan"]) &&
    isiSah(nilai) &&
    teks(nilai["tandaTangan"], POLA_JWS)
  );
}

export function kunciAgenSah(kunciPublik: string): boolean {
  if (!POLA_KUNCI_AGEN.test(kunciPublik)) return false;
  const mentah = dariBase64Url(kunciPublik);
  return mentah?.length === 32 && keBase64Url(mentah) === kunciPublik;
}
