import { useMemo, useState } from "react";
import {
  type CategoriaRelatorio,
  type PeriodoRelatorio,
  RELATORIO_CATEGORIAS,
  type RelatorioResumo,
  type RangeRelatorio,
  type UseRelatorioParams,
  type UseRelatorioResult,
} from "../../app/types";
import { toIsoDate } from "../../app/utils";

export function useRelatorio({ agendamentos }: UseRelatorioParams): UseRelatorioResult {
  const [periodoRelatorio, setPeriodoRelatorio] = useState<PeriodoRelatorio>("prox7d");
  const [customInicio, setCustomInicio] = useState(() => toIsoDate(new Date()));
  const [customFim, setCustomFim] = useState(() => toIsoDate(new Date()));

  const faixaRelatorio = useMemo<RangeRelatorio>(() => {
    const hojeIso = toIsoDate(new Date());
    const inicioHoje = new Date(`${hojeIso}T00:00:00`);
    const fimHoje = new Date(`${hojeIso}T23:59:59.999`);
    if (periodoRelatorio === "hoje") return { inicio: inicioHoje, fim: fimHoje, valido: true, label: "Hoje" };
    if (periodoRelatorio === "prox7d") {
      const fim = new Date(fimHoje);
      fim.setDate(fim.getDate() + 6);
      return { inicio: inicioHoje, fim, valido: true, label: "Proximos 7 dias" };
    }
    if (periodoRelatorio === "prox30d") {
      const fim = new Date(fimHoje);
      fim.setDate(fim.getDate() + 29);
      return { inicio: inicioHoje, fim, valido: true, label: "Proximos 30 dias" };
    }
    if (periodoRelatorio === "ult7d") {
      const inicio = new Date(inicioHoje);
      inicio.setDate(inicio.getDate() - 6);
      return { inicio, fim: fimHoje, valido: true, label: "Ultimos 7 dias" };
    }
    if (periodoRelatorio === "ult30d") {
      const inicio = new Date(inicioHoje);
      inicio.setDate(inicio.getDate() - 29);
      return { inicio, fim: fimHoje, valido: true, label: "Ultimos 30 dias" };
    }
    const inicio = customInicio ? new Date(`${customInicio}T00:00:00`) : new Date("1970-01-01T00:00:00");
    const fim = customFim ? new Date(`${customFim}T23:59:59.999`) : new Date("1970-01-01T00:00:00");
    const valido = Boolean(customInicio) && Boolean(customFim) && inicio <= fim;
    return { inicio, fim, valido, label: "Personalizado" };
  }, [periodoRelatorio, customInicio, customFim]);

  const relatorio = useMemo<RelatorioResumo>(() => {
    const now = new Date();
    const hojeIso = toIsoDate(now);
    let totalPeriodo = 0;
    let concluidosPeriodo = 0;
    let hojeQtd = 0;
    let atrasadosQtd = 0;
    const porCategoria = RELATORIO_CATEGORIAS.reduce((acc, categoria) => {
      acc[categoria] = 0;
      return acc;
    }, {} as Record<CategoriaRelatorio, number>);

    const ordenados = [...agendamentos].sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`));
    for (const ag of agendamentos) {
      const dataHora = new Date(`${ag.data}T${ag.hora}:00`);
      const noPeriodo = faixaRelatorio.valido && dataHora >= faixaRelatorio.inicio && dataHora <= faixaRelatorio.fim;
      if (ag.data === hojeIso) hojeQtd += 1;
      if (!ag.concluido && dataHora < now) atrasadosQtd += 1;
      if (noPeriodo) {
        totalPeriodo += 1;
        if (ag.concluido) concluidosPeriodo += 1;
        porCategoria[ag.categoria] += 1;
      }
    }

    const pendentesPeriodo = totalPeriodo - concluidosPeriodo;
    const taxaConclusao = totalPeriodo > 0 ? Math.round((concluidosPeriodo / totalPeriodo) * 100) : 0;
    const proximosAtendimentos = ordenados.filter((ag) => new Date(`${ag.data}T${ag.hora}:00`) >= now).slice(0, 5);
    const pendenciasCriticas = ordenados.filter((ag) => !ag.concluido && new Date(`${ag.data}T${ag.hora}:00`) < now).slice(0, 5);
    const distribuicaoCategoria = RELATORIO_CATEGORIAS.map((categoria) => {
      const qtd = porCategoria[categoria];
      return { categoria, qtd, percentual: totalPeriodo > 0 ? Math.round((qtd / totalPeriodo) * 100) : 0 };
    });

    return {
      totalPeriodo,
      pendentesPeriodo,
      concluidosPeriodo,
      taxaConclusao,
      periodoValido: faixaRelatorio.valido,
      periodoLabel: faixaRelatorio.label,
      atrasadosQtd,
      hojeQtd,
      proximosAtendimentos,
      pendenciasCriticas,
      distribuicaoCategoria,
    };
  }, [agendamentos, faixaRelatorio]);

  return {
    periodoRelatorio,
    customInicio,
    customFim,
    faixaRelatorio,
    relatorio,
    setPeriodoRelatorio,
    setCustomInicio,
    setCustomFim,
  };
}
