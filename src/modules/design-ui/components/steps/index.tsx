import React, { useState } from 'react';
import { CheckCircle, Lock, Grid3X3 } from 'lucide-react';
import { ContratoCirugiasUsuario } from '@/modules/surgical-instrument-maker/utils/types';
import axios from 'axios';
import { useAuthStore } from '@auth/stores/auth';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IInstruments } from '@/modules/surgical-instrument-maker/pages/my-surgeries';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Step {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface StepProgressProps {
  titleProgress?: string;
  steps: Step[];
  cirugia: ContratoCirugiasUsuario;
  refrescarCirugias: () => Promise<void>;
  instruments: IInstruments[];
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  titleProgress,
  cirugia,
  refrescarCirugias,
  instruments,
}) => {
  const [selectedInstruments, setSelectedInstruments] = useState<number[]>([]);
  const [reporte, setReporte] = useState('');
  const [open, setOpen] = useState(false);
  const { accessToken, user } = useAuthStore();

  const getStepIcon = (step: Step) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-white" />;
      case 'in-progress':
        return <Lock className="w-6 h-6 text-white" />;
      case 'pending':
        return <Grid3X3 className="w-6 h-6 text-gray-400" />;
      default:
        return <Grid3X3 className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStepStyles = (step: Step) => {
    switch (step.status) {
      case 'completed':
        return {
          circle: 'bg-green-500 border-green-500',
          text: 'text-gray-900',
          label: 'text-green-600',
          line: 'bg-green-500',
        };
      case 'in-progress':
        return {
          circle: 'bg-blue-500 border-blue-500',
          text: 'text-gray-900',
          label: 'text-blue-600',
          line: 'bg-gray-300',
        };
      case 'pending':
        return {
          circle: 'bg-gray-200 border-gray-300',
          text: 'text-gray-500',
          label: 'text-gray-400',
          line: 'bg-gray-300',
        };
      default:
        return {
          circle: 'bg-gray-200 border-gray-300',
          text: 'text-gray-500',
          label: 'text-gray-400',
          line: 'bg-gray-300',
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'In Progress';
      case 'Pendiente':
        return 'Pending';
      default:
        return 'Pending';
    }
  };

  const handleInitCirugia = async () => {
    if (cirugia.horaInicio === null) {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/cirugias/iniciar`,
          {
            idCirugia: cirugia.id,
            idInstrumentadores: [1],
            reportesIniciales: [reporte.trim()],
            idInstrumentos: selectedInstruments,
            idUsuario: user?.idUsuario,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(res);
        refrescarCirugias();
        toast.success('Cirugía iniciada correctamente');
        setOpen(false);
      } catch (error) {
        console.error('Error al iniciar cirugía:', error);
        toast.error('Error al iniciar cirugía');
      }
    } else {
      toast.error('La cirugía ya fue iniciada');
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl cursor-pointer transition-shadow duration-300"
      >
        <div className="flex items-center justify-center py-4">
          <h4>{titleProgress}</h4>
        </div>
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const styles = getStepStyles(step);
            const isLastStep = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative flex-1"
              >
                {!isLastStep && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 ${styles.line} transform translate-x-1/2 z-0`}
                  />
                )}

                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 ${styles.circle}`}
                >
                  {getStepIcon(step)}
                </div>

                <div className="mt-3 text-center">
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    Paso {step.id}
                  </div>
                  <div className={`text-sm font-semibold ${styles.text} mb-1`}>
                    {step.title}
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded ${styles.label}`}
                  >
                    {getStatusText(step.status)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selecciona los instrumentos</DialogTitle>
              <DialogDescription>
                Escoge los instrumentos que se usarán en esta cirugía.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Select
                onValueChange={(value) => {
                  const id = Number(value);
                  if (!selectedInstruments.includes(id)) {
                    setSelectedInstruments((prev) => [...prev, id]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar instrumentos" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-40">
                    {instruments.map((instrument) => (
                      <SelectItem
                        key={instrument.id}
                        value={instrument.id.toString()}
                      >
                        {instrument.nombreInstrumental}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>

              {/* Mostrar instrumentos seleccionados */}
              <div className="flex flex-wrap gap-2">
                {selectedInstruments.map((id) => {
                  const inst = instruments.find((i) => i.id === id);
                  return inst ? (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedInstruments((prev) =>
                          prev.filter((instId) => instId !== id)
                        )
                      }
                    >
                      {inst.nombreInstrumental} ✕
                    </Badge>
                  ) : null;
                })}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reporte inicial
                </label>
                <textarea
                  rows={4}
                  value={reporte}
                  onChange={(e) => setReporte(e.target.value)}
                  placeholder="Escribe el reporte inicial de la cirugía"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Botón para iniciar cirugía */}
              <button
                onClick={handleInitCirugia}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Iniciar cirugía
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
