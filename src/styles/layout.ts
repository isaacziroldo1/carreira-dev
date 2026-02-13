import { css } from "styled-components";
import { labelGrid, surfaceCard } from "./shared";

export const layoutStyles = css`
  .login-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .login-card {
    width: min(420px, 100%);
    ${surfaceCard};
    padding: 22px;
  }

  .login-card h1 {
    margin: 0;
    font-size: 1.4rem;
  }

  .login-subtitle {
    margin: 6px 0 16px;
    color: var(--text-soft);
    font-size: 0.94rem;
  }

  .login-form {
    display: grid;
    gap: 10px;
  }

  .login-form label {
    ${labelGrid};
    font-size: 0.93rem;
  }

  .app-shell {
    width: min(1280px, calc(100% - 24px));
    margin: 12px auto;
    display: grid;
    gap: 16px;
  }

  .sidebar,
  .panel,
  .stat-card {
    ${surfaceCard};
  }

  .sidebar {
    padding: 14px;
    display: grid;
    gap: 14px;
  }

  .brand h1,
  .view-header h2 {
    margin: 0;
  }

  .eyebrow {
    margin: 0 0 6px;
    color: var(--text-soft);
    font-size: 0.86rem;
  }

  .menu {
    display: grid;
    gap: 8px;
  }

  .menu-item {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: transparent;
    color: var(--text);
    font: inherit;
    text-align: left;
    padding: 10px 12px;
    cursor: pointer;
  }

  .menu-item.is-active {
    background: var(--primary);
    color: var(--primary-contrast);
    border-color: transparent;
  }

  .workspace {
    display: grid;
    gap: 16px;
  }

  .view {
    display: none;
  }

  .view.is-visible {
    display: grid;
    gap: 14px;
  }

  .view-header p {
    margin: 6px 0 0;
    color: var(--text-soft);
  }

  .panel {
    padding: 16px;
  }

  .panel-header {
    margin-bottom: 14px;
  }

  .panel-header h2 {
    margin: 0;
    font-size: 1.15rem;
  }

  .panel-header p {
    margin: 6px 0 0;
    color: var(--text-soft);
    font-size: 0.94rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 12px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-card p {
    margin: 0;
    color: var(--text-soft);
    font-size: 0.9rem;
  }

  .stat-card strong {
    display: block;
    margin-top: 10px;
    font-size: 1.7rem;
  }

  .stat-card.is-alert {
    border-color: rgba(196, 55, 55, 0.35);
  }
`;
