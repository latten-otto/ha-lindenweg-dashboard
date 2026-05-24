import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../../hass/hass-types';
import { entityState, friendlyName, attrNum } from '../../hass/entity-helpers';
import '../../icons/lw-icon';

@customElement('lw-extra-vacuum')
export class LwExtraVacuum extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) entity!: string;
  @property({ type: String }) name = '';

  static styles = css`
    :host {
      display: block;
    }
    .tile {
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 13px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 110px;
      height: 100%;
    }
    .tile.cleaning {
      background: color-mix(in oklab, var(--accent) 12%, var(--card-inset));
      border-color: color-mix(in oklab, var(--accent) 45%, var(--border-soft));
    }
    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .ico {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.cleaning {
      background: var(--accent);
      color: white;
    }
    .battery {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
    .battery.low {
      color: var(--warn);
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .state {
      font-size: 10.5px;
      color: var(--text-muted);
    }
    .actions {
      display: flex;
      gap: 6px;
      margin-top: auto;
    }
    .btn {
      flex: 1;
      padding: 7px;
      border-radius: 8px;
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .btn:hover {
      background: var(--card-elev);
    }
    .btn.primary {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
  `;

  private _stateLabel(s: string): string {
    const map: Record<string, string> = {
      cleaning: 'reinigt',
      docked: 'lädt',
      returning: 'fährt zurück',
      paused: 'pausiert',
      error: 'Fehler',
      idle: 'bereit',
    };
    return map[s.toLowerCase()] ?? s;
  }

  private _call(service: string) {
    if (!this.hass) return;
    void this.hass.callService('vacuum', service, {}, { entity_id: this.entity });
  }

  render() {
    const e = entityState(this.hass, this.entity);
    const state = e?.state ?? 'unknown';
    const battery = Math.round(attrNum(e, 'battery_level', NaN));
    const cleaning = ['cleaning', 'returning', 'paused'].includes(state.toLowerCase());
    const displayName = this.name || friendlyName(e, this.entity.split('.')[1]);

    return html`
      <div class=${'tile' + (cleaning ? ' cleaning' : '')}>
        <div class="head">
          <div class=${'ico' + (cleaning ? ' cleaning' : '')}>
            <lw-icon name="vacuum" .size=${16}></lw-icon>
          </div>
          ${Number.isFinite(battery)
            ? html`<span class=${'battery' + (battery <= 20 ? ' low' : '')}>
                <lw-icon name="bolt" .size=${10}></lw-icon>${battery}%
              </span>`
            : ''}
        </div>
        <div>
          <div class="name">${displayName}</div>
          <div class="state">${this._stateLabel(state)}</div>
        </div>
        <div class="actions">
          ${cleaning
            ? html`
                <button class="btn" @click=${() => this._call('pause')}>
                  <lw-icon name="pause" .size=${12}></lw-icon>Pause
                </button>
                <button class="btn primary" @click=${() => this._call('return_to_base')}>
                  Dock
                </button>
              `
            : html`
                <button class="btn primary" @click=${() => this._call('start')}>
                  <lw-icon name="play" .size=${12}></lw-icon>Start
                </button>
                <button class="btn" @click=${() => this._call('locate')}>
                  <lw-icon name="sound" .size=${12}></lw-icon>
                </button>
              `}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-extra-vacuum': LwExtraVacuum;
  }
}
