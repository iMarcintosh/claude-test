import type { FilterType } from '../types'

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

function SearchBar({ searchTerm, onSearchChange, filter, onFilterChange }: SearchBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Suchen nach Name, Firma oder Ansprechpartner..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => onFilterChange('checked-in')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'checked-in'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Anwesend
        </button>
        <button
          onClick={() => onFilterChange('checked-out')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            filter === 'checked-out'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Ausgecheckt
        </button>
      </div>
    </div>
  )
}

export default SearchBar
