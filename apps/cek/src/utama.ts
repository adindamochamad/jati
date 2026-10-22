import { daftarDariBerkas, verifikasi, type JWKS } from "../../../packages/jati/src/index.ts";

type Bahasa = "id" | "en";
type Detektor = { detect(sumber: CanvasImageSource): Promise<Array<{ rawValue: string }>> };

const salinan = {
  id: {
    judul: "Cek kartu agen",
    pengantar: "Tempel JSON, unggah berkas, atau pindai QR. Pemeriksaan berjalan di peramban ini. Kartu tidak dikirim ke server.",
    kartu: "Kartu",
    berkas: "Atau unggah berkas JSON",
    jwks: "Kunci penerbit yang Anda percayai",
    jumlah: "Jumlah (opsional)",
    terpakai: "Terpakai hari ini (opsional)",
    contoh: "Pakai kartu contoh",
    pindai: "Pindai QR",
    cek: "Cek",
    qr: "Atau unggah gambar QR",
    berhenti: "Berhenti memindai",
    hasil: "Hasil",
    kosong: "Hasil muncul di sini.",
    detail: "Detail teknis",
    cabut: "Pencabutan",
    dicek: "Daftar origin ini yang dipakai. Daftar itu tidak ditandatangani.",
    belum: "belum bisa dicek",
    arti: "Batas belanja tidak diperiksa bila jumlah kosong. Sukses bukan bukti pemilik nyata atau agen aman. Menyalin berkas kartu cukup.",
    kaki: "Usulan terbuka komunitas. Bukan regulasi. Bukan standar resmi Komdigi.",
    lompat: "Langsung ke hasil",
    bahasa: "English",
    qrTidakAda: "Peramban ini tidak bisa memindai QR. Tempel JSON atau unggah berkas.",
    kunci: "Kunci penerbit tidak bisa dibaca.",
    format: "Kartu tidak sesuai format.",
  },
  en: {
    judul: "Check an agent card",
    pengantar: "Paste JSON, upload a file, or scan a QR code. The check runs in this browser. The card is not sent to a server.",
    kartu: "Card",
    berkas: "Or upload a JSON file",
    jwks: "Issuer key you trust",
    jumlah: "Amount (optional)",
    terpakai: "Spent today (optional)",
    contoh: "Use the example card",
    pindai: "Scan QR",
    cek: "Check",
    qr: "Or upload a QR image",
    berhenti: "Stop scanning",
    hasil: "Result",
    kosong: "The result appears here.",
    detail: "Technical detail",
    cabut: "Revocation",
    dicek: "This origin's list was used. That list is not signed.",
    belum: "could not be checked",
    arti: "Spending limits are not checked when the amount is empty. Success does not prove the owner is real or the agent is safe. Copying the card file is enough.",
    kaki: "A community proposal. Not a regulation. Not an official Komdigi standard.",
    lompat: "Skip to result",
    bahasa: "Bahasa Indonesia",
    qrTidakAda: "This browser cannot scan QR codes. Paste JSON or upload a file.",
    kunci: "The issuer key could not be read.",
    format: "The card does not match the format.",
  },
} as const;

let bahasa: Bahasa = "id";
let aliran: MediaStream | undefined;
let memindai = false;

function elemen<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(id);
  return node as T;
}

