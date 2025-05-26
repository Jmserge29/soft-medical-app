import { Suspense } from 'react'
import { BrowserRouter, Route } from 'react-router'
import { PublicRoutesProvider } from './providers/public-routes'
import { PrivateRoutesProvider } from './providers/private-routes'
import { ProtectedRoute } from './protected-routes/protected-route'
import { useIsAuthenticated } from '@auth/hooks/use-is-authenticated'
import { RoutesWithNotFound } from './not-found/routes-with-not-found'
import { Toaster } from 'react-hot-toast'

export const Router = () => {
  const isAuthenticated = useIsAuthenticated()
  return (
    <BrowserRouter>
      <Suspense fallback={<>cargando...</>}>
        <Toaster position="top-center" reverseOrder={false} />
        <RoutesWithNotFound>
          <Route element={<ProtectedRoute isAuthorized={!isAuthenticated} />}>
            <Route path="/*" element={<PublicRoutesProvider />} />
          </Route>
          <Route element={<ProtectedRoute isAuthorized={isAuthenticated} />}>
            <Route path={``} element={<PrivateRoutesProvider />} />
          </Route>
        </RoutesWithNotFound>
      </Suspense>
    </BrowserRouter>
  )
}
