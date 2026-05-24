import type { HomeAssistant, HassEntity } from './hass-types';

export const isOn = (state: string): boolean =>
  state === 'on' || state === 'open' || state === 'playing' || state === 'unlocked' || state === 'home';

export const entityState = (hass: HomeAssistant | undefined, id?: string): HassEntity | undefined => {
  if (!hass || !id) return undefined;
  return hass.states[id];
};

export const stateOrUnknown = (e: HassEntity | undefined): string => (e ? e.state : 'unknown');

export const stateNum = (e: HassEntity | undefined, fallback = 0): number => {
  if (!e) return fallback;
  const n = parseFloat(e.state);
  return Number.isFinite(n) ? n : fallback;
};

export const attrNum = (e: HassEntity | undefined, attr: string, fallback = 0): number => {
  if (!e) return fallback;
  const v = e.attributes?.[attr];
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

export const brightnessPct = (e: HassEntity | undefined): number => {
  if (!e || e.state !== 'on') return 0;
  const b = e.attributes?.brightness;
  if (typeof b !== 'number') return 100;
  return Math.round((b / 255) * 100);
};

export const friendlyName = (e: HassEntity | undefined, fallback = ''): string =>
  e?.attributes?.friendly_name || fallback || e?.entity_id || '';

export const callLightTurnOn = (
  hass: HomeAssistant,
  entity_id: string,
  brightness_pct?: number,
): void => {
  const data: Record<string, any> = {};
  if (brightness_pct !== undefined) data.brightness_pct = brightness_pct;
  void hass.callService('light', 'turn_on', data, { entity_id });
};

export const callLightTurnOff = (hass: HomeAssistant, entity_id: string): void => {
  void hass.callService('light', 'turn_off', {}, { entity_id });
};

export const callToggle = (hass: HomeAssistant, entity_id: string): void => {
  const domain = entity_id.split('.')[0];
  void hass.callService(domain, 'toggle', {}, { entity_id });
};

export const callCoverSetPosition = (hass: HomeAssistant, entity_id: string, position: number): void => {
  void hass.callService('cover', 'set_cover_position', { position }, { entity_id });
};

export const callClimateSetTemp = (hass: HomeAssistant, entity_id: string, temperature: number): void => {
  void hass.callService('climate', 'set_temperature', { temperature }, { entity_id });
};

export const callMediaPlay = (hass: HomeAssistant, entity_id: string, play: boolean): void => {
  void hass.callService('media_player', play ? 'media_play' : 'media_pause', {}, { entity_id });
};

export const callMediaVolume = (hass: HomeAssistant, entity_id: string, volume: number): void => {
  void hass.callService('media_player', 'volume_set', { volume_level: volume / 100 }, { entity_id });
};

export const callSceneActivate = (hass: HomeAssistant, entity_id: string): void => {
  void hass.callService('scene', 'turn_on', {}, { entity_id });
};
