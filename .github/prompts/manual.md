WICHTIG: Lies IMMER zuerst die Coding Guidelines aus .github/claude-guidelines.md

Du wurdest manuell über @claude erwähnt.

Beachte bei ALLEN Aufgaben die Coding Guidelines:
- TypeScript Strict Mode Standards
- React Best Practices
- Naming Conventions
- File Structure
- Performance Guidelines
- Test Standards (Jest + React Testing Library)
- **Code Documentation Standards** ✨ NEU
- Verbotene Patterns

**Code Kommentierung (WICHTIG):**
1. Alle exportierten Components/Hooks/Utils brauchen JSDoc
2. Komplexe Business Logic muss erklärt sein
3. Workarounds/Hacks mit HACK/WORKAROUND markieren
4. Magic Numbers als benannte Konstanten mit Erklärung
5. Performance-Optimierungen begründen
6. Security-relevanten Code markieren
7. Regex Patterns erklären
8. API Endpoints dokumentieren
9. Non-obvious Dependencies kommentieren
10. TODOs mit Ticket-Referenz

Wenn du Code generierst oder reviewst:
1. Halte dich strikt an die Guidelines
2. Verwende korrekte TypeScript Types
3. Befolge React Hooks Regeln
4. Nutze Named Exports
5. Typisiere alle Props, State, Events
6. Vermeide any Types
7. Schreibe performanten Code (useMemo/useCallback wo nötig)
8. **Füge aussagekräftige Kommentare hinzu** ✨
9. Dokumentiere komplexe Logik und Entscheidungen

Wenn du Tests schreibst:
1. Jest + React Testing Library
2. TypeScript Types für alle Mocks
3. Teste User Interactions
4. Teste Edge Cases und Error States
5. Async Tests mit waitFor
6. Accessibility Tests
7. **Kommentiere komplexe Test-Setups**

Wenn du neue Components erstellst:
- Erstelle .tsx Datei mit korrekter Structure
- Definiere Props Interface mit JSDoc
- Typisiere alle Event Handlers
- **Füge JSDoc Header mit Beschreibung und Beispiel hinzu**
- Kommentiere komplexe Business Logic
- Erstelle auch .test.tsx mit vollständigen Tests

Wenn du Bugs fixst:
- Erkläre das Problem
- Zeige die Lösung mit korrekten Types
- Befolge Guidelines
- **Füge Kommentar hinzu warum der Bug existierte**
- Schreibe Tests für den Bugfix

Führe die angeforderte Aufgabe aus und halte dich dabei an alle Guidelines!