# ✔️ Definition of Done Tambahan — Jati (standar tinggi, siap dipakai orang lain)

> **Cara pakai:** Tempel file ini ke Cursor **bersama** `kya-cursor-prompt.md`. Jati baru dianggap **selesai** kalau semua kotak di bawah tercentang **dan** ada buktinya (link, output perintah, atau screenshot). Kalau satu poin tidak bisa dipenuhi, tulis alasannya di `docs/dod-status.md`. Jangan dicentang diam-diam.
> Angka bertanda **[target]** adalah ambang yang kita pilih sendiri, bukan standar resmi. **[tebakan]** berarti perkiraan.
> Disiapkan: 21 Okt 2026 (WIB).

---

## 1. Kualitas Spec
- [ ] Spec punya versi jelas (`spec/kya-v0.1.md`, lalu v0.2, dan seterusnya). Setiap versi punya **tanggal** dan **tag git**.
- [ ] Spec tersedia dalam ID dan EN. Isinya sama (dicek dengan daftar bagian yang identik).
- [ ] Bagian wajib ada: Abstrak, Istilah, Model Data, Tanda Tangan, Kedaluwarsa, Pencabutan, Keamanan, Privasi, Pemetaan Interop, Riwayat Perubahan.
- [ ] Kata MUST/SHOULD/MAY (WAJIB/SEBAIKNYA/BOLEH) dipakai konsisten, mengikuti gaya RFC 2119.
- [ ] Ada **JSON Schema** (`spec/schema/jati-0.1.json`), dan semua contoh kartu lolos validasi schema di CI.
- [ ] Minimal 5 **contoh kartu** di spec: valid, diubah, kedaluwarsa, dicabut, lewat limit.
- [ ] Ada **test vectors** (`spec/vectors/`): kunci uji, kartu, tanda tangan, dan hasil yang diharapkan. Implementasi lain bisa mengujinya.
- [ ] **Kedaluwarsa** didefinisikan jelas: format waktu (ISO 8601 dengan zona), dan apakah ada toleransi jam (*clock skew*) atau tidak.
- [ ] **Pencabutan** didefinisikan: format daftar cabut (JSON statis; target v1 Bitstring Status List W3C), lokasinya, dan perilaku verifier kalau daftar tidak bisa diambil (default: hasil "tidak pasti", bukan "valid").
- [ ] Ada tabel **pemetaan ke W3C VC 2.0** (field Jati ↔ `issuer`, `credentialSubject`, `validUntil`, `credentialStatus`, dan lainnya), plus satu contoh kartu yang dikonversi ke bentuk VC 2.0.
- [ ] Ada catatan hubungan dengan AP2, Visa TAP, dan ERC-8004. Isinya "bisa dirujuk", **tanpa** klaim kompatibel kalau belum dites.
- [ ] Tertulis jelas: "**Usulan terbuka komunitas, bukan regulasi resmi.**"

## 2. Kualitas Library (`@adindamochamad/jati`)
- [ ] TypeScript `strict: true`, tanpa `any` di API publik (dicek dengan lint rule).
- [ ] Dependency runtime **minimal**: target ≤2 [target], misalnya `@noble/ed25519` atau `@noble/curves`, dan opsional `jose`. Setiap dependency punya alasan tertulis di README.
- [ ] Ed25519 hanya lewat **library yang sudah diaudit**. `@noble/*` pernah diaudit; Cursor wajib cek dan tautkan laporan auditnya. Tidak boleh menulis kripto sendiri.
- [ ] Rilis **ESM + CJS** + file tipe `.d.ts`. Bisa dipakai di Node ≥20 dan browser modern (dites di CI).
- [ ] API bertipe dan kecil: `buatKartu`, `tandatangani`, `verifikasi`, `cekIzin`, `cekPencabutan`. Ada alias Inggris (`createCard`, `sign`, `verify`, …).
- [ ] `verifikasi()` mengembalikan objek hasil, bukan cuma boolean: `{ status, alasan, kode }`.
- [ ] Coverage test **≥90%** baris dan cabang (laporan di CI).
- [ ] **Semua test vectors** dari spec lolos.
- [ ] Ada **negative test**: tanda tangan salah, field hilang, JSON rusak, tanggal aneh, angka limit negatif, kunci salah panjang.
- [ ] Ada **fuzz/property test** (misalnya `fast-check`) minimal 1.000 input acak tanpa crash [target].
- [ ] Ukuran bundle tercatat, target <30 KB gzip [target].
- [ ] Tidak ada secret di repo: gitleaks hijau di CI dan di seluruh riwayat git.

## 3. Kemudahan Adopsi (DX)
- [ ] **Quickstart <5 menit**: dari `npm install` sampai kartu pertama terverifikasi. Diukur dengan stopwatch oleh 1 orang baru [target].
- [ ] CLI satu baris:
  - `npx @adindamochamad/jati kunci-baru`
  - `npx @adindamochamad/jati terbit --pemilik "PT Contoh" --limit 500000`
  - `npx @adindamochamad/jati cek kartu.json`
- [ ] Snippet siap salin untuk: **Node**, **browser** (`<script type="module">`), dan **bahasa lain via JSON + JWS standar** (contoh Python dengan `pynacl` atau `cryptography`, dites minimal sekali).
- [ ] Pesan error **dua bahasa (ID + EN)**, dengan kode tetap (misalnya `JATI_EXPIRED`), plus saran perbaikan.
- [ ] Ada folder `examples/` berisi kartu contoh yang bisa langsung dicek.
- [ ] Ada contoh middleware **Express/Fastify** untuk "tolak agen tanpa kartu" (≤20 baris).

