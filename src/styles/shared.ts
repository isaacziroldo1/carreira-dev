import { css } from "styled-components";

export const surfaceCard = css`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`;

export const labelGrid = css`
  display: grid;
  gap: 6px;
  font-weight: 600;
`;

export const inputField = css`
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-soft);
  color: var(--text);
  padding: 10px 11px;
`;

export const focusRing = css`
  outline: none;
  box-shadow: var(--focus);
`;

export const btnBase = css`
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
`;

export const outlinedCard = css`
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-soft);
`;
