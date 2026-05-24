import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig } from '../types/config';
import {
  entityState,
  friendlyName,
  callMediaPlay,
  callMediaVolume,
} from '../hass/entity-helpers';
import '../icons/lw-icon';
import '../shared/lw-section-head';
import '../controls/lw-slider';

@customElement('lw-media-card')
export class LwMediaCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: PanelConfig;

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
      gap: 12px;
      height: 100%;
      min-width: 0;
    }
    .row {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .art {
      width: 84px;
      height: 84px;
      border-radius: 12px;
      background: linear-gradient(
        135deg,
        var(--warn) 0%,
        var(--amber) 50%,
        var(--accent) 100%
      );
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
      background-size: cover;
      background-position: center;
    }
    .art .gloss {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.25),
        transparent 50%
      );
    }
    .art .music {
      position: absolute;
      bottom: 8px;
      right: 8px;
      color: rgba(0, 0, 0, 0.35);
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .title {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artist {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .src {
      font-size: 10.5px;
      color: var(--text-faint);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }
    .transport {
      display: flex;
      align-items: center;
      gap: 14px;
      justify-content: center;
    }
    .mbtn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      display: grid;
      place-items: center;
    }
    .mbtn.primary {
      width: 44px;
      height: 44px;
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    .vol {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .speakers {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      padding-top: 8px;
      border-top: 1px solid var(--border-soft);
    }
    .sp {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 9px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 500;
    }
    .sp.on {
      border-color: var(--accent);
      background: color-mix(in oklab, var(--accent) 14%, transparent);
      color: var(--accent);
    }
    .sp .d {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--text-faint);
    }
    .sp.on .d {
      background: var(--accent);
    }
    .vol-num {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      width: 24px;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 40px 0;
      text-align: center;
    }
  `;

  private _allRoomPlayers(): { roomKey: string; entityId: string; name: string }[] {
    const rooms = this.config.rooms ?? {};
    const result: { roomKey: string; entityId: string; name: string }[] = [];
    Object.entries(rooms).forEach(([k, r]) => {
      if (r.media_player) result.push({ roomKey: k, entityId: r.media_player, name: r.name });
    });
    return result;
  }

  render() {
    const players = this._allRoomPlayers();
    if (!players.length) {
      return html`<div class="card">
        <lw-section-head sub="Wird abgespielt" heading="Multiroom Audio"></lw-section-head>
        <div class="empty">Kein Media-Player konfiguriert</div>
      </div>`;
    }

    const playing = players.find((p) => entityState(this.hass, p.entityId)?.state === 'playing') ?? players[0];
    const e = entityState(this.hass, playing.entityId);
    const playingState = e?.state === 'playing';
    const title = (e?.attributes?.media_title as string) ?? '–';
    const artist = (e?.attributes?.media_artist as string) ?? e?.attributes?.app_name ?? '';
    const source = (e?.attributes?.source as string) ?? '';
    const device = friendlyName(e, playing.entityId.split('.')[1]);
    const vol = Math.round(((e?.attributes?.volume_level as number) ?? 0) * 100);
    const art = (e?.attributes?.entity_picture as string) ?? '';

    return html`
      <div class="card">
        <lw-section-head sub="Wird abgespielt" heading="Multiroom Audio"></lw-section-head>

        <div class="row">
          <div
            class="art"
            style=${art ? `background-image:url(${art})` : ''}
          >
            ${!art ? html`<div class="gloss"></div><lw-icon class="music" name="music" .size=${28}></lw-icon>` : ''}
          </div>
          <div class="info">
            <div class="title">${title}</div>
            <div class="artist">${artist}</div>
            <div class="src">${[source, device].filter(Boolean).join(' · ')}</div>
          </div>
        </div>

        <div class="transport">
          <button class="mbtn" @click=${() =>
            this.hass && this.hass.callService('media_player', 'media_previous_track', {}, { entity_id: playing.entityId })}>
            <lw-icon name="skip-prev" .size=${18}></lw-icon>
          </button>
          <button
            class="mbtn primary"
            @click=${() => this.hass && callMediaPlay(this.hass, playing.entityId, !playingState)}
          >
            <lw-icon name=${playingState ? 'pause' : 'play'} .size=${20}></lw-icon>
          </button>
          <button class="mbtn" @click=${() =>
            this.hass && this.hass.callService('media_player', 'media_next_track', {}, { entity_id: playing.entityId })}>
            <lw-icon name="skip-next" .size=${18}></lw-icon>
          </button>
        </div>

        <div class="vol">
          <lw-icon name="volume" .size=${14} style="color:var(--text-muted)"></lw-icon>
          <lw-slider
            .value=${vol}
            @change=${(ev: CustomEvent) => this.hass && callMediaVolume(this.hass, playing.entityId, ev.detail.value)}
          ></lw-slider>
          <span class="vol-num">${vol}</span>
        </div>

        ${players.length > 1
          ? html`
              <div class="speakers">
                ${players.map((p) => {
                  const ps = entityState(this.hass, p.entityId);
                  const on = ps?.state === 'playing';
                  return html`
                    <button
                      class=${'sp ' + (on ? 'on' : '')}
                      @click=${() => this.hass && callMediaPlay(this.hass, p.entityId, !on)}
                    >
                      <span class="d"></span>${p.name.split(' ')[0]}
                    </button>
                  `;
                })}
              </div>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-media-card': LwMediaCard;
  }
}
