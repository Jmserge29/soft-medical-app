import React from 'react'
import { CheckCircle, Lock, Grid3X3 } from 'lucide-react'

interface Step {
  id: number
  title: string
  status: 'completed' | 'in-progress' | 'pending'
}

interface StepProgressProps {
  titleProgress?: string
  steps: Step[]
}

export const StepProgress: React.FC<StepProgressProps> = ({ steps, titleProgress }) => {
  const getStepIcon = (step: Step) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-white" />
      case 'in-progress':
        return <Lock className="w-6 h-6 text-white" />
      case 'pending':
        return <Grid3X3 className="w-6 h-6 text-gray-400" />
      default:
        return <Grid3X3 className="w-6 h-6 text-gray-400" />
    }
  }

  const getStepStyles = (step: Step) => {
    switch (step.status) {
      case 'completed':
        return {
          circle: 'bg-green-500 border-green-500',
          text: 'text-gray-900',
          label: 'text-green-600',
          line: 'bg-green-500',
        }
      case 'in-progress':
        return {
          circle: 'bg-blue-500 border-blue-500',
          text: 'text-gray-900',
          label: 'text-blue-600',
          line: 'bg-gray-300',
        }
      case 'pending':
        return {
          circle: 'bg-gray-200 border-gray-300',
          text: 'text-gray-500',
          label: 'text-gray-400',
          line: 'bg-gray-300',
        }
      default:
        return {
          circle: 'bg-gray-200 border-gray-300',
          text: 'text-gray-500',
          label: 'text-gray-400',
          line: 'bg-gray-300',
        }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      default:
        return 'Pending'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div>
        <h4>{titleProgress}</h4>
      </div>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const styles = getStepStyles(step)
          const isLastStep = index === steps.length - 1

          return (
            <div key={step.id} className="flex flex-col items-center relative flex-1">
              {/* Línea conectora */}
              {!isLastStep && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 ${styles.line} transform translate-x-1/2 z-0`}
                />
              )}

              {/* Círculo del paso */}
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 ${styles.circle}`}
              >
                {getStepIcon(step)}
              </div>

              {/* Información del paso */}
              <div className="mt-3 text-center">
                <div className="text-xs text-gray-500 font-medium mb-1">STEP {step.id}</div>
                <div className={`text-sm font-semibold ${styles.text} mb-1`}>{step.title}</div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${styles.label}`}>
                  {getStatusText(step.status)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
