# Keputusan v0.1

Tanggal: 21 Oktober 2026, dilengkapi 22 Oktober 2026. Hal-hal ini diputuskan supaya spec, pustaka, dan perintah tidak saling bertentangan.

## 1. Kalimat sukses dan daftar cabut

`Kartu asli` hanya sah bila pemeriksa sudah memegang daftar `dicabut`, termasuk daftar kosong. Daftar kosong berarti sudah diperiksa dan id itu tidak ada.

Bila daftar tidak diisi, atau pengambilan daftar gagal, jalur yang semestinya sukses menjadi `tidak_pasti` dengan kalimat `Tidak pasti. Pencabutan belum bisa dicek.` Kegagalan mengambil daftar tidak boleh diganti dengan daftar kosong.

Hasil negatif yang tidak membutuhkan daftar tetap dilaporkan: bentuk, perubahan, kunci hilang, masa berlaku, penerbit belum dikenal, dan tolak kebijakan. Hasil itu bukan pernyataan bahwa kartu tidak dicabut.

## 2. Ukuran dan dependensi

Dependensi runtime ada dua: `canonicalize` 5.1.0 untuk RFC 8785, dan `jose` 6.2.13 untuk JWS EdDSA. Pustaka tidak menulis kripto sendiri.

Ajv tidak dipakai. Skema JSON tetap berkas kontrak di `spec/schema/`, dan pemeriksa di pustaka mengikuti aturan berkas itu. Bundle peramban harus di bawah 30 KB gzip. `pnpm ukuran` gagal bila batas itu terlewati.

## 3. Toleransi jam

Tidak ada toleransi jam. Waktu yang diberi pemeriksa dipakai apa adanya. Kedua batas masa berlaku inklusif. Satu milidetik di luar batas gagal.

## 4. Contoh VC 2.0

Tabel dan satu contoh bentuk VC ada di spec bagian 13. Keduanya non-normatif, belum diuji dengan verifier VC, dan bukan klaim kompatibilitas.

## 5. RFC dan celah

Usul perubahan spec menunggu diskusi 7 hari. Perbaikan celah keamanan tidak menunggu jendela itu. Lihat `rfcs/0000-template.md` dan `SECURITY.md`. Pengelola saat ini satu orang. Jendela itu target bila ada diskusi, bukan dewan standar.

## 6. Kepercayaan penerbit

Kartu mandiri tidak menghasilkan `Kartu asli`. `jati cek` memakai `jwksDitemukan` kecuali `--percaya`. Spec memisahkan keutuhan, pengenalan penerbit, dan ikatan identitas. Tanpa penerbit yang diikat di luar kartu, Jati adalah format klaim, bukan sistem identitas. Lihat spec bagian 7 dan `docs/kepercayaan.md`.
