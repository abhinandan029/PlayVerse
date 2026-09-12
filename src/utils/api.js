const backendUrl = (
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
).replace(/\/$/, '')

export function apiUrl(path) {
  return `${backendUrl}${path}`
}
