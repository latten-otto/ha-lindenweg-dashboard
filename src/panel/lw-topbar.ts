import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig } from '../types/config';
import { entityState, attrNum, friendlyName } from '../hass/entity-helpers';
import '../icons/lw-icon';

@customElement('lw-topbar')
export class LwTopbar extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: PanelConfig;
  @property({ type: String }) heading?: string;
  @property({ type: String }) subtitle?: string;
  @property({ attribute: false }) time = new Date();

  static styles = css`
    :host {
      display: block;
    }
    .bar {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
    }
    .greeting {
      font-size: 26px;
      font-weight: 500;
      letter-spacing: -0.025em;
      line-height: 1;
    }
    .greeting em {
      font-style: normal;
      color: var(--text-muted);
      font-weight: 400;
    }
    .sub {
      margin-top: 6px;
      font-size: 12.5px;
      color: var(--text-muted);
      letter-spacing: 0.005em;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .weather {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--card);
      border-radius: 11px;
      border: 1px solid var(--border-soft);
      font-family: 'Geist Mono', monospace;
    }
    .weather .t {
      font-size: 13px;
      font-weight: 500;
    }
    .weather .lbl {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'Geist', sans-serif;
    }
    .presence {
      display: flex;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid var(--bg);
      margin-left: -8px;
      display: grid;
      place-items: center;
      font-size: 12px;
      font-weight: 600;
      color: white;
      position: relative;
    }
    .avatar:first-child {
      margin-left: 0;
    }
    .avatar.away {
      filter: grayscale(0.9) opacity(0.55);
    }
    .avatar .dot {
      position: absolute;
      right: -1px;
      bottom: -1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid var(--bg);
    }
    .avatar.home .dot {
      background: var(--accent);
    }
    .avatar.away .dot {
      background: var(--text-faint);
    }
  `;

  private _greet(): string {
    const h = this.time.getHours();
    if (h < 5) return 'Gute Nacht';
    if (h < 11) return 'Guten Morgen';
    if (h < 17) return 'Hallo';
    if (h < 22) return 'Guten Abend';
    return 'Gute Nacht';
  }

  private _userName(): string {
    return this.hass?.user?.name?.split(' ')[0] ?? '';
  }

  private _dateTime(): string {
    const lang = this.hass?.language || 'de-DE';
    const dateStr = this.time.toLocaleDateString(lang, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const timeStr = this.time.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
    return `${dateStr} · ${timeStr}`;
  }

  private _initials(name: string): string {
    return name
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  private _avatarColor(id: string): string {
    const palette = ['#7e8f70', '#c47556', '#6e8a9e', '#d9a25a', '#a3b58c', '#d88366'];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
  }

  render() {
    const persons = this.config?.overview?.presence ?? [];
    const weatherEntity = entityState(this.hass, this.config?.overview?.weather);
    const userName = this._userName();
    return html`
      <div class="bar">
        <div>
          <div class="greeting">
            ${this.heading
              ? this.heading
              : html`${this._greet()}, <em>${userName}</em>`}
          </div>
          <div class="sub">${this.subtitle ?? this._dateTime()}</div>
        </div>
        <div class="right">
          ${weatherEntity
            ? html`
                <div class="weather">
                  <lw-icon
                    name="partly-cloudy"
                    .size=${16}
                    style="color:var(--amber)"
                  ></lw-icon>
                  <span class="t"
                    >${Math.round(attrNum(weatherEntity, 'temperature', NaN))}°C</span
                  >
                  <span class="lbl">außen</span>
                </div>
              `
            : nothing}
          ${persons.length > 0
            ? html`
                <div class="presence">
                  ${persons.map((id) => {
                    const e = entityState(this.hass, id);
                    if (!e) return null;
                    const home = e.state === 'home';
                    const name = friendlyName(e, id.split('.')[1]);
                    return html`
                      <div
                        class=${'avatar ' + (home ? 'home' : 'away')}
                        style=${`background:${this._avatarColor(id)}`}
                        title=${name + (home ? ' · zuhause' : ' · unterwegs')}
                      >
                        ${this._initials(name)}
                        <span class="dot"></span>
                      </div>
                    `;
                  })}
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-topbar': LwTopbar;
  }
}
