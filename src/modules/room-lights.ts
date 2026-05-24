import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import {
  entityState,
  friendlyName,
  brightnessPct,
  callLightTurnOn,
  callLightTurnOff,
  callSceneActivate,
} from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../controls/lw-light-tile';

const SCENE_ICON: Record<string, string> = {
  ambiente: 'moon',
  ambient: 'moon',
  abend: 'moon',
  an: 'lightbulb',
  on: 'lightbulb',
  auto: 'sparkle',
  hell: 'sun',
  bright: 'sun',
  film: 'film',
  movie: 'film',
  lesen: 'book',
  read: 'book',
  kochen: 'kettle',
  cook: 'kettle',
  essen: 'chair',
  dinner: 'chair',
};

@customElement('lw-lights-card')
export class LwLightsCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) lights: string[] = [];
  @property({ type: Array }) scenes: string[] = [];
  @property({ type: String }) roomName = '';

  @state() private _popupOpen = false;
  @state() private _firing: string | null = null;

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
      gap: 14px;
    }
    .scenes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      flex: 1;
      min-height: 0;
      align-content: center;
    }
    .btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 16px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      color: var(--text);
      text-align: left;
      transition: background 0.18s, border-color 0.18s, transform 0.1s;
      cursor: pointer;
      min-height: 88px;
    }
    .btn:hover {
      background: var(--card);
      border-color: var(--border);
    }
    .btn:active {
      transform: scale(0.98);
    }
    .btn.firing {
      background: color-mix(in oklab, var(--amber) 24%, var(--card-inset));
      border-color: color-mix(in oklab, var(--amber) 60%, var(--border-soft));
    }
    .btn.off {
      background: var(--card-inset);
    }
    .ico {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--card);
      color: var(--text);
      display: grid;
      place-items: center;
      border: 1px solid var(--border-soft);
    }
    .btn.firing .ico {
      background: var(--amber);
      color: white;
      border-color: var(--amber);
    }
    .name {
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: -0.005em;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
    .gear {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      border-radius: 9px;
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .gear:hover {
      color: var(--text);
      background: var(--card-inset);
    }

    /* Popup overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 200;
      display: grid;
      place-items: center;
      animation: fade 0.18s ease-out both;
      padding: 24px;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .sheet {
      background: var(--bg);
      border-radius: 20px;
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow-lg);
      padding: 22px;
      max-width: 720px;
      width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .sheet-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .sheet-head .title {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    .sheet-head .sub {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
    }
    .sheet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 10px;
      overflow: auto;
      padding-right: 4px;
    }
    .sheet-grid::-webkit-scrollbar {
      width: 0;
    }
    .sheet-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid var(--border-soft);
    }
    .btn-pri {
      padding: 8px 16px;
      background: var(--text);
      color: var(--bg);
      border: 1px solid var(--text);
      border-radius: 10px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-sec {
      padding: 8px 16px;
      background: transparent;
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 10px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
  `;

  private _onCount(): number {
    return this.lights.filter((id) => entityState(this.hass, id)?.state === 'on').length;
  }

  private _allOff(): void {
    if (!this.hass) return;
    this.lights.forEach((id) => callLightTurnOff(this.hass!, id));
  }

  private _runScene(id: string): void {
    if (!this.hass) return;
    this._firing = id;
    callSceneActivate(this.hass, id);
    setTimeout(() => (this._firing = null), 1000);
  }

  private _iconFor(id: string, name: string): string {
    const lc = (name + ' ' + id).toLowerCase();
    for (const [k, v] of Object.entries(SCENE_ICON)) {
      if (lc.includes(k)) return v;
    }
    return 'sparkle';
  }

  private _displayName(id: string, friendly: string): string {
    // Strip the room key prefix from the scene name so buttons read "Ambiente" not "Bad Unten Ambiente".
    // E.g. friendly_name "Bad Unten Ambiente" → "Ambiente"
    const room = this.roomName.toLowerCase();
    if (room && friendly.toLowerCase().startsWith(room)) {
      return friendly.slice(room.length).trim() || friendly;
    }
    // Try id-based stripping: scene.bad_unten_ambiente → "Ambiente"
    const rest = id.split('.')[1] ?? id;
    const parts = rest.split('_');
    if (parts.length > 1) {
      const last = parts[parts.length - 1];
      return last.charAt(0).toUpperCase() + last.slice(1);
    }
    return friendly;
  }

  private _openPopup = () => (this._popupOpen = true);
  private _closePopup = () => (this._popupOpen = false);

  render() {
    const hasScenes = this.scenes.length > 0;
    const hasLights = this.lights.length > 0;
    if (!hasScenes && !hasLights) {
      return html`<div class="card">
        <lw-section-head sub="0" heading="Beleuchtung"></lw-section-head>
        <div class="empty">Keine Szenen oder Lichter konfiguriert</div>
      </div>`;
    }
    const count = this._onCount();
    const total = this.lights.length;

    return html`
      <div class="card">
        <lw-section-head
          sub=${total ? `${count} von ${total} an` : 'Szenen'}
          heading="Beleuchtung"
        >
          <button
            slot="right"
            class="gear"
            title="Einzelsteuerung"
            @click=${this._openPopup}
          >
            <lw-icon name="sliders" .size=${15}></lw-icon>
          </button>
        </lw-section-head>

        <div class="scenes">
          ${this.scenes.map((sid) => {
            const e = entityState(this.hass, sid);
            const name = friendlyName(e, sid.split('.')[1]);
            const displayName = this._displayName(sid, name);
            return html`
              <button
                class=${'btn ' + (this._firing === sid ? 'firing' : '')}
                @click=${() => this._runScene(sid)}
              >
                <div class="ico">
                  <lw-icon name=${this._iconFor(sid, name)} .size=${18}></lw-icon>
                </div>
                <div class="name">${displayName}</div>
              </button>
            `;
          })}
          ${hasLights
            ? html`
                <button class="btn off" @click=${this._allOff}>
                  <div class="ico">
                    <lw-icon name="x" .size=${18} .stroke=${2}></lw-icon>
                  </div>
                  <div class="name">Aus</div>
                </button>
              `
            : nothing}
        </div>
      </div>

      ${this._popupOpen
        ? html`
            <div class="overlay" @click=${this._closePopup}>
              <div class="sheet" @click=${(e: Event) => e.stopPropagation()}>
                <div class="sheet-head">
                  <div>
                    <div class="sub">Einzelsteuerung</div>
                    <div class="title">${this.roomName || 'Beleuchtung'}</div>
                  </div>
                  <button class="btn-sec" @click=${this._closePopup}>Schließen</button>
                </div>

                ${hasLights
                  ? html`
                      <div class="sheet-grid">
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
                    `
                  : html`<div class="empty">Keine Lichter im Raum konfiguriert</div>`}

                <div class="sheet-actions">
                  <button class="btn-sec" @click=${this._allOff}>Alle aus</button>
                  <button
                    class="btn-pri"
                    @click=${() => {
                      if (this.hass) {
                        this.lights.forEach((id) => callLightTurnOn(this.hass!, id));
                      }
                    }}
                  >
                    Alle an
                  </button>
                </div>
              </div>
            </div>
          `
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-lights-card': LwLightsCard;
  }
}
