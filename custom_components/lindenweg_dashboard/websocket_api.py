"""WebSocket commands exposed to the frontend."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .storage import ConfigStore

_LOGGER = logging.getLogger(__name__)


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all websocket commands."""
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_set_config)
    websocket_api.async_register_command(hass, ws_subscribe_config)


def _store(hass: HomeAssistant) -> ConfigStore:
    return hass.data[DOMAIN]["store"]


@websocket_api.websocket_command({vol.Required("type"): "lindenweg/config/get"})
@callback
def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the current configuration."""
    connection.send_result(msg["id"], _store(hass).data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lindenweg/config/set",
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def ws_set_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save the configuration sent from the frontend."""
    if not connection.user.is_admin:
        connection.send_error(msg["id"], "not_admin", "Admin user required")
        return
    new_cfg = await _store(hass).async_save(msg["config"])
    connection.send_result(msg["id"], new_cfg)


@websocket_api.websocket_command(
    {vol.Required("type"): "lindenweg/config/subscribe"}
)
@callback
def ws_subscribe_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe to config changes (pushes whenever it's saved)."""
    store = _store(hass)

    @callback
    def _send(cfg: dict[str, Any]) -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"config": cfg})
        )

    unsub = store.subscribe(_send)
    connection.subscriptions[msg["id"]] = unsub
    connection.send_result(msg["id"])
    # Push the initial state too so clients get current data on subscribe.
    _send(store.data)
