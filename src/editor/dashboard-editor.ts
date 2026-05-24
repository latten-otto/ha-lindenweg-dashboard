import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig } from '../types/config';
import { DEFAULT_CONFIG } from '../types/config';

interface EntityOption {
  id: string;
  name: string;
}

@customElement('lw-config-helper')
export class LwConfigHelper extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config: PanelConfig = DEFAULT_CONFIG;

  @state() private _draft: PanelConfig = DEFAULT_CONFIG;
  @state() private _expandedRoom: string | null = null;

  static styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 100;
      overflow: auto;
      animation: fade 0.2s ease-out both;
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
      max-width: 720px;
      margin: 40px auto;
      background: var(--bg);
      color: var(--text);
      border-radius: 18px;
      padding: 24px;
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow-lg);
    }
    h2 {
      margin: 0 0 4px;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    p.lead {
      color: var(--text-muted);
      font-size: 13px;
      margin: 0 0 18px;
    }
    .section {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--border-soft);
    }
    .section h3 {
      margin: 0 0 10px;
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }
    .row {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 10px;
      align-items: center;
      margin-bottom: 8px;
    }
    .row label {
      font-size: 12.5px;
      color: var(--text);
    }
    input,
    select {
      width: 100%;
      padding: 8px 10px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
    }
    input:focus,
    select:focus {
      outline: none;
      border-color: var(--accent);
    }
    .room-card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .room-head {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .room-head .name {
      flex: 1;
      font-weight: 500;
      font-size: 13.5px;
    }
    .room-head .count {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'Geist Mono', monospace;
    }
    .room-body {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed var(--border-soft);
    }
    .yaml {
      margin-top: 24px;
      padding: 16px;
      background: var(--card-inset);
      border-radius: 12px;
      border: 1px solid var(--border-soft);
    }
    .yaml-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .yaml-head .title {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }
    pre {
      margin: 0;
      font-family: 'Geist Mono', monospace;
      font-size: 11.5px;
      line-height: 1.5;
      color: var(--text);
      overflow: auto;
      max-height: 240px;
      white-space: pre;
    }
    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    button.btn {
      padding: 8px 14px;
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 8px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    button.btn.primary {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    .add-room {
      width: 100%;
      padding: 8px;
      border: 1px dashed var(--border);
      background: transparent;
      color: var(--text-muted);
      border-radius: 10px;
      font-size: 12px;
      cursor: pointer;
    }
    .note {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 8px;
      line-height: 1.5;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this._draft = JSON.parse(JSON.stringify(this.config));
  }

  private _entities(domain: string): EntityOption[] {
    if (!this.hass) return [];
    return Object.values(this.hass.states)
      .filter((s) => s.entity_id.startsWith(domain + '.'))
      .map((s) => ({ id: s.entity_id, name: (s.attributes.friendly_name as string) ?? s.entity_id }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _setOverview<K extends keyof PanelConfig['overview']>(
    key: K,
    value: PanelConfig['overview'][K],
  ) {
    this._draft = { ...this._draft, overview: { ...this._draft.overview, [key]: value } };
  }

  private _setEnergy<K extends keyof NonNullable<PanelConfig['overview']['energy']>>(
    key: K,
    value: string | undefined,
  ) {
    this._draft = {
      ...this._draft,
      overview: {
        ...this._draft.overview,
        energy: { ...(this._draft.overview.energy ?? {}), [key]: value || undefined },
      },
    };
  }

  private _setRoom(key: string, patch: Partial<PanelConfig['rooms'][string]>) {
    this._draft = {
      ...this._draft,
      rooms: { ...this._draft.rooms, [key]: { ...this._draft.rooms[key], ...patch } },
    };
  }

  private _addRoom() {
    const key = prompt('Raum-Key (z.B. wohnzimmer):')?.trim().toLowerCase();
    if (!key) return;
    const name = prompt('Anzeigename:', key)?.trim() ?? key;
    this._setRoom(key, { name, icon: 'cog' });
    this._expandedRoom = key;
  }

  private _yaml(): string {
    const c = this._draft;
    const lines: string[] = [
      'panel_custom:',
      '  - name: lindenweg-dashboard',
      `    sidebar_title: ${this._yamlEscape(c.household_name)}`,
      '    sidebar_icon: mdi:home-variant',
      '    url_path: lindenweg',
      '    module_url: /hacsfiles/ha-lindenweg-dashboard/lindenweg-dashboard.js',
      '    config:',
      `      theme: ${c.theme}`,
      `      household_name: ${this._yamlEscape(c.household_name)}`,
    ];

    const ov = c.overview;
    const ovLines: string[] = [];
    if (ov.weather) ovLines.push(`        weather: ${ov.weather}`);
    if (ov.calendar) ovLines.push(`        calendar: ${ov.calendar}`);
    if (ov.alarm_panel) ovLines.push(`        alarm_panel: ${ov.alarm_panel}`);
    if (ov.presence?.length) {
      ovLines.push('        presence:');
      ov.presence.forEach((id) => ovLines.push(`          - ${id}`));
    }
    if (ov.scenes?.length) {
      ovLines.push('        scenes:');
      ov.scenes.forEach((id) => ovLines.push(`          - ${id}`));
    }
    if (ov.cameras?.length) {
      ovLines.push('        cameras:');
      ov.cameras.forEach((id) => ovLines.push(`          - ${id}`));
    }
    if (ov.energy && Object.values(ov.energy).some(Boolean)) {
      ovLines.push('        energy:');
      Object.entries(ov.energy).forEach(([k, v]) => {
        if (v) ovLines.push(`          ${k}: ${v}`);
      });
    }
    if (ovLines.length) {
      lines.push('      overview:');
      lines.push(...ovLines);
    }

    if (Object.keys(c.rooms).length) {
      lines.push('      rooms:');
      Object.entries(c.rooms).forEach(([key, r]) => {
        lines.push(`        ${key}:`);
        lines.push(`          name: ${this._yamlEscape(r.name)}`);
        if (r.icon) lines.push(`          icon: ${r.icon}`);
        if (r.climate) lines.push(`          climate: ${r.climate}`);
        if (r.media_player) lines.push(`          media_player: ${r.media_player}`);
        if (r.lights?.length) {
          lines.push('          lights:');
          r.lights.forEach((id) => lines.push(`            - ${id}`));
        }
        if (r.covers?.length) {
          lines.push('          covers:');
          r.covers.forEach((id) => lines.push(`            - ${id}`));
        }
      });
    }
    return lines.join('\n');
  }

  private _yamlEscape(s: string): string {
    return /[:#&*!|>'"%@`]/.test(s) ? JSON.stringify(s) : s;
  }

  private _copy() {
    navigator.clipboard?.writeText(this._yaml());
  }

  private _close() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _multiInput(value: string[] | undefined, set: (v: string[]) => void) {
    return html`<input
      type="text"
      .value=${(value ?? []).join(', ')}
      placeholder="entity1, entity2, …"
      @change=${(e: Event) => {
        const v = (e.target as HTMLInputElement).value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        set(v);
      }}
    />`;
  }

  render() {
    const ov = this._draft.overview;
    const rooms = Object.entries(this._draft.rooms);
    return html`
      <div class="sheet" @click=${(e: Event) => e.stopPropagation()}>
        <h2>Lindenweg Dashboard · Config Helper</h2>
        <p class="lead">
          Wähle deine HA-Entities, kopiere den generierten YAML-Block in
          <code>configuration.yaml</code> und starte HA neu. Änderungen werden
          <strong>nicht direkt gespeichert</strong> — der HA Panel-Custom-Mechanismus
          ist YAML-basiert.
        </p>

        <div class="section">
          <h3>Allgemein</h3>
          <div class="row">
            <label>Name</label>
            <input
              type="text"
              .value=${this._draft.household_name}
              @input=${(e: Event) =>
                (this._draft = {
                  ...this._draft,
                  household_name: (e.target as HTMLInputElement).value,
                })}
            />
          </div>
          <div class="row">
            <label>Theme</label>
            <select
              .value=${this._draft.theme}
              @change=${(e: Event) =>
                (this._draft = {
                  ...this._draft,
                  theme: (e.target as HTMLSelectElement).value as PanelConfig['theme'],
                })}
            >
              <option value="linen">Linen (hell)</option>
              <option value="walnut">Walnut (dark)</option>
            </select>
          </div>
        </div>

        <div class="section">
          <h3>Übersicht</h3>
          <div class="row">
            <label>Wetter</label>
            <select
              .value=${ov.weather ?? ''}
              @change=${(e: Event) =>
                this._setOverview('weather', (e.target as HTMLSelectElement).value || undefined)}
            >
              <option value="">— keins —</option>
              ${this._entities('weather').map(
                (o) => html`<option value=${o.id}>${o.name}</option>`,
              )}
            </select>
          </div>
          <div class="row">
            <label>Kalender</label>
            <select
              .value=${ov.calendar ?? ''}
              @change=${(e: Event) =>
                this._setOverview('calendar', (e.target as HTMLSelectElement).value || undefined)}
            >
              <option value="">— keiner —</option>
              ${this._entities('calendar').map(
                (o) => html`<option value=${o.id}>${o.name}</option>`,
              )}
            </select>
          </div>
          <div class="row">
            <label>Alarmanlage</label>
            <select
              .value=${ov.alarm_panel ?? ''}
              @change=${(e: Event) =>
                this._setOverview(
                  'alarm_panel',
                  (e.target as HTMLSelectElement).value || undefined,
                )}
            >
              <option value="">— keine —</option>
              ${this._entities('alarm_control_panel').map(
                (o) => html`<option value=${o.id}>${o.name}</option>`,
              )}
            </select>
          </div>
          <div class="row">
            <label>Personen</label>
            ${this._multiInput(ov.presence, (v) => this._setOverview('presence', v))}
          </div>
          <div class="row">
            <label>Szenen</label>
            ${this._multiInput(ov.scenes, (v) => this._setOverview('scenes', v))}
          </div>
          <div class="row">
            <label>Kameras</label>
            ${this._multiInput(ov.cameras, (v) => this._setOverview('cameras', v))}
          </div>
        </div>

        <div class="section">
          <h3>Energie</h3>
          ${(
            [
              ['pv_now', 'PV Leistung jetzt'],
              ['pv_today', 'PV Ertrag heute'],
              ['consumption', 'Verbrauch jetzt'],
              ['grid_feed', 'Einspeisung'],
              ['grid_draw', 'Bezug'],
              ['battery_level', 'Akku %'],
              ['battery_flow', 'Akku Fluss'],
            ] as const
          ).map(
            ([k, label]) => html`
              <div class="row">
                <label>${label}</label>
                <input
                  type="text"
                  list="energy-entities"
                  .value=${(ov.energy?.[k] as string) ?? ''}
                  placeholder="sensor.…"
                  @change=${(e: Event) =>
                    this._setEnergy(k, (e.target as HTMLInputElement).value)}
                />
              </div>
            `,
          )}
          <datalist id="energy-entities">
            ${this._entities('sensor').map((o) => html`<option value=${o.id}>${o.name}</option>`)}
          </datalist>
        </div>

        <div class="section">
          <h3>Räume</h3>
          ${rooms.length === 0
            ? html`<p class="note">Noch keine Räume — Klick auf „+ Raum hinzufügen"</p>`
            : nothing}
          ${rooms.map(
            ([key, r]) => html`
              <div class="room-card">
                <div class="room-head" @click=${() => (this._expandedRoom = this._expandedRoom === key ? null : key)}>
                  <div class="name">${r.name}</div>
                  <div class="count">
                    ${(r.lights?.length ?? 0)} Lichter ·
                    ${(r.covers?.length ?? 0)} Rollläden
                  </div>
                </div>
                ${this._expandedRoom === key
                  ? html`
                      <div class="room-body">
                        <div class="row">
                          <label>Name</label>
                          <input
                            type="text"
                            .value=${r.name}
                            @input=${(e: Event) =>
                              this._setRoom(key, { name: (e.target as HTMLInputElement).value })}
                          />
                        </div>
                        <div class="row">
                          <label>Icon</label>
                          <input
                            type="text"
                            .value=${r.icon ?? ''}
                            placeholder="sofa, kettle, bed, desk, …"
                            @input=${(e: Event) =>
                              this._setRoom(key, { icon: (e.target as HTMLInputElement).value })}
                          />
                        </div>
                        <div class="row">
                          <label>Climate</label>
                          <select
                            .value=${r.climate ?? ''}
                            @change=${(e: Event) =>
                              this._setRoom(key, {
                                climate: (e.target as HTMLSelectElement).value || undefined,
                              })}
                          >
                            <option value="">— keins —</option>
                            ${this._entities('climate').map(
                              (o) => html`<option value=${o.id}>${o.name}</option>`,
                            )}
                          </select>
                        </div>
                        <div class="row">
                          <label>Media Player</label>
                          <select
                            .value=${r.media_player ?? ''}
                            @change=${(e: Event) =>
                              this._setRoom(key, {
                                media_player: (e.target as HTMLSelectElement).value || undefined,
                              })}
                          >
                            <option value="">— keins —</option>
                            ${this._entities('media_player').map(
                              (o) => html`<option value=${o.id}>${o.name}</option>`,
                            )}
                          </select>
                        </div>
                        <div class="row">
                          <label>Lichter</label>
                          ${this._multiInput(r.lights, (v) => this._setRoom(key, { lights: v }))}
                        </div>
                        <div class="row">
                          <label>Rollläden</label>
                          ${this._multiInput(r.covers, (v) => this._setRoom(key, { covers: v }))}
                        </div>
                      </div>
                    `
                  : nothing}
              </div>
            `,
          )}
          <button class="add-room" @click=${this._addRoom}>+ Raum hinzufügen</button>
        </div>

        <div class="yaml">
          <div class="yaml-head">
            <div class="title">Generiertes YAML</div>
            <button class="btn" @click=${this._copy}>Kopieren</button>
          </div>
          <pre>${this._yaml()}</pre>
        </div>

        <div class="actions">
          <button class="btn" @click=${this._close}>Schließen</button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-config-helper': LwConfigHelper;
  }
}
