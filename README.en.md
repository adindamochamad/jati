# Jati

**A proposed KYA profile for Indonesia. Not a regulation. Not an official Komdigi standard. There is no issuer yet outside this repository's example.**

Jati is a signed-claim card format for AI agents: who owns it, what it may do, the spending limit, and who is accountable. The card is signed with Ed25519.

The signature shows which key wrote those fields. It does not show that the owner name is a bound identity, and it does not show that the agent is safe. Without an issuer trusted outside the card, this is a claim label, not an ID card.

The normative specification is [spec/kya-v0.1.md](spec/kya-v0.1.md) (Indonesian). [spec/kya-v0.1.en.md](spec/kya-v0.1.en.md) is the English translation. [Bahasa Indonesia](README.md).

## Check the example card

From the repository root:

```bash
pnpm install
pnpm verifikasi
```

The command reads [fixtures/valid.json](fixtures/valid.json) and the public key [fixtures/penerbit.public.jwks.json](fixtures/penerbit.public.jwks.json), then prints one sentence. On 21 October 2026 the result is:

```text
Kartu asli. Pemilik: PT Contoh Jaya (fiktif). Berlaku sampai 31 Des 2026.
```

The card is not sent over the network. This command treats the example key in the repository as a trust list, because you chose to run it here. That is not a national root list. The name PT Contoh Jaya (fiktif) remains a claim.

The command checks shape, signature, and the validity window against your machine clock. The example card is valid from 21 October 2026 00:00 WIB through the end of 31 December 2026. After that, the correct sentence is `Kartu kedaluwarsa.` To pin the clock in a test:

```bash
pnpm verifikasi -- --sekarang 2026-10-21T12:00:00+07:00
```

Change one character in a copy of the card and run the command again. The result is `Kartu sudah diubah.`

A matching key that you do not trust:

```bash
pnpm verifikasi -- --ditemukan --sekarang 2026-10-21T12:00:00+07:00
```

The result is `Tanda tangan cocok, penerbit belum dikenal.` The exit code is 1.

The command also reads [fixtures/cabut.json](fixtures/cabut.json). The example id is not on that list, so the success sentence means revocation was checked. Without a list, the result is not a genuine card:

```bash
pnpm verifikasi -- --tanpa-cabut --sekarang 2026-10-21T12:00:00+07:00
```

The result is: `Tidak pasti. Pencabutan belum bisa dicek.`

The command opens no network connection and does not send an amount, so spending limits are not checked. An amount that is already above the daily limit is rejected without today's spend. The rest of the daily limit can be checked only when the caller supplies today's spend. See [spec/kya-v0.1.en.md](spec/kya-v0.1.en.md).

## Repository

- [spec/kya-v0.1.md](spec/kya-v0.1.md) and [spec/kya-v0.1.en.md](spec/kya-v0.1.en.md), plus the [JSON Schema](spec/schema/jati-0.1.json) and the [test vectors](spec/vectors/v0.1.json)
- [packages/jati](packages/jati) exports `buatKartu`, `tandatangani`, `verifikasi`, `cekIzin`, `cekPencabutan`, and `daftarDariBerkas`, plus the English aliases `createCard`, `sign`, `verify`, `checkPermission`, `checkRevocation`, and `revocationIdsFromFile`
- [fixtures/valid.json](fixtures/valid.json) and [fixtures/cabut.json](fixtures/cabut.json)
- [scripts/verifikasi.ts](scripts/verifikasi.ts), the command above
- [apps/cek](apps/cek), the in-browser check page
- [examples](examples), Node, Python, and middleware snippets

## CLI

Node.js 22.18 or newer is required. From an empty directory:

```bash
pnpm exec jati kunci-baru
pnpm exec jati terbit --pemilik "PT Uji" --limit 500000
pnpm exec jati cek kartu.json
```

The third command prints `Tanda tangan cocok, penerbit belum dikenal.` The exit code is 1. A key you just created does not turn that name into an identity.

```bash
pnpm exec jati cek kartu.json --percaya
```

`--percaya` is an explicit statement that you trust the key next to the card. Only then is the sentence `Kartu asli`, and the exit code is 0. The owner name remains a claim, not an ID card.

`jati cek` exit codes: 0 only for `Kartu asli`, 3 for an unrecognized issuer, 1 for every other card result, 2 for a usage error.

