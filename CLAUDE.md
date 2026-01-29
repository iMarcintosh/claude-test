# CLAUDE.md - Besuchermanagement System

## Projektübersicht

Dies ist ein **Besuchermanagement-System** (Visitor Management System) für die Verwaltung von Besuchern in einem Unternehmen oder einer Einrichtung. Die Anwendung ermöglicht das Ein- und Auschecken von Besuchern, bietet Echtzeit-Statistiken und Such-/Filterfunktionen.

**Sprache der Benutzeroberfläche:** Deutsch

## Technologie-Stack

### Frontend
- **React:** 19.2.0 (neueste Version)
- **Vite:** 7.2.4 (Build-Tool mit HMR)
- **Tailwind CSS:** 4.1.18 (Utility-First CSS Framework)

### Entwicklungstools
- **ESLint:** 9.39.1 mit React-spezifischen Plugins
- **Node.js:** Module-basiertes Setup (type: "module")

## Projektstruktur

```
claude-test/
├── public/              # Statische Assets
├── src/
│   ├── components/      # React-Komponenten
│   │   ├── Header.jsx          # Kopfzeile der Anwendung
│   │   ├── Stats.jsx           # Statistik-Dashboard
│   │   ├── VisitorForm.jsx     # Formular für neue Besucher
│   │   ├── SearchBar.jsx       # Such- und Filterfunktion
│   │   ├── VisitorCard.jsx     # Einzelne Besucher-Karte
│   │   └── VisitorList.jsx     # Liste aller Besucher
│   ├── App.jsx          # Haupt-App-Komponente
│   └── main.jsx         # React-Einstiegspunkt
├── index.html           # HTML-Template
├── package.json         # Abhängigkeiten und Skripte
├── vite.config.js       # Vite-Konfiguration
└── eslint.config.js     # ESLint-Konfiguration
```

## Hauptfunktionen

### 1. Besucherverwaltung
- **Check-in:** Registrierung neuer Besucher mit Pflichtfeldern (Name, Ansprechpartner, Besuchsgrund)
- **Check-out:** Auschecken von Besuchern mit automatischer Zeitstempelung
- **Datenfelder:**
  - Name (Pflichtfeld)
  - Firma (optional)
  - Ansprechpartner (Pflichtfeld)
  - Besuchsgrund (Pflichtfeld)
  - Ausweis-Nr. (optional)
  - Check-in Zeit (automatisch)
  - Check-out Zeit (automatisch)
  - Status (checked-in/checked-out)

### 2. Statistiken
Die Stats-Komponente zeigt in Echtzeit:
- Gesamtanzahl der Besucher heute
- Anzahl anwesender Besucher (checked-in)
- Anzahl ausgecheckter Besucher (checked-out)

### 3. Such- und Filterfunktion
- Suche nach Name, Firma oder Ansprechpartner
- Filter nach Status (alle, checked-in, checked-out)
- Echtzeit-Filterung während der Eingabe

### 4. Datenspeicherung
- **LocalStorage:** Persistente Speicherung der Besucherdaten im Browser
- **Storage Key:** 'visitor-management-data'
- Automatisches Laden beim Start und Speichern bei Änderungen

## Verfügbare NPM-Skripte

```bash
npm run dev      # Startet Entwicklungsserver (mit HMR)
npm run build    # Erstellt Production Build
npm run lint     # Führt ESLint-Prüfung durch
npm run preview  # Vorschau des Production Builds
```

## Datenmodell

### Visitor Object
```javascript
{
  id: number,              // Eindeutige ID (Timestamp)
  name: string,            // Besuchername
  company: string,         // Firma (optional)
  contactPerson: string,   // Ansprechpartner im Unternehmen
  reason: string,          // Besuchsgrund
  badge: string,           // Ausweisnummer (optional)
  checkInTime: string,     // ISO-Zeitstempel
  checkOutTime: string,    // ISO-Zeitstempel oder null
  status: 'checked-in' | 'checked-out'
}
```

## State Management

Die App verwendet React Hooks für State Management:
- **useState:** Für lokale Komponenten-States und globalen Visitors-State
- **useEffect:** Für LocalStorage-Synchronisation
- **Props:** Für Datenweitergabe zwischen Komponenten

### Hauptzustände in App.jsx
- `visitors`: Array aller Besucher
- `searchTerm`: Aktueller Suchbegriff
- `filter`: Aktueller Status-Filter ('all', 'checked-in', 'checked-out')

