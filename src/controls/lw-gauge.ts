import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lw-gauge')
export class LwGauge extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) size = 96;
  @property({ type: Number }) stroke = 8;
  @property({ type: String }) color = 'var(--accent)';
  @property({ type: String }) track = 'var(--card-inset)';

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }
    .wrap {
      position: relative;
    }
    svg {
      transform: rotate(-90deg);
      display: block;
    }
    .center {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }
    circle.fg {
      transition: stroke-dashoffset 0.4s ease-out;
    }
  `;

  render() {
    const r = (this.size - this.stroke) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(1, this.value / this.max));
    return html`
      <div class="wrap" style=${`width:${this.size}px;height:${this.size}px`}>
        <svg width=${this.size} height=${this.size}>
          <circle
            cx=${this.size / 2}
            cy=${this.size / 2}
            r=${r}
            stroke=${this.track}
            stroke-width=${this.stroke}
            fill="none"
          ></circle>
          <circle
            class="fg"
            cx=${this.size / 2}
            cy=${this.size / 2}
            r=${r}
            stroke=${this.color}
            stroke-width=${this.stroke}
            fill="none"
            stroke-linecap="round"
            stroke-dasharray=${c}
            stroke-dashoffset=${c * (1 - pct)}
          ></circle>
        </svg>
        <div class="center"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-gauge': LwGauge;
  }
}
