import { StepProgress } from '@design-ui/components/steps'

const MySurgeries = () => {
  const steps = [
    { id: 1, title: 'Iniciar cirguría', status: 'completed' as const },
    { id: 2, title: 'Cirugía en proceso', status: 'pending' as const },
    { id: 3, title: 'Finaliza cirugía', status: 'pending' as const },
  ]
  return (
    <>
      <h2 className="text-4xl mt-6">Mis cirugías</h2>
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
    </>
  )
}

export default MySurgeries
