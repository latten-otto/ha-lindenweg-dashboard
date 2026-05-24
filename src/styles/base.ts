import { css } from 'lit';

export const baseStyles = css`
  :host {
    font-family: 'Geist', system-ui, -apple-system, sans-serif;
    color: var(--text);
    font-feature-settings: 'ss01', 'cv11';
    letter-spacing: -0.005em;
    -webkit-font-smoothing: antialiased;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button {
    font: inherit;
    cursor: pointer;
  }

  .mono {
    font-family: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;
    font-feature-settings: 'tnum';
  }

  .card {
    background: var(--card);
    border-radius: 18px;
    border: 1px solid var(--border-soft);
    padding: 16px;
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 0;
  }
  .card.elev {
    background: var(--card-elev);
    box-shadow: var(--shadow);
  }

  .card-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
  }
  .card-sub {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-faint);
  }
  .card-title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin-top: 2px;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 9px;
    font-size: 11px;
    font-weight: 500;
    border-radius: 999px;
    line-height: 1.2;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 12.5px;
    font-weight: 500;
  }
  .btn-ghost:hover {
    background: var(--card);
  }

  .dot-status {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    background: var(--accent);
  }

  .divider {
    height: 1px;
    background: var(--border-soft);
  }

  @keyframes pulse-soft {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.55;
    }
  }
  .pulse {
    animation: pulse-soft 2.4s ease-in-out infinite;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .rise {
    animation: rise 0.35s ease-out both;
  }
`;
