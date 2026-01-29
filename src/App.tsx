import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import VisitorForm from './components/VisitorForm'
import SearchBar from './components/SearchBar'
import VisitorList from './components/VisitorList'
import Stats from './components/Stats'
import type { Visitor, FilterType } from './types'

const STORAGE_KEY = 'visitor-management-data'

function App() {
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors))
  }, [visitors])

  const addVisitor = (visitor: Visitor) => {
    setVisitors(prev => [visitor, ...prev])
  }

  const checkOutVisitor = (id: number) => {
    setVisitors(prev => prev.map(visitor =>
      visitor.id === id
        ? { ...visitor, status: 'checked-out' as const, checkOutTime: new Date().toISOString() }
        : visitor
    ))
  }

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      visitor.status === filter

    return matchesSearch && matchesFilter
  })

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Stats visitors={visitors} />
            <VisitorForm onAddVisitor={addVisitor} />
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filter={filter}
              onFilterChange={setFilter}
            />
            <VisitorList
              visitors={filteredVisitors}
              onCheckOut={checkOutVisitor}
            />
          </div>
        </main>
        <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 dark:text-gray-500 text-center py-4 mt-8 transition-colors">
          <p>&copy; {new Date().getFullYear()} Besuchermanagement System</p>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
