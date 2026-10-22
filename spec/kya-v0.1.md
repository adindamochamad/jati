# Kartu Jati v0.1

SPDX-License-Identifier: CC-BY-4.0

**Usulan terbuka komunitas. Bukan regulasi. Bukan standar resmi Komdigi.**

| | |
|---|---|
| Versi | 0.1 |
| Tanggal | 21 Oktober 2026 |
| Penyunting | Adinda Panca Mochamad |
| Bahasa normatif | Indonesia. [Terjemahan Inggris](kya-v0.1.en.md) mengikuti dokumen ini. |
| Lisensi | [CC-BY 4.0](LICENSE) |
| Skema | [schema/jati-0.1.json](schema/jati-0.1.json) |

Kata **HARUS**, **TIDAK BOLEH**, **SEBAIKNYA**, dan **BOLEH** dipakai seperti MUST, MUST NOT, SHOULD, dan MAY di RFC 2119.

## 1. Status dan abstrak

Jati adalah format kartu untuk agen AI. Satu kartu menjawab siapa pemilik agen, apa yang boleh dilakukan agen, berapa batas belanjanya dalam rupiah, siapa yang bertanggung jawab, sampai kapan kartu berlaku, dan di mana daftar pencabutannya berada.

Kartu ditandatangani Ed25519. Pemeriksa bisa membedakan kartu yang utuh dari kartu yang diubah, belum berlaku, kedaluwarsa, atau dicabut.

Tanda tangan membuktikan bahwa pemegang kunci penerbit menulis field-field itu. Tanda tangan tidak membuktikan agennya aman, tidak membuktikan pemegang kartu menguasai kunci agen, dan tidak membuat Jati menjadi aturan pemerintah.

Pada 15 Oktober 2026, Wakil Menteri Komunikasi dan Digital Nezar Patria berkata, dalam siaran pers Komdigi: "Bukan lagi KYC, Know Your Customer, tapi harus ada KYA, Know Your Agent." Siaran pers yang sama menulis bahwa penggunaan agen AI perlu diikuti pemahaman mengenai identitas, kepemilikan, dan batas kewenangannya, dan mengutip: "Masukan tersebut diperlukan untuk membantu mengidentifikasi risiko dan mendalami kebutuhan pengaturan teknis seiring perkembangan AI." Sumber: <https://portal.komdigi.go.id/kanal-publik/berita-kini/10603>. Jati memetakan tiga hal itu ke field kartu. Jati adalah masukan komunitas, bukan dokumen Komdigi.

Pencarian pada 21 Oktober 2026 tidak menemukan format kartu KYA terbuka berbahasa Indonesia. Itu hasil pencarian, bukan bukti bahwa format lain tidak ada. Format internasional yang sudah ada disebut di bagian 12.

## 2. Terminologi

- **Kartu** adalah objek JSON yang sesuai skema dan memuat `tandaTangan`.
- **Penerbit** adalah pihak yang memegang kunci privat Ed25519 dan menandatangani kartu.
- **Pemilik** adalah orang atau badan usaha yang menjalankan agen.
- **Agen** adalah perangkat lunak yang bertindak. Kartu memuat nama dan kunci publiknya.
- **Penanggung jawab** adalah pihak yang dapat dihubungi bila agen bertindak di luar batas.
- **Pemeriksa** adalah pihak yang memeriksa kartu sebelum menerima suatu aksi.
- **Kid** adalah nama kunci penerbit di header JWS dan di JWKS.

## 3. Enam pertanyaan

1. Siapa pemiliknya? `pemilik`.
2. Agen ini boleh melakukan apa? `izin`.
3. Berapa batas belanjanya? `batasBelanja`, dalam IDR.
4. Siapa yang bertanggung jawab? `penanggungJawab`.
5. Berlaku sampai kapan? `terbit` dan `berlakuSampai`.
6. Masih aktif atau sudah dicabut? `pencabutan`, plus daftar yang diberikan pemeriksa.

## 4. Model data

Nama field di JSON **HARUS** bahasa Indonesia seperti di tabel ini. Nama Inggris hanya untuk dokumen. v0.1 tidak menerima alias Inggris.

