export type ThemeName = 'linen' | 'walnut';

export interface RoomConfig {
  name: string;
  icon?: string;
  climate?: string;
  lights?: string[];
  covers?: string[];
  media_player?: string;
  extras?: ExtraConfig[];
}

export interface ExtraConfig {
  kind:
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
    | string;
  name: string;
  entity?: string;
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

export interface OverviewConfig {
  weather?: string;
  presence?: string[];
  energy?: OverviewEnergyConfig;
  scenes?: string[];
  cameras?: string[];
  calendar?: string;
  alarm_panel?: string;
}

export interface PanelConfig {
  theme: ThemeName;
  household_name: string;
  rooms: Record<string, RoomConfig>;
  overview: OverviewConfig;
}

export const DEFAULT_CONFIG: PanelConfig = {
  theme: 'linen',
  household_name: 'Mein Zuhause',
  rooms: {},
  overview: {
    presence: [],
    scenes: [],
    cameras: [],
    energy: {},
  },
};
