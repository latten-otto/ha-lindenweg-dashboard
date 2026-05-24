// Client-side config store talking to the lindenweg_dashboard backend
// via Home Assistant's WebSocket connection.

import type { HomeAssistant } from './hass-types';
import type { PanelConfig } from '../types/config';
import { DEFAULT_CONFIG } from '../types/config';

type Listener = (config: PanelConfig) => void;

interface HassConnection {
  sendMessagePromise<T>(msg: any): Promise<T>;
  subscribeMessage<T>(callback: (event: T) => void, msg: any): Promise<() => void>;
}

interface HassWithConnection extends HomeAssistant {
  connection: HassConnection;
}

export class ConfigStore {
  private _config: PanelConfig = DEFAULT_CONFIG;
  private _hass?: HassWithConnection;
  private _listeners = new Set<Listener>();
  private _unsub?: () => void;
  private _pendingSave: number | null = null;
  private _bound = false;

  get config(): PanelConfig {
    return this._config;
  }

  attach(hass: HomeAssistant): void {
    const withConn = hass as HassWithConnection;
    if (this._hass === withConn) return;
    this._hass = withConn;
    if (this._bound) return;
    this._bound = true;
    this._subscribe();
  }

  detach(): void {
    if (this._unsub) {
      this._unsub();
      this._unsub = undefined;
    }
    this._bound = false;
  }

  subscribe(listener: Listener): () => void {
    this._listeners.add(listener);
    // Immediately call back with current state.
    listener(this._config);
    return () => {
      this._listeners.delete(listener);
    };
  }

  update(patch: Partial<PanelConfig> | ((c: PanelConfig) => PanelConfig)): void {
    const next =
      typeof patch === 'function'
        ? (patch as (c: PanelConfig) => PanelConfig)(this._config)
        : { ...this._config, ...patch };
    this._config = next;
    this._emit();
    this._scheduleSave();
  }

  set(config: PanelConfig): void {
    this._config = config;
    this._emit();
    this._scheduleSave();
  }

  private _emit(): void {
    this._listeners.forEach((cb) => {
      try {
        cb(this._config);
      } catch (e) {
        console.error('[lindenweg] listener threw', e);
      }
    });
  }

  private _scheduleSave(): void {
    if (this._pendingSave !== null) {
      window.clearTimeout(this._pendingSave);
    }
    this._pendingSave = window.setTimeout(() => {
      this._pendingSave = null;
      void this._flush();
    }, 350);
  }

  private async _flush(): Promise<void> {
    if (!this._hass) return;
    try {
      await this._hass.connection.sendMessagePromise({
        type: 'lindenweg/config/set',
        config: this._config,
      });
    } catch (e) {
      console.error('[lindenweg] config save failed', e);
    }
  }

  private async _subscribe(): Promise<void> {
    if (!this._hass) return;
    try {
      this._unsub = await this._hass.connection.subscribeMessage<{ config: PanelConfig }>(
        (event) => {
          if (!event || !event.config) return;
          // Only apply remote update if it differs (avoid loop with our own writes).
          const incoming = JSON.stringify(event.config);
          const current = JSON.stringify(this._config);
          if (incoming !== current) {
            this._config = event.config;
            this._emit();
          }
        },
        { type: 'lindenweg/config/subscribe' },
      );
    } catch (e) {
      console.warn('[lindenweg] config subscribe failed — backend integration not installed?', e);
    }
  }
}

// Shared singleton — the panel root attaches hass to it.
export const configStore = new ConfigStore();
