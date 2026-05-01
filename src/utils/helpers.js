// Generate a unique ID for each task
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Format date to readable string
export const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Get color based on priority
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':   return '#ef4444'
    case 'medium': return '#f59e0b'
    case 'low':    return '#22c55e'
    default:       return '#6b7280'
  }
}

// Get color based on status
export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':  return '#22c55e'
    case 'in-progress': return '#3b82f6'
    case 'pending':    return '#f59e0b'
    default:           return '#6b7280'
  }
}