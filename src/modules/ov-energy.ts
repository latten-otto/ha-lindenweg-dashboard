import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { OverviewEnergyConfig } from '../types/config';
import { entityState, stateNum } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../shared/lw-pill';
import '../controls/lw-bars';

@customElement('lw-energy-card')
export class LwEnergyCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) energy: OverviewEnergyConfig = {};

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card-elev);
      /* Tight shadow — keeps elevation cue without bleeding into the
         gap below the card, which previously read as "scenes overlap". */
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .self-row {
      display: flex;
      align-items: baseline;
      gap: 14px;
      margin-bottom: 12px;
    }
    .self-val {
      font-size: 44px;
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .self-lbl {
      font-size: 12px;
      color: var(--text-muted);
    }
    .flow {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      flex: 1;
      min-height: 0;
    }
    .stat {
      background: var(--card-inset);
      border-radius: 14px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .stat .label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
    }
    .stat .value {
      font-family: 'Geist Mono', monospace;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.02em;
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .stat .unit {
      font-size: 12px;
      color: var(--text-muted);
    }
    .stat .sub {
      font-size: 10.5px;
      color: var(--text-faint);
    }
    .stat.pv .label {
      color: var(--amber);
    }
    .stat.use .label {
      color: var(--blue);
    }
    .stat.bat .label {
      color: var(--accent);
    }
    .stat.grid .label {
      color: var(--text);
    }
    .chart-wrap {
      margin-top: 12px;
    }
    .chart-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10px;
      color: var(--text-muted);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
    }
    .legend {
      display: flex;
      gap: 12px;
    }
    .legend span span.sw {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      margin-right: 4px;
    }
    .axis {
      display: flex;
      justify-content: space-between;
      font-family: 'Geist Mono', monospace;
      font-size: 9px;
      color: var(--text-faint);
      margin-top: 4px;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      text-align: center;
      padding: 40px 0;
    }
  `;

  private _v(id?: string): number {
    return stateNum(entityState(this.hass, id));
  }

  private _scale(id: string | undefined, toKw: boolean): number {
    const e = entityState(this.hass, id);
    if (!e) return 0;
    const v = stateNum(e);
    const unit = (e.attributes.unit_of_measurement ?? '').toString().toLowerCase();
    if (toKw && unit === 'w') return v / 1000;
    if (!toKw && unit === 'kw') return v * 1000;
    return v;
  }

  private _fmtKw(kw: number): { v: string; u: string } {
    if (kw >= 1 || kw <= -1) return { v: kw.toFixed(2), u: 'kW' };
    return { v: (kw * 1000).toFixed(0), u: 'W' };
  }

  render() {
    const pvNow = this._scale(this.energy.pv_now, true);
    const cons = this._scale(this.energy.consumption, true);
    const feed = this._scale(this.energy.grid_feed, true);
    const draw = this._scale(this.energy.grid_draw, true);
    const batLevel = this._v(this.energy.battery_level);
    const batFlow = this._scale(this.energy.battery_flow, true);
    const pvToday = this._v(this.energy.pv_today);
    const selfPct =
      pvNow > 0 ? Math.min(100, Math.round((Math.min(cons, pvNow) / Math.max(cons, 0.01)) * 100)) : 0;

    const anyConfigured =
      !!(this.energy.pv_now ||
        this.energy.consumption ||
        this.energy.grid_feed ||
        this.energy.battery_level);

    if (!anyConfigured) {
      return html`<div class="card">
        <lw-section-head sub="Live" heading="Energie · Heute"></lw-section-head>
        <div class="empty">Keine Energie-Entities konfiguriert</div>
      </div>`;
    }

    const pv = this._fmtKw(pvNow);
    const use = this._fmtKw(cons);
    const grid = feed > 0 ? this._fmtKw(feed) : this._fmtKw(draw);
    const gridLabel = feed > 0 ? 'Einspeisung' : 'Bezug';
    const battery = this._fmtKw(Math.abs(batFlow));

    return html`
      <div class="card">
        <lw-section-head sub="Live" heading="Energie · Heute">
          <span slot="right">
            <lw-pill color="var(--accent)" .soft=${true}
              >● ${pvToday.toFixed(1)} kWh heute</lw-pill
            >
          </span>
        </lw-section-head>

        <div class="self-row">
          <div class="self-val">${selfPct}%</div>
          <div class="self-lbl">Eigenversorgung</div>
        </div>

        <div class="flow">
          <div class="stat pv">
            <div class="label"><lw-icon name="sun" .size=${12}></lw-icon>Solar</div>
            <div class="value">${pv.v}<span class="unit">${pv.u}</span></div>
            <div class="sub">heute ${pvToday.toFixed(1)} kWh</div>
          </div>
          <div class="stat use">
            <div class="label"><lw-icon name="bolt" .size=${12}></lw-icon>Hausnetz</div>
            <div class="value">${use.v}<span class="unit">${use.u}</span></div>
            <div class="sub">Verbrauch jetzt</div>
          </div>
          <div class="stat grid">
            <div class="label">
              <lw-icon name=${feed > 0 ? 'arrow-up' : 'arrow-down'} .size=${12}></lw-icon>${gridLabel}
            </div>
            <div class="value">${grid.v}<span class="unit">${grid.u}</span></div>
            <div class="sub">Netz</div>
          </div>
          <div class="stat bat">
            <div class="label"><lw-icon name="bolt" .size=${12}></lw-icon>Akku</div>
            <div class="value">${batLevel.toFixed(0)}<span class="unit">%</span></div>
            <div class="sub">
              ${batFlow < 0 ? 'Lädt' : batFlow > 0 ? 'Entlädt' : 'Idle'} ${battery.v} ${battery.u}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-energy-card': LwEnergyCard;
  }
}
