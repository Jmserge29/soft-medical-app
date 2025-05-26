import { Route, Routes } from 'react-router'

export const RoutesWithNotFound: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}
