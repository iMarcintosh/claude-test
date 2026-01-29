# Claude GitHub Integration - Praktische Beispiele

Eine umfassende Sammlung von Beispielen für die Verwendung von Claude in GitHub mit automatischen Code Reviews, Tests und mehr.

## Inhaltsverzeichnis

1. [Label-basierte Automatische Reviews](#label-basierte-automatische-reviews)
2. [Manuelle @claude Befehle](#manuelle-claude-befehle)
3. [Test-Automatisierung](#test-automatisierung)
4. [Best Practices](#best-practices)

---

## Label-basierte Automatische Reviews

### 1. Full Review (`full-review` Label)

**Szenario:** Großer PR mit vielen Änderungen - komplette Codebase-Überprüfung

```
PR: "Feature: Complete User Dashboard Refactor"

Änderungen:
- 15 Components umgebaut
- Neue State Management Logik
- API Integration überarbeitet
- src/components/Dashboard.tsx
- src/components/UserProfile.tsx
- src/components/Sidebar.tsx
- src/api/users.ts
- src/hooks/useUserData.ts

📋 Action: Label "full-review" hinzufügen

🤖 Claude prüft:
✅ Alle Components auf Type Safety
✅ Gesamte Architektur auf Best Practices
✅ Performance über alle Dateien
✅ Accessibility in allen Components
✅ Konsistenz der Naming Conventions
✅ Code Documentation Vollständigkeit

📝 Claude Kommentare (Beispiele):

In UserProfile.tsx Zeile 45:
"Props Interface fehlt JSDoc Dokumentation und Beispiel.
Füge hinzu:

/**
 * User profile component with edit capabilities
 * 
 * @component
 * @example
 * ```tsx
 * <UserProfile 
 *   userId="123"
 *   onUpdate={handleUpdate}
 * />
 * ```
 */
interface UserProfileProps {
  /** User ID to load profile data */
  userId: string;
  /** Callback fired when profile is updated */
  onUpdate: (user: User) => void;
}"

In Dashboard.tsx Zeile 120:
"⚡ Performance: Teure filter/sort Operation ohne Memoization.

// ❌ Aktuell - Re-berechnet bei jedem Render
const filteredUsers = users
  .filter(u => u.active)
  .sort((a, b) => a.name.localeCompare(b.name));

// ✅ Optimiert mit useMemo
const filteredUsers = useMemo(() => {
  return users
    .filter(u => u.active)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [users]);"

In api/users.ts Zeile 33:
"📝 Type Safety: Return Type sollte explizit sein.

// ❌ Impliziter Return Type
const fetchUser = async (id: string) => {
  return await fetch(`/api/users/${id}`).then(r => r.json());
}

// ✅ Expliziter Return Type + JSDoc
/**
 * Fetch user profile by ID
 * 
 * @param id - User UUID
 * @returns User profile data
 * @throws {NotFoundError} If user doesn't exist
 */
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new NotFoundError();
  return response.json();
}"
```

---

### 2. TypeScript Types Focus (`review-types` Label)

**Szenario:** Neue API Integration - Fokus auf Type Safety

```
PR: "Add User Profile API Integration"

Geänderte Dateien:
- src/api/userProfile.ts (neu)
- src/types/user.types.ts (neu)
- src/components/UserProfile.tsx (geändert)

Code-Beispiel (user.types.ts):
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  address: Address;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  country: string;
}
```

📋 Action: Label "review-types" hinzufügen

🤖 Claude prüft NUR:
✅ API Response Types vollständig
✅ Props Interfaces korrekt
✅ State Types explizit
✅ Event Handler Types (React.MouseEvent etc.)
✅ Keine any Types
✅ JSDoc für alle Interfaces

❌ Ignoriert:
- Performance (z.B. fehlende useMemo)
- Styling
- Business Logic

📝 Claude Kommentare:

user.types.ts Zeile 6:
"📝 Type Problem: 'address' sollte optional sein, da API es manchmal nicht zurückgibt.

// ❌ Required - fehlt bei manchen Users
address: Address;

// ✅ Optional - spiegelt API Realität
address?: Address;

Außerdem fehlt JSDoc:

/**
 * User profile data structure
 * 
 * Matches API response from GET /api/users/:id
 */
export interface User {
  /** Unique user identifier (UUID v4) */
  id: string;
  /** Full display name */
  name: string;
  /** Primary email address */
  email: string;
  /** Postal address (optional, not all users have completed profile) */
  address?: Address;
  /** Account creation timestamp */
  createdAt: Date;
}"

userProfile.ts Zeile 25:
"📝 Missing Return Type und Error Handling

// ❌ Aktuell
export const fetchUserProfile = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

// ✅ Mit Types und Error Handling
/**
 * Fetch user profile from API
 * 
 * @param userId - User UUID
 * @returns User profile data
 * @throws {AuthError} If not authenticated
 * @throws {NotFoundError} If user doesn't exist
 */
export const fetchUserProfile = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);
  
  if (!response.ok) {
    if (response.status === 401) throw new AuthError();
    if (response.status === 404) throw new NotFoundError();
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
}"

UserProfile.tsx Zeile 40:
"📝 Event Handler braucht korrekten Type

// ❌ any Type
const handleChange = (e: any) => {
  setValue(e.target.value);
}

// ✅ Korrekter React Event Type
const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setValue(e.target.value);
}"
```

---

### 3. Performance Focus (`review-performance` Label)

**Szenario:** App Performance-Probleme nach Feature-Update

```
PR: "Add Real-time Data Updates"

Geänderte Dateien:
- src/components/DataTable.tsx
- src/hooks/useRealTimeData.ts
- src/components/Chart.tsx

Code-Beispiel (DataTable.tsx):
```typescript
export const DataTable: React.FC<DataTableProps> = ({ data, onRowClick }) => {
  return (
    <table>
      <tbody>
        {data.map(row => (
          <tr key={row.id} onClick={() => onRowClick(row.id)}>
            <td>{row.name}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

📋 Action: Label "review-performance" hinzufügen

🤖 Claude prüft NUR:
✅ Unnötige Re-Renders
✅ Fehlende Memoization
✅ Ineffiziente Array-Operationen
✅ Memory Leaks
✅ Bundle Size Probleme

❌ Ignoriert:
- Type Safety
- Code Style

📝 Claude Kommentare:

DataTable.tsx Zeile 67:
"⚠️ PERFORMANCE PROBLEM: Inline Function in .map()

Problem:
Bei jedem Parent Re-Render wird eine neue onClick Function für
JEDE Row erstellt. Bei 1000 Rows = 1000 neue Functions!

// ❌ Aktuell - Causiert unnötige Re-Renders
{data.map(row => (
  <tr onClick={() => onRowClick(row.id)}>
    <td>{row.name}</td>
  </tr>
))}

// ✅ Lösung: useCallback + Stable Handler
const DataTable: React.FC<DataTableProps> = ({ data, onRowClick }) => {
  const handleRowClick = useCallback((id: string) => {
    onRowClick(id);
  }, [onRowClick]);

  return (
    <table>
      {data.map(row => (
        <tr key={row.id} onClick={() => handleRowClick(row.id)}>
          <td>{row.name}</td>
        </tr>
      ))}
    </table>
  );
};

// ✅ Noch besser: Separate Row Component mit memo
const TableRow = memo<TableRowProps>(({ row, onClick }) => (
  <tr onClick={() => onClick(row.id)}>
    <td>{row.name}</td>
  </tr>
));

const DataTable: React.FC<DataTableProps> = ({ data, onRowClick }) => {
  return (
    <table>
      {data.map(row => (
        <TableRow key={row.id} row={row} onClick={onRowClick} />
      ))}
    </table>
  );
};"

useRealTimeData.ts Zeile 34:
"⚠️ MEMORY LEAK: WebSocket wird nicht geschlossen!

Problem:
WebSocket Connection bleibt offen auch nach Component unmount.
Bei jedem Mount/Unmount Cycle (z.B. Navigation) entsteht ein neuer Leak.

// ❌ Aktuell - Memory Leak
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = (event) => {
    setData(JSON.parse(event.data));
  };
}, [url]);

// ✅ Lösung: Cleanup Function
useEffect(() => {
  const ws = new WebSocket(url);
  
  ws.onmessage = (event) => {
    setData(JSON.parse(event.data));
  };
  
  // Cleanup: Schließe WebSocket bei unmount
  return () => {
    ws.close();
  };
}, [url]);

// ✅ Noch besser: Mit Error Handling
useEffect(() => {
  const ws = new WebSocket(url);
  let isActive = true;
  
  ws.onmessage = (event) => {
    // Prevent state update on unmounted component
    if (isActive) {
      setData(JSON.parse(event.data));
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return () => {
    isActive = false;
    ws.close();
  };
}, [url]);"

Chart.tsx Zeile 89:
"⚠️ PERFORMANCE: Teure Berechnung ohne Memoization

Problem:
chartData wird bei JEDEM Render neu berechnet, auch wenn
data Array sich nicht geändert hat.

// ❌ Aktuell - Re-berechnet bei jedem Render
const Chart: React.FC<ChartProps> = ({ data }) => {
  // Diese Berechnung läuft bei JEDEM Render
  const chartData = data.map(item => ({
    x: new Date(item.timestamp).getTime(),
    y: calculateComplexValue(item), // Teuer!
  }));
  
  return <LineChart data={chartData} />;
};

// ✅ Lösung: useMemo
const Chart: React.FC<ChartProps> = ({ data }) => {
  /**
   * Memoized chart data transformation
   * 
   * PERFORMANCE: calculateComplexValue ist O(n²)
   * Nur neu berechnen wenn data sich ändert
   */
  const chartData = useMemo(() => {
    return data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: calculateComplexValue(item),
    }));
  }, [data]);
  
  return <LineChart data={chartData} />;
};"
```

---

### 4. Types + Performance Combined

**Szenario:** Production-kritischer PR - beide Aspekte wichtig

```
PR: "Optimize Checkout Flow for Production Launch"

Geänderte Dateien:
- src/pages/Checkout.tsx
- src/hooks/usePayment.ts
- src/api/payment.ts

📋 Action: Labels "review-types" + "review-performance" hinzufügen

🤖 Claude prüft beides:
✅ Type Safety UND Performance zusammen
✅ Kombinierte Probleme werden hervorgehoben

📝 Claude Kommentare:

payment.ts Zeile 23:
"📝 Type + ⚡ Performance Problem:

// ❌ Mehrere Probleme
const processPayment = async (data) => {
  const result = await fetch('/api/payment', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(r => r.json());
  return result;
}

Probleme:
1. 📝 TYPE: Fehlender Return Type → Promise<PaymentResponse>
2. 📝 TYPE: Parameter 'data' hat any Type
3. ⚡ PERF: Synchrones fetch blockiert UI Thread
4. 📝 TYPE: Fehlendes Error Handling mit Types

// ✅ Lösung mit Types + Performance
/**
 * Process payment transaction
 * 
 * PERFORMANCE: Async operation with proper error handling
 * to prevent UI blocking
 * 
 * @param data - Payment details
 * @returns Payment confirmation
 * @throws {PaymentError} If payment processing fails
 */
const processPayment = async (
  data: PaymentData
): Promise<PaymentResponse> => {
  try {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new PaymentError('Payment processing failed');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof PaymentError) throw error;
    throw new PaymentError('Network error during payment');
  }
};"

Checkout.tsx Zeile 156:
"📝 Type + ⚡ Performance Problem:

// ❌ Probleme
const Checkout = () => {
  const [cart, setCart] = useState([]);
  
  // Läuft bei jedem Render!
  const total = cart.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );
  
  return <div>Total: ${total}</div>;
};

Probleme:
1. 📝 TYPE: cart State hat any[] Type statt CartItem[]
2. ⚡ PERF: Total wird bei jedem Render neu berechnet
3. 📝 TYPE: useState braucht Generic Type

// ✅ Lösung
const Checkout: React.FC = () => {
  // ✅ Typed State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  /**
   * Memoized cart total calculation
   * 
   * PERFORMANCE: Prevents re-calculation on every render
   * Only recalculates when cart contents change
   */
  const total = useMemo(() => {
    return cart.reduce((sum, item) => 
      sum + item.price * item.quantity, 0
    );
  }, [cart]);
  
  return <div>Total: ${total.toFixed(2)}</div>;
};"
```

---

### 5. Test Coverage Check (`needs-tests` Label)

**Szenario:** Neues Feature - welche Tests fehlen?

```
PR: "Add User Authentication Flow"

Neue Dateien:
- src/components/LoginForm.tsx
- src/components/RegisterForm.tsx
- src/hooks/useAuth.ts
- src/utils/validation.ts
- src/utils/validation.test.ts (nur validateEmail getestet)

📋 Action: Label "needs-tests" hinzufügen

🤖 Claude analysiert Test-Coverage:

📝 Claude Antwort als PR Comment:

"🧪 **Test Coverage Analyse**

## Fehlende Tests

### 1. 🔴 LoginForm.tsx - KEINE Tests vorhanden
**Priorität: HOCH** (Kritischer User Flow)

Empfohlene Test Cases:
```typescript
describe('LoginForm', () => {
  // Rendering Tests
  it('should render email and password fields');
  it('should render submit button');
  it('should show "Remember Me" checkbox');
  
  // Validation Tests
  it('should show error when email is empty');
  it('should show error when email format is invalid');
  it('should show error when password is empty');
  it('should show error when password is too short');
  
  // Interaction Tests
  it('should call onSubmit with correct data on form submit');
  it('should not call onSubmit if form is invalid');
  it('should disable submit button during submission');
  
  // State Tests
  it('should show loading spinner during login');
  it('should show error message on failed login');
  it('should clear error message when user types');
  
  // Edge Cases
  it('should handle Enter key press on password field');
  it('should not submit form multiple times (double-click protection)');
}
```

**Geschätzte Test-Abdeckung nach Implementation: ~85%**

---

### 2. 🔴 RegisterForm.tsx - KEINE Tests vorhanden
**Priorität: HOCH** (Kritischer User Flow)

Empfohlene Test Cases:
```typescript
describe('RegisterForm', () => {
  // Validation Tests
  it('should validate email format');
  it('should require password minimum length (8 chars)');
  it('should require password confirmation match');
  it('should validate terms acceptance');
  
  // Interaction Tests
  it('should call onRegister with user data');
  it('should show password strength indicator');
  it('should toggle password visibility');
  
  // API Integration
  it('should handle duplicate email error from API');
  it('should handle network errors gracefully');
}
```

---

### 3. 🔴 useAuth.ts - KEINE Tests vorhanden
**Priorität: KRITISCH** (Core Business Logic)

Empfohlene Test Cases:
```typescript
describe('useAuth Hook', () => {
  // Initial State
  it('should initialize with null user');
  it('should check for saved token on mount');
  it('should restore user session from localStorage');
  
  // Login Flow
  it('should set user after successful login');
  it('should save token to localStorage');
  it('should set loading state during login');
  it('should set error on failed login');
  
  // Logout Flow
  it('should clear user on logout');
  it('should remove token from localStorage');
  it('should redirect to login page');
  
  // Token Refresh
  it('should refresh token before expiration');
  it('should logout if refresh fails');
  
  // Cleanup
  it('should cleanup intervals on unmount');
  it('should abort pending requests on unmount');
}
```

**Geschätzte Test-Abdeckung nach Implementation: ~90%**

---

### 4. 🟡 validation.ts - TEILWEISE getestet
**Priorität: MITTEL** (Nur validateEmail hat Tests)

Fehlende Test Cases:
```typescript
describe('validation.ts', () => {
  describe('validatePassword', () => {
    // Aktuell NICHT getestet!
    it('should reject passwords shorter than 8 characters');
    it('should require at least one uppercase letter');
    it('should require at least one number');
    it('should require at least one special character');
    it('should accept valid strong passwords');
  });
  
  describe('validateConfirmPassword', () => {
    // Aktuell NICHT getestet!
    it('should return error if passwords do not match');
    it('should return null if passwords match');
    it('should handle empty strings');
  });
});
```

---

## Zusammenfassung

**Gesamt Test-Coverage:**
- Aktuell: ~10% (nur validateEmail)
- Nach Implementierung aller Tests: ~85%

**Priorisierung:**
1. 🔴 **KRITISCH:** useAuth.ts (Core Business Logic)
2. 🔴 **HOCH:** LoginForm.tsx (Critical User Journey)
3. 🔴 **HOCH:** RegisterForm.tsx (Critical User Journey)
4. 🟡 **MITTEL:** validation.ts (Vervollständigung)

**Empfehlung:**
Implementiere zuerst Tests für useAuth.ts und LoginForm.tsx,
da diese den kritischsten Teil des Authentication Flows abdecken.

**Nächste Schritte:**
Füge Label 'write-tests' hinzu, damit ich automatisch
die Test-Dateien erstellen kann. ✨
"
```

---

### 6. Write Tests Automatically (`write-tests` Label)

**Szenario:** Automatische Test-Generierung

```
PR: "Add Search Functionality"

Neue Dateien ohne Tests:
- src/components/SearchBar.tsx
- src/hooks/useSearch.ts

📋 Action: Label "write-tests" hinzufügen

🤖 Claude erstellt automatisch:

📝 Branch wird aktualisiert mit neuen Dateien:

**1. src/components/SearchBar.test.tsx**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn<void, [string]>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input with placeholder', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(
        <SearchBar 
          onSearch={mockOnSearch} 
          placeholder="Search users..." 
        />
      );
      
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
    });

    it('should not show clear button when input is empty', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('should show clear button when input has value', () => {
      render(<SearchBar onSearch={mockOnSearch} initialValue="test" />);
      
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update input value when user types', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      await user.type(input, 'test query');
      
      expect(input.value).toBe('test query');
    });

    it('should call onSearch with debounced value', async () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Should not call immediately
      expect(mockOnSearch).not.toHaveBeenCalled();
      
      // Wait for debounce
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      }, { timeout: 500 });
      
      // Should only be called once
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it('should clear input when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      await user.type(input, 'test');
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      expect(input.value).toBe('');
    });

    it('should call onSearch with empty string when cleared', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} debounceMs={0} />);
      
      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'test');
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      });
      
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('');
      });
    });
  });

  describe('Keyboard Interactions', () => {
    it('should trigger search on Enter key', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} debounceMs={0} />);
      
      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'test{Enter}');
      
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });

    it('should clear on Escape key', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      await user.type(input, 'test{Escape}');
      
      expect(input.value).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid typing without multiple calls', async () => {
      const user = userEvent.setup();
      render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);
      
      const input = screen.getByPlaceholderText('Search...');
      
      // Type rapidly
      await user.type(input, 'test query');
      
      // Should only call once after debounce
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('test query');
      }, { timeout: 500 });
    });

    it('should handle empty string gracefully', async () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={0} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: '' } });
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('');
      });
    });

    it('should trim whitespace before searching', async () => {
      render(<SearchBar onSearch={mockOnSearch} debounceMs={0} />);
      
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: '  test  ' } });
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<SearchBar onSearch={mockOnSearch} ariaLabel="Search users" />);
      
      const input = screen.getByLabelText('Search users');
      expect(input).toBeInTheDocument();
    });

    it('should be focusable', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Search...');
      input.focus();
      
      expect(input).toHaveFocus();
    });
  });
});
```

**2. src/hooks/useSearch.test.ts**

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch } from './useSearch';

describe('useSearch Hook', () => {
  const mockFetchFn = jest.fn<Promise<SearchResult[]>, [string]>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty query', () => {
      const { result } = renderHook(() => useSearch({ fetchFn: mockFetchFn }));
      
      expect(result.current.query).toBe('');
      expect(result.current.results).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should initialize with provided query', () => {
      const { result } = renderHook(() => 
        useSearch({ 
          fetchFn: mockFetchFn,
          initialQuery: 'test' 
        })
      );
      
      expect(result.current.query).toBe('test');
    });
  });

  describe('Search Functionality', () => {
    it('should update query and fetch results', async () => {
      const mockResults: SearchResult[] = [
        { id: '1', title: 'Result 1' },
        { id: '2', title: 'Result 2' }
      ];
      mockFetchFn.mockResolvedValue(mockResults);
      
      const { result } = renderHook(() => useSearch({ fetchFn: mockFetchFn }));
      
      act(() => {
        result.current.setQuery('test');
      });
      
      expect(result.current.query).toBe('test');
      expect(result.current.loading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.results).toEqual(mockResults);
        expect(mockFetchFn).toHaveBeenCalledWith('test');
      });
    });

    it('should not fetch if query is empty', async () => {
      const { result } = renderHook(() => useSearch({ fetchFn: mockFetchFn }));
      
      act(() => {
        result.current.setQuery('');
      });
      
      await waitFor(() => {
        expect(mockFetchFn).not.toHaveBeenCalled();
        expect(result.current.results).toEqual([]);
      });
    });

    it('should debounce search requests', async () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => 
        useSearch({ 
          fetchFn: mockFetchFn,
          debounceMs: 300 
        })
      );
      
      // Type quickly
      act(() => {
        result.current.setQuery('t');
      });
      act(() => {
        result.current.setQuery('te');
      });
      act(() => {
        result.current.setQuery('tes');
      });
      act(() => {
        result.current.setQuery('test');
      });
      
      // Should not have called yet
      expect(mockFetchFn).not.toHaveBeenCalled();
      
      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Should only call once with final value
      await waitFor(() => {
        expect(mockFetchFn).toHaveBeenCalledTimes(1);
        expect(mockFetchFn).toHaveBeenCalledWith('test');
      });
      
      jest.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should handle search errors', async () => {
      const errorMessage = 'Search failed';
      mockFetchFn.mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useSearch({ fetchFn: mockFetchFn }));
      
      act(() => {
        result.current.setQuery('test');
      });
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.results).toEqual([]);
      });
    });

    it('should clear error on successful search', async () => {
      // First search fails
      mockFetchFn.mockRejectedValueOnce(new Error('Search failed'));
      
      const { result } = renderHook(() => useSearch({ fetchFn: mockFetchFn }));
      
      act(() => {
        result.current.setQuery('test1');
      });
      
      await waitFor(() => {
        expect(result.current.error).toBe('Search failed');
      });
      
      // Second search succeeds
      mockFetchFn.mockResolvedValue([{ id: '1', title: 'Result' }]);
      
      act(() => {
        result.current.setQuery('test2');
      });
      
      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.results).toHaveLength(1);
      });
    });
  });

  describe('Clear Functionality', () => {
    it('should clear results and query', async () => {
      mockFetchFn.mockResolvedValue([{ id: '1', title: 'Result' }]);
      
      const { result } = renderHook(() => useSearch({ fetchFn: mockFetchFn }));
      
      act(() => {
        result.current.setQuery('test');
      });
      
      await waitFor(() => {
        expect(result.current.results).toHaveLength(1);
      });
      
      act(() => {
        result.current.clear();
      });
      
      expect(result.current.query).toBe('');
      expect(result.current.results).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Cleanup', () => {
    it('should abort pending requests on unmount', async () => {
      const { result, unmount } = renderHook(() => 
        useSearch({ fetchFn: mockFetchFn })
      );
      
      act(() => {
        result.current.setQuery('test');
      });
      
      // Unmount before request completes
      unmount();
      
      // Should not update state after unmount
      await waitFor(() => {
        expect(mockFetchFn).toHaveBeenCalled();
      });
    });
  });
});
```

📝 Claude Comment im PR:

"✅ Tests erfolgreich erstellt!

**Neue Dateien:**
- ✅ src/components/SearchBar.test.tsx (18 Test Cases)
- ✅ src/hooks/useSearch.test.ts (12 Test Cases)

**Test Coverage:**
- SearchBar Component: ~95%
- useSearch Hook: ~90%

**Getestete Funktionalität:**
✅ Rendering mit verschiedenen Props
✅ User Interactions (Typing, Clear, Enter)
✅ Debouncing
✅ Error Handling
✅ Keyboard Shortcuts
✅ Accessibility
✅ Edge Cases
✅ Cleanup auf Unmount

Alle Tests folgen den Coding Guidelines:
- TypeScript Types für Mocks
- JSDoc Kommentare wo nötig
- Descriptive Test Names
- Proper Setup/Teardown

Branch wurde aktualisiert. Tests können mit `npm test` ausgeführt werden. 🎉"
```

