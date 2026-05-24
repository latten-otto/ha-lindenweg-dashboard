import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, PanelInfo } from '../hass/hass-types';
import type { PanelConfig, ThemeName } from '../types/config';
import { DEFAULT_CONFIG } from '../types/config';
import { configStore } from '../hass/config-store';
import { themeLinen, themeWalnut } from '../styles/themes';
import { baseStyles } from '../styles/base';
import { injectFontImport } from '../styles/font-import';
import './lw-sidebar';
import './lw-topbar';
import '../pages/overview-page';
import '../pages/room-page';
import '../pages/edit-page';

@customElement('lindenweg-dashboard')
export class LindenwegDashboard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) panel?: PanelInfo<PanelConfig>;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) route?: { path: string };

  @state() private _page = 'overview';
  @state() private _time = new Date();
  @state() private _config: PanelConfig = DEFAULT_CONFIG;
  @state() private _editMode = false;

  private _tick?: number;
  private _unsubConfig?: () => void;

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
    this._unsubConfig = configStore.subscribe((cfg) => {
      this._config = cfg;
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) clearInterval(this._tick);
    window.removeEventListener('hashchange', this._readPageFromHash);
    this._unsubConfig?.();
    configStore.detach();
  }

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('hass') && this.hass) {
      configStore.attach(this.hass);
    }
  }

  private _readPageFromHash = (): void => {
    const m = location.hash.match(/#\/([\w-]+)/);
    if (m) {
      if (m[1] === 'edit') this._editMode = true;
      else this._page = m[1];
    }
  };

  private _theme(): ThemeName {
    return this._config.theme === 'walnut' ? 'walnut' : 'linen';
  }

  private _navigate = (e: CustomEvent<{ page: string }>) => {
    this._editMode = false;
    this._page = e.detail.page;
    location.hash = `#/${e.detail.page}`;
  };

  private _openEdit = () => {
    this._editMode = true;
  };

  private _closeEdit = () => {
    this._editMode = false;
  };

  render() {
    const config = this._config;
    const theme = this._theme();
    const room = config.rooms[this._page];
    return html`
      <div class=${'root theme-' + theme}>
        <lw-sidebar
          .hass=${this.hass}
          .config=${config}
          .page=${this._editMode ? '__edit__' : this._page}
          @navigate=${this._navigate}
          @open-config=${this._openEdit}
        ></lw-sidebar>
        <div class="main">
          ${this._editMode
            ? html`<lw-edit-page
                .hass=${this.hass}
                .config=${config}
                @close=${this._closeEdit}
              ></lw-edit-page>`
            : this._page === 'overview' || !room
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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lindenweg-dashboard': LindenwegDashboard;
  }
}
