import type { JWK } from "jose";

export type JenisPemilik = "orang" | "badan_usaha";

export type KartuJati = {
  jati: "0.1";
  id: string;
  agen: {
    nama: string;
    kunciPublik: string;
  };
  pemilik: {
    nama: string;
    jenis: JenisPemilik;
    id: string;
  };
  izin: string[];
  batasBelanja: {
    mataUang: "IDR";
    perTransaksi: number;
    perHari: number;
  };
  penanggungJawab: {
    nama: string;
    kontak: string;
  };
  terbit: string;
  berlakuSampai: string;
  pencabutan: string;
  penerbit: string;
  tandaTangan: string;
};

export type JWKS = {
  keys: JWK[];
};

export type StatusKartu =
  | "asli"
  | "diubah"
  | "belum_berlaku"
  | "kedaluwarsa"
  | "dicabut"
  | "penerbit_belum_dikenal"
  | "tidak_sesuai_format"
  | "tolak"
  | "kunci_tidak_ada"
  | "tidak_pasti";

export type KodeHasil =
  | "JATI_OK"
  | "JATI_MALFORMED"
  | "JATI_TAMPERED"
  | "JATI_KEY_NOT_FOUND"
  | "JATI_REVOKED"
  | "JATI_NOT_YET_VALID"
  | "JATI_EXPIRED"
  | "JATI_ISSUER_UNKNOWN"
  | "JATI_REVOCATION_UNCHECKED"
  | "JATI_ACTION_INVALID"
  | "JATI_ACTION_DENIED"
  | "JATI_AMOUNT_NOT_FOR_ACTION"
  | "JATI_AMOUNT_REQUIRED"
  | "JATI_AMOUNT_INVALID"
  | "JATI_SPENT_TODAY_INVALID"
  | "JATI_OVER_TRANSACTION_LIMIT"
  | "JATI_OVER_DAILY_LIMIT";

export type HasilVerifikasi = {
  status: StatusKartu;
  boleh: boolean;
  /** Kalimat Indonesia normatif. */
  kalimat: string;
  /** Sama dengan kalimat. Ada supaya bentuk hasil DoD { status, alasan, kode } lengkap. */
  alasan: string;
  kode: KodeHasil;
  /** Terjemahan informatif, bukan kalimat normatif. */
  kalimatEn: string;
};

export type OpsiVerifikasi = {
  /** Kunci yang dipercaya pemanggil. Cocok dengan kid di tanda tangan. */
  jwksTepercaya?: JWKS;
  /** Kunci untuk memeriksa tanda tangan tanpa menganggap penerbit dikenal. */
  jwksDitemukan?: JWKS;
  sekarang?: Date;
  /**
   * Daftar id kartu yang dicabut.
   * Kosong berarti daftar sudah ada dan tidak ada id yang dicabut.
   * Tidak diisi berarti daftar tidak terambil: jalur sukses menjadi tidak_pasti.
   */
  dicabut?: readonly string[];
  aksi?: string;
  jumlah?: number;
  terpakaiHariIni?: number;
};
