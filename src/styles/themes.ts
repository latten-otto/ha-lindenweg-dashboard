import { css } from 'lit';

export const themeLinen = css`
  :host([theme='linen']),
  .theme-linen {
    --bg: #ece6da;
    --bg-soft: #f3eee3;
    --card: #fbf7ee;
    --card-elev: #ffffff;
    --card-inset: #ebe5d8;
    --border: #ddd5c2;
    --border-soft: #e6dfcf;
    --border-strong: #c7bea8;
    --text: #2a2620;
    --text-muted: #8a8278;
    --text-faint: #b8b1a4;
    --accent: #7e8f70;
    --accent-soft: #c9d2bc;
    --warn: #c47556;
    --warn-soft: #ecc9b8;
    --amber: #d9a25a;
    --amber-soft: #efd9b3;
    --blue: #6e8a9e;
    --blue-soft: #bdcfd9;
    --shadow-sm: 0 1px 2px rgba(40, 30, 20, 0.05);
    --shadow: 0 2px 10px rgba(40, 30, 20, 0.06), 0 1px 2px rgba(40, 30, 20, 0.03);
    --shadow-lg: 0 8px 30px rgba(40, 30, 20, 0.08);
    --grid: rgba(40, 30, 20, 0.04);
    --on-glow: 0 0 24px rgba(217, 162, 90, 0.45);
    --hover-bg: rgba(40, 30, 20, 0.04);
  }
`;

export const themeWalnut = css`
  :host([theme='walnut']),
  .theme-walnut {
    --bg: #1a1612;
    --bg-soft: #221d18;
    --card: #2a241e;
    --card-elev: #322b24;
    --card-inset: #1e1915;
    --border: #3a3229;
    --border-soft: #2f2922;
    --border-strong: #4d4238;
    --text: #ede5d4;
    --text-muted: #968c7d;
    --text-faint: #5a5247;
    --accent: #a3b58c;
    --accent-soft: #3b4636;
    --warn: #d88366;
    --warn-soft: #523429;
    --amber: #e8b576;
    --amber-soft: #4a3a24;
    --blue: #9ab5c4;
    --blue-soft: #2d3a44;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
    --grid: rgba(255, 240, 210, 0.04);
    --on-glow: 0 0 28px rgba(232, 181, 118, 0.35);
    --hover-bg: rgba(255, 240, 210, 0.04);
  }
`;
