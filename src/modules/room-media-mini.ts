import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import {
  entityState,
  friendlyName,
  callMediaPlay,
  callMediaVolume,
} from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../controls/lw-toggle';
import '../controls/lw-slider';

@customElement('lw-media-mini')
export class LwMediaMini extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) entity?: string;

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
      min-width: 0;
    }
    .row {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .art {
      width: 52px;
      height: 52px;
      border-radius: 10px;
      background: var(--card-inset);
      color: var(--text-muted);
      flex-shrink: 0;
      display: grid;
      place-items: center;
      background-size: cover;
      background-position: center;
    }
    .art.on {
      background: linear-gradient(135deg, var(--warn), var(--amber));
      color: white;
    }
    .info {
      min-width: 0;
      flex: 1;
    }
    .title {
      font-size: 12.5px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artist {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .vol {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }
    .vnum {
      font-family: 'Geist Mono', monospace;
      font-size: 10.5px;
      color: var(--text-muted);
      width: 22px;
    }
    .transport {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 10px;
    }
    .mbtn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      display: grid;
      place-items: center;
    }
    .mbtn.primary {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;

  render() {
    const e = entityState(this.hass, this.entity);
    if (!this.entity || !e) {
      return html`<div class="card">
        <lw-section-head sub="Multimedia" heading="–"></lw-section-head>
        <div class="empty">Kein Media-Player</div>
      </div>`;
    }
    const playing = e.state === 'playing';
    const title = (e.attributes.media_title as string) ?? (e.attributes.app_name as string) ?? '–';
    const artist = (e.attributes.media_artist as string) ?? (e.attributes.source as string) ?? '';
    const vol = Math.round(((e.attributes.volume_level as number) ?? 0) * 100);
    const device = friendlyName(e, this.entity.split('.')[1]);
    const art = e.attributes.entity_picture as string | undefined;

    return html`
      <div class="card">
        <lw-section-head sub="Multimedia" heading=${device}>
          <span slot="right">
            <lw-toggle
              .on=${playing}
              @change=${(ev: CustomEvent) =>
                this.hass && callMediaPlay(this.hass, this.entity!, ev.detail.value)}
            ></lw-toggle>
          </span>
        </lw-section-head>

        <div class="row">
          <div class=${'art ' + (playing ? 'on' : '')}
               style=${art ? `background-image:url(${art})` : ''}>
            ${!art ? html`<lw-icon name="music" .size=${22}></lw-icon>` : ''}
          </div>
          <div class="info">
            <div class="title">${title}</div>
            <div class="artist">${artist}</div>
          </div>
        </div>

        <div class="vol">
          <lw-icon name="volume" .size=${12} style="color:var(--text-muted)"></lw-icon>
          <lw-slider
            .value=${vol}
            @change=${(ev: CustomEvent) =>
              this.hass && callMediaVolume(this.hass, this.entity!, ev.detail.value)}
          ></lw-slider>
          <span class="vnum">${vol}</span>
        </div>

        <div class="transport">
          <button
            class="mbtn"
            @click=${() =>
              this.hass &&
              this.hass.callService(
                'media_player',
                'media_previous_track',
                {},
                { entity_id: this.entity! },
              )}
          >
            <lw-icon name="skip-prev" .size=${14}></lw-icon>
          </button>
          <button
            class="mbtn primary"
            @click=${() => this.hass && callMediaPlay(this.hass, this.entity!, !playing)}
          >
            <lw-icon name=${playing ? 'pause' : 'play'} .size=${14}></lw-icon>
          </button>
          <button
            class="mbtn"
            @click=${() =>
              this.hass &&
              this.hass.callService(
                'media_player',
                'media_next_track',
                {},
                { entity_id: this.entity! },
              )}
          >
            <lw-icon name="skip-next" .size=${14}></lw-icon>
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-media-mini': LwMediaMini;
  }
}
