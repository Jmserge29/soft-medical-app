import { Navigate, Route } from 'react-router'
import { AuthRoutes } from '@auth/utils/routes'
import { lazy } from 'react'
import { RoutesWithNotFound } from '../not-found/routes-with-not-found'
const Login = lazy(() => import('@auth/pages/login'))

export const PublicRoutesProvider = () => {
  return (
    <RoutesWithNotFound>
      <Route index element={<Navigate to={'/'} />} />
      <Route path={AuthRoutes.Login} element={<Login />} />
    </RoutesWithNotFound>
  )
}
