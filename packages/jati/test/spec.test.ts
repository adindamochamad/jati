import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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

test("spec menutup keputusan v0.1 yang sudah ada", () => {
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
  assert.match(indonesia, /Usulan profil KYA untuk Indonesia\. Bukan regulasi\. Bukan standar resmi Komdigi\./);
  assert.match(inggris, /A proposed KYA profile for Indonesia\. Not a regulation\. Not an official Komdigi standard\./);
});

test("berkas prompt tidak ada di pohon kerja", () => {
  for (const nama of ["kya-cursor-prompt.md", "kya-cursor-prompt 2.md", "jati-dod-tambahan.md"]) {
    assert.equal(existsSync(new URL(`../../../${nama}`, import.meta.url)), false, nama);
  }
});

test("spec memisahkan keutuhan, pengenalan penerbit, dan ikatan identitas", () => {
  const indonesia = baca("spec/kya-v0.1.md");
  const inggris = baca("spec/kya-v0.1.en.md");
  assert.match(indonesia, /usulan profil KYA/);
  assert.match(inggris, /proposed KYA profile/);
  assert.match(indonesia, /bukan klaim "yang pertama"/);
  assert.match(inggris, /not a claim of being first/);
  assert.match(indonesia, /\*\*Ikatan identitas\.\*\*/);
  assert.match(inggris, /\*\*Identity binding\.\*\*/);
  assert.match(indonesia, /Kartu mandiri/);
  assert.match(inggris, /Self-issued card/);
  assert.match(indonesia, /TIDAK BOLEH\*\* menulis `Kartu asli` untuk kartu mandiri/);
  assert.match(inggris, /MUST NOT write `Kartu asli` for a self-issued card/);
  assert.match(indonesia, /bukan sistem identitas/);
  assert.match(inggris, /not an identity system/);
  assert.match(indonesia, /keluar dengan kode 3/);
  assert.match(inggris, /exits 3/);
});
