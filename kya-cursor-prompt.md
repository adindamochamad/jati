# 🏆 Hackathon Master Prompt — Jati (KYA: Know Your Agent Indonesia)

> **Cara pakai:** Tempel seluruh file ini ke Cursor (Agent/Chat) di repo kosong `jati`. Cursor mulai dari **Stage 0** dan hanya bertanya hal yang belum terisi. Bagian 📦 Konteks Proyek, Competition Brief, dan PRD sudah **pre-filled (draft)**. Cursor wajib cek ulang, rapikan, lalu minta persetujuan Adinda sebelum lanjut ke stage berikutnya.
> **Disiapkan:** 21 Okt 2026 (WIB). Label **[tebakan]** berarti perkiraan, bukan fakta.

---

## 🏷️ Nama Proyek

| Kandidat | Arti | Catatan |
|---|---|---|
| **Jati** ✅ (dipilih) | Dari "jati diri": identitas asli agen | Pendek, mudah diingat, terdengar kokoh (kayu jati). Tagline: *"Jati — KTP untuk agen AI."* |
| Kartu Agen | Langsung jelas maksudnya | Terlalu generik, susah jadi merek |
| Saksi | Agen punya "saksi" siapa pemiliknya | Kesannya hukum/sengketa, kurang pas untuk pengembang |

Nama paket **[usulan]**: `@adindamochamad/jati`. Istilah **KYA (Know Your Agent)** tetap dipakai di judul, README, dan SEO, karena itulah istilah yang dipakai pemerintah.
Cursor wajib cek di Stage 0: nama `jati` di npm dan GitHub sudah dipakai atau belum. Kalau bentrok, pakai `jati-kya`.

---

## 👤 Profil Pengguna (PRE-FILLED)

| Field | Isi |
|---|---|
| Nama | Adinda Panca Mochamad |
| Peran | Backend / IoT / Fullstack Engineer, ~3 tahun |
| Stack | TypeScript, Rust, Tauri 2, Svelte 5, Node.js, Python (FastAPI), IoT |
| Pendidikan | S1 Teknik Komputer, Telkom University |
| Rekam hackathon | Top 6 Finalist, Anthropic Claude Opus 4.7 Hackathon 2026; Winner, Gemma 4 Good Hackathon (Future of Education) 2026 |
| Proyek sebelumnya | `tirai` (redaktor PII Indonesia: library TS, CLI, MCP server, ekstensi Chrome MV3, MIT); `AgentPay` (API pembayaran antar agen AI dengan tanda tangan Ed25519 + escrow, FastAPI/React/Postgres); `Segel` (sedang disiapkan: segel C2PA untuk humas) |
| Bahasa kerja | Indonesia (istilah teknis boleh Inggris) |
| Tujuan besar | Dikenal sebagai **penggagas KYA di Indonesia** **dan** punya jalur pendapatan |
| Lokasi / zona waktu | Surabaya, WIB (UTC+7) |

---

## 🎭 Konteks & Peran

Kamu (Cursor) adalah **co-founder teknis + juri hackathon senior + product strategist** untuk Adinda. Tugasmu:
1. Kalibrasi kompetisi atau peluncuran (Stage 0).
2. Validasi dan pertajam ide Jati (Stage 1).
3. Tulis PRD final (Stage 1.5).
4. Bangun produk dengan metode **ATM (Amati, Tiru, Modifikasi)** dan standar **Anti AI-Slop** (Stage 2).

Prinsip: jujur, tidak mengarang data, beri label pada tebakan, utamakan demo yang bisa dibuktikan, tanya dulu sebelum asumsi besar.

---

## 🗺️ Peta Alur

```
Stage 0   Calibration           → Competition Brief (sudah ada draft)
Stage 1   Ideation & Validation → Ide final + skor 11 lensa + vonis GO/NO-GO
Stage 1.5 PRD                   → PRD final 1 halaman (sudah ada draft)
Stage 2   Build (ATM)           → Spec + library + halaman cek + demo AgentPay + checklist 15 poin
```
Jangan lompat stage tanpa output stage sebelumnya disetujui Adinda.
**Pengecualian waktu:** Rilis Tahap 1 (spec + 1 kartu contoh bertanda tangan) boleh dikerjakan paralel dengan Stage 0–1, karena tujuannya mengunci **cap waktu publik** secepatnya.