function terapkanBahasa(): void {
  const teks = salinan[bahasa];
  document.documentElement.lang = bahasa;
  document.title = teks.judul;
  elemen("judul").textContent = teks.judul;
  elemen("pengantar").textContent = teks.pengantar;
  elemen("label-kartu").textContent = teks.kartu;
  elemen("label-berkas").textContent = teks.berkas;
  elemen("label-jwks").textContent = teks.jwks;
  elemen("label-jumlah").textContent = teks.jumlah;
  elemen("label-terpakai").textContent = teks.terpakai;
  elemen("contoh").textContent = teks.contoh;
  elemen("pindai").textContent = teks.pindai;
  elemen("cek").textContent = teks.cek;
  elemen("label-qr").textContent = teks.qr;
  elemen("berhenti").textContent = teks.berhenti;
  elemen("judul-hasil").textContent = teks.hasil;
  elemen("ringkas").textContent = teks.detail;
  elemen("label-cabut").textContent = teks.cabut;
  elemen("kaki").textContent = teks.kaki;
  elemen("arti").textContent = teks.arti;
  elemen("lompat").textContent = teks.lompat;
  elemen("bahasa").textContent = teks.bahasa;
  elemen<HTMLButtonElement>("bahasa").setAttribute("aria-pressed", bahasa === "en" ? "true" : "false");
  if (elemen<HTMLButtonElement>("pindai").disabled) elemen("bantuan-qr").textContent = teks.qrTidakAda;
  gambar();
}

function detektor(): Detektor | undefined {
  const Api = (globalThis as { BarcodeDetector?: new (opsi?: { formats?: string[] }) => Detektor }).BarcodeDetector;
  if (!Api) return undefined;
  try {
    return new Api({ formats: ["qr_code"] });
  } catch {
    return undefined;
  }
}

type Tampil = { id: string; en: string; status: string; kode: string; cabut: boolean };
let terakhir: Tampil | undefined;

function gambar(): void {
  const keluar = elemen("kalimat");
  if (!terakhir) {
    keluar.textContent = salinan[bahasa].kosong;
    delete keluar.dataset["status"];
    return;
  }
  keluar.textContent = bahasa === "en" ? terakhir.en : terakhir.id;
  keluar.dataset["status"] = terakhir.status;
  elemen("status").textContent = terakhir.status;
  elemen("kode").textContent = terakhir.kode;
  elemen("status-cabut").textContent = terakhir.cabut ? salinan[bahasa].dicek : salinan[bahasa].belum;
}

function tampilLokal(id: string, en: string, status: string, cabut: boolean): void {
  terakhir = { id, en, status, kode: "—", cabut };
  gambar();
}

function angkaOpsional(teks: string): number | undefined {
  const bersih = teks.trim();
  if (bersih === "") return undefined;
  if (!/^\d+$/.test(bersih)) return Number.NaN;
  const angka = Number(bersih);
  return Number.isSafeInteger(angka) ? angka : Number.NaN;
}

async function ambilDaftar(): Promise<readonly string[] | undefined> {
  if (!navigator.onLine) return undefined;
  try {
    const jawab = await fetch("/cabut.json", { cache: "no-store" });
    if (!jawab.ok) return undefined;
    return daftarDariBerkas(await jawab.json());
  } catch {
    return undefined;
  }
}

async function periksa(): Promise<void> {
  let kartu: unknown;
  let jwks: unknown;
  try {
    kartu = JSON.parse(elemen<HTMLTextAreaElement>("kartu").value);
  } catch {
    tampilLokal(salinan.id.format, salinan.en.format, "tidak_sesuai_format", false);
    return;
  }
  try {
    jwks = JSON.parse(elemen<HTMLTextAreaElement>("jwks").value);
  } catch {
    tampilLokal(salinan.id.kunci, salinan.en.kunci, "kunci_tidak_ada", false);
    return;
  }
  const dicabut = await ambilDaftar();
  const jumlah = angkaOpsional(elemen<HTMLInputElement>("jumlah").value);
  const terpakai = angkaOpsional(elemen<HTMLInputElement>("terpakai").value);
  try {
    const hasil = await verifikasi(kartu, {
      jwksTepercaya: jwks as JWKS,
      ...(dicabut ? { dicabut } : {}),
      sekarang: new Date(),
      ...(jumlah !== undefined ? { jumlah } : {}),
      ...(terpakai !== undefined ? { terpakaiHariIni: terpakai } : {}),
      ...(jumlah === undefined && terpakai !== undefined ? { aksi: "bayar" } : {}),
    });
    terakhir = {
      id: hasil.kalimat,
      en: hasil.kalimatEn,
      status: hasil.status,
      kode: hasil.kode,
      cabut: dicabut !== undefined,
    };
    gambar();
  } catch {
    tampilLokal(salinan.id.kunci, salinan.en.kunci, "kunci_tidak_ada", false);
  }
}

