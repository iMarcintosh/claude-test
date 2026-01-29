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
- Test Files: *.test.ts oder *.test.tsx

## File Structure
```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.types.ts
      Button.module.css
  hooks/
    useAuth.ts
    useAuth.test.ts
  types/
    api.types.ts
  utils/
    helpers.ts
    helpers.test.ts
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

---

# Code Documentation & Comments Standards

## Allgemeine Kommentierungs-Philosophie

**Grundregel:** Code sollte selbsterklärend sein, Kommentare erklären das "Warum", nicht das "Was".
```typescript
// ❌ Bad - Kommentiert das offensichtliche "Was"
// Increment counter by 1
const count = count + 1;

// ✅ Good - Erklärt das "Warum"
// Reset counter to prevent overflow after 1000 iterations
// as backend API has a limit of 1000 requests per session
const count = count >= 1000 ? 0 : count + 1;
```

## Was MUSS kommentiert werden

### 1. Component/Function Überschriften (JSDoc)

**Alle exportierten Components, Hooks und Utils:**
```typescript
/**
 * Reusable button component with loading and error states
 * 
 * @component
 * @example
 * ```tsx
 * <Button 
 *   label="Submit" 
 *   onClick={handleSubmit}
 *   loading={isLoading}
 * />
 * ```
 */
interface ButtonProps {
  /** Text displayed on the button */
  label: string;
  /** Click handler callback */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Disables button interaction */
  disabled?: boolean;
  /** Shows loading spinner */
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
  loading = false
}) => {
  // Implementation
};
```

**Custom Hooks:**
```typescript
/**
 * Custom hook for managing authentication state
 * 
 * Handles user login, logout, token refresh and persistence
 * to localStorage. Automatically refreshes token every 15 minutes.
 * 
 * @returns {UseAuthReturn} Authentication state and methods
 * 
 * @example
 * ```tsx
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * const handleLogin = async () => {
 *   await login(email, password);
 * };
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  // Implementation
};
```

**Utility Functions:**
```typescript
/**
 * Formats a number as currency with locale support
 * 
 * @param amount - The numeric amount to format
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @param locale - BCP 47 language tag (default: 'en-US')
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56)           // "$1,234.56"
 * formatCurrency(1234.56, 'EUR')    // "€1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 * ```
 * 
 * @throws {Error} If amount is not a valid number
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  // Implementation
};
```

### 2. Komplexe Business Logic
```typescript
/**
 * Calculate final price with tax, discount and shipping
 * 
 * Pricing logic:
 * 1. Apply discount percentage to subtotal
 * 2. Add shipping (free for orders > $50)
 * 3. Calculate tax on discounted price + shipping
 * 4. Round to 2 decimal places
 */
const calculateFinalPrice = (
  subtotal: number,
  discountPercent: number,
  taxRate: number
): number => {
  // Apply discount
  const discountAmount = subtotal * (discountPercent / 100);
  const discountedPrice = subtotal - discountAmount;
  
  // Shipping is free for orders over $50
  const shippingCost = discountedPrice > 50 ? 0 : 5.99;
  
  // Tax is calculated on (discounted price + shipping)
  const taxableAmount = discountedPrice + shippingCost;
  const taxAmount = taxableAmount * (taxRate / 100);
  
  const finalPrice = taxableAmount + taxAmount;
  
  // Round to 2 decimal places to avoid floating point issues
  return Math.round(finalPrice * 100) / 100;
};
```

### 3. Workarounds und Hacks
```typescript
// WORKAROUND: Safari has a bug with flex-gap in iOS < 14.5
// Using margin as fallback until we drop support for iOS 14
const Container = styled.div`
  display: flex;
  gap: 1rem;
  
  @supports not (gap: 1rem) {
    & > * + * {
      margin-left: 1rem;
    }
  }
`;

// HACK: TypeScript 4.9 has issues with this type inference
// Remove this 'as' cast when upgrading to TS 5.0+
const result = complexFunction() as ExpectedType;

// TODO: Remove this polyfill after upgrading to Node 18+
// Node 16 doesn't have native fetch support
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}
```

### 4. Performance Optimierungen
```typescript
/**
 * Memoized calculation of filtered and sorted users
 * 
 * PERFORMANCE: This is a heavy computation (O(n log n))
 * Memoization prevents re-calculation on every render
 * Dependencies: users array, searchTerm, sortBy field
 */
const filteredUsers = useMemo(() => {
  return users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return b.createdAt - a.createdAt;
      return 0;
    });
}, [users, searchTerm, sortBy]);

/**
 * Debounced search handler to prevent excessive API calls
 * 
 * PERFORMANCE: Waits 300ms after user stops typing
 * before triggering search to reduce API load
 */
const debouncedSearch = useCallback(
  debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);
```

### 5. Security-relevanter Code
```typescript
/**
 * Sanitize user input to prevent XSS attacks
 * 
 * SECURITY: Never render user input directly without sanitization
 * Removes all HTML tags and escapes special characters
 * 
 * @param input - Raw user input string
 * @returns Sanitized string safe for rendering
 */
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * JWT token validation with expiration check
 * 
 * SECURITY: Always verify token signature and expiration
 * Tokens older than 24 hours are considered invalid
 */
const validateToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() < expiresAt;
  } catch (error) {
    // Invalid signature or malformed token
    return false;
  }
};
```

### 6. Magic Numbers und Konstanten
```typescript
// ❌ Bad - Magic number ohne Kontext
setTimeout(() => updateData(), 300000);

// ✅ Good - Benannte Konstante mit Erklärung
/** 
 * Token refresh interval in milliseconds
 * Refreshes every 5 minutes to ensure continuous authentication
 */
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

setTimeout(() => refreshToken(), TOKEN_REFRESH_INTERVAL);

/**
 * Maximum file upload size in bytes
 * Limitation comes from backend API constraint (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Pagination page size for user lists
 * Based on UX research: optimal balance between 
 * loading speed and scrolling experience
 */
const DEFAULT_PAGE_SIZE = 25;
```

### 7. Regex Patterns
```typescript
/**
 * Email validation regex pattern
 * 
 * Pattern breakdown:
 * - ^[\w-\.]+     : Username part (alphanumeric, dash, dot)
 * - @             : Required @ symbol
 * - ([\w-]+\.)+   : Domain parts with dots
 * - [\w-]{2,4}$   : TLD (2-4 characters)
 * 
 * Matches: user@example.com, user.name@sub.domain.com
 * Rejects: @example.com, user@, user@domain
 */
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Credit card number pattern (supports Visa, MasterCard, Amex)
 * 
 * Formats accepted:
 * - 1234 5678 9012 3456  (spaces)
 * - 1234-5678-9012-3456  (dashes)
 * - 1234567890123456     (no separator)
 */
const CREDIT_CARD_REGEX = /^[\d]{4}[\s-]?[\d]{4}[\s-]?[\d]{4}[\s-]?[\d]{4}$/;
```

### 8. Non-Obvious Dependencies
```typescript
/**
 * User profile update effect
 * 
 * IMPORTANT: This effect MUST run when userId changes,
 * even if user object is the same, because userId change
 * indicates navigation to different user profile page
 */
useEffect(() => {
  fetchUserProfile(userId);
}, [userId]); // Don't add 'user' to dependencies!

/**
 * Debounced window resize handler
 * 
 * NOTE: Empty dependency array is intentional
 * We only want to setup the listener once on mount
 * The handler itself is stable and doesn't need re-creation
 */
useEffect(() => {
  const handleResize = debounce(() => {
    setWindowWidth(window.innerWidth);
  }, 200);

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []); // Empty deps is correct here
```

### 9. API Endpoints und External Services
```typescript
/**
 * User authentication API endpoints
 * 
 * Base URL: https://api.example.com/v1
 * Authentication: Bearer token in Authorization header
 * Rate limit: 100 requests per minute per IP
 */
const API_ENDPOINTS = {
  /** POST /auth/login - User login with email/password */
  LOGIN: '/auth/login',
  
  /** POST /auth/logout - Invalidate current session token */
  LOGOUT: '/auth/logout',
  
  /** GET /auth/refresh - Refresh access token using refresh token */
  REFRESH: '/auth/refresh',
  
  /** GET /users/:id - Fetch user profile by ID */
  USER_PROFILE: (id: string) => `/users/${id}`,
} as const;

/**
 * Fetch user data from API
 * 
 * @param userId - UUID of the user
 * @returns User profile data
 * @throws {AuthError} If authentication token is invalid
 * @throws {NotFoundError} If user doesn't exist
 * @throws {NetworkError} If request fails
 */
export const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.USER_PROFILE(userId)}`,
    {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    // Handle different error status codes
    if (response.status === 401) {
      throw new AuthError('Invalid or expired token');
    }
    if (response.status === 404) {
      throw new NotFoundError(`User ${userId} not found`);
    }
    throw new NetworkError('Failed to fetch user data');
  }
  
  return response.json();
};
```

### 10. Type Definitions mit komplexer Logik
```typescript
/**
 * User role permissions mapping
 * 
 * Role hierarchy (top to bottom):
 * - ADMIN: Full access to all resources
 * - MODERATOR: Can manage users and content, cannot change settings
 * - USER: Can only manage their own content
 * - GUEST: Read-only access
 */
type UserRole = 'ADMIN' | 'MODERATOR' | 'USER' | 'GUEST';

/**
 * Generic API response wrapper
 * 
 * @template T - Type of the data payload
 * 
 * Success response: { success: true, data: T }
 * Error response: { success: false, error: string }
 * 
 * This discriminated union ensures type safety when handling responses
 */
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Form validation state
 * 
 * Each field can be in one of three states:
 * - undefined: Not yet validated (pristine)
 * - string: Validation error message
 * - null: Validated and valid
 * 
 * This allows distinguishing between "not validated" and "valid"
 */
interface FormErrors {
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}
```

## Was NICHT kommentiert werden sollte

### ❌ Offensichtlicher Code
```typescript
// ❌ Bad - Überflüssiger Kommentar
// Set isLoading to true
setIsLoading(true);

// ❌ Bad - Kommentar wiederholt Code
// Loop through all users
users.forEach(user => {
  // Process each user
  processUser(user);
});

// ✅ Good - Selbsterklärender Code ohne Kommentar
const isValidEmail = email.includes('@') && email.includes('.');
```

### ❌ Veraltete oder falsche Kommentare
```typescript
// ❌ Bad - Kommentar stimmt nicht mehr mit Code überein
// Fetch users from local database
const users = await api.fetchUsersFromCloud(); // Jetzt Cloud statt local!

// ✅ Good - Aktueller Kommentar oder gar keiner
const users = await api.fetchUsersFromCloud();
```

### ❌ Auskommentierter alter Code
```typescript
// ❌ Bad - Toter Code bleibt im Repository
// const oldImplementation = () => {
//   return someOldLogic();
// }

const newImplementation = () => {
  return someNewLogic();
}

// ✅ Good - Alter Code wird gelöscht (ist in Git History)
const newImplementation = () => {
  return someNewLogic();
}
```

## TODO/FIXME/NOTE Kommentare
```typescript
/**
 * TODO: Add pagination support
 * Currently loads all users at once, will cause performance issues
 * with large datasets. Implement cursor-based pagination.
 * See ticket: PROJ-123
 */
const fetchAllUsers = async (): Promise<User[]> => {
  // Implementation
};

/**
 * FIXME: Race condition in concurrent updates
 * Multiple simultaneous calls can overwrite each other's changes
 * Need to implement optimistic locking or version control
 * Bug ticket: PROJ-456
 */
const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  // Implementation
};

/**
 * NOTE: This component is deprecated
 * Use <NewButton> instead. This will be removed in v3.0
 * Migration guide: docs/migration/button-v2-to-v3.md
 * 
 * @deprecated Use NewButton component instead
 */
export const OldButton: React.FC<OldButtonProps> = (props) => {
  // Implementation
};

/**
 * HACK: Temporary fix for Safari rendering bug
 * Remove this when Safari 17+ is our minimum supported version
 * Related: https://bugs.webkit.org/show_bug.cgi?id=123456
 */
const applySafariWorkaround = (): void => {
  // Implementation
};
```

## Inline Comments Best Practices
```typescript
const processPayment = async (order: Order): Promise<PaymentResult> => {
  // Step 1: Validate order total
  const total = calculateOrderTotal(order);
  if (total <= 0) {
    throw new Error('Invalid order total');
  }
  
  // Step 2: Check inventory availability before charging
  // This prevents charging customers for out-of-stock items
  const hasInventory = await checkInventory(order.items);
  if (!hasInventory) {
    throw new Error('Some items are out of stock');
  }
  
  // Step 3: Process payment
  // Using idempotency key to prevent duplicate charges
  const idempotencyKey = `order_${order.id}_${Date.now()}`;
  const payment = await paymentGateway.charge({
    amount: total,
    currency: 'USD',
    idempotencyKey
  });
  
  // Step 4: Update order status only after successful payment
  if (payment.status === 'succeeded') {
    await updateOrderStatus(order.id, 'PAID');
  }
  
  return payment;
};
```

## Documentation in Complex Components
```typescript
/**
 * Multi-step form wizard with validation and state persistence
 * 
 * Features:
 * - Step-by-step navigation with validation
 * - Form state persisted to localStorage
 * - Automatic save on field change (debounced)
 * - Back/Next navigation with validation
 * - Summary page before submission
 * 
 * State management:
 * - formData: All form values across steps
 * - currentStep: Active step index (0-based)
 * - errors: Validation errors per step
 * - isDirty: Track unsaved changes
 * 
 * @component
 */
export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  onSubmit,
  initialData
}) => {
  // Form state management
  const [formData, setFormData] = useState<FormData>(initialData);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  /**
   * Auto-save form data to localStorage
   * 
   * Debounced to avoid excessive writes
   * Only saves if form is dirty (has unsaved changes)
   */
  useEffect(() => {
    if (!isDirty) return;
    
    const saveTimer = setTimeout(() => {
      localStorage.setItem('form-draft', JSON.stringify(formData));
      setIsDirty(false);
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(saveTimer);
  }, [formData, isDirty]);
  
  /**
   * Navigate to next step with validation
   * 
   * Validates current step before allowing navigation
   * Shows error messages if validation fails
   */
  const handleNext = async (): Promise<void> => {
    const stepErrors = await validateStep(currentStep, formData);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    setErrors({});
  };
  
  // ... rest of implementation
};
```

## Kommentar-Checkliste für Code Reviews

Bei Code Reviews prüfen:

- ✅ Alle exportierten Functions/Components haben JSDoc
- ✅ Komplexe Business Logic ist erklärt
- ✅ Workarounds/Hacks sind dokumentiert mit Grund
- ✅ Magic Numbers sind als benannte Konstanten mit Erklärung
- ✅ Regex Patterns haben Erklärung
- ✅ Security-relevanter Code ist markiert
- ✅ Performance-Optimierungen sind begründet
- ✅ API Endpoints haben Dokumentation
- ✅ Keine veralteten Kommentare
- ✅ Keine auskommentierten Code-Blöcke
- ✅ TODOs haben Ticket-Referenz
- ✅ Non-obvious Dependencies sind erklärt

---

# Testing Standards

## Test Framework & Tools
- **Test Runner:** Jest
- **React Testing:** @testing-library/react
- **User Interactions:** @testing-library/user-event
- **Type Safety:** TypeScript in allen Tests
- **Coverage Ziel:** Minimum 80% für kritische Components

## Test File Structure & Naming

### File Location
```
src/components/Button/Button.tsx
→ src/components/Button/Button.test.tsx

src/hooks/useAuth.ts
→ src/hooks/useAuth.test.ts

src/utils/validation.ts
→ src/utils/validation.test.ts
```

### Test Structure Pattern
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // Setup/Teardown
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Cases
  describe('Rendering', () => {
    it('should render with default props', () => {
      // Test
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', () => {
      // Test
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      // Test
    });
  });
});
```

## Was zu testen

### Components (React)
```typescript
describe('Button Component', () => {
  // ✅ 1. Rendering mit verschiedenen Props
  it('should render with correct label', () => {
    render(<Button label="Click me" onClick={jest.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // ✅ 2. User Interactions
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // ✅ 3. Conditional Rendering
  it('should show loading spinner when loading', () => {
    render(<Button label="Click" onClick={jest.fn()} loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // ✅ 4. Disabled State
  it('should be disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={jest.fn()} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // ✅ 5. Error States
  it('should display error message when error prop is provided', () => {
    render(<Button label="Click" onClick={jest.fn()} error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  // ✅ 6. Accessibility
  it('should have correct ARIA attributes', () => {
    render(<Button label="Click" onClick={jest.fn()} ariaLabel="Submit form" />);
    expect(screen.getByLabelText('Submit form')).toBeInTheDocument();
  });

  // ✅ 7. Variants/Themes
  it('should apply primary variant styles', () => {
    render(<Button label="Click" onClick={jest.fn()} variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
});
```

### Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
  // ✅ 1. Initial State
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  // ✅ 2. State Updates
  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  // ✅ 3. Side Effects
  it('should call callback on count change', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useCounter(0, callback));
    
    act(() => {
      result.current.increment();
    });
    
    expect(callback).toHaveBeenCalledWith(1);
  });

  // ✅ 4. Cleanup
  it('should cleanup on unmount', () => {
    const cleanup = jest.fn();
    const { unmount } = renderHook(() => useCounter(0, undefined, cleanup));
    
    unmount();
    
    expect(cleanup).toHaveBeenCalled();
  });

  // ✅ 5. Error Handling
  it('should handle invalid increment', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment(-1);
    });
    
    expect(result.current.error).toBe('Invalid increment value');
  });
});
```

### Utils/Helper Functions
```typescript
import { formatCurrency, validateEmail } from './helpers';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    // ✅ 1. Happy Path
    it('should format number as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    // ✅ 2. Edge Cases
    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-100)).toBe('-$100.00');
    });

    it('should handle very large numbers', () => {
      expect(formatCurrency(1000000000)).toBe('$1,000,000,000.00');
    });

    // ✅ 3. Invalid Input
    it('should handle NaN', () => {
      expect(formatCurrency(NaN)).toBe('$0.00');
    });

    it('should handle undefined', () => {
      expect(formatCurrency(undefined as any)).toBe('$0.00');
    });
  });

  describe('validateEmail', () => {
    // ✅ Valid Cases
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    // ✅ Invalid Cases
    it('should reject email without @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should reject null/undefined', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });
  });
});
```

## TypeScript in Tests

### Typed Mock Functions
```typescript
// ✅ Good - Explizit typisiert
const mockCallback = jest.fn<void, [string]>();
const mockFetch = jest.fn<Promise<User>, [string]>();

// Mock mit vollständigem Type
const mockOnChange = jest.fn<void, [React.ChangeEvent<HTMLInputElement>]>();

// ✅ Good - Props Interface
const mockProps: ButtonProps = {
  label: 'Test',
  onClick: jest.fn(),
  variant: 'primary'
};

render(<Button {...mockProps} />);
```

### Typed Component Queries
```typescript
// ✅ Good - Explizite Types für Queries
const button = screen.getByRole('button') as HTMLButtonElement;
expect(button.disabled).toBe(true);

const input = screen.getByLabelText('Email') as HTMLInputElement;
expect(input.value).toBe('test@example.com');
```

### Generic Test Helpers
```typescript
// ✅ Good - Generic Helper für wiederverwendbare Tests
function renderWithProviders<T>(
  component: React.ReactElement,
  options?: T
): RenderResult {
  return render(
    <ThemeProvider>
      <RouterProvider>
        {component}
      </RouterProvider>
    </ThemeProvider>
  );
}
```

## Async Testing

### API Calls & Data Fetching
```typescript
import { waitFor, screen } from '@testing-library/react';

describe('UserProfile Component', () => {
  it('should fetch and display user data', async () => {
    // Mock API
    jest.spyOn(api, 'fetchUser').mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    });

    render(<UserProfile userId="1" />);

    // Initial loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Verify data is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should handle API errors', async () => {
    // Mock API error
    jest.spyOn(api, 'fetchUser').mockRejectedValue(
      new Error('Failed to fetch user')
    );

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch user')).toBeInTheDocument();
    });
  });
});
```

### User Interactions with Delays
```typescript
import { userEvent } from '@testing-library/user-event';

it('should debounce search input', async () => {
  const mockOnSearch = jest.fn();
  const user = userEvent.setup();

  render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);

  const input = screen.getByPlaceholderText('Search...');
  
  // Type quickly
  await user.type(input, 'test');

  // Should not call immediately
  expect(mockOnSearch).not.toHaveBeenCalled();

  // Wait for debounce
  await waitFor(() => {
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  }, { timeout: 500 });

  // Should only be called once
  expect(mockOnSearch).toHaveBeenCalledTimes(1);
});
```

## Mocking Best Practices

### Module Mocks
```typescript
// ✅ Good - Mock entire module
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ id: '1', name: 'John' })),
  updateUser: jest.fn(() => Promise.resolve({ success: true }))
}));

// ✅ Good - Partial mock with actual implementation
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatDate: jest.fn(() => '2024-01-01')
}));
```

### React Router Mocks
```typescript
// ✅ Good - Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '123' })
}));

it('should navigate on button click', () => {
  render(<MyComponent />);
  fireEvent.click(screen.getByText('Go to Details'));
  expect(mockNavigate).toHaveBeenCalledWith('/details/123');
});
```

### Context Mocks
```typescript
// ✅ Good - Mock Context Provider
const mockAuthContext = {
  user: { id: '1', name: 'Test User' },
  login: jest.fn(),
  logout: jest.fn()
};

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      {component}
    </AuthContext.Provider>
  );
};

it('should display user name from context', () => {
  renderWithAuth(<UserMenu />);
  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

### LocalStorage/SessionStorage Mocks
```typescript
// ✅ Good - Mock Storage
const mockStorage: Storage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage
});

it('should save theme to localStorage', () => {
  render(<ThemeToggle />);
  fireEvent.click(screen.getByText('Dark Mode'));
  expect(mockStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
});
```

## Accessibility Testing
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Button label="Click me" onClick={jest.fn()} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be keyboard navigable', () => {
    render(<Button label="Click" onClick={jest.fn()} />);
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveFocus();
    
    fireEvent.keyPress(button, { key: 'Enter', code: 13 });
    // Verify action
  });

  it('should have correct ARIA labels', () => {
    render(
      <Button 
        label="Submit" 
        onClick={jest.fn()} 
        ariaLabel="Submit form"
        ariaDescribedBy="form-help"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
    expect(button).toHaveAttribute('aria-describedby', 'form-help');
  });
});
```

## Test Coverage Guidelines

### Minimum Coverage Requirements
- **Components:** 80% minimum
- **Hooks:** 90% minimum
- **Utils:** 95% minimum
- **Critical Business Logic:** 100%

### Was MUSS getestet werden
- ✅ Alle User-facing Components
- ✅ Alle Custom Hooks
- ✅ Alle Utility Functions
- ✅ API Integration Layer
- ✅ State Management (Redux/Context)
- ✅ Form Validierung
- ✅ Error Boundaries
- ✅ Authentication/Authorization Logic

### Was KANN übersprungen werden
- ❌ Third-party Library Wrapper (wenn minimal)
- ❌ Reine Type Definitions
- ❌ Simple Constants
- ❌ Index Files (nur Exports)

## Test Performance

### Setup Optimierung
```typescript
// ✅ Good - Cleanup nach jedem Test
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

// ✅ Good - Shared test setup
const setup = () => {
  const utils = render(<MyComponent />);
  const input = screen.getByLabelText('Username') as HTMLInputElement;
  const button = screen.getByText('Submit') as HTMLButtonElement;
  return { ...utils, input, button };
};
```

### Avoid Over-Testing
```typescript
// ❌ Bad - Testing implementation details
it('should call useState', () => {
  // Don't test React internals
});

// ❌ Bad - Testing library code
it('should render children', () => {
  render(<div>Test</div>);
  // Don't test that React renders correctly
});

// ✅ Good - Test user behavior
it('should update username when user types', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText('Username'), 'john');
  
  expect(screen.getByDisplayValue('john')).toBeInTheDocument();
});
```

## Test Documentation
```typescript
describe('LoginForm Component', () => {
  /**
   * Test Suite: Rendering
   * Verifies that the component renders correctly with different prop combinations
   */
  describe('Rendering', () => {
    it('should render email and password fields', () => {
      // Given: Component with default props
      // When: Component is rendered
      // Then: Email and password fields should be visible
    });
  });

  /**
   * Test Suite: Validation
   * Tests form validation logic for various input scenarios
   */
  describe('Validation', () => {
    it('should show error for invalid email format', async () => {
      // Given: Form is rendered
      // When: User enters invalid email
      // Then: Error message should be displayed
    });
  });
});
```

## Common Test Patterns

### Form Testing Pattern
```typescript
describe('ContactForm', () => {
  const setup = () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();
    const utils = render(<ContactForm onSubmit={mockOnSubmit} />);
    
    return {
      user,
      mockOnSubmit,
      emailInput: screen.getByLabelText('Email') as HTMLInputElement,
      messageInput: screen.getByLabelText('Message') as HTMLTextAreaElement,
      submitButton: screen.getByText('Send') as HTMLButtonElement,
      ...utils
    };
  };

  it('should submit form with valid data', async () => {
    const { user, mockOnSubmit, emailInput, messageInput, submitButton } = setup();
    
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Hello World');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      message: 'Hello World'
    });
  });
});
```

### List Rendering Pattern
```typescript
describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: '1', text: 'Buy milk', completed: false },
    { id: '2', text: 'Walk dog', completed: true }
  ];

  it('should render all todos', () => {
    render(<TodoList todos={mockTodos} onToggle={jest.fn()} />);
    
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });

  it('should show completed state', () => {
    render(<TodoList todos={mockTodos} onToggle={jest.fn()} />);
    
    const completedItem = screen.getByText('Walk dog').closest('li');
    expect(completedItem).toHaveClass('completed');
  });
});
```

### Error Boundary Pattern
```typescript
describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  it('should catch and display errors', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation();
    
    render(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    
    spy.mockRestore();
  });
});
```

## Continuous Integration

### Coverage Thresholds (jest.config.js)
```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/index.tsx'
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};
```

---

**Zusammenfassung Test Best Practices:**
1. ✅ Jede Component/Hook/Util hat eigene .test.tsx/.test.ts Datei
2. ✅ Tests sind typisiert mit TypeScript
3. ✅ Minimum 80% Coverage für Components
4. ✅ Teste User Behavior, nicht Implementation Details
5. ✅ Verwende describe/it Pattern für Struktur
6. ✅ Setup/Teardown mit beforeEach/afterEach
7. ✅ Mock externe Dependencies (API, Router, Context)
8. ✅ Async Tests mit waitFor für Loading/Error States
9. ✅ Accessibility Tests für kritische Components
10. ✅ Performance: Cleanup nach jedem Test