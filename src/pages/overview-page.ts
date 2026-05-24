import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig } from '../types/config';
import { entityState, isOn } from '../hass/entity-helpers';
import '../panel/lw-topbar';
import '../modules/ov-weather';
import '../modules/ov-energy';
import '../modules/ov-security';
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
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: 100%;
      animation: rise 0.35s ease-out both;
    }
    .grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1.55fr 1fr 1fr;
      grid-template-rows: minmax(360px, 1.3fr) auto minmax(260px, 1fr);
      gap: 12px;
      min-height: 0;
    }
    .full {
      grid-column: 1 / -1;
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
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
      }
      .full {
        grid-column: 1 / -1;
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
    const subtitle =
      `${totalOn} Lichter an · ${Object.keys(this.config.rooms ?? {}).length} Räume`;

    return html`
      <div class="page">
        <lw-topbar
          .hass=${this.hass}
          .config=${this.config}
          .subtitle=${subtitle}
          .time=${this.time}
        ></lw-topbar>

        <div class="grid">
          <lw-energy-card .hass=${this.hass} .energy=${ov.energy ?? {}}></lw-energy-card>
          <lw-weather-card .hass=${this.hass} .entity=${ov.weather}></lw-weather-card>
          <lw-security-card .hass=${this.hass} .alarm=${ov.alarm_panel}></lw-security-card>

          <div class="full">
            <lw-scenes-row .hass=${this.hass} .scenes=${ov.scenes ?? []}></lw-scenes-row>
          </div>

          <lw-media-card .hass=${this.hass} .config=${this.config}></lw-media-card>
          <lw-cameras-card .hass=${this.hass} .cameras=${ov.cameras ?? []}></lw-cameras-card>
          <lw-calendar-card .hass=${this.hass} .entity=${ov.calendar}></lw-calendar-card>
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
