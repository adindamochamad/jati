# Jati Card v0.1

SPDX-License-Identifier: CC-BY-4.0

**A proposed KYA profile for Indonesia. Not a regulation. Not an official Komdigi standard.**

| | |
|---|---|
| Version | 0.1 |
| Date | 22 October 2026 |
| Editor | Adinda Panca Mochamad |
| Normative language | Indonesian. This English text follows [spec/kya-v0.1.md](kya-v0.1.md). If they differ, the Indonesian text wins. |
| License | [CC-BY 4.0](LICENSE) |
| Schema | [schema/jati-0.1.json](schema/jati-0.1.json) |

**HARUS**, **TIDAK BOLEH**, **SEBAIKNYA**, and **BOLEH** in the Indonesian text mean MUST, MUST NOT, SHOULD, and MAY as in RFC 2119. This translation uses the English words.

## 1. Status and abstract

Jati is a proposed KYA (Know Your Agent) profile for Indonesia. The profile uses Indonesian field names and maps onto W3C Verifiable Credentials 2.0 terms. Jati is not a competing format against VC, Visa TAP, or Google AP2.

One card carries claims: who owns the agent, what the agent may do, the rupiah spending limits, who is accountable, how long the card lasts, and where the revocation list is.

The card is signed with Ed25519. A verifier can tell an intact card from one that was altered, is not yet valid, has expired, has been revoked, or was signed by a key the verifier does not recognize.

The signature shows that the issuer key wrote those fields. It does not show that `pemilik.nama` is a bound identity, it does not show that the agent is safe, it does not show that the presenter holds the agent private key, and it does not make Jati a government rule. Without an issuer the verifier already trusts outside the card, Jati is only a claim label. See section 7.

On 15 October 2026, Vice Minister of Communication and Digital Nezar Patria said, in a Komdigi press release: "Bukan lagi KYC, Know Your Customer, tapi harus ada KYA, Know Your Agent." The same release says that the use of AI agents needs to be accompanied by an understanding of identity, ownership, and the limits of their authority, and it quotes: "Masukan tersebut diperlukan untuk membantu mengidentifikasi risiko dan mendalami kebutuhan pengaturan teknis seiring perkembangan AI." Source: <https://portal.komdigi.go.id/kanal-publik/berita-kini/10603>. Jati maps those three points onto card fields. Jati is a community submission, not a Komdigi document.

A search on 21 October 2026 did not find an open Indonesian-language KYA card format. That is a search result, not proof that no other format exists, and not a claim of being first. The term KYA is already used abroad. Comparison formats are listed in section 12.

## 2. Terminology

- **Card**: a JSON object that matches the schema and contains `tandaTangan`.
- **Issuer**: the party that holds the Ed25519 private key and signs the card.
- **Owner**: the person or company that operates the agent.
- **Agent**: the software that acts. The card carries its name and public key.
- **Accountable party**: the party to contact if the agent acts outside its limits.
- **Verifier**: the party that checks the card before accepting an action.
- **kid**: the issuer key name in the JWS header and in the JWKS.
- **Self-issued card**: a card signed by a key the user just created, usually with `jati kunci-baru`.
- **Trust list**: the JWKS the verifier already chose outside the card (`jwksTepercaya`).
- **Identity binding**: the issuer's procedure for checking the owner before signing. That binding is not a v0.1 card field.

## 3. Six questions

1. Who owns it? `pemilik`.
2. What may the agent do? `izin`.
3. What is the spending limit? `batasBelanja`, in IDR.
4. Who is accountable? `penanggungJawab`.
5. How long is it valid? `terbit` and `berlakuSampai`.
6. Is it still active? `pencabutan`, plus the list the verifier supplies.

## 4. Data model

JSON member names MUST stay Indonesian, as in this table. The English names are for this document. v0.1 does not accept English aliases.

