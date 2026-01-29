import VisitorCard from './VisitorCard'
import type { Visitor } from '../types'

interface VisitorListProps {
  visitors: Visitor[];
  onCheckOut: (id: number) => void;
}

function VisitorList({ visitors, onCheckOut }: VisitorListProps) {
  if (visitors.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Keine Besucher gefunden.</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Registrieren Sie einen neuen Besucher über das Formular oben.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {visitors.map(visitor => (
        <VisitorCard
          key={visitor.id}
          visitor={visitor}
          onCheckOut={onCheckOut}
        />
      ))}
    </div>
  )
}

export default VisitorList
