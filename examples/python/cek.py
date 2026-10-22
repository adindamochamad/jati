#!/usr/bin/env python3
"""Verifikasi JWS EdDSA kartu Jati dengan cryptography.

Cuplikan ini memeriksa header, tanda tangan, dan masa berlaku.
Pencabutan dan kebijakan tidak diperiksa.
Jangan membaca hasilnya sebagai "Kartu asli".
Keluar 0 hanya bila tanda tangan cocok dan waktu ada di dalam masa berlaku.
Waktu uji: env JATI_SEKARANG, bentuk 2026-10-21T12:00:00+07:00.
"""

from __future__ import annotations

import base64
import json
import os
import sys
from datetime import datetime, timezone

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey


def kanon(nilai: object) -> bytes:
    return json.dumps(nilai, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def b64url(data: str) -> bytes:
    pad = "=" * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode(data + pad)


def selesai(kalimat: str, kode: int) -> int:
    print(kalimat)
    return kode


def main() -> int:
    if len(sys.argv) != 3:
        print("Pakai: cek.py kartu.json jwks.json", file=sys.stderr)
        print("Usage: cek.py card.json jwks.json", file=sys.stderr)
        return 2
    with open(sys.argv[1], encoding="utf-8") as berkas:
        kartu = json.load(berkas)
    with open(sys.argv[2], encoding="utf-8") as berkas:
        jwks = json.load(berkas)
    if not isinstance(kartu, dict):
        return selesai("Kartu sudah diubah.", 1)
    tanda = kartu.get("tandaTangan")
    if not isinstance(tanda, str) or tanda.count(".") != 2:
        return selesai("Kartu sudah diubah.", 1)
    header_b64, payload_b64, sig_b64 = tanda.split(".")
    try:
        header = json.loads(b64url(header_b64))
    except (ValueError, json.JSONDecodeError):
        return selesai("Kartu sudah diubah.", 1)
    kid = header.get("kid") if isinstance(header, dict) else None
    if not isinstance(kid, str) or header != {"alg": "EdDSA", "kid": kid}:
        return selesai("Kartu sudah diubah.", 1)
    if b64url(header_b64) != json.dumps({"alg": "EdDSA", "kid": kid}, separators=(",", ":")).encode():
        return selesai("Kartu sudah diubah.", 1)
    kunci = None
    for item in jwks.get("keys", []) if isinstance(jwks, dict) else []:
        if item.get("kid") == kid and item.get("kty") == "OKP" and item.get("crv") == "Ed25519":
            kunci = item
            break
    if not isinstance(kunci, dict) or not isinstance(kunci.get("x"), str):
        return selesai("Kunci penerbit untuk kid ini tidak ada.", 1)
    try:
        pub = Ed25519PublicKey.from_public_bytes(b64url(kunci["x"]))
        pub.verify(b64url(sig_b64), f"{header_b64}.{payload_b64}".encode())
    except (InvalidSignature, ValueError):
        return selesai("Kartu sudah diubah.", 1)
    tanpa = dict(kartu)
    del tanpa["tandaTangan"]
    if b64url(payload_b64) != kanon(tanpa):
        return selesai("Kartu sudah diubah.", 1)
    terbit = instan(kartu.get("terbit"))
    sampai = instan(kartu.get("berlakuSampai"))
    kini = waktu_uji()
    if terbit is None or sampai is None or kini is None or terbit > sampai:
        return selesai("Kartu tidak sesuai format.", 1)
    if kini < terbit:
        return selesai("Kartu belum berlaku.", 1)
    if kini > sampai:
        return selesai("Kartu kedaluwarsa.", 1)
    return selesai("Tanda tangan cocok. Cuplikan Python ini tidak memeriksa pencabutan.", 0)


def instan(nilai: object) -> datetime | None:
    if not isinstance(nilai, str):
        return None
    try:
        saat = datetime.fromisoformat(nilai)
    except ValueError:
        return None
    if saat.tzinfo is None:
        return None
    return saat


def waktu_uji() -> datetime | None:
    lingkungan = os.environ.get("JATI_SEKARANG")
    if lingkungan:
        return instan(lingkungan)
    return datetime.now(timezone.utc)


if __name__ == "__main__":
    raise SystemExit(main())
