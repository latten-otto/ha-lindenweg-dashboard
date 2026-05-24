import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lw-section-head')
export class LwSectionHead extends LitElement {
  @property({ type: String }) sub = '';
  @property({ type: String }) heading = '';

  static styles = css`
    :host {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
    }
    .group {
      min-width: 0;
    }
    .sub {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-faint);
    }
    .title {
      font-size: 15px;
      font-weight: 500;
      letter-spacing: -0.01em;
      margin-top: 2px;
      color: var(--text);
    }
    ::slotted([slot='right']) {
      flex-shrink: 0;
    }
  `;

  render() {
    return html`
      <div class="group">
        <div class="sub">${this.sub}</div>
        <div class="title">${this.heading}</div>
      </div>
      <slot name="right"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-section-head': LwSectionHead;
  }
}
