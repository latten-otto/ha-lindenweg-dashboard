import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import { entityState, attrNum, callClimateSetTemp } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../shared/lw-pill';
import '../controls/lw-gauge';
import '../controls/lw-stepper';

@customElement('lw-climate-card')
export class LwClimateCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) entity?: string;
  @property({ type: String }) humidityEntity?: string;

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
    }
    .grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 14px;
      align-items: center;
      flex: 1;
    }
    .dial {
      display: grid;
      place-items: center;
    }
    .center {
      text-align: center;
    }
    .center .v {
      font-family: 'Geist Mono', monospace;
      font-size: 38px;
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .center .l {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .right {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .target {
      background: var(--card-inset);
      border-radius: 12px;
      padding: 12px;
    }
    .target .lbl {
      font-size: 10.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .metrics {
      display: flex;
      gap: 8px;
    }
    .metric {
      flex: 1;
      background: var(--card-inset);
      border-radius: 10px;
      padding: 8px 10px;
    }
    .metric .l {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-muted);
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }
    .metric .v {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      margin-top: 2px;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 40px 0;
      text-align: center;
    }
  `;

  private _onTarget(e: CustomEvent) {
    if (!this.hass || !this.entity) return;
    callClimateSetTemp(this.hass, this.entity, e.detail.value);
  }

  render() {
    const e = entityState(this.hass, this.entity);
    if (!e) {
      return html`<div class="card">
        <lw-section-head sub="Klima" heading="Heizung"></lw-section-head>
        <div class="empty">Kein Climate-Entity konfiguriert</div>
      </div>`;
    }
    const current = attrNum(e, 'current_temperature', NaN);
    const target = attrNum(e, 'temperature', NaN);
    const humidity = this.humidityEntity
      ? attrNum(entityState(this.hass, this.humidityEntity), 'state', 0) ||
        Number(entityState(this.hass, this.humidityEntity)?.state) ||
        0
      : attrNum(e, 'current_humidity', 0);
    const diff = current - target;
    const status = !Number.isFinite(target)
      ? 'monitor'
      : diff < -0.3
        ? 'heizt'
        : diff > 0.3
          ? 'kühlt'
          : 'erreicht';
    const statusLabel = {
      heizt: 'heizt aktiv',
      kühlt: 'kühlt',
      erreicht: 'Ziel erreicht',
      monitor: 'Monitor',
    }[status]!;

    return html`
      <div class="card">
        <lw-section-head sub="Klima" heading="Heizung & Klima">
          <span slot="right">
            <lw-pill
              color=${status === 'erreicht' ? 'var(--accent)' : 'var(--amber)'}
              .soft=${true}
              >● ${statusLabel}</lw-pill
            >
          </span>
        </lw-section-head>

        <div class="grid">
          <div class="dial">
            <lw-gauge
              .value=${((current - 10) / 20) * 100}
              .size=${160}
              .stroke=${10}
              color="var(--amber)"
            >
              <div class="center">
                <div class="v">${Number.isFinite(current) ? current.toFixed(1) : '–'}°</div>
                <div class="l">Ist-Temperatur</div>
              </div>
            </lw-gauge>
          </div>
          <div class="right">
            ${Number.isFinite(target)
              ? html`
                  <div class="target">
                    <div class="lbl">Zieltemperatur</div>
                    <lw-stepper
                      .value=${target}
                      .step=${0.5}
                      .min=${5}
                      .max=${30}
                      .big=${true}
                      @change=${this._onTarget}
                    ></lw-stepper>
                  </div>
                `
              : ''}
            <div class="metrics">
              <div class="metric">
                <div class="l"><lw-icon name="droplet" .size=${11}></lw-icon>Feuchte</div>
                <div class="v">${humidity ? Math.round(humidity) + '%' : '–'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-climate-card': LwClimateCard;
  }
}