---

### 7. Changes Only - Default (kein Label)

**Szenario:** Kleiner Bugfix - nur geänderte Zeilen prüfen

```
PR: "Fix: Update Avatar Upload Type"

Geänderte Dateien:
- src/components/Avatar.tsx

Git Diff:
```diff
- const handleUpload = (file: any) => {
+ const handleUpload = (file: File) => {
    if (!file) return;
+   
+   // Validate file size (max 5MB)
+   if (file.size > 5 * 1024 * 1024) {
+     setError('File size must be less than 5MB');
+     return;
+   }
+   
+   // Validate file type
+   if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
+     setError('Only JPEG, PNG and WebP images are supported');
+     return;
+   }
    
    uploadAvatar(file);
  };
```

📋 Action: Kein Label (automatisches Default Review nur der Änderungen)

🤖 Claude prüft NUR die geänderten Zeilen

📝 Claude Kommentare:

Avatar.tsx Zeile 45:
"✅ Gute Verbesserung!

**Type Safety:**
✅ Type von 'any' zu 'File' geändert - korrekt!
✅ File size Validierung hinzugefügt
✅ MIME type Validierung hinzugefügt

**Zusätzliche Empfehlungen:**

1. Magic Numbers als Konstanten:
```typescript
/**
 * Maximum allowed avatar file size in bytes
 * Limit: 5MB to prevent server overload
 */
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Allowed image MIME types for avatar upload
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

