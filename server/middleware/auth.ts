import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import type { AuthenticatedRequest, JwtPayload } from "../types";

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Token ausente." });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }
}
