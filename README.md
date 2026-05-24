# Lindenweg Dashboard

Skandinavisch / Muji-inspiriertes Home Assistant **Custom Panel** — Räume, Szenen, Energie, Wetter, Sicherheit, Kameras, Kalender. Zwei Themes: **Linen** (hell) und **Walnut** (warmes Dark). Per Knopfdruck umschaltbar.

> **Status: v0.1** — Overview + 1 Beispielraum funktional, weitere Räume per Config einfach ergänzbar. Visual Config-Helper im Panel (generiert YAML für `configuration.yaml`).

---

## Installation

### Option A · HACS Custom Repository (empfohlen für später)

1. HACS → Frontend → ⋮ (oben rechts) → **Custom Repositories**
2. Repository: `<dein-github-user>/ha-lindenweg-dashboard` · Type: **Plugin** · Hinzufügen
3. „Lindenweg Dashboard" → Download
4. `configuration.yaml` ergänzen (siehe unten) und HA neu starten

### Option B · Manuell (sofortiges Testen ohne Git/HACS)

1. Datei `lindenweg-dashboard.js` aus dem Repo-Root (oder `dist/`) nehmen
2. Per SCP / Samba nach `/config/www/community/ha-lindenweg-dashboard/` kopieren  
   (Ordner ggf. anlegen)
3. `configuration.yaml` ergänzen, HA neu starten

---

## Konfiguration

Minimalbeispiel in `configuration.yaml`:

```yaml
panel_custom:
  - name: lindenweg-dashboard
    sidebar_title: Lindenweg
    sidebar_icon: mdi:home-variant
    url_path: lindenweg
    module_url: /hacsfiles/ha-lindenweg-dashboard/lindenweg-dashboard.js
    # bei Option B (manuell): /local/community/ha-lindenweg-dashboard/lindenweg-dashboard.js
    config:
      theme: linen           # linen | walnut
      household_name: "Haus Lindenweg"

      overview:
        weather: weather.home
        calendar: calendar.familie
        alarm_panel: alarm_control_panel.haus
        presence:
          - person.lukas
          - person.marie
          - person.jonas
        scenes:
          - scene.aufstehen
          - scene.arbeiten
          - scene.abendessen
          - scene.filmabend
          - scene.gute_nacht
          - scene.verlassen
        cameras:
          - camera.eingang
          - camera.garten
        energy:
          pv_now: sensor.pv_power
          pv_today: sensor.pv_energy_today
          consumption: sensor.home_power
          grid_feed: sensor.grid_export_power
          grid_draw: sensor.grid_import_power
          battery_level: sensor.battery_soc
          battery_flow: sensor.battery_power

      rooms:
        wohnzimmer:
          name: Wohnzimmer
          icon: sofa
          climate: climate.wohnzimmer
          media_player: media_player.sonos_arc
          lights:
            - light.wohnzimmer_decke
            - light.wohnzimmer_stehlampe
            - light.wohnzimmer_leseleuchte
            - light.wohnzimmer_tv_backlight
          covers:
            - cover.wohnzimmer_sued
            - cover.wohnzimmer_terrasse
            - cover.wohnzimmer_ost
          extras:
            - kind: tv
              name: LG OLED
              entity: media_player.lg_tv
            - kind: fireplace
              name: Kamin
              entity: switch.kamin
```

**Tipp:** Sobald das Panel läuft → Zahnrad-Symbol unten links in der Sidebar → Config-Helper öffnet sich und generiert dir den YAML-Block für weitere Räume.

### Verfügbare Raum-Icons

`sofa · kettle · bed · shower · desk · chair · door · tree · cog · sun · moon · fire · garage · plant`

### Extra-Kinds (Geräte-Kacheln)

`tv · fireplace · fan · towel-warmer · printer · monitor · meeting · vacuum · camera · bell · garage · irrigation`

---

## Lokale Entwicklung

```bash
git clone <dein-repo>
cd ha-lindenweg-dashboard
npm install
npm run build      # baut dist/ + kopiert lindenweg-dashboard.js ins Repo-Root
npm run watch      # Auto-Rebuild bei Änderungen
npm run typecheck  # TypeScript Check
```

Während der Entwicklung:
- Build-Output (`lindenweg-dashboard.js`) per SCP nach `/config/www/community/ha-lindenweg-dashboard/` kopieren
- HA-Browsercache leeren (Strg+Shift+R) — neue Bundle-Version wird geladen
- Version-Banner in der Browser-Konsole zeigt, ob neu geladen

## Architektur

- **Lit + TypeScript**, Bundle via Vite (Single ES Module, ~35 kB gzipped)
- Themes als CSS-Variablen, umschaltbar zur Laufzeit
- Modulares Layout: jedes Modul (`lw-*-card`) liest seine Entities aus der Panel-Config
- Visual Config-Helper schreibt YAML-Snippets zum Kopieren

## Roadmap

- v0.1 (jetzt) Overview-Page + Wohnzimmer-Template, alle Module funktional, Themes Linen/Walnut, YAML-Config-Helper
- v0.2 Restliche Räume (Küche, Bad, Schlafzimmer, Büro, Esszimmer, Flur, Garten, Keller) mit eigenen Extras
- v0.3 Isometrische Haus-Energiegrafik (statt Stat-Grid)
- v0.4 Storage-Helper Integration: Config wird in HA selbst gespeichert statt YAML
- v0.5 Mehrsprachig (EN), Touch-optimierte Layouts für Tablet-Wandhalterung

## Lizenz

MIT
