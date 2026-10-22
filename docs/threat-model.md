# Model ancaman v0.1

Jati memeriksa apakah sebuah kartu utuh, masih dalam masa berlaku, dan ada atau tidak di daftar cabut yang diberikan pemeriksa. Jati tidak membuktikan bahwa agennya aman, dan tidak membuktikan bahwa pembawa kartu memegang kunci privat agen.

## Pemalsuan kartu

Penyerang mengubah field lalu memakai tanda tangan lama. Pemeriksa menghitung ulang kanonisasi RFC 8785 dan menolak bila byte payload tidak sama. Header selain persis `{"alg":"EdDSA","kid":"..."}` ditolak, termasuk `none`.

Yang tidak ditutup: menyalin kartu utuh. Menyalin bukan pemalsuan field. Bukti pegang kunci agen ada di luar v0.1. `cek` tidak membaca kunci privat agen, dan kalimat sukses tidak berubah karena berkas kunci itu ada.

## Kunci penerbit bocor

Siapa pun yang memegang `d` dapat menerbitkan kartu yang lolos tanda tangan. Kunci privat tidak boleh masuk repositori, riwayat git, JWKS publik, atau peramban. Rotasi: terbitkan JWKS baru dengan `kid` baru, berhenti menandatangani dengan kunci lama, dan masukkan id kartu lama ke daftar cabut bila kartu itu harus mati.

## Replay

Kartu v0.1 tidak punya nonce dan tidak mengikat transaksi. Kartu yang sama dapat ditunjukkan berkali-kali selama masa berlakunya. Pemeriksa yang membutuhkan sekali pakai harus menambah pengikat itu di luar kartu.

## Kartu dicabut, daftar tidak terambil

Daftar v0.1 tidak ditandatangani. Kepercayaan datang dari lokasi yang dipakai pemeriksa. Bila daftar gagal diambil, pustaka tidak boleh mengisi daftar kosong dan tidak boleh menulis `Kartu asli`. Hasil pada jalur sukses adalah `tidak_pasti`. Berkas tanpa `jati` persis `"0.1"` bukan daftar. Halaman dan CLI memakai pembaca yang sama, jadi berkas yang CLI tolak tidak membuat halaman menulis `Kartu asli`.

Halaman cek mengambil daftar hanya dari origin yang sama dan tidak menyimpannya di service worker. Saat luring, pengambilan gagal, jadi pencabutan belum bisa dicek.

## Downgrade versi

`jati` harus persis `"0.1"`. Nilai lain gagal bentuk. Pemeriksa tidak boleh menerima kartu tanpa field itu lalu menganggapnya versi yang lebih longgar. Aturan yang sama berlaku untuk berkas daftar cabut.

## Privasi pemilik

Kartu tidak rahasia. Nama pemilik, izin, batas, dan URL kontak ikut ditandatangani dan dapat disalin. Nama tampilan ditolak bila memuat karakter kontrol atau pemisah baris, supaya kalimat sukses tidak memuat baris kedua. Jangan menaruh NIK, nomor paspor, nomor telepon, atau alamat rumah. Halaman cek tidak mengunggah kartu. Pustaka tidak membuka jaringan. Jumlah yang sudah lebih besar dari batas harian ditolak tanpa riwayat. Sisa batas harian tetap membutuhkan pemakaian hari ini dari pemeriksa.
