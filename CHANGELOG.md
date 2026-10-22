# Changelog

Semua perubahan penting proyek ini dicatat di berkas ini.

Formatnya mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versi proyek memakai [Semantic Versioning](https://semver.org/lang/id/).

## [0.1.1] - 2026-10-22

### Ditambahkan

- Uji fuzz 1000 masukan acak pada `verifikasi`.
- `pnpm uji-akses` menjalankan axe-core pada halaman cek.

### Diubah

- Tag `v0.1.1` ditandatangani dengan kunci SSH. `v0.1.0` tetap cap waktu dan tidak dipindah.
- Actions di CI, halaman, dan rilis naik ke checkout 7, setup-node 7, dan pnpm/action-setup 6.

## [Unreleased]

### Ditambahkan

- `docs/akun-github.md` dan `scripts/cek-akun-github.ts` untuk langkah Verified tag dan npm.
- Seed tetap pada uji fuzz; `assertSpawn` pada tes subprocess.

### Diubah

- Dokumentasi engines: Node 20 tidak didukung; minimum tetap `>=22.18`.

### Ditambahkan (sebelum 0.1.1)

- Spec bagian 7 memisahkan keutuhan, pengenalan penerbit, dan ikatan identitas. Tanpa penerbit yang diikat di luar kartu, Jati adalah format klaim.
- `jati cek` tidak mempercayai kunci di samping kartu. `--percaya` harus dinyatakan tegas.
- `jati cek` keluar dengan kode 3 bila penerbit belum dikenal, 0 hanya bila kartu asli.
- `docs/kepercayaan.md` mencatat arti `Kartu asli`, status kebocoran AgentPay, dan penghapusan berkas prompt dari pohon kerja.

### Diubah

- Jati diposisikan sebagai usulan profil KYA untuk Indonesia, bukan format tandingan VC 2.0 dan bukan klaim "yang pertama".
- Halaman cek menjelaskan bahwa nama pemilik adalah klaim, bukan KTP.
- Halaman cek terbit di https://adindamochamad.github.io/jati/ . README menyebut kode keluar 3 untuk penerbit yang belum dikenal.

### Dihapus

- Berkas prompt penyusunan draf dihapus dari pohon kerja. Commit awal tetap memuatnya.

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

- Publikasi npm, selama `NPM_TOKEN` belum ada. Demo pembayaran tetap ditahan selama riwayat atau fork AgentPay masih memuat `.env.production`. Lihat `docs/kepercayaan.md`.
