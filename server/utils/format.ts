export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function sanitizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ".");
}

export function normalizeEmail(email: string): string {
  return String(email || "").trim().toLowerCase();
}

export function normalizeCpf(cpf: string): string {
  return String(cpf || "").replace(/\D/g, "");
}

export function formatCpf(cpfDigits: string): string {
  const d = normalizeCpf(cpfDigits).padStart(11, "0").slice(-11);
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

export function isValidCpf(cpf: string): boolean {
  const d = normalizeCpf(cpf);
  return d.length === 11 && !/^(\d)\1+$/.test(d);
}
