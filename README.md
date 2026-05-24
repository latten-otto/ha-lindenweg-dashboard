# Lindenweg Dashboard

Skandinavisch / Muji-inspiriertes Home Assistant **Custom Panel** — Räume, Szenen, Energie, Wetter, Sicherheit, Kameras, Kalender, Ereignisse, Multiroom Audio mit Radio-Tiles. Zwei Themes: **Linen** (hell) und **Walnut** (warmes Dark).

> **Status: v0.2** — Custom Integration (kein YAML mehr nötig), Visual Editor direkt im Dashboard, alle Module funktional.

---

## Was kann es?

**Übersicht**
- Live-Energie: PV / Verbrauch / Akku / Netz · Eigenversorgungsquote
- Wetter mit 5-Tage-Forecast
- Sicherheits-Panel (arm/disarm, Türen, Fenster, Rauchmelder)
- Szenen-Schnellzugriff
- Multiroom Audio: Play/Pause, Lautstärke, Radio-Tiles, Speaker-Sync-Dropdown
- Kameras: Hauptansicht + Selektoren, Auto-Switch bei Bewegung
- Heute-Kalender
- **Ereignisse**: Geräte-Fortschritt (Miele etc.), Müllabholung, schwache Akkus

**Räume**
- Konfigurierbare Szenen pro Raum (1-5 Buttons + automatischer „Aus")
- Popup für einzelne Lichtsteuerung (mit Helligkeit)
- Klima (Soll/Ist + Stepper)
- Rollläden mit Vertikal-Slider und großen Hoch/Runter-Tastern
- Mini-Mediaplayer
- **Geräte-Bereich** mit dedizierten Tiles für:
  - Saugroboter (Battery + Start/Dock)
  - Mähroboter
  - Sprinkler / Smart Irrigation
  - Luftreiniger / Luftentfeuchter
  - Generische Schalter, TV, Kamin, Lüfter

---

## Installation

### Über HACS (empfohlen)

1. HACS → Integrationen → ⋮ → **Custom Repositories**
2. Repository: `latten-otto/ha-lindenweg-dashboard` · Typ: **Integration** · Hinzufügen
3. „Lindenweg Dashboard" → Download
4. Home Assistant **komplett neustarten** (Einstellungen → System → Neustart)
5. Einstellungen → Geräte & Dienste → **Integration hinzufügen** → „Lindenweg Dashboard"
6. Bestätigen — Sidebar zeigt jetzt „Dashboard"
7. Im Dashboard das Zahnrad unten links → alles konfigurieren

Keine YAML, kein Editieren von `configuration.yaml`.

### Migration von v0.1 (YAML-Variante)

Wer schon die v0.1 mit `panel_custom:` in `configuration.yaml` installiert hatte:

1. **Entferne** den `panel_custom:` Block für `lindenweg-dashboard` aus `configuration.yaml`
2. HACS → Frontend → alte „Lindenweg Dashboard" Plugin-Variante entfernen
3. HACS → Custom Repository neu hinzufügen (Typ jetzt: **Integration**)
4. Schritte 4-7 oben

---

## Architektur

```
custom_components/lindenweg_dashboard/
├── __init__.py         # Panel-Registration + statische Asset-Auslieferung
├── config_flow.py      # Ein-Klick Setup via HA-UI
├── storage.py          # JSON-Persistenz in .storage/lindenweg_dashboard.config
├── websocket_api.py    # lindenweg/config/{get,set,subscribe}
├── manifest.json       # HA-Integration-Metadaten
└── frontend/
    └── lindenweg-dashboard.js  # Lit + TypeScript Bundle (Vite gebaut)

src/
├── panel/              # Custom Element Root + Sidebar + Topbar
├── pages/              # overview-page, room-page, edit-page
├── modules/            # ov-*: Übersicht  ·  room-*: Raum  ·  extras/: Spezialgeräte
├── controls/           # Slider, Toggle, Stepper, Light-Tile, Gauge, Bars
├── editor/             # Entity-Picker, Multi-Picker, Text-Input
├── hass/               # WebSocket Config-Store + Service-Call Helpers
├── shared/             # Section-Head, Pill, Feature-Tile
├── styles/             # Themes (Linen/Walnut) + Base
├── icons/              # Custom SVG Icon-Set
└── types/              # PanelConfig, RoomConfig, …
```

- **Backend** (Python): owns the config, serves the bundle, exposes WS API
- **Frontend** (Lit + TypeScript): rendert das Panel, edits live via WS
- **Persistenz**: HA `Store` auf Festplatte, ein einzelnes JSON

## Lokale Entwicklung

```bash
git clone https://github.com/latten-otto/ha-lindenweg-dashboard.git
cd ha-lindenweg-dashboard
npm install
npm run build      # baut dist/ + kopiert in custom_components/.../frontend/
npm run watch      # Auto-Rebuild bei Änderungen
npm run typecheck
```

Während der Entwicklung: gesamten `custom_components/lindenweg_dashboard/` Ordner per Samba/SCP ins HA `/config/custom_components/` kopieren. HA neu starten, Browser-Cache leeren.

## Roadmap

- v0.2 (jetzt) — Integration + Visual Editor + alle v2-Anpassungen
- v0.3 — Isometrische Haus-Energiegrafik (statt Stat-Grid)
- v0.4 — Pre-Filled Setup: erkennt deine Areas/Devices und schlägt initiale Raum-Zuordnung vor
- v0.5 — Mehrsprachig (EN), Touch-optimierte Layouts für Tablet-Wandhalterung

## Lizenz

MIT
