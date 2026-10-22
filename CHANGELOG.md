# Changelog

Semua perubahan penting proyek ini dicatat di berkas ini.

Formatnya mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versi proyek memakai [Semantic Versioning](https://semver.org/lang/id/).

## [Unreleased]

### Ditambahkan

- Skema kanonis `spec/schema/jati-0.1.json` dan vektor uji `spec/vectors/v0.1.json` (valid, diubah, kedaluwarsa, dicabut, lewat limit).
- Build pustaka: ESM, berkas `.d.ts`, dan bundel CJS. `jose` 6 serta `canonicalize` 5 hanya ESM, jadi `require()` memakai bundel.
- Perintah `jati kunci-baru`, `jati terbit`, dan `jati cek`.
- Halaman cek di peramban, dengan tempel JSON, unggah berkas, pindai QR, dan service worker.
- Cuplikan Node, Python, dan middleware Express/Fastify.
- Lima kasus lokal lewat `pnpm demo`.
- Kode hasil stabil dan kalimat Inggris informatif.
- Dokumen kontribusi, keamanan, model ancaman, dan templat RFC.

### Diubah

- Nama dengan karakter kontrol atau pemisah baris gagal bentuk, bukan `JATI_OK`.
- Jumlah yang sudah melewati `perHari` ditolak walaupun `terpakaiHariIni` tidak diisi.
- Halaman cek menolak berkas cabut tanpa `jati` `"0.1"`, sama seperti CLI.
- Cuplikan Python keluar status 1 untuk kartu di luar masa berlaku.
- Jalur yang semestinya `Kartu asli` menjadi `Tidak pasti. Pencabutan belum bisa dicek.` bila daftar cabut tidak ada.
- Spec menyatakan tidak ada toleransi jam.
- Contoh bentuk VC 2.0 ditambahkan sebagai bagian non-normatif.
- Pemeriksaan skema runtime tetap di kode pustaka. Ajv hanya devDependency untuk vektor di CI, supaya bundle tetap di bawah 30 KB gzip.

### Ditahan

- Publikasi npm, tag bertanda tangan, dan demo pembayaran. Demo pembayaran tetap ditahan selama berkas lingkungan produksi AgentPay masih ada di cabang utamanya.
