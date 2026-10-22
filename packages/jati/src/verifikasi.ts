import { jsonLebihBesarDari } from "./byte.ts";
import { cekPencabutan } from "./cabut.ts";
import { jadi, kalimatAsli, rupiah, tetap } from "./kalimat.ts";
import { kanonisasi } from "./kanon.ts";
import { kartuSesuaiSkema, kunciAgenSah } from "./skema.ts";
import { bacaKid, cariKunci, kunciVerifikasi, tandaCocok } from "./tanda.ts";
import type { HasilVerifikasi, KartuJati, OpsiVerifikasi } from "./tipe.ts";

const BATAS_BYTE = 65_536;
const POLA_AKSI = /^[a-z][a-z0-9_]{0,63}$/;

function objekJson(nilai: unknown): nilai is Record<string, unknown> {
  return typeof nilai === "object" && nilai !== null && !Array.isArray(nilai);
}

function bilanganBulatNonNegatif(nilai: unknown): nilai is number {
  return typeof nilai === "number" && Number.isSafeInteger(nilai) && nilai >= 0;
}

function lewat(terpakai: number, jumlah: number, batas: number): boolean {
  return terpakai > batas || jumlah > batas - terpakai;
}

function asli(kartu: KartuJati): HasilVerifikasi {
  return kalimatAsli(kartu.pemilik.nama, kartu.berlakuSampai);
}

function tolakHarian(total: number | bigint, batas: number): HasilVerifikasi {
  return jadi(
    "tolak",
    "JATI_OVER_DAILY_LIMIT",
    `Tolak. Pemakaian hari ini menjadi ${rupiah(total)}, melewati batas ${rupiah(batas)}.`,
    `Rejected. Today's spend would become ${rupiah(total)}, above the limit of ${rupiah(batas)}.`,
  );
}

export function cekIzin(kartu: KartuJati, opsi: OpsiVerifikasi): HasilVerifikasi {
  const aksiDiminta = opsi.aksi !== undefined || opsi.jumlah !== undefined;
  if (!aksiDiminta) return asli(kartu);
  if (opsi.aksi !== undefined && (typeof opsi.aksi !== "string" || !POLA_AKSI.test(opsi.aksi))) {
    return jadi("tolak", "JATI_ACTION_INVALID", "Tolak. Aksi tidak sah.", "Rejected. The action is not valid.");
  }
  const aksi = opsi.aksi ?? "bayar";
  if (!kartu.izin.includes(aksi)) {
    return jadi(
      "tolak",
      "JATI_ACTION_DENIED",
      `Tolak. Aksi "${aksi}" tidak ada di izin.`,
      `Rejected. Action "${aksi}" is not in the permissions.`,
    );
  }
  if (aksi !== "bayar") {
    if (opsi.jumlah !== undefined) {
      return jadi(
        "tolak",
        "JATI_AMOUNT_NOT_FOR_ACTION",
        "Tolak. Batas belanja hanya berlaku untuk aksi bayar.",
        "Rejected. The spending limit applies only to the bayar action.",
      );
    }
    return asli(kartu);
  }
  if (opsi.jumlah === undefined) {
    return jadi(
      "tolak",
      "JATI_AMOUNT_REQUIRED",
      "Tolak. Aksi bayar membutuhkan jumlah.",
      "Rejected. The bayar action needs an amount.",
    );
  }
  if (!bilanganBulatNonNegatif(opsi.jumlah)) {
    return jadi(
      "tolak",
      "JATI_AMOUNT_INVALID",
      "Tolak. Jumlah harus bilangan bulat nol atau lebih.",
      "Rejected. The amount must be an integer of zero or more.",
    );
  }
  if (opsi.jumlah > kartu.batasBelanja.perTransaksi) {
    return jadi(
      "tolak",
      "JATI_OVER_TRANSACTION_LIMIT",
      `Tolak. Jumlah ${rupiah(opsi.jumlah)} melewati batas per transaksi ${rupiah(kartu.batasBelanja.perTransaksi)}.`,
      `Rejected. Amount ${rupiah(opsi.jumlah)} is above the per-transaction limit of ${rupiah(kartu.batasBelanja.perTransaksi)}.`,
    );
  }
  const perHari = kartu.batasBelanja.perHari;
  if (opsi.terpakaiHariIni !== undefined) {
    if (!bilanganBulatNonNegatif(opsi.terpakaiHariIni)) {
      return jadi(
        "tolak",
        "JATI_SPENT_TODAY_INVALID",
        "Tolak. Pemakaian hari ini harus bilangan bulat nol atau lebih.",
        "Rejected. Today's spend must be an integer of zero or more.",
      );
    }
    if (lewat(opsi.terpakaiHariIni, opsi.jumlah, perHari)) {
      return tolakHarian(BigInt(opsi.terpakaiHariIni) + BigInt(opsi.jumlah), perHari);
    }
  } else if (opsi.jumlah > perHari) {
    return tolakHarian(opsi.jumlah, perHari);
  }
  return asli(kartu);
}

