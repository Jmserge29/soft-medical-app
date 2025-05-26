import { StepProgress } from '@design-ui/components/steps'

const MySurgeries = () => {
  const steps = [
    { id: 1, title: 'Iniciar cirguría', status: 'completed' as const },
    { id: 2, title: 'Cirugía en proceso', status: 'pending' as const },
    { id: 3, title: 'Finaliza cirugía', status: 'pending' as const },
  ]
  return (
    <section className="min-h-screen bg-gray-50 p-6 mt-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Instrumentos Quirúrgicos
          </h1>
          <p className="text-gray-600">
            Gestiona y monitorea todos los instrumentos quirúrgicos del hospital
          </p>
        </div>
        <section className="grid grid-cols-2 gap-4">
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
          <StepProgress steps={steps} titleProgress="Cirgugía número 1" />
        </section>
      </div>
    </section>
  )
}

export default MySurgeries