| Field | Inggris | Isi |
|---|---|---|
| `jati` | jati | HARUS `"0.1"` |
| `id` | id | `urn:jati:` diikuti pengenal kecil |
| `agen.nama` | agent.name | nama tampilan agen |
| `agen.kunciPublik` | agent.publicKey | kunci publik Ed25519 agen, base64url 32 byte, tanpa padding |
| `pemilik.nama` | owner.name | nama pemilik |
| `pemilik.jenis` | owner.kind | `orang` atau `badan_usaha` |
| `pemilik.id` | owner.id | pengenal yang dipilih penerbit |
| `izin` | permissions | daftar aksi. Urutan anggota bermakna dan ikut ditandatangani |
| `batasBelanja.mataUang` | spendingLimit.currency | HARUS `IDR` |
| `batasBelanja.perTransaksi` | spendingLimit.perTransaction | bilangan bulat rupiah, tanpa sen |
| `batasBelanja.perHari` | spendingLimit.perDay | bilangan bulat rupiah |
| `penanggungJawab.nama` | accountableParty.name | nama pihak |
| `penanggungJawab.kontak` | accountableParty.contact | URL `https` |
| `terbit` | issuedAt | RFC 3339 dengan offset numerik |
| `berlakuSampai` | validUntil | RFC 3339 dengan offset numerik |
| `pencabutan` | revocation | URL `https` daftar cabut |
| `penerbit` | issuer | URL `https` petunjuk lokasi JWKS |
| `tandaTangan` | signature | JWS compact. Field ini tidak ikut ditandatangani |

Aturan tambahan:

- Dokumen yang ditandatangani **HARUS** cocok dengan skema JSON. Field di luar skema **TIDAK BOLEH** ada.
- `terbit` **HARUS** lebih awal dari atau sama dengan `berlakuSampai`.
- Offset `Z` **TIDAK BOLEH**. Offset numerik membuat waktu lokalnya terlihat. Contoh memakai `+07:00`.
- `izin` **HARUS** berisi sedikitnya satu aksi. Nama aksi huruf kecil, angka, dan garis bawah. `bayar` adalah aksi yang membelanjakan `batasBelanja`. Nama lain ditentukan penerbit.
- `perHari` **SEBAIKNYA** lebih besar dari atau sama dengan `perTransaksi`.
- Jumlah uang **HARUS** bilangan bulat dari 0 sampai 9007199254740991. Tidak ada pecahan.
- `pemilik.id` adalah pengenal penerbit, bukan NIK. Contoh `CONTOH-123` fiktif.
- `agen.nama`, `pemilik.nama`, dan `penanggungJawab.nama` **HARUS** berisi 1 sampai 200 karakter dan **TIDAK BOLEH** memuat U+0000–U+001F, U+007F–U+009F, U+2028, atau U+2029.
- Penerbit **TIDAK BOLEH** menulis NIK, nomor paspor, nomor telepon, atau alamat rumah ke dalam kartu.
- `agen.kunciPublik` adalah kunci agen, bukan kunci penerbit. Kunci penerbit hanya muncul sebagai `kid` di JWS dan sebagai JWKS.
- Ukuran JSON UTF-8 kartu **TIDAK BOLEH** melebihi 65536 byte.

`$id` di skema adalah alamat yang direncanakan bila berkas ini diterbitkan. Pemeriksa v0.1 memakai salinan skema di repositori ini, bukan mengunduh `$id`.

## 5. Contoh fiktif

Pemilik, agen, dan URL `contoh.id` di bawah ini fiktif. Kartu ini ditandatangani pada 21 Oktober 2026 dan berlaku sampai akhir 31 Desember 2026. Berkas yang sama ada di [fixtures/valid.json](../fixtures/valid.json). Kunci publik penerbit ada di [fixtures/penerbit.public.jwks.json](../fixtures/penerbit.public.jwks.json). Kunci privat tidak disertakan.

Lima kasus untuk implementasi lain ada di [vectors/v0.1.json](vectors/v0.1.json): valid, diubah, kedaluwarsa, dicabut, dan lewat limit. Berkas itu memuat kunci publik. Setiap kasus memuat kartu, waktu `sekarang`, daftar `dicabut`, dan kalimat yang diharapkan.

