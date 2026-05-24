// Entry point — registers the custom panel element + visual editor.
// Loaded by Home Assistant via panel_custom -> module_url.
import './panel/dashboard-panel';
import './editor/dashboard-editor';

// HA expects window.customPanel? No — for panel_custom, HA just imports the module
// and looks for a custom element matching `name` from configuration.yaml.
// We also fire a console banner so users can confirm load.
const VERSION = '0.1.0';
// eslint-disable-next-line no-console
console.info(
  `%c LINDENWEG-DASHBOARD %c v${VERSION} `,
  'background:#7e8f70;color:#fbf7ee;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:600',
  'background:#2a2620;color:#ece6da;padding:2px 6px;border-radius:0 4px 4px 0',
);
