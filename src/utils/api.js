const backendUrl = (
  'http://localhost:3000' || "https://playverse-mnx5.onrender.com"
).replace(/\/$/, '')

export function apiUrl(path) {
  return `${backendUrl}${path}`
}
