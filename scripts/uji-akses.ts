import axe from "axe-core";
import puppeteer from "puppeteer-core";

const alamat = process.argv[2] ?? "https://adindamochamad.github.io/jati/";
const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox"],
});
const halaman = await browser.newPage();
await halaman.setViewport({ width: Number(process.argv[3] ?? 360), height: 800 });
await halaman.goto(alamat, { waitUntil: "networkidle0" });
await halaman.evaluate(axe.source);
const hasil = await halaman.evaluate(async () => {
  const alat = (globalThis as unknown as { axe: typeof axe }).axe;
  return alat.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
  });
});
await browser.close();
const ringkas = hasil.violations.map((temuan) => ({
  id: temuan.id,
  impact: temuan.impact,
  jumlah: temuan.nodes.length,
  bantuan: temuan.help,
}));
console.log(JSON.stringify(ringkas, null, 2));
if (ringkas.length > 0) process.exit(1);
