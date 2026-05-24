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
      position: relative;
      cursor: pointer;
      transition: background 0.18s, border-color 0.18s;
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0;
    }
    .t.on {
      background: var(--accent);
      border-color: var(--accent);
    }
    .k {
      background: var(--text-muted);
      border-radius: 50%;
      transition: transform 0.18s, background 0.18s;
      position: absolute;
      top: 50%;
      left: 0;
      margin: 0;
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
    const dim = this.size === 'sm' ? { w: 30, h: 18, k: 12 } : { w: 36, h: 22, k: 16 };
    // Inner padding 2px from each side, knob travels (w - k - 4) horizontally
    const offX = 2;
    const travel = dim.w - dim.k - 4;
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
          style=${`width:${dim.k}px;height:${dim.k}px;transform:translate(${offX + (this.on ? travel : 0)}px,-50%);`}
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
