function VisitorCard({ visitor, onCheckOut }) {
  const formatTime = (isoString) => {
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
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      isCheckedIn ? 'border-green-500' : 'border-gray-400'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">{visitor.name}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              isCheckedIn
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isCheckedIn ? 'Anwesend' : 'Ausgecheckt'}
            </span>
          </div>
          {visitor.company && (
            <p className="text-gray-600 text-sm">{visitor.company}</p>
          )}
        </div>
        {visitor.badge && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {visitor.badge}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Ansprechpartner:</span>
          <p className="text-gray-800">{visitor.contactPerson}</p>
        </div>
        <div>
          <span className="text-gray-500">Besuchsgrund:</span>
          <p className="text-gray-800">{visitor.reason}</p>
        </div>
        <div>
          <span className="text-gray-500">Check-in:</span>
          <p className="text-gray-800">{formatTime(visitor.checkInTime)}</p>
        </div>
        <div>
          <span className="text-gray-500">Check-out:</span>
          <p className="text-gray-800">{formatTime(visitor.checkOutTime)}</p>
        </div>
      </div>

      {isCheckedIn && (
        <button
          onClick={() => onCheckOut(visitor.id)}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors font-medium"
        >
          Auschecken
        </button>
      )}
    </div>
  )
}

export default VisitorCard
