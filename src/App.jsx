import { useState, useEffect } from 'react'
import Header from './components/Header'
import VisitorForm from './components/VisitorForm'
import SearchBar from './components/SearchBar'
import VisitorList from './components/VisitorList'
import Stats from './components/Stats'

const STORAGE_KEY = 'visitor-management-data'

function App() {
  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors))
  }, [visitors])

  const addVisitor = (visitor) => {
    setVisitors(prev => [visitor, ...prev])
  }

  const checkOutVisitor = (id) => {
    setVisitors(prev => prev.map(visitor =>
      visitor.id === id
        ? { ...visitor, status: 'checked-out', checkOutTime: new Date().toISOString() }
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
    <div className="min-h-screen bg-gray-100">
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
      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-8">
        <p>&copy; {new Date().getFullYear()} Besuchermanagement System</p>
      </footer>
    </div>
  )
}

export default App
