import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { kanonisasi } from "../src/kanon.ts";

const HEX_RFC_8785 = [
  "7b226c69746572616c73223a5b6e756c6c2c7472",
  "75652c66616c73655d2c226e756d62657273223a",
  "5b3333333333333333332e333333333333332c31",
  "652b33302c342e352c302e3030322c31652d3237",
  "5d2c22737472696e67223a22e282ac245c753030",
  "30665c6e4127425c225c5c5c5c5c222f227d",
].join("");

test("contoh angka dan string RFC 8785 bagian 3.2.4", () => {
  const objek = JSON.parse(readFileSync(new URL("./rfc8785-masukan.json", import.meta.url), "utf8")) as unknown;
  const kanon = kanonisasi(objek);
  assert.equal(Buffer.from(kanon, "utf8").toString("hex"), HEX_RFC_8785);
});

test("urutan nama properti mengikuti UTF-16 seperti RFC 8785", () => {
  const kanon = kanonisasi({
    "€": "Euro Sign",
    "\r": "Carriage Return",
    "\ufb33": "Hebrew Letter Dalet With Dagesh",
    "1": "One",
    "😀": "Emoji: Grinning Face",
    "\u0080": "Control",
    ö: "Latin Small Letter O With Diaeresis",
  });
  const nilai = [
    "Carriage Return",
    "One",
    "Control",
    "Latin Small Letter O With Diaeresis",
    "Euro Sign",
    "Emoji: Grinning Face",
    "Hebrew Letter Dalet With Dagesh",
  ];
  let posisi = -1;
  for (const item of nilai) {
    const berikut = kanon.indexOf(item);
    assert.ok(berikut > posisi, item);
    posisi = berikut;
  }
});

test("rupiah bulat tidak berubah menjadi desimal", () => {
  assert.equal(kanonisasi({ perHari: 500000, perTransaksi: 300000 }), '{"perHari":500000,"perTransaksi":300000}');
});
