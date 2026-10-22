# Privasi

**Usulan profil KYA untuk Indonesia. Bukan regulasi. Bukan standar resmi Komdigi.**

Jati v0.1 tidak punya akun, server, atau unggahan.

- Pustaka `verifikasi` dan perintah `pnpm verifikasi` membaca berkas di mesin Anda. Keduanya tidak membuka koneksi jaringan.
- Halaman cek berjalan di peramban. Kartu dan gambar kamera tidak diunggah. Daftar pencabutan diambil hanya dari origin halaman yang sama. Service worker menyimpan kulit halaman, bukan daftar pencabutan.
- Kartu contoh memakai nama fiktif, PT Contoh Jaya. Jangan menaruh NIK, nomor paspor, nomor telepon, atau alamat rumah pada kartu.
- Kontak pada kartu adalah URL `https`, bukan data kontak langsung.
- Kunci privat tidak disimpan di repositori. Direktori `keys/` diabaikan git.

# Privacy

**A proposed KYA profile for Indonesia. Not a regulation. Not an official Komdigi standard.**

Jati v0.1 has no accounts, no server, and no uploads.

- The `verifikasi` library and the `pnpm verifikasi` command read files on your machine. Neither opens a network connection.
- The check page runs in the browser. The card and camera frames are not uploaded. The revocation list is fetched only from the page's own origin. The service worker stores the page shell, not the revocation list.
- The example card uses a fictional name, PT Contoh Jaya. Do not put a national ID number, passport number, phone number, or home address on a card.
- A contact on the card is an `https` URL, not a direct contact detail.
- Private keys are not stored in the repository. The `keys/` directory is gitignored.
