import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_TTL } from "../config";
import { readData } from "../data/store";
import { authMiddleware } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";

const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const username = String(req.body?.username || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!username || !password) {
    return res.status(400).json({ message: "Informe usuario e senha." });
  }

  const data = readData();
  const user = data.users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Usuario ou senha invalidos." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Usuario ou senha invalidos." });
  }

  const token = jwt.sign({ user: user.username }, JWT_SECRET, { expiresIn: TOKEN_TTL });
  return res.json({ token, user: user.username });
});

authRouter.get("/me", authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user?.user || "" });
});

export default authRouter;
