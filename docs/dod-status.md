# Status Definition of Done

Diperbarui 22 Oktober 2026 (WIB). File ini mencatat bukti yang ada, dan hal yang belum boleh dianggap selesai.

## Yang sudah ada buktinya

Enam keputusan v0.1 tertulis di `spec/kya-v0.1.md`, `spec/kya-v0.1.en.md`, dan `docs/keputusan-v0.1.md`.

- "Kartu asli" hanya muncul kalau daftar pencabutan benar-benar diberikan, termasuk daftar kosong. Kalau daftar tidak ada atau gagal diambil, hasilnya `tidak_pasti` dengan kalimat `Tidak pasti. Pencabutan belum bisa dicek.` Daftar kosong tidak menggantikan unduhan yang gagal.
- Dependensi runtime hanya `canonicalize` 5.1.0 dan `jose` 6.2.13. Tidak ada Ajv di runtime. Skema JSON tetap kontrak; pemeriksa kecil di pustaka yang menjalankannya. Ajv 8.20.0 hanya memeriksa vektor di CI.
- Toleransi jam nol. Batas tanggal inklusif. Satu milidetik di luar jendela gagal.
- Bagian 13 spec memetakan kartu ke bentuk VC dan memberi satu contoh JSON. Bagian itu non-normatif, belum diuji verifier VC, dan bukan klaim kompatibilitas.
- Spec bagian 7 memisahkan keutuhan, pengenalan penerbit, dan ikatan identitas. `jati cek` tanpa `--percaya` menulis `Tanda tangan cocok, penerbit belum dikenal.` termasuk untuk nama `PT Uji`. `Kartu asli` membutuhkan `--percaya` atau `jwksTepercaya`. Nama pemilik tetap klaim.

`pnpm test` pada 21 Oktober 2026: 46 tes lulus, termasuk vektor `spec/vectors/v0.1.json` dan berkas terbit. Typecheck root dan `apps/cek` bersih. Build menghasilkan ESM, `.d.ts`, dan bundel CJS. `pnpm ukuran` mengukur bundel peramban 9859 byte gzip, di bawah 30 KB, dengan 2 dependensi runtime. Skema kanonis ada di `spec/schema/jati-0.1.json`. Pemeriksaan skema di CI meloloskan lima kartu vektor.

Engines tetap `>=22.18`. `canonicalize` 5 menolak Node yang lebih lama, jadi baris DoD Node ≥20 tidak diturunkan.

CLI lokal `kunci-baru`, `terbit`, dan `cek` ada di `packages/jati/bin/jati.ts`. Tes CLI membuat kunci di direktori sementara, memastikan JWKS publik tidak berisi `d`, memastikan `cek` tanpa `--percaya` keluar penerbit belum dikenal, dan memastikan `cek --percaya` tanpa daftar keluar tidak pasti. Paket belum dipublikasikan, jadi `npx @adindamochamad/jati` belum bisa dijalankan orang lain.

Cuplikan Python di `examples/python/cek.py` memeriksa JWS EdDSA dan masa berlaku, lalu keluar status 1 di luar jendela itu. Kalimatnya bukan "Kartu asli". Middleware `tolakTanpaKartu` di `examples/middleware/express.ts` menerima jumlah opsional. Tanpa jumlah, `next()` bukan izin belanja. Fastify bisa memanggil fungsi yang sama. `pnpm demo` menjalankan lima kasus pustaka: tanpa kartu, lewat limit, dicabut, kedaluwarsa, dan diterima. Itu bukan demo AgentPay.

Halaman `pnpm cek` di `http://127.0.0.1:4173` diperiksa di peramban pada 21 Oktober 2026:

- Isi contoh, dengan daftar fixture, menghasilkan "Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026."
- JSON diubah menghasilkan kalimat ubah. Unggah berkas JSON mengisi kartu. QR contoh terbaca BarcodeDetector dan lolos cek.
- Semua permintaan halaman hanya ke `127.0.0.1:4173`. CSP memakai `connect-src 'self'` dan tidak memakai `unsafe-inline`.
- Saat jaringan dimatikan, hasilnya "Tidak pasti. Pencabutan belum bisa dicek." Service worker menyimpan cangkang halaman dan tidak menyimpan `cabut.json`.
- Tombol bahasa mengganti label, tautan lompat, dan kalimat hasil yang sudah tampil, termasuk placeholder kosong.
- Pada lebar 360px tidak ada scroll horizontal. Teks dasar dan tombol 18px. Tinggi tombol minimal 44px. Kontras yang diukur terhadap latar yang benar-benar tergambar: merek 7.15, pengantar 8.48, kalimat 15.24, tombol 17.23.

Dokumen tata kelola ada: `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `PRIVACY.md`, `docs/kepercayaan.md`, `docs/threat-model.md`, `docs/kunci.md`, `rfcs/0000-template.md`, dan template issue. Pengelola saat ini satu orang. RFC punya jendela diskusi 7 hari bila ada usul, dan pengecualian perbaikan celah. Dependabot memantau npm dan GitHub Actions. Lisensi kode MIT dan spec CC-BY 4.0 tertulis di README. Berkas prompt penyusunan draf sudah dihapus dari pohon kerja; commit awal tetap memuatnya.

## Yang belum, dan tidak boleh dicentang

- Tag `v0.1.0` dan GitHub Release adalah cap waktu publik 22 Oktober 2026. Tag ditandatangani hanya bila mesin ini sudah punya kunci penanda. DOI belum ada.
- Cakupan baris dan cabang `src/` diukur 22 Oktober 2026: 96,52% baris dan 91,54% cabang, di atas ambang 90%. `pnpm --filter @adindamochamad/jati test` gagal bila ambang itu turun. Fuzz belum ada.
- Paket belum diunggah ke npm selama `NPM_TOKEN` belum ada di secret repositori. `require()` memakai bundel karena `jose` 6 dan `canonicalize` 5 hanya ESM. Workflow `rilis` membangun `dist` lalu menerbitkan dengan provenance bila token itu ada.
- `jose` dipakai sebagai pustaka EdDSA. Laporan auditnya belum ditautkan. Kripto tidak ditulis sendiri.
- Quickstart belum diukur stopwatch oleh orang baru. `docs/uji-adopsi.md` masih tabel kosong.
- Tes Playwright yang memantau jaringan belum ada. Pemeriksaan jaringan di atas adalah sesi peramban manual.
- Lighthouse dan axe belum dijalankan. Angka aksesibilitas tidak diklaim. Tes tiga detik ke tiga orang non-teknis belum dilakukan.
- GitHub Pages dipasang lewat workflow `halaman` dari `apps/cek/dist`, termasuk `.well-known/jati.json`. Discussions dan secret scanning GitHub belum dikonfirmasi. Gitleaks ada di CI.
- Workflow npm provenance ada dan belum pernah dijalankan. Jangan menganggap paket sudah terbit.
- `.env.production` AgentPay sudah tidak ada di ujung `main` sejak commit `a764553` (22 Oktober 2026). Riwayat commit sebelumnya dan fork `PascalBurume/AgentPay` masih memuat blob yang sama. Force-push belum dilakukan. Jati tidak menautkan AgentPay dan tidak menyediakan demo pembayaran. Lihat `docs/kepercayaan.md`.
- `docs/implementasi.md` tidak mendaftar pengguna. Lencana di `docs/lencana.md` belum diterbitkan dan bukan sertifikasi.
- Video demo belum ada.
- Tes akhir dua orang pada dua sistem operasi belum dilakukan.
