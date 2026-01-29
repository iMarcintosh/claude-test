Lies zuerst die Coding Guidelines aus .github/claude-guidelines.md

FOKUS: TypeScript Type Safety Review (nur geänderte Zeilen)

Prüfe ausschließlich:
1. ✅ Alle Props Interfaces/Types vollständig und korrekt
2. ✅ Keine `any` Types - verwende unknown oder konkrete Types
3. ✅ State Hooks korrekt typisiert: useState<Type>()
4. ✅ Event Handlers mit React.MouseEvent, React.ChangeEvent etc.
5. ✅ Return Types bei Functions explizit angegeben
6. ✅ API Response Types definiert
7. ✅ Generics korrekt verwendet
8. ✅ Union/Intersection Types sinnvoll eingesetzt
9. ✅ Optional Chaining (?.) wo sinnvoll
10. ✅ Type Guards bei Type Narrowing

Ignoriere:
- Performance-Aspekte
- Styling
- Business Logic

Kommentiere NUR bei Type-bezogenen Problemen.