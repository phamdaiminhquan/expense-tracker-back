import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { appConfig } from '@/global-config'

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const API_BASE_URL = appConfig.apiBaseUrl
const AUTH_STORAGE_KEY = 'expense-tracker-auth-session'

type StoredSession = {
    accessToken: string
    refreshToken: string
}

function loadStoredSession(): StoredSession | null {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as { accessToken?: string; refreshToken?: string }
        if (!parsed.accessToken || !parsed.refreshToken) return null
        return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken }
    } catch (error) {
        console.error('Failed to parse auth session', error)
        return null
    }
}

function saveStoredSession(next: StoredSession) {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return
    try {
        const parsed = JSON.parse(raw) as Record<string, unknown>
        const merged = { ...parsed, ...next }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(merged))
    } catch (error) {
        console.error('Failed to save auth session', error)
    }
}

export const axiosRequest = axios.create({
    baseURL: API_BASE_URL,
    timeout: 33000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

axiosRequest.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const session = loadStoredSession()
    if (session?.accessToken) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    return config
})

let isRefreshing = false
let refreshPromise: Promise<StoredSession | null> | null = null

async function refreshAccessToken(): Promise<StoredSession | null> {
    const session = loadStoredSession()
    if (!session?.refreshToken) return null

    if (!refreshPromise) {
        isRefreshing = true
        refreshPromise = axiosRequest
            .post('/auth/refresh', { refreshToken: session.refreshToken })
            .then((res) => {
                const data = res.data as { accessToken?: string; refreshToken?: string }
                if (!data.accessToken || !data.refreshToken) return null
                const next = { accessToken: data.accessToken, refreshToken: data.refreshToken }
                saveStoredSession(next)
                return next
            })
            .catch((error) => {
                console.error('Refresh token failed', error)
                localStorage.removeItem(AUTH_STORAGE_KEY)
                return null
            })
            .finally(() => {
                isRefreshing = false
                refreshPromise = null
            })
    }

    return refreshPromise
}

axiosRequest.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined
        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error)
        }

        // Only try refresh on 401
        if (error.response?.status === 401) {
            originalRequest._retry = true
            const refreshed = isRefreshing ? await refreshPromise : await refreshAccessToken()

            if (refreshed?.accessToken) {
                originalRequest.headers = originalRequest.headers || {}
                originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`
                return axiosRequest(originalRequest)
            }
        }

        return Promise.reject(error)
    }
)