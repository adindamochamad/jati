export function byteLength(teks: string): number {
  return new TextEncoder().encode(teks).byteLength;
}

export function jsonLebihBesarDari(nilai: unknown, batas: number): boolean {
  try {
    return byteLength(JSON.stringify(nilai)) > batas;
  } catch {
    return true;
  }
}

export function dariBase64Url(teks: string): Uint8Array | undefined {
  if (teks.length === 0 || teks.length % 4 === 1 || !/^[A-Za-z0-9_-]+$/.test(teks)) return undefined;
  const berpad = teks + "=".repeat((4 - (teks.length % 4)) % 4);
  try {
    const biner = atob(berpad.replace(/-/g, "+").replace(/_/g, "/"));
    const byte = new Uint8Array(biner.length);
    for (let i = 0; i < biner.length; i += 1) byte[i] = biner.charCodeAt(i);
    return byte;
  } catch {
    return undefined;
  }
}

export function keBase64Url(byte: Uint8Array): string {
  let biner = "";
  for (const nilai of byte) biner += String.fromCharCode(nilai);
  return btoa(biner).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

export function samaByte(kiri: Uint8Array, kanan: Uint8Array): boolean {
  if (kiri.byteLength !== kanan.byteLength) return false;
  let beda = 0;
  for (let i = 0; i < kiri.byteLength; i += 1) beda |= (kiri[i] ?? 0) ^ (kanan[i] ?? 0);
  return beda === 0;
}
