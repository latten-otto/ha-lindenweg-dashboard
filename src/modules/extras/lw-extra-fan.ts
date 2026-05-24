import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../../hass/hass-types';
import { entityState, friendlyName, isOn, callToggle, attrNum } from '../../hass/entity-helpers';
import '../../icons/lw-icon';
import '../../controls/lw-toggle';

/**
 * Generic on/off device with humidity / extra sensor sub-text.
 * Used for air-purifier, dehumidifier, fan, fireplace etc.
 */
@customElement('lw-extra-fan')
export class LwExtraFan extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) entity!: string;
  @property({ type: String }) name = '';
  @property({ type: String }) state_entity?: string;
  @property({ type: String }) icon = 'fan';
  @property({ type: String }) tint = 'var(--accent)';

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
      background: color-mix(in oklab, var(--tint) 14%, var(--card-inset));
      border-color: color-mix(in oklab, var(--tint) 45%, var(--border-soft));
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
      background: var(--tint);
      color: white;
    }
    .body {
      margin-top: auto;
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
  `;

  private _sub(): string {
    const stE = entityState(this.hass, this.state_entity);
    if (!stE) return '';
    const v = parseFloat(stE.state);
    const unit = (stE.attributes.unit_of_measurement as string) ?? '';
    if (Number.isFinite(v) && unit) return `${Math.round(v)} ${unit}`;
    return `${stE.state}${unit ? ' ' + unit : ''}`;
  }

  render() {
    this.style.setProperty('--tint', this.tint);
    const e = entityState(this.hass, this.entity);
    const on = e ? isOn(e.state) : false;
    const displayName = this.name || friendlyName(e, this.entity.split('.')[1]);
    const sub = this._sub();
    return html`
      <div class=${'tile' + (on ? ' on' : '')}>
        <div class="head">
          <div class=${'ico' + (on ? ' on' : '')}>
            <lw-icon name=${this.icon} .size=${16}></lw-icon>
          </div>
          <lw-toggle
            .on=${on}
            size="sm"
            @change=${() => this.hass && callToggle(this.hass, this.entity)}
          ></lw-toggle>
        </div>
        <div class="body">
          <div class="name">${displayName}</div>
          <div class="sub">${sub || (on ? 'An' : 'Aus')}</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-extra-fan': LwExtraFan;
  }
}
