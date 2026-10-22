import { verifikasi, type JWKS, type OpsiVerifikasi } from "../../packages/jati/src/index.ts";

type Res = { status(kode: number): { send(teks: string): void } };
type Req = { body?: unknown };

/** Express middleware. Fastify memakai fungsi yang sama di preHandler. Tanpa jumlah, next() bukan izin belanja. */
export function tolakTanpaKartu(
  jwks: JWKS,
  dicabut: readonly string[],
  sekarang = new Date(),
  batas?: Pick<OpsiVerifikasi, "jumlah" | "terpakaiHariIni">,
) {
  return async (req: Req, res: Res, next: () => void) => {
    const hasil = await verifikasi(req.body, { jwksTepercaya: jwks, dicabut, sekarang, ...batas });
    if (!hasil.boleh) {
      res.status(403).send(hasil.kalimat);
      return;
    }
    next();
  };
}
