import { StepProgress } from '@design-ui/components/steps';
import useCirugias from '../../hooks/useCirugias';
import { useAuthStore } from '@auth/stores/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface IInstruments {
  id: number;
  idTipoInstrumento: number;
  esterilizacionInstrumental: boolean;
  nombreInstrumental: string;
}

const MySurgeries = () => {
  const { user, accessToken } = useAuthStore();
  const { cargando, cirugias, refrescarCirugias } = useCirugias({
    idUsuario: user?.idUsuario ?? 0,
    accessToken,
  });
  const [instruments, setInstruments] = useState<IInstruments[]>([]);

  const fetchInstruments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/instrumentos`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setInstruments(res.data.datos);
    } catch (error) {
      console.log('Error fetching instruments: ', error);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 p-6 mt-4">
      {/* Blur */}
      <div className="absolute left-[600px] blur-[80px] top-18 z-10 bg-purple-300 rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>
      <div className="absolute right-12 z-10 bg-blue-500 blur-[80px] rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>
      <div className="absolute left-[350px] bottom-38 z-10 blur-[80px] bg-indigo-500 rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>
      <div className="absolute right-[500px] bottom-2 z-10 blur-[80px] bg-fuchsia-500 rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>

      <div className="relative max-w-7xl mx-auto z-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Instrumentos Quirúrgicos
          </h1>
          <p className="text-gray-600">
            Gestiona y monitorea todos los instrumentos quirúrgicos del hospital
          </p>
        </div>
        <section className="grid grid-cols-2 gap-4">
          {cargando && 'cargando...'}
          {cirugias.length === 0 && !cargando && (
            <p className="text-gray-500 text-xl">No hay cirugías registradas</p>
          )}
          {!cargando &&
            cirugias.map((cirugia, index) => {
              let status: 'pending' | 'in-progress' | 'completed';
              if (cirugia.horaInicio !== null && cirugia.horaFin !== null) {
                status = 'completed';
              } else if (cirugia.horaInicio !== null) {
                status = 'in-progress';
              } else {
                status = 'pending';
              }

              return (
                <StepProgress
                  steps={[
                    {
                      id: 1,
                      title: 'Iniciar cirugía',
                      status:
                        status === 'pending'
                          ? 'pending'
                          : ('completed' as const),
                    },
                    {
                      id: 2,
                      title: 'Cirugía en proceso',
                      status:
                        status === 'in-progress'
                          ? 'in-progress'
                          : status === 'completed'
                            ? 'completed'
                            : ('pending' as const),
                    },
                    {
                      id: 3,
                      title: 'Finaliza cirugía',
                      status:
                        status === 'completed'
                          ? 'completed'
                          : ('pending' as const),
                    },
                  ]}
                  titleProgress={`Cirugía N° ${index + 1}`}
                  cirugia={cirugia}
                  refrescarCirugias={refrescarCirugias}
                  instruments={instruments}
                />
              );
            })}
        </section>
      </div>
    </section>
  );
};

export default MySurgeries;
