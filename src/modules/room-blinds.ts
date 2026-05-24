import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import {
  entityState,
  friendlyName,
  attrNum,
  callCoverSetPosition,
} from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../controls/lw-vslider';

@customElement('lw-blinds-card')
export class LwBlindsCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) covers: string[] = [];

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
    }
    .row {
      display: flex;
      gap: 14px;
      justify-content: space-around;
      padding-top: 6px;
    }
    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .pct {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      font-weight: 500;
    }
    .name {
      font-size: 10.5px;
      color: var(--text-muted);
      text-align: center;
      max-width: 80px;
    }
    .btns {
      display: flex;
      gap: 6px;
    }
    .btn {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: background 0.12s, color 0.12s, border-color 0.12s;
    }
    .btn:hover {
      color: var(--text);
      border-color: var(--border-strong);
      background: var(--card-elev);
    }
    .btn:active {
      transform: scale(0.95);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
    .allbtn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 10px;
      padding: 6px 12px;
      font-size: 12.5px;
      font-weight: 500;
    }
  `;

  private _set(id: string, position: number) {
    if (this.hass) callCoverSetPosition(this.hass, id, position);
  }

  render() {
    if (!this.covers.length) {
      return html`<div class="card">
        <lw-section-head sub="0" heading="Rollläden"></lw-section-head>
        <div class="empty">Keine Rollläden konfiguriert</div>
      </div>`;
    }
    const count = this.covers.length;
    return html`
      <div class="card">
        <lw-section-head
          sub=${`${count} Element${count === 1 ? '' : 'e'}`}
          heading="Rollläden"
        >
          <button
            slot="right"
            class="allbtn"
            @click=${() => this.covers.forEach((id) => this._set(id, 100))}
          >
            Alle hoch
          </button>
        </lw-section-head>
        <div class="row">
          ${this.covers.map((id) => {
            const e = entityState(this.hass, id);
            const name = friendlyName(e, id.split('.')[1]);
            const pos = Math.round(attrNum(e, 'current_position', 0));
            return html`
              <div class="col">
                <lw-vslider
                  .value=${pos}
                  .height=${150}
                  .width=${28}
                  accent="var(--text-muted)"
                  @change-end=${(ev: CustomEvent) => this._set(id, ev.detail.value)}
                ></lw-vslider>
                <div class="pct">${pos}%</div>
                <div class="name">${name}</div>
                <div class="btns">
                  <button class="btn" title="Hoch" @click=${() => this._set(id, 100)}>
                    <lw-icon name="arrow-up" .size=${16} .stroke=${2}></lw-icon>
                  </button>
                  <button class="btn" title="Runter" @click=${() => this._set(id, 0)}>
                    <lw-icon name="arrow-down" .size=${16} .stroke=${2}></lw-icon>
                  </button>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-blinds-card': LwBlindsCard;
  }
}