export async function verifikasi(masukan: unknown, opsi: OpsiVerifikasi): Promise<HasilVerifikasi> {
  if (opsi.jwksTepercaya === undefined && opsi.jwksDitemukan === undefined) {
    throw new TypeError("jwksTepercaya atau jwksDitemukan wajib diisi");
  }
  if (opsi.jwksTepercaya !== undefined && !Array.isArray(opsi.jwksTepercaya.keys)) {
    throw new TypeError("JWKS harus berupa objek dengan keys");
  }
  if (opsi.jwksDitemukan !== undefined && !Array.isArray(opsi.jwksDitemukan.keys)) {
    throw new TypeError("JWKS harus berupa objek dengan keys");
  }
  const sekarang = opsi.sekarang ?? new Date();
  if (Number.isNaN(sekarang.getTime())) {
    throw new TypeError("sekarang tidak sah");
  }
  if (opsi.dicabut !== undefined && (!Array.isArray(opsi.dicabut) || opsi.dicabut.some((id) => typeof id !== "string"))) {
    throw new TypeError("dicabut harus daftar string");
  }

  if (!objekJson(masukan) || jsonLebihBesarDari(masukan, BATAS_BYTE) || !kartuSesuaiSkema(masukan) || !kunciAgenSah(masukan.agen.kunciPublik)) {
    return tetap("tidak_sesuai_format");
  }

  const kid = bacaKid(masukan.tandaTangan);
  if (!kid) return tetap("diubah");

  const tepercaya = cariKunci(opsi.jwksTepercaya, kid);
  const ditemukan = cariKunci(opsi.jwksDitemukan, kid);
  const kunci = tepercaya ?? ditemukan;
  if (!kunci) return tetap("kunci_tidak_ada");

  const payload: Record<string, unknown> = { ...masukan };
  delete payload["tandaTangan"];
  let kanonik: string;
  try {
    kanonik = kanonisasi(payload);
  } catch {
    return tetap("tidak_sesuai_format");
  }
  const cocok = await tandaCocok(masukan.tandaTangan, await kunciVerifikasi(kunci), kanonik);
  if (!cocok) return tetap("diubah");

  if (cekPencabutan(masukan.id, opsi.dicabut) === "dicabut") return tetap("dicabut");

  const terbit = Date.parse(masukan.terbit);
  const sampai = Date.parse(masukan.berlakuSampai);
  if (Number.isNaN(terbit) || Number.isNaN(sampai) || terbit > sampai) {
    return tetap("tidak_sesuai_format");
  }
  const kini = sekarang.getTime();
  if (kini < terbit) return tetap("belum_berlaku");
  if (kini > sampai) return tetap("kedaluwarsa");
  if (!tepercaya) return tetap("penerbit_belum_dikenal");

  const keputusan = cekIzin(masukan, opsi);
  if (keputusan.status === "asli" && opsi.dicabut === undefined) return tetap("tidak_pasti");
  return keputusan;
}
