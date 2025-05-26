import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ContractLogin } from '@auth/utils/types/auth-types'

interface Store extends Partial<ContractLogin> {
  setData: (params: Partial<ContractLogin>) => void
}

export const useAuthStore = create<Store>()(
  persist(
    set => ({
      accessToken: undefined,
      refreshToken: undefined,
      setData: params => {
        set({
          accessToken: params?.accessToken,
          refreshToken: params?.refreshToken,
          user: params?.user,
        })
      },
      user: undefined,
    }),
    { name: 'Authentication-Soft-Medical-v1' },
  ),
)
