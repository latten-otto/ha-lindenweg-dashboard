import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig, RoomConfig, ExtraConfig, RadioStation, ApplianceConfig } from '../types/config';
import { DEFAULT_CONFIG } from '../types/config';
import { configStore } from '../hass/config-store';
import '../icons/lw-icon';
import '../editor/lw-entity-picker';
import '../editor/lw-entity-multi';
import '../editor/lw-text-input';

type EditTab = 'allgemein' | 'overview' | 'energie' | 'events' | 'radios' | 'rooms';

const ROOM_ICONS = [
  'sofa', 'kettle', 'bed', 'shower', 'desk', 'chair', 'door', 'tree', 'cog',
  'home', 'fire', 'garage', 'plant', 'water',
];

const EXTRA_KINDS: { id: string; label: string; icon: string }[] = [
  { id: 'vacuum', label: 'Saugroboter', icon: 'vacuum' },
  { id: 'mower', label: 'Mähroboter', icon: 'leaf' },
  { id: 'irrigation', label: 'Sprinkler (Smart Irrigation)', icon: 'water' },
  { id: 'air-purifier', label: 'Luftreiniger', icon: 'wind' },
  { id: 'dehumidifier', label: 'Luftentfeuchter', icon: 'droplet' },
  { id: 'fan', label: 'Lüfter', icon: 'fan' },
  { id: 'fireplace', label: 'Kamin', icon: 'fire' },
  { id: 'tv', label: 'TV', icon: 'tv' },
  { id: 'generic', label: 'Sonstiges (Schalter)', icon: 'cog' },
];

