import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lw-toggle')
export class LwToggle extends LitElement {
  @property({ type: Boolean, reflect: true }) on = false;
  @property({ type: String }) size: 'sm' | 'md' = 'md';

  static styles = css`
    :host {
      display: inline-block;
    }
    .t {
      background: var(--card-inset);
      border-radius: 999px;
      border: 1px solid var(--border);
      padding: 2px;
      position: relative;
      cursor: pointer;
      transition: background 0.18s, border-color 0.18s;
      display: inline-block;
    }
    .t.on {
      background: var(--accent);
      border-color: var(--accent);
    }
    .k {
      background: var(--text-muted);
      border-radius: 50%;
      transition: transform 0.18s, background 0.18s;
    }
    .t.on .k {
      background: var(--bg);
    }
  `;

  private _click(e: Event) {
    e.stopPropagation();
    const next = !this.on;
    this.on = next;
    this.dispatchEvent(
      new CustomEvent('change', { detail: { value: next }, bubbles: true, composed: true }),
    );
  }

  render() {
    const dim = this.size === 'sm' ? { w: 30, h: 17, k: 11, t: 13 } : { w: 36, h: 20, k: 14, t: 16 };
    return html`
      <div
        class=${'t ' + (this.on ? 'on' : '')}
        style=${`width:${dim.w}px;height:${dim.h}px;`}
        role="switch"
        aria-checked=${String(this.on)}
        @click=${this._click}
      >
        <div
          class="k"
          style=${`width:${dim.k}px;height:${dim.k}px;transform:translateX(${this.on ? dim.t : 0}px);`}
        ></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-toggle': LwToggle;
  }
}
