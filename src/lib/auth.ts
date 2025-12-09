export interface User {
  id: string
  name: string
  email: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthSession extends AuthTokens {
  user: User
}

export interface RegisterPayload {
  email: string
  name: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RefreshPayload {
  refreshToken: string
}

export interface AuthFetchOptions<TResponse> {
  input: RequestInfo | URL
  init?: RequestInit
  session: AuthSession | null
  onSessionChange?: (next: AuthSession | null) => void
  parse?: (response: Response) => Promise<TResponse>
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const AUTH_STORAGE_KEY = 'expense-tracker-auth-session'

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = (data as { message?: string })?.message || 'Yêu cầu thất bại'
    throw new Error(message)
  }

  return data as TResponse
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  return postJson<AuthSession>('/auth/register', payload)
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  return postJson<AuthSession>('/auth/login', payload)
}

export async function refreshToken(payload: RefreshPayload): Promise<AuthSession> {
  return postJson<AuthSession>('/auth/refresh', payload)
}

export function saveAuthSession(session: AuthSession): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function loadAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch (error) {
    console.error('Failed to load auth session', error)
    return null
  }
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}


function decodeJwtExp(token: string): number | null {
  try {
    const [, payload] = token.split('.')
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(decoded) as { exp?: number }
    return typeof exp === 'number' ? exp : null
  } catch (error) {
    console.error('Failed to decode token exp', error)
    return null
  }
}

export function isAccessTokenExpired(token: string, skewSeconds = 30): boolean {
  const exp = decodeJwtExp(token)
  if (!exp) return true
  const now = Date.now() / 1000
  return now >= exp - skewSeconds
}

export function shouldRefreshSession(session: AuthSession, skewSeconds = 30): boolean {
  return isAccessTokenExpired(session.accessToken, skewSeconds)
}

function mergeHeaders(base: HeadersInit | undefined, extra: Record<string, string>): HeadersInit {
  return {
    ...(typeof base === 'object' && !Array.isArray(base) ? base : {}),
    ...extra,
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  try {
    return JSON.parse(text) as T
  } catch {
    // fallback when server returns plain text
    return text as unknown as T
  }
}

export async function fetchWithAuth<TResponse>(options: AuthFetchOptions<TResponse>): Promise<TResponse> {
  const { input, init, session, onSessionChange, parse = parseJsonResponse } = options

  if (!session) {
    throw new Error('Chưa đăng nhập')
  }

  let workingSession = session

  const doFetch = (s: AuthSession) => {
    const headers = mergeHeaders(init?.headers, {
      Authorization: `Bearer ${s.accessToken}`,
    })

    return fetch(input, {
      ...init,
      headers,
    })
  }

  let response = await doFetch(workingSession)

  if (response.status === 401) {
    try {
      const refreshed = await refreshToken({ refreshToken: workingSession.refreshToken })
      workingSession = refreshed
      onSessionChange?.(refreshed)

      response = await doFetch(refreshed)
    } catch (error) {
      onSessionChange?.(null)
      throw error
    }
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Yêu cầu thất bại')
  }

  return parse(response)
}
