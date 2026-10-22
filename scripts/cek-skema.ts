import { readFileSync } from "node:fs";
import { Ajv2020 } from "ajv/dist/2020.js";

const skema = JSON.parse(readFileSync("spec/schema/jati-0.1.json", "utf8")) as object;
const vektor = JSON.parse(readFileSync("spec/vectors/v0.1.json", "utf8")) as {
  kasus: { nama: string; kartu: unknown }[];
};
const ajv = new Ajv2020({ allErrors: true, strict: true });
const periksa = ajv.compile(skema);
const nama = new Set<string>();
for (const kasus of vektor.kasus) {
  nama.add(kasus.nama);
  if (periksa(kasus.kartu)) continue;
  const alasan = ajv.errorsText(periksa.errors);
  console.error(`${kasus.nama} tidak lolos skema: ${alasan}`);
  process.exit(1);
}
const wajib = ["valid", "diubah", "kedaluwarsa", "dicabut", "lewat-limit"];
for (const item of wajib) {
  if (!nama.has(item)) {
    console.error(`Vektor ${item} tidak ada.`);
    process.exit(1);
  }
}
console.log(`skema jati-0.1: ${vektor.kasus.length} kartu lolos`);
