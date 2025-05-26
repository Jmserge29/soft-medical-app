// ====== INTERFACES Y TIPOS ======

export interface IReporte {
  id: number
  idCirugia: number
  idInstrumentador: number
  fecha: string // ISO 8601 format
  descripcion: string
}

// Interface para respuesta de la API
export interface IApiResponseReportes {
  exito: boolean
  mensaje: string
  datos: IReporte[]
}

// Filtros para reportes
interface FilterStateReportes {
  idCirugia: number | null
  idInstrumentador: number | null
  fechaInicio: string
  fechaFin: string
}

// Tipos para ordenamiento
type SortField = 'id' | 'fecha' | 'idCirugia' | 'idInstrumentador'
type SortDirection = 'asc' | 'desc'

// ====== CUSTOM HOOK ======

import { useState, useMemo } from 'react'

export function useReportes() {
  // Estado principal con datos de ejemplo
  const [reportes, setReportes] = useState<IReporte[]>([
    {
      id: 3,
      idCirugia: 3,
      idInstrumentador: 1,
      fecha: "2025-05-26T12:32:33.876694",
      descripcion: "Reporte inicial"
    },
    {
      id: 6,
      idCirugia: 3,
      idInstrumentador: 2,
      fecha: "2025-05-26T13:49:32.336208",
      descripcion: "Reporte durante la cirugía."
    },
    {
      id: 7,
      idCirugia: 3,
      idInstrumentador: 1,
      fecha: "2025-05-26T13:54:50.845631",
      descripcion: "Reporte durante la cirugía."
    },
    {
      id: 8,
      idCirugia: 5,
      idInstrumentador: 3,
      fecha: "2025-05-25T10:15:22.123456",
      descripcion: "Reporte pre-operatorio"
    },
    {
      id: 9,
      idCirugia: 7,
      idInstrumentador: 2,
      fecha: "2025-05-24T16:45:11.987654",
      descripcion: "Reporte post-operatorio completo"
    }
  ])

  // Estados de UI
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterStateReportes>({
    idCirugia: null,
    idInstrumentador: null,
    fechaInicio: '',
    fechaFin: '',
  })
  const [sortField, setSortField] = useState<SortField>('fecha')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingReporte, setEditingReporte] = useState<IReporte | null>(null)
  const [newReporte, setNewReporte] = useState<Partial<IReporte>>({
    idCirugia: 0,
    idInstrumentador: 0,
    descripcion: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Opciones únicas para filtros (basadas en los datos existentes)
  const cirugiaIds = useMemo(() => {
    const ids = new Set(reportes.map(r => r.idCirugia))
    return Array.from(ids).sort((a, b) => a - b)
  }, [reportes])

  const instrumentadorIds = useMemo(() => {
    const ids = new Set(reportes.map(r => r.idInstrumentador))
    return Array.from(ids).sort((a, b) => a - b)
  }, [reportes])

  // Reportes filtrados y ordenados
  const filteredReportes = useMemo(() => {
    const filtered = reportes.filter(reporte => {
      // Filtro de búsqueda por descripción
      const matchesSearch = reporte.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro por ID de cirugía
      const matchesCirugia = filters.idCirugia === null || reporte.idCirugia === filters.idCirugia

      // Filtro por ID de instrumentador
      const matchesInstrumentador = filters.idInstrumentador === null || 
        reporte.idInstrumentador === filters.idInstrumentador

      // Filtro por rango de fechas
      const reporteDate = new Date(reporte.fecha)
      const matchesFechaInicio = !filters.fechaInicio || 
        reporteDate >= new Date(filters.fechaInicio)
      const matchesFechaFin = !filters.fechaFin || 
        reporteDate <= new Date(filters.fechaFin + 'T23:59:59')

      return matchesSearch && matchesCirugia && matchesInstrumentador && 
             matchesFechaInicio && matchesFechaFin
    })

    // Ordenamiento
    filtered.sort((a, b) => {
      let valueA: any = a[sortField]
      let valueB: any = b[sortField]

      // Manejo especial para fechas
      if (sortField === 'fecha') {
        valueA = new Date(valueA).getTime()
        valueB = new Date(valueB).getTime()
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    return filtered
  }, [reportes, searchTerm, filters, sortField, sortDirection])

  // Estadísticas computadas
  const stats = useMemo(() => ({
    total: reportes.length,
    hoy: reportes.filter(r => {
      const today = new Date().toISOString().split('T')[0]
      return r.fecha.startsWith(today)
    }).length,
    estaSemana: reportes.filter(r => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return new Date(r.fecha) >= weekAgo
    }).length,
    porCirugia: cirugiaIds.reduce((acc, id) => {
      acc[id] = reportes.filter(r => r.idCirugia === id).length
      return acc
    }, {} as Record<number, number>),
    porInstrumentador: instrumentadorIds.reduce((acc, id) => {
      acc[id] = reportes.filter(r => r.idInstrumentador === id).length
      return acc
    }, {} as Record<number, number>)
  }), [reportes, cirugiaIds, instrumentadorIds])

  // ====== FUNCIONES DE UTILIDAD ======

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearFechaCorta = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-CO')
  }

  const obtenerTiempoTranscurrido = (fecha: string): string => {
    const ahora = new Date().getTime()
    const fechaReporte = new Date(fecha).getTime()
    const diferencia = ahora - fechaReporte

    const minutos = Math.floor(diferencia / (1000 * 60))
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`
    return 'Hace un momento'
  }

  const validarReporte = (reporte: Partial<IReporte>): boolean => {
    return !!(
      reporte.idCirugia && 
      reporte.idInstrumentador && 
      reporte.descripcion?.trim()
    )
  }

  // ====== API FUNCTIONS ======

  const processApiResponse = (response: IApiResponseReportes): IReporte[] => {
    if (!response.exito) {
      throw new Error(response.mensaje || 'Error al obtener reportes')
    }
    return response.datos
  }

  const loadReportes = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      // Aquí harías tu llamada real a la API
      // const response = await fetch('/api/reportes')
      // const data = await response.json()
      // const reportes = processApiResponse(data)
      // setReportes(reportes)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Reportes cargados')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // ====== MANEJADORES DE EVENTOS ======

  const handleCreateReporte = async (): Promise<boolean> => {
    if (!validarReporte(newReporte)) {
      setError('Por favor completa todos los campos requeridos')
      return false
    }

    setLoading(true)
    try {
      const reporte: IReporte = {
        id: Math.max(...reportes.map(r => r.id), 0) + 1,
        idCirugia: newReporte.idCirugia!,
        idInstrumentador: newReporte.idInstrumentador!,
        fecha: new Date().toISOString(),
        descripcion: newReporte.descripcion!,
      }

      // Aquí harías la llamada a la API para crear
      // await fetch('/api/reportes', { method: 'POST', body: JSON.stringify(reporte) })
      
      setReportes(prev => [...prev, reporte])
      resetForm()
      setError(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear reporte')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateReporte = async (updatedReporte: IReporte): Promise<void> => {
    setLoading(true)
    try {
      // Aquí harías la llamada a la API para actualizar
      // await fetch(`/api/reportes/${updatedReporte.id}`, { method: 'PUT', body: JSON.stringify(updatedReporte) })
      
      setReportes(prev =>
        prev.map(rep => (rep.id === updatedReporte.id ? updatedReporte : rep))
      )
      setEditingReporte(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar reporte')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReporte = async (id: number): Promise<void> => {
    if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) return

    setLoading(true)
    try {
      // Aquí harías la llamada a la API para eliminar
      // await fetch(`/api/reportes/${id}`, { method: 'DELETE' })
      
      setReportes(prev => prev.filter(rep => rep.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar reporte')
    } finally {
      setLoading(false)
    }
  }

  // ====== FUNCIONES DE ORDENAMIENTO ======

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // ====== FUNCIONES DE UTILIDAD UI ======

  const resetForm = () => {
    setNewReporte({
      idCirugia: 0,
      idInstrumentador: 0,
      descripcion: '',
    })
    setShowCreateModal(false)
    setError(null)
  }

  const clearFilters = () => {
    setFilters({
      idCirugia: null,
      idInstrumentador: null,
      fechaInicio: '',
      fechaFin: '',
    })
    setSearchTerm('')
  }

  const updateFilters = (key: keyof FilterStateReportes, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const updateNewReporte = (key: keyof IReporte, value: string | number) => {
    setNewReporte(prev => ({ ...prev, [key]: value }))
  }

  const exportarReportes = (formato: 'csv' | 'json') => {
    const dataToExport = filteredReportes.map(reporte => ({
      ...reporte,
      fechaFormateada: formatearFecha(reporte.fecha)
    }))

    if (formato === 'csv') {
      const csv = [
        'ID,ID Cirugía,ID Instrumentador,Fecha,Descripción',
        ...dataToExport.map(r => 
          `${r.id},${r.idCirugia},${r.idInstrumentador},"${r.fechaFormateada}","${r.descripcion}"`
        )
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reportes_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
    } else {
      const json = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reportes_${new Date().toISOString().split('T')[0]}.json`
      a.click()
    }
  }

  // ====== RETURN DEL HOOK ======

  return {
    // Estados principales
    reportes,
    filteredReportes,
    searchTerm,
    filters,
    sortField,
    sortDirection,
    showCreateModal,
    editingReporte,
    newReporte,
    stats,
    loading,
    error,

    // Opciones
    cirugiaIds,
    instrumentadorIds,

    // Funciones de utilidad
    formatearFecha,
    formatearFechaCorta,
    obtenerTiempoTranscurrido,
    validarReporte,
    processApiResponse,

    // Manejadores principales
    handleCreateReporte,
    handleUpdateReporte,
    handleDeleteReporte,
    handleSort,
    loadReportes,
    exportarReportes,

    // Manejadores de UI
    resetForm,
    clearFilters,
    updateFilters,
    updateNewReporte,

    // Setters directos
    setReportes,
    setSearchTerm,
    setFilters,
    setSortField,
    setSortDirection,
    setShowCreateModal,
    setEditingReporte,
    setNewReporte,
    setError,
  }
}