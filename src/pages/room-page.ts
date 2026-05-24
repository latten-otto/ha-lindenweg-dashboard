import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig, RoomConfig } from '../types/config';
import { entityState, attrNum, isOn } from '../hass/entity-helpers';
import '../panel/lw-topbar';
import '../modules/room-climate';
import '../modules/room-lights';
import '../modules/room-blinds';
import '../modules/room-media-mini';
import '../modules/room-extras';

@customElement('lw-room-page')
export class LwRoomPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: PanelConfig;
  @property({ type: String }) roomKey = '';
  @property({ attribute: false }) time = new Date();

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .page {
      padding: 20px 22px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      height: 100%;
      animation: rise 0.35s ease-out both;
    }
    .grid {
      flex: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
      grid-auto-rows: minmax(300px, 1fr);
      gap: 18px;
      min-height: 0;
      overflow: auto;
    }
    .grid::-webkit-scrollbar {
      width: 0;
    }
    .bottom-right {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 18px;
      min-height: 0;
    }
    .bottom-right > * {
      min-width: 0;
    }
    @media (max-width: 900px) {
      .grid {
        grid-template-columns: minmax(0, 1fr);
      }
      .bottom-right {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (max-width: 1100px) {
      .grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
    }
  `;

  private get _room(): RoomConfig | undefined {
    return this.config.rooms?.[this.roomKey];
  }

  private _subtitle(room: RoomConfig): string {
    const lightsOn = (room.lights ?? []).filter(
      (id) => entityState(this.hass, id)?.state === 'on',
    ).length;
    const lightsTotal = (room.lights ?? []).length;
    const climateE = entityState(this.hass, room.climate);
    const temp = attrNum(climateE, 'current_temperature', NaN);
    const humidity = attrNum(climateE, 'current_humidity', NaN);
    const bits: string[] = [];
    if (lightsTotal) bits.push(`${lightsOn}/${lightsTotal} Lichter`);
    if (Number.isFinite(temp)) bits.push(`${temp.toFixed(1)}°C`);
    if (Number.isFinite(humidity)) bits.push(`${Math.round(humidity)}% Feuchte`);
    return bits.join(' · ') || 'Keine Sensoren konfiguriert';
  }

  render() {
    const room = this._room;
    if (!room) {
      return html`<div class="page">
        <div>Raum „${this.roomKey}" nicht in Config gefunden.</div>
      </div>`;
    }

    return html`
      <div class="page">
        <lw-topbar
          .hass=${this.hass}
          .config=${this.config}
          .heading=${room.name}
          .subtitle=${this._subtitle(room)}
          .time=${this.time}
        ></lw-topbar>

        <div class="grid">
          <lw-climate-card .hass=${this.hass} .entity=${room.climate}></lw-climate-card>

          ${room.lights?.length || room.scenes?.length
            ? html`<lw-lights-card
                .hass=${this.hass}
                .lights=${room.lights ?? []}
                .scenes=${room.scenes ?? []}
                .roomName=${room.name}
              ></lw-lights-card>`
            : html`<div></div>`}

          <lw-room-extras
            .hass=${this.hass}
            .extras=${room.extras ?? []}
            heading="Geräte"
            sub="Räumlich"
          ></lw-room-extras>

          <div class="bottom-right">
            ${room.covers?.length
              ? html`<lw-blinds-card .hass=${this.hass} .covers=${room.covers}></lw-blinds-card>`
              : nothing}
            ${room.media_player
              ? html`<lw-media-mini
                  .hass=${this.hass}
                  .entity=${room.media_player}
                ></lw-media-mini>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-room-page': LwRoomPage;
  }
}
