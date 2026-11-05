const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
const authStorageKey = 'fontrent-access-token'

export const isApiConfigured = Boolean(apiBaseUrl)

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export function setAccessToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) window.sessionStorage.setItem(authStorageKey, token)
  else window.sessionStorage.removeItem(authStorageKey)
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isApiConfigured) throw new Error('API is not configured. Set VITE_API_BASE_URL.')

  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (typeof window !== 'undefined') {
    const token = window.sessionStorage.getItem(authStorageKey)
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers })
  } catch {
    throw new ApiError('Could not connect to the API. Check the server and network.', 0)
  }

  if (response.status === 204) return undefined as T
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '')

  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'message' in payload
      ? String(payload.message)
      : typeof payload === 'string' && payload
        ? payload
        : `API request failed (${response.status}).`
    throw new ApiError(message, response.status)
  }

  return payload as T
}
