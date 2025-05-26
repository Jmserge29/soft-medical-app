import { RoutesWithNotFound } from '../not-found/routes-with-not-found'

export const PrivateRoutesProvider = () => {
  return (
    <section className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div className="flex flex-col flex-1">
          <section className="flex-1">
            <RoutesWithNotFound>{/* Routes */}</RoutesWithNotFound>
          </section>
          <footer className="w-full py-2 bg-white flex justify-center items-center">
            <strong className="font-family-nunito font-semibold text-xs text-black/40">
              SoftMedical
            </strong>
          </footer>
        </div>
      </div>
    </section>
  )
}
