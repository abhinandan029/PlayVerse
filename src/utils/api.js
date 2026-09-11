const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')

export function apiUrl(path) {
  return `${backendUrl}${path}`
}
