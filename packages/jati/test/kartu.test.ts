import assert from "node:assert/strict";
import test from "node:test";
import { CompactSign } from "jose";
import { daftarDariBerkas } from "../src/cabut.ts";
import { kanonisasi } from "../src/kanon.ts";
import { tandatangani } from "../src/tandatangani.ts";
import { verifikasi } from "../src/verifikasi.ts";
import { kartuDasar, kartuDitandatangani, kunciAgenUji, penerbitUji, SEKARANG } from "./bantuan.ts";

test("kartu utuh lolos", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const hasil = await verifikasi(kartu, { jwksTepercaya: jwks, sekarang: SEKARANG, dicabut: [] });
  assert.equal(hasil.status, "asli");
  assert.equal(hasil.boleh, true);
  assert.equal(hasil.kode, "JATI_OK");
  assert.equal(hasil.kalimat, "Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.");
});

test("kartu utuh tanpa daftar cabut tidak disebut asli", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const hasil = await verifikasi(kartu, { jwksTepercaya: jwks, sekarang: SEKARANG });
  assert.equal(hasil.status, "tidak_pasti");
  assert.equal(hasil.boleh, false);
  assert.equal(hasil.kode, "JATI_REVOCATION_UNCHECKED");
  assert.equal(hasil.kalimat, "Tidak pasti. Pencabutan belum bisa dicek.");
  assert.equal(hasil.alasan, hasil.kalimat);
});

test("satu karakter pada isi membuat kartu sudah diubah", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const rusak = structuredClone(kartu);
  rusak.pemilik.id = "CONTOH-124";
  const hasil = await verifikasi(rusak, { jwksTepercaya: jwks, sekarang: SEKARANG });
  assert.equal(hasil.status, "diubah");
  assert.equal(hasil.boleh, false);
  assert.equal(hasil.kalimat, "Kartu sudah diubah.");
});

test("satu karakter pada tanda tangan membuat kartu sudah diubah", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const rusak = structuredClone(kartu);
  const bagian = rusak.tandaTangan.split(".");
  const tanda = bagian[2];
  assert.ok(tanda);
  const pengganti = tanda[0] === "a" ? "b" : "a";
  bagian[2] = `${pengganti}${tanda.slice(1)}`;
  rusak.tandaTangan = bagian.join(".");
  const hasil = await verifikasi(rusak, { jwksTepercaya: jwks, sekarang: SEKARANG });
  assert.equal(hasil.kalimat, "Kartu sudah diubah.");
});

test("header dengan parameter tambahan ditolak meski tanda tangan jose sah", async () => {
  const { privat, jwks } = await penerbitUji();
  const dasar = kartuDasar(await kunciAgenUji());
  const kartu = await tandatangani(dasar, privat, { kid: "uji-1" });
  const { privateKey } = await import("jose").then(async (jose) => {
    const kunci = await jose.importJWK(privat, "EdDSA");
    if (kunci instanceof Uint8Array) throw new Error("bukan kunci");
    return { privateKey: kunci };
  });
  const kanon = kanonisasi(dasar);
  const jws = await new CompactSign(new TextEncoder().encode(kanon))
    .setProtectedHeader({ alg: "EdDSA", kid: "uji-1", typ: "jati" })
    .sign(privateKey);
  const hasil = await verifikasi({ ...kartu, tandaTangan: jws }, { jwksTepercaya: jwks, sekarang: SEKARANG });
  assert.equal(hasil.kalimat, "Kartu sudah diubah.");
});

test("kartu kedaluwarsa", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const hasil = await verifikasi(kartu, {
    jwksTepercaya: jwks,
    sekarang: new Date("2027-01-01T00:00:00+07:00"),
  });
  assert.equal(hasil.kalimat, "Kartu kedaluwarsa.");
});

test("kartu belum berlaku", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const hasil = await verifikasi(kartu, {
    jwksTepercaya: jwks,
    sekarang: new Date("2026-10-20T23:59:59+07:00"),
  });
  assert.equal(hasil.kalimat, "Kartu belum berlaku.");
});

