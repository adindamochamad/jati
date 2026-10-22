import { generateKeyPair, exportJWK, type JWK } from "jose";
import { tandatangani } from "../src/tandatangani.ts";
import type { JWKS, KartuJati } from "../src/tipe.ts";

export const SEKARANG = new Date("2026-10-21T12:00:00+07:00");

export async function penerbitUji(kid = "uji-1"): Promise<{ privat: JWK; jwks: JWKS }> {
  const { privateKey, publicKey } = await generateKeyPair("EdDSA", { crv: "Ed25519", extractable: true });
  const privat = await exportJWK(privateKey);
  const publik = await exportJWK(publicKey);
  privat.kid = kid;
  privat.alg = "EdDSA";
  privat.use = "sig";
  publik.kid = kid;
  publik.alg = "EdDSA";
  publik.use = "sig";
  return { privat, jwks: { keys: [publik] } };
}

export async function kunciAgenUji(): Promise<string> {
  const { publicKey } = await generateKeyPair("EdDSA", { crv: "Ed25519", extractable: true });
  const jwk = await exportJWK(publicKey);
  if (typeof jwk.x !== "string") throw new Error("kunci agen tidak punya x");
  return jwk.x;
}

export function kartuDasar(kunciPublik: string): Record<string, unknown> {
  return {
    jati: "0.1",
    id: "urn:jati:contoh:agen-uji",
    agen: { nama: "Asisten Uji", kunciPublik },
    pemilik: { nama: "PT Contoh Jaya (fiktif)", jenis: "badan_usaha", id: "CONTOH-123" },
    izin: ["baca_katalog", "bayar"],
    batasBelanja: { mataUang: "IDR", perTransaksi: 300000, perHari: 500000 },
    penanggungJawab: { nama: "PT Contoh Jaya (fiktif)", kontak: "https://contoh.id/kontak" },
    terbit: "2026-10-21T00:00:00+07:00",
    berlakuSampai: "2026-12-31T23:59:59+07:00",
    pencabutan: "https://adindamochamad.github.io/jati/cabut.json",
    penerbit: "https://adindamochamad.github.io/jati/.well-known/jati.json",
  };
}

export async function kartuDitandatangani(kid = "uji-1"): Promise<{ kartu: KartuJati; jwks: JWKS; privat: JWK }> {
  const { privat, jwks } = await penerbitUji(kid);
  const kartu = await tandatangani(kartuDasar(await kunciAgenUji()), privat, { kid });
  return { kartu, jwks, privat };
}
