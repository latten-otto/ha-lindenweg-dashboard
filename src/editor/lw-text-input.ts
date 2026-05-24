import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lw-text-input')
export class LwTextInput extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) type: 'text' | 'number' | 'url' = 'text';

  static styles = css`
    :host {
      display: block;
    }
    input {
      width: 100%;
      padding: 8px 12px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: var(--accent);
    }
  `;

  render() {
    return html`<input
      type=${this.type}
      .value=${this.value ?? ''}
      placeholder=${this.placeholder}
      @input=${(e: Event) =>
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: { value: (e.target as HTMLInputElement).value },
            bubbles: true,
            composed: true,
          }),
        )}
    />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-text-input': LwTextInput;
  }
}
