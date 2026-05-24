import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../icons/lw-icon';

@customElement('lw-feature-tile')
export class LwFeatureTile extends LitElement {
  @property({ type: String }) icon = 'cog';
  @property({ type: String }) name = '';
  @property({ type: String }) sub = '';
  @property({ type: Boolean }) on = false;
  @property({ type: String }) tint = 'var(--amber)';

  static styles = css`
    :host {
      display: block;
    }
    .tile {
      border-radius: 12px;
      padding: 12px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 80px;
      height: 100%;
    }
    .tile.on {
      background: color-mix(in oklab, var(--tint, var(--amber)) 14%, var(--card-inset));
      border-color: color-mix(in oklab, var(--tint, var(--amber)) 35%, var(--border-soft));
    }
    .row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .ico {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.on {
      background: var(--tint, var(--amber));
      color: white;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--text-faint);
    }
    .dot.on {
      background: var(--tint, var(--amber));
    }
  `;

  render() {
    this.style.setProperty('--tint', this.tint);
    return html`
      <div class=${'tile ' + (this.on ? 'on' : '')}>
        <div class="row">
          <div class=${'ico' + (this.on ? ' on' : '')}>
            <lw-icon name=${this.icon} .size=${15}></lw-icon>
          </div>
          <span class=${'dot' + (this.on ? ' on' : '')}></span>
        </div>
        <div>
          <div class="name">${this.name}</div>
          <div class="sub">${this.sub}</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-feature-tile': LwFeatureTile;
  }
}
