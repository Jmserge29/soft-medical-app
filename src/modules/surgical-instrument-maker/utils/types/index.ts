export interface ApiResponse<T> {
  /** Indica si la operación fue exitosa. */
  exito: boolean
  /** Datos devueltos por la API. */
  datos: T[]
  /** Errores, si los hay. */
  mensaje: string
}

export interface ContratoCirugiasUsuario {
  id: number
  idTipoCirugia: number
  horaProgramada: string
  horaInicio: string | null
  horaFin: string | null
  numQuirofano: number
  nombrePaciente: string
  tipoIdentificacionPaciente: string
  edadPaciente: number
  tipoEpsPaciente: string
  generoPaciente: string
  tipoCirugia: string
}
