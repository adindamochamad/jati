import type { HasilVerifikasi, KodeHasil, StatusKartu } from "./tipe.ts";

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"] as const;

const TETAP: Record<Exclude<StatusKartu, "asli" | "tolak">, readonly [KodeHasil, string, string]> = {
  tidak_sesuai_format: ["JATI_MALFORMED", "Kartu tidak sesuai format.", "The card does not match the format."],
  diubah: ["JATI_TAMPERED", "Kartu sudah diubah.", "The card has been altered."],
  kunci_tidak_ada: ["JATI_KEY_NOT_FOUND", "Kunci penerbit untuk kid ini tidak ada.", "No issuer key exists for this kid."],
  dicabut: ["JATI_REVOKED", "Kartu sudah dicabut.", "The card has been revoked."],
  belum_berlaku: ["JATI_NOT_YET_VALID", "Kartu belum berlaku.", "The card is not yet valid."],
  kedaluwarsa: ["JATI_EXPIRED", "Kartu kedaluwarsa.", "The card has expired."],
  penerbit_belum_dikenal: [
    "JATI_ISSUER_UNKNOWN",
    "Tanda tangan cocok, penerbit belum dikenal.",
    "The signature matches, and the issuer is not recognized.",
  ],
  tidak_pasti: [
    "JATI_REVOCATION_UNCHECKED",
    "Tidak pasti. Pencabutan belum bisa dicek.",
    "Uncertain. Revocation could not be checked.",
  ],
};

export function tanggalKalimat(iso: string): string {
  const cocok = /^(\d{4})-(\d{2})-(\d{2})T/.exec(iso);
  const tahun = cocok?.[1];
  const bulan = cocok?.[2];
  const hari = cocok?.[3];
  if (!tahun || !bulan || !hari) return iso;
  const nama = BULAN[Number(bulan) - 1];
  if (!nama) return iso;
  return `${Number(hari)} ${nama} ${tahun}`;
}

export function rupiah(nilai: number | bigint): string {
  const teks = nilai.toString();
  const negatif = teks.startsWith("-");
  const digit = negatif ? teks.slice(1) : teks;
  const denganTitik = digit.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp${negatif ? "-" : ""}${denganTitik}`;
}

export function jadi(status: StatusKartu, kode: KodeHasil, kalimat: string, kalimatEn: string): HasilVerifikasi {
  return { status, boleh: status === "asli", kalimat, alasan: kalimat, kode, kalimatEn };
}

export function tetap(status: Exclude<StatusKartu, "asli" | "tolak">): HasilVerifikasi {
  const baris = TETAP[status];
  return jadi(status, baris[0], baris[1], baris[2]);
}

export function kalimatAsli(nama: string, berlakuSampai: string): HasilVerifikasi {
  const tanggal = tanggalKalimat(berlakuSampai);
  return jadi(
    "asli",
    "JATI_OK",
    `Kartu asli. Pemilik: ${nama}. Berlaku sampai ${tanggal}.`,
    `Genuine card. Owner: ${nama}. Valid until ${tanggal}.`,
  );
}