const handleUpload = (file: File): void => {
  if (!file) return;
  
  if (file.size > MAX_AVATAR_SIZE) {
    setError('File size must be less than 5MB');
    return;
  }
  
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    setError('Only JPEG, PNG and WebP images are supported');
    return;
  }
  
  uploadAvatar(file);
};
```

2. Test für neue Validierung:
```typescript
it('should reject files larger than 5MB', () => {
  const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
    type: 'image/jpeg'
  });
  
  render(<Avatar onUpload={mockUpload} />);
  const input = screen.getByLabelText('Upload avatar');
  
  fireEvent.change(input, { target: { files: [largeFile] } });
  
  expect(screen.getByText('File size must be less than 5MB')).toBeInTheDocument();
  expect(mockUpload).not.toHaveBeenCalled();
});
```"
```

---

## Manuelle @claude Befehle

### 8. @claude in Issue - Neues Feature

**Szenario:** Feature Request über Issue

```
Issue #42: "Add Dark Mode Support"

User Kommentar:
@claude erstelle eine DarkModeToggle Component mit:
- Toggle Switch UI (like iOS)
- useContext für global Theme State
- LocalStorage persistence
- TypeScript Types
- Smooth transition animations
- Tests mit Jest

🤖 Claude Antwort:

"Ich erstelle die komplette Dark Mode Implementation gemäß unserer Guidelines! 🌙

**Erstelle Branch: `feature/dark-mode-support`**

---

## Neue Dateien:

### 1. src/contexts/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Theme options for the application
 */
type Theme = 'light' | 'dark';

/**
 * Theme context value shape
 */
interface ThemeContextValue {
  /** Current active theme */
  theme: Theme;
  /** Toggle between light and dark theme */
  toggleTheme: () => void;
  /** Set specific theme */
  setTheme: (theme: Theme) => void;
}

/**
 * Theme context for managing application-wide theme state
 * 
 * Provides theme state and methods to all child components
 * Persists theme selection to localStorage
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * LocalStorage key for theme persistence
 */
const THEME_STORAGE_KEY = 'app-theme';

/**
 * Get initial theme from localStorage or system preference
 */
const getInitialTheme = (): Theme => {
  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  
  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

/**
 * Theme Provider Props
 */
interface ThemeProviderProps {
  /** Child components that will have access to theme context */
  children: ReactNode;
}

/**
 * Theme Provider Component
 * 
 * Wraps app to provide theme state to all components
 * Handles localStorage persistence and system preference detection
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  /**
   * Update document class and localStorage when theme changes
   */
  useEffect(() => {
    // Update document class for CSS
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Persist to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context
 * 
 * @returns Theme context value
 * @throws Error if used outside ThemeProvider
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};
```

