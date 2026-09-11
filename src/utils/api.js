const backendUrl = (
  import.meta.env.VITE_BACKEND_URL || 'https://playverse-mnx5.onrender.com'
).replace(/\/$/, '')

export function apiUrl(path) {
  return `${backendUrl}${path}`
}