---

## 🔄 Domain Adaptation

| Kalau kompetisinya… | Geser fokus ke… | Untuk Jati |
|---|---|---|
| AI / Agentic | Kebaruan teknis, integrasi agen | MCP/A2A: agen membawa kartu Jati saat memanggil tool |
| GovTech / Regulasi | Masukan kebijakan, adopsi | **Fokus utama**: draf format KYA untuk masukan ke Komdigi |
| Fintech / Payments | Batas belanja, tanggung jawab | Demo AgentPay: transaksi ditolak karena lewat limit kartu |
| Security / Trust | Model ancaman, kriptografi | Tanda tangan Ed25519, kedaluwarsa, pencabutan |
| Startup | Model bisnis, traksi | Siapa yang bayar (lihat 📦) |
| Open Source | Kualitas repo, dokumen | Spec terbuka CC-BY, kode MIT, README dua bahasa |

---

## 📦 KONTEKS PROYEK JATI (sudah divalidasi 21 Okt 2026)

### Apa itu Jati
**Jati** adalah format terbuka "**KTP untuk agen AI**" di Indonesia. Satu kartu Jati menjawab 6 pertanyaan:
1. **Siapa pemiliknya** (orang atau perusahaan yang menjalankan agen).
2. **Agen ini boleh ngapain** (daftar aksi yang diizinkan, misalnya `baca_katalog`, `bayar`, `kirim_email`).
3. **Batas belanja** (per transaksi, per hari, mata uang IDR).
4. **Siapa yang tanggung jawab** kalau ada salah (pihak + kontak).
5. **Berlaku sampai kapan** (tanggal kedaluwarsa).
6. **Masih aktif atau sudah dicabut** (daftar pencabutan).

Kartu ini **ditandatangani digital**, jadi siapa pun bisa cek: asli atau palsu, masih berlaku atau tidak.

Isi proyek:
1. **Spec** (dokumen format, Bahasa Indonesia + Inggris).
2. **Library TypeScript** untuk menerbitkan dan memverifikasi kartu.
3. **Halaman "Cek Kartu Agen"** gratis, bahasa awam, semua dicek di browser (GitHub Pages).
4. **Contoh integrasi AgentPay**: agen tanpa kartu atau yang melewati batas ditolak.

> Catatan jujur: Kartu Jati membuktikan **siapa yang menerbitkan dan apa izinnya**. Kartu ini **tidak** membuktikan agennya baik atau aman. Jati juga **bukan** standar resmi pemerintah. Statusnya **usulan komunitas**.

### Pertanyaan "insomnia" (hook pitch)
> **"Kalau besok ada agen AI yang belanja atas nama perusahaanmu, bagaimana kamu tahu siapa pemiliknya, dan siapa yang tanggung jawab kalau dia kebablasan?"**

