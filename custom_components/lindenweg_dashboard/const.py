"""Constants for Lindenweg Dashboard."""
from __future__ import annotations

DOMAIN = "lindenweg_dashboard"

PANEL_URL_PATH = "lindenweg"
PANEL_TITLE = "Dashboard"
PANEL_ICON = "mdi:home-variant"

FRONTEND_FILENAME = "lindenweg-dashboard.js"
FRONTEND_URL_PREFIX = "/lindenweg_dashboard_files"
PANEL_FILE_URL = f"{FRONTEND_URL_PREFIX}/{FRONTEND_FILENAME}"

STORAGE_VERSION = 1
STORAGE_KEY = "lindenweg_dashboard.config"

DEFAULT_CONFIG: dict = {
    "theme": "linen",
    "household_name": "Zuhause",
    "rooms": {},
    "overview": {
        "presence": [],
        "scenes": [],
        "cameras": [],
        "energy": {},
        "events": {
            "appliances": [],
            "waste_calendar": None,
            "low_battery_threshold": 10,
        },
        "radios": [],
    },
}
