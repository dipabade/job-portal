import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth-provider'

 const ProtectedRoute = ({ allowedRoles })  => {
  const { user, role } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />
  return <Outlet />
}

export default ProtectedRoute;