### 2. src/components/DarkModeToggle/DarkModeToggle.tsx
```typescript
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './DarkModeToggle.css';

/**
 * Dark Mode Toggle Component
 * 
 * iOS-style toggle switch for theme switching
 * Shows sun icon for light mode, moon icon for dark mode
 * Smooth animation transitions
 * 
 * @component
 * @example
 * ```tsx
 * <DarkModeToggle />
 * ```
 */
export const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      type="button"
    >
      <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
        <div className="toggle-thumb">
          {isDark ? (
            <MoonIcon className="toggle-icon" />
          ) : (
            <SunIcon className="toggle-icon" />
          )}
        </div>
      </div>
    </button>
  );
};

/** Sun icon for light mode */
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

/** Moon icon for dark mode */
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
```

### 3. src/components/DarkModeToggle/DarkModeToggle.css
```css
.dark-mode-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
}

.dark-mode-toggle:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 4px;
  border-radius: 24px;
}

.toggle-track {
  width: 60px;
  height: 32px;
  border-radius: 16px;
  position: relative;
  transition: background-color 0.3s ease;
}

.toggle-track.light {
  background-color: #e5e7eb;
}

.toggle-track.dark {
  background-color: #374151;
}

.toggle-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-track.light .toggle-thumb {
  transform: translateX(2px);
}

.toggle-track.dark .toggle-thumb {
  transform: translateX(30px);
}

.toggle-icon {
  color: #374151;
  transition: transform 0.3s ease;
}

.toggle-track.dark .toggle-icon {
  color: #fbbf24;
}

/* Smooth rotation animation */
.toggle-thumb:hover .toggle-icon {
  transform: rotate(20deg);
}
```

