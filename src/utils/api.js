const configuredBackendUrl = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_BACKEND_URL || ''
  : import.meta.env.VITE_PROD_BACKEND_URL || import.meta.env.VITE_BACKEND_URL || ''

const backendUrl = configuredBackendUrl.replace(/\/$/, '')

export function apiUrl(path) {
  return `${backendUrl}${path}`
}
