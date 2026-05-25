// Entry point — registers the custom panel element.
// Loaded by the lindenweg_dashboard integration which registers the panel
// programmatically and serves this bundle from custom_components/.../frontend/.
import './panel/dashboard-panel';

const VERSION = '0.2.8';
// eslint-disable-next-line no-console
console.info(
  `%c LINDENWEG-DASHBOARD %c v${VERSION} `,
  'background:#7e8f70;color:#fbf7ee;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:600',
  'background:#2a2620;color:#ece6da;padding:2px 6px;border-radius:0 4px 4px 0',
);
