import assert from "node:assert/strict";
import test from "node:test";
import { generateKeyPair } from "jose";
import { buatKartu } from "../src/buat.ts";
import { dariBase64Url, jsonLebihBesarDari, keBase64Url, samaByte } from "../src/byte.ts";
import { daftarDariBerkas } from "../src/cabut.ts";
import { tanggalKalimat, rupiah } from "../src/kalimat.ts";
import { kanonisasi } from "../src/kanon.ts";
import { kunciAgenSah } from "../src/skema.ts";
import { bacaKid, cariKunci, kunciPrivat, tandaCocok } from "../src/tanda.ts";
import { tandatangani } from "../src/tandatangani.ts";
import { verifikasi } from "../src/verifikasi.ts";
import { kartuDasar, kartuDitandatangani, kunciAgenUji, penerbitUji, SEKARANG } from "./bantuan.ts";

test("pembantu byte dan kalimat menutup cabang tepi", () => {
  const putaran: Record<string, unknown> = {};
  putaran["diri"] = putaran;
  assert.equal(jsonLebihBesarDari(putaran, 10), true);
  assert.equal(dariBase64Url(""), undefined);
  assert.equal(dariBase64Url("a"), undefined);
  assert.equal(dariBase64Url("@@@@"), undefined);
  const byte = dariBase64Url("aa");
  assert.ok(byte);
  assert.equal(dariBase64Url(keBase64Url(byte))?.length, byte.length);
  assert.equal(samaByte(byte, new Uint8Array([1, 2, 3])), false);
  assert.equal(samaByte(byte, Uint8Array.from(byte)), true);
  assert.equal(rupiah(-1000n), "Rp-1.000");
  assert.equal(tanggalKalimat("bukan-tanggal"), "bukan-tanggal");
  assert.equal(tanggalKalimat("2026-13-01T00:00:00+07:00"), "2026-13-01T00:00:00+07:00");
});

test("kanonisasi menolak nilai yang tidak bisa dijadikan string", () => {
  assert.throws(() => kanonisasi(undefined), /tidak bisa dikanonisasi/);
});

test("kunci agen harus 32 byte kanonik", () => {
  assert.equal(kunciAgenSah("aa"), false);
  assert.equal(kunciAgenSah("@@@@"), false);
});

test("bacaKid dan cariKunci menolak bentuk yang rusak", async () => {
  assert.equal(bacaKid("bukan-jws"), undefined);
  assert.equal(bacaKid("@@@.@@@.@@@"), undefined);
  const { jwks } = await penerbitUji();
  const kunci = jwks.keys[0];
  assert.ok(kunci);
  assert.equal(cariKunci(undefined, "uji-1"), undefined);
  assert.throws(() => cariKunci({ keys: "bukan" } as never, "uji-1"), /keys/);
  assert.throws(() => cariKunci({ keys: [kunci, { ...kunci }] }, "uji-1"), /unik/);
  assert.equal(cariKunci({ keys: [{ ...kunci, kty: "RSA" }] }, "uji-1"), undefined);
  assert.equal(cariKunci({ keys: [{ ...kunci, alg: "RS256" }] }, "uji-1"), undefined);
  assert.equal(cariKunci({ keys: [{ ...kunci, use: "enc" }] }, "uji-1"), undefined);
  const tanpaX = { ...kunci };
  delete tanpaX.x;
  assert.equal(cariKunci({ keys: [tanpaX] }, "uji-1"), undefined);
  assert.equal(cariKunci({ keys: [{ ...kunci, kid: "lain" }] }, "uji-1"), undefined);
});

test("kunci privat dan tanda menolak masukan yang salah", async () => {
  const { publicKey } = await generateKeyPair("EdDSA", { crv: "Ed25519" });
  await assert.rejects(kunciPrivat(publicKey), /Kunci privat wajib/);
  await assert.rejects(kunciPrivat({ kty: "OKP", crv: "Ed25519" }), /Kunci privat wajib/);
  await assert.rejects(kunciPrivat({ kty: "OKP", crv: "Ed25519", d: "aa" }), /tidak sah|Ed25519/);
  const { privat } = await penerbitUji();
  const publik = await kunciPrivat(privat);
  assert.equal(await tandaCocok("bukan", publik, "{}"), false);
});

test("terbit dan verifikasi menolak bentuk serta opsi yang salah", async () => {
  const { privat, jwks } = await penerbitUji();
  const kunci = await kunciAgenUji();
  await assert.rejects(tandatangani(kartuDasar(kunci), privat, { kid: "" }), /kid tidak sah/);
  await assert.rejects(tandatangani(null, privat, { kid: "uji-1" }), /tidak sesuai format/);
  assert.throws(() => buatKartu({
    id: "bukan",
    namaAgen: "A",
    kunciPublikAgen: kunci,
    namaPemilik: "PT Contoh",
    jenisPemilik: "badan_usaha",
    idPemilik: "CONTOH-123",
    izin: ["bayar"],
    perTransaksi: 1,
    perHari: 1,
    namaPenanggung: "PT Contoh",
    kontak: "https://contoh.id/kontak",
    terbit: "2026-10-21T00:00:00+07:00",
    berlakuSampai: "2026-12-31T23:59:59+07:00",
    pencabutan: "https://contoh.id/cabut.json",
    penerbit: "https://contoh.id/.well-known/jati.json",
  }), /tidak sesuai format/);
  await assert.rejects(verifikasi({}, {}), /wajib diisi/);
  await assert.rejects(verifikasi({}, { jwksTepercaya: {} as never }), /keys/);
  await assert.rejects(verifikasi({}, { jwksDitemukan: {} as never }), /keys/);
  await assert.rejects(
    verifikasi({}, { jwksTepercaya: jwks, sekarang: new Date("bukan") }),
    /sekarang tidak sah/,
  );
  await assert.rejects(verifikasi({}, { jwksTepercaya: jwks, dicabut: [1] as never }), /dicabut/);
  const ditandatangani = await kartuDitandatangani();
  const kartu = ditandatangani.kartu;
  const jwksKartu = ditandatangani.jwks;
  const jumlah = await verifikasi(kartu, { jwksTepercaya: jwksKartu, sekarang: SEKARANG, dicabut: [], jumlah: 1.5 });
  assert.equal(jumlah.kode, "JATI_AMOUNT_INVALID");
  const aksi = await verifikasi(kartu, { jwksTepercaya: jwksKartu, sekarang: SEKARANG, dicabut: [], aksi: "Bayar" });
  assert.equal(aksi.kode, "JATI_ACTION_INVALID");
  const terpakai = await verifikasi(kartu, {
    jwksTepercaya: jwksKartu,
    sekarang: SEKARANG,
    dicabut: [],
    jumlah: 1,
    terpakaiHariIni: -1,
  });
  assert.equal(terpakai.kode, "JATI_SPENT_TODAY_INVALID");
});

test("daftar cabut menolak bentuk lain", () => {
  assert.equal(daftarDariBerkas(null), undefined);
  assert.equal(daftarDariBerkas(["urn:jati:x"]), undefined);
  assert.equal(daftarDariBerkas({ jati: "0.1", dicabut: [1] }), undefined);
});

test("mengganti kunci agen tanpa tanda tangan baru membuat kartu diubah", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  const rusak = structuredClone(kartu);
  rusak.agen.kunciPublik = await kunciAgenUji();
  const hasil = await verifikasi(rusak, { jwksTepercaya: jwks, sekarang: SEKARANG, dicabut: [] });
  assert.equal(hasil.status, "diubah");
});
