import type { JWK } from "jose";
import { jsonLebihBesarDari } from "./byte.ts";
import { kanonisasi } from "./kanon.ts";
import { kunciAgenSah, payloadSesuaiSkema } from "./skema.ts";
import { buatTanda, kunciPrivat, POLA_KID } from "./tanda.ts";
import type { KartuJati } from "./tipe.ts";

const BATAS_BYTE = 65_536;

function objekJson(nilai: unknown): nilai is Record<string, unknown> {
  return typeof nilai === "object" && nilai !== null && !Array.isArray(nilai);
}

function terlaluBesar(nilai: unknown): boolean {
  return jsonLebihBesarDari(nilai, BATAS_BYTE);
}

export async function tandatangani(
  masukan: unknown,
  kunci: JWK | CryptoKey,
  opsi: { kid: string },
): Promise<KartuJati> {
  if (!POLA_KID.test(opsi.kid)) {
    throw new TypeError("kid tidak sah");
  }
  if (!objekJson(masukan) || terlaluBesar(masukan)) {
    throw new TypeError("Kartu tidak sesuai format");
  }
  const payload = structuredClone(masukan);
  delete payload["tandaTangan"];
  if (!payloadSesuaiSkema(payload) || terlaluBesar(payload)) {
    throw new TypeError("Kartu tidak sesuai format");
  }
  const kunciAgen = payload["agen"];
  if (!objekJson(kunciAgen) || typeof kunciAgen["kunciPublik"] !== "string" || !kunciAgenSah(kunciAgen["kunciPublik"])) {
    throw new TypeError("Kartu tidak sesuai format");
  }
  let kanonik: string;
  try {
    kanonik = kanonisasi(payload);
  } catch {
    throw new TypeError("Kartu tidak bisa dikanonisasi");
  }
  const privat = await kunciPrivat(kunci);
  const tandaTangan = await buatTanda(kanonik, privat, opsi.kid);
  return { ...payload, tandaTangan } as KartuJati;
}
