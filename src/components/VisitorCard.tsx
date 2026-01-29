import type { Visitor } from '../types'

interface VisitorCardProps {
  visitor: Visitor;
  onCheckOut: (id: number) => void;
}

function VisitorCard({ visitor, onCheckOut }: VisitorCardProps) {
  const formatTime = (isoString: string | null): string => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isCheckedIn = visitor.status === 'checked-in'

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 transition-colors ${
      isCheckedIn ? 'border-green-500 dark:border-green-400' : 'border-gray-400 dark:border-gray-600'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{visitor.name}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isCheckedIn
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
              {isCheckedIn ? 'Anwesend' : 'Ausgecheckt'}
            </span>
          </div>
          {visitor.company && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">{visitor.company}</p>
          )}
        </div>
        {visitor.badge && (
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            {visitor.badge}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Ansprechpartner:</span>
          <p className="text-gray-800 dark:text-gray-200">{visitor.contactPerson}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Besuchsgrund:</span>
          <p className="text-gray-800 dark:text-gray-200">{visitor.reason}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Check-in:</span>
          <p className="text-gray-800 dark:text-gray-200">{formatTime(visitor.checkInTime)}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Check-out:</span>
          <p className="text-gray-800 dark:text-gray-200">{formatTime(visitor.checkOutTime)}</p>
        </div>
      </div>

      {isCheckedIn && (
        <button
          onClick={() => onCheckOut(visitor.id)}
          className="mt-4 w-full bg-red-500 dark:bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors font-medium"
        >
          Auschecken
        </button>
      )}
    </div>
  )
}

export default VisitorCard
