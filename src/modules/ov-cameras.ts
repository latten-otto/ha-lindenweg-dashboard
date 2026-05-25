import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, HassEntity } from '../hass/hass-types';
import { entityState, friendlyName, isOn } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';

@customElement('lw-cameras-card')
export class LwCamerasCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) cameras: string[] = [];
  /** Optional map: camera_entity → motion binary_sensor entity */
  @property({ attribute: false }) cameraMotion: Record<string, string> = {};

  @state() private _selected: string | null = null;
  @state() private _manual = false;
  private _motionLastChanged: Record<string, number> = {};

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
      gap: 12px;
      min-width: 0;
      overflow: hidden;
    }
    .main {
      flex: 1;
      min-height: 0;
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(160deg, #1a2a32 0%, #2a3a3a 60%, #3a4a3a 100%);
      border: 1px solid var(--border-soft);
      background-size: cover;
      background-position: center;
    }
    .vignette {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 40%;
      background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.55));
      pointer-events: none;
    }
    .badge {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      color: white;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
    .badge .live {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #e76f51;
    }
    .name {
      position: absolute;
      bottom: 10px;
      left: 12px;
      color: white;
      font-size: 13px;
      font-weight: 500;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
    }
    .selector {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .selector::-webkit-scrollbar {
      height: 0;
    }
    .pick {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 10px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      color: var(--text-muted);
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.12s;
    }
    .pick.active {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    .pick .dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--text-faint);
    }
    .pick.active .dot {
      background: var(--accent);
    }
    .pick.motion .dot {
      background: #e76f51;
      animation: pulse-soft 1.5s ease-in-out infinite;
    }
    @keyframes pulse-soft {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 40px 0;
      text-align: center;
    }
    .auto-tag {
      font-size: 10px;
      color: var(--text-faint);
      font-family: 'Geist Mono', monospace;
    }
  `;

  updated() {
    if (!this.hass) return;
    // Track last-motion timestamp from binary_sensors.
    let latestCam: string | null = null;
    let latestTs = 0;
    Object.entries(this.cameraMotion).forEach(([cam, sensor]) => {
      const e = entityState(this.hass, sensor);
      if (!e) return;
      const ts = Date.parse(e.last_changed);
      if (isOn(e.state)) {
        // Live motion → prefer it strongly
        this._motionLastChanged[cam] = ts + 10_000_000_000; // boost
      } else {
        this._motionLastChanged[cam] = ts;
      }
      if ((this._motionLastChanged[cam] ?? 0) > latestTs) {
        latestTs = this._motionLastChanged[cam];
        latestCam = cam;
      }
    });
    // Default selection
    if (this._selected === null && this.cameras.length) {
      this._selected = latestCam ?? this.cameras[0];
    }
    // Auto-switch only if user hasn't manually picked
    if (!this._manual && latestCam && this._selected !== latestCam) {
      this._selected = latestCam;
    }
    // Reset cams that aren't in list
    if (this._selected && !this.cameras.includes(this._selected)) {
      this._selected = this.cameras[0] ?? null;
    }
  }

  private _pick(cam: string) {
    this._manual = true;
    this._selected = cam;
  }

  private _resetAuto = () => {
    this._manual = false;
  };

  private _hasMotion(cam: string): boolean {
    const sensor = this.cameraMotion?.[cam];
    if (!sensor) return false;
    const e = entityState(this.hass, sensor);
    return e ? isOn(e.state) : false;
  }

  private _imgFor(cam: string): string | undefined {
    const e: HassEntity | undefined = entityState(this.hass, cam);
    return e?.attributes?.entity_picture as string | undefined;
  }

  render() {
    if (!this.cameras.length) {
      return html`<div class="card">
        <lw-section-head sub="Live" heading="Kameras"></lw-section-head>
        <div class="empty">Keine Kameras konfiguriert</div>
      </div>`;
    }
    const cam = this._selected ?? this.cameras[0];
    const e = entityState(this.hass, cam);
    const online = e && e.state !== 'unavailable' && e.state !== 'unknown';
    const img = this._imgFor(cam);
    const name = friendlyName(e, cam.split('.')[1]);
    const motionOnHere = this._hasMotion(cam);

    return html`
      <div class="card">
        <lw-section-head sub=${`Live · ${this.cameras.length} Kameras`} heading="Kameras">
          ${this._manual
            ? html`<button slot="right" class="auto-tag" @click=${this._resetAuto}>
                Auto
              </button>`
            : nothing}
        </lw-section-head>

        <div class="main" style=${img ? `background-image:url(${img})` : ''}>
          <div class="vignette"></div>
          <div class="badge">
            <span class="live"></span>${online ? (motionOnHere ? 'MOTION' : 'LIVE') : 'OFFLINE'}
          </div>
          <div class="name">${name}</div>
        </div>

        <div class="selector">
          ${this.cameras.map((c) => {
            const ce = entityState(this.hass, c);
            const nm = friendlyName(ce, c.split('.')[1]);
            const motion = this._hasMotion(c);
            const active = c === cam;
            return html`
              <button
                class=${'pick' + (active ? ' active' : '') + (motion ? ' motion' : '')}
                @click=${() => this._pick(c)}
                title=${nm}
              >
                <span class="dot"></span>${nm.length > 18 ? nm.slice(0, 16) + '…' : nm}
              </button>
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
