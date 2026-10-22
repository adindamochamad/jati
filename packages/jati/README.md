# @adindamochamad/jati

Pustaka kartu Jati v0.1. Usulan profil KYA untuk Indonesia, bukan regulasi.

```bash
pnpm exec jati kunci-baru
pnpm exec jati terbit --pemilik "PT Uji" --limit 500000
pnpm exec jati cek kartu.json
```

Perintah ketiga menulis `Tanda tangan cocok, penerbit belum dikenal.` `jati cek kartu.json --percaya` baru memakai kunci itu sebagai daftar tepercaya.

`verifikasi` mengembalikan kalimat, kode, dan status. `Kartu asli` hanya bila pemanggil mengisi `jwksTepercaya` dan daftar `dicabut`. Tanpa daftar, hasilnya `Tidak pasti. Pencabutan belum bisa dicek.` Kalimat sukses berarti kunci tepercaya menandatangani field itu, masa berlaku cocok, dan id tidak ada di daftar yang diberikan. Nama pemilik adalah klaim, bukan KTP.

Dependensi runtime:

- `canonicalize` 5.1.0, untuk kanonisasi RFC 8785.
- `jose` 6.2.13, untuk JWS EdDSA. Pustaka ini tidak menulis kripto sendiri.

Butuh Node.js 22.18 atau lebih baru. Paket belum diterbitkan ke npm.

Berkas yang diterbitkan nanti adalah JavaScript di `dist/`, bukan sumber `.ts`. `import` memakai ESM. `require` memakai bundel CJS karena `jose` 6 dan `canonicalize` 5 hanya menyediakan ESM. Perintah `jati` di paket terbit tidak membutuhkan `--experimental-strip-types`.
