import { LitElement, html, svg, css, type SVGTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type IconRenderer = () => SVGTemplateResult;

const ICONS: Record<string, IconRenderer> = {
  home: () => svg`<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>`,
  sofa: () => svg`<path d="M3 14v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"/><path d="M3 14h18v4H3z"/><path d="M5 18v2M19 18v2"/>`,
  kettle: () => svg`<path d="M6 9h12l-1 11H7L6 9z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/><path d="M18 12h2v3h-2"/>`,
  bed: () => svg`<path d="M3 18V8M21 18v-5H3"/><path d="M21 13V8a2 2 0 0 0-2-2h-7v7"/><circle cx="7" cy="11" r="1.5"/>`,
  shower: () => svg`<path d="M8 4a4 4 0 0 1 8 0v3"/><path d="M5 9h14l-1 2H6z"/><path d="M9 13v2M12 14v2M15 13v2M9 17v2M12 18v2M15 17v2"/>`,
  desk: () => svg`<path d="M3 8h18M5 8v12M19 8v12M3 8l2-3h14l2 3"/><path d="M8 14h8"/>`,
  chair: () => svg`<path d="M6 4h12v9H6z"/><path d="M5 13h14M8 13v7M16 13v7"/>`,
  door: () => svg`<rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="15" cy="12" r=".8" fill="currentColor"/>`,
  tree: () => svg`<path d="M12 3c-3 2-5 5-5 8a5 5 0 0 0 10 0c0-3-2-6-5-8z"/><path d="M12 14v7M9 18h6"/>`,
  cog: () => svg`<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>`,
  sun: () => svg`<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>`,
  moon: () => svg`<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>`,
  'partly-cloudy': () => svg`<circle cx="8" cy="10" r="3"/><path d="M11 14a4 4 0 1 1 4 4H7a3 3 0 0 1 0-6"/>`,
  cloud: () => svg`<path d="M7 18a4 4 0 0 1-1-7.9A6 6 0 0 1 18 11a3.5 3.5 0 0 1-.5 7H7z"/>`,
  rain: () => svg`<path d="M7 15a4 4 0 0 1-1-7.9A6 6 0 0 1 18 8a3.5 3.5 0 0 1-.5 7H7z"/><path d="M9 18l-1 2M13 18l-1 2M17 18l-1 2"/>`,
  film: () => svg`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 14h4M17 9h4M17 14h4"/>`,
  book: () => svg`<path d="M4 4h7v16H6a2 2 0 0 1-2-2V4z"/><path d="M20 4h-7v16h5a2 2 0 0 0 2-2V4z"/>`,
  lock: () => svg`<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  unlock: () => svg`<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>`,
  shield: () => svg`<path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/>`,
  'shield-check': () => svg`<path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/><path d="M9 12l2 2 4-4"/>`,
  bell: () => svg`<path d="M6 16V10a6 6 0 0 1 12 0v6l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/>`,
  camera: () => svg`<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M9 7l1.5-2h3L15 7"/>`,
  play: () => svg`<path d="M7 5l12 7-12 7V5z" fill="currentColor"/>`,
  pause: () => svg`<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>`,
  'skip-next': () => svg`<path d="M6 5l9 7-9 7V5z" fill="currentColor" stroke="none"/><path d="M17 5v14"/>`,
  'skip-prev': () => svg`<path d="M18 5l-9 7 9 7V5z" fill="currentColor" stroke="none"/><path d="M7 5v14"/>`,
  volume: () => svg`<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8a5 5 0 0 1 0 8"/>`,
  bolt: () => svg`<path d="M13 3 4 14h6l-1 7 9-11h-6l1-7z"/>`,
  leaf: () => svg`<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14z"/><path d="M5 19c4-4 7-8 14-14"/>`,
  wifi: () => svg`<path d="M5 12a10 10 0 0 1 14 0"/><path d="M8 15a6 6 0 0 1 8 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/>`,
  thermometer: () => svg`<path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z"/><circle cx="12" cy="17" r="1.5" fill="currentColor"/>`,
  droplet: () => svg`<path d="M12 3s6 6 6 11a6 6 0 1 1-12 0c0-5 6-11 6-11z"/>`,
  fan: () => svg`<circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M12 10c0-3-1-6 1-7s3 2 3 4-2 3-4 3"/><path d="M14 12c3 0 6-1 7 1s-2 3-4 3-3-2-3-4"/><path d="M12 14c0 3 1 6-1 7s-3-2-3-4 2-3 4-3"/><path d="M10 12c-3 0-6 1-7-1s2-3 4-3 3 2 3 4"/>`,
  lightbulb: () => svg`<path d="M9 18h6"/><path d="M10 21h4"/><path d="M9 15a5 5 0 1 1 6 0v2H9v-2z"/>`,
  blinds: () => svg`<rect x="4" y="4" width="16" height="14" rx="1"/><path d="M4 8h16M4 11h16M4 14h16"/><path d="M12 18v3"/>`,
  tv: () => svg`<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 17v3"/>`,
  music: () => svg`<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>`,
  mic: () => svg`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
  package: () => svg`<path d="M12 3 4 7v10l8 4 8-4V7l-8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/>`,
  plant: () => svg`<path d="M12 21V10"/><path d="M12 14c-4 0-6-3-6-7 4 0 6 3 6 7z"/><path d="M12 12c4 0 6-2 6-5-4 0-6 2-6 5z"/><path d="M8 21h8"/>`,
  water: () => svg`<path d="M12 4c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>`,
  fire: () => svg`<path d="M12 3c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z"/>`,
  'arrow-right': () => svg`<path d="M5 12h14M13 6l6 6-6 6"/>`,
  'arrow-down': () => svg`<path d="M12 5v14M6 13l6 6 6-6"/>`,
  'arrow-up': () => svg`<path d="M12 19V5M6 11l6-6 6 6"/>`,
  plus: () => svg`<path d="M12 5v14M5 12h14"/>`,
  minus: () => svg`<path d="M5 12h14"/>`,
  check: () => svg`<path d="M5 12l5 5 9-10"/>`,
  x: () => svg`<path d="M6 6l12 12M18 6 6 18"/>`,
  wind: () => svg`<path d="M3 8h12a3 3 0 1 0-3-3"/><path d="M3 14h17a3 3 0 1 1-3 3"/>`,
  eye: () => svg`<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  calendar: () => svg`<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`,
  clock: () => svg`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  vacuum: () => svg`<circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="2.5"/><path d="M12 6V3M9 3h6"/>`,
  washer: () => svg`<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="14" r="5"/><circle cx="9" cy="6" r=".7" fill="currentColor"/><circle cx="11" cy="6" r=".7" fill="currentColor"/>`,
  garage: () => svg`<path d="M3 20V10l9-5 9 5v10"/><rect x="6" y="12" width="12" height="8"/><path d="M6 16h12"/>`,
  menu: () => svg`<path d="M4 7h16M4 12h16M4 17h16"/>`,
  more: () => svg`<circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/>`,
  oven: () => svg`<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 10h16"/><circle cx="8" cy="7" r=".8" fill="currentColor"/><circle cx="12" cy="7" r=".8" fill="currentColor"/><circle cx="16" cy="7" r=".8" fill="currentColor"/><path d="M9 16h6"/>`,
  fridge: () => svg`<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 10h14M8 6v2M8 13v3"/>`,
  printer: () => svg`<path d="M7 8V4h10v4"/><rect x="3" y="8" width="18" height="9" rx="1.5"/><rect x="7" y="14" width="10" height="6"/>`,
  monitor: () => svg`<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M9 20h6M12 17v3"/>`,
  sound: () => svg`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>`,
  tag: () => svg`<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/>`,
  sparkle: () => svg`<path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>`,
  phone: () => svg`<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 4 7a2 2 0 0 1 1-3z"/>`,
  gear: () => svg`<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>`,
  sliders: () => svg`<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>`,
  meeting: () => svg`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
};

@customElement('lw-icon')
export class LwIcon extends LitElement {
  @property({ type: String }) name = 'cog';
  @property({ type: Number }) size = 18;
  @property({ type: Number }) stroke = 1.6;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
    svg {
      display: block;
    }
  `;

  render() {
    const renderer = ICONS[this.name] || (() => svg`<circle cx="12" cy="12" r="6"/>`);
    return html`
      <svg
        width=${this.size}
        height=${this.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width=${this.stroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        ${renderer()}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lw-icon': LwIcon;
  }
}
