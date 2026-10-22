# Kepercayaan

Diperbarui 22 Oktober 2026.

Jati adalah usulan profil KYA untuk Indonesia. Bukan standar. Belum ada penerbit atau pemeriksa di luar repositori ini.

## Apa yang dibuktikan kartu

Tanda tangan menjawab: kunci ini menulis field ini. `Kartu asli` menambah: pemeriksa sudah memasukkan kunci itu ke daftar tepercaya, masa berlaku cocok, dan id tidak ada di daftar cabut yang diberikan.

Nama pemilik adalah klaim yang ditandatangani. Siapa pun dapat membuat kunci, menulis `PT Uji`, dan mendapat tanda tangan yang sah. CLI rujukan tidak menulis `Kartu asli` untuk kartu mandiri kecuali pemanggil memakai `--percaya`. Itu pernyataan kepercayaan pada kunci, bukan KTP.

Tanpa penerbit yang diikat di luar kartu (PSrE, BSrE, marketplace, bank, atau meja penerbitan pemeriksa), format ini adalah label klaim. Uraian normatif ada di spec bagian 7.

## AgentPay

Pada 22 Oktober 2026, berkas `.env.production` dihapus dari ujung cabang `main` repositori [AgentPay](https://github.com/adindamochamad/AgentPay), commit `a764553`. Isi yang diperiksa adalah templat berkomentar: hostname-nya `host-intern` dan `redis-intern`, bukan layanan publik yang bisa dihubungi dari sini. Nama berkasnya tetap berbahaya, karena orang membaca itu sebagai rahasia produksi.

Pengunduhan dari ujung `main` sekarang gagal. Dua hal masih menyisakan berkas yang sama, 750 byte:

1. Riwayat git AgentPay, lewat commit sebelum `a764553`. Isi blob itu diperiksa lagi pada 22 Oktober 2026: 26 baris, semuanya komentar atau kosong. Tidak ada kunci asli, jadi riwayat tidak ditulis ulang dan tidak ada kunci yang diganti.
2. Fork publik [PascalBurume/AgentPay](https://github.com/PascalBurume/AgentPay) masih memuat blob yang sama. Pengelola Jati tidak bisa menghapus fork orang lain.

Jati tidak memakai rahasia dari repositori itu, tidak menautkannya sebagai produk, dan tidak menyediakan demo pembayaran. Tautan dan demo tetap ditahan sampai riwayat dan fork itu bersih. Menahan tautan bukan menutup salinan yang masih ada.

## Berkas prompt

Commit awal repositori ini memuat berkas prompt yang dipakai saat menyusun draf. Berkas itu sudah dihapus dari pohon kerja. Riwayat commit awal tetap memuatnya. Jangan menyalin berkas prompt ke pohon kerja lagi.
