import type { Agendamento } from "./types";

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return "-";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function patientName(ag: Agendamento): string {
  return ag.paciente?.nome || "Paciente";
}

export function patientPhone(ag: Agendamento): string {
  return ag.paciente?.telefone || "-";
}

export function patientEmail(ag: Agendamento): string {
  return ag.paciente?.email || "-";
}
