import { css } from "styled-components";

export const calendarStyles = css`
  .calendar-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  .calendar-head h2 {
    margin: 0;
    font-size: 1.15rem;
  }

  .calendar-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .calendar-controls strong {
    min-width: 150px;
    text-align: center;
    font-size: 0.95rem;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 8px;
  }

  .calendar-weekday {
    text-align: center;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--text-soft);
    padding: 8px 0;
  }

  .calendar-day {
    min-height: 108px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface-soft);
    padding: 8px;
    display: grid;
    align-content: start;
    gap: 6px;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease;
  }

  .calendar-day:hover:not(.muted) {
    transform: translateY(-1px);
    border-color: var(--primary);
  }

  .calendar-day.muted {
    opacity: 0.45;
    cursor: default;
  }

  .calendar-day.is-today {
    border-color: var(--primary);
  }

  .calendar-day.is-selected {
    box-shadow: inset 0 0 0 2px var(--primary);
  }

  .day-number {
    font-weight: 700;
    font-size: 0.85rem;
  }

  .day-times {
    display: grid;
    gap: 4px;
  }

  .day-time {
    font-size: 0.76rem;
    border-radius: 999px;
    background: rgba(30, 94, 255, 0.14);
    color: var(--text);
    padding: 3px 7px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .agenda-panel .list {
    margin-top: 8px;
  }

  [data-theme="dark"] .day-time {
    background: rgba(112, 166, 255, 0.24);
  }
`;
