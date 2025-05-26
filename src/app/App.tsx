import { Dashboard } from '@/modules/dashboard/Router'
import { Router } from '@shared/components/routing/router'

import { BrowserRouter } from 'react-router';

function App() {
  // return <Router />
  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )
}

export default App
