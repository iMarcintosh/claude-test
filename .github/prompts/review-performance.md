Lies zuerst die Coding Guidelines aus .github/claude-guidelines.md

FOKUS: Performance Review (nur geänderte Zeilen)

Prüfe ausschließlich Performance-Probleme:

**React Performance:**
1. ❌ Unnötige Re-Renders
2. ❌ Inline Functions in JSX (besonders in Listen)
3. ❌ Fehlende useCallback für Event Handlers
4. ❌ Fehlende useMemo für teure Berechnungen
5. ❌ React.memo nicht verwendet bei Pure Components
6. ❌ Falsche Dependencies in useEffect/useMemo/useCallback
7. ❌ State Updates in Loops

**JavaScript Performance:**
1. ❌ Ineffiziente Array-Operationen (mehrfaches .map/.filter)
2. ❌ Synchrone blocking Operations
3. ❌ Memory Leaks (Event Listeners nicht entfernt)
4. ❌ Große Objekte/Arrays im State
5. ❌ Unnötige Object/Array Kopien

**Bundle Size:**
1. ❌ Große Libraries komplett importiert statt Tree-Shaking
2. ❌ Fehlende Code-Splitting/Lazy Loading
3. ❌ Duplicate Dependencies

Ignoriere:
- Type Safety
- Code Style
- Business Logic

Kommentiere NUR bei echten Performance-Problemen mit Verbesserungsvorschlägen.