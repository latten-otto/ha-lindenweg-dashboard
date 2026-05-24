import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lw-pill')
export class LwPill extends LitElement {
  @property({ type: String }) color = 'var(--accent)';
  @property({ type: Boolean }) soft = false;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 9px;
      font-size: 11px;
      font-weight: 500;
      border-radius: 999px;
      line-height: 1.2;
    }
  `;

  render() {
    this.style.color = this.soft ? this.color : 'white';
    this.style.background = this.soft
      ? `color-mix(in oklab, ${this.color} 16%, transparent)`
      : this.color;
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-pill': LwPill;
  }
}
