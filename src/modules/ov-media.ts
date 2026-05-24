import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import type { PanelConfig, RadioStation } from '../types/config';
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

  @state() private _selected: string | null = null;
  @state() private _syncOpen = false;

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
    .now {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .art {
      width: 56px;
      height: 56px;
      border-radius: 11px;
      flex-shrink: 0;
      background: var(--card-inset) center/cover no-repeat;
      color: var(--text-muted);
      position: relative;
      overflow: hidden;
      display: grid;
      place-items: center;
    }
    .art.playing {
      background-image: linear-gradient(135deg, var(--warn), var(--amber));
      color: white;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .title {
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artist {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .play {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--text);
      color: var(--bg);
      border: 1px solid var(--text);
      display: grid;
      place-items: center;
      flex-shrink: 0;
      cursor: pointer;
    }
    .play:hover {
      transform: scale(1.04);
    }
    .vol {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .vol .num {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      width: 26px;
      text-align: right;
    }
    .speakers {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .picker {
      flex: 1;
      padding: 7px 10px;
      border-radius: 9px;
      background: var(--card-inset);
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 12px;
    }
    .sync-btn {
      padding: 7px 12px;
      border-radius: 9px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .sync-btn:hover {
      background: var(--card-inset);
    }
    .sync-btn.active {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    .sync-panel {
      background: var(--card-inset);
      border-radius: 11px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 160px;
      overflow: auto;
    }
    .sync-panel::-webkit-scrollbar {
      width: 0;
    }
    .sync-row {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 6px 8px;
      border-radius: 7px;
      cursor: pointer;
      transition: background 0.1s;
    }
    .sync-row:hover {
      background: var(--card);
    }
    .check {
      width: 16px;
      height: 16px;
      border-radius: 5px;
      border: 1.5px solid var(--border);
      display: grid;
      place-items: center;
      color: white;
      flex-shrink: 0;
    }
    .check.on {
      background: var(--accent);
      border-color: var(--accent);
    }
    .row-name {
      flex: 1;
      font-size: 12px;
    }
    .row-state {
      font-size: 10px;
      color: var(--text-faint);
      font-family: 'Geist Mono', monospace;
    }
    .radios-head {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .radio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 8px;
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding-bottom: 2px;
    }
    .radio-grid::-webkit-scrollbar {
      width: 0;
    }
    .radio {
      aspect-ratio: 1;
      border-radius: 12px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.12s;
      background-size: cover;
      background-position: center;
      color: var(--text);
    }
    .radio:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }
    .radio .logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .radio .nm {
      font-size: 11.5px;
      font-weight: 500;
      line-height: 1.2;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .radio.playing {
      background: color-mix(in oklab, var(--accent) 22%, var(--card-inset));
      border-color: var(--accent);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;

  private _allPlayers(): { id: string; name: string }[] {
    const out: { id: string; name: string }[] = [];
    const seen = new Set<string>();
    const rooms = this.config?.rooms ?? {};
    Object.values(rooms).forEach((r) => {
      if (r.media_player && !seen.has(r.media_player)) {
        seen.add(r.media_player);
        out.push({ id: r.media_player, name: r.name });
      }
    });
    return out;
  }

  private _activePlayer(): string {
    const players = this._allPlayers();
    if (this._selected && players.find((p) => p.id === this._selected)) return this._selected;
    // Auto-select first playing or first available
    const playing = players.find((p) => entityState(this.hass, p.id)?.state === 'playing');
    return (playing?.id ?? players[0]?.id) ?? '';
  }

  private _joinedMembers(id: string): string[] {
    const e = entityState(this.hass, id);
    return (e?.attributes?.group_members as string[]) ?? [];
  }

  private _isJoined(master: string, member: string): boolean {
    if (master === member) return true;
    return this._joinedMembers(master).includes(member);
  }

  private _toggleJoin(master: string, member: string) {
    if (!this.hass || master === member) return;
    const joined = this._isJoined(master, member);
    if (joined) {
      void this.hass.callService('media_player', 'unjoin', {}, { entity_id: member });
    } else {
      void this.hass.callService(
        'media_player',
        'join',
        { group_members: [member] },
        { entity_id: master },
      );
    }
  }

  private _playRadio(player: string, r: RadioStation) {
    if (!this.hass) return;
    void this.hass.callService(
      'media_player',
      'play_media',
      {
        media_content_id: r.url,
        media_content_type: r.content_type ?? 'music',
      },
      { entity_id: player },
    );
  }

  private _isPlayingRadio(player: string, r: RadioStation): boolean {
    const e = entityState(this.hass, player);
    if (!e || e.state !== 'playing') return false;
    const src = (e.attributes.media_content_id as string) ?? '';
    return src === r.url;
  }

  render() {
    const players = this._allPlayers();
    if (!players.length) {
      return html`<div class="card">
        <lw-section-head sub="Audio" heading="Multiroom"></lw-section-head>
        <div class="empty">Kein Media-Player konfiguriert</div>
      </div>`;
    }
    const playerId = this._activePlayer();
    const e = entityState(this.hass, playerId);
    const playing = e?.state === 'playing';
    const title = (e?.attributes?.media_title as string) ?? '–';
    const artist =
      (e?.attributes?.media_artist as string) ?? (e?.attributes?.app_name as string) ?? (e?.attributes?.source as string) ?? '';
    const vol = Math.round(((e?.attributes?.volume_level as number) ?? 0) * 100);
    const art = (e?.attributes?.entity_picture as string) ?? '';
    const radios = this.config.overview?.radios ?? [];
    const joinedCount = this._joinedMembers(playerId).length;

    return html`
      <div class="card">
        <lw-section-head sub="Multiroom" heading="Audio">
          <select
            slot="right"
            class="picker"
            style="max-width:140px"
            .value=${playerId}
            @change=${(ev: Event) => (this._selected = (ev.target as HTMLSelectElement).value)}
          >
            ${players.map(
              (p) => html`<option value=${p.id} ?selected=${p.id === playerId}>${p.name}</option>`,
            )}
          </select>
        </lw-section-head>

        <div class="now">
          <div class=${'art ' + (playing ? 'playing' : '')} style=${art ? `background-image:url(${art})` : ''}>
            ${!art ? html`<lw-icon name="music" .size=${22}></lw-icon>` : nothing}
          </div>
          <div class="info">
            <div class="title">${title}</div>
            <div class="artist">${artist}</div>
          </div>
          <button class="play" @click=${() => this.hass && callMediaPlay(this.hass, playerId, !playing)}>
            <lw-icon name=${playing ? 'pause' : 'play'} .size=${20}></lw-icon>
          </button>
        </div>

        <div class="vol">
          <lw-icon name="volume" .size=${13} style="color:var(--text-muted)"></lw-icon>
          <lw-slider
            .value=${vol}
            @change=${(ev: CustomEvent) => this.hass && callMediaVolume(this.hass, playerId, ev.detail.value)}
          ></lw-slider>
          <span class="num">${vol}</span>
        </div>

        ${players.length > 1
          ? html`
              <div class="speakers">
                <button
                  class=${'sync-btn' + (this._syncOpen ? ' active' : '')}
                  @click=${() => (this._syncOpen = !this._syncOpen)}
                >
                  <lw-icon name="sound" .size=${13}></lw-icon>
                  Sync ${joinedCount > 0 ? `· ${joinedCount + 1}` : ''}
                </button>
              </div>
              ${this._syncOpen
                ? html`
                    <div class="sync-panel">
                      ${players.map((p) => {
                        const joined = this._isJoined(playerId, p.id);
                        const isMaster = p.id === playerId;
                        const st = entityState(this.hass, p.id)?.state ?? 'unknown';
                        return html`
                          <div
                            class="sync-row"
                            @click=${() => !isMaster && this._toggleJoin(playerId, p.id)}
                          >
                            <div class=${'check' + (joined ? ' on' : '')}>
                              ${joined ? html`<lw-icon name="check" .size=${11} .stroke=${2.5}></lw-icon>` : nothing}
                            </div>
                            <div class="row-name">${p.name}${isMaster ? ' (Master)' : ''}</div>
                            <div class="row-state">${st}</div>
                          </div>
                        `;
                      })}
                    </div>
                  `
                : nothing}
            `
          : nothing}

        ${radios.length > 0
          ? html`
              <div class="radios-head">Radio-Sender</div>
              <div class="radio-grid">
                ${radios.map((r) => {
                  const active = this._isPlayingRadio(playerId, r);
                  return html`
                    <div
                      class=${'radio' + (active ? ' playing' : '')}
                      style=${r.logo ? `background-image:url(${r.logo})` : ''}
                      title=${r.name}
                      @click=${() => this._playRadio(playerId, r)}
                    >
                      ${!r.logo
                        ? html`<div class="logo"><lw-icon name="music" .size=${18}></lw-icon></div>`
                        : nothing}
                      ${!r.logo ? html`<div class="nm">${r.name}</div>` : nothing}
                    </div>
                  `;
                })}
              </div>
            `
          : html`<div class="empty">Keine Radio-Sender konfiguriert</div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-media-card': LwMediaCard;
  }
}
