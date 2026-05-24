export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
  context: { id: string; user_id: string | null; parent_id: string | null };
}

export interface HassConfig {
  unit_system: { temperature: string };
  location_name: string;
  language: string;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config: HassConfig;
  user?: HassUser;
  themes: any;
  language: string;
  locale: { language: string };
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
    target?: { entity_id?: string | string[]; area_id?: string | string[] }
  ) => Promise<unknown>;
  callApi: <T = unknown>(method: string, path: string, parameters?: any) => Promise<T>;
  formatEntityState?: (entity: HassEntity) => string;
  formatEntityAttributeValue?: (entity: HassEntity, attribute: string) => string;
}

export interface PanelInfo<TConfig = unknown> {
  component_name: string;
  config: TConfig;
  icon: string | null;
  title: string | null;
  url_path: string;
}
