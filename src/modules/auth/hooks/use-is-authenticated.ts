import { useAuthStore } from '@auth/stores/auth'

export function useIsAuthenticated() {
  const accessToken = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.user)
  const isAuthenticated = accessToken !== undefined && !!user
  // const isAuthenticated = false
  return isAuthenticated
}
