import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig, RoomConfig } from '../types/config';
import { entityState, attrNum } from '../hass/entity-helpers';
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
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
      animation: rise 0.35s ease-out both;
    }
    /* Each row is a flex container. Cards have flex weights but only the cards
       that actually have data are rendered. So if a room has no climate, the
       lights card takes the whole row instead of leaving an empty 1fr cell. */
    .row {
      display: flex;
      gap: 12px;
      min-height: 0;
    }
    .row.top {
      flex: 1.1;
    }
    .row.bottom {
      flex: 1;
    }
    .col-1 { flex: 1; min-width: 0; }
    .col-1-5 { flex: 1.5; min-width: 0; }
    .col-2 { flex: 2; min-width: 0; }
    .row > * { min-width: 0; }
    @keyframes rise {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 900px) {
      .row { flex-direction: column; }
      .col-1, .col-1-5, .col-2 { flex: none; }
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

    const hasClimate = !!room.climate;
    const hasLights = !!(room.lights?.length || room.scenes?.length);
    const hasExtras = !!room.extras?.length;
    const hasCovers = !!(room.covers?.length);
    const hasMedia = !!room.media_player;

    // ---- Top row: climate + lights, or full-width lights if no climate ----
    const topRow = (() => {
      if (hasClimate && hasLights) {
        return html`<div class="row top">
          <div class="col-1">
            <lw-climate-card .hass=${this.hass} .entity=${room.climate}></lw-climate-card>
          </div>
          <div class="col-1-5">
            <lw-lights-card
              .hass=${this.hass}
              .lights=${room.lights ?? []}
              .scenes=${room.scenes ?? []}
              .roomName=${room.name}
            ></lw-lights-card>
          </div>
        </div>`;
      }
      if (hasClimate) {
        return html`<div class="row top">
          <div class="col-2">
            <lw-climate-card .hass=${this.hass} .entity=${room.climate}></lw-climate-card>
          </div>
        </div>`;
      }
      if (hasLights) {
        return html`<div class="row top">
          <div class="col-2">
            <lw-lights-card
              .hass=${this.hass}
              .lights=${room.lights ?? []}
              .scenes=${room.scenes ?? []}
              .roomName=${room.name}
            ></lw-lights-card>
          </div>
        </div>`;
      }
      return nothing;
    })();

    // ---- Bottom row: extras + (blinds + media-mini), with various fallbacks ----
    const bottomRightHasBoth = hasCovers && hasMedia;
    const bottomRight = bottomRightHasBoth
      ? html`<div class="row" style="gap:12px; flex:1; min-height:0">
          <div class="col-1">
            <lw-blinds-card .hass=${this.hass} .covers=${room.covers!}></lw-blinds-card>
          </div>
          <div class="col-1">
            <lw-media-mini .hass=${this.hass} .entity=${room.media_player!}></lw-media-mini>
          </div>
        </div>`
      : hasCovers
        ? html`<lw-blinds-card .hass=${this.hass} .covers=${room.covers!}></lw-blinds-card>`
        : hasMedia
          ? html`<lw-media-mini .hass=${this.hass} .entity=${room.media_player!}></lw-media-mini>`
          : nothing;

    const bottomRow = (() => {
      if (hasExtras && bottomRight !== nothing) {
        return html`<div class="row bottom">
          <div class="col-1">
            <lw-room-extras
              .hass=${this.hass}
              .extras=${room.extras ?? []}
              heading="Geräte"
              sub="Räumlich"
            ></lw-room-extras>
          </div>
          <div class="col-1-5">${bottomRight}</div>
        </div>`;
      }
      if (hasExtras) {
        return html`<div class="row bottom">
          <div class="col-2">
            <lw-room-extras
              .hass=${this.hass}
              .extras=${room.extras ?? []}
              heading="Geräte"
              sub="Räumlich"
            ></lw-room-extras>
          </div>
        </div>`;
      }
      if (bottomRight !== nothing) {
        return html`<div class="row bottom">
          <div class="col-2">${bottomRight}</div>
        </div>`;
      }
      return nothing;
    })();

    return html`
      <div class="page">
        <lw-topbar
          .hass=${this.hass}
          .config=${this.config}
          .heading=${room.name}
          .subtitle=${this._subtitle(room)}
          .time=${this.time}
        ></lw-topbar>

        ${topRow}
        ${bottomRow}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-room-page': LwRoomPage;
  }
}
