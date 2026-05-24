import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import { entityState, friendlyName } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';

@customElement('lw-cameras-card')
export class LwCamerasCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) cameras: string[] = [];

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
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      flex: 1;
      min-height: 0;
    }
    .tile {
      border-radius: 11px;
      overflow: hidden;
      position: relative;
      aspect-ratio: 4/3;
      background: linear-gradient(160deg, #1a2a32 0%, #2a3a3a 60%, #3a4a3a 100%);
      border: 1px solid var(--border-soft);
      background-size: cover;
      background-position: center;
    }
    .tile .vignette {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 40%;
      background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.5));
    }
    .badge {
      position: absolute;
      top: 6px;
      left: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      color: white;
      font-size: 9.5px;
      font-weight: 500;
    }
    .badge .live {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: #e76f51;
    }
    .name {
      position: absolute;
      bottom: 6px;
      left: 6px;
      color: white;
      font-size: 11px;
      font-weight: 500;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 40px 0;
      text-align: center;
    }
  `;

  render() {
    if (!this.cameras.length) {
      return html`<div class="card">
        <lw-section-head sub="Live" heading="Kameras"></lw-section-head>
        <div class="empty">Keine Kameras konfiguriert</div>
      </div>`;
    }
    return html`
      <div class="card">
        <lw-section-head sub=${'Live · ' + this.cameras.length + ' Kameras'} heading="Kameras"></lw-section-head>
        <div class="grid">
          ${this.cameras.map((id) => {
            const e = entityState(this.hass, id);
            const name = friendlyName(e, id.split('.')[1]);
            const online = e && e.state !== 'unavailable' && e.state !== 'unknown';
            const img = e?.attributes?.entity_picture as string | undefined;
            return html`
              <div
                class="tile"
                style=${img ? `background-image:url(${img})` : ''}
              >
                <div class="vignette"></div>
                <div class="badge">
                  <span class="live"></span>${online ? 'LIVE' : 'OFFLINE'}
                </div>
                <div class="name">${name}</div>
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
    'lw-cameras-card': LwCamerasCard;
  }
}