| Field | English | Contents |
|---|---|---|
| `jati` | jati | MUST be `"0.1"` |
| `id` | id | `urn:jati:` followed by a lowercase identifier |
| `agen.nama` | agent.name | display name |
| `agen.kunciPublik` | agent.publicKey | agent Ed25519 public key, 32 bytes, unpadded base64url |
| `pemilik.nama` | owner.name | owner name |
| `pemilik.jenis` | owner.kind | `orang` or `badan_usaha` |
| `pemilik.id` | owner.id | an identifier chosen by the issuer |
| `izin` | permissions | action list. Member order is signed |
| `batasBelanja.mataUang` | spendingLimit.currency | MUST be `IDR` |
| `batasBelanja.perTransaksi` | spendingLimit.perTransaction | integer rupiah, no cents |
| `batasBelanja.perHari` | spendingLimit.perDay | integer rupiah |
| `penanggungJawab.nama` | accountableParty.name | party name |
| `penanggungJawab.kontak` | accountableParty.contact | `https` URL |
| `terbit` | issuedAt | RFC 3339 with a numeric offset |
| `berlakuSampai` | validUntil | RFC 3339 with a numeric offset |
| `pencabutan` | revocation | `https` URL of the revocation list |
| `penerbit` | issuer | `https` URL hint for the JWKS |
| `tandaTangan` | signature | compact JWS. This member is not signed |

Further rules:

- The signed document MUST match the JSON Schema. Members outside the schema MUST NOT appear.
- `terbit` MUST be earlier than or equal to `berlakuSampai`.
- The offset `Z` MUST NOT be used. A numeric offset keeps the local time visible. The example uses `+07:00`.
- `izin` MUST contain at least one action. Action names use lowercase letters, digits, and underscores. `bayar` is the action that spends `batasBelanja`. Other names are defined by the issuer.
- `perHari` SHOULD be greater than or equal to `perTransaksi`.
- Amounts MUST be integers from 0 through 9007199254740991. No fractions.
- `pemilik.id` is an issuer identifier, not a national ID number. The example `CONTOH-123` is fictional.
- `agen.nama`, `pemilik.nama`, and `penanggungJawab.nama` MUST be 1 to 200 characters and MUST NOT contain U+0000–U+001F, U+007F–U+009F, U+2028, or U+2029.
- An issuer MUST NOT put a national ID number, passport number, phone number, or home address on the card.
- `agen.kunciPublik` is the agent key, not the issuer key. The issuer key appears as the JWS `kid` and in the JWKS.
- The UTF-8 JSON of the card MUST NOT exceed 65536 bytes.

The schema `$id` is the address planned for later publication. A v0.1 verifier uses the schema file in this repository and does not fetch `$id`.

## 5. Fictional example

The owner, the agent, and the `contoh.id` URL below are fictional. This card was signed on 21 October 2026 and is valid through the end of 31 December 2026. The same file is [fixtures/valid.json](../fixtures/valid.json). The issuer public key is [fixtures/penerbit.public.jwks.json](../fixtures/penerbit.public.jwks.json). The private key is not included.

Five cases for other implementations are in [vectors/v0.1.json](vectors/v0.1.json): valid, altered, expired, revoked, and over the limit. That file includes the public key. Each case includes the card, the `sekarang` time, the `dicabut` list, and the expected sentence.

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

The `penerbit` and `pencabutan` URLs are deployed on GitHub Pages. In v0.1 the example is still checked with the local JWKS file. The library does not download those URLs.

## 6. Canonicalization and signature

1. Take the card object and remove the `tandaTangan` member.
2. Canonicalize the rest with the JSON Canonicalization Scheme, [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785). The result is JSON with no whitespace, properties ordered by UTF-16 code units, encoded as UTF-8.
3. Sign those UTF-8 bytes as a compact JWS payload, algorithm `EdDSA`, using the issuer Ed25519 key.
4. The protected header MUST be exactly `{"alg":"EdDSA","kid":"<kid>"}` with no whitespace and no other members. `<kid>` matches `^[A-Za-z0-9._:-]{1,128}$`.
5. Store the compact JWS in `tandaTangan`.

Field order in a pretty-printed file does not matter. The order of `izin` members does.

A verifier MUST:

- reject a header whose `alg` is not `EdDSA`, whose member order differs, or which has extra members, including `typ` and `crit`;
- verify the signature with the Ed25519 key that has the same `kid`;
- recompute RFC 8785 canonicalization of every field except `tandaTangan`;
- reject the card when the JWS payload bytes differ from that result.

The JWS payload repeats the card. The visible fields and the payload MUST match. Changing one field without replacing the signature MUST fail, even when the signature inside the JWS is still valid for the old payload.

The reference implementation uses `canonicalize` 5.1.0 and `jose` 6.2.13. Agreement with the RFC 8785 section 3.2.4 vector is tested in this repository. Agreement with the W3C `eddsa-jcs-2022` proof is not claimed: the envelope differs. v0.1 puts a compact JWS in `tandaTangan`, not in a `proof` object.

## 7. Issuer key