```json
{
  "jati": "0.1",
  "id": "urn:jati:contoh:agen-001",
  "agen": {
    "nama": "Asisten Belanja Contoh",
    "kunciPublik": "S_m57fiDIsZ__QG4TKQqFZeqNTy7mI5tbdaEJPxcoG8"
  },
  "pemilik": {
    "nama": "PT Contoh Jaya (fiktif)",
    "jenis": "badan_usaha",
    "id": "CONTOH-123"
  },
  "izin": [
    "baca_katalog",
    "bayar"
  ],
  "batasBelanja": {
    "mataUang": "IDR",
    "perTransaksi": 300000,
    "perHari": 500000
  },
  "penanggungJawab": {
    "nama": "PT Contoh Jaya (fiktif)",
    "kontak": "https://contoh.id/kontak"
  },
  "terbit": "2026-10-21T00:00:00+07:00",
  "berlakuSampai": "2026-12-31T23:59:59+07:00",
  "pencabutan": "https://adindamochamad.github.io/jati/cabut.json",
  "penerbit": "https://adindamochamad.github.io/jati/.well-known/jati.json",
  "tandaTangan": "eyJhbGciOiJFZERTQSIsImtpZCI6ImNvbnRvaC1wZW5lcmJpdC0xIn0.eyJhZ2VuIjp7Imt1bmNpUHVibGlrIjoiU19tNTdmaURJc1pfX1FHNFRLUXFGWmVxTlR5N21JNXRiZGFFSlB4Y29HOCIsIm5hbWEiOiJBc2lzdGVuIEJlbGFuamEgQ29udG9oIn0sImJhdGFzQmVsYW5qYSI6eyJtYXRhVWFuZyI6IklEUiIsInBlckhhcmkiOjUwMDAwMCwicGVyVHJhbnNha3NpIjozMDAwMDB9LCJiZXJsYWt1U2FtcGFpIjoiMjAyNi0xMi0zMVQyMzo1OTo1OSswNzowMCIsImlkIjoidXJuOmphdGk6Y29udG9oOmFnZW4tMDAxIiwiaXppbiI6WyJiYWNhX2thdGFsb2ciLCJiYXlhciJdLCJqYXRpIjoiMC4xIiwicGVtaWxpayI6eyJpZCI6IkNPTlRPSC0xMjMiLCJqZW5pcyI6ImJhZGFuX3VzYWhhIiwibmFtYSI6IlBUIENvbnRvaCBKYXlhIChmaWt0aWYpIn0sInBlbmFuZ2d1bmdKYXdhYiI6eyJrb250YWsiOiJodHRwczovL2NvbnRvaC5pZC9rb250YWsiLCJuYW1hIjoiUFQgQ29udG9oIEpheWEgKGZpa3RpZikifSwicGVuY2FidXRhbiI6Imh0dHBzOi8vYWRpbmRhbW9jaGFtYWQuZ2l0aHViLmlvL2phdGkvY2FidXQuanNvbiIsInBlbmVyYml0IjoiaHR0cHM6Ly9hZGluZGFtb2NoYW1hZC5naXRodWIuaW8vamF0aS8ud2VsbC1rbm93bi9qYXRpLmpzb24iLCJ0ZXJiaXQiOiIyMDI2LTEwLTIxVDAwOjAwOjAwKzA3OjAwIn0.t2-gsTQMCUi4cHlcxVnianpP0QrJgvkmY-hUq5-jPMQpd6-GUm4MM12YFi421PYpyMTYqPqNU8VVqBsiwPIsAg"
}
```

URL `penerbit` dan `pencabutan` adalah alamat yang direncanakan. Pada v0.1, contoh diperiksa dengan berkas JWKS lokal. Pustaka tidak mengunduh URL itu.

## 6. Kanonisasi dan tanda tangan

