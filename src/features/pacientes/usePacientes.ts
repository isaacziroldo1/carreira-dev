import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../app/api";
import type { PacienteResumo, UsePacientesParams, UsePacientesResult } from "../../app/types";

export function usePacientes({ enabled, onLoadError }: UsePacientesParams): UsePacientesResult {
  const [pacientes, setPacientes] = useState<PacienteResumo[]>([]);
  const [filtroPaciente, setFiltroPaciente] = useState("");

  const reloadPacientes = useCallback(async () => {
    const res = await api<{ pacientes: PacienteResumo[] }>("/api/pacientes");
    setPacientes(res.pacientes);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reloadPacientes().catch((err) => {
      const message = err instanceof Error ? err.message : "Falha ao carregar pacientes";
      if (onLoadError) onLoadError(message);
    });
  }, [enabled, onLoadError, reloadPacientes]);

  const pacientesFiltrados = useMemo(() => {
    const t = filtroPaciente.trim().toLowerCase();
    return pacientes
      .filter((p) => !t || [p.nome, p.email, p.telefone, p.cpf].join(" ").toLowerCase().includes(t))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [pacientes, filtroPaciente]);

  return {
    pacientes,
    filtroPaciente,
    pacientesFiltrados,
    setFiltroPaciente,
    reloadPacientes,
  };
}
