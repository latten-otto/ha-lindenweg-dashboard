import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './lw-toggle';
import './lw-slider';
import '../icons/lw-icon';

@customElement('lw-light-tile')
export class LwLightTile extends LitElement {
  @property({ type: String }) name = 'Licht';
  @property({ type: Boolean }) on = false;
  @property({ type: Number }) brightness = 0;
  @property({ type: Boolean }) compact = false;

  static styles = css`
    :host {
      display: block;
    }
    .tile {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
      cursor: pointer;
      transition: background 0.12s, border-color 0.12s;
      height: 100%;
    }
    .tile:hover {
      border-color: var(--border);
    }
    .tile.on {
      background: linear-gradient(
        180deg,
        color-mix(in oklab, var(--amber) 18%, var(--card)),
        var(--card)
      );
      border-color: color-mix(in oklab, var(--amber) 35%, var(--border));
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
      background: var(--card-inset);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.on {
      background: var(--amber-soft);
      color: var(--amber);
      box-shadow: var(--on-glow);
    }
    .name {
      font-size: 13px;
      font-weight: 500;
    }
    .pct {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
      font-family: 'Geist Mono', monospace;
    }
    .bottom {
      margin-top: auto;
      padding-top: 8px;
    }
  `;

  private _toggle(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('lw-toggle', {
        detail: { value: e.detail.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private _bright(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('lw-brightness', {
        detail: { value: e.detail.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const padding = this.compact ? '10px 12px' : '14px';
    const nameMargin = this.compact ? 6 : 10;
    return html`
      <div class=${'tile ' + (this.on ? 'on' : '')} style=${`padding:${padding}`}>
        <div class="row">
          <div class=${'ico' + (this.on ? ' on' : '')}>
            <lw-icon name="lightbulb" .size=${16}></lw-icon>
          </div>
          <lw-toggle .on=${this.on} size="sm" @change=${this._toggle}></lw-toggle>
        </div>
        <div class="name" style=${`margin-top:${nameMargin}px`}>${this.name}</div>
        ${!this.compact
          ? html`
              <div class="bottom">
                <lw-slider
                  .value=${this.brightness}
                  .accent=${this.on ? 'var(--amber)' : 'var(--text-muted)'}
                  @change=${this._bright}
                ></lw-slider>
                <div class="pct">${this.brightness}%</div>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-light-tile': LwLightTile;
  }
}
