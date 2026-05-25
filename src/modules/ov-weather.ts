import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant, HassEntity } from '../hass/hass-types';
import { entityState, attrNum } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';

const ICON_MAP: Record<string, string> = {
  sunny: 'sun',
  'clear-night': 'moon',
  cloudy: 'cloud',
  partlycloudy: 'partly-cloudy',
  rainy: 'rain',
  pouring: 'rain',
  snowy: 'cloud',
  fog: 'cloud',
  hail: 'rain',
  lightning: 'rain',
  windy: 'wind',
};

@customElement('lw-weather-card')
export class LwWeatherCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) entity?: string;

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .icon {
      color: var(--amber);
    }
    .temp {
      font-size: 48px;
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .temp .u {
      font-size: 22px;
      color: var(--text-muted);
    }
    .desc {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-top: 12px;
    }
    .metric {
      background: var(--card-inset);
      border-radius: 10px;
      padding: 8px 10px;
    }
    .metric .l {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-muted);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }
    .metric .v {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      margin-top: 2px;
    }
    .forecast {
      margin-top: auto;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      gap: 4px;
    }
    .day {
      flex: 1;
      text-align: center;
    }
    .day .d {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .day .i {
      color: var(--amber);
      margin: 4px 0;
      display: grid;
      place-items: center;
    }
    .day .t {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
    }
    .day .t .lo {
      color: var(--text-faint);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;

  private _conditionLabel(state: string): string {
    const map: Record<string, string> = {
      sunny: 'Sonnig',
      'clear-night': 'Klar',
      cloudy: 'Bewölkt',
      partlycloudy: 'Teils bewölkt',
      rainy: 'Regen',
      pouring: 'Starkregen',
      snowy: 'Schnee',
      fog: 'Nebel',
      windy: 'Windig',
    };
    return map[state] ?? state;
  }

  private _icon(state: string): string {
    return ICON_MAP[state] ?? 'partly-cloudy';
  }

  private _forecastDay(idx: number): string {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    return d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
  }

  render() {
    const e: HassEntity | undefined = entityState(this.hass, this.entity);
    if (!e) {
      return html`<div class="card">
        <lw-section-head sub="Außen" heading="Wetter"></lw-section-head>
        <div class="empty">Kein Wetter-Entity konfiguriert</div>
      </div>`;
    }
    const temp = Math.round(attrNum(e, 'temperature', NaN));
    const wind = Math.round(attrNum(e, 'wind_speed', 0));
    const humidity = Math.round(attrNum(e, 'humidity', 0));
    const forecast: any[] = (e.attributes.forecast as any[]) ?? [];
    return html`
      <div class="card">
        <lw-section-head sub="Außen" heading=${'Wetter · ' + (this.hass?.config?.location_name ?? '')}></lw-section-head>
        <div class="row">
          <div class="icon">
            <lw-icon name=${this._icon(e.state)} .size=${64} .stroke=${1.2}></lw-icon>
          </div>
          <div>
            <div class="temp">
              ${Number.isFinite(temp) ? temp : '–'}<span class="u">°C</span>
            </div>
            <div class="desc">${this._conditionLabel(e.state)}</div>
          </div>
        </div>
        <div class="metrics">
          <div class="metric">
            <div class="l"><lw-icon name="wind" .size=${12}></lw-icon>Wind</div>
            <div class="v">${wind} km/h</div>
          </div>
          <div class="metric">
            <div class="l"><lw-icon name="droplet" .size=${12}></lw-icon>Feuchte</div>
            <div class="v">${humidity}%</div>
          </div>
          <div class="metric">
            <div class="l"><lw-icon name="leaf" .size=${12}></lw-icon>Luft</div>
            <div class="v">${attrNum(e, 'air_quality', 0) || '–'}</div>
          </div>
        </div>
        ${forecast.length > 0
          ? html`<div class="forecast">
              ${forecast.slice(0, 5).map(
                (f, i) => html`
                  <div class="day">
                    <div class="d">${this._forecastDay(i + 1)}</div>
                    <div class="i">
                      <lw-icon
                        name=${this._icon(f.condition ?? '')}
                        .size=${20}
                      ></lw-icon>
                    </div>
                    <div class="t">
                      ${Math.round(f.temperature ?? f.high ?? 0)}°
                      <span class="lo"
                        >${Math.round(f.templow ?? f.low ?? 0)}°</span
                      >
                    </div>
                  </div>
                `,
              )}
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-weather-card': LwWeatherCard;
  }
}
