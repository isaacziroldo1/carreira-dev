import { useEffect, useState } from "react";
import { api } from "../../app/api";
import type {
  Agendamento,
  NovoRegistroState,
  Paciente,
  PacienteResumo,
  ProntuarioPaciente,
  TipoRegistroClinico,
  UseProntuarioParams,
  UseProntuarioResult,
} from "../../app/types";
import { toIsoDate } from "../../app/utils";

export function useProntuario({
  enabled,
  view,
  reloadAgendamentos,
  reloadPacientes,
}: UseProntuarioParams): UseProntuarioResult {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [prontuario, setProntuario] = useState<ProntuarioPaciente | null>(null);
  const [historicoPaciente, setHistoricoPaciente] = useState<Agendamento[]>([]);
  const [prontuarioLoading, setProntuarioLoading] = useState(false);
  const [prontuarioFeedback, setProntuarioFeedback] = useState("");
  const [novoRegistro, setNovoRegistro] = useState<NovoRegistroState>({
    data: toIsoDate(new Date()),
    tipo: "Observacao",
    descricao: "",
  });

  useEffect(() => {
    if (!enabled || view !== "paciente" || !pacienteSelecionado?.id) return;
    setProntuarioLoading(true);
    setProntuarioFeedback("");
    Promise.all([
      api<{ prontuario: ProntuarioPaciente; paciente: Paciente }>(`/api/pacientes/${encodeURIComponent(pacienteSelecionado.id)}/prontuario`),
      api<{ agendamentos: Agendamento[] }>(`/api/pacientes/${encodeURIComponent(pacienteSelecionado.id)}/agendamentos`),
    ])
      .then(([prontuarioRes, historicoRes]) => {
        setProntuario(prontuarioRes.prontuario);
        setPacienteSelecionado(prontuarioRes.paciente);
        setHistoricoPaciente(historicoRes.agendamentos);
      })
      .catch((err) => setProntuarioFeedback(err instanceof Error ? err.message : "Falha ao carregar prontuario"))
      .finally(() => setProntuarioLoading(false));
  }, [enabled, view, pacienteSelecionado?.id]);

  function abrirPacienteByAgendamento(ag: Agendamento) {
    if (!ag.paciente) return;
    setPacienteSelecionado(ag.paciente);
    setProntuario(null);
    setHistoricoPaciente([]);
    setProntuarioFeedback("");
  }

  function abrirPacienteResumo(p: PacienteResumo) {
    setPacienteSelecionado(p);
    setProntuario(null);
    setHistoricoPaciente([]);
    setProntuarioFeedback("");
  }

  function atualizarIdentificacaoPaciente(campo: "nome" | "telefone" | "email" | "cpf", valor: string) {
    setPacienteSelecionado((atual) => (atual ? { ...atual, [campo]: valor } : atual));
  }

  function atualizarCampoProntuario(campo: "observacoes" | "diagnosticos" | "examesRealizados", valor: string) {
    setProntuario((atual) => (atual ? { ...atual, [campo]: valor } : atual));
  }

  function adicionarRegistroProntuario() {
    if (!novoRegistro.descricao.trim()) {
      setProntuarioFeedback("Descreva o registro clinico antes de adicionar.");
      return;
    }
    setProntuario((atual) => {
      if (!atual) return atual;
      const novo = {
        id: crypto.randomUUID(),
        data: novoRegistro.data || toIsoDate(new Date()),
        tipo: novoRegistro.tipo,
        descricao: novoRegistro.descricao.trim(),
      };
      return { ...atual, registros: [novo, ...atual.registros] };
    });
    setNovoRegistro({ data: toIsoDate(new Date()), tipo: "Observacao", descricao: "" });
    setProntuarioFeedback("");
  }

  function removerRegistroProntuario(id: string) {
    setProntuario((atual) => (atual ? { ...atual, registros: atual.registros.filter((r) => r.id !== id) } : atual));
  }

  function limparNovoRegistro() {
    setNovoRegistro({ data: toIsoDate(new Date()), tipo: "Observacao", descricao: "" });
    setProntuarioFeedback("");
  }

  async function salvarCadastroPaciente() {
    if (!pacienteSelecionado) return;
    setProntuarioFeedback("");
    try {
      const res = await api<{ paciente: Paciente }>(`/api/pacientes/${encodeURIComponent(pacienteSelecionado.id)}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: pacienteSelecionado.nome,
          telefone: pacienteSelecionado.telefone,
          email: pacienteSelecionado.email,
          cpf: pacienteSelecionado.cpf,
        }),
      });
      setPacienteSelecionado(res.paciente);
      setProntuarioFeedback("Cadastro do paciente atualizado.");
      await Promise.all([reloadPacientes(), reloadAgendamentos()]);
    } catch (err) {
      setProntuarioFeedback(err instanceof Error ? err.message : "Falha ao salvar cadastro do paciente");
    }
  }

  async function salvarProntuario() {
    if (!prontuario || !pacienteSelecionado) return;
    setProntuarioFeedback("");
    try {
      const res = await api<{ prontuario: ProntuarioPaciente }>(`/api/pacientes/${encodeURIComponent(pacienteSelecionado.id)}/prontuario`, {
        method: "PUT",
        body: JSON.stringify(prontuario),
      });
      setProntuario(res.prontuario);
      setProntuarioFeedback("Prontuario salvo com sucesso.");
    } catch (err) {
      setProntuarioFeedback(err instanceof Error ? err.message : "Falha ao salvar prontuario");
    }
  }

  function handleNovoRegistroChange(field: keyof NovoRegistroState, value: string) {
    setNovoRegistro((prev) => ({
      ...prev,
      [field]: field === "tipo" ? (value as TipoRegistroClinico) : value,
    }));
  }

  return {
    pacienteSelecionado,
    prontuario,
    historicoPaciente,
    prontuarioLoading,
    prontuarioFeedback,
    novoRegistro,
    abrirPacienteByAgendamento,
    abrirPacienteResumo,
    atualizarIdentificacaoPaciente,
    atualizarCampoProntuario,
    adicionarRegistroProntuario,
    removerRegistroProntuario,
    limparNovoRegistro,
    salvarCadastroPaciente,
    salvarProntuario,
    handleNovoRegistroChange,
  };
}
