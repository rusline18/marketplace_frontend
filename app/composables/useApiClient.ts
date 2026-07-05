export function useAuthToken() {
  return useCookie<string | null>('auth_token', { default: () => null })
}

export function useApiClient() {
  const config = useRuntimeConfig()
  const token = useAuthToken()

  const apiBase = import.meta.server ? config.apiBaseInternal : config.public.apiBase

  return $fetch.create({
    baseURL: `${apiBase}/api/v1`,
    onRequest({ options }) {
      const headers = new Headers(options.headers)
      headers.set('Accept', 'application/json')
      if (token.value) {
        headers.set('Authorization', `Bearer ${token.value}`)
      }
      options.headers = headers
    },
  })
}
