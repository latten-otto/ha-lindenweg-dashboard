export type ThemeName = 'linen' | 'walnut';

export interface RoomConfig {
  name: string;
  icon?: string;
  climate?: string;
  /** Lights for individual control popup. */
  lights?: string[];
  /** Scenes shown as quick buttons (1-5) — "Aus" button is always appended automatically. */
  scenes?: string[];
  covers?: string[];
  media_player?: string;
  extras?: ExtraConfig[];
}

export type ExtraKind =
  | 'tv'
  | 'fireplace'
  | 'fan'
  | 'towel-warmer'
  | 'printer'
  | 'monitor'
  | 'meeting'
  | 'lock'
  | 'garage'
  | 'irrigation'
  | 'vacuum'
  | 'mower'
  | 'air-purifier'
  | 'dehumidifier'
  | 'generic';

export interface ExtraConfig {
  kind: ExtraKind | string;
  name: string;
  entity?: string;
  /** Optional secondary entity for state/sub line. */
  state_entity?: string;
}

export interface OverviewEnergyConfig {
  pv_now?: string;
  pv_today?: string;
  consumption?: string;
  grid_feed?: string;
  grid_draw?: string;
  battery_level?: string;
  battery_flow?: string;
}

export interface ApplianceConfig {
  /** entity id — for Miele typically a sensor.<device>_state or sensor.<device>_program_phase */
  state_entity: string;
  /** Optional explicit progress percentage entity (0-100). */
  progress_entity?: string;
  /** Optional remaining-time entity (string like "1:23" or minutes). */
  remaining_entity?: string;
  /** Display name. */
  name: string;
  /** Icon: dishwasher → water, washer → washer, dryer → fan, oven → oven, fridge → fridge */
  icon?: string;
}

export interface EventsConfig {
  appliances?: ApplianceConfig[];
  waste_calendar?: string;
  /** Percent — any battery sensor at or below this triggers a warning row. */
  low_battery_threshold?: number;
  /** Optional explicit list of battery sensors to track. Empty = auto-discover all sensor.* with device_class:battery */
  battery_entities?: string[];
}

export interface RadioStation {
  name: string;
  /** Stream URL passed to media_player.play_media */
  url: string;
  /** Optional logo image URL. */
  logo?: string;
  /** Optional default content type, defaults to 'music'. */
  content_type?: string;
}

export interface OverviewConfig {
  weather?: string;
  presence?: string[];
  energy?: OverviewEnergyConfig;
  /** Scene entity ids for the Overview quick scenes row. */
  scenes?: string[];
  cameras?: string[];
  /** Optional binary_sensor.motion_* mapping per camera for auto-switching. */
  camera_motion?: Record<string, string>;
  calendar?: string;
  alarm_panel?: string;
  events?: EventsConfig;
  radios?: RadioStation[];
}

export interface PanelConfig {
  theme: ThemeName;
  household_name: string;
  rooms: Record<string, RoomConfig>;
  overview: OverviewConfig;
}

export const DEFAULT_CONFIG: PanelConfig = {
  theme: 'linen',
  household_name: 'Zuhause',
  rooms: {},
  overview: {
    presence: [],
    scenes: [],
    cameras: [],
    camera_motion: {},
    energy: {},
    events: { appliances: [], waste_calendar: undefined, low_battery_threshold: 10, battery_entities: [] },
    radios: [],
  },
};
