import { css } from "styled-components";
import { focusRing, inputField } from "./shared";

export const baseStyles = css`
  :root {
    --bg: #f4f7fb;
    --surface: #ffffff;
    --surface-soft: #eef2f9;
    --text: #132035;
    --text-soft: #55657d;
    --primary: #1e5eff;
    --primary-contrast: #ffffff;
    --danger: #c43737;
    --border: #d7e0ef;
    --shadow: 0 10px 25px rgba(12, 32, 75, 0.08);
    --radius: 14px;
    --focus: 0 0 0 3px rgba(30, 94, 255, 0.25);
  }

  [data-theme="dark"] {
    --bg: #0f1726;
    --surface: #171f33;
    --surface-soft: #1f2a42;
    --text: #ecf2ff;
    --text-soft: #afbdd6;
    --primary: #70a6ff;
    --primary-contrast: #091228;
    --danger: #ff8f8f;
    --border: #2b3857;
    --shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    --focus: 0 0 0 3px rgba(112, 166, 255, 0.35);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Segoe UI", Tahoma, sans-serif;
    background:
      radial-gradient(circle at top right, rgba(30, 94, 255, 0.12), transparent 42%),
      var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  input,
  textarea,
  select,
  button {
    font: inherit;
  }

  input,
  textarea,
  select {
    ${inputField};
  }

  textarea {
    resize: vertical;
  }

  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible,
  button:focus-visible,
  .menu-item:focus-visible {
    ${focusRing};
  }

  .full {
    grid-column: 1 / -1;
  }

  .feedback {
    min-height: 20px;
    margin: 8px 0 0;
    color: var(--danger);
  }
`;
