Lies zuerst die Coding Guidelines aus .github/claude-guidelines.md

AUFGABE: Automatisch Tests schreiben

Für alle neuen/geänderten Components und Functions:

**1. Erstelle Test-Dateien:**
```
src/components/Button/Button.tsx
→ src/components/Button/Button.test.tsx

src/hooks/useAuth.ts
→ src/hooks/useAuth.test.ts
```

**2. Test-Framework Setup:**
- Jest + React Testing Library (@testing-library/react)
- TypeScript Types für alle Mocks
- Setup/Teardown für jeden Test

**3. Test-Struktur:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render with correct label', () => {
    render(<Button label="Click me" onClick={jest.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={jest.fn()} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

**4. Was zu testen:**

**Components:**
- ✅ Rendering mit verschiedenen Props
- ✅ User Interactions (Click, Input, etc.)
- ✅ Conditional Rendering
- ✅ Error States
- ✅ Loading States
- ✅ Accessibility (ARIA, Keyboard Navigation)

**Hooks:**
- ✅ Initial State
- ✅ State Updates
- ✅ Side Effects (useEffect)
- ✅ Cleanup Functions
- ✅ Error Handling

**Utils/Functions:**
- ✅ Happy Path
- ✅ Edge Cases (null, undefined, empty)
- ✅ Error Cases
- ✅ Type Safety

**5. TypeScript in Tests:**
```typescript
// Mock Functions typisieren
const mockFn = jest.fn<void, [string]>();

// Component Props typisieren
const props: ButtonProps = {
  label: 'Test',
  onClick: jest.fn()
};

// Custom Matchers typisieren
expect<HTMLButtonElement>(
  screen.getByRole('button')
).toBeDisabled();
```

**6. Async Testing:**
```typescript
it('should fetch and display user data', async () => {
  render(<UserProfile userId="123" />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

**7. Mock Setup:**
```typescript
// API Mocks
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => 
    Promise.resolve({ id: '1', name: 'John' })
  )
}));

// React Router Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));
```

Erstelle vollständige Test-Dateien für alle Components/Hooks/Utils die keine Tests haben.
Folge dabei strikt den Coding Guidelines und TypeScript Standards.