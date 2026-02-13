import { css } from "styled-components";
import { outlinedCard } from "./shared";

export const patientStyles = css`
  .patient-view {
    display: grid;
    gap: 16px;
  }

  .patients-toolbar {
    display: grid;
    gap: 10px;
    margin-bottom: 12px;
  }

  .patients-toolbar label {
    display: grid;
    gap: 6px;
    font-weight: 600;
    font-size: 0.92rem;
  }

  .patients-count {
    margin: 0;
    color: var(--text-soft);
    font-size: 0.9rem;
  }

  .patients-list {
    display: grid;
    gap: 10px;
  }

  .patient-card {
    ${outlinedCard};
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  .patient-card-main {
    display: grid;
    gap: 3px;
  }

  .patient-card-main strong {
    font-size: 0.96rem;
  }

  .patient-card-main span {
    color: var(--text-soft);
    font-size: 0.86rem;
  }

  .patient-card-meta {
    display: grid;
    gap: 3px;
    color: var(--text-soft);
    font-size: 0.84rem;
  }

  .patient-head {
    ${outlinedCard};
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 12px;
  }

  .patient-head strong {
    font-size: 1rem;
  }

  .patient-head p {
    margin: 4px 0 0;
    color: var(--text-soft);
    font-size: 0.88rem;
  }

  .patient-head-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .patient-grid {
    display: grid;
    gap: 12px;
  }

  .patient-grid label {
    display: grid;
    gap: 6px;
    font-weight: 600;
    font-size: 0.93rem;
  }

  .patient-records {
    display: grid;
    gap: 10px;
  }

  .patient-records h3 {
    margin: 0;
    font-size: 1rem;
  }

  .records-new {
    display: grid;
    gap: 10px;
    border: 1px dashed var(--border);
    border-radius: 12px;
    padding: 12px;
  }

  .records-new label {
    display: grid;
    gap: 6px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .records-list {
    display: grid;
    gap: 8px;
  }

  .record-item {
    ${outlinedCard};
    padding: 10px;
    display: grid;
    gap: 8px;
  }

  .record-item header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .record-item header span {
    color: var(--text-soft);
    font-size: 0.85rem;
  }

  .record-item p {
    margin: 0;
    font-size: 0.92rem;
  }
`;
