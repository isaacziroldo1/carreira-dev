import { css } from "styled-components";
import { btnBase, labelGrid } from "./shared";

export const formsStyles = css`
  .form-grid,
  .filter-grid {
    display: grid;
    gap: 12px;
  }

  .form-grid label,
  .filter-grid label {
    ${labelGrid};
    font-size: 0.93rem;
  }

  .form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .btn {
    ${btnBase};
  }

  .btn-primary {
    background: var(--primary);
    color: var(--primary-contrast);
  }

  .btn-secondary {
    background: transparent;
    color: var(--text);
    border-color: var(--border);
  }

  .btn-secondary.is-active {
    border-color: var(--primary);
    color: var(--primary);
  }

  .patient-inline-panel {
    margin-top: 12px;
  }
`;
