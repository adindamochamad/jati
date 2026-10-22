# Kepercayaan

Diperbarui 22 Oktober 2026.

Jati adalah usulan profil KYA untuk Indonesia. Bukan standar. Belum ada penerbit atau pemeriksa di luar repositori ini.

## Apa yang dibuktikan kartu

Tanda tangan menjawab: kunci ini menulis field ini. `Kartu asli` menambah: pemeriksa sudah memasukkan kunci itu ke daftar tepercaya, masa berlaku cocok, dan id tidak ada di daftar cabut yang diberikan.

Nama pemilik adalah klaim yang ditandatangani. Siapa pun dapat membuat kunci, menulis `PT Uji`, dan mendapat tanda tangan yang sah. CLI rujukan tidak menulis `Kartu asli` untuk kartu mandiri kecuali pemanggil memakai `--percaya`. Itu pernyataan kepercayaan pada kunci, bukan KTP.

Tanpa penerbit yang diikat di luar kartu (PSrE, BSrE, marketplace, bank, atau meja penerbitan pemeriksa), format ini adalah label klaim. Uraian normatif ada di spec bagian 7.

## AgentPay

Repositori saudara [AgentPay](https://github.com/adindamochamad/AgentPay) memuat `.env.production` di cabang `main` saat dicek 21 Oktober 2026 dan lagi 22 Oktober 2026 (750 byte). Jati tidak memakai rahasia dari repositori itu, tidak menautkannya sebagai produk, dan tidak menyediakan demo pembayaran.

Tautan dan demo tetap ditahan sampai ketiga hal ini ada buktinya:

1. Berkas itu tidak ada di cabang default.
2. Riwayat git tidak lagi memuat isinya, atau ada pengumuman bahwa riwayat sudah dibersihkan.
3. Kunci, sandi, dan rahasia yang pernah ada di berkas itu sudah diganti, dengan catatan rotasi.

Jangan menganggap menahan tautan sama dengan menutup kebocoran. Penutupan itu kerja di repositori AgentPay.

## Berkas prompt

Commit awal repositori ini memuat berkas prompt yang dipakai saat menyusun draf. Berkas itu sudah dihapus dari pohon kerja. Riwayat commit awal tetap memuatnya. Jangan menyalin berkas prompt ke pohon kerja lagi.