## 4. Halaman Cek Kartu Agen
- [ ] **100% di browser**: tidak ada request ke server selain aset halaman dan (opsional) daftar cabut. Dibuktikan dengan CSP + test Playwright yang memantau network.
- [ ] **Bisa offline** setelah dibuka sekali (service worker). Kalau offline, status pencabutan ditulis "belum bisa dicek".
- [ ] Aksesibilitas **WCAG 2.2 AA**: skor Lighthouse a11y ≥95 [target], dan axe tanpa error serius.
- [ ] Nyaman di HP: dites di layar 360px, teks dasar ≥18px.
- [ ] Bahasa Indonesia awam, dengan opsi EN.
- [ ] Hasil dijelaskan dalam **satu kalimat biasa** dulu, misalnya "Kartu asli. Pemilik: PT Contoh Jaya. Berlaku sampai 31 Des 2026." Detail teknis disembunyikan di bawah.
- [ ] Bisa menerima tiga cara masuk: tempel JSON, unggah file, dan scan QR.
- [ ] Lolos **tes 3 detik** ke 3 orang non-teknis.

## 5. Dokumen
- [ ] README ID + EN: apa ini, kenapa, quickstart, contoh, batasan, link spec.
- [ ] `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant), `SECURITY.md` (cara lapor celah + target waktu respons [target]), `CHANGELOG.md` (format Keep a Changelog).
- [ ] Lisensi: kode **MIT atau Apache-2.0** (pilih satu; Apache-2.0 punya klausul paten), spec **CC-BY 4.0**. Keduanya tertulis di README.
- [ ] `PRIVACY.md` ID/EN.
- [ ] Situs docs (GitHub Pages) dengan halaman: Spec, Quickstart, API, FAQ, Implementasi.

## 6. Rilis
- [ ] Versi **semver**. Spec dan library punya nomor versi masing-masing, dan tabel kecocokannya tertulis.
- [ ] Publikasi npm dengan **provenance** (dari GitHub Actions, bukan dari laptop).
- [ ] **Tag git ditandatangani** (GPG atau SSH), terlihat "Verified" di GitHub.
- [ ] CI GitHub Actions: lint, typecheck, test, coverage, schema check, gitleaks, build, dan e2e halaman cek. Semuanya wajib hijau sebelum merge.
- [ ] **Rilis bertanggal untuk cap waktu penggagas**: GitHub Release `v0.1.0-spec` + (opsional) arsip Zenodo DOI atau Software Heritage. Linknya dicatat di README bagian "Riwayat".

## 7. Keamanan
- [ ] Halaman **model ancaman** (`docs/threat-model.md`) membahas: pemalsuan kartu, kunci penerbit bocor, replay, kartu dicabut tapi daftar tidak terambil, *downgrade* versi, dan privasi data pemilik.
- [ ] Panduan pengelolaan kunci: kunci privat tidak pernah di repo atau di browser publik, cara rotasi kunci, dan cara mencabut.
- [ ] Secret scanning GitHub aktif + gitleaks di CI.
- [ ] Dependabot atau Renovate aktif.
- [ ] ⚠️ **`.env.production` di repo AgentPay sudah dihapus dari riwayat git, dan semua kunci di dalamnya sudah diganti, SEBELUM Jati menautkan ke AgentPay.** Buktinya: commit + konfirmasi rotasi kunci.

## 8. Tata Kelola & Adopsi
- [ ] Proses **RFC** untuk perubahan spec (`rfcs/0000-template.md`): usul → diskusi minimal 7 hari [target] → keputusan tercatat.
- [ ] Template issue: bug, usul fitur, usul perubahan spec, laporan implementasi.
- [ ] Halaman **"Implementasi"** yang mendaftar siapa saja yang memakai Jati. Awalnya hanya AgentPay demo; jangan dikarang.
- [ ] Badge **"Jati-verified"** + syarat jelas untuk memakainya (lolos semua test vectors). Badge ini **bukan sertifikasi resmi**.
- [ ] GitHub Discussions dibuka untuk tanya-jawab.

## 9. Kualitas Demo AgentPay
- [ ] Demo bisa dijalankan dengan satu perintah (`docker compose up` atau `pnpm demo`) dari README.
- [ ] Empat kasus **ditolak** dengan alasan jelas: **tanpa kartu**, **lewat limit**, **dicabut**, **kedaluwarsa**.
- [ ] Satu kasus **diterima**: kartu valid dan jumlah di bawah limit.
- [ ] Ada test e2e otomatis untuk kelima kasus di CI.
- [ ] Video demo ≤3 menit.

## 10. 🧪 Tes Akhir "Siap Dipakai Orang Lain"
- [ ] Satu **orang baru** (belum pernah melihat proyek; dev tingkat menengah) diberi **hanya link README**.
- [ ] Tanpa bantuan Adinda, dia berhasil:
  1. Memasang library.
  2. Membuat kunci.
  3. Menerbitkan kartu.
  4. Memverifikasi kartu di kode dan di halaman cek.
  5. Mencabut kartu, lalu melihat hasilnya "dicabut".
- [ ] Waktu total dicatat. Target langkah 1–4 kurang dari 5 menit [target], semua langkah kurang dari 15 menit [target].
- [ ] Semua kebingungan dicatat di `docs/uji-adopsi.md`, lalu README diperbaiki dan tes diulang sampai lancar.
- [ ] Ulangi dengan 1 orang lagi yang memakai OS berbeda (Windows/macOS/Linux).

---

**Aturan jujur:** jangan centang tanpa bukti. Jangan menulis pengguna, angka unduhan, atau dukungan instansi yang tidak ada.
