"""Storage helper for Lindenweg Dashboard configuration."""
from __future__ import annotations

import copy
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DEFAULT_CONFIG, STORAGE_KEY, STORAGE_VERSION


class ConfigStore:
    """Persistent JSON config on disk under .storage/lindenweg_dashboard.config."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] | None = None
        self._listeners: list = []

    async def async_load(self) -> dict[str, Any]:
        loaded = await self._store.async_load()
        if loaded is None:
            self._data = copy.deepcopy(DEFAULT_CONFIG)
            await self._store.async_save(self._data)
        else:
            # Merge with defaults so missing keys are filled in.
            self._data = _deep_merge(copy.deepcopy(DEFAULT_CONFIG), loaded)
        return self._data

    @property
    def data(self) -> dict[str, Any]:
        return self._data if self._data is not None else copy.deepcopy(DEFAULT_CONFIG)

    async def async_save(self, new_config: dict[str, Any]) -> dict[str, Any]:
        self._data = _deep_merge(copy.deepcopy(DEFAULT_CONFIG), new_config)
        await self._store.async_save(self._data)
        for cb in self._listeners:
            try:
                cb(self._data)
            except Exception:  # noqa: BLE001
                pass
        return self._data

    def subscribe(self, cb) -> callable:
        self._listeners.append(cb)

        def _unsub() -> None:
            if cb in self._listeners:
                self._listeners.remove(cb)

        return _unsub


def _deep_merge(base: dict, overlay: dict) -> dict:
    out = copy.deepcopy(base)
    for k, v in overlay.items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = _deep_merge(out[k], v)
        else:
            out[k] = v
    return out
