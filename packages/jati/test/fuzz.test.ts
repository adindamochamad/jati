import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { verifikasi } from "../src/verifikasi.ts";

const opsi = {
  jwksTepercaya: { keys: [] },
  sekarang: new Date("2026-10-22T12:00:00+07:00"),
  dicabut: [] as string[],
};

test("seribu masukan acak tidak menjatuhkan verifikasi", async () => {
  await fc.assert(
    fc.asyncProperty(fc.anything({ maxDepth: 4 }), async (masukan) => {
      const hasil = await verifikasi(masukan, opsi);
      assert.equal(typeof hasil.status, "string");
      assert.equal(typeof hasil.kalimat, "string");
      assert.equal(hasil.boleh, hasil.status === "asli");
      return true;
    }),
    { numRuns: 1000 },
  );
});
