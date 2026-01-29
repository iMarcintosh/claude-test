Lies zuerst die Coding Guidelines aus .github/claude-guidelines.md

FOKUS: Test Coverage Analyse

Analysiere die geänderten Dateien und prüfe:

1. **Fehlende Tests identifizieren:**
   - Welche neuen Components haben keine Tests?
   - Welche neuen Functions/Hooks sind nicht getestet?
   - Welche geänderten Logik braucht neue Test Cases?

2. **Test-Qualität prüfen (falls Tests vorhanden):**
   - Sind alle wichtigen User Interactions getestet?
   - Werden Edge Cases abgedeckt?
   - Sind Error States getestet?
   - Async Operations korrekt getestet?

3. **Empfehlungen geben:**
   - Liste Components/Functions die Tests brauchen
   - Schlage konkrete Test Cases vor
   - Priorisiere nach Wichtigkeit

Kommentiere mit konkreten Test-Vorschlägen im Code.