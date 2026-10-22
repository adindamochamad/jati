# Kunci

Kunci privat penerbit dan kunci privat agen tidak boleh masuk repositori, riwayat git, JWKS publik, atau halaman cek.

- `pnpm exec jati kunci-baru` menulis `penerbit.private.jwk.json` dengan mode terbatas dan JWKS yang hanya memuat komponen publik.
- `terbit` menulis `agen.private.jwk.json`. Berkas `*.private.jwk.json` diabaikan git. `cek` tidak membaca berkas itu. Menyalin `kartu.json` cukup untuk mendapat kalimat yang sama.
- JWKS yang di-commit, termasuk `fixtures/penerbit.public.jwks.json`, hanya memuat `x`.
- Direktori `keys/` untuk kartu contoh juga diabaikan git. `pnpm terbitkan-contoh` menulis ulang contoh di sana.

Rotasi: buat `kid` baru, terbitkan JWKS baru, berhenti memakai kunci lama, dan cabut kartu yang harus mati dengan menaruh `id`-nya di daftar cabut. Daftar v0.1 tidak ditandatangani. Pemeriksa mempercayai lokasi daftar, bukan isi yang tidak ia ambil sendiri.

Jangan mengganti kegagalan mengunduh daftar dengan daftar kosong. Daftar kosong berarti sudah diperiksa dan tidak ada yang dicabut.