## UI/UX Design

### Styling-Ansatz
- **Tailwind CSS:** Utility-First-Ansatz für konsistentes Design
- **Responsive Design:** Grid-Layout passt sich an Bildschirmgröße an
- **Farbschema:**
  - Primärfarbe: Blau (#3B82F6)
  - Erfolgsfarbe: Grün (für anwesende Besucher)
  - Hintergrund: Grau (#F3F4F6)
  - Cards: Weiß mit Schatten

### Komponenten-Hierarchie
```
App
├── Header
├── Stats
├── VisitorForm
├── SearchBar
├── VisitorList
│   └── VisitorCard (mehrfach)
└── Footer
```

## Entwicklungsrichtlinien

### Code-Stil
- **Komponenten:** Funktionale Komponenten mit Hooks
- **Dateinamenskonvention:** PascalCase für Komponenten (.jsx)
- **Export:** Default Exports für Komponenten
- **Sprache:** Deutsche Strings für UI, englische Variablennamen

### Best Practices
1. **Formularvalidierung:** Prüfung der Pflichtfelder vor Submission
2. **Immutable Updates:** Verwendung von Spread-Operator für State-Updates
3. **Key Props:** Eindeutige IDs für Listen-Rendering
4. **Controlled Components:** Alle Formulare sind kontrollierte Komponenten

### Potenzielle Verbesserungen
- TypeScript-Migration für bessere Typsicherheit
- Backend-Integration (aktuell nur LocalStorage)
- Export-Funktion für Besucherdaten
- Datumsbereichsfilter
- Besucherfotos
- Druckfunktion für Besucherausweise
- Mehrsprachigkeit (i18n)
- Dark Mode
- Unit Tests (z.B. mit Vitest)

## Wichtige Hinweise für AI-Assistenten

### Bei Änderungen beachten
1. **Sprache:** UI-Texte müssen auf Deutsch bleiben
2. **Datenstruktur:** Visitor-Objekt-Schema beibehalten für LocalStorage-Kompatibilität
3. **LocalStorage Key:** 'visitor-management-data' nicht ändern
4. **Responsive Design:** Tailwind-Breakpoints beachten (md:, lg:)

### Häufige Aufgaben
- **Neue Felder hinzufügen:**
  1. VisitorForm erweitern
  2. Datenmodell in App.jsx aktualisieren
  3. VisitorCard/VisitorList anpassen

- **Styling ändern:**
  1. Tailwind-Utility-Klassen verwenden
  2. Konsistenz mit bestehendem Farbschema wahren

- **Neue Features:**
  1. Komponente in src/components/ erstellen
  2. In App.jsx importieren und einbinden
  3. State-Management bei Bedarf erweitern

## Debugging und Fehlerbehebung

### Bekannte Einschränkungen
- **Datenpersistenz:** Daten sind browser-spezifisch (LocalStorage)
- **Mehrbenutzer:** Keine Synchronisation zwischen verschiedenen Geräten
- **Datenverlust:** Bei Browser-Cache-Löschung gehen Daten verloren
- **Zeitzone:** Timestamps in ISO-Format, aber keine explizite Zeitzonenbehandlung

### Häufige Fehlerquellen
1. **"Bitte füllen Sie alle Pflichtfelder aus":** Name, Ansprechpartner oder Besuchsgrund fehlt
2. **LocalStorage voll:** Browser-Limit erreicht (üblicherweise 5-10MB)
3. **Hydration Errors:** Vite HMR kann bei großen State-Änderungen Probleme haben

## Deployment

### Production Build
```bash
npm run build
```
Erstellt optimierte Dateien im `dist/` Verzeichnis.

### Hosting-Optionen
- Vercel (empfohlen für Vite-Projekte)
- Netlify
- GitHub Pages
- Beliebiger statischer Webserver

### Environment-spezifische Überlegungen
- Keine Umgebungsvariablen erforderlich
- Keine API-Keys oder Secrets
- Reine Client-Side-Anwendung

## Lizenz und Copyright

Footer-Text: "© [Jahr] Besuchermanagement System"

---

**Letzte Aktualisierung:** 2026-01-29
**Projekt-Version:** 0.0.0
**Erstellt von:** Claude (AI Assistant) im Auftrag von iMarcintosh