async function isiContoh(): Promise<void> {
  const [kartu, jwks] = await Promise.all([fetch("/contoh.json"), fetch("/jwks.json")]);
  elemen<HTMLTextAreaElement>("kartu").value = JSON.stringify(await kartu.json(), null, 2);
  elemen<HTMLTextAreaElement>("jwks").value = JSON.stringify(await jwks.json(), null, 2);
}

function berhenti(): void {
  memindai = false;
  aliran?.getTracks().forEach((jejak) => jejak.stop());
  aliran = undefined;
  const video = elemen<HTMLVideoElement>("kamera");
  video.hidden = true;
  video.srcObject = null;
  elemen("berhenti").hidden = true;
}

async function bacaGambar(sumber: CanvasImageSource): Promise<string | undefined> {
  const alat = detektor();
  if (!alat) return undefined;
  const kode = await alat.detect(sumber);
  return kode[0]?.rawValue;
}

async function pindai(): Promise<void> {
  const alat = detektor();
  if (!alat || !navigator.mediaDevices?.getUserMedia) {
    elemen("bantuan-qr").textContent = salinan[bahasa].qrTidakAda;
    return;
  }
  aliran = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  const video = elemen<HTMLVideoElement>("kamera");
  video.hidden = false;
  video.srcObject = aliran;
  elemen("berhenti").hidden = false;
  await video.play();
  memindai = true;
  const ulang = async () => {
    if (!memindai) return;
    try {
      const nilai = await bacaGambar(video);
      if (nilai) {
        elemen<HTMLTextAreaElement>("kartu").value = nilai;
        berhenti();
        return;
      }
    } catch {
      /* bingkai belum siap */
    }
    requestAnimationFrame(() => void ulang());
  };
  void ulang();
}

function pasang(): void {
  if (!detektor()) elemen<HTMLButtonElement>("pindai").disabled = true;
  terapkanBahasa();
  elemen("bahasa").addEventListener("click", () => {
    bahasa = bahasa === "id" ? "en" : "id";
    terapkanBahasa();
    gambar();
  });
  elemen("contoh").addEventListener("click", () => void isiContoh());
  elemen("pindai").addEventListener("click", () => void pindai().catch(() => {
    elemen("bantuan-qr").textContent = salinan[bahasa].qrTidakAda;
    berhenti();
  }));
  elemen("berhenti").addEventListener("click", berhenti);
  elemen<HTMLFormElement>("formulir").addEventListener("submit", (event) => {
    event.preventDefault();
    void periksa();
  });
  elemen<HTMLInputElement>("berkas-kartu").addEventListener("change", () => {
    const berkas = elemen<HTMLInputElement>("berkas-kartu").files?.[0];
    if (!berkas) return;
    void berkas.text().then((teks) => {
      elemen<HTMLTextAreaElement>("kartu").value = teks;
    });
  });
  elemen<HTMLInputElement>("berkas-qr").addEventListener("change", () => {
    const berkas = elemen<HTMLInputElement>("berkas-qr").files?.[0];
    if (!berkas) return;
    void createImageBitmap(berkas).then(async (bitmap) => {
      const nilai = await bacaGambar(bitmap);
      if (!nilai) {
        elemen("bantuan-qr").textContent = salinan[bahasa].qrTidakAda;
        return;
      }
      elemen<HTMLTextAreaElement>("kartu").value = nilai;
    }).catch(() => {
      elemen("bantuan-qr").textContent = salinan[bahasa].qrTidakAda;
    });
  });
  if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js");
}

pasang();