1. Ambil objek kartu dan hapus anggota `tandaTangan`.
2. Kanonisasi sisa objek dengan JSON Canonicalization Scheme, [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785). Hasilnya adalah string JSON tanpa spasi, properti terurut menurut satuan kode UTF-16, dikodekan UTF-8.
3. Tanda tangani byte UTF-8 itu sebagai payload JWS compact, algoritma `EdDSA`, kunci Ed25519 penerbit.
4. Header terlindungi **HARUS** persis `{"alg":"EdDSA","kid":"<kid>"}` tanpa spasi dan tanpa anggota lain. `<kid>` cocok dengan `^[A-Za-z0-9._:-]{1,128}$`.
5. Simpan JWS compact yang dihasilkan ke `tandaTangan`.

Urutan field pada berkas yang dibaca manusia tidak bermakna. Urutan anggota `izin` bermakna.

Pemeriksa **HARUS**:

- menolak header yang `alg`-nya bukan `EdDSA`, yang urutan anggotanya berbeda, atau yang memuat anggota tambahan, termasuk `typ` dan `crit`;
- memverifikasi tanda tangan terhadap kunci Ed25519 yang `kid`-nya sama;
- menghitung ulang kanonisasi RFC 8785 dari field selain `tandaTangan`;
- menolak kartu bila byte payload JWS tidak sama dengan hasil hitungan itu.

Payload JWS mengulang isi kartu. Field yang terlihat dan payload **HARUS** sama. Mengubah satu field tanpa mengganti tanda tangan **HARUS** gagal, meskipun tanda tangan di dalam JWS masih sah untuk payload lama.

Implementasi rujukan memakai `canonicalize` 5.1.0 dan `jose` 6.2.13. Kesesuaian dengan vektor RFC 8785 bagian 3.2.4 diuji di repositori ini. Kesesuaian dengan proof W3C `eddsa-jcs-2022` **tidak** diklaim: sampulnya berbeda. v0.1 menaruh JWS compact di `tandaTangan`, bukan di objek `proof`.

## 7. Kunci penerbit

JWKS penerbit adalah objek `{"keys":[...]}`. Setiap kunci yang dipakai **HARUS**:

- `kty`: `OKP`
- `crv`: `Ed25519`
- `alg`: `EdDSA` bila diisi
- `use`: `sig` bila diisi
- `kid`: sama dengan `kid` di header JWS
- `x`: kunci publik, base64url

`kid` di dalam satu JWKS **HARUS** unik. Komponen privat `d` **TIDAK BOLEH** ada di JWKS yang diterbitkan.

Lokasi yang direncanakan untuk contoh ini adalah `https://adindamochamad.github.io/jati/.well-known/jati.json`. Pustaka v0.1 tidak mengambil berkas itu. Pemeriksa memasok JWKS yang sudah ia percayai, atau JWKS yang baru ditemukan dan belum dipercaya. URL `penerbit` adalah petunjuk, bukan keputusan kepercayaan.

## 8. Aturan pemeriksaan

Pemeriksa **HARUS** berhenti pada kegagalan pertama, dalam urutan ini.

