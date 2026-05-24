import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { ExtraConfig } from '../types/config';
import { entityState, isOn, friendlyName, callToggle } from '../hass/entity-helpers';
import '../shared/lw-section-head';
import '../shared/lw-feature-tile';

const EXTRA_ICON: Record<string, string> = {
  tv: 'tv',
  fireplace: 'fire',
  fan: 'fan',
  'towel-warmer': 'fire',
  printer: 'printer',
  monitor: 'monitor',
  meeting: 'mic',
  lock: 'lock',
  garage: 'garage',
  irrigation: 'water',
  vacuum: 'vacuum',
  camera: 'camera',
  bell: 'bell',
};

@customElement('lw-room-extras')
export class LwRoomExtras extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) extras: ExtraConfig[] = [];
  @property({ type: String }) heading = 'Geräte';
  @property({ type: String }) sub = 'Räumlich';

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
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: minmax(100px, 1fr);
      align-content: start;
      gap: 8px;
      flex: 1;
      min-height: 0;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;

  private _tint(kind: string): string {
    if (kind === 'fireplace' || kind === 'towel-warmer') return 'var(--warn)';
    if (kind === 'vacuum' || kind === 'fan') return 'var(--accent)';
    return 'var(--amber)';
  }

  private _sub(kind: string, on: boolean, e: ReturnType<typeof entityState>): string {
    if (!e) return on ? 'An' : 'Aus';
    if (kind === 'fireplace') return on ? 'Brennt' : 'Aus';
    if (kind === 'tv') return on ? ((e.attributes?.app_name as string) ?? 'An') : 'Aus';
    if (kind === 'vacuum') {
      const battery = e.attributes?.battery_level;
      return battery ? `${e.state} · ${battery}%` : e.state;
    }
    return on ? 'An' : 'Aus';
  }

  render() {
    if (!this.extras.length) return nothing;
    return html`
      <div class="card">
        <lw-section-head sub=${this.sub} heading=${this.heading}></lw-section-head>
        <div class="grid">
          ${this.extras.map((x) => {
            const e = entityState(this.hass, x.entity);
            const on = e ? isOn(e.state) : false;
            const name = x.name || friendlyName(e, x.entity?.split('.')[1] ?? '');
            return html`
              <lw-feature-tile
                .icon=${EXTRA_ICON[x.kind] ?? 'cog'}
                .name=${name}
                .sub=${this._sub(x.kind, on, e)}
                .on=${on}
                .tint=${this._tint(x.kind)}
                @click=${() => this.hass && x.entity && callToggle(this.hass, x.entity)}
              ></lw-feature-tile>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-room-extras': LwRoomExtras;
  }
}