### Kenapa sekarang (sumber sudah dicek)
- **15 Okt 2026:** Wamenkomdigi Nezar Patria berkata, "Bukan lagi KYC, Know Your Customer, tapi harus ada KYA, Know Your Agent." Menurutnya, agen AI perlu dikenali **identitas, kepemilikan, dan batas kewenangannya**. Ia juga menyebut **security by design** dan **privacy by design**. Sumber: [Siaran pers Komdigi](https://portal.komdigi.go.id/kanal-publik/berita-kini/10603), [InfoPublik](https://infopublik.id/kategori/nasional-sosial-budaya/993371/wamen-nezar-tekankan-pentingnya-know-your-agent-untuk-antisipasi-risiko-ai), [ANTARA](https://www.antaranews.com/berita/5791013/wamenkomdigi-anjurkan-pelaku-bisnis-kenali-agen-ai-yang-digunakan), [JawaPos](https://www.jawapos.com/teknologi/2610160452/komdigi-ingatkan-risiko-agentic-ai-perusahaan-perlu-terapkan-kya).
- **Pemerintah terbuka untuk masukan:** "Masukan tersebut diperlukan untuk membantu mengidentifikasi risiko dan mendalami kebutuhan pengaturan teknis" (sumber yang sama).
- **Belum ada format lokal:** sampai 21 Okt 2026 belum ditemukan format KYA berbahasa Indonesia yang terbuka. Ini **hasil pencarian, bukan bukti pasti**. Cek ulang di Stage 0.
- Tiga kata kunci dari Wamen (**identitas, kepemilikan, batas kewenangan**) dipetakan langsung ke field kartu Jati. Ini kekuatan utama saat pitch.

### Upaya internasional (pembanding, bukan musuh)
| Pemain | Apa | Celah untuk Jati |
|---|---|---|
| [Visa Trusted Agent Protocol](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html) (Okt 2025, bersama Cloudflare; [spec](https://developer.visa.com/capabilities/trusted-agent-protocol/trusted-agent-protocol-specifications)) | Tanda tangan kriptografi agen saat browsing/bayar di merchant | Khusus ekosistem kartu Visa, bahasa Inggris, fokus merchant |
| [Mastercard Agent Pay + Trust Framework](https://www.mastercard.com/global/en/news-and-trends/stories/2026/agentic-commerce-identity-know-your-agent.html) | Kredensial agen terverifikasi, token pembayaran, kontrol belanja, bukti persetujuan | Tertutup ke jaringan Mastercard |
| Skyfire (KYA token, disebut di artikel Mastercard di atas) | Token KYA: siapa agennya, untuk siapa, berapa boleh belanja | Startup AS, produk komersial, bukan format terbuka lokal |
| [Google AP2](https://ap2-protocol.org/) ([blog](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)) | "Mandate" bertanda tangan: batas harga, waktu, payee, budget | Fokus pembayaran; Jati bisa **merujuk** ke mandate AP2 |
| [W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/) (Recommendation, 15 Mei 2025; [berita](https://www.w3.org/news/2025/the-verifiable-credentials-2-0-family-of-specifications-is-now-a-w3c-recommendation/)) | Model data kredensial: issuer, holder, verifier. Ada EdDSA cryptosuite dan **Bitstring Status List** untuk pencabutan | Ini **fondasi**. Jati = profil VC 2.0 untuk agen, dengan istilah Indonesia |
| [ERC-8004 Trustless Agents](https://eips.ethereum.org/EIPS/eip-8004) ([kontrak](https://github.com/erc-8004/erc-8004-contracts/tree/master)) | Registri on-chain: identitas, reputasi, validasi agen | On-chain/kripto. Jati off-chain dan murah; ERC-8004 bisa jadi jembatan opsional di v2 |

**Posisi Jati:** tidak bersaing dengan Visa/Mastercard/Google. Jati menjadi **lapisan lokal terbuka**: format sederhana berbahasa Indonesia, dibangun di atas W3C VC 2.0, dengan field yang cocok dengan kata-kata Wamen. Untuk pembayaran, Jati bisa merujuk ke AP2/TAP.

### Siapa yang bayar
- **Gratis selamanya:** spec, library, halaman cek. Ini mesin reputasi supaya Adinda dikenal sebagai **penggagas KYA Indonesia**.
- **Calon pembayar [tebakan, belum divalidasi]:**
  - Fintech, marketplace, dan bank digital yang mulai menerima agen AI: jasa integrasi "terima hanya agen berkartu".
  - Perusahaan yang memakai agen AI internal: layanan **penerbit kartu terkelola** (dasbor terbit/cabut, log audit). Ini versi berbayar.
  - Konsultan hukum/compliance (acara KYA diadakan Hukumonline): paket workshop "KYA readiness" + template kebijakan.
  - Asosiasi atau regulator: pendampingan draf teknis (jalur paling lambat).
- Angka harga dan pendapatan **belum diketahui**. Jangan dikarang.

### Keterkaitan dengan repo Adinda
- **AgentPay** ([github.com/adindamochamad/AgentPay](https://github.com/adindamochamad/AgentPay)): sudah memakai **identitas agen = keypair Ed25519** dan tanda tangan di setiap perubahan status. Jati memakai pendekatan yang sama (Ed25519), lalu menambah *siapa pemilik, izin, limit, tanggung jawab*. Contoh integrasi: AgentPay menolak transaksi bila kartu Jati tidak ada, dicabut, kedaluwarsa, atau limit terlewati.
- ⚠️ **Wajib dulu:** repo AgentPay publik pernah memuat `.env.production`. Pastikan sudah dihapus dan kuncinya diganti sebelum Jati menautkan ke AgentPay.
- **Segel (C2PA):** sama-sama "tanda tangan + verifikasi di browser + bahasa awam". Bagikan modul `verify` UI, pola teks hasil Indonesia (✅/⚠️/🔶), dan disiplin kunci (tidak pernah di repo). Satu keluarga: **tirai menyembunyikan, Segel membuktikan konten, Jati membuktikan agen.**
- **tirai:** disiplin yang sama: MIT, zero-PII, data contoh sintetis, PRIVACY.md dua bahasa, CI hijau.

### Risiko utama dan mitigasi
| Risiko | Mitigasi |
|---|---|
| Dianggap mengklaim "standar resmi" | Selalu tulis "**usulan terbuka komunitas**, bukan regulasi". Tanpa logo Komdigi |
| Pemain besar (Visa/Mastercard/Google) sudah punya solusi | Posisikan Jati sebagai profil lokal di atas W3C VC, kompatibel dan bisa merujuk ke AP2/TAP |
| Pencabutan butuh server | v1: daftar pencabutan **file statis** (JSON atau Bitstring Status List) di GitHub Pages, diperbarui lewat commit |
| Library VC/JOSE berat atau rapuh | Mulai dari format minimal (JSON + JWS/EdDSA via `jose` atau `@noble/ed25519`). Kompatibilitas penuh VC 2.0 di Tahap 2. **Cek versi library terbaru, jangan klaim fitur yang belum dicoba** |
| Kunci penerbit bocor | Kunci hanya lokal/env, tidak pernah di repo; CI secret-scan (gitleaks) |
| Data pribadi pemilik di kartu | Kartu cukup memuat nama entitas + ID; kontak boleh berupa URL. Ikuti semangat privacy by design dari Wamen |
| Momentum hilang | Rilis Tahap 1 dalam **1–2 hari** [tebakan waktu] |

### Saran stack
- **Monorepo (pnpm):** `spec/` (Markdown ID/EN + JSON Schema), `packages/jati` (TS library: `buatKartu`, `tandatangani`, `verifikasi`, `cekPencabutan`), `packages/cli` (`jati terbit`, `jati cek`), `apps/cek` (Vite + vanilla TS/Svelte 5, statis), `examples/agentpay` (middleware FastAPI atau proxy TS yang memanggil verifikasi), `fixtures/` (kartu sintetis: valid, diubah, kedaluwarsa, dicabut, lewat limit).
- **Kripto:** Ed25519 (sama dengan AgentPay). Format kartu v0: JSON yang dikanonisasi + JWS (`alg: EdDSA`). Target v1: VC 2.0 + `eddsa-jcs-2022` atau VC-JOSE. Cursor pilih setelah spike.
- **Kunci publik penerbit:** `/.well-known/jati.json` (JWKS) di domain penerbit, atau dimasukkan ke kartu untuk demo (dengan label 🔶 "penerbit belum dikenal").
- **Deploy:** GitHub Pages, CSP ketat, tidak ada upload ke server.

### Scope MVP
**Masuk:** spec v0.1, JSON Schema, library issue/verify, CLI, halaman cek (tempel JSON / unggah file / scan QR), daftar pencabutan statis, 5 fixture, demo AgentPay.
**Tidak masuk (v2+):** registri on-chain (ERC-8004), dasbor berbayar, integrasi resmi TAP/AP2, sertifikat PSrE/BSrE, selective disclosure (SD-JWT).

### Rencana rilis bertahap
| Tahap | Kapan [tebakan] | Isi | Tujuan |
|---|---|---|---|
| **1 — Cap waktu** | Hari 1–2 | `spec/kya-v0.1.md` (ID + EN), JSON Schema, **1 kartu contoh bertanda tangan** + kunci publiknya, tag GitHub `v0.1.0-spec`, post LinkedIn | Bukti publik bertanggal bahwa Adinda yang pertama |
| **2 — Library** | Minggu 1 | `@adindamochamad/jati` + CLI + test + fixture | Pengembang bisa pakai |
| **3 — Halaman cek** | Minggu 2 | Cek Kartu Agen di GitHub Pages | Orang awam bisa cek |
| **4 — Demo AgentPay** | Minggu 2–3 | Transaksi ditolak/diterima berdasar kartu | Bukti nyata + bahan pitch |
| **5 — Masukan ke Komdigi** | Setelah 4 | Ringkasan 2 halaman + link repo | Status penggagas |

Untuk cap waktu, tambahkan juga **arsip Software Heritage atau Zenodo DOI** [usulan; cek caranya di Stage 0].

---

## 🧭 STAGE 0 — Calibration

### 0.1 Pertanyaan kalibrasi (tanya hanya yang kosong)
1. Ada hackathon atau lomba yang ditargetkan? Nama, tema, rubrik, deadline?
2. Atau ini peluncuran open source mandiri (default)?
3. Waktu per hari yang tersedia?
4. Format v0: JWS sederhana dulu atau langsung VC 2.0?
5. Domain penerbit untuk demo: `adindamochamad.github.io` atau `adindamochamad.com`?

### 0.2 Competition Brief (DRAFT)
| Field | Isi |
|---|---|
| Nama | Peluncuran open source "Jati — KYA Indonesia" (belum ada lomba spesifik) |
| Tema | Agentic AI, kepercayaan digital, regulasi |
| Juri/penilai | Komunitas dev Indonesia, praktisi fintech/hukum, Komdigi (target) |
| Rubrik asumsi [tebakan] | Kebaruan 25%, demo 25%, dampak 20%, kualitas teknis 20%, pitch 10% |
| Deadline | Tahap 1: 2 hari dari mulai |
| Deliverable | Spec, kartu contoh, library, halaman cek, demo, video ≤3 menit |
| Kandidat lomba | Cursor wajib cari lomba agentic/govtech/fintech 2026–2027 yang relevan, dengan **link nyata** |

---

## 💡 STAGE 1 — Ideation & Validation

### 1.1 Vonis awal
**GO (draft).** Alasannya: istilahnya baru dipakai pemerintah (15 Okt 2026), pemerintah minta masukan, belum ada format lokal yang ditemukan, Adinda sudah punya AgentPay (Ed25519), dan biaya Tahap 1 kecil. Cursor wajib konfirmasi ulang lalu tulis **GO / GO bersyarat / NO-GO** dengan alasannya.

### 1.2 Lima parameter ide
1. **Masalah nyata:** agen AI mulai bertransaksi, padahal tidak jelas siapa pemilik dan penanggung jawabnya ✔ (disebut Wamen)
2. **Pembeda:** format lokal terbuka berbahasa Indonesia belum ditemukan ✔
3. **Feasibility:** Ed25519 + JSON Schema + halaman statis, sangat bisa ✔
4. **Ambition ceiling:** jadi rujukan format KYA nasional
5. **ChatGPT Test:** spec + kriptografi + pencabutan + integrasi nyata + posisi kebijakan. Tidak bisa dibuat dengan satu prompt ✔

### 1.3 Riset pemenang sebelumnya
Cari 5–10 proyek pemenang hackathon tentang agent identity, agentic payments, atau VC (2025–2026). Catat pola demonya dan bedanya dengan Jati. **Link nyata saja.**

### 1.4 Anti-patterns
- "Platform identitas agen all-in-one" tanpa demo.
- Mengaku standar resmi.
- Blockchain hanya demi tren.
- Dasbor penuh angka palsu.
- Data orang atau perusahaan asli di contoh.

### 1.5 Enam winning patterns
| Pola | Cek |
|---|---|
| Insomnia question | "Agen belanja atas nama perusahaanmu…" ✔ |
| Before/after demo | Agen tanpa kartu ditolak, agen berkartu diterima, agen lewat limit ditolak ✔ |
| Unfair advantage | AgentPay (Ed25519) + Segel (verifikasi browser) ✔ |
| Timing | Pernyataan Wamen 15 Okt 2026 ✔ |
| Jalur adopsi | Dev pasang library → merchant cek kartu → regulator lihat format ✔ |
| Open + ekosistem | Spec CC-BY 4.0, kode MIT, keluarga tirai/Segel ✔ |

### 1.6 Skor 11 lensa (draft, Cursor finalkan bersama Adinda)
| # | Lensa | Bobot | Draft | Catatan |
|---|---|---|---|---|
| 1 | Urgensi | 12% | 7 | Masalah mulai muncul, belum banyak korban di ID |
| 2 | Kebaruan di Indonesia | 12% | 9 | Istilah baru, belum ada format lokal |
| 3 | Kekuatan demo | 12% | 8 | Tolak/terima transaksi terlihat jelas |
| 4 | Feasibility | 10% | 9 | Teknologi matang |
| 5 | Unfair advantage | 8% | 8 | AgentPay |
| 6 | Dampak | 10% | 7 | Perlindungan konsumen & bisnis |
| 7 | Model bisnis | 8% | 5 | Pembayar belum divalidasi |
| 8 | Ambition ceiling | 8% | 8 | Rujukan nasional |
| 9 | Kesesuaian rubrik | 8% | ? | Tergantung lomba |
| 10 | Cerita/pitch | 6% | 9 | Mengutip langsung Wamen |
| 11 | Sinergi portofolio | 6% | 9 | tirai + Segel + AgentPay |

### 1.7 Workflow Stage 1
1. Cek ulang semua link di 📦.
2. Buat 3 varian sudut: **dev-first** (library), **regulasi-first** (spec + masukan), **fintech-first** (demo AgentPay). Beri skor.
3. Pilih satu, tulis one-liner, lalu minta persetujuan Adinda.

### 1.8 Pitch calibrator
- **One-liner:** "Jati: KTP untuk agen AI. Format terbuka berbahasa Indonesia untuk tahu siapa pemilik agen, apa izinnya, dan siapa yang tanggung jawab."
- **30 detik:** kutipan Wamen → agen tanpa kartu ditolak → "gratis, terbuka, bisa dicek di browser".
- **3 menit:** masalah → kenapa sekarang → isi kartu (6 pertanyaan) → demo AgentPay → posisi vs Visa/Google → siapa yang bayar → visi.

---

## 📄 STAGE 1.5 — PRD (1 halaman)

### Template
1. Ringkasan · 2. Masalah · 3. Persona · 4. Metrik · 5. Scope · 6. User stories · 7. Acceptance criteria · 8. Arsitektur · 9. Data & privasi · 10. Risiko · 11. Milestone · 12. Demo script · 13. Open questions

### PRD Jati (DRAFT)
1. **Ringkasan:** spec KYA terbuka + library TS + halaman cek + demo AgentPay.
2. **Masalah:** bisnis tidak bisa membedakan agen AI yang sah dari bot liar, dan tidak tahu siapa yang tanggung jawab.
3. **Persona (fiktif):**
   - *Budi, dev fintech:* ingin menerima agen AI tapi hanya yang jelas pemiliknya.
   - *Sari, legal/compliance:* butuh bukti tertulis batas kewenangan agen.
   - *Pak Joko, pemilik toko online:* ingin cek kartu agen tanpa paham kode.
4. **Metrik [target]:** verifikasi <50 ms di Node; halaman cek <2 dtk di HP menengah; 100% fixture rusak terdeteksi; ≥1 pengembang luar mencoba dalam 30 hari; spec dikutip atau disebut ≥1 media/komunitas [harapan, bukan janji].
5. **Scope:** lihat Scope MVP di 📦.
6. **User stories:**
   - Sebagai pemilik agen, saya jalankan `jati terbit` dan mendapat kartu bertanda tangan.
   - Sebagai dev, saya panggil `verifikasi(kartu, {aksi:'bayar', jumlah:250000})` dan dapat hasil `boleh`/`tolak` + alasan Indonesia.
   - Sebagai orang awam, saya tempel kartu di halaman cek dan paham hasilnya dalam satu kalimat.
7. **Acceptance criteria:**
   - Kartu valid → ✅ "Kartu asli. Pemilik: PT Contoh Jaya. Berlaku sampai 31 Des 2026."
   - Ubah satu karakter → ⚠️ "Kartu sudah diubah."
   - Lewat tanggal → ⏰ "Kartu kedaluwarsa." Ada di daftar cabut → ⛔ "Kartu sudah dicabut."
   - Penerbit tidak dikenal → 🔶 "Tanda tangan cocok, tapi penerbit belum dikenal."
   - Aksi di luar izin atau di atas limit → `tolak` + alasan.
   - Halaman cek tidak mengirim kartu ke server (dibuktikan dengan CSP + test).
8. **Arsitektur:** `spec/` → `packages/jati` (schema, sign, verify, policy check, revocation) → `packages/cli`, `apps/cek`, `examples/agentpay`.
9. **Data & privasi:** tanpa akun, tanpa server, tanpa upload. Kartu tanpa data pribadi sensitif. PRIVACY.md ID/EN.
10. **Risiko:** lihat 📦.
11. **Milestone:** lihat tabel rilis bertahap.
12. **Demo script:**
    1. Kutipan Wamen (teks, tanpa foto).
    2. Agen tanpa kartu mencoba bayar di AgentPay → ditolak.
    3. Pemilik menerbitkan kartu (limit Rp500.000/hari) → agen bayar Rp250.000 → diterima.
    4. Agen mencoba bayar Rp900.000 → ditolak "lewat batas".
    5. Pemilik mencabut kartu → transaksi berikutnya ditolak.
    6. Orang awam mengecek kartu di halaman cek.
13. **Open questions:**
    - Format v1: VC 2.0 Data Integrity atau VC-JOSE?
    - Bisakah PSrE/BSrE (tanda tangan elektronik Indonesia) dipakai sebagai penerbit? **Belum diverifikasi.**
    - Kaitan dengan UU PDP dan aturan AI Komdigi yang sedang disusun? **Perlu riset.**
    - Bagaimana menyalurkan masukan resmi ke Komdigi (kanal apa)?

### Field kartu v0.1 (draft untuk spec)
```json
{
  "jati": "0.1",
  "id": "urn:jati:contoh:agen-001",
  "agen": { "nama": "Asisten Belanja Contoh", "kunciPublik": "<ed25519 base64url>" },
  "pemilik": { "nama": "PT Contoh Jaya (fiktif)", "jenis": "badan_usaha", "id": "CONTOH-123" },
  "izin": ["baca_katalog", "bayar"],
  "batasBelanja": { "mataUang": "IDR", "perTransaksi": 300000, "perHari": 500000 },
  "penanggungJawab": { "nama": "PT Contoh Jaya (fiktif)", "kontak": "https://contoh.id/kontak" },
  "terbit": "2026-10-22T00:00:00+07:00",
  "berlakuSampai": "2026-12-31T23:59:59+07:00",
  "pencabutan": "https://adindamochamad.github.io/jati/cabut.json",
  "penerbit": "https://adindamochamad.github.io/jati/.well-known/jati.json"
}
```
Tanda tangan: JWS EdDSA atas JSON terkanonisasi (JCS / RFC 8785). Nama field Indonesia, dengan pemetaan ke Inggris di spec.

---

## 🛠️ STAGE 2 — Build (Metode ATM)

### Fase ATM
1. **Amati:** baca spec Visa TAP, AP2 mandate, W3C VC 2.0, ERC-8004, dan contoh RFC. Untuk UI: halaman cek CAI, gov.uk (bahasa awam), dokumentasi Stripe (contoh kode).
2. **Tiru:** struktur spec ala RFC/W3C (Abstrak, Terminologi, Model data, Keamanan, Privasi), alur "tempel → hasil" seperti verifier.
3. **Modifikasi:** bahasa Indonesia awam, field berbahasa Indonesia, IDR, contoh kasus lokal (toko online, fintech), ramah HP murah.

Urutan build: spec + schema + 1 kartu (Tahap 1) → library + test → CLI → halaman cek → demo AgentPay → polish → video.

### Manifesto Anti AI-Slop
**Copy:** tanpa kata "revolusioner", "seamless", "empower", "unlock". Kalimat pendek dan konkret. Hasil cek = satu kalimat dulu, detail di bawah.
**Visual & warna:** tanpa gradien ungu-biru dan glassmorphism. Palet terinspirasi **kartu identitas dan kayu jati**: coklat jati sebagai aksen, latar krem kertas, tinta gelap, biru KTP pucat untuk kartu. Status dibedakan dengan ikon + teks, bukan warna saja.
**Layout:** satu aksi utama per layar. Hindari grid 3 kartu fitur. Hero = **kartu agen nyata (fiktif)** yang bisa diklik untuk dicek.
**Tipografi:** maksimal 2 font. Teks dasar minimal 18px di halaman cek. Field kartu pakai monospace.
**Micro-interactions:** kartu "dibalik" saat dicek; stempel ✅ atau garis retak ⚠️. Durasi di bawah 300ms, hormati `prefers-reduced-motion`.
**Gambar:** tanpa stok foto, tanpa gambar AI generik, tanpa logo pemerintah atau perusahaan asli.
**Tes 3 detik:** orang asing harus paham "ini apa, klik apa". Uji ke 3 orang non-teknis.

### Three.js (opsional)
Hanya jika bermakna, misalnya kartu 3D yang berputar di hero. Lazy-load, ada fallback statis, dan tidak dipasang di alur verifikasi.

### Deployment
- Halaman cek + spec: GitHub Pages, CSP `connect-src 'self'`.
- Library: npm dengan provenance.
- CI: lint, test, build, gitleaks, validasi schema fixture.

### ✅ Checklist Final (15)
1. [ ] Spec v0.1 ID/EN live, bertag, bertanggal.
2. [ ] 1 kartu contoh bertanda tangan + kunci publik bisa diverifikasi.
3. [ ] Library di npm, test hijau.
4. [ ] CLI `terbit` dan `cek` jalan.
5. [ ] Halaman cek live dan berfungsi di HP.
6. [ ] 5 fixture (valid, diubah, kedaluwarsa, dicabut, lewat limit) terdeteksi benar.
7. [ ] Demo AgentPay jalan dari awal sampai akhir.
8. [ ] `.env.production` AgentPay sudah bersih dan kunci diganti.
9. [ ] Tidak ada secret di repo (gitleaks).
10. [ ] Label "usulan komunitas, bukan regulasi" terlihat jelas.
11. [ ] README dua bahasa + GIF; PRIVACY.md dua bahasa.
12. [ ] Lisensi: spec CC-BY 4.0, kode MIT.
13. [ ] Lolos tes 3 detik + aksesibilitas (kontras, keyboard, reduced-motion).
14. [ ] Video ≤3 menit + pitch 30 detik.
15. [ ] Tautan silang tirai/Segel/AgentPay + CHANGELOG.

---

## ✔️ Definition of Done
- **Tahap 1 selesai** jika spec dan kartu contoh bisa diakses publik dengan tanggal dan tag, dan siapa pun bisa memverifikasi tanda tangannya dengan perintah yang tertulis di README.
- **MVP selesai** jika 15 checklist tercentang dan demo AgentPay bisa diputar ulang oleh orang lain dari README.

---

## 🚦 Sinyal Mulai

Cursor, mulai dengan:
1. Ringkas pemahamanmu tentang Jati dalam 5 baris.
2. Tanya pertanyaan 0.1 yang belum terjawab.
3. Usulkan isi `spec/kya-v0.1.md` (daftar isi + field) untuk Tahap 1, lalu tunggu persetujuan.

---

## 📌 Aturan Penting
- Jangan mengarang data, statistik, klien, kutipan, atau link. Beri label **[tebakan]**.
- Kutipan Wamen hanya boleh dari sumber di 📦, kata per kata.
- Jangan mengklaim Jati sebagai standar resmi atau didukung Komdigi.
- Jangan pernah commit kunci privat atau `.env`.
- Semua contoh fiktif ("PT Contoh Jaya").
- Verifikasi di sisi klien, tanpa upload.
- Cek versi library terbaru, jangan klaim fitur yang belum dicoba.
- Selesaikan dan setujui setiap stage sebelum lanjut (kecuali Tahap 1 cap waktu).
- Kalau ragu, tanya Adinda.
