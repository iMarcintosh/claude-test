import type { FilterType } from '../types'

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

function SearchBar({ searchTerm, onSearchChange, filter, onFilterChange }: SearchBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4 transition-colors">
      <div className="flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Suchen nach Name, Firma oder Ansprechpartner..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => onFilterChange('checked-in')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'checked-in'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Anwesend
        </button>
        <button
          onClick={() => onFilterChange('checked-out')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'checked-out'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Ausgecheckt
        </button>
      </div>
    </div>
  )
}

export default SearchBar
