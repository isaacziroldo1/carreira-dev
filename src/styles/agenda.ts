import { css } from "styled-components";
import { outlinedCard } from "./shared";

export const agendaStyles = css`
  .agenda-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(0, 1fr);
  }

  .filter-grid {
    align-items: end;
    margin-bottom: 14px;
  }

  .filter-reset {
    height: 42px;
  }

  .list {
    display: grid;
    gap: 10px;
  }

  .agendamento-item {
    ${outlinedCard};
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  .agendamento-top {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 10px;
  }

  .agendamento-titulo {
    margin: 0;
    font-size: 1rem;
  }

  .agendamento-meta {
    margin: 4px 0 0;
    color: var(--text-soft);
    font-size: 0.9rem;
  }

  .agendamento-desc {
    margin: 2px 0 0;
    font-size: 0.93rem;
  }

  .agendamento-cliente {
    display: grid;
    gap: 4px;
    padding-top: 4px;
    border-top: 1px dashed var(--border);
  }

  .cliente-nome {
    font-weight: 600;
    font-size: 0.92rem;
  }

  .cliente-contato {
    font-size: 0.85rem;
    color: var(--text-soft);
    line-height: 1.35;
  }

  .categoria-tag {
    display: inline-flex;
    width: fit-content;
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary);
    border: 1px solid rgba(30, 94, 255, 0.35);
    background: rgba(30, 94, 255, 0.1);
  }

  [data-theme="dark"] .categoria-tag {
    color: #9fc0ff;
    border-color: rgba(112, 166, 255, 0.5);
    background: rgba(112, 166, 255, 0.14);
  }

  .agendamento-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .badge {
    border-radius: 99px;
    padding: 4px 10px;
    font-size: 0.78rem;
    font-weight: 700;
    border: 1px solid var(--border);
    color: var(--text-soft);
  }

  .is-concluido {
    opacity: 0.84;
  }

  .is-concluido .agendamento-titulo {
    text-decoration: line-through;
  }

  .is-concluido .badge {
    color: #1f7a48;
    border-color: #95d0ad;
    background: #e8f7ee;
  }

  [data-theme="dark"] .is-concluido .badge {
    color: #7fe0a6;
    border-color: #37694b;
    background: #123124;
  }

  .empty-state {
    border: 1px dashed var(--border);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    color: var(--text-soft);
  }
`;
