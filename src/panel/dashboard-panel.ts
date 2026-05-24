import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, PanelInfo } from '../hass/hass-types';
import type { PanelConfig, ThemeName } from '../types/config';
import { DEFAULT_CONFIG } from '../types/config';
import { themeLinen, themeWalnut } from '../styles/themes';
import { baseStyles } from '../styles/base';
import { injectFontImport } from '../styles/font-import';
import './lw-sidebar';
import './lw-topbar';
import '../pages/overview-page';
import '../pages/room-page';
import '../editor/dashboard-editor';

@customElement('lindenweg-dashboard')
export class LindenwegDashboard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) panel?: PanelInfo<PanelConfig>;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) route?: { path: string };

  @state() private _page = 'overview';
  @state() private _time = new Date();
  @state() private _configOpen = false;

  private _tick?: number;

  static styles = [
    themeLinen,
    themeWalnut,
    baseStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: var(--bg);
        color: var(--text);
      }
      .root {
        display: flex;
        width: 100%;
        height: 100%;
      }
      .main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    injectFontImport();
    this._tick = window.setInterval(() => (this._time = new Date()), 20_000);
    this._readPageFromHash();
    window.addEventListener('hashchange', this._readPageFromHash);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) clearInterval(this._tick);
    window.removeEventListener('hashchange', this._readPageFromHash);
  }

  private _readPageFromHash = (): void => {
    const m = location.hash.match(/#\/([\w-]+)/);
    if (m) this._page = m[1];
  };

  private _config(): PanelConfig {
    const fromPanel = this.panel?.config ?? ({} as Partial<PanelConfig>);
    return {
      ...DEFAULT_CONFIG,
      ...fromPanel,
      overview: { ...DEFAULT_CONFIG.overview, ...(fromPanel.overview ?? {}) },
      rooms: fromPanel.rooms ?? {},
    };
  }

  private _theme(): ThemeName {
    return this._config().theme === 'walnut' ? 'walnut' : 'linen';
  }

  private _navigate = (e: CustomEvent<{ page: string }>) => {
    this._page = e.detail.page;
    location.hash = `#/${e.detail.page}`;
  };

  render() {
    const config = this._config();
    const theme = this._theme();
    const room = config.rooms[this._page];
    return html`
      <div class=${'root theme-' + theme}>
        <lw-sidebar
          .hass=${this.hass}
          .config=${config}
          .page=${this._page}
          @navigate=${this._navigate}
          @open-config=${() => (this._configOpen = true)}
        ></lw-sidebar>
        <div class="main">
          ${this._page === 'overview' || !room
            ? html`<lw-overview-page
                .hass=${this.hass}
                .config=${config}
                .time=${this._time}
              ></lw-overview-page>`
            : html`<lw-room-page
                .hass=${this.hass}
                .config=${config}
                .roomKey=${this._page}
                .time=${this._time}
              ></lw-room-page>`}
        </div>
        ${this._configOpen
          ? html`<lw-config-helper
              .hass=${this.hass}
              .config=${config}
              @close=${() => (this._configOpen = false)}
            ></lw-config-helper>`
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lindenweg-dashboard': LindenwegDashboard;
  }
}