An issuer JWKS is an object `{"keys":[...]}`. Each key that is used MUST have:

- `kty`: `OKP`
- `crv`: `Ed25519`
- `alg`: `EdDSA` when present
- `use`: `sig` when present
- `kid`: the same value as the JWS header `kid`
- `x`: the public key, base64url

A `kid` MUST be unique inside one JWKS. The private component `d` MUST NOT appear in a published JWKS.

This example file is at `https://adindamochamad.github.io/jati/.well-known/jati.json`. The v0.1 library does not fetch that file. The verifier supplies a JWKS it already trusts, or a JWKS it has found and does not yet trust. The `penerbit` URL is a hint, not a trust decision.

Checking a card answers at most two of three questions. The third is not in the card.

1. **Integrity.** Did this key sign these fields? That is the signature check.
2. **Issuer recognition.** Has the verifier already put this key on the trust list, outside the card? That is `jwksTepercaya` versus `jwksDitemukan`.
3. **Identity binding.** Did the issuer, before signing, check that `pemilik` is the person or company named? That is issuer procedure. A PSrE, BSrE, marketplace, bank, or the verifier's own issuance desk can fill that role. v0.1 has no field for it, and no national root list.

`Kartu asli` may only come from layers 1 and 2. The name in the sentence is a signed claim. Anyone who creates their own key can write any `pemilik.nama`. A verifier that puts that key in `jwksTepercaya` is saying it trusts the issuer, not that the state or a PSrE bound the name.

`jati kunci-baru` then `jati terbit` makes a self-issued card. That is a format test. The reference implementation MUST NOT write `Kartu asli` for a self-issued card unless the caller explicitly says it trusts that key (`--percaya` on the CLI, or `jwksTepercaya` in the API). Without that statement, the result MUST be `penerbit_belum_dikenal`. A JWKS sitting next to the card is not a trust list. Downloading a JWKS from the `penerbit` URL is not one either.

v0.1 ships no root list. A verifier MUST build its own trust list. The keys that SHOULD go on that list are only issuer keys the verifier already knows outside the card, and that have an identity-binding procedure the verifier accepts, or that belong to the verifier's own issuance desk.

Plausible Indonesian issuers, not bound in v0.1: a PSrE, a BSrE, a marketplace, a bank, or an institution that already checked the owner. Whether a PSrE or BSrE certificate can be used directly as a Jati Ed25519 key has not been checked. Until such an issuer exists, Jati is a signed-claim format, not an identity system.

## 8. Verification rules

A verifier MUST stop at the first failure, in this order.

1. **Shape.** Not an object, larger than 65536 bytes, schema mismatch, or `agen.kunciPublik` is not a canonical 32-byte base64url value. Result: invalid format.
2. **Header.** The JWS is not compact, or the protected header is not exactly `{"alg":"EdDSA","kid":"<kid>"}`. Result: altered.
3. **Key.** No matching public key in the trusted JWKS or the discovered JWKS. Result: key missing.
4. **Signature.** The signature does not match that key, or the payload differs from the recomputed canonicalization. Result: altered. If the `kid` is in the trusted JWKS and the signature fails, the result is altered. The verifier does not fall through to an untrusted key.
5. **Revocation.** When a `dicabut` list is supplied and `id` is in it: revoked. An empty list means the list was supplied and that `id` is not revoked. When `dicabut` is omitted, this step does not decide.
6. **Validity window.** `sekarang` before `terbit`: not yet valid. `sekarang` after `berlakuSampai`: expired. Both bounds are inclusive. There is no clock skew tolerance: the verifier's supplied time is used as given, with no shift. One millisecond before `terbit` is not yet valid. One millisecond after `berlakuSampai` is expired. The date in the result sentence is the calendar date written in `berlakuSampai`, not a conversion into the machine's time zone.
7. **Issuer recognition.** The signature matches only the discovered JWKS, not the trusted JWKS: issuer not recognized.
8. **Policy**, only when the verifier sets `aksi` or `jumlah`.
   - `jumlah` without `aksi` is checked as the `bayar` action.
   - an `aksi` that is not in `izin`: reject.
   - an `aksi` other than `bayar` together with `jumlah`: reject. The spending limit applies only to `bayar`.
   - `bayar` without `jumlah`: reject.
   - a `jumlah` or `terpakaiHariIni` that is not an integer ≥ 0: reject.
   - `jumlah` greater than `perTransaksi`: reject. A value equal to the limit still passes.
   - when `jumlah` is greater than `perHari`: reject, even if `terpakaiHariIni` is omitted.
   - when `terpakaiHariIni` is set: reject if `terpakaiHariIni + jumlah` is greater than `perHari`. A value equal to the limit still passes.
   - when `terpakaiHariIni` is omitted and `jumlah` is less than or equal to `perHari`, the rest of the daily limit is NOT checked.

