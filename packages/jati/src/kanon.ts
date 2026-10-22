import canonicalize from "canonicalize";

/** UTF-8 JSON Canonicalization Scheme, RFC 8785. */
export function kanonisasi(nilai: unknown): string {
  const hasil = canonicalize(nilai);
  if (typeof hasil !== "string") {
    throw new TypeError("Nilai tidak bisa dikanonisasi");
  }
  return hasil;
}
