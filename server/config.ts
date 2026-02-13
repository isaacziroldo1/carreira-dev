import path from "node:path";

export const PORT = Number(process.env.PORT || 3001);
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
export const TOKEN_TTL = "8h";
export const DATA_FILE = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.resolve(process.cwd(), "data.json");
export const CURRENT_SEED_VERSION = 4;
