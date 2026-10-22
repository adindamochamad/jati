# Jati

**Usulan terbuka komunitas. Bukan regulasi. Bukan standar resmi Komdigi.**

Jati: KTP untuk agen AI. Format terbuka berbahasa Indonesia untuk tahu siapa pemilik agen, apa izinnya, dan siapa yang tanggung jawab.

Satu kartu menjawab enam hal: pemilik, izin, batas belanja dalam rupiah, penanggung jawab, masa berlaku, dan status pencabutan. Kartu ditandatangani Ed25519.

Tanda tangan membuktikan siapa penerbit dan field apa yang ia tulis. Tanda tangan tidak membuktikan agennya aman.

[English](README.en.md)

## Cek kartu contoh

Dari akar repositori:

```bash
pnpm install
pnpm verifikasi
```

Perintah itu membaca [fixtures/valid.json](fixtures/valid.json) dan kunci publik [fixtures/penerbit.public.jwks.json](fixtures/penerbit.public.jwks.json), lalu menulis satu kalimat. Pada 21 Oktober 2026 hasilnya:

```text
Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.
```

Tidak ada kartu yang dikirim ke jaringan. Berkas JWKS yang Anda sebut diperlakukan sebagai kunci yang Anda percayai.

Perintah ini memeriksa bentuk, tanda tangan, dan masa berlaku menurut jam mesin Anda. Kartu contoh berlaku sejak 21 Oktober 2026 pukul 00:00 WIB sampai akhir 31 Desember 2026. Sesudah itu kalimat yang benar adalah `Kartu kedaluwarsa.` Untuk mengunci waktu saat uji:

```bash
pnpm verifikasi -- --sekarang 2026-10-21T12:00:00+07:00
```

Ubah satu karakter pada salinan kartu, lalu jalankan perintah yang sama. Hasilnya: `Kartu sudah diubah.`

Kunci yang cocok tetapi tidak dipercaya:

```bash
pnpm verifikasi -- --ditemukan --sekarang 2026-10-21T12:00:00+07:00
```

Hasilnya: `Tanda tangan cocok, penerbit belum dikenal.` Kode keluarnya 1.

Perintah itu juga membaca [fixtures/cabut.json](fixtures/cabut.json). Id contoh tidak ada di daftar itu, jadi kalimat sukses berarti pencabutan ikut diperiksa. Tanpa daftar, hasilnya bukan kartu asli:

```bash
pnpm verifikasi -- --tanpa-cabut --sekarang 2026-10-21T12:00:00+07:00
```

Hasilnya: `Tidak pasti. Pencabutan belum bisa dicek.`

Perintah ini tidak membuka jaringan dan tidak mengirim jumlah, jadi batas belanja tidak ikut diperiksa. Jumlah yang sudah lebih besar dari batas harian ditolak tanpa pemakaian hari ini. Sisa batas harian hanya bisa diperiksa bila pemanggil mengirim pemakaian hari ini. Lihat [spec/kya-v0.1.md](spec/kya-v0.1.md).

## Isi repositori

- [spec/kya-v0.1.md](spec/kya-v0.1.md) dan [spec/kya-v0.1.en.md](spec/kya-v0.1.en.md), plus [skema JSON](spec/schema/jati-0.1.json) dan [vektor uji](spec/vectors/v0.1.json)
- [packages/jati](packages/jati) mengekspor `buatKartu`, `tandatangani`, `verifikasi`, `cekIzin`, `cekPencabutan`, dan `daftarDariBerkas`, plus alias Inggris `createCard`, `sign`, `verify`, `checkPermission`, `checkRevocation`, dan `revocationIdsFromFile`
- [fixtures/valid.json](fixtures/valid.json) dan [fixtures/cabut.json](fixtures/cabut.json)
- [scripts/verifikasi.ts](scripts/verifikasi.ts), perintah di atas
- [apps/cek](apps/cek), halaman cek di peramban
- [examples](examples), cuplikan Node, Python, dan middleware

## CLI

Butuh Node.js 22.18 atau lebih baru. Dari direktori kosong:

```bash
pnpm exec jati kunci-baru
pnpm exec jati terbit --pemilik "PT Contoh" --limit 500000
pnpm exec jati cek kartu.json
```

`kunci-baru` menulis `penerbit.private.jwk.json` dan `penerbit.public.jwks.json`. `terbit` menulis `kartu.json`, `agen.private.jwk.json`, dan `cabut.json` kosong bila berkas itu belum ada. `cek` tidak membaca kunci privat agen. Menyalin `kartu.json` cukup untuk mendapat kalimat yang sama. `cek` tanpa `cabut.json` menulis `Tidak pasti. Pencabutan belum bisa dicek.` Berkas cabut tanpa `jati` `"0.1"` ditolak. Setelah paket diterbitkan, perintah yang sama berjalan lewat `npx @adindamochamad/jati`. Paket itu belum diterbitkan.

