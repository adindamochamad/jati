import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

let gagal = 0;

function cek(judul: string, ok: boolean, petunjuk: string) {
  console.log(ok ? `ok ${judul}` : `belum ${judul}`);
  if (!ok) {
    console.log(`  → ${petunjuk}`);
    gagal += 1;
  }
}

const pubPenuh = readFileSync(join(homedir(), ".ssh/id_ed25519.pub"), "utf8").trim();
const pub = pubPenuh.split(/\s+/).slice(0, 2).join(" ");
const daftar = spawnSync("gh", ["api", "user/ssh_signing_keys", "--jq", ".[].key"], { encoding: "utf8" });
const punyaLingkup = daftar.status === 0;
const kunciTerdaftar =
  punyaLingkup &&
  daftar.stdout.split("\n").some((baris) => {
    const kunci = baris.trim();
    return kunci === pubPenuh || kunci === pub;
  });
cek(
  "kunci SSH penanda di GitHub",
  kunciTerdaftar,
  "jalankan langkah di docs/akun-github.md (gh auth refresh -s admin:ssh_signing_key, lalu POST ssh_signing_keys)",
);

const secret = spawnSync("gh", ["secret", "list", "--repo", "adindamochamad/jati"], { encoding: "utf8" });
const adaNpm = secret.status === 0 && secret.stdout.includes("NPM_TOKEN");
cek("secret NPM_TOKEN di repositori", adaNpm, "gh secret set NPM_TOKEN --repo adindamochamad/jati (lihat docs/akun-github.md)");

const npm = await fetch("https://registry.npmjs.org/@adindamochamad/jati");
cek("paket di registry.npmjs.org", npm.ok, adaNpm ? "rerun workflow rilis v0.1.1 setelah secret terisi" : "isi NPM_TOKEN lalu rerun rilis");

process.exit(gagal > 0 ? 1 : 0);
