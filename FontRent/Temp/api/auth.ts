import { apiRequest, setAccessToken } from './client'

interface AuthResult {
  accessToken: string
  user: { id: string; name: string; email: string; role: 'renter' | 'owner' | 'admin' }
}

export async function signIn(email: string, password: string) {
  const result = await apiRequest<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAccessToken(result.accessToken)
  return result.user
}

export async function signUp(name: string, email: string, password: string) {
  const result = await apiRequest<AuthResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  setAccessToken(result.accessToken)
  return result.user
}

export function signOut() {
  setAccessToken(null)
}
