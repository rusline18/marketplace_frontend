export interface AuthUser {
  id: number
  name: string
  email: string
  created_at: string
}

interface AuthResponse {
  user: AuthUser
  token: string
}

export function useAuthUser() {
  return useState<AuthUser | null>('auth_user', () => null)
}

export function useAuth() {
  const api = useApiClient()
  const token = useAuthToken()
  const user = useAuthUser()

  const isAuthenticated = computed(() => user.value !== null)

  async function register(payload: { name: string, email: string, password: string, password_confirmation: string }) {
    const response = await api<AuthResponse>('/register', { method: 'POST', body: payload })
    token.value = response.token
    user.value = response.user
  }

  async function login(payload: { email: string, password: string }) {
    const response = await api<AuthResponse>('/login', { method: 'POST', body: payload })
    token.value = response.token
    user.value = response.user
  }

  async function logout() {
    if (token.value) {
      await api('/logout', { method: 'POST' }).catch(() => null)
    }
    token.value = null
    user.value = null
  }

  async function fetchMe() {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      user.value = await api<AuthUser>('/me')
    } catch {
      token.value = null
      user.value = null
    }

    return user.value
  }

  async function updateProfile(payload: Partial<{ name: string, email: string, password: string, password_confirmation: string }>) {
    user.value = await api<AuthUser>('/me', { method: 'PATCH', body: payload })
    return user.value
  }

  return { user, isAuthenticated, register, login, logout, fetchMe, updateProfile }
}
