import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import type { Role } from '../api/types'

type AuthContextType = {
  token: string | null
  role: Role | null
  setRole: (role: Role | null) => void
  login: (token: string, role?: Role | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'sdo_token'
const ROLE_KEY = 'sdo_role'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [role, setRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem(ROLE_KEY) as Role | null
    return saved && ['student', 'teacher', 'admin', 'unknown'].includes(saved) ? saved : null
  })

  const login = (nextToken: string, nextRole?: Role | null) => {
    setToken(nextToken)
    localStorage.setItem(TOKEN_KEY, nextToken)
    if (nextRole) {
      setRole(nextRole)
      localStorage.setItem(ROLE_KEY, nextRole)
    }
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
  }

  const value = useMemo(
    () => ({
      token,
      role,
      login,
      logout,
      setRole,
    }),
    [token, role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
