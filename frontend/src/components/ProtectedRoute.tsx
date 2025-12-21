import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import type { Role } from '../api/types'

type Props = {
  children: ReactNode
  allowRoles?: Role[]
}

const ProtectedRoute = ({ children, allowRoles }: Props) => {
  const { token, role } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowRoles && role && !allowRoles.includes(role)) {
    return <Navigate to="/subjects" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