### 4. Tests erstellt:
- ✅ src/contexts/ThemeContext.test.tsx
- ✅ src/components/DarkModeToggle/DarkModeToggle.test.tsx

---

**Pull Request #67 erstellt:**
https://github.com/yourrepo/pull/67

**Features:**
✅ iOS-style Toggle Switch
✅ Context API für global State
✅ LocalStorage Persistence
✅ System Preference Detection
✅ Smooth Animations
✅ TypeScript strict Types
✅ Full JSDoc Documentation
✅ Accessibility (ARIA labels, keyboard)
✅ 95% Test Coverage

**Usage:**
```tsx
// 1. Wrap App in ThemeProvider
import { ThemeProvider } from './contexts/ThemeContext';

<ThemeProvider>
  <App />
</ThemeProvider>

// 2. Use DarkModeToggle anywhere
import { DarkModeToggle } from './components/DarkModeToggle';

<DarkModeToggle />

// 3. Access theme in components
import { useTheme } from './contexts/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();
  return <div className={theme}>...</div>;
};
```

Ready for Review! 🎉"
```

---

### 9. @claude in PR Comment - Bug Fix

**Szenario:** Bug in spezifischer Datei

```
PR #88: "Refactor Payment Form"

User kommentiert auf PaymentForm.tsx Zeile 67:
@claude dieser Button fired das onClick Event doppelt. 
Kannst du das fixen und einen Test dafür schreiben?

Aktueller Code:
```typescript
const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <form>
      <button 
        onClick={handleSubmit}
        onMouseUp={handleSubmit}
        type="button"
      >
        Pay Now
      </button>
    </form>
  );
};
```

🤖 Claude antwortet direkt in der Datei:

"🐛 **Bug gefunden: Double Click Event**

## Problem
Das Event wird **zweimal** gefeuert weil:
1. `onClick` Handler wird beim Click getriggert
2. `onMouseUp` Handler wird AUCH beim Click getriggert
3. → Payment wird 2x verarbeitet! 💳💳

## Warum ist das gefährlich?
```typescript
// User klickt einmal
// ❌ onClick fires → processPayment($99.99)
// ❌ onMouseUp fires → processPayment($99.99)
// Result: User wird 2x belastet! $199.98 statt $99.99 😱
```

---

## Lösung

**PaymentForm.tsx Zeile 67:**

