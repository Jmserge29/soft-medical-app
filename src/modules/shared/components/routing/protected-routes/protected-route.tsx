import { AuthRoutes } from '@auth/utils/routes'
import { Navigate, Outlet } from 'react-router'

interface Props {
  /**
   * Route to redirect
   */
  redirectTo?: string
  /**
   * If is authorized to access the route
   */
  isAuthorized: boolean
}

export const ProtectedRoute: React.FC<Props> = ({
  isAuthorized,
  redirectTo = AuthRoutes.Login,
}) => {
  return isAuthorized ? <Outlet /> : <Navigate to={redirectTo} replace />
}
