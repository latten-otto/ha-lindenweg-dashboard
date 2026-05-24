import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, HassEntity } from '../hass/hass-types';
import type { ApplianceConfig, EventsConfig } from '../types/config';
import { entityState, friendlyName, attrNum } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';

interface WasteEvent {
  start: string;
  end: string;
  summary: string;
}

const APPLIANCE_ICON: Record<string, string> = {
  dishwasher: 'water',
  washer: 'washer',
  washing_machine: 'washer',
  dryer: 'fan',
  oven: 'oven',
  fridge: 'fridge',
  vacuum: 'vacuum',
};

@customElement('lw-events-card')
export class LwEventsCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) events: EventsConfig = {};

  @state() private _waste: WasteEvent[] = [];
  private _lastWasteFetch = 0;

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
      gap: 8px;
      min-width: 0;
    }
    .list {
      flex: 1;
      min-height: 0;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .list::-webkit-scrollbar {
      width: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 10px 12px;
      background: var(--card-inset);
      border-radius: 11px;
      border: 1px solid var(--border-soft);
    }
    .row.active {
      border-color: color-mix(in oklab, var(--accent) 35%, var(--border-soft));
      background: color-mix(in oklab, var(--accent) 8%, var(--card-inset));
    }
    .row.warn {
      border-color: color-mix(in oklab, var(--warn) 35%, var(--border-soft));
      background: color-mix(in oklab, var(--warn) 8%, var(--card-inset));
    }
    .ico {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .ico.appliance.active {
      background: var(--accent);
      color: white;
    }
    .ico.battery {
      background: color-mix(in oklab, var(--warn) 18%, transparent);
      color: var(--warn);
    }
    .ico.waste {
      background: color-mix(in oklab, var(--amber) 18%, transparent);
      color: var(--amber);
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
      letter-spacing: -0.005em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .progress {
      margin-top: 5px;
      height: 4px;
      background: var(--card);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress .bar {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
      transition: width 0.4s ease-out;
    }
    .val {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      min-width: 36px;
      text-align: right;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
    .header-tag {
      font-size: 10px;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
      padding: 8px 4px 4px;
    }
  `;

  updated() {
    if (!this.hass || !this.events?.waste_calendar) return;
    if (Date.now() - this._lastWasteFetch < 30 * 60 * 1000) return;
    this._lastWasteFetch = Date.now();
    void this._fetchWaste();
  }

  private async _fetchWaste() {
    if (!this.hass || !this.events.waste_calendar) return;
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    try {
      const evs = await this.hass.callApi<WasteEvent[]>(
        'GET',
        `calendars/${this.events.waste_calendar}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`,
      );
      this._waste = Array.isArray(evs) ? evs.slice(0, 3) : [];
    } catch {
      this._waste = [];
    }
  }

  private _kindFromName(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('spül') || n.includes('dishwasher')) return 'dishwasher';
    if (n.includes('trockner') || n.includes('dryer')) return 'dryer';
    if (n.includes('wäsche') || n.includes('washer') || n.includes('waschmaschine')) return 'washer';
    if (n.includes('saug') || n.includes('vacuum') || n.includes('mäh') || n.includes('mower')) return 'vacuum';
    if (n.includes('oven') || n.includes('backofen')) return 'oven';
    return 'generic';
  }

  private _readAppliance(a: ApplianceConfig): {
    state: string;
    progress: number;
    remaining: string;
    active: boolean;
    icon: string;
  } {
    const stE: HassEntity | undefined = entityState(this.hass, a.state_entity);
    const state = stE?.state ?? 'unknown';
    const kind = this._kindFromName(a.name);
    const icon = a.icon ?? APPLIANCE_ICON[kind] ?? 'cog';
    const progE = entityState(this.hass, a.progress_entity);
    let progress = progE ? parseFloat(progE.state) : NaN;
    if (!Number.isFinite(progress)) progress = attrNum(stE, 'progress', NaN);
    // Miele exposes "remaining_time" as minutes
    const remE = entityState(this.hass, a.remaining_entity);
    let remaining = remE?.state ?? '';
    if (!remaining) {
      const mins = attrNum(stE, 'remaining_time', NaN);
      if (Number.isFinite(mins)) remaining = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
    }
    const active = !['off', 'idle', 'standby', 'unavailable', 'unknown', 'not_running', 'docked'].includes(state.toLowerCase());
    return { state, progress: Number.isFinite(progress) ? progress : 0, remaining, active, icon };
  }

  private _stateLabel(s: string): string {
    const map: Record<string, string> = {
      running: 'läuft',
      run: 'läuft',
      cleaning: 'reinigt',
      mowing: 'mäht',
      paused: 'Pause',
      finished: 'fertig',
      in_use: 'in Benutzung',
      programmed: 'programmiert',
      off: 'aus',
      docked: 'lädt',
      idle: 'bereit',
    };
    return map[s.toLowerCase()] ?? s;
  }

  private _lowBatterySensors(): HassEntity[] {
    if (!this.hass) return [];
    const threshold = this.events.low_battery_threshold ?? 10;
    const explicit = this.events.battery_entities ?? [];
    const candidates: HassEntity[] = [];
    if (explicit.length) {
      explicit.forEach((id) => {
        const e = entityState(this.hass, id);
        if (e) candidates.push(e);
      });
    } else {
      Object.values(this.hass.states).forEach((e) => {
        if (!e.entity_id.startsWith('sensor.')) return;
        if (e.attributes.device_class !== 'battery') return;
        candidates.push(e);
      });
    }
    return candidates
      .filter((e) => {
        const v = parseFloat(e.state);
        return Number.isFinite(v) && v <= threshold;
      })
      .sort((a, b) => parseFloat(a.state) - parseFloat(b.state))
      .slice(0, 6);
  }

  private _formatWasteDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dd = new Date(d);
    dd.setHours(0, 0, 0, 0);
    if (dd.getTime() === today.getTime()) return 'Heute';
    if (dd.getTime() === tomorrow.getTime()) return 'Morgen';
    return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  render() {
    const appliances = this.events.appliances ?? [];
    const battery = this._lowBatterySensors();
    const waste = this._waste;
    const empty = !appliances.length && !battery.length && !waste.length;

    return html`
      <div class="card">
        <lw-section-head sub="Aktuell" heading="Ereignisse"></lw-section-head>

        ${empty
          ? html`<div class="empty">Keine aktiven Ereignisse</div>`
          : html`<div class="list">
              ${appliances.length
                ? html`
                    <div class="header-tag">Geräte</div>
                    ${appliances.map((a) => {
                      const r = this._readAppliance(a);
                      return html`
                        <div class=${'row' + (r.active ? ' active' : '')}>
                          <div class=${'ico appliance' + (r.active ? ' active' : '')}>
                            <lw-icon name=${r.icon} .size=${16}></lw-icon>
                          </div>
                          <div class="body">
                            <div class="name">${a.name}</div>
                            <div class="sub">
                              ${this._stateLabel(r.state)}${r.remaining ? ` · noch ${r.remaining}` : ''}
                            </div>
                            ${r.active && r.progress > 0
                              ? html`<div class="progress">
                                  <div class="bar" style=${`width:${Math.min(100, r.progress)}%`}></div>
                                </div>`
                              : nothing}
                          </div>
                          ${r.active && r.progress > 0
                            ? html`<div class="val">${Math.round(r.progress)}%</div>`
                            : nothing}
                        </div>
                      `;
                    })}
                  `
                : nothing}
              ${waste.length
                ? html`
                    <div class="header-tag">Abfall</div>
                    ${waste.map(
                      (w) => html`
                        <div class="row">
                          <div class="ico waste">
                            <lw-icon name="package" .size=${16}></lw-icon>
                          </div>
                          <div class="body">
                            <div class="name">${w.summary}</div>
                            <div class="sub">${this._formatWasteDate(w.start)}</div>
                          </div>
                        </div>
                      `,
                    )}
                  `
                : nothing}
              ${battery.length
                ? html`
                    <div class="header-tag">Akkus schwach</div>
                    ${battery.map(
                      (b) => html`
                        <div class="row warn">
                          <div class="ico battery">
                            <lw-icon name="bolt" .size=${16}></lw-icon>
                          </div>
                          <div class="body">
                            <div class="name">${friendlyName(b, b.entity_id)}</div>
                            <div class="sub">${b.entity_id}</div>
                          </div>
                          <div class="val">${Math.round(parseFloat(b.state))}%</div>
                        </div>
                      `,
                    )}
                  `
                : nothing}
            </div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-events-card': LwEventsCard;
  }
}