## Halaman cek

```bash
pnpm cek
```

Buka alamat yang tercetak. Halaman memakai aset lokal, mengambil daftar cabut hanya dari origin yang sama, dan bisa dipakai luring setelah sekali dibuka. Saat luring, atau bila berkas cabut tidak memuat `jati` `"0.1"`, pencabutan berbunyi belum bisa dicek. Masukkan kartu dengan menempel JSON, mengunggah berkas, atau memindai QR. Jumlah dan pemakaian hari ini opsional. Kosong berarti batas belanja tidak diperiksa. Kalimat sukses bukan bukti pemilik nyata atau agen aman.

## Cuplikan

Node, dari akar repositori: `node --experimental-strip-types examples/node/cek.ts`

Python, setelah `cryptography` terpasang:

```bash
python3 examples/python/cek.py fixtures/valid.json fixtures/penerbit.public.jwks.json
```

Cuplikan Python memeriksa tanda tangan dan masa berlaku. Kalimatnya bukan "Kartu asli". Kartu di luar masa berlaku keluar dengan status 1. Waktu uji memakai env `JATI_SEKARANG`.

Middleware Express/Fastify ada di [examples/middleware/express.ts](examples/middleware/express.ts).

## Lima kasus lokal

```bash
pnpm demo
```

Itu menolak kartu kosong, jumlah di atas batas, kartu dicabut, dan kartu kedaluwarsa, lalu menerima satu kartu yang lolos. Ini bukan demo AgentPay. Tautan dan demo pembayaran tetap ditahan selama berkas lingkungan produksi AgentPay masih ada di cabang utamanya.

## Pustaka

| Spec | Pustaka |
|---|---|
| 0.1, 21 Oktober 2026 | 0.1.0, belum terbit ke npm |

Diuji pada 21 Oktober 2026 dengan `canonicalize` 5.1.0, `jose` 6.2.13, dan Node.js 22.18 atau lebih baru. `canonicalize` mengerjakan RFC 8785. `jose` memverifikasi JWS EdDSA; v0.1 tidak menulis kripto sendiri. Skema tetap di [spec/schema/jati-0.1.json](spec/schema/jati-0.1.json) dan diperiksa oleh kode pustaka, tanpa Ajv di runtime, supaya bundle peramban tetap di bawah 30 KB gzip. Ajv hanya dipakai di pemeriksaan skema pada CI. `pnpm ukuran` mencetak angkanya dan gagal bila batas itu terlewati. Pada 21 Oktober 2026 hasilnya 9859 byte gzip. Vektor kanonisasi RFC 8785 bagian 3.2.4 ada di tes. Kompatibilitas W3C VC 2.0 tidak diklaim. Contoh bentuk VC di spec bagian 13 non-normatif.

```bash
pnpm test
```

## Pembanding

Jati tidak mengklaim sebagai format KYA pertama di dunia. Pencarian 21 Oktober 2026 tidak menemukan format kartu terbuka berbahasa Indonesia. Itu hasil pencarian, bukan bukti yang lain tidak ada.

- [KYA-OS](https://github.com/decentralized-identity/kya-os-mcp/blob/main/SPEC.md)
- [KYA Manifest](https://open-kya.github.io/kya-standard/spec/index.html)
- [draft IETF Skyfire KYAPay](https://datatracker.ietf.org/doc/html/draft-skyfire-oauth-kyapay-token) (2 Oktober 2026)
- [profil knowyouragent.ch](https://knowyouragent.ch/en/standard/verification-profile)
- [W3C VC 2.0](https://www.w3.org/TR/vc-data-model-2.0/)

Pernyataan KYA yang dirujuk ada di [siaran pers Komdigi, 15 Oktober 2026](https://portal.komdigi.go.id/kanal-publik/berita-kini/10603).

## Kunci

`pnpm terbitkan-contoh` menulis ulang kartu contoh dengan kunci di `keys/`. Direktori itu diabaikan git. Jangan menyalin kunci privat ke berkas lain. JWKS yang di-commit hanya memuat komponen publik `x`.

URL `https://adindamochamad.github.io/jati/.well-known/jati.json` adalah alamat yang direncanakan. Berkasnya belum dipasang di GitHub Pages.

## Lisensi

Perangkat lunak: [MIT](LICENSE), © 2026 Adinda Panca Mochamad.

Spesifikasi di `spec/`: [CC-BY 4.0](spec/LICENSE).

## Dokumen

[CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [SECURITY.md](SECURITY.md), [CHANGELOG.md](CHANGELOG.md), [model ancaman](docs/threat-model.md), [keputusan v0.1](docs/keputusan-v0.1.md).

## Privasi

[PRIVACY.md](PRIVACY.md). Tidak ada akun, tidak ada unggahan, contoh fiktif.
