import { createContext } from 'react'

interface AuthContextType {
  claims?: Record<string, any> | null
  profile?: any | null
  isLoading: boolean
  isInitialized: boolean
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string) => Promise<any>
  signout: () => Promise<any>
  refreshProfile: () => Promise<any>
}

export const AuthContext = createContext<AuthContextType>({
  claims: undefined,
  profile: undefined,
  isLoading: true,
  isInitialized: true,
  login: async () => {},
  register: async () => {},
  signout: async () => {},
  refreshProfile: async () => {}
})
