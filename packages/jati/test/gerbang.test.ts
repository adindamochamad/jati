import assert from "node:assert/strict";
import test from "node:test";
import { tolakTanpaKartu } from "../../../examples/middleware/express.ts";
import { tandatangani } from "../src/tandatangani.ts";
import { kartuDasar, kartuDitandatangani, kunciAgenUji, penerbitUji, SEKARANG } from "./bantuan.ts";

test("middleware menolak permintaan tanpa kartu", async () => {
  const { jwks } = await kartuDitandatangani();
  const pesan: string[] = [];
  let lanjut = false;
  const middleware = tolakTanpaKartu(jwks, [], SEKARANG);
  await middleware(
    {},
    { status: () => ({ send: (teks) => pesan.push(teks) }) },
    () => {
      lanjut = true;
    },
  );
  assert.equal(lanjut, false);
  assert.equal(pesan[0], "Kartu tidak sesuai format.");
});

test("middleware meneruskan kartu yang lolos", async () => {
  const { kartu, jwks } = await kartuDitandatangani();
  let lanjut = false;
  const middleware = tolakTanpaKartu(jwks, [], SEKARANG);
  await middleware(
    { body: kartu },
    { status: () => ({ send: () => undefined }) },
    () => {
      lanjut = true;
    },
  );
  assert.equal(lanjut, true);
});

test("middleware menolak jumlah di atas batas harian tanpa terpakai", async () => {
  const { privat, jwks } = await penerbitUji();
  const dasar = kartuDasar(await kunciAgenUji());
  const batas = dasar["batasBelanja"] as { perTransaksi: number; perHari: number };
  batas.perTransaksi = 500000;
  batas.perHari = 10000;
  const kartu = await tandatangani(dasar, privat, { kid: "uji-1" });
  const pesan: string[] = [];
  let lanjut = false;
  const middleware = tolakTanpaKartu(jwks, [], SEKARANG, { jumlah: 20000 });
  await middleware(
    { body: kartu },
    { status: () => ({ send: (teks) => pesan.push(teks) }) },
    () => {
      lanjut = true;
    },
  );
  assert.equal(lanjut, false);
  assert.equal(pesan[0], "Tolak. Pemakaian hari ini menjadi Rp20.000, melewati batas Rp10.000.");
});
