import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import {
  entityState,
  friendlyName,
  brightnessPct,
  callLightTurnOn,
  callLightTurnOff,
} from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../controls/lw-light-tile';

@customElement('lw-lights-card')
export class LwLightsCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) lights: string[] = [];

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
      min-height: 0;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-auto-rows: minmax(112px, 1fr);
      align-content: start;
      gap: 8px;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    .grid::-webkit-scrollbar {
      width: 0;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;

  private _onCount(): number {
    return this.lights.filter((id) => entityState(this.hass, id)?.state === 'on').length;
  }

  private _allToggle() {
    if (!this.hass) return;
    const allOff = this.lights.every((id) => entityState(this.hass, id)?.state !== 'on');
    this.lights.forEach((id) => {
      if (allOff) callLightTurnOn(this.hass!, id);
      else callLightTurnOff(this.hass!, id);
    });
  }

  render() {
    if (!this.lights.length) {
      return html`<div class="card">
        <lw-section-head sub="0" heading="Beleuchtung"></lw-section-head>
        <div class="empty">Keine Lichter konfiguriert</div>
      </div>`;
    }
    const count = this._onCount();
    const total = this.lights.length;
    const allOff = count === 0;

    return html`
      <div class="card">
        <lw-section-head sub=${`${count} von ${total} an`} heading="Beleuchtung">
          <button slot="right" class="btn" @click=${this._allToggle}>
            <lw-icon name="lightbulb" .size=${13}></lw-icon>
            ${allOff ? 'Alle an' : 'Alle aus'}
          </button>
        </lw-section-head>
        <div class="grid">
          ${this.lights.map((id) => {
            const e = entityState(this.hass, id);
            const name = friendlyName(e, id.split('.')[1]);
            const on = e?.state === 'on';
            const bright = brightnessPct(e) || (on ? 100 : 0);
            return html`
              <lw-light-tile
                .name=${name}
                .on=${on}
                .brightness=${bright}
                @lw-toggle=${(ev: CustomEvent) =>
                  this.hass &&
                  (ev.detail.value
                    ? callLightTurnOn(this.hass, id)
                    : callLightTurnOff(this.hass, id))}
                @lw-brightness=${(ev: CustomEvent) =>
                  this.hass && callLightTurnOn(this.hass, id, ev.detail.value)}
              ></lw-light-tile>
            `;
          })}
        </div>
      </div>

      <style>
        .btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 10px;
          padding: 6px 12px;
          font-size: 12.5px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn:hover {
          background: var(--card);
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-lights-card': LwLightsCard;
  }
}
