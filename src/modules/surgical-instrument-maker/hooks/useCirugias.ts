import { useEffect, useState } from 'react'
import { obtenerCirugiasDelUsuario } from '../services/surgeries'
import { ContratoCirugiasUsuario } from '../utils/types'

function useCirugias({ idUsuario, accessToken }: { idUsuario: number; accessToken: `${string}.${string}.${string}` | undefined }) {
  const [cirugias, setCirugias] = useState<ContratoCirugiasUsuario[]>([])
  const [cargando, setCargando] = useState<boolean>(true)

  const refrescarCirugias = async () => {
    setCargando(true)
    obtenerCirugiasDelUsuario({ idUsuario, accessToken })
      .then(data => {
        setCirugias(data)
      })
      .catch(error => {
        console.error('Error al obtener las cirugías:', error)
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    if (idUsuario) {
      refrescarCirugias()
    }
  }, [idUsuario])
  return {
    cargando,
    cirugias,
    refrescarCirugias,
  }
}

export default useCirugias
