export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getDaysUntil(date) {
  const diff = new Date(date) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getStatusColor(status) {
  switch (status) {
    case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/30'
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'pending': return 'Pending'
    case 'in_progress': return 'In Progress'
    case 'completed': return 'Completed'
    default: return status
  }
}