test("batas waktu inklusif", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const daftar = { jwksTepercaya: jwks, dicabut: [] as const };
  const awal = await verifikasi(kartu, { ...daftar, sekarang: new Date(kartu.terbit) });
  const akhir = await verifikasi(kartu, { ...daftar, sekarang: new Date(kartu.berlakuSampai) });
  const sebelum = await verifikasi(kartu, {
    ...daftar,
    sekarang: new Date(new Date(kartu.terbit).getTime() - 1),
  });
  const sesudah = await verifikasi(kartu, {
    ...daftar,
    sekarang: new Date(new Date(kartu.berlakuSampai).getTime() + 1),
  });
  assert.equal(awal.status, "asli");
  assert.equal(akhir.status, "asli");
  assert.equal(sebelum.kalimat, "Kartu belum berlaku.");
  assert.equal(sesudah.kalimat, "Kartu kedaluwarsa.");
});

test("kartu yang ada di daftar cabut", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const hasil = await verifikasi(kartu, {
    jwksTepercaya: jwks,
    sekarang: new Date("2027-01-01T00:00:00+07:00"),
    dicabut: [kartu.id],
  });
  assert.equal(hasil.kalimat, "Kartu sudah dicabut.");
});

test("penerbit yang kuncinya tidak dipercaya", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const hasil = await verifikasi(kartu, { jwksDitemukan: jwks, sekarang: SEKARANG });
  assert.equal(hasil.status, "penerbit_belum_dikenal");
  assert.equal(hasil.boleh, false);
  assert.equal(hasil.kalimat, "Tanda tangan cocok, penerbit belum dikenal.");
});

test("kid tidak ada di JWKS", async () => {
  const { kartu } = await kartuDitandatangani();
  const hasil = await verifikasi(kartu, { jwksTepercaya: { keys: [] }, sekarang: SEKARANG });
  assert.equal(hasil.kalimat, "Kunci penerbit untuk kid ini tidak ada.");
});

test("aksi di luar izin dan jumlah di atas batas", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const opsi = { jwksTepercaya: jwks, sekarang: SEKARANG, dicabut: [] as const };
  const luar = await verifikasi(kartu, { ...opsi, aksi: "kirim_email" });
  assert.equal(luar.kalimat, 'Tolak. Aksi "kirim_email" tidak ada di izin.');
  const pas = await verifikasi(kartu, { ...opsi, aksi: "bayar", jumlah: 300000 });
  assert.equal(pas.boleh, true);
  const lewat = await verifikasi(kartu, { ...opsi, aksi: "bayar", jumlah: 300001 });
  assert.equal(lewat.kalimat, "Tolak. Jumlah Rp300.001 melewati batas per transaksi Rp300.000.");
  const harian = await verifikasi(kartu, { ...opsi, aksi: "bayar", jumlah: 200000, terpakaiHariIni: 300001 });
  assert.equal(harian.kalimat, "Tolak. Pemakaian hari ini menjadi Rp500.001, melewati batas Rp500.000.");
  const harianPas = await verifikasi(kartu, { ...opsi, aksi: "bayar", jumlah: 200000, terpakaiHariIni: 300000 });
  assert.equal(harianPas.boleh, true);
  const tanpaJumlah = await verifikasi(kartu, { ...opsi, aksi: "bayar" });
  assert.equal(tanpaJumlah.kalimat, "Tolak. Aksi bayar membutuhkan jumlah.");
  const bukanBayar = await verifikasi(kartu, { ...opsi, aksi: "baca_katalog", jumlah: 1 });
  assert.equal(bukanBayar.kalimat, "Tolak. Batas belanja hanya berlaku untuk aksi bayar.");
  const baca = await verifikasi(kartu, { ...opsi, aksi: "baca_katalog" });
  assert.equal(baca.boleh, true);
});

