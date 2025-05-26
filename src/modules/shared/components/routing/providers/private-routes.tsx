import { Route } from 'react-router'
import { lazy } from 'react'
import { RoutesWithNotFound } from '../not-found/routes-with-not-found'
import { SurgicalInstrumentRoutes } from '@/modules/surgical-instrument-maker/utils/routes/SurgicalInstrumentRoutes'
import { AppSidebar } from '@design-ui/components/sidebar/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
const RegisterInstruments = lazy(
  () => import('@/modules/surgical-instrument-maker/pages/register-instruments'),
)
const MySurgeries = lazy(() => import('@/modules/surgical-instrument-maker/pages/my-surgeries'))
const Reports = lazy(() => import('@/modules/surgical-instrument-maker/pages/reports'))

export const PrivateRoutesProvider = () => {
  return (
    <section className="flex flex-col h-screen">
      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <div className="flex flex-col flex-1">
            <section className="flex-1">
              <RoutesWithNotFound>
                <Route
                  path={SurgicalInstrumentRoutes.RegisterInstruments}
                  element={<RegisterInstruments />}
                />
                <Route path={SurgicalInstrumentRoutes.MySurgeries} element={<MySurgeries />} />
                <Route path={SurgicalInstrumentRoutes.Reports} element={<Reports />} />
              </RoutesWithNotFound>
            </section>
            <footer className="w-full py-2 bg-white flex justify-center items-center">
              <strong className="font-family-nunito font-semibold text-xs text-black/40">
                SoftMedical
              </strong>
            </footer>
          </div>
        </SidebarProvider>
      </div>
    </section>
  )
}
