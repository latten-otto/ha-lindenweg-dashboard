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
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    /* CSS Grid layout matching the design entwurf:
       Row 1 (top)    : energy(1.55fr) · weather(1fr) · infos(1fr)   — min 360px, grows up to 1.3fr
       Row 2 (scenes) : full-width strip                             — auto height (sizes to content)
       Row 3 (bottom) : media(1.55fr) · cameras(1fr) · calendar(1fr) — min 260px, grows 1fr */
    .grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1.55fr 1fr 1fr;
      grid-template-rows: minmax(360px, 1.3fr) auto minmax(260px, 1fr);
      gap: 12px;
      min-height: 0;
    }
    /* lw-* elements are placed directly as grid items — no wrapper divs.
       min-width:0 / min-height:0 lets them shrink below their natural
       content size, so the grid track widths stay strict. */
    .grid > * { min-width: 0; min-height: 0; }
    .grid > .scenes { grid-column: 1 / -1; }

    @keyframes rise {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Stack on narrower screens. */
    @media (max-width: 1280px) {
      .grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: minmax(280px, auto) minmax(280px, auto) auto minmax(260px, auto) minmax(260px, auto);
      }
      .grid > .e { grid-column: 1 / -1; }
      .grid > .m { grid-column: 1 / -1; }
    }
    @media (max-width: 760px) {
      .grid {
        grid-template-columns: 1fr;
        grid-template-rows: none;
        grid-auto-rows: minmax(auto, max-content);
      }
      .grid > * { grid-column: 1 !important; }
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
          <lw-energy-card class="e" .hass=${this.hass} .energy=${ov.energy ?? {}}></lw-energy-card>
          <lw-weather-card class="w" .hass=${this.hass} .entity=${ov.weather}></lw-weather-card>
          <lw-infos-card class="i" .hass=${this.hass} .config=${this.config}></lw-infos-card>

          <lw-scenes-row class="scenes" .hass=${this.hass} .scenes=${ov.scenes ?? []}></lw-scenes-row>

          <lw-media-card class="m" .hass=${this.hass} .config=${this.config}></lw-media-card>
          <lw-cameras-card
            class="k"
            .hass=${this.hass}
            .cameras=${ov.cameras ?? []}
            .cameraMotion=${ov.camera_motion ?? {}}
          ></lw-cameras-card>
          <lw-calendar-card class="c" .hass=${this.hass} .entity=${ov.calendar}></lw-calendar-card>
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
