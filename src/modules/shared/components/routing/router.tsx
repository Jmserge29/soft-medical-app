import { Suspense } from "react"
import { Toaster } from "react-hot-toast"
import { BrowserRouter, Route } from "react-router-dom"

const Router = () => {
    const { isAuthenticated } = useAuth()
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

export default Router