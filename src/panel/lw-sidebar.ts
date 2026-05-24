import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig, RoomConfig } from '../types/config';
import { entityState, isOn, stateNum, attrNum } from '../hass/entity-helpers';
import '../icons/lw-icon';

@customElement('lw-sidebar')
export class LwSidebar extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: PanelConfig;
  @property({ type: String }) page = 'overview';

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 200px;
      flex-shrink: 0;
      background: var(--bg-soft);
      border-right: 1px solid var(--border-soft);
      padding: 24px 14px 20px;
      gap: 6px;
      overflow: hidden;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 10px 18px;
    }
    .brand-mark {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: var(--text);
      color: var(--bg);
      display: grid;
      place-items: center;
      font-weight: 600;
    }
    .brand-name {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .brand-sub {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .section {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-faint);
      padding: 14px 10px 6px;
    }
    .rooms {
      display: flex;
      flex-direction: column;
      gap: 1px;
      overflow: auto;
      min-height: 0;
    }
    .rooms::-webkit-scrollbar {
      width: 0;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 9px 10px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text);
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      transition: background 0.12s;
      position: relative;
    }
    .item:hover {
      background: var(--hover-bg);
    }
    .item.active {
      background: var(--card);
      box-shadow: var(--shadow-sm);
    }
    .item .ic {
      color: var(--text-muted);
      flex-shrink: 0;
      display: inline-flex;
    }
    .item.active .ic {
      color: var(--text);
    }
    .label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .badge {
      margin-left: auto;
      font-size: 11px;
      color: var(--text-faint);
      font-family: 'Geist Mono', monospace;
    }
    .badge.accent {
      color: var(--amber);
    }
    .foot {
      margin-top: auto;
      padding: 12px 10px;
      border-top: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .foot-temp {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.02em;
      font-family: 'Geist Mono', monospace;
    }
    .foot-label {
      font-size: 11px;
      color: var(--text-muted);
    }
    .gear {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      cursor: pointer;
      flex-shrink: 0;
    }
    .gear:hover {
      color: var(--text);
      background: var(--card);
    }
  `;

  private _go(page: string) {
    this.dispatchEvent(
      new CustomEvent('navigate', { detail: { page }, bubbles: true, composed: true }),
    );
  }

  private _onCount(room: RoomConfig): number {
    if (!this.hass || !room.lights?.length) return 0;
    return room.lights.filter((id) => isOn(this.hass!.states[id]?.state ?? 'off')).length;
  }

  private _presenceCount(): { home: number; total: number } {
    const persons = this.config.overview?.presence ?? [];
    if (!this.hass) return { home: 0, total: persons.length };
    let home = 0;
    persons.forEach((p) => {
      if (this.hass!.states[p]?.state === 'home') home++;
    });
    return { home, total: persons.length };
  }

  private _weather(): { temp: number; icon: string; wind: number } | null {
    const w = entityState(this.hass, this.config.overview?.weather);
    if (!w) return null;
    return {
      temp: Math.round(attrNum(w, 'temperature', NaN)),
      icon: this._mapWeatherIcon(w.state),
      wind: Math.round(attrNum(w, 'wind_speed', 0)),
    };
  }

  private _mapWeatherIcon(state: string): string {
    if (state.includes('sunny') || state === 'clear-night') return 'sun';
    if (state.includes('rain') || state.includes('pour')) return 'rain';
    if (state.includes('cloud')) return 'cloud';
    if (state.includes('partlycloudy')) return 'partly-cloudy';
    return 'partly-cloudy';
  }

  render() {
    const rooms = this.config.rooms ?? {};
    const presence = this._presenceCount();
    const weather = this._weather();
    return html`
      <div class="brand">
        <div class="brand-mark">
          <lw-icon name="home" .size=${16} .stroke=${2}></lw-icon>
        </div>
        <div style="flex:1;min-width:0">
          <div class="brand-name">${this.config.household_name}</div>
          <div class="brand-sub">Home Assistant</div>
        </div>
      </div>

      <div class="section">Übersicht</div>
      <button
        class=${'item ' + (this.page === 'overview' ? 'active' : '')}
        @click=${() => this._go('overview')}
      >
        <span class="ic"><lw-icon name="sparkle" .size=${17}></lw-icon></span>
        <span class="label">Dashboard</span>
        ${presence.total > 0
          ? html`<span class="badge">${presence.home}/${presence.total}</span>`
          : null}
      </button>

      <div class="section">Räume</div>
      <div class="rooms">
        ${Object.entries(rooms).map(([key, room]) => {
          const count = this._onCount(room);
          return html`
            <button
              class=${'item ' + (this.page === key ? 'active' : '')}
              @click=${() => this._go(key)}
            >
              <span class="ic"
                ><lw-icon name=${room.icon ?? 'cog'} .size=${17}></lw-icon
              ></span>
              <span class="label">${room.name}</span>
              ${count > 0
                ? html`<span class="badge accent">● ${count}</span>`
                : null}
            </button>
          `;
        })}
      </div>

      ${weather
        ? html`
            <div class="foot">
              <lw-icon name=${weather.icon} .size=${22} style="color:var(--amber)"></lw-icon>
              <div style="flex:1;min-width:0">
                <div class="foot-temp">${Number.isFinite(weather.temp) ? weather.temp + '°' : '–°'}</div>
                <div class="foot-label">außen · ${weather.wind} km/h</div>
              </div>
              <button
                class="gear"
                title="Konfiguration"
                @click=${() =>
                  this.dispatchEvent(
                    new CustomEvent('open-config', { bubbles: true, composed: true }),
                  )}
              >
                <lw-icon name="gear" .size=${16}></lw-icon>
              </button>
            </div>
          `
        : html`
            <div class="foot" style="justify-content:flex-end">
              <button
                class="gear"
                title="Konfiguration"
                @click=${() =>
                  this.dispatchEvent(
                    new CustomEvent('open-config', { bubbles: true, composed: true }),
                  )}
              >
                <lw-icon name="gear" .size=${16}></lw-icon>
              </button>
            </div>
          `}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-sidebar': LwSidebar;
  }
}
