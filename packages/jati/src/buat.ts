import { payloadSesuaiSkema } from "./skema.ts";
import type { JenisPemilik } from "./tipe.ts";

export type MasukanKartu = {
  id: string;
  namaAgen: string;
  kunciPublikAgen: string;
  namaPemilik: string;
  jenisPemilik: JenisPemilik;
  idPemilik: string;
  izin: readonly string[];
  perTransaksi: number;
  perHari: number;
  namaPenanggung: string;
  kontak: string;
  terbit: string;
  berlakuSampai: string;
  pencabutan: string;
  penerbit: string;
};

export function buatKartu(masukan: MasukanKartu): Record<string, unknown> {
  const kartu: Record<string, unknown> = {
    jati: "0.1",
    id: masukan.id,
    agen: { nama: masukan.namaAgen, kunciPublik: masukan.kunciPublikAgen },
    pemilik: { nama: masukan.namaPemilik, jenis: masukan.jenisPemilik, id: masukan.idPemilik },
    izin: [...masukan.izin],
    batasBelanja: { mataUang: "IDR", perTransaksi: masukan.perTransaksi, perHari: masukan.perHari },
    penanggungJawab: { nama: masukan.namaPenanggung, kontak: masukan.kontak },
    terbit: masukan.terbit,
    berlakuSampai: masukan.berlakuSampai,
    pencabutan: masukan.pencabutan,
    penerbit: masukan.penerbit,
  };
  if (!payloadSesuaiSkema(kartu)) throw new TypeError("Kartu tidak sesuai format");
  return kartu;
}
