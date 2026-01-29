function Stats({ visitors }) {
  const totalVisitors = visitors.length
  const checkedIn = visitors.filter(v => v.status === 'checked-in').length
  const checkedOut = visitors.filter(v => v.status === 'checked-out').length

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <p className="text-3xl font-bold text-blue-600">{totalVisitors}</p>
        <p className="text-gray-600 text-sm">Gesamt heute</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <p className="text-3xl font-bold text-green-600">{checkedIn}</p>
        <p className="text-gray-600 text-sm">Anwesend</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <p className="text-3xl font-bold text-gray-600">{checkedOut}</p>
        <p className="text-gray-600 text-sm">Ausgecheckt</p>
      </div>
    </div>
  )
}

export default Stats