```typescript
const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  /**
   * Handle payment form submission
   * 
   * IMPORTANT: Prevents double submission with isProcessing flag
   * This protects against accidental double-clicks and duplicate charges
   */
  const handleSubmit = async (): Promise<void> => {
    // Prevent double submission
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      await onSubmit(formData);
    } finally {
      // Re-enable button after delay (prevents rapid re-clicks)
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  return (
    <form>
      <button 
        onClick={handleSubmit}
        // ✅ REMOVED: onMouseUp handler (nicht nötig!)
        type="button"
        disabled={isProcessing}
        aria-busy={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};
```

**Änderungen:**
1. ❌ **Entfernt:** `onMouseUp={handleSubmit}` - nicht nötig!
2. ✅ **Hinzugefügt:** `isProcessing` State für Double-Click Protection
3. ✅ **Hinzugefügt:** `disabled` Prop während Processing
4. ✅ **Hinzugefügt:** Loading Text Feedback
5. ✅ **Hinzugefügt:** 1 Sekunde Delay nach Submit

---

## Test hinzugefügt

**PaymentForm.test.tsx:**

```typescript
describe('PaymentForm - Double Click Protection', () => {
  it('should call onSubmit only once when button is clicked', async () => {
    const mockOnSubmit = jest.fn<Promise<void>, [PaymentData]>(() => 
      Promise.resolve()
    );
    const user = userEvent.setup();
    
    render(<PaymentForm onSubmit={mockOnSubmit} />);
    
    const button = screen.getByText('Pay Now');
    await user.click(button);
    
    // ✅ Should be called exactly once
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should prevent double submission on rapid clicks', async () => {
    const mockOnSubmit = jest.fn<Promise<void>, [PaymentData]>(() => 
      // Simulate slow API (500ms)
      new Promise(resolve => setTimeout(resolve, 500))
    );
    const user = userEvent.setup();
    
    render(<PaymentForm onSubmit={mockOnSubmit} />);
    
    const button = screen.getByText('Pay Now');
    
    // User clicks rapidly (double-click)
    await user.click(button);
    await user.click(button);
    await user.click(button);
    
    // ✅ Should still only process once
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('should disable button during processing', async () => {
    const mockOnSubmit = jest.fn<Promise<void>, [PaymentData]>(() => 
      new Promise(resolve => setTimeout(resolve, 500))
    );
    const user = userEvent.setup();
    
    render(<PaymentForm onSubmit={mockOnSubmit} />);
    
    const button = screen.getByText('Pay Now') as HTMLButtonElement;
    
    // Initially enabled
    expect(button.disabled).toBe(false);
    
    // Click button
    await user.click(button);
    
    // Should be disabled during processing
    expect(button.disabled).toBe(true);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(button.disabled).toBe(false);
      expect(screen.getByText('Pay Now')).toBeInTheDocument();
    });
  });

  it('should handle submission errors gracefully', async () => {
    const mockOnSubmit = jest.fn<Promise<void>, [PaymentData]>(() => 
      Promise.reject(new Error('Payment failed'))
    );
    const user = userEvent.setup();
    
    render(<PaymentForm onSubmit={mockOnSubmit} />);
    
    const button = screen.getByText('Pay Now');
    await user.click(button);
    
    // Button should be re-enabled after error
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(screen.getByText('Payment failed')).toBeInTheDocument();
    });
  });
});
```

---

**Commit erstellt:**
```
fix: prevent double payment submission in PaymentForm

- Remove duplicate onMouseUp handler causing double-click
- Add isProcessing state for submission protection
- Add disabled state during processing
- Add loading text feedback
- Add comprehensive tests for double-click protection

Fixes issue where clicking "Pay Now" would charge customer twice
due to both onClick and onMouseUp handlers firing.

Tests verify:
- Single click only calls onSubmit once
- Rapid clicks don't cause multiple submissions
- Button is properly disabled during processing
- Errors are handled gracefully
```

Branch aktualisiert! ✅

**Empfehlung:** Teste das manuell im Browser mit Network throttling 
auf "Slow 3G" um die Protection unter realen Bedingungen zu verifizieren."
```

---

### 10. @claude für Code Review Request

**Szenario:** Manuelle Review-Anfrage für spezifische Aspekte

```
PR #95: "Add User Settings Page"

User kommentiert:
@claude bitte reviewe diese Component auf:
1. Security Best Practices
2. Performance Optimierungen
3. Accessibility
4. Code Documentation

Datei: src/pages/UserSettings.tsx

🤖 Claude antwortet:

"## Code Review: UserSettings.tsx

---

### 🔐 1. Security Analysis

#### ✅ **Gut:**
- Passwort Input hat `type="password"`
- CSRF Token wird mitgesendet
- API Calls verwenden Authentication Header

#### ⚠️ **Probleme gefunden:**

**Zeile 89: Sensitive Data in Console**
```typescript
// ❌ Security Risk
console.log('User data:', userData);

// ✅ Fix: Remove in production
if (process.env.NODE_ENV === 'development') {
  console.debug('[UserSettings] User data loaded');
  // Log only non-sensitive info
}
```

**Zeile 156: Missing Input Sanitization**
```typescript
// ❌ XSS Vulnerability
const displayName = userData.name;
return <div dangerouslySetInnerHTML={{ __html: displayName }} />;

// ✅ Fix: Use safe text rendering
return <div>{userData.name}</div>;

// OR if HTML is needed, sanitize first:
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(userData.name);
return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
```

**Zeile 203: Unvalidated File Upload**
```typescript
// ❌ No validation
const handleAvatarUpload = (file: File) => {
  uploadAvatar(file);
};

// ✅ Fix: Add validation
/**
 * Handle avatar file upload with validation
 * 
 * SECURITY: Validates file type and size to prevent:
 * - Malicious file uploads (only images allowed)
 * - DoS attacks via large files (5MB limit)
 */
const handleAvatarUpload = (file: File): void => {
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    setError('Only JPEG, PNG and WebP images allowed');
    return;
  }
  
  // File size validation (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    setError('File size must be less than 5MB');
    return;
  }
  
  uploadAvatar(file);
};
```

---

### ⚡ 2. Performance Analysis

#### ✅ **Gut:**
- Component verwendet React.memo
- Forms nutzen controlled inputs

#### ⚠️ **Optimierungsbedarf:**

**Zeile 45: Missing useMemo für teure Berechnung**
```typescript
// ❌ Re-berechnet bei jedem Render
const UserSettings: React.FC = () => {
  const sortedSettings = settings
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);
    
  return <div>...</div>;
};

// ✅ Fix: useMemo
const UserSettings: React.FC = () => {
  /**
   * Memoized settings list
   * 
   * PERFORMANCE: Filtering and sorting is O(n log n)
   * Only recalculate when settings array changes
   */
  const sortedSettings = useMemo(() => {
    return settings
      .filter(s => s.visible)
      .sort((a, b) => a.order - b.order);
  }, [settings]);
    
  return <div>...</div>;
};
```

**Zeile 112: Inline Function in onChange**
```typescript
// ❌ Neue Function bei jedem Render
{fields.map(field => (
  <Input
    key={field.id}
    onChange={(e) => handleFieldChange(field.id, e.target.value)}
  />
))}

// ✅ Fix: useCallback
const handleFieldChange = useCallback((
  fieldId: string, 
  value: string
): void => {
  updateField(fieldId, value);
}, [updateField]);

// Separate Component mit memo
const SettingsField = memo<SettingsFieldProps>(({ 
  field, 
  onChange 
}) => (
  <Input
    key={field.id}
    onChange={(e) => onChange(field.id, e.target.value)}
  />
));

// Usage
{fields.map(field => (
  <SettingsField key={field.id} field={field} onChange={handleFieldChange} />
))}
```

**Zeile 178: Unnecessary State Updates**
```typescript
// ❌ Updates state on every keystroke
const [email, setEmail] = useState('');
<input onChange={(e) => setEmail(e.target.value)} />

// ✅ Fix: Debounce for validation
import { useDebouncedValue } from './hooks/useDebouncedValue';

const [email, setEmail] = useState('');
const debouncedEmail = useDebouncedValue(email, 500);

useEffect(() => {
  // Only validate after user stops typing for 500ms
  if (debouncedEmail) {
    validateEmail(debouncedEmail);
  }
}, [debouncedEmail]);
```

---

### ♿ 3. Accessibility Analysis

#### ✅ **Gut:**
- Semantic HTML verwendet
- Buttons haben type="button"

#### ⚠️ **Verbesserungen:**

**Zeile 67: Missing Labels**
```typescript
// ❌ Input ohne Label
<input
  type="email"
  placeholder="Email"
  value={email}
/>

// ✅ Fix: Add proper label
<label htmlFor="user-email">
  Email Address
  <input
    id="user-email"
    type="email"
    value={email}
    aria-required="true"
    aria-invalid={emailError ? 'true' : 'false'}
    aria-describedby={emailError ? 'email-error' : undefined}
  />
</label>
{emailError && (
  <span id="email-error" role="alert">
    {emailError}
  </span>
)}
```

**Zeile 134: Missing Focus Management**
```typescript
// ❌ Nach Save springt Focus zurück zu Anfang
const handleSave = async () => {
  await saveSettings();
  // User muss wieder nach unten scrollen
};

// ✅ Fix: Preserve focus
import { useRef } from 'react';

const saveButtonRef = useRef<HTMLButtonElement>(null);

const handleSave = async (): Promise<void> => {
  await saveSettings();
  
  // Return focus to save button
  saveButtonRef.current?.focus();
  
  // Show success message
  announce('Settings saved successfully');
};

<button ref={saveButtonRef} onClick={handleSave}>
  Save Changes
</button>
```

**Zeile 201: Missing Keyboard Navigation**
```typescript
// ❌ Custom dropdown ohne Keyboard Support
<div className="dropdown" onClick={handleOpen}>
  {selectedOption}
</div>

// ✅ Fix: Add keyboard navigation
<div
  role="combobox"
  aria-expanded={isOpen}
  aria-controls="options-list"
  aria-activedescendant={`option-${selectedId}`}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleOpen();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  }}
  onClick={handleOpen}
>
  {selectedOption}
</div>
```

---

### 📝 4. Code Documentation Analysis

#### ✅ **Gut:**
- Component hat JSDoc Header
- Props Interface ist definiert

#### ⚠️ **Fehlt:**

**Zeile 1: Component JSDoc unvollständig**
```typescript
// ❌ Minimale Dokumentation
/**
 * User Settings Component
 */
export const UserSettings: React.FC = () => {

// ✅ Vollständige Dokumentation
/**
 * User Settings Page Component
 * 
 * Allows users to manage their account settings including:
 * - Profile information (name, email, avatar)
 * - Password changes
 * - Notification preferences
 * - Privacy settings
 * 
 * Features:
 * - Real-time validation
 * - Autosave (debounced after 2s of inactivity)
 * - Unsaved changes warning
 * - Accessibility compliant
 * 
 * @component
 * @example
 * ```tsx
 * <UserSettings />
 * ```
 * 
 * @remarks
 * Requires AuthContext to be present in parent tree
 */
export const UserSettings: React.FC = () => {
```

**Zeile 89: Fehlende Kommentare bei komplexer Logik**
```typescript
// ❌ Keine Erklärung
const processSettings = (data) => {
  const result = data.reduce((acc, item) => {
    if (item.type === 'A') {
      acc.push({ ...item, flag: true });
    } else {
      acc.unshift(item);
    }
    return acc;
  }, []);
  return result;
};

// ✅ Mit Erklärung
/**
 * Process and organize settings by type
 * 
 * Business Logic:
 * - Type 'A' settings are appended to end (push)
 * - Other types are prepended to start (unshift)
 * - Type 'A' gets special flag for UI highlighting
 * 
 * This ensures premium features (Type A) appear at bottom
 * while free features remain at top for better UX
 * 
 * @param data - Raw settings from API
 * @returns Organized settings array
 */
const processSettings = (data: Setting[]): ProcessedSetting[] => {
  return data.reduce((acc, item) => {
    if (item.type === 'A') {
      // Premium features at bottom with highlight flag
      acc.push({ ...item, flag: true });
    } else {
      // Free features at top
      acc.unshift(item);
    }
    return acc;
  }, [] as ProcessedSetting[]);
};
```

**Zeile 156: Magic Numbers ohne Erklärung**
```typescript
// ❌ Unclear constants
if (value.length > 50) return false;
setTimeout(save, 2000);

// ✅ Benannte Konstanten mit Dokumentation
/**
 * Maximum length for user bio text
 * Limitation based on database column size and UI layout
 */
const MAX_BIO_LENGTH = 50;

/**
 * Autosave delay in milliseconds
 * Waits 2 seconds after last keystroke before saving
 * to reduce unnecessary API calls
 */
const AUTOSAVE_DELAY_MS = 2000;

if (value.length > MAX_BIO_LENGTH) {
  return false;
}

setTimeout(save, AUTOSAVE_DELAY_MS);
```

---

## 📊 Summary

**Gefundene Probleme:**
- 🔴 3 Security Issues (High Priority)
- 🟡 4 Performance Issues (Medium Priority)
- 🟡 3 Accessibility Issues (Medium Priority)
- 🔵 3 Documentation Gaps (Low Priority)

**Empfohlene Reihenfolge:**
1. ✅ Security Fixes (sofort)
2. ✅ Accessibility (vor Release)
3. ✅ Performance (vor Release)
4. ✅ Documentation (Nice-to-have)

**Geschätzte Fix-Zeit:** ~2-3 Stunden

Soll ich einen separaten Branch mit allen Fixes erstellen? 🚀"
```

---

## Best Practices

### Wann welches Label verwenden?

```
┌─────────────────────────────────────────────────────┐
│                 Label Decision Tree                  │
└─────────────────────────────────────────────────────┘

Neuer PR erstellt
     │
     ├─ Große Refactoring/Feature (15+ Dateien)?
     │  └─→ ✅ full-review
     │
     ├─ Nur Type Changes?
     │  └─→ ✅ review-types
     │
     ├─ Performance-kritisch?
     │  └─→ ✅ review-performance
     │
     ├─ Beides wichtig?
     │  └─→ ✅ review-types + review-performance
     │
     ├─ Neue Features ohne Tests?
     │  ├─→ Willst du wissen welche Tests fehlen?
     │  │  └─→ ✅ needs-tests
     │  │
     │  └─→ Soll Claude Tests schreiben?
     │     └─→ ✅ write-tests
     │
     ├─ Nur Doku-Änderungen?
     │  └─→ ✅ skip-review
     │
     └─ Normaler Bugfix/kleine Änderung?
        └─→ ⭕ Kein Label (Default: changes-only)
```

### Kombinierte Labels

```
✅ Erlaubte Kombinationen:
├─ review-types + review-performance
├─ review-types + needs-tests
├─ review-performance + needs-tests
└─ write-tests + review-types

❌ Nicht sinnvoll:
├─ full-review + [andere] (full-review überschreibt alles)
├─ skip-review + [andere] (skip deaktiviert Reviews)
└─ needs-tests + write-tests (write-tests macht schon alles)
```

### Optimale Workflow-Patterns

#### Pattern 1: Feature Development
```
1. Issue erstellen: "@claude create feature X"
2. Claude erstellt PR mit Code
3. Label "write-tests" hinzufügen
4. Claude ergänzt Tests
5. Label "review-types" hinzufügen
6. Claude prüft Types
7. Merge!
```

#### Pattern 2: Bug Fix
```
1. PR Comment: "@claude fix this bug"
2. Claude analysiert und fixt
3. Claude schreibt Test für Bug
4. Default review läuft automatisch
5. Merge!
```

#### Pattern 3: Performance Optimization
```
1. PR erstellen mit Änderungen
2. Label "review-performance" hinzufügen
3. Claude findet weitere Optimierungen
4. Implementiere Vorschläge
5. Label "full-review" für Final Check
6. Merge!
```

---

## Tipps & Tricks

### 💡 Effektive @claude Commands

```typescript
// ✅ Gut - Spezifisch und klar
@claude erstelle eine SearchBar Component mit TypeScript,
debounced input (300ms), clear button, und Tests

// ✅ Gut - Mit Context
@claude dieser useEffect hat ein Memory Leak.
Fixe es und erkläre warum es passiert ist.

// ✅ Gut - Mit Constraints
@claude refactore zu TypeScript, aber behalte
die bestehende API Interface bei

// ❌ Schlecht - Zu vage
@claude mach das besser

// ❌ Schlecht - Zu komplex
@claude erstelle ein komplettes CRM System
mit 50 Features und allem drum und dran
```

### 🎯 Label-Strategie für Teams

```
Team Lead empfohlene Labels:
├─ Bug Fixes: Kein Label (automatic changes-only)
├─ New Features: write-tests → review-types
├─ Refactoring: full-review
├─ Performance: review-performance
└─ Docs only: skip-review

Junior Developer:
├─ Jeder PR: review-types (learn from feedback)
└─ Vor Merge: full-review

Senior Developer:
├─ Quick fixes: skip-review (own judgment)
└─ Complex: review-performance
```

### ⚙️ Automation Ideas

```yaml
# .github/workflows/auto-label.yml
# Automatisches Label basierend auf Dateien

name: Auto Label PRs
on:
  pull_request:
    types: [opened]

jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - name: Add review-types for .types.ts changes
        if: contains(github.event.pull_request.files.*.filename, '.types.ts')
        run: gh pr edit $PR --add-label "review-types"
        
      - name: Add write-tests if no test files
        if: "!contains(github.event.pull_request.files.*.filename, '.test.ts')"
        run: gh pr edit $PR --add-label "write-tests"
```

---

## Häufige Probleme & Lösungen

### Problem: Claude reviewed nicht automatisch

```
✅ Checke:
1. Ist .github/workflows/claude.yml committed?
2. Ist ANTHROPIC_API_KEY Secret gesetzt?
3. Hat Action Permissions (Settings → Actions)?
4. Ist das Label korrekt geschrieben?

Debug:
- Gehe zu Actions Tab in GitHub
- Schaue Claude Code Workflow
- Prüfe Logs für Fehler
```

### Problem: Review ist nicht hilfreich

```
✅ Verbessere:
1. Aktualisiere .github/claude-guidelines.md
2. Mache Prompts in .github/prompts/*.md spezifischer
3. Verwende richtige Labels für Focus
4. Gib @claude mehr Context in Comments

Beispiel:
Statt: "@claude fix this"
Besser: "@claude this button fires twice because of
onMouseUp and onClick. Fix it and add a test."
```

### Problem: Tests sind unvollständig

```
✅ Verbessere:
1. Erweitere .github/claude-guidelines.md Testing Section
2. Gib Beispiele in Guidelines
3. Nutze needs-tests Label BEVOR write-tests
   (Claude sieht dann welche Tests fehlen)

Workflow:
1. Label "needs-tests" → Claude listet fehlende Tests
2. Review Liste
3. Label "write-tests" → Claude schreibt alles
```

---

## Ressourcen

- 📚 [Claude Code Dokumentation](https://code.claude.com/docs)
- 🔧 [GitHub Actions Docs](https://docs.github.com/actions)
- ✨ [TypeScript Best Practices](https://typescript-eslint.io)
- 🧪 [React Testing Library](https://testing-library.com/react)

---

**Version:** 1.0.0
**Letzte Aktualisierung:** Januar 2026
**Autor:** Claude + Marc