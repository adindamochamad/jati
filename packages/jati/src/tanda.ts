import { CompactSign, compactVerify, importJWK, type JWK } from "jose";
import { dariBase64Url, samaByte } from "./byte.ts";
import type { JWKS } from "./tipe.ts";

export const POLA_KID = /^[A-Za-z0-9._:-]{1,128}$/;

export function headerPas(kid: string): string {
  return JSON.stringify({ alg: "EdDSA", kid });
}

export function bacaKid(jws: string): string | undefined {
  const bagian = jws.split(".");
  if (bagian.length !== 3) return undefined;
  const headerB64 = bagian[0];
  if (!headerB64 || bagian[1] === undefined || bagian[2] === undefined) return undefined;
  const byteHeader = dariBase64Url(headerB64);
  if (!byteHeader) return undefined;
  const teks = new TextDecoder().decode(byteHeader);
  let header: unknown;
  try {
    header = JSON.parse(teks);
  } catch {
    return undefined;
  }
  if (!header || typeof header !== "object" || !("kid" in header)) return undefined;
  const kid = (header as { kid?: unknown }).kid;
  if (typeof kid !== "string" || !POLA_KID.test(kid)) return undefined;
  if (teks !== headerPas(kid)) return undefined;
  return kid;
}

export function hanyaPublik(jwk: JWK): JWK {
  const publik = { ...jwk };
  delete publik.d;
  return publik;
}

export function cariKunci(jwks: JWKS | undefined, kid: string): JWK | undefined {
  if (!jwks) return undefined;
  if (!Array.isArray(jwks.keys)) {
    throw new TypeError("JWKS harus berupa objek dengan keys");
  }
  const cocok = jwks.keys.filter((kunci) => kunci.kid === kid);
  if (cocok.length > 1) {
    throw new TypeError("kid di JWKS harus unik");
  }
  const kunci = cocok[0];
  if (!kunci) return undefined;
  if (kunci.kty !== "OKP" || kunci.crv !== "Ed25519") return undefined;
  if (kunci.alg !== undefined && kunci.alg !== "EdDSA") return undefined;
  if (kunci.use !== undefined && kunci.use !== "sig") return undefined;
  if (typeof kunci.x !== "string") return undefined;
  return kunci;
}

export async function kunciVerifikasi(jwk: JWK): Promise<CryptoKey> {
  try {
    const diimpor = await importJWK(hanyaPublik(jwk), "EdDSA");
    if (diimpor instanceof Uint8Array) {
      throw new TypeError("Kunci penerbit harus OKP Ed25519");
    }
    return diimpor;
  } catch (galat) {
    if (galat instanceof TypeError) throw galat;
    throw new TypeError("Kunci penerbit tidak sah");
  }
}

export async function kunciPrivat(kunci: JWK | CryptoKey): Promise<CryptoKey> {
  if (kunci instanceof CryptoKey) {
    if (kunci.type !== "private") throw new TypeError("Kunci privat wajib");
    return kunci;
  }
  if (typeof kunci.d !== "string") throw new TypeError("Kunci privat wajib");
  try {
    const diimpor = await importJWK(kunci, "EdDSA");
    if (diimpor instanceof Uint8Array || diimpor.type !== "private") {
      throw new TypeError("Kunci privat harus Ed25519");
    }
    return diimpor;
  } catch (galat) {
    if (galat instanceof TypeError) throw galat;
    throw new TypeError("Kunci privat tidak sah");
  }
}

export async function buatTanda(kanonik: string, kunci: CryptoKey, kid: string): Promise<string> {
  return new CompactSign(new TextEncoder().encode(kanonik))
    .setProtectedHeader({ alg: "EdDSA", kid })
    .sign(kunci);
}

export async function tandaCocok(jws: string, kunci: CryptoKey, kanonik: string): Promise<boolean> {
  try {
    const { payload } = await compactVerify(jws, kunci);
    const diharapkan = new TextEncoder().encode(kanonik);
    if (payload.byteLength !== diharapkan.byteLength) return false;
    return samaByte(payload, diharapkan);
  } catch {
    return false;
  }
}
