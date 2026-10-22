import { spawnSync, type SpawnSyncReturns } from "node:child_process";

export function assertSpawn(hasil: SpawnSyncReturns<string>, konteks: string): void {
  if (hasil.error) {
    throw new Error(`${konteks}: ${hasil.error.message}`);
  }
  if (hasil.signal) {
    throw new Error(`${konteks}: sinyal ${hasil.signal}`);
  }
}
