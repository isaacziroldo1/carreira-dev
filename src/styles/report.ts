import { css } from "styled-components";

export const reportStyles = css`
  .report-toolbar {
    display: grid;
    gap: 10px;
    justify-items: start;
  }

  .period-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
  }

  .period-btn {
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    color: var(--text-soft);
    padding: 8px 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .period-btn.is-active {
    background: var(--primary);
    color: var(--primary-contrast);
  }

  .custom-range-fields {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: min(420px, 100%);
  }

  .custom-range-field {
    display: grid;
    gap: 6px;
    font-size: 0.86rem;
    font-weight: 600;
    color: var(--text-soft);
  }

  .report-warning {
    margin: 0;
    color: var(--danger);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .report-period-note {
    margin: 2px 0 0;
    color: var(--text-soft);
    font-size: 0.9rem;
  }

  .report-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: minmax(0, 1fr);
  }

  .report-panel {
    display: grid;
    gap: 12px;
  }

  .report-list {
    display: grid;
    gap: 8px;
  }

  .report-item {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface-soft);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .report-item-btn {
    width: 100%;
    text-align: left;
    cursor: pointer;
  }

  .report-item-btn:hover {
    border-color: var(--primary);
  }

  .report-item-main {
    display: grid;
    gap: 3px;
  }

  .report-item-main strong {
    font-size: 0.94rem;
  }

  .report-item-main span {
    color: var(--text-soft);
    font-size: 0.84rem;
  }

  .report-item-meta {
    display: grid;
    justify-items: end;
    gap: 2px;
    font-size: 0.82rem;
    color: var(--text-soft);
  }

  .report-action {
    justify-self: start;
  }

  .report-distribution {
    gap: 14px;
  }

  .distribution-list {
    display: grid;
    gap: 10px;
  }

  .distribution-item {
    display: grid;
    gap: 6px;
  }

  .distribution-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    font-size: 0.9rem;
  }

  .distribution-header span {
    color: var(--text-soft);
  }

  .distribution-bar-track {
    width: 100%;
    height: 9px;
    border-radius: 999px;
    background: var(--surface-soft);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .distribution-bar-fill {
    height: 100%;
    width: 0;
    background: linear-gradient(90deg, rgba(30, 94, 255, 0.8), rgba(30, 94, 255, 0.45));
    border-radius: 999px;
  }
`;
