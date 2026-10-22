# Kontribusi

Jati adalah usulan profil KYA untuk Indonesia. Bukan regulasi. Pengelola saat ini satu orang. Template RFC dan isu ada supaya usul tertulis, bukan karena sudah ada dewan atau penerbit.

## Menjalankan

```bash
pnpm install
pnpm test
pnpm verifikasi -- --sekarang 2026-10-21T12:00:00+07:00
```

`pnpm test` mencakup typecheck, tes pustaka, cuplikan Python, dan batas ukuran bundle.

## Spec

Perubahan spec memakai `rfcs/0000-template.md`: usul, diskusi sedikitnya 7 hari, lalu keputusan tercatat. Bahasa normatif adalah Indonesia. Terjemahan Inggris harus mengikuti dokumen itu.

Perbaikan celah tidak menunggu 7 hari. Lihat `SECURITY.md`.

## Kode

- TypeScript `strict`. Jangan menambah `any` pada API publik.
- Dependensi runtime tetap `canonicalize` dan `jose`, kecuali sebuah RFC mengubah batas itu. Jangan menambah pustaka validasi skema yang menarik bundle melewati 30 KB gzip.
- Jangan menulis kripto sendiri. Jangan memasukkan kunci privat.
- Kalimat Indonesia di spec bagian 10 normatif. `Kartu asli` hanya bila daftar cabut sudah ada dan kunci ada di `jwksTepercaya`. `jati cek` tanpa `--percaya` tidak menulis kalimat itu.
- Jangan mengembalikan berkas prompt (`kya-cursor-prompt*.md`, `jati-dod-tambahan.md`) ke pohon kerja.

## Tag

Rilis yang ditujukan ke publik memakai tag git yang ditandatangani (`git tag -s` atau tag SSH). `v0.1.0` adalah cap waktu 22 Oktober 2026 dan tidak ditandatangani. Jangan memindahkannya. `v0.1.1` ditandatangani dengan kunci SSH. GitHub menandai Verified hanya setelah kunci publik terdaftar sebagai kunci penanda; langkahnya ada di `docs/akun-github.md`. Penerbitan npm memakai secret `NPM_TOKEN`; langkah yang sama di berkas itu.