1. **Bentuk.** Bukan objek, lebih besar dari 65536 byte, tidak cocok skema, atau `agen.kunciPublik` bukan 32 byte base64url yang kanonik. Hasil: tidak sesuai format.
2. **Header.** JWS tidak compact, atau header terlindungi bukan persis `{"alg":"EdDSA","kid":"<kid>"}`. Hasil: sudah diubah.
3. **Kunci.** Tidak ada kunci publik yang cocok di JWKS tepercaya maupun JWKS yang ditemukan. Hasil: kunci tidak ada.
4. **Tanda tangan.** Tanda tangan tidak cocok dengan kunci itu, atau payload tidak sama dengan kanonisasi ulang. Hasil: sudah diubah. Bila `kid` ada di JWKS tepercaya tetapi tanda tangannya gagal, hasilnya sudah diubah. Pemeriksa tidak melanjutkan ke kunci yang tidak dipercaya.
5. **Pencabutan.** Jika daftar `dicabut` diisi dan `id` ada di daftar: sudah dicabut. Daftar kosong berarti daftar sudah ada dan `id` itu tidak dicabut. Jika `dicabut` tidak diisi, langkah ini tidak memutuskan.
6. **Masa berlaku.** `sekarang` sebelum `terbit`: belum berlaku. `sekarang` sesudah `berlakuSampai`: kedaluwarsa. Kedua batas inklusif. Tidak ada toleransi jam: waktu yang diberikan pemeriksa dipakai apa adanya, tanpa digeser. Satu milidetik sebelum `terbit` belum berlaku. Satu milidetik sesudah `berlakuSampai` kedaluwarsa. Tanggal pada kalimat hasil adalah tanggal kalender yang tertulis di `berlakuSampai`, bukan hasil konversi zona waktu mesin.
7. **Pengenalan penerbit.** Tanda tangan cocok hanya dengan JWKS yang ditemukan, bukan dengan JWKS tepercaya: penerbit belum dikenal.
8. **Kebijakan**, hanya bila pemeriksa mengisi `aksi` atau `jumlah`.
   - `jumlah` tanpa `aksi` diperiksa sebagai aksi `bayar`.
   - `aksi` yang tidak ada di `izin`: tolak.
   - `aksi` selain `bayar` dengan `jumlah`: tolak. Batas belanja hanya untuk `bayar`.
   - `bayar` tanpa `jumlah`: tolak.
   - `jumlah` atau `terpakaiHariIni` yang bukan bilangan bulat ≥ 0: tolak.
   - `jumlah` lebih besar dari `perTransaksi`: tolak. Nilai yang sama dengan batas masih lolos.
   - Jika `jumlah` lebih besar dari `perHari`: tolak, walaupun `terpakaiHariIni` tidak diisi.
   - Jika `terpakaiHariIni` diisi: tolak bila `terpakaiHariIni + jumlah` lebih besar dari `perHari`. Nilai yang sama dengan batas masih lolos.
   - Jika `terpakaiHariIni` tidak diisi dan `jumlah` lebih kecil dari atau sama dengan `perHari`, sisa batas harian **TIDAK** diperiksa.

`perTransaksi` bisa diperiksa dari kartu dan `jumlah` saja. `jumlah` yang sudah lebih besar dari `perHari` juga ditolak dari kartu saja. Sisa `perHari` tidak bisa diperiksa dari kartu saja, karena kartu tidak menyimpan riwayat belanja.

Hasil negatif yang tidak membutuhkan daftar (bentuk, perubahan, kunci hilang, masa berlaku, penerbit belum dikenal, atau tolak kebijakan) tetap dilaporkan. Hasil itu bukan pernyataan bahwa kartu tidak dicabut.

Jika pemeriksaan sampai pada jalur yang semestinya `asli` tetapi `dicabut` tidak diisi, hasilnya **HARUS** `tidak_pasti` dengan kalimat `Tidak pasti. Pencabutan belum bisa dicek.` Pemeriksa **TIDAK BOLEH** menulis `Kartu asli` pada keadaan itu. Kegagalan mengambil daftar **TIDAK BOLEH** diganti dengan daftar kosong.

## 9. Daftar pencabutan

Daftar v0.1 adalah JSON statis:

```json
{
  "jati": "0.1",
  "dicabut": ["urn:jati:contoh:agen-dicabut"]
}
```

`dicabut` adalah daftar `id` kartu. Daftar ini **tidak** ditandatangani pada v0.1. Kepercayaan pada daftar datang dari lokasi HTTPS yang dipakai pemeriksa, bukan dari tanda tangan di dalam berkas. Pengunduh yang gagal mengambil daftar **HARUS** menghasilkan `tidak_pasti` bila tidak ada hasil negatif lain. Pengunduh itu **TIDAK BOLEH** mengganti kegagalan dengan daftar kosong dan **TIDAK BOLEH** menganggap kartu tidak dicabut.

Pustaka menerima daftar `id` dari pemanggil dan tidak membuka jaringan. Berkas contoh yang sama ada di [fixtures/cabut.json](../fixtures/cabut.json). Pembaca berkas, termasuk CLI dan halaman cek, **HARUS** menolak berkas yang `jati`-nya bukan `"0.1"` atau yang `dicabut`-nya bukan daftar string. Berkas itu bukan daftar dan **TIDAK BOLEH** dianggap daftar kosong. Halaman cek hanya mengambil daftar dari origin yang sama, supaya kebijakan `connect-src 'self'` tetap berlaku. Bila pengambilan gagal, berkas tidak sah, atau peramban sedang luring, halaman tidak memakai salinan lama sebagai daftar yang sudah dicek. Status halaman menyebut daftar origin itu, dan tidak menyebut daftar itu ditandatangani.