`perTransaksi` can be checked from the card plus `jumlah`. A `jumlah` that is already greater than `perHari` is also rejected from the card alone. The rest of `perHari` cannot be checked from the card alone, because the card does not store a spending history.

Negative results that do not need a list (shape, alteration, missing key, validity window, unrecognized issuer, or a policy rejection) are still reported. Those results do not claim the card is unrevoked.

If the checks would otherwise reach `asli` but `dicabut` was omitted, the result MUST be `tidak_pasti` with the sentence `Tidak pasti. Pencabutan belum bisa dicek.` A verifier MUST NOT write `Kartu asli` in that case. A failed fetch MUST NOT be replaced with an empty list.

## 9. Revocation list

The v0.1 list is static JSON:

```json
{
  "jati": "0.1",
  "dicabut": ["urn:jati:contoh:agen-dicabut"]
}
```

`dicabut` is a list of card `id` values. This list is not signed in v0.1. Trust in the list comes from the HTTPS location the verifier uses, not from a signature inside the file. A downloader that cannot fetch the list MUST produce `tidak_pasti` when no other negative result applies. That downloader MUST NOT replace the failure with an empty list and MUST NOT treat the card as unrevoked.

The library accepts an `id` list from the caller and does not open a network connection. The same example file is [fixtures/cabut.json](../fixtures/cabut.json). A file reader, including the CLI and the check page, MUST reject a file whose `jati` is not `"0.1"` or whose `dicabut` is not a list of strings. That file is not a list and MUST NOT be treated as an empty list. The check page fetches a list only from the same origin, so a `connect-src 'self'` policy still holds. If the fetch fails, the file is not valid, or the browser is offline, the page does not treat a cached copy as a completed revocation check. The page status names that origin's list and does not say the list is signed.

The `id` in the section 5 example is not in the list above.

## 10. Result sentences

The Indonesian sentences below are normative for the reference implementation. `boleh` is true only when the status is `asli`. English text in this section is informative.

| Status | Normative sentence |
|---|---|
| `tidak_sesuai_format` | Kartu tidak sesuai format. |
| `diubah` | Kartu sudah diubah. |
| `kunci_tidak_ada` | Kunci penerbit untuk kid ini tidak ada. |
| `dicabut` | Kartu sudah dicabut. |
| `tidak_pasti` | Tidak pasti. Pencabutan belum bisa dicek. |
| `belum_berlaku` | Kartu belum berlaku. |
| `kedaluwarsa` | Kartu kedaluwarsa. |
| `penerbit_belum_dikenal` | Tanda tangan cocok, penerbit belum dikenal. |
| `tolak` | Tolak. followed by a specific reason |
| `asli` | Kartu asli. Pemilik: {nama}. Berlaku sampai {tanggal}. |

`tolak` reasons:

- `Tolak. Aksi tidak sah.`
- `Tolak. Aksi "{aksi}" tidak ada di izin.`
- `Tolak. Batas belanja hanya berlaku untuk aksi bayar.`
- `Tolak. Aksi bayar membutuhkan jumlah.`
- `Tolak. Jumlah harus bilangan bulat nol atau lebih.`
- `Tolak. Pemakaian hari ini harus bilangan bulat nol atau lebih.`
- `Tolak. Jumlah Rp300.001 melewati batas per transaksi Rp300.000.`
- `Tolak. Pemakaian hari ini menjadi Rp500.001, melewati batas Rp500.000.`

Rupiah is written with no space and no cents, with a dot as the thousands separator: `Rp300.000`. Dates use the abbreviations Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agu, Sep, Okt, Nov, Des. The section 5 example produces: `Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.`

The reference command `jati cek` exits 0 only for status `asli`. Status `penerbit_belum_dikenal` exits 3, so a script does not treat it as a pass. Every other card status exits 1. Exit 2 is a command-usage error, not a card result.

