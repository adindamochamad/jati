import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function baca(nama: string): string {
  return readFileSync(new URL(`../../../${nama}`, import.meta.url), "utf8");
}

function kartuDariSpec(markdown: string): unknown {
  for (const cocok of markdown.matchAll(/```json\n([\s\S]*?)```/g)) {
    const isi = cocok[1];
    if (isi?.includes('"tandaTangan"')) return JSON.parse(isi) as unknown;
  }
  throw new Error("contoh kartu tidak ada di spec");
}

test("contoh di spec sama dengan fixtures/valid.json", () => {
  const kartu = JSON.parse(baca("fixtures/valid.json")) as unknown;
  assert.deepEqual(kartuDariSpec(baca("spec/kya-v0.1.md")), kartu);
  assert.deepEqual(kartuDariSpec(baca("spec/kya-v0.1.en.md")), kartu);
});

function blokJson(markdown: string): unknown[] {
  return [...markdown.matchAll(/```json\n([\s\S]*?)```/g)].flatMap((cocok) => {
    const isi = cocok[1];
    if (!isi) return [];
    return [JSON.parse(isi) as unknown];
  });
}

test("daftar cabut contoh sama dengan spec", () => {
  const berkas = JSON.parse(baca("fixtures/cabut.json")) as unknown;
  for (const nama of ["spec/kya-v0.1.md", "spec/kya-v0.1.en.md"]) {
    const daftar = blokJson(baca(nama)).find((nilai) => {
      return !!nilai && typeof nilai === "object" && !Array.isArray(nilai) && "dicabut" in nilai;
    });
    assert.deepEqual(daftar, berkas);
  }
});

test("spec menutup empat keputusan v0.1", () => {
  const indonesia = baca("spec/kya-v0.1.md");
  const inggris = baca("spec/kya-v0.1.en.md");
  assert.match(indonesia, /Tidak ada toleransi jam/);
  assert.match(inggris, /no clock skew tolerance/);
  assert.match(indonesia, /Tidak pasti\. Pencabutan belum bisa dicek\./);
  assert.match(inggris, /Tidak pasti\. Pencabutan belum bisa dicek\./);
  assert.match(indonesia, /Bagian ini non-normatif/);
  assert.match(inggris, /This section is non-normative/);
  assert.match(indonesia, /bukan klaim kompatibilitas/);
  assert.match(inggris, /not a compatibility claim/);
});

test("spec menolak klaim regulasi", () => {
  const indonesia = baca("spec/kya-v0.1.md");
  const inggris = baca("spec/kya-v0.1.en.md");
  assert.match(indonesia, /Usulan terbuka komunitas\. Bukan regulasi\. Bukan standar resmi Komdigi\./);
  assert.match(inggris, /A community proposal\. Not a regulation\. Not an official Komdigi standard\./);
});
