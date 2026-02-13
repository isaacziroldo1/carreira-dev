import fs from "node:fs";
import { CURRENT_SEED_VERSION, DATA_FILE } from "../config";
import type { DataStore, UserRecord } from "../types";
import { buildSeedData, defaultUsers, hasCurrentSchema, migrateLegacyData } from "./seed";

export function writeData(data: DataStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function ensureData(): void {
  if (!fs.existsSync(DATA_FILE)) {
    const seed = buildSeedData();
    writeData({
      seedVersion: CURRENT_SEED_VERSION,
      users: defaultUsers(),
      ...seed,
    });
    return;
  }

  const existing = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Partial<DataStore>;
  const users = Array.isArray(existing.users) && existing.users.length > 0 ? (existing.users as UserRecord[]) : defaultUsers();
  const version = Number(existing.seedVersion || 0);

  if (version < CURRENT_SEED_VERSION || !hasCurrentSchema(existing)) {
    const canMigrateLegacy = Array.isArray(existing.agendamentos) && existing.agendamentos.length > 0;
    if (canMigrateLegacy) {
      writeData(migrateLegacyData(existing, users));
      return;
    }

    const seed = buildSeedData();
    writeData({
      seedVersion: CURRENT_SEED_VERSION,
      users,
      ...seed,
    });
  }
}

export function readData(): DataStore {
  ensureData();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as DataStore;
}
