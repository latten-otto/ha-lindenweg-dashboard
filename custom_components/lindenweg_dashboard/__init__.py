"""Lindenweg Dashboard custom integration.

Registers a Home Assistant frontend panel that is rendered by the
`lindenweg-dashboard` custom element. Config is stored in HA's own
storage so the user can edit everything from the dashboard UI itself.
"""
from __future__ import annotations

import logging
import os
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    FRONTEND_FILENAME,
    FRONTEND_URL_PREFIX,
    PANEL_FILE_URL,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
)
from .storage import ConfigStore
from .websocket_api import async_register as async_register_ws

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up via configuration.yaml — we only support config entries."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the Lindenweg Dashboard integration from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # Storage
    store = ConfigStore(hass)
    await store.async_load()
    hass.data[DOMAIN]["store"] = store

    # Serve the JS bundle from custom_components/lindenweg_dashboard/frontend/
    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                FRONTEND_URL_PREFIX,
                str(frontend_dir),
                cache_headers=False,
            )
        ]
    )

    # Register the custom panel
    if PANEL_URL_PATH not in hass.data.get("frontend_panels", {}):
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name="lindenweg-dashboard",
            frontend_url_path=PANEL_URL_PATH,
            module_url=PANEL_FILE_URL,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=False,
            embed_iframe=False,
        )

    # WebSocket commands
    async_register_ws(hass)

    _LOGGER.info(
        "Lindenweg Dashboard ready — open the '%s' panel in the sidebar.",
        PANEL_TITLE,
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the integration."""
    try:
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
    except Exception:  # noqa: BLE001
        pass
    hass.data.pop(DOMAIN, None)
    return True
