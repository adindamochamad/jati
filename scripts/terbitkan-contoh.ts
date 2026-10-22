import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tandatangani, verifikasi } from "../packages/jati/src/index.ts";

type KunciPrivat = {
  kty: "OKP";
  crv: "Ed25519";
  x: string;
  d: string;
  alg: "EdDSA";
  use: "sig";
  kid?: string;
};

const KID = "contoh-penerbit-1";
const PATH_PENERBIT = "keys/contoh-penerbit.private.jwk.json";
const PATH_AGEN = "keys/contoh-agen.private.jwk.json";
const SEKARANG = new Date("2026-10-21T12:00:00+07:00");

mkdirSync("keys", { recursive: true });
mkdirSync("fixtures", { recursive: true });

async function buatKunci(kid?: string): Promise<KunciPrivat> {
  const { privateKey } = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const diekspor = await crypto.subtle.exportKey("jwk", privateKey);
  if (typeof diekspor.x !== "string" || typeof diekspor.d !== "string") {
    throw new Error("Kunci Ed25519 tidak lengkap");
  }
  return {
    kty: "OKP",
    crv: "Ed25519",
    x: diekspor.x,
    d: diekspor.d,
    alg: "EdDSA",
    use: "sig",
    ...(kid ? { kid } : {}),
  };
}

async function muatAtauBuat(path: string, kid?: string): Promise<KunciPrivat> {
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, "utf8")) as KunciPrivat;
  }
  const jwk = await buatKunci(kid);
  writeFileSync(path, `${JSON.stringify(jwk, null, 2)}\n`, { mode: 0o600 });
  chmodSync(path, 0o600);
  return jwk;
}

function tulis(path: string, nilai: unknown): void {
  writeFileSync(path, `${JSON.stringify(nilai, null, 2)}\n`);
}

const penerbit = await muatAtauBuat(PATH_PENERBIT, KID);
const agen = await muatAtauBuat(PATH_AGEN);
if (typeof penerbit.x !== "string" || typeof agen.x !== "string") {
  throw new Error("Kunci tidak punya komponen publik x");
}
if (penerbit.x === agen.x) {
  throw new Error("Kunci penerbit dan kunci agen tidak boleh sama");
}

const kartu = await tandatangani(
  {
    jati: "0.1",
    id: "urn:jati:contoh:agen-001",
    agen: { nama: "Asisten Belanja Contoh", kunciPublik: agen.x },
    pemilik: { nama: "PT Contoh Jaya (fiktif)", jenis: "badan_usaha", id: "CONTOH-123" },
    izin: ["baca_katalog", "bayar"],
    batasBelanja: { mataUang: "IDR", perTransaksi: 300000, perHari: 500000 },
    penanggungJawab: { nama: "PT Contoh Jaya (fiktif)", kontak: "https://contoh.id/kontak" },
    terbit: "2026-10-21T00:00:00+07:00",
    berlakuSampai: "2026-12-31T23:59:59+07:00",
    pencabutan: "https://adindamochamad.github.io/jati/cabut.json",
    penerbit: "https://adindamochamad.github.io/jati/.well-known/jati.json",
  },
  penerbit,
  { kid: KID },
);

const jwks = {
  keys: [
    {
      kty: "OKP",
      crv: "Ed25519",
      x: penerbit.x,
      kid: KID,
      alg: "EdDSA",
      use: "sig",
    },
  ],
};

tulis("fixtures/valid.json", kartu);
tulis("fixtures/penerbit.public.jwks.json", jwks);

const hasil = await verifikasi(kartu, { jwksTepercaya: jwks, sekarang: SEKARANG });
if (!hasil.boleh) {
  console.error(hasil.kalimat);
  process.exit(1);
}
console.log(hasil.kalimat);
console.log("Kartu contoh ditulis ke fixtures/valid.json");
console.log("Kunci privat ada di keys/ dan tidak untuk di-commit.");
