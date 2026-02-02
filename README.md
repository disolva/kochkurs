# kochkurs
Opas Chinesisch und Männer Kochkurs

Eine Rezeptverwaltungs-Anwendung gebaut mit Nuxt 3, Drizzle ORM und SQLite.

## Features

- 📝 Rezeptverwaltung mit SQLite Datenbank
- 🔍 Volltext-Suche über Rezepte
- 🏷️ Tag-System zur Kategorisierung
- 📥 CLI-Tool zum Importieren von Rezepten aus JSON
- 🌐 Server-Side Rendering (SSR) mit Nuxt 3
- ⚡ Leichtgewichtig mit Drizzle ORM

## Architektur

- **Frontend**: Nuxt 3 Pages (SSR/SSG)
- **Backend**: Nuxt Server Routes (Nitro API)
- **Datenbank**: SQLite (lokal, später auf Postgres umstellbar)
- **ORM**: Drizzle ORM
- **Import**: CLI-Script für JSON-Rezepte

## Installation

```bash
npm install
```

## Entwicklung

```bash
# Entwicklungsserver starten
npm run dev

# Öffne http://localhost:3000
```

## Datenbank

Die Datenbank wird automatisch erstellt. Schema-Änderungen können mit folgenden Befehlen angewendet werden:

```bash
# Schema in die Datenbank übertragen
npm run db:push

# Migrations generieren
npm run db:generate

# Drizzle Studio öffnen (Datenbank-UI)
npm run db:studio
```

## Rezepte importieren

Rezepte können aus JSON-Dateien importiert werden:

```bash
# Einzelne Datei importieren
npm run import examples/gebratener-reis.json

# Ganzes Verzeichnis importieren
npm run import examples/
```

### JSON Format

```json
{
  "title": "Rezept-Titel",
  "description": "Kurze Beschreibung",
  "instructions": "Schritt-für-Schritt Anleitung",
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "ingredients": [
    {
      "name": "Zutat",
      "quantity": "200",
      "unit": "g"
    }
  ],
  "tags": ["Tag1", "Tag2"]
}
```

## API Endpoints

- `GET /api/recipes` - Alle Rezepte auflisten
- `GET /api/recipes/:id` - Einzelnes Rezept mit Details
- `GET /api/search?q=...` - Rezepte suchen
- `GET /api/tags` - Alle Tags auflisten

## Seiten

- `/` - Startseite mit Rezept-Übersicht
- `/recipes/:id` - Rezept-Detailseite
- `/search` - Suchseite
- `/tags` - Tag-Übersicht

## Production Build

```bash
# Build für Production
npm run build

# Production Preview
npm run preview
```

## Datenbank-Migration zu Postgres

Die Anwendung ist vorbereitet für eine spätere Migration zu PostgreSQL. Dazu müssen nur folgende Änderungen vorgenommen werden:

1. `drizzle.config.ts` anpassen
2. `server/db/index.ts` auf Postgres-Treiber umstellen
3. PostgreSQL-Pakete installieren (`pg`, `drizzle-orm/postgres`)
