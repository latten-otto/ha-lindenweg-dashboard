import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { ExtraConfig } from '../types/config';
import '../shared/lw-section-head';
import './extras/lw-extra-vacuum';
import './extras/lw-extra-mower';
import './extras/lw-extra-sprinkler';
import './extras/lw-extra-fan';
import '../shared/lw-feature-tile';

@customElement('lw-room-extras')
export class LwRoomExtras extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) extras: ExtraConfig[] = [];
  @property({ type: String }) heading = 'Geräte';
  @property({ type: String }) sub = 'Räumlich';

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
      overflow: hidden;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-auto-rows: minmax(110px, auto);
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

  private _renderExtra(x: ExtraConfig) {
    if (!x.entity) return nothing;
    switch (x.kind) {
      case 'vacuum':
        return html`<lw-extra-vacuum
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
        ></lw-extra-vacuum>`;
      case 'mower':
        return html`<lw-extra-mower
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
        ></lw-extra-mower>`;
      case 'irrigation':
        return html`<lw-extra-sprinkler
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
          .state_entity=${x.state_entity}
        ></lw-extra-sprinkler>`;
      case 'air-purifier':
        return html`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
          .state_entity=${x.state_entity}
          icon="wind"
          tint="var(--accent)"
        ></lw-extra-fan>`;
      case 'dehumidifier':
        return html`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
          .state_entity=${x.state_entity}
          icon="droplet"
          tint="var(--blue)"
        ></lw-extra-fan>`;
      case 'fan':
        return html`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
          .state_entity=${x.state_entity}
          icon="fan"
          tint="var(--accent)"
        ></lw-extra-fan>`;
      case 'fireplace':
        return html`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
          .state_entity=${x.state_entity}
          icon="fire"
          tint="var(--warn)"
        ></lw-extra-fan>`;
      case 'tv':
        return html`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
          .state_entity=${x.state_entity}
          icon="tv"
          tint="var(--amber)"
        ></lw-extra-fan>`;
      default:
        return html`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x.entity}
          .name=${x.name}
          .state_entity=${x.state_entity}
          icon="cog"
          tint="var(--text-muted)"
        ></lw-extra-fan>`;
    }
  }

  render() {
    if (!this.extras.length) {
      return html`<div class="card">
        <lw-section-head sub=${this.sub} heading=${this.heading}></lw-section-head>
        <div class="empty">Keine Geräte konfiguriert</div>
      </div>`;
    }
    return html`
      <div class="card">
        <lw-section-head sub=${this.sub} heading=${this.heading}></lw-section-head>
        <div class="grid">${this.extras.map((x) => this._renderExtra(x))}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-room-extras': LwRoomExtras;
  }
}
