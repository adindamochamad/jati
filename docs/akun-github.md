# Langkah di akun GitHub dan npm

Diperbarui 22 Oktober 2026. Langkah ini tidak bisa diselesaikan dari CI; jalankan di terminal lokal Anda.

## Tag Verified (SSH signing key)

Tag `v0.1.1` sudah ditandatangani dengan `~/.ssh/id_ed25519`. GitHub menandai **Verified** hanya jika kunci publik yang sama terdaftar sebagai kunci penanda, bukan kunci SSH login biasa.

1. Perbarui token `gh` dengan lingkup penanda:

   ```bash
   gh auth refresh -h github.com -s admin:ssh_signing_key
   ```

2. Daftarkan kunci publik yang sama dengan yang menandatangani tag:

   ```bash
   gh api -X POST user/ssh_signing_keys \
     -f title='jati-signing' \
     -f key="$(cat ~/.ssh/id_ed25519.pub)"
   ```

3. Buka https://github.com/adindamochamad/jati/releases/tag/v0.1.1 dan pastikan tag bertanda Verified.

Jangan memindah tag `v0.1.0`. Jangan menulis `git config` permanen untuk penandaan.

## npm (`NPM_TOKEN`)

Registry masih 404 sampai secret terisi dan workflow rilis berhasil menerbitkan.

1. Buat **Granular Access Token** di https://www.npmjs.com/settings/adindamochamad/tokens/granular-access-tokens/new dengan izin **Read and write**, **All packages**, dan **centang Bypass 2FA** (wajib untuk GitHub Actions; tanpa itu publish gagal 403).
2. Isi secret repositori (stdin, jangan cetak token):

   ```bash
   gh secret set NPM_TOKEN --repo adindamochamad/jati
   ```

3. Jalankan ulang workflow rilis untuk `v0.1.1`:

   ```bash
   gh run rerun 39718111058 --repo adindamochamad/jati
   gh run watch 39718111058 --repo adindamochamad/jati --exit-status
   ```

4. Pastikan registry menjawab 200:

   ```bash
   curl -sS -o /dev/null -w '%{http_code}\n' https://registry.npmjs.org/@adindamochamad%2Fjati/0.1.1
   ```

Baru setelah itu perbarui README bahwa paket terbit. Token lama di `~/.npmrc` yang mengembalikan HTTP 401 tidak dipakai.
