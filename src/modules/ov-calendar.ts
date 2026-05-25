import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import '../icons/lw-icon';
import '../shared/lw-section-head';

interface CalendarEvent {
  start: string;
  end: string;
  summary: string;
}

@customElement('lw-calendar-card')
export class LwCalendarCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) entity?: string;

  @state() private _events: CalendarEvent[] = [];
  @state() private _loaded = false;
  private _fetchTimer?: number;
  private _lastFetch = 0;

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
      overflow: hidden;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      overflow: hidden;
    }
    .ev {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 8px 4px;
      border-bottom: 1px solid var(--border-soft);
    }
    .ev:last-child {
      border-bottom: none;
    }
    .time {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      font-weight: 500;
      color: var(--text);
      min-width: 38px;
    }
    .stripe {
      width: 3px;
      align-self: stretch;
      border-radius: 2px;
      background: var(--accent);
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .summary {
      font-size: 12.5px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dur {
      font-size: 10.5px;
      color: var(--text-faint);
      margin-top: 1px;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
    .date-pill {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
  `;

  updated() {
    if (!this.entity || !this.hass) return;
    if (Date.now() - this._lastFetch < 10 * 60 * 1000) return;
    this._lastFetch = Date.now();
    this._fetchEvents();
  }

  private async _fetchEvents() {
    if (!this.hass || !this.entity) return;
    const start = new Date();
    const end = new Date(start);
    end.setHours(23, 59, 59);
    try {
      const evs = await this.hass.callApi<CalendarEvent[]>(
        'GET',
        `calendars/${this.entity}?start=${encodeURIComponent(
          start.toISOString(),
        )}&end=${encodeURIComponent(end.toISOString())}`,
      );
      this._events = Array.isArray(evs) ? evs : [];
      this._loaded = true;
    } catch {
      this._loaded = true;
    }
  }

  private _fmtTime(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '–';
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  private _fmtDur(start: string, end: string): string {
    const s = new Date(start);
    const e = new Date(end);
    const min = Math.round((e.getTime() - s.getTime()) / 60000);
    if (min < 60) return `${min} min`;
    if (min % 60 === 0) return `${min / 60} h`;
    return `${Math.floor(min / 60)} h ${min % 60} min`;
  }

  render() {
    if (!this.entity) {
      return html`<div class="card">
        <lw-section-head sub="Heute" heading="Kalender"></lw-section-head>
        <div class="empty">Kein Kalender konfiguriert</div>
      </div>`;
    }
    const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
    return html`
      <div class="card">
        <lw-section-head
          sub=${`Heute · ${this._events.length} Termine`}
          heading="Kalender"
        >
          <span slot="right" class="date-pill">${today}</span>
        </lw-section-head>
        ${this._events.length === 0 && this._loaded
          ? html`<div class="empty">Keine Termine heute</div>`
          : html`<div class="list">
              ${this._events.map(
                (e) => html`
                  <div class="ev">
                    <div class="time">${this._fmtTime(e.start)}</div>
                    <div class="stripe"></div>
                    <div class="body">
                      <div class="summary">${e.summary}</div>
                      <div class="dur">${this._fmtDur(e.start, e.end)}</div>
                    </div>
                  </div>
                `,
              )}
            </div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-calendar-card': LwCalendarCard;
  }
}
