import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import { entityState, friendlyName, callSceneActivate } from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';

const DEFAULT_SCENE_ICON: Record<string, string> = {
  morning: 'sun',
  aufstehen: 'sun',
  work: 'desk',
  arbeit: 'desk',
  dinner: 'chair',
  abendessen: 'chair',
  movie: 'film',
  film: 'film',
  read: 'book',
  lesen: 'book',
  goodnight: 'moon',
  schlaf: 'moon',
  leaving: 'door',
  verlassen: 'door',
};

@customElement('lw-scenes-row')
export class LwScenesRow extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) scenes: string[] = [];

  @state() private _firing: string | null = null;

  static styles = css`
    :host {
      display: block;
      /* Backstop: the grid row this lives in needs a known height, otherwise
         min-content can collapse it to 0 and the card paints over adjacent
         rows visually. */
      min-height: 130px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      height: 100%;
      box-sizing: border-box;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 8px;
    }
    .scene {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 12px;
      color: var(--text);
      text-align: left;
      transition: background 0.2s, border-color 0.2s;
      cursor: pointer;
    }
    .scene.firing {
      background: var(--accent-soft);
      border-color: var(--accent);
    }
    .scene .ico {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: var(--card);
      color: var(--text);
      display: grid;
      place-items: center;
      border: 1px solid var(--border-soft);
    }
    .scene .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .scene .auto {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      color: var(--text-muted);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;

  private _icon(id: string, name: string): string {
    const key = (name.toLowerCase() + ' ' + id.toLowerCase()).split(/\s+/);
    for (const k of key) {
      if (DEFAULT_SCENE_ICON[k]) return DEFAULT_SCENE_ICON[k];
    }
    return 'sparkle';
  }

  private _run(id: string) {
    if (!this.hass) return;
    this._firing = id;
    callSceneActivate(this.hass, id);
    setTimeout(() => (this._firing = null), 1200);
  }

  render() {
    if (!this.scenes.length) {
      return html`<div class="card">
        <lw-section-head sub="Schnellzugriff" heading="Szenen"></lw-section-head>
        <div class="empty">Keine Szenen konfiguriert</div>
      </div>`;
    }
    return html`
      <div class="card">
        <lw-section-head sub="Schnellzugriff" heading="Szenen"></lw-section-head>
        <div class="grid">
          ${this.scenes.map((id) => {
            const e = entityState(this.hass, id);
            const name = friendlyName(e, id.split('.')[1]);
            return html`
              <button
                class=${'scene ' + (this._firing === id ? 'firing' : '')}
                @click=${() => this._run(id)}
              >
                <div class="ico">
                  <lw-icon name=${this._icon(id, name)} .size=${15}></lw-icon>
                </div>
                <div class="name">${name}</div>
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-scenes-row': LwScenesRow;
  }
}
