import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from '../hass/hass-types';
import { friendlyName } from '../hass/entity-helpers';
import './lw-entity-picker';
import '../icons/lw-icon';

@customElement('lw-entity-multi')
export class LwEntityMulti extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Array }) value: string[] = [];
  @property({ type: Array }) domains: string[] = [];
  @property({ type: String }) placeholder = 'Entity hinzufügen…';

  static styles = css`
    :host {
      display: block;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px 5px 10px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 12px;
      max-width: 100%;
    }
    .chip .nm {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
    }
    .chip button {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: transparent;
      border: none;
      color: var(--text-muted);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }
    .chip button:hover {
      color: var(--warn);
      background: color-mix(in oklab, var(--warn) 12%, transparent);
    }
    .empty {
      font-size: 11.5px;
      color: var(--text-faint);
      margin-bottom: 8px;
    }
  `;

  private _add(e: CustomEvent) {
    const id = e.detail.value as string;
    if (!id || this.value.includes(id)) return;
    this._emit([...this.value, id]);
    // Reset the picker after add
    const picker = this.renderRoot.querySelector('lw-entity-picker') as any;
    if (picker) picker.value = '';
  }

  private _remove(id: string) {
    this._emit(this.value.filter((v) => v !== id));
  }

  private _emit(next: string[]) {
    this.value = next;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value: next }, bubbles: true, composed: true }),
    );
  }

  private _name(id: string): string {
    const e = this.hass?.states[id];
    return friendlyName(e, id);
  }

  render() {
    return html`
      ${this.value.length === 0
        ? html`<div class="empty">— noch nichts gewählt —</div>`
        : html`<div class="chips">
            ${this.value.map(
              (id) => html`
                <span class="chip">
                  <span class="nm" title=${id}>${this._name(id)}</span>
                  <button @click=${() => this._remove(id)}>
                    <lw-icon name="x" .size=${10} .stroke=${2.5}></lw-icon>
                  </button>
                </span>
              `,
            )}
          </div>`}
      <lw-entity-picker
        .hass=${this.hass}
        .domains=${this.domains}
        placeholder=${this.placeholder}
        value=""
        @change=${this._add}
      ></lw-entity-picker>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-entity-multi': LwEntityMulti;
  }
}
