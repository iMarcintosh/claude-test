import type { Visitor } from '../types'

interface StatsProps {
  visitors: Visitor[];
}

function Stats({ visitors }: StatsProps) {
  const totalVisitors = visitors.length
  const checkedIn = visitors.filter(v => v.status === 'checked-in').length
  const checkedOut = visitors.filter(v => v.status === 'checked-out').length

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center transition-colors">
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalVisitors}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Gesamt heute</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center transition-colors">
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{checkedIn}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Anwesend</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center transition-colors">
        <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{checkedOut}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Ausgecheckt</p>
      </div>
    </div>
  )
}

export default Stats
