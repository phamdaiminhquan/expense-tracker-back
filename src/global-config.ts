const env = import.meta.env

export const appConfig = {
  apiBaseUrl: env.VITE_API_BASE_URL || 'http://localhost:3000',
  gemini: {
    apiKey: env.VITE_GEMINI_API_KEY || '',
    service: env.VITE_GEMINI_API_SERVICE || 'generativelanguage.googleapis.com',
    version: env.VITE_GEMINI_API_VERSION || 'v1',
    model: env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite',
    method: env.VITE_GEMINI_METHOD || 'generateContent',
  },
}

export function buildGeminiUrl(config = appConfig.gemini): string {
  const { service, version, model, method } = config
  return `https://${service}/${version}/models/${model}:${method}`
}
