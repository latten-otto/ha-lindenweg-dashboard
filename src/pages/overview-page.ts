import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig } from '../types/config';
import { entityState, isOn } from '../hass/entity-helpers';
import '../panel/lw-topbar';
import '../modules/ov-weather';
import '../modules/ov-energy';
import '../modules/ov-infos';
import '../modules/ov-scenes';
import '../modules/ov-media';
import '../modules/ov-cameras';
import '../modules/ov-calendar';

@customElement('lw-overview-page')
export class LwOverviewPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: PanelConfig;
  @property({ attribute: false }) time = new Date();

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .page {
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 22px;
      height: 100%;
      overflow: auto;
      animation: rise 0.35s ease-out both;
    }
    .page::-webkit-scrollbar {
      width: 0;
    }
    .page > lw-topbar {
      flex: 0 0 auto;
    }

    /* Each .band is a horizontal flex row of cards. */
    .band {
      display: flex;
      gap: 22px;
      min-width: 0;
    }
    .band > * {
      min-width: 0;
    }

    /* Top band: energy (1.4fr) · weather (1fr) · infos (1fr) — at least 380px tall. */
    .band.top {
      flex: 0 0 auto;
      min-height: 380px;
    }
    .band.top > .e { flex: 1.4; display: flex; }
    .band.top > .w { flex: 1; display: flex; }
    .band.top > .i { flex: 1; display: flex; }
    .band.top > * > * { width: 100%; }

    /* Middle band: scenes spans full width, content-sized. */
    .band.middle {
      flex: 0 0 auto;
    }
    .band.middle > * { flex: 1; }

    /* Bottom band: media (1.4fr) · cameras (1fr) · calendar (1fr) — at least 320px. */
    .band.bottom {
      flex: 1 1 auto;
      min-height: 320px;
    }
    .band.bottom > .m { flex: 1.4; display: flex; }
    .band.bottom > .k { flex: 1; display: flex; }
    .band.bottom > .c { flex: 1; display: flex; }
    .band.bottom > * > * { width: 100%; }

    @keyframes rise {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Stack on narrower screens. */
    @media (max-width: 1280px) {
      .band.top { flex-wrap: wrap; }
      .band.top > .e { flex: 1 1 100%; }
      .band.top > .w, .band.top > .i { flex: 1 1 calc(50% - 11px); }
      .band.bottom { flex-wrap: wrap; }
      .band.bottom > .m { flex: 1 1 100%; }
      .band.bottom > .k, .band.bottom > .c { flex: 1 1 calc(50% - 11px); }
    }
    @media (max-width: 760px) {
      .band { flex-direction: column; }
      .band > * { flex: 1 1 auto !important; }
    }
  `;

  private _totalLightsOn(): number {
    const rooms = this.config.rooms ?? {};
    let count = 0;
    Object.values(rooms).forEach((r) => {
      r.lights?.forEach((id) => {
        if (isOn(this.hass?.states[id]?.state ?? 'off')) count++;
      });
    });
    return count;
  }

  render() {
    const ov = this.config.overview ?? {};
    const totalOn = this._totalLightsOn();
    const subtitle = `${totalOn} Lichter an · ${Object.keys(this.config.rooms ?? {}).length} Räume`;

    return html`
      <div class="page">
        <lw-topbar
          .hass=${this.hass}
          .config=${this.config}
          .subtitle=${subtitle}
          .time=${this.time}
        ></lw-topbar>

        <div class="band top">
          <div class="e"><lw-energy-card .hass=${this.hass} .energy=${ov.energy ?? {}}></lw-energy-card></div>
          <div class="w"><lw-weather-card .hass=${this.hass} .entity=${ov.weather}></lw-weather-card></div>
          <div class="i"><lw-infos-card .hass=${this.hass} .config=${this.config}></lw-infos-card></div>
        </div>

        <div class="band middle">
          <lw-scenes-row .hass=${this.hass} .scenes=${ov.scenes ?? []}></lw-scenes-row>
        </div>

        <div class="band bottom">
          <div class="m"><lw-media-card .hass=${this.hass} .config=${this.config}></lw-media-card></div>
          <div class="k">
            <lw-cameras-card
              .hass=${this.hass}
              .cameras=${ov.cameras ?? []}
              .cameraMotion=${ov.camera_motion ?? {}}
            ></lw-cameras-card>
          </div>
          <div class="c"><lw-calendar-card .hass=${this.hass} .entity=${ov.calendar}></lw-calendar-card></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-overview-page': LwOverviewPage;
  }
}