`kunci-baru` writes `penerbit.private.jwk.json` and `penerbit.public.jwks.json`. `terbit` writes `kartu.json`, `agen.private.jwk.json`, and an empty `cabut.json` when that file does not yet exist. `cek` does not read the agent private key. Copying `kartu.json` is enough to get the same sentence. `cek` without `cabut.json` prints `Tidak pasti. Pencabutan belum bisa dicek.` A revocation file without `jati` `"0.1"` is rejected. After publication, the same commands run through `npx @adindamochamad/jati`. The package is not published yet.

## Check page

```bash
pnpm cek
```

Open the printed address. The page uses local assets, fetches the revocation list only from the same origin, and works offline after it has been opened once. Offline, or when the revocation file does not contain `jati` `"0.1"`, revocation says it could not be checked. Provide a card by pasting JSON, uploading a file, or scanning a QR code. Amount and today's spend are optional. Empty means spending limits are not checked. The success sentence means the key you pasted signed those fields. The owner name remains a claim.

## Snippets

Node, from the repository root: `node --experimental-strip-types examples/node/cek.ts`

Python, after `cryptography` is installed:

```bash
python3 examples/python/cek.py fixtures/valid.json fixtures/penerbit.public.jwks.json
```

The Python snippet checks the signature and the validity window. Its sentence is not "Kartu asli". A card outside the validity window exits with status 1. Tests pin the clock with the `JATI_SEKARANG` environment variable.

The Express/Fastify middleware is [examples/middleware/express.ts](examples/middleware/express.ts).

## Five local cases

```bash
pnpm demo
```

It rejects a missing card, an amount over the limit, a revoked card, and an expired card, then accepts one card that passes. This is a library test, not a product that uses Jati, and not an AgentPay demo. Payment links and a payment demo stay held: see [docs/kepercayaan.md](docs/kepercayaan.md).

## Library

| Spec | Package |
|---|---|
| 0.1, 22 October 2026 | 0.1.0, not published to npm yet |

Tested on 21 October 2026 with `canonicalize` 5.1.0, `jose` 6.2.13, and Node.js 22.18 or newer. `canonicalize` implements RFC 8785. `jose` verifies EdDSA JWS; v0.1 does not implement cryptography itself. The schema remains [spec/schema/jati-0.1.json](spec/schema/jati-0.1.json) and is checked by library code, without Ajv at runtime, so the browser bundle stays under 30 KB gzip. Ajv is used only by the schema check in CI. `pnpm ukuran` prints the size and fails if that limit is exceeded. On 21 October 2026 the result was 9859 bytes gzip. The RFC 8785 section 3.2.4 canonicalization vector is in the tests. W3C VC 2.0 compatibility is not claimed. The VC-shaped example in spec section 13 is non-normative.

```bash
pnpm test
```

## Comparisons

Jati is a proposed KYA profile for Indonesia, not the first KYA format in the world and not a competing format against W3C VC 2.0. A search on 21 October 2026 did not find an open Indonesian-language card format. That is a search result, not proof that nothing else exists.

- [KYA-OS](https://github.com/decentralized-identity/kya-os-mcp/blob/main/SPEC.md)
- [KYA Manifest](https://open-kya.github.io/kya-standard/spec/index.html)
- [IETF Skyfire KYAPay draft](https://datatracker.ietf.org/doc/html/draft-skyfire-oauth-kyapay-token) (2 October 2026)
- [knowyouragent.ch profile](https://knowyouragent.ch/en/standard/verification-profile)
- [W3C VC 2.0](https://www.w3.org/TR/vc-data-model-2.0/)

The KYA statement cited in the spec is the [Komdigi press release of 15 October 2026](https://portal.komdigi.go.id/kanal-publik/berita-kini/10603).

## Keys

`pnpm terbitkan-contoh` rewrites the example card with keys in `keys/`. That directory is gitignored. Do not copy a private key into another file. The committed JWKS contains only the public `x` component.

`https://adindamochamad.github.io/jati/.well-known/jati.json` is a planned address. The file is not deployed to GitHub Pages yet.

## License

Software: [MIT](LICENSE), © 2026 Adinda Panca Mochamad.

The specification in `spec/`: [CC-BY 4.0](spec/LICENSE).

## Documents

[CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [SECURITY.md](SECURITY.md), [CHANGELOG.md](CHANGELOG.md), [trust](docs/kepercayaan.md), [threat model](docs/threat-model.md), [v0.1 decisions](docs/keputusan-v0.1.md).

## Privacy

[PRIVACY.md](PRIVACY.md). No accounts, no uploads, fictional examples.
