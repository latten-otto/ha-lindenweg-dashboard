import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../icons/lw-icon';

@customElement('lw-stepper')
export class LwStepper extends LitElement {
  @property({ type: Number }) value = 21;
  @property({ type: Number }) step = 0.5;
  @property({ type: Number }) min = 5;
  @property({ type: Number }) max = 30;
  @property({ type: String }) unit = '°C';
  @property({ type: Boolean }) big = false;

  private _emit(next: number) {
    const clamped = Math.max(this.min, Math.min(this.max, next));
    if (clamped === this.value) return;
    this.value = clamped;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value: clamped }, bubbles: true, composed: true }),
    );
  }

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    button {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: var(--card-inset);
      border: 1px solid var(--border);
      color: var(--text);
      display: grid;
      place-items: center;
    }
    button:hover {
      background: var(--card-elev);
    }
    .v {
      font-weight: 500;
      letter-spacing: -0.02em;
      text-align: center;
      font-family: 'Geist Mono', monospace;
    }
    .v.big {
      font-size: 28px;
      min-width: 88px;
    }
    .v.sm {
      font-size: 18px;
      min-width: 60px;
    }
    .u {
      color: var(--text-muted);
      margin-left: 2px;
    }
    .u.big {
      font-size: 14px;
    }
    .u.sm {
      font-size: 11px;
    }
  `;

  render() {
    const sizeClass = this.big ? 'big' : 'sm';
    const formatted = this.value.toFixed(this.step < 1 ? 1 : 0);
    return html`
      <button @click=${() => this._emit(this.value - this.step)}>
        <lw-icon name="minus" .size=${14} .stroke=${2}></lw-icon>
      </button>
      <div class=${'v ' + sizeClass}>
        ${formatted}<span class=${'u ' + sizeClass}>${this.unit}</span>
      </div>
      <button @click=${() => this._emit(this.value + this.step)}>
        <lw-icon name="plus" .size=${14} .stroke=${2}></lw-icon>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-stepper': LwStepper;
  }
}