"Kartu asli" means three things at once: a key on the trust list signed those fields, the validity window matches, and the id is not in the list the verifier supplied. The sentence does NOT mean the owner has been bound as the named person or company. The name in the sentence is a signed field. Anyone can write that name on a self-issued card. A verifier that uses `--percaya` or `jwksTepercaya` is saying it trusts the key, not that a PSrE, marketplace, or bank bound the name. The sentence does not prove the agent is safe. Copying the card is enough to get the same sentence. A missing list does not produce "Kartu asli". When the verifier supplies `jumlah`, the section 8 rules also decide the result. Without `jumlah`, spending limits are not checked.

The reference implementation also fills a stable `kode`, for example `JATI_OK`, `JATI_EXPIRED`, and `JATI_REVOCATION_UNCHECKED`, plus an informative `kalimatEn`. The code and the English sentence are not normative.

## 11. Security and privacy

- Issuer private keys and agent private keys must not enter the repository, git history, or a public JWKS.
- The card is not secret. Copying a card does not prove that the presenter holds the agent private key. Proof of possession is outside v0.1.
- A verifier MUST reject algorithms other than `EdDSA`, including header `none`.
- Trust in the issuer key is the verifier's decision. Downloading a JWKS does not by itself make that key trusted. A key the user just created is not trusted by default.
- The v0.1 revocation list is not signed.
- The reference library opens no network connection and does not upload the card.
- Examples in this specification are fictional.

## 12. Out of scope for v0.1

These items are intentionally not normative yet:

- W3C Verifiable Credentials 2.0 and the `eddsa-jcs-2022` proof. The mapping below is informative, not a compatibility claim. The table and the converted example are in section 13. Both are non-normative.
- Bitstring Status List, SD-JWT, and selective disclosure.
- ERC-8004 and an on-chain registry.
- Visa Trusted Agent Protocol and Google AP2 as normative dependencies. A verifier may compare a Jati spending limit with an AP2 mandate. v0.1 defines no mapping.
- Identity binding through a PSrE, BSrE, marketplace, or bank. Section 7 explains why that is required. v0.1 ships no root list and does not bind a PSrE or BSrE certificate to a Jati Ed25519 key.
- A daily spending ledger. The rest of `perHari` still needs `terpakaiHariIni` from the verifier. A `jumlah` already greater than `perHari` is rejected without that ledger.
- Proof that the presenter controls `agen.kunciPublik`.

Informative mapping onto VC 2.0 terms: `penerbit` ~ issuer, `id` ~ id, `terbit` ~ validFrom, `berlakuSampai` ~ validUntil, `agen` together with the owner and permissions ~ credentialSubject, `tandaTangan` ~ proof. The v0.1 JWS envelope is not a VC proof object.

Existing formats, listed as comparisons:

- [KYA-OS](https://github.com/decentralized-identity/kya-os-mcp/blob/main/SPEC.md), identity and delegation for MCP.
- [KYA Manifest](https://open-kya.github.io/kya-standard/spec/index.html).
- [IETF Skyfire KYAPay draft](https://datatracker.ietf.org/doc/html/draft-skyfire-oauth-kyapay-token), 2 October 2026.
- [knowyouragent.ch verification profile](https://knowyouragent.ch/en/standard/verification-profile).
- [W3C VC 2.0](https://www.w3.org/TR/vc-data-model-2.0/).

Jati is a proposed KYA profile for Indonesia, not the first KYA format in the world and not a competing format against VC 2.0. The intended extras are Indonesian field names, IDR limits, a ban on national ID numbers and direct contact details on the card in the direction of Law 27 of 2022, a result sentence that can be read without a cryptography term on the first line, and room for AI risk categories in the draft Perpres on AI ethics (low, high, unacceptable) if that rule is issued. The v0.1 JWS envelope is an implementation choice. The meaning of the claims follows the VC model: issuer, subject, validity window, status.

## 13. VC 2.0 shape example (non-normative)

This section is non-normative. The example below is not a Jati card, has not been tested with a VC 2.0 verifier, and is not a compatibility claim. The v0.1 JWS envelope is not converted into a `proof` object.

| Jati field | VC 2.0 term | Note |
|---|---|---|
| `penerbit` | `issuer` | A hint URL, not a trust decision |
| `id` | `credentialSubject.id` | |
| `terbit` | `validFrom` | |
| `berlakuSampai` | `validUntil` | |
| `agen`, `pemilik`, `izin`, `batasBelanja` | `credentialSubject` | |
| `pencabutan` | `credentialStatus.id` | Not a Bitstring Status List |
| `tandaTangan` | not a `proof` | The v0.1 compact JWS differs from a VC proof |

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
