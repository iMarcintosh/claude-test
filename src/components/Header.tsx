import DarkModeToggle from './DarkModeToggle'

function Header() {
  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white shadow-lg transition-colors">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Besuchermanagement</h1>
            <p className="text-blue-100 dark:text-gray-300 mt-1">Verwalten Sie Ihre Besucher einfach und effizient</p>
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
