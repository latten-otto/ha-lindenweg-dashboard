import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, HassEntity } from '../hass/hass-types';
import type { PanelConfig, ApplianceConfig, ExtraConfig } from '../types/config';
import { entityState, friendlyName, isOn, attrNum } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../shared/lw-pill';

type ArmMode = 'home' | 'away' | 'off';

interface CalendarEvent {
  start: string;
  end: string;
  summary: string;
}

const ACTIVE_STATES = new Set([
  'running', 'in_use', 'active', 'cleaning', 'mowing', 'on', 'returning', 'paused',
  'rinse_hold', 'autocleaning', 'super_cooling', 'super_freezing', 'super_heating',
  'spinning', 'washing', 'drying', 'rinsing', 'finishing',
]);
const ERROR_STATES = new Set(['error', 'failure', 'failed', 'fault']);

const APPLIANCE_ICON: Record<string, string> = {
  dishwasher: 'water',
  geschirr: 'water',
  washer: 'washer',
  wasch: 'washer',
  dryer: 'fan',
  trockner: 'fan',
  oven: 'oven',
  backofen: 'oven',
};

@customElement('lw-infos-card')
export class LwInfosCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: PanelConfig;

  @state() private _wasteToday: CalendarEvent[] = [];
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
      padding: 18px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      gap: 12px;
    }
    .alarm-modes {
      display: flex;
      gap: 3px;
      padding: 3px;
      background: var(--card-inset);
      border-radius: 11px;
    }
    .alarm-mode {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 5px;
      justify-content: center;
      padding: 7px 6px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }
    .alarm-mode.active {
      background: var(--card-elev);
      color: var(--text);
      box-shadow: var(--shadow-sm);
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
    .empty {
      color: var(--text-muted);
      font-size: 12.5px;
      padding: 16px 0;
      text-align: center;
    }
    .header-tag {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-faint);
      padding: 6px 4px 2px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 11px;
      border: 1px solid var(--border-soft);
      background: var(--card-inset);
    }
    .row.active {
      border-color: color-mix(in oklab, var(--accent) 35%, var(--border-soft));
      background: color-mix(in oklab, var(--accent) 8%, var(--card-inset));
    }
    .row.warn {
      border-color: color-mix(in oklab, var(--warn) 40%, var(--border-soft));
      background: color-mix(in oklab, var(--warn) 10%, var(--card-inset));
    }
    .row.status {
      background: transparent;
      border: none;
      border-top: 1px solid var(--border-soft);
      border-radius: 0;
      padding: 8px 4px;
    }
    .ico {
      width: 28px;
      height: 28px;
      border-radius: 8px;
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
    .ico.error {
      background: var(--warn);
      color: white;
    }
    .ico.waste {
      background: color-mix(in oklab, var(--amber) 25%, transparent);
      color: var(--amber);
    }
    .ico.ok {
      background: color-mix(in oklab, var(--accent) 14%, transparent);
      color: var(--accent);
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .row.warn .sub {
      color: var(--warn);
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
  `;

  updated() {
    if (!this.hass) return;
    const cal = this.config?.overview?.events?.waste_calendar;
    if (!cal) return;
    if (Date.now() - this._lastWasteFetch < 30 * 60 * 1000) return;
    this._lastWasteFetch = Date.now();
    void this._fetchWasteToday();
  }

  private async _fetchWasteToday() {
    if (!this.hass) return;
    const cal = this.config?.overview?.events?.waste_calendar;
    if (!cal) return;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59);
    try {
      const evs = await this.hass.callApi<CalendarEvent[]>(
        'GET',
        `calendars/${cal}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`,
      );
      this._wasteToday = Array.isArray(evs) ? evs : [];
    } catch {
      this._wasteToday = [];
    }
  }

  // ---- Alarm ----
  private _alarmMode(): ArmMode {
    const e = entityState(this.hass, this.config?.overview?.alarm_panel);
    if (!e) return 'off';
    if (e.state === 'armed_home') return 'home';
    if (e.state === 'armed_away') return 'away';
    return 'off';
  }

  private _setAlarmMode(mode: ArmMode) {
    if (!this.hass) return;
    const e = this.config?.overview?.alarm_panel;
    if (!e) return;
    if (mode === 'off')
      void this.hass.callService('alarm_control_panel', 'alarm_disarm', {}, { entity_id: e });
    else if (mode === 'home')
      void this.hass.callService('alarm_control_panel', 'alarm_arm_home', {}, { entity_id: e });
    else
      void this.hass.callService('alarm_control_panel', 'alarm_arm_away', {}, { entity_id: e });
  }

  // ---- Discoveries ----
  private _runningAppliances(): { a: ApplianceConfig; state: string; progress: number; remaining: string; icon: string }[] {
    const list = this.config?.overview?.events?.appliances ?? [];
    const out: any[] = [];
    list.forEach((a) => {
      const stE = entityState(this.hass, a.state_entity);
      if (!stE) return;
      const state = stE.state ?? '';
      if (!ACTIVE_STATES.has(state.toLowerCase())) return;
      const progE = entityState(this.hass, a.progress_entity);
      let progress = progE ? parseFloat(progE.state) : NaN;
      if (!Number.isFinite(progress)) progress = attrNum(stE, 'progress', NaN);
      const remE = entityState(this.hass, a.remaining_entity);
      let remaining = remE?.state ?? '';
      if (!remaining) {
        const mins = attrNum(stE, 'remaining_time', NaN);
        if (Number.isFinite(mins)) remaining = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
      }
      const n = (a.name || '').toLowerCase();
      let icon = a.icon ?? 'cog';
      if (!a.icon) {
        for (const [k, v] of Object.entries(APPLIANCE_ICON)) {
          if (n.includes(k)) { icon = v; break; }
        }
      }
      out.push({ a, state, progress: Number.isFinite(progress) ? progress : 0, remaining, icon });
    });
    return out;
  }

  private _allExtras(): ExtraConfig[] {
    const rooms = this.config?.rooms ?? {};
    const out: ExtraConfig[] = [];
    Object.values(rooms).forEach((r) => {
      (r.extras ?? []).forEach((x) => out.push(x));
    });
    return out;
  }

  private _erroringDevices(): { extra: ExtraConfig; e: HassEntity }[] {
    const out: any[] = [];
    this._allExtras().forEach((x) => {
      if (!['vacuum', 'mower', 'irrigation'].includes(x.kind)) return;
      if (!x.entity) return;
      const e = entityState(this.hass, x.entity);
      if (!e) return;
      const s = e.state.toLowerCase();
      const isError = ERROR_STATES.has(s) || (e.attributes.error && e.attributes.error !== 'none');
      if (isError) out.push({ extra: x, e });
    });
    return out;
  }

  private _stateLabel(s: string): string {
    const map: Record<string, string> = {
      running: 'läuft',
      cleaning: 'reinigt',
      mowing: 'mäht',
      paused: 'pausiert',
      drying: 'trocknet',
      washing: 'wäscht',
      rinsing: 'spült',
      spinning: 'schleudert',
      in_use: 'läuft',
      finished: 'fertig',
      finishing: 'beendet',
      programmed: 'programmiert',
      docked: 'lädt',
      idle: 'bereit',
      returning: 'fährt zurück',
      end_programmed: 'beendet',
    };
    return map[s.toLowerCase()] ?? s;
  }

  // ---- Status rows ----
  private _doorsLocks() {
    const states = this.hass?.states ?? {};
    const locks = Object.values(states).filter((s) => s.entity_id.startsWith('lock.'));
    return {
      locked: locks.filter((s) => s.state === 'locked').length,
      total: locks.length,
    };
  }
  private _windows() {
    const states = this.hass?.states ?? {};
    const w = Object.values(states).filter(
      (s) =>
        s.entity_id.startsWith('binary_sensor.') &&
        (s.attributes.device_class === 'window' || s.attributes.device_class === 'door'),
    );
    return { open: w.filter((s) => isOn(s.state)).length, total: w.length };
  }

  render() {
    const mode = this._alarmMode();
    const hasAlarm = !!this.config?.overview?.alarm_panel;
    const doors = this._doorsLocks();
    const wins = this._windows();
    const allOk = doors.locked === doors.total && wins.open === 0;
    const apps = this._runningAppliances();
    const errors = this._erroringDevices();
    const waste = this._wasteToday;
    const hasAny = apps.length > 0 || errors.length > 0 || waste.length > 0;

    return html`
      <div class="card">
        <lw-section-head sub="Status" heading="Infos">
          ${hasAlarm
            ? html`<lw-pill
                slot="right"
                color=${allOk && mode !== 'off' ? 'var(--accent)' : errors.length ? 'var(--warn)' : 'var(--amber)'}
                .soft=${true}
              >
                ● ${errors.length > 0 ? `${errors.length} Fehler` : allOk && mode !== 'off' ? 'Alles ok' : 'Hinweis'}
              </lw-pill>`
            : ''}
        </lw-section-head>

        ${hasAlarm
          ? html`
              <div class="alarm-modes">
                ${(
                  [
                    { id: 'home', name: 'Daheim', icon: 'home' },
                    { id: 'away', name: 'Unterwegs', icon: 'arrow-right' },
                    { id: 'off', name: 'Aus', icon: 'x' },
                  ] as const
                ).map(
                  (m) => html`
                    <button
                      class=${'alarm-mode ' + (mode === m.id ? 'active' : '')}
                      @click=${() => this._setAlarmMode(m.id)}
                    >
                      <lw-icon name=${m.icon} .size=${13}></lw-icon>${m.name}
                    </button>
                  `,
                )}
              </div>
            `
          : ''}

        <div class="list">
          ${errors.length
            ? html`
                <div class="header-tag">Fehler</div>
                ${errors.map(
                  ({ extra, e }) => html`
                    <div class="row warn">
                      <div class="ico error">
                        <lw-icon
                          name=${extra.kind === 'vacuum'
                            ? 'vacuum'
                            : extra.kind === 'mower'
                              ? 'leaf'
                              : 'water'}
                          .size=${14}
                        ></lw-icon>
                      </div>
                      <div class="body">
                        <div class="name">${extra.name || friendlyName(e, extra.entity!)}</div>
                        <div class="sub">
                          ${e.attributes.error || this._stateLabel(e.state)}
                        </div>
                      </div>
                    </div>
                  `,
                )}
              `
            : nothing}
          ${apps.length
            ? html`
                <div class="header-tag">Läuft gerade</div>
                ${apps.map(
                  ({ a, state, progress, remaining, icon }) => html`
                    <div class="row active">
                      <div class="ico appliance active">
                        <lw-icon name=${icon} .size=${14}></lw-icon>
                      </div>
                      <div class="body">
                        <div class="name">${a.name}</div>
                        <div class="sub">
                          ${this._stateLabel(state)}${remaining ? ` · noch ${remaining}` : ''}
                        </div>
                        ${progress > 0
                          ? html`<div class="progress">
                              <div class="bar" style=${`width:${Math.min(100, progress)}%`}></div>
                            </div>`
                          : nothing}
                      </div>
                      ${progress > 0 ? html`<div class="val">${Math.round(progress)}%</div>` : nothing}
                    </div>
                  `,
                )}
              `
            : nothing}
          ${waste.length
            ? html`
                <div class="header-tag">Abholung heute</div>
                ${waste.map(
                  (w) => html`
                    <div class="row">
                      <div class="ico waste"><lw-icon name="package" .size=${14}></lw-icon></div>
                      <div class="body">
                        <div class="name">${w.summary}</div>
                        <div class="sub">heute</div>
                      </div>
                    </div>
                  `,
                )}
              `
            : nothing}
          ${hasAlarm || doors.total > 0 || wins.total > 0
            ? html`
                <div class="row status">
                  <div class=${'ico ' + (doors.locked === doors.total || doors.total === 0 ? 'ok' : 'warn')}>
                    <lw-icon name="lock" .size=${13}></lw-icon>
                  </div>
                  <div class="body">
                    <div class="name">
                      ${doors.total === 0 ? 'Keine Schlösser' : 'Türen'}
                    </div>
                  </div>
                  <div class="val">${doors.locked}/${doors.total}</div>
                </div>
                <div class="row status">
                  <div class=${'ico ' + (wins.open === 0 ? 'ok' : 'warn')}>
                    <lw-icon name="blinds" .size=${13}></lw-icon>
                  </div>
                  <div class="body">
                    <div class="name">
                      ${wins.open === 0 ? 'Alle Fenster zu' : `${wins.open} Fenster offen`}
                    </div>
                  </div>
                  <div class="val">${wins.total - wins.open}/${wins.total}</div>
                </div>
                ${hasAlarm
                  ? html`<div class="row status">
                      <div class=${'ico ' + (mode !== 'off' ? 'ok' : 'warn')}>
                        <lw-icon name="shield-check" .size=${13}></lw-icon>
                      </div>
                      <div class="body">
                        <div class="name">Alarmanlage</div>
                      </div>
                      <div class="val">${mode === 'off' ? 'Aus' : 'Scharf'}</div>
                    </div>`
                  : nothing}
              `
            : !hasAny
              ? html`<div class="empty">Alles ruhig</div>`
              : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-infos-card': LwInfosCard;
  }
}
