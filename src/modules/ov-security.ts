import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import { entityState, isOn } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../shared/lw-pill';

type ArmMode = 'home' | 'away' | 'off';

@customElement('lw-security-card')
export class LwSecurityCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) alarm?: string;

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
    }
    .modes {
      display: flex;
      gap: 3px;
      padding: 3px;
      background: var(--card-inset);
      border-radius: 11px;
    }
    .mode {
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
      font-size: 12px;
      font-weight: 500;
    }
    .mode.active {
      background: var(--card-elev);
      color: var(--text);
      box-shadow: var(--shadow-sm);
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 12px;
      flex: 1;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      border-top: 1px solid var(--border-soft);
    }
    .icon-bg {
      width: 26px;
      height: 26px;
      border-radius: 7px;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .icon-bg.ok {
      background: color-mix(in oklab, var(--accent) 14%, transparent);
      color: var(--accent);
    }
    .icon-bg.warn {
      background: color-mix(in oklab, var(--warn) 14%, transparent);
      color: var(--warn);
    }
    .label {
      flex: 1;
      min-width: 0;
      font-size: 12.5px;
      font-weight: 500;
    }
    .val {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
  `;

  private _setMode(mode: ArmMode) {
    if (!this.hass || !this.alarm) return;
    if (mode === 'off')
      void this.hass.callService('alarm_control_panel', 'alarm_disarm', {}, { entity_id: this.alarm });
    else if (mode === 'home')
      void this.hass.callService('alarm_control_panel', 'alarm_arm_home', {}, { entity_id: this.alarm });
    else
      void this.hass.callService('alarm_control_panel', 'alarm_arm_away', {}, { entity_id: this.alarm });
  }

  private _currentMode(): ArmMode {
    const e = entityState(this.hass, this.alarm);
    if (!e) return 'off';
    if (e.state === 'armed_home') return 'home';
    if (e.state === 'armed_away') return 'away';
    return 'off';
  }

  private _doorsLocks() {
    const states = this.hass?.states ?? {};
    const locks = Object.values(states).filter((s) => s.entity_id.startsWith('lock.'));
    const locked = locks.filter((s) => s.state === 'locked').length;
    return { locked, total: locks.length };
  }

  private _windows() {
    const states = this.hass?.states ?? {};
    const windows = Object.values(states).filter(
      (s) =>
        s.entity_id.startsWith('binary_sensor.') &&
        (s.attributes.device_class === 'window' || s.attributes.device_class === 'door'),
    );
    const open = windows.filter((s) => isOn(s.state)).length;
    return { open, total: windows.length };
  }

  render() {
    const mode = this._currentMode();
    const doors = this._doorsLocks();
    const wins = this._windows();
    const allOk = doors.locked === doors.total && wins.open === 0;

    return html`
      <div class="card">
        <lw-section-head sub="Status" heading="Sicherheit">
          <span slot="right">
            <lw-pill color=${allOk ? 'var(--accent)' : 'var(--warn)'} .soft=${true}>
              ● ${allOk ? 'Alles sicher' : 'Hinweis'}
            </lw-pill>
          </span>
        </lw-section-head>

        <div class="modes">
          ${(
            [
              { id: 'home', name: 'Daheim', icon: 'home' },
              { id: 'away', name: 'Unterwegs', icon: 'arrow-right' },
              { id: 'off', name: 'Aus', icon: 'x' },
            ] as const
          ).map(
            (m) => html`
              <button class=${'mode ' + (mode === m.id ? 'active' : '')} @click=${() => this._setMode(m.id)}>
                <lw-icon name=${m.icon} .size=${13}></lw-icon>${m.name}
              </button>
            `,
          )}
        </div>

        <div class="rows">
          <div class="row">
            <div class="icon-bg ${doors.total === 0 || doors.locked === doors.total ? 'ok' : 'warn'}">
              <lw-icon name="lock" .size=${13}></lw-icon>
            </div>
            <div class="label">${doors.total === 0 ? 'Keine Schlösser' : 'Alle Türen verriegelt'}</div>
            <div class="val">${doors.locked}/${doors.total}</div>
          </div>
          <div class="row">
            <div class="icon-bg ${wins.open === 0 ? 'ok' : 'warn'}">
              <lw-icon name="blinds" .size=${13}></lw-icon>
            </div>
            <div class="label">
              ${wins.open === 0 ? 'Alle Fenster zu' : `${wins.open} Fenster offen`}
            </div>
            <div class="val">${wins.total - wins.open}/${wins.total}</div>
          </div>
          <div class="row">
            <div class="icon-bg ok"><lw-icon name="bell" .size=${13}></lw-icon></div>
            <div class="label">Rauchmelder aktiv</div>
            <div class="val">—</div>
          </div>
          <div class="row">
            <div class="icon-bg ${mode !== 'off' ? 'ok' : 'warn'}">
              <lw-icon name="shield-check" .size=${13}></lw-icon>
            </div>
            <div class="label">Alarmanlage</div>
            <div class="val">${mode === 'off' ? 'Aus' : 'Scharf'}</div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-security-card': LwSecurityCard;
  }
}
