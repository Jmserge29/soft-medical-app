import axios from 'axios'
import { ApiResponse, ContratoCirugiasUsuario } from '../utils/types'

export const obtenerCirugiasDelUsuario = async ({
  idUsuario,
  accessToken
}: {
  idUsuario: number
  accessToken: `${string}.${string}.${string}` | undefined
}): Promise<ContratoCirugiasUsuario[]> => {
  try {
    const res = await axios.get<ApiResponse<ContratoCirugiasUsuario>>(
      `${import.meta.env.VITE_API_URL}/cirugias/usuario/${idUsuario}`,
      {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      }
    )

    if (res.status === 200) {
      return res.data.datos.map(cirugia => ({
        id: cirugia.id,
        edadPaciente: cirugia.edadPaciente,
        generoPaciente: cirugia.generoPaciente,
        horaFin: cirugia.horaFin,
        horaInicio: cirugia.horaInicio,
        horaProgramada: cirugia.horaProgramada,
        idTipoCirugia: cirugia.idTipoCirugia,
        nombrePaciente: cirugia.nombrePaciente,
        numQuirofano: cirugia.numQuirofano,
        tipoCirugia: cirugia.tipoCirugia,
        tipoEpsPaciente: cirugia.tipoEpsPaciente,
        tipoIdentificacionPaciente: cirugia.tipoIdentificacionPaciente,
      }))
    } else {
      throw new Error('Error al obtener las cirugías del usuario')
    }
  } catch (error) {
    console.log('Error al iniciar sesión: ', error)
    return []
  }
}
