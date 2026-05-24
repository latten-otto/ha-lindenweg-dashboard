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
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
      /* Three rows: tall card row, scenes (130px min + auto-grow), medium
         card row. Explicit minmax for the scenes row prevents the previous
         min-content collapse where the Lit child reported 0 height and the
         card painted over adjacent rows. */
      grid-template-rows: minmax(360px, 1fr) minmax(130px, auto) minmax(300px, 1fr);
      grid-template-areas:
        'energy weather infos'
        'scenes scenes scenes'
        'media cameras calendar';
      gap: 20px;
      min-height: 0;
      overflow: auto;
    }
    .grid::-webkit-scrollbar {
      width: 0;
    }

    .a-energy { grid-area: energy; min-width: 0; }
    .a-weather { grid-area: weather; min-width: 0; }
    .a-infos { grid-area: infos; min-width: 0; }
    .a-scenes { grid-area: scenes; min-width: 0; }
    .a-media { grid-area: media; min-width: 0; }
    .a-cameras { grid-area: cameras; min-width: 0; }
    .a-calendar { grid-area: calendar; min-width: 0; }

    @keyframes rise {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1280px) {
      .grid {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        grid-template-rows: auto;
        grid-template-areas:
          'energy energy'
          'weather infos'
          'scenes scenes'
          'media cameras'
          'calendar calendar';
      }
    }
    @media (max-width: 760px) {
      .grid {
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas:
          'energy' 'weather' 'infos' 'scenes' 'media' 'cameras' 'calendar';
      }
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

        <div class="grid">
          <lw-energy-card class="a-energy" .hass=${this.hass} .energy=${ov.energy ?? {}}></lw-energy-card>
          <lw-weather-card class="a-weather" .hass=${this.hass} .entity=${ov.weather}></lw-weather-card>
          <lw-infos-card class="a-infos" .hass=${this.hass} .config=${this.config}></lw-infos-card>

          <lw-scenes-row class="a-scenes" .hass=${this.hass} .scenes=${ov.scenes ?? []}></lw-scenes-row>

          <lw-media-card class="a-media" .hass=${this.hass} .config=${this.config}></lw-media-card>
          <lw-cameras-card
            class="a-cameras"
            .hass=${this.hass}
            .cameras=${ov.cameras ?? []}
            .cameraMotion=${ov.camera_motion ?? {}}
          ></lw-cameras-card>
          <lw-calendar-card class="a-calendar" .hass=${this.hass} .entity=${ov.calendar}></lw-calendar-card>
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
