import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('lw-vslider')
export class LwVSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) height = 90;
  @property({ type: Number }) width = 26;
  @property({ type: String }) accent?: string;

  @query('.v') private _track!: HTMLDivElement;
  private _dragging = false;
  private _onMove = (e: PointerEvent) => {
    if (this._dragging) this._set(e.clientY);
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
    this._set(e.clientY);
  }
  private _set(clientY: number) {
    const r = this._track.getBoundingClientRect();
    let v = ((clientY - r.top) / r.height) * 100;
    v = Math.max(0, Math.min(100, v));
    const next = Math.round(100 - v);
    if (next !== this.value) {
      this.value = next;
      this.dispatchEvent(
        new CustomEvent('change', { detail: { value: next }, bubbles: true, composed: true }),
      );
    }
  }

  static styles = css`
    :host {
      display: inline-block;
    }
    .v {
      position: relative;
      background: var(--card-inset);
      border-radius: 12px;
      cursor: pointer;
      overflow: hidden;
      touch-action: none;
    }
    .fill {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      opacity: 0.7;
    }
    .slat {
      position: absolute;
      left: 4px;
      right: 4px;
      height: 1px;
      background: rgba(255, 255, 255, 0.18);
    }
  `;

  render() {
    const coverPct = 100 - this.value;
    const accent = this.accent ?? 'var(--text-muted)';
    return html`
      <div class="v" style=${`width:${this.width}px;height:${this.height}px`} @pointerdown=${this._down}>
        <div class="fill" style=${`height:${coverPct}%;background:${accent}`}></div>
        ${[0.2, 0.4, 0.6, 0.8].map((f) =>
          f * 100 <= coverPct ? html`<div class="slat" style=${`top:${f * 100}%`}></div>` : null,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-vslider': LwVSlider;
  }
}
