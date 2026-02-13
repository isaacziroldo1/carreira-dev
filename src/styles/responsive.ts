import { css } from "styled-components";

export const responsiveStyles = css`
  @media (min-width: 900px) {
    .app-shell {
      grid-template-columns: 250px minmax(0, 1fr);
      align-items: start;
    }

    .sidebar {
      position: sticky;
      top: 12px;
    }

    .stats-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .form-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .patient-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .records-new {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .patients-list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .filter-grid {
      grid-template-columns: 2fr 1fr 1fr auto;
    }

    .report-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .report-distribution {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 620px) {
    .period-selector {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .custom-range-fields {
      width: 100%;
      grid-template-columns: 1fr;
    }

    .report-item {
      display: grid;
      gap: 6px;
    }

    .patient-head {
      display: grid;
      gap: 10px;
    }

    .patient-head-actions {
      width: 100%;
    }

    .report-item-meta {
      justify-items: start;
    }
  }
`;
