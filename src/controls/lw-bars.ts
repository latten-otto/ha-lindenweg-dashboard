import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lw-dual-bars')
export class LwDualBars extends LitElement {
  @property({ type: Array }) pv: number[] = [];
  @property({ type: Array }) use: number[] = [];
  @property({ type: Number }) height = 36;

  static styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: flex-end;
      gap: 1px;
      width: 100%;
    }
    .col {
      flex: 1;
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .bar {
      position: absolute;
      bottom: 0;
      width: 4px;
      border-radius: 1px;
    }
    .pv {
      background: var(--amber);
      opacity: 0.85;
      left: 40%;
    }
    .use {
      background: var(--blue);
      opacity: 0.7;
      right: 40%;
    }
  `;

  render() {
    const peak = Math.max(...this.pv, ...this.use, 1) * 1.1;
    return html`
      <div class="row" style=${`height:${this.height}px`}>
        ${this.pv.map((v, i) => {
          const u = this.use[i] || 0;
          return html`
            <div class="col" style=${`height:${this.height}px`}>
              <div
                class="bar pv"
                style=${`height:${(v / peak) * this.height}px`}
              ></div>
              <div
                class="bar use"
                style=${`height:${(u / peak) * this.height}px`}
              ></div>
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-dual-bars': LwDualBars;
  }
}
