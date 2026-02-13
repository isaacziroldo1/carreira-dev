import express from "express";
import cors from "cors";
import agendamentosRouter from "./routes/agendamentos";
import authRouter from "./routes/auth";
import pacientesRouter from "./routes/pacientes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/pacientes", pacientesRouter);
  app.use("/api/agendamentos", agendamentosRouter);

  return app;
}
