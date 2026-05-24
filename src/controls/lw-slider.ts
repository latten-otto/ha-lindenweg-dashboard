import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('lw-slider')
export class LwSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) height = 6;
  @property({ type: String }) accent?: string;
  @property({ type: Boolean }) knob = true;

  @query('.s') private _track!: HTMLDivElement;
  private _dragging = false;
  private _onMove = (e: PointerEvent) => {
    if (this._dragging) this._set(e.clientX);
  };
  private _onUp = () => {
    if (this._dragging) {
      this._dragging = false;
      this.dispatchEvent(
        new CustomEvent('change-end', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('pointermove', this._onMove);
    window.addEventListener('pointerup', this._onUp);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerup', this._onUp);
  }

  private _down(e: PointerEvent) {
    e.stopPropagation();
    this._dragging = true;
    this._set(e.clientX);
  }
  private _set(clientX: number) {
    const r = this._track.getBoundingClientRect();
    let v = ((clientX - r.left) / r.width) * (this.max - this.min) + this.min;
    v = Math.max(this.min, Math.min(this.max, v));
    const rounded = Math.round(v);
    if (rounded !== this.value) {
      this.value = rounded;
      this.dispatchEvent(
        new CustomEvent('change', { detail: { value: rounded }, bubbles: true, composed: true }),
      );
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .s {
      position: relative;
      width: 100%;
      background: var(--card-inset);
      border-radius: 999px;
      cursor: pointer;
      touch-action: none;
    }
    .fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: var(--text);
      border-radius: 999px;
    }
    .k {
      position: absolute;
      top: 50%;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--card-elev);
      border: 1.5px solid var(--text);
      transform: translate(-50%, -50%);
      box-shadow: var(--shadow-sm);
    }
  `;

  render() {
    const pct = Math.max(0, Math.min(100, ((this.value - this.min) / (this.max - this.min)) * 100));
    const accent = this.accent ?? 'var(--text)';
    return html`
      <div class="s" style=${`height:${this.height}px`} @pointerdown=${this._down}>
        <div class="fill" style=${`width:${pct}%;background:${accent}`}></div>
        ${this.knob
          ? html`<div class="k" style=${`left:${pct}%;border-color:${accent}`}></div>`
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-slider': LwSlider;
  }
}
