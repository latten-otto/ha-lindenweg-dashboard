"""Config flow — single-instance, one-click install via HA UI."""
from __future__ import annotations

from typing import Any

from homeassistant import config_entries

from .const import DOMAIN


class LindenwegConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Lindenweg Dashboard."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Handle the user step (or auto-confirm if no input)."""
        # Single instance only.
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        # Auto-create — there's nothing to ask about.
        return self.async_create_entry(title="Lindenweg Dashboard", data={})
