import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import '../icons/lw-icon';

interface Option {
  id: string;
  name: string;
}

@customElement('lw-entity-picker')
export class LwEntityPicker extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = 'Entity wählen…';
  @property({ type: Array }) domains: string[] = [];
  @property({ type: Boolean }) allowEmpty = true;
  @property({ type: Boolean }) compact = false;

  @state() private _open = false;
  @state() private _filter = '';
  @query('.input') private _input!: HTMLInputElement;

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .wrap {
      position: relative;
    }
    .input {
      width: 100%;
      padding: 8px 32px 8px 12px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    :host([compact]) .input {
      padding: 6px 28px 6px 10px;
      font-size: 12px;
      border-radius: 7px;
    }
    .input:focus {
      outline: none;
      border-color: var(--accent);
    }
    .clear,
    .chevron {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: grid;
      place-items: center;
    }
    .clear {
      right: 22px;
    }
    .chevron {
      right: 4px;
      pointer-events: none;
    }
    .menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: var(--shadow-lg);
      max-height: 280px;
      overflow: auto;
      z-index: 50;
    }
    .menu::-webkit-scrollbar {
      width: 0;
    }
    .opt {
      padding: 8px 12px;
      font-size: 12.5px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .opt:hover {
      background: var(--card-inset);
    }
    .opt.selected {
      background: color-mix(in oklab, var(--accent) 14%, transparent);
    }
    .opt .id {
      font-size: 10.5px;
      color: var(--text-muted);
      font-family: 'Geist Mono', monospace;
    }
    .empty {
      padding: 16px;
      color: var(--text-muted);
      font-size: 12px;
      text-align: center;
    }
  `;

  private _options(): Option[] {
    if (!this.hass) return [];
    const filter = this._filter.toLowerCase();
    return Object.values(this.hass.states)
      .filter((s) => {
        if (this.domains.length && !this.domains.some((d) => s.entity_id.startsWith(d + '.'))) {
          return false;
        }
        if (!filter) return true;
        const name = ((s.attributes.friendly_name as string) ?? '').toLowerCase();
        return s.entity_id.toLowerCase().includes(filter) || name.includes(filter);
      })
      .map((s) => ({
        id: s.entity_id,
        name: (s.attributes.friendly_name as string) ?? s.entity_id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 200);
  }

  private _selectedLabel(): string {
    if (!this.value) return '';
    const e = this.hass?.states[this.value];
    return e ? `${(e.attributes.friendly_name as string) ?? this.value}` : this.value;
  }

  private _emit(value: string) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }),
    );
  }

  private _pick(id: string) {
    this._emit(id);
    this._open = false;
    this._filter = '';
  }

  private _clear(e: Event) {
    e.stopPropagation();
    this._emit('');
  }

  private _onClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node)) {
      this._open = false;
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this._onClick);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onClick);
  }

  render() {
    const opts = this._open ? this._options() : [];
    const label = this._selectedLabel() || this._filter;
    return html`
      <div class="wrap">
        <input
          class="input"
          .value=${this._open ? this._filter : this._selectedLabel()}
          placeholder=${this.placeholder}
          @click=${() => (this._open = true)}
          @focus=${() => (this._open = true)}
          @input=${(e: Event) => {
            this._filter = (e.target as HTMLInputElement).value;
            this._open = true;
          }}
        />
        ${this.value && this.allowEmpty
          ? html`<button class="clear" @click=${this._clear}>
              <lw-icon name="x" .size=${12} .stroke=${2}></lw-icon>
            </button>`
          : ''}
        <span class="chevron"><lw-icon name="arrow-down" .size=${12}></lw-icon></span>
        ${this._open
          ? html`<div class="menu">
              ${opts.length === 0
                ? html`<div class="empty">Keine Treffer</div>`
                : opts.map(
                    (o) => html`
                      <div
                        class=${'opt' + (o.id === this.value ? ' selected' : '')}
                        @click=${() => this._pick(o.id)}
                      >
                        <div>${o.name}</div>
                        <div class="id">${o.id}</div>
                      </div>
                    `,
                  )}
            </div>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-entity-picker': LwEntityPicker;
  }
}