`id` pada contoh bagian 5 tidak ada di daftar di atas.

## 10. Kalimat hasil

Kalimat Indonesia berikut normatif untuk implementasi rujukan. `boleh` hanya benar bila status `asli`.

| Status | Kalimat |
|---|---|
| `tidak_sesuai_format` | Kartu tidak sesuai format. |
| `diubah` | Kartu sudah diubah. |
| `kunci_tidak_ada` | Kunci penerbit untuk kid ini tidak ada. |
| `dicabut` | Kartu sudah dicabut. |
| `tidak_pasti` | Tidak pasti. Pencabutan belum bisa dicek. |
| `belum_berlaku` | Kartu belum berlaku. |
| `kedaluwarsa` | Kartu kedaluwarsa. |
| `penerbit_belum_dikenal` | Tanda tangan cocok, penerbit belum dikenal. |
| `tolak` | Tolak. lalu alasan yang spesifik di bawah |
| `asli` | Kartu asli. Pemilik: {nama}. Berlaku sampai {tanggal}. |

Alasan `tolak`:

- `Tolak. Aksi tidak sah.`
- `Tolak. Aksi "{aksi}" tidak ada di izin.`
- `Tolak. Batas belanja hanya berlaku untuk aksi bayar.`
- `Tolak. Aksi bayar membutuhkan jumlah.`
- `Tolak. Jumlah harus bilangan bulat nol atau lebih.`
- `Tolak. Pemakaian hari ini harus bilangan bulat nol atau lebih.`
- `Tolak. Jumlah Rp300.001 melewati batas per transaksi Rp300.000.`
- `Tolak. Pemakaian hari ini menjadi Rp500.001, melewati batas Rp500.000.`

Rupiah ditulis tanpa spasi dan tanpa sen, dengan titik sebagai pemisah ribuan: `Rp300.000`. Tanggal memakai singkatan Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agu, Sep, Okt, Nov, Des. Contoh bagian 5 menghasilkan: `Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.`

"Kartu asli" berarti kunci yang pemeriksa percayai menandatangani field itu, masa berlakunya cocok, dan id-nya tidak ada di daftar yang pemeriksa berikan. Nama pada kalimat adalah field yang ditandatangani, bukan bukti pemiliknya nyata. Kalimat itu tidak membuktikan agennya aman. Menyalin kartu cukup untuk mendapat kalimat yang sama. Daftar yang tidak ada tidak menghasilkan "Kartu asli". Bila pemeriksa mengirim `jumlah`, aturan bagian 8 ikut menentukan hasilnya. Tanpa `jumlah`, batas belanja tidak diperiksa.

Implementasi rujukan juga mengisi `kode` yang stabil, misalnya `JATI_OK`, `JATI_EXPIRED`, dan `JATI_REVOCATION_UNCHECKED`, plus `kalimatEn` yang informatif. Kode dan kalimat Inggris bukan bagian normatif.

## 11. Keamanan dan privasi

- Kunci privat penerbit dan kunci privat agen tidak boleh masuk repositori, riwayat git, atau JWKS publik.
- Kartu tidak rahasia. Menyalin kartu tidak membuktikan bahwa pembawa kartu memegang kunci privat agen. Bukti pegang kunci agen ada di luar v0.1.
- Pemeriksa **HARUS** menolak algoritma selain `EdDSA` dan header `none`.
- Kepercayaan pada kunci penerbit diputuskan pemeriksa. Mengunduh JWKS dari jaringan tidak otomatis membuat kunci itu dipercaya.
- Daftar cabut v0.1 tidak ditandatangani.
- Pustaka rujukan tidak membuka koneksi jaringan dan tidak mengunggah kartu.
- Contoh di spesifikasi ini fiktif.

## 12. Di luar v0.1

Hal-hal ini sengaja belum menjadi bagian normatif:

- W3C Verifiable Credentials 2.0 dan proof `eddsa-jcs-2022`. Pemetaan di bawah informatif, bukan klaim kompatibilitas. Tabel dan contoh bentuk VC ada di bagian 13. Keduanya non-normatif.
- Bitstring Status List, SD-JWT, dan selective disclosure.
- ERC-8004 dan registri on-chain.
- Visa Trusted Agent Protocol dan Google AP2 sebagai ketergantungan normatif. Batas belanja Jati dapat dibandingkan dengan mandat AP2 oleh pemeriksa, tanpa aturan pemetaan di v0.1.
- Sertifikat PSrE atau BSrE. Belum diperiksa apakah salah satunya dapat menjadi penerbit Jati.
- Buku besar belanja harian. Sisa `perHari` tetap membutuhkan `terpakaiHariIni` dari pemeriksa. Jumlah yang sudah lebih besar dari `perHari` ditolak tanpa buku besar itu.
- Bukti bahwa pembawa kartu menguasai `agen.kunciPublik`.

Pemetaan informatif ke istilah VC 2.0: `penerbit` ~ issuer, `id` ~ id, `terbit` ~ validFrom, `berlakuSampai` ~ validUntil, `agen` bersama pemilik dan izin ~ credentialSubject, `tandaTangan` ~ proof. Sampul JWS v0.1 tidak sama dengan objek proof VC.

Pembanding yang sudah ada, dan bukan lawan yang harus dikalahkan:

- [KYA-OS](https://github.com/decentralized-identity/kya-os-mcp/blob/main/SPEC.md), identitas dan delegasi untuk MCP.
- [KYA Manifest](https://open-kya.github.io/kya-standard/spec/index.html).
- [draft IETF Skyfire KYAPay](https://datatracker.ietf.org/doc/html/draft-skyfire-oauth-kyapay-token), 2 Oktober 2026.
- [profil verifikasi knowyouragent.ch](https://knowyouragent.ch/en/standard/verification-profile).
- [W3C VC 2.0](https://www.w3.org/TR/vc-data-model-2.0/).

Jati adalah profil lokal terbuka: field bahasa Indonesia, batas IDR, dan kalimat hasil yang bisa dibaca tanpa istilah kriptografi di baris pertama.

## 13. Contoh bentuk VC 2.0 (non-normatif)

Bagian ini non-normatif. Contoh di bawah bukan kartu Jati, belum diuji dengan verifier VC 2.0, dan bukan klaim kompatibilitas. Sampul JWS v0.1 tidak diubah menjadi objek `proof`.

| Field Jati | Istilah VC 2.0 | Catatan |
|---|---|---|
| `penerbit` | `issuer` | URL petunjuk, bukan keputusan kepercayaan |
| `id` | `credentialSubject.id` | |
| `terbit` | `validFrom` | |
| `berlakuSampai` | `validUntil` | |
| `agen`, `pemilik`, `izin`, `batasBelanja` | `credentialSubject` | |
| `pencabutan` | `credentialStatus.id` | Bukan Bitstring Status List |
| `tandaTangan` | bukan `proof` | JWS compact v0.1 berbeda dari proof VC |

```json
{
  "@context": ["https://www.w3.org/ns/credentials/v2"],
  "type": ["VerifiableCredential", "JatiCard"],
  "issuer": "https://adindamochamad.github.io/jati/.well-known/jati.json",
  "validFrom": "2026-10-21T00:00:00+07:00",
  "validUntil": "2026-12-31T23:59:59+07:00",
  "credentialSubject": {
    "id": "urn:jati:contoh:agen-001",
    "agent": {
      "name": "Asisten Belanja Contoh"
    },
    "owner": {
      "name": "PT Contoh Jaya (fiktif)",
      "kind": "badan_usaha",
      "id": "CONTOH-123"
    },
    "permissions": ["baca_katalog", "bayar"],
    "spendingLimit": {
      "currency": "IDR",
      "perTransaction": 300000,
      "perDay": 500000
    }
  },
  "credentialStatus": {
    "id": "https://adindamochamad.github.io/jati/cabut.json",
    "type": "JatiRevocationList"
  }
}
```