test("kartu tanpa field wajib tidak sesuai format", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const rusak = structuredClone(kartu) as Partial<typeof kartu>;
  delete rusak.izin;
  const hasil = await verifikasi(rusak, { jwksTepercaya: jwks, sekarang: SEKARANG });
  assert.equal(hasil.kalimat, "Kartu tidak sesuai format.");
});

test("nama dengan baris baru tidak lolos sebagai kartu asli", async () => {
  const { privat, jwks } = await penerbitUji();
  const kunciJose = await import("jose").then((jose) => jose.importJWK(privat, "EdDSA"));
  if (kunciJose instanceof Uint8Array) throw new Error("bukan kunci");
  const kunci = await kunciAgenUji();
  for (const nama of ["X\nBerlaku sampai 1 Jan 2099", "X\u2028Berlaku sampai 1 Jan 2099"]) {
    const dasar = kartuDasar(kunci);
    const pemilik = dasar["pemilik"] as { nama: string };
    pemilik.nama = nama;
    const tandaTangan = await new CompactSign(new TextEncoder().encode(kanonisasi(dasar)))
      .setProtectedHeader({ alg: "EdDSA", kid: "uji-1" })
      .sign(kunciJose);
    const hasil = await verifikasi(
      { ...dasar, tandaTangan },
      { jwksTepercaya: jwks, sekarang: SEKARANG, dicabut: [] },
    );
    assert.equal(hasil.kode, "JATI_MALFORMED");
    assert.equal(hasil.kalimat, "Kartu tidak sesuai format.");
  }
});

test("jumlah di atas batas harian ditolak tanpa terpakaiHariIni", async () => {
  const { privat, jwks } = await penerbitUji();
  const dasar = kartuDasar(await kunciAgenUji());
  const batas = dasar["batasBelanja"] as { perTransaksi: number; perHari: number };
  batas.perTransaksi = 500000;
  batas.perHari = 10000;
  const kartu = await tandatangani(dasar, privat, { kid: "uji-1" });
  const opsi = { jwksTepercaya: jwks, sekarang: SEKARANG, dicabut: [] as const };
  const tanpa = await verifikasi(kartu, { ...opsi, jumlah: 20000 });
  assert.equal(tanpa.kode, "JATI_OVER_DAILY_LIMIT");
  assert.equal(tanpa.kalimat, "Tolak. Pemakaian hari ini menjadi Rp20.000, melewati batas Rp10.000.");
  const nol = await verifikasi(kartu, { ...opsi, jumlah: 20000, terpakaiHariIni: 0 });
  assert.equal(nol.kode, "JATI_OVER_DAILY_LIMIT");
  const pas = await verifikasi(kartu, { ...opsi, jumlah: 10000 });
  assert.equal(pas.kode, "JATI_OK");
  const lewatSatu = await verifikasi(kartu, { ...opsi, jumlah: 10001 });
  assert.equal(lewatSatu.kode, "JATI_OVER_DAILY_LIMIT");
});

test("berkas cabut tanpa jati 0.1 bukan daftar", () => {
  assert.equal(daftarDariBerkas({ dicabut: [] }), undefined);
  assert.deepEqual(daftarDariBerkas({ jati: "0.1", dicabut: [] }), []);
});

test("nama dengan huruf di luar ASCII tetap utuh", async () => {
  const { privat, jwks } = await penerbitUji();
  const dasar = kartuDasar(await kunciAgenUji());
  const pemilik = dasar["pemilik"] as { nama: string };
  pemilik.nama = "PT Contoh Jaya ö";
  const kartu = await tandatangani(dasar, privat, { kid: "uji-1" });
  const hasil = await verifikasi(kartu, { jwksTepercaya: jwks, sekarang: SEKARANG, dicabut: [] });
  assert.equal(hasil.kalimat, "Kartu asli. Pemilik: PT Contoh Jaya ö. Berlaku sampai 31 Des 2026.");
});
