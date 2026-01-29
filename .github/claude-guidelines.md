# Coding Guidelines für TypeScript React Reviews

## TypeScript Best Practices
- Strikte TypeScript Config (strict: true, noImplicitAny: true)
- Explizite Typen für alle Props, State und Return Values
- Keine `any` Types - verwende `unknown` wenn nötig
- Interfaces für Props und Objekt-Strukturen
- Type statt Interface für Unions/Intersections
- Generics für wiederverwendbare Components

## React Best Practices
- Nur funktionale Components mit Hooks
- Custom Hooks für wiederverwendbare Logik (useXyz)
- Typed Event Handlers: React.MouseEvent, React.ChangeEvent
- FC<Props> für Component Types (oder function Component(props: Props))

## Code Style
- Named Exports statt Default Exports
- Destructuring für Props mit Type Annotation
- Ternary statt if/else für JSX conditionals
- Optional Chaining (?.) und Nullish Coalescing (??)

## Naming Conventions
- Components: PascalCase
- Functions/Variables: camelCase
- Types/Interfaces: PascalCase mit `I` Prefix für Interfaces (optional)
- Event Handlers: handleXyz
- Boolean Props: isXyz, hasXyz, shouldXyz
- Type Files: *.types.ts oder *.d.ts

## File Structure
```
src/
  components/
    Button/
      Button.tsx
      Button.types.ts
      Button.module.css
  hooks/
    useAuth.ts
  types/
    api.types.ts
  utils/
    helpers.ts
```

## Props Definition
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => { ... }

// ❌ Bad
const Button = (props: any) => { ... }
```

## State & Hooks
```typescript
// ✅ Good - Typed State
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState<number>(0);

// ✅ Good - Typed useEffect
useEffect(() => {
  // cleanup return type is void
  return () => { cleanup(); };
}, [dependency]);

// ✅ Good - Custom Hook with Return Type
const useAuth = (): { user: User | null; login: () => void } => {
  // ...
}

// ❌ Bad
const [data, setData] = useState(null); // Implizit any
```

## Performance
- useMemo für teure Berechnungen mit korrekten Types
- useCallback für Event Handlers mit typed Parameters
- React.memo nur wenn nötig, mit typed Props
- Lazy Loading: React.lazy() mit Suspense

## Error Handling
```typescript
// ✅ Good - Typed Error
try {
  await fetchData();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}

// ✅ Good - Error Boundaries mit TypeScript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
```

## API & Async
```typescript
// ✅ Good - Typed API Response
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

## Forms
```typescript
// ✅ Good - Typed Form Events
const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
  // ...
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  setValue(event.target.value);
}
```

## Verboten
- ❌ Keine `any` Types ohne guten Grund
- ❌ Keine Type Assertions (`as`) wenn vermeidbar
- ❌ Keine inline Functions in JSX bei Listen
- ❌ Kein direktes DOM Manipulation
- ❌ Keine `var`, nur `const`/`let`
- ❌ Keine untyped Event Handlers
- ❌ Keine @ts-ignore ohne Kommentar warum

## TypeScript Specific Checks
- Alle Props sind typisiert
- Return Types für Functions sind explizit
- Keine impliziten any Types
- Generics werden korrekt verwendet
- Union Types statt Enums für einfache Werte
- Strict Null Checks sind erfüllt