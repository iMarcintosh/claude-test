import { useTheme } from '../context/ThemeContext'

function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
      className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      style={{
        backgroundColor: isDark ? '#3b82f6' : '#d1d5db'
      }}
    >
      <span className="sr-only">
        {isDark ? 'Dunkler Modus aktiv' : 'Heller Modus aktiv'}
      </span>
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
        style={{
          transition: 'transform 300ms ease-in-out'
        }}
      >
        <span className="flex h-full w-full items-center justify-center text-xs">
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  )
}

export default DarkModeToggle
