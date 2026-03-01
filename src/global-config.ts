const env = import.meta.env

export const appConfig = {
  apiBaseUrl: `${env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1`,
  wsUrl: env.VITE_WS_URL || env.VITE_API_BASE_URL || 'http://localhost:3000',
}
