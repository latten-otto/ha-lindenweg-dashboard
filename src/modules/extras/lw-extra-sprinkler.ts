import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../../hass/hass-types';
import { entityState, friendlyName, isOn, callToggle, attrNum } from '../../hass/entity-helpers';
import '../../icons/lw-icon';

@customElement('lw-extra-sprinkler')
export class LwExtraSprinkler extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  /** Sprinkler zone entity — switch or smart_irrigation.*  */
  @property({ type: String }) entity!: string;
  @property({ type: String }) name = '';
  /** Optional: bucket / duration sensor for sub-text. */
  @property({ type: String }) state_entity?: string;

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
    .tile.on {
      background: color-mix(in oklab, var(--blue) 18%, var(--card-inset));
      border-color: color-mix(in oklab, var(--blue) 50%, var(--border-soft));
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
    .ico.on {
      background: var(--blue);
      color: white;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .pill {
      padding: 3px 8px;
      border-radius: 999px;
      background: var(--card);
      font-size: 10px;
      font-family: 'Geist Mono', monospace;
      color: var(--text-muted);
    }
    .pill.on {
      background: var(--blue);
      color: white;
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
    }
    .btn.primary {
      background: var(--blue);
      color: white;
      border-color: var(--blue);
    }
  `;

  private _subText(): string {
    const stE = entityState(this.hass, this.state_entity);
    if (!stE) return '';
    const unit = (stE.attributes.unit_of_measurement as string) ?? '';
    return `${stE.state}${unit ? ' ' + unit : ''}`;
  }

  private _start() {
    if (!this.hass) return;
    // For smart_irrigation, prefer .turn_on; for switch, callToggle
    callToggle(this.hass, this.entity);
  }

  render() {
    const e = entityState(this.hass, this.entity);
    const on = e ? isOn(e.state) : false;
    const displayName = this.name || friendlyName(e, this.entity.split('.')[1]);
    const sub = this._subText();

    return html`
      <div class=${'tile' + (on ? ' on' : '')}>
        <div class="head">
          <div class=${'ico' + (on ? ' on' : '')}>
            <lw-icon name="water" .size=${16}></lw-icon>
          </div>
          <span class=${'pill' + (on ? ' on' : '')}>${on ? 'LÄUFT' : 'AUS'}</span>
        </div>
        <div>
          <div class="name">${displayName}</div>
          ${sub ? html`<div class="sub">${sub}</div>` : ''}
        </div>
        <div class="actions">
          <button
            class=${'btn' + (on ? '' : ' primary')}
            @click=${this._start}
          >
            ${on ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-extra-sprinkler': LwExtraSprinkler;
  }
}
