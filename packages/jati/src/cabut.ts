export type StatusPencabutan = "dicabut" | "bersih" | "tidak_pasti";

export function daftarDariBerkas(nilai: unknown): readonly string[] | undefined {
  if (!nilai || typeof nilai !== "object" || Array.isArray(nilai)) return undefined;
  const rekam = nilai as { jati?: unknown; dicabut?: unknown };
  if (rekam.jati !== "0.1" || !Array.isArray(rekam.dicabut)) return undefined;
  if (rekam.dicabut.some((id) => typeof id !== "string")) return undefined;
  return rekam.dicabut;
}

/** Daftar yang tidak diisi bukan daftar kosong. Kosong berarti sudah diperiksa. */
export function cekPencabutan(id: string, dicabut: readonly string[] | undefined): StatusPencabutan {
  if (dicabut === undefined) return "tidak_pasti";
  return dicabut.includes(id) ? "dicabut" : "bersih";
}