@customElement('lw-edit-page')
export class LwEditPage extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config: PanelConfig = DEFAULT_CONFIG;

  @state() private _tab: EditTab = 'allgemein';
  @state() private _expandedRoom: string | null = null;

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
      gap: 16px;
      height: 100%;
    }
    .head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
    }
    .title {
      font-size: 26px;
      font-weight: 500;
      letter-spacing: -0.025em;
    }
    .subtitle {
      margin-top: 6px;
      font-size: 12.5px;
      color: var(--text-muted);
    }
    .close {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    .close:hover {
      background: var(--card);
    }
    .tabs {
      display: flex;
      gap: 4px;
      background: var(--card-inset);
      padding: 3px;
      border-radius: 11px;
      width: fit-content;
      max-width: 100%;
      overflow-x: auto;
    }
    .tabs::-webkit-scrollbar {
      height: 0;
    }
    .tab {
      padding: 7px 14px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font: inherit;
      font-size: 12.5px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
    }
    .tab.active {
      background: var(--card-elev);
      color: var(--text);
      box-shadow: var(--shadow-sm);
    }

    .content {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding-right: 4px;
    }
    .content::-webkit-scrollbar {
      width: 6px;
    }
    .content::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 3px;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 14px;
    }
    .card h3 {
      margin: 0 0 14px;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: -0.005em;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 12px;
      align-items: center;
      margin-bottom: 10px;
    }
    .row label {
      font-size: 12.5px;
      color: var(--text);
    }
    .row.tall {
      align-items: start;
    }
    .row.tall label {
      padding-top: 6px;
    }
    .hint {
      font-size: 11px;
      color: var(--text-faint);
      margin-top: 4px;
      grid-column: 2;
    }
    select {
      width: 100%;
      padding: 8px 12px;
      background: var(--card-inset);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
    }
    .save-indicator {
      font-size: 11.5px;
      color: var(--accent);
      font-family: 'Geist Mono', monospace;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .room-card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .room-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      cursor: pointer;
      user-select: none;
    }
    .room-head:hover {
      background: var(--card-inset);
    }
    .room-ico {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: var(--card-inset);
      color: var(--text);
      display: grid;
      place-items: center;
    }
    .room-name {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .room-count {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'Geist Mono', monospace;
    }
    .room-body {
      padding: 0 16px 16px;
      border-top: 1px solid var(--border-soft);
    }
    .add-btn {
      width: 100%;
      padding: 12px;
      border: 1px dashed var(--border);
      background: transparent;
      color: var(--text-muted);
      border-radius: 11px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .add-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .del-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--warn);
      padding: 6px 10px;
      border-radius: 8px;
      font: inherit;
      font-size: 11.5px;
      cursor: pointer;
    }
    .del-btn:hover {
      background: color-mix(in oklab, var(--warn) 10%, transparent);
    }
    .icon-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .icon-pick {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: var(--card-inset);
      border: 1.5px solid transparent;
      color: var(--text-muted);
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .icon-pick:hover {
      color: var(--text);
    }
    .icon-pick.active {
      border-color: var(--accent);
      color: var(--text);
      background: color-mix(in oklab, var(--accent) 18%, var(--card-inset));
    }
    .extra-row {
      display: grid;
      grid-template-columns: 160px 1fr 1fr 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
      border-top: 1px solid var(--border-soft);
    }
    .extra-row:first-child {
      border-top: none;
      padding-top: 12px;
    }
    .extra-cols {
      display: grid;
      grid-template-columns: 160px 1fr 1fr 1fr auto;
      gap: 8px;
      padding: 0 0 6px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
      color: var(--text-faint);
    }
    .radio-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
      border-top: 1px solid var(--border-soft);
    }
    .radio-row:first-of-type {
      border-top: none;
      padding-top: 12px;
    }
    .appliance-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1.5fr auto;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
      border-top: 1px solid var(--border-soft);
    }
  `;

  private _update(patch: Partial<PanelConfig> | ((c: PanelConfig) => PanelConfig)) {
    const next =
      typeof patch === 'function'
        ? (patch as (c: PanelConfig) => PanelConfig)(this.config)
        : { ...this.config, ...patch };
    this.config = next;
    configStore.set(next);
  }

  private _patchOverview<K extends keyof PanelConfig['overview']>(
    key: K,
    value: PanelConfig['overview'][K],
  ) {
    this._update((c) => ({ ...c, overview: { ...c.overview, [key]: value } }));
  }

  private _patchRoom(key: string, patch: Partial<RoomConfig>) {
    this._update((c) => ({
      ...c,
      rooms: {
        ...c.rooms,
        [key]: { ...(c.rooms[key] ?? { name: key }), ...patch },
      },
    }));
  }

  private _deleteRoom(key: string) {
    if (!confirm(`Raum „${this.config.rooms[key]?.name ?? key}" wirklich löschen?`)) return;
    this._update((c) => {
      const r = { ...c.rooms };
      delete r[key];
      return { ...c, rooms: r };
    });
  }

  private _addRoom() {
    const key = prompt('Raum-ID (z.B. wohnzimmer, draussen):')?.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!key) return;
    if (this.config.rooms[key]) {
      alert('Raum existiert bereits');
      return;
    }
    const name = prompt('Anzeigename:', key.charAt(0).toUpperCase() + key.slice(1))?.trim() ?? key;
    this._patchRoom(key, { name, icon: 'cog' });
    this._expandedRoom = key;
  }

  // ---------- Tab: Allgemein ----------
  private _renderGeneral() {
    return html`
      <div class="card">
        <h3>Allgemein</h3>
        <div class="row">
          <label>Name des Zuhauses</label>
          <lw-text-input
            .value=${this.config.household_name}
            placeholder="z.B. Haus Lindenweg"
            @change=${(e: CustomEvent) =>
              this._update({ household_name: e.detail.value })}
          ></lw-text-input>
        </div>
        <div class="row">
          <label>Theme</label>
          <select
            .value=${this.config.theme}
            @change=${(e: Event) =>
              this._update({ theme: (e.target as HTMLSelectElement).value as any })}
          >
            <option value="linen">Linen (hell / warm)</option>
            <option value="walnut">Walnut (dunkel / warm)</option>
          </select>
        </div>
      </div>
    `;
  }

  // ---------- Tab: Overview ----------
  private _renderOverview() {
    const ov = this.config.overview;
    return html`
      <div class="card">
        <h3>Übersicht — Kernelemente</h3>
        <div class="row">
          <label>Wetter-Entity</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${['weather']}
            .value=${ov.weather ?? ''}
            @change=${(e: CustomEvent) => this._patchOverview('weather', e.detail.value || undefined)}
          ></lw-entity-picker>
        </div>
        <div class="row">
          <label>Kalender (heute)</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${['calendar']}
            .value=${ov.calendar ?? ''}
            @change=${(e: CustomEvent) => this._patchOverview('calendar', e.detail.value || undefined)}
          ></lw-entity-picker>
        </div>
        <div class="row">
          <label>Alarmanlage</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${['alarm_control_panel']}
            .value=${ov.alarm_panel ?? ''}
            @change=${(e: CustomEvent) => this._patchOverview('alarm_panel', e.detail.value || undefined)}
          ></lw-entity-picker>
        </div>
        <div class="row tall">
          <label>Personen (Avatare)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ov.presence ?? []}
            .domains=${['person']}
            @change=${(e: CustomEvent) => this._patchOverview('presence', e.detail.value)}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Szenen (Schnellzugriff)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ov.scenes ?? []}
            .domains=${['scene']}
            @change=${(e: CustomEvent) => this._patchOverview('scenes', e.detail.value)}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Kameras</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ov.cameras ?? []}
            .domains=${['camera']}
            @change=${(e: CustomEvent) => this._patchOverview('cameras', e.detail.value)}
          ></lw-entity-multi>
        </div>
      </div>
    `;
  }

  // ---------- Tab: Energie ----------
  private _renderEnergy() {
    const energy = this.config.overview.energy ?? {};
    const set = (key: string, value: string | undefined) => {
      this._patchOverview('energy', { ...energy, [key]: value || undefined } as any);
    };
    const fields = [
      ['pv_now', 'PV Leistung jetzt (W oder kW)'],
      ['pv_today', 'PV Ertrag heute (kWh)'],
      ['consumption', 'Hausverbrauch jetzt'],
      ['grid_feed', 'Netz-Einspeisung'],
      ['grid_draw', 'Netz-Bezug'],
      ['battery_level', 'Akku Ladestand (%)'],
      ['battery_flow', 'Akku Fluss (W, negativ=lädt)'],
    ] as const;
    return html`
      <div class="card">
        <h3>Energie — Sensor-Zuordnung</h3>
        ${fields.map(
          ([k, label]) => html`
            <div class="row">
              <label>${label}</label>
              <lw-entity-picker
                .hass=${this.hass}
                .domains=${['sensor']}
                .value=${(energy as any)[k] ?? ''}
                @change=${(e: CustomEvent) => set(k, e.detail.value)}
              ></lw-entity-picker>
            </div>
          `,
        )}
      </div>
    `;
  }

  // ---------- Tab: Events ----------
  private _renderEvents() {
    const ev = this.config.overview.events ?? {};
    const setEv = <K extends keyof typeof ev>(key: K, value: any) => {
      this._patchOverview('events', { ...ev, [key]: value });
    };
    const addAppliance = () => {
      const next = [
        ...(ev.appliances ?? []),
        { name: 'Neues Gerät', state_entity: '' } as ApplianceConfig,
      ];
      setEv('appliances', next);
    };
    const updateAppliance = (i: number, patch: Partial<ApplianceConfig>) => {
      const list = [...(ev.appliances ?? [])];
      list[i] = { ...list[i], ...patch };
      setEv('appliances', list);
    };
    const removeAppliance = (i: number) => {
      const list = [...(ev.appliances ?? [])];
      list.splice(i, 1);
      setEv('appliances', list);
    };
    return html`
      <div class="card">
        <h3>Geräte mit Fortschritt</h3>
        ${ev.appliances?.length
          ? ev.appliances.map(
              (a, i) => html`
                <div class="appliance-row">
                  <lw-text-input
                    .value=${a.name}
                    placeholder="Name"
                    @change=${(e: CustomEvent) => updateAppliance(i, { name: e.detail.value })}
                  ></lw-text-input>
                  <lw-entity-picker
                    .hass=${this.hass}
                    .domains=${['sensor', 'binary_sensor']}
                    .value=${a.state_entity}
                    placeholder="Status-Entity"
                    @change=${(e: CustomEvent) => updateAppliance(i, { state_entity: e.detail.value })}
                  ></lw-entity-picker>
                  <lw-entity-picker
                    .hass=${this.hass}
                    .domains=${['sensor']}
                    .value=${a.progress_entity ?? ''}
                    placeholder="Fortschritt %"
                    @change=${(e: CustomEvent) => updateAppliance(i, { progress_entity: e.detail.value || undefined })}
                  ></lw-entity-picker>
                  <button class="del-btn" @click=${() => removeAppliance(i)}>Entfernen</button>
                </div>
              `,
            )
          : ''}
        <button class="add-btn" @click=${addAppliance} style="margin-top:12px">
          <lw-icon name="plus" .size=${13} .stroke=${2}></lw-icon>Gerät hinzufügen
        </button>
      </div>

      <div class="card">
        <h3>Abfall / Müll</h3>
        <div class="row">
          <label>Waste Collection Kalender</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${['calendar']}
            .value=${ev.waste_calendar ?? ''}
            @change=${(e: CustomEvent) => setEv('waste_calendar', e.detail.value || undefined)}
          ></lw-entity-picker>
        </div>
      </div>

      <div class="card">
        <h3>Schwache Akkus</h3>
        <div class="row">
          <label>Schwelle (%)</label>
          <lw-text-input
            type="number"
            .value=${String(ev.low_battery_threshold ?? 10)}
            @change=${(e: CustomEvent) =>
              setEv('low_battery_threshold', parseInt(e.detail.value, 10) || 10)}
          ></lw-text-input>
        </div>
        <div class="hint">
          Leer lassen für Auto-Discovery: alle <code>sensor.*</code> mit
          <code>device_class: battery</code> werden überwacht.
        </div>
        <div class="row tall" style="margin-top: 14px">
          <label>Manuell wählen (optional)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ev.battery_entities ?? []}
            .domains=${['sensor']}
            @change=${(e: CustomEvent) => setEv('battery_entities', e.detail.value)}
          ></lw-entity-multi>
        </div>
      </div>
    `;
  }

  // ---------- Tab: Radios ----------
  private _renderRadios() {
    const radios = this.config.overview.radios ?? [];
    const update = (i: number, patch: Partial<RadioStation>) => {
      const list = [...radios];
      list[i] = { ...list[i], ...patch };
      this._patchOverview('radios', list);
    };
    const add = () => {
      this._patchOverview('radios', [...radios, { name: 'Neuer Sender', url: '' }]);
    };
    const remove = (i: number) => {
      const list = [...radios];
      list.splice(i, 1);
      this._patchOverview('radios', list);
    };
    return html`
      <div class="card">
        <h3>Radio-Sender</h3>
        <div class="hint" style="margin-bottom:14px; grid-column:1">
          Klick auf eine Kachel im Musicplayer ruft <code>media_player.play_media</code> mit der
          Stream-URL auf. MP3/AAC Streams funktionieren mit den meisten Playern. Sonos akzeptiert
          auch <code>x-rincon-mp3radio://…</code> URLs.
        </div>
        ${radios.map(
          (r, i) => html`
            <div class="radio-row">
              <lw-text-input
                .value=${r.name}
                placeholder="Sendername"
                @change=${(e: CustomEvent) => update(i, { name: e.detail.value })}
              ></lw-text-input>
              <lw-text-input
                type="url"
                .value=${r.url}
                placeholder="https://stream…"
                @change=${(e: CustomEvent) => update(i, { url: e.detail.value })}
              ></lw-text-input>
              <lw-text-input
                type="url"
                .value=${r.logo ?? ''}
                placeholder="Logo-URL (optional)"
                @change=${(e: CustomEvent) => update(i, { logo: e.detail.value || undefined })}
              ></lw-text-input>
              <button class="del-btn" @click=${() => remove(i)}>×</button>
            </div>
          `,
        )}
        <button class="add-btn" @click=${add} style="margin-top:12px">
          <lw-icon name="plus" .size=${13} .stroke=${2}></lw-icon>Sender hinzufügen
        </button>
      </div>
    `;
  }

  // ---------- Tab: Rooms ----------
  private _renderRooms() {
    const rooms = Object.entries(this.config.rooms);
    return html`
      ${rooms.length === 0
        ? html`<div class="card" style="text-align:center; color:var(--text-muted)">
            Noch keine Räume angelegt. Klick unten auf „Raum hinzufügen".
          </div>`
        : ''}
      ${rooms.map(([key, r]) => this._renderRoomCard(key, r))}
      <button class="add-btn" @click=${this._addRoom}>
        <lw-icon name="plus" .size=${14} .stroke=${2}></lw-icon>Raum hinzufügen
      </button>
    `;
  }

  private _renderRoomCard(key: string, r: RoomConfig) {
    const expanded = this._expandedRoom === key;
    const counts = `${(r.lights?.length ?? 0)}L · ${(r.scenes?.length ?? 0)}S · ${(r.covers?.length ?? 0)}R · ${(r.extras?.length ?? 0)}G`;
    return html`
      <div class="room-card">
        <div
          class="room-head"
          @click=${() => (this._expandedRoom = expanded ? null : key)}
        >
          <div class="room-ico">
            <lw-icon name=${r.icon ?? 'cog'} .size=${17}></lw-icon>
          </div>
          <div class="room-name">${r.name}</div>
          <div class="room-count">${counts}</div>
          <lw-icon name=${expanded ? 'arrow-up' : 'arrow-down'} .size=${14}></lw-icon>
        </div>
        ${expanded ? this._renderRoomBody(key, r) : ''}
      </div>
    `;
  }

  private _renderRoomBody(key: string, r: RoomConfig) {
    const extras = r.extras ?? [];
    const updateExtra = (i: number, patch: Partial<ExtraConfig>) => {
      const list = [...extras];
      list[i] = { ...list[i], ...patch };
      this._patchRoom(key, { extras: list });
    };
    const addExtra = () => {
      this._patchRoom(key, { extras: [...extras, { kind: 'generic', name: 'Neues Gerät' }] });
    };
    const removeExtra = (i: number) => {
      const list = [...extras];
      list.splice(i, 1);
      this._patchRoom(key, { extras: list });
    };

    return html`
      <div class="room-body">
        <div class="row" style="margin-top:14px">
          <label>Anzeigename</label>
          <lw-text-input
            .value=${r.name}
            @change=${(e: CustomEvent) => this._patchRoom(key, { name: e.detail.value })}
          ></lw-text-input>
        </div>
        <div class="row tall">
          <label>Icon</label>
          <div class="icon-grid">
            ${ROOM_ICONS.map(
              (i) => html`
                <button
                  class=${'icon-pick' + (r.icon === i ? ' active' : '')}
                  @click=${() => this._patchRoom(key, { icon: i })}
                  title=${i}
                >
                  <lw-icon name=${i} .size=${16}></lw-icon>
                </button>
              `,
            )}
          </div>
        </div>
        <div class="row">
          <label>Climate-Entity</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${['climate']}
            .value=${r.climate ?? ''}
            @change=${(e: CustomEvent) => this._patchRoom(key, { climate: e.detail.value || undefined })}
          ></lw-entity-picker>
        </div>
        <div class="row">
          <label>Media-Player</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${['media_player']}
            .value=${r.media_player ?? ''}
            @change=${(e: CustomEvent) => this._patchRoom(key, { media_player: e.detail.value || undefined })}
          ></lw-entity-picker>
        </div>
        <div class="row tall">
          <label>Szenen (1-5)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${r.scenes ?? []}
            .domains=${['scene']}
            @change=${(e: CustomEvent) => this._patchRoom(key, { scenes: e.detail.value })}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Lichter (Popup-Steuerung)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${r.lights ?? []}
            .domains=${['light']}
            @change=${(e: CustomEvent) => this._patchRoom(key, { lights: e.detail.value })}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Rollläden / Gardinen</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${r.covers ?? []}
            .domains=${['cover']}
            @change=${(e: CustomEvent) => this._patchRoom(key, { covers: e.detail.value })}
          ></lw-entity-multi>
        </div>

        <h3 style="margin-top:24px">Geräte in diesem Raum</h3>
        ${extras.length > 0
          ? html`
              <div class="extra-cols">
                <div>Typ</div>
                <div>Anzeigename</div>
                <div>Haupt-Entity</div>
                <div>Status-Entity (opt.)</div>
                <div></div>
              </div>
              ${extras.map(
                (x, i) => html`
                  <div class="extra-row">
                    <select
                      .value=${x.kind}
                      @change=${(e: Event) =>
                        updateExtra(i, { kind: (e.target as HTMLSelectElement).value as any })}
                    >
                      ${EXTRA_KINDS.map(
                        (k) => html`<option value=${k.id} ?selected=${x.kind === k.id}>${k.label}</option>`,
                      )}
                    </select>
                    <lw-text-input
                      .value=${x.name}
                      placeholder="Name"
                      @change=${(e: CustomEvent) => updateExtra(i, { name: e.detail.value })}
                    ></lw-text-input>
                    <lw-entity-picker
                      .hass=${this.hass}
                      .value=${x.entity ?? ''}
                      placeholder="entity_id"
                      @change=${(e: CustomEvent) => updateExtra(i, { entity: e.detail.value || undefined })}
                    ></lw-entity-picker>
                    <lw-entity-picker
                      .hass=${this.hass}
                      .value=${x.state_entity ?? ''}
                      placeholder="optional"
                      @change=${(e: CustomEvent) => updateExtra(i, { state_entity: e.detail.value || undefined })}
                    ></lw-entity-picker>
                    <button class="del-btn" @click=${() => removeExtra(i)}>×</button>
                  </div>
                `,
              )}
            `
          : ''}
        <button class="add-btn" @click=${addExtra} style="margin-top:12px">
          <lw-icon name="plus" .size=${13} .stroke=${2}></lw-icon>Gerät hinzufügen
        </button>

        <div style="display:flex; justify-content:flex-end; margin-top:18px">
          <button class="del-btn" @click=${() => this._deleteRoom(key)}>
            Raum löschen
          </button>
        </div>
      </div>
    `;
  }

  private _renderTab() {
    switch (this._tab) {
      case 'allgemein': return this._renderGeneral();
      case 'overview': return this._renderOverview();
      case 'energie': return this._renderEnergy();
      case 'events': return this._renderEvents();
      case 'radios': return this._renderRadios();
      case 'rooms': return this._renderRooms();
    }
  }

  private _close = () => {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  };

  render() {
    return html`
      <div class="page">
        <div class="head">
          <div>
            <div class="title">Einstellungen</div>
            <div class="subtitle">
              Änderungen werden automatisch gespeichert ·
              <span class="save-indicator"><lw-icon name="check" .size=${11}></lw-icon>live sync</span>
            </div>
          </div>
          <button class="close" @click=${this._close}>
            <lw-icon name="x" .size=${13} .stroke=${2}></lw-icon> Fertig
          </button>
        </div>

        <div class="tabs">
          ${(
            [
              ['allgemein', 'Allgemein'],
              ['overview', 'Übersicht'],
              ['energie', 'Energie'],
              ['events', 'Ereignisse'],
              ['radios', 'Radio'],
              ['rooms', 'Räume'],
            ] as [EditTab, string][]
          ).map(
            ([id, label]) => html`
              <button
                class=${'tab ' + (this._tab === id ? 'active' : '')}
                @click=${() => (this._tab = id)}
              >
                ${label}
              </button>
            `,
          )}
        </div>

        <div class="content">${this._renderTab()}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-edit-page': LwEditPage;
  }
}
