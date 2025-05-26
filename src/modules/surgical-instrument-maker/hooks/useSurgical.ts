import axios from 'axios'
import { useState, useMemo, useEffect } from 'react'

// ====== NUEVOS TIPOS BASADOS EN TU API ======

export interface InstrumentoQuirurgico {
  id: number
  idTipoInstrumento: number
  tipoInstrumental: string
  nombreInstrumental: string
  esterilizacionInstrumental: boolean
}

// Interface para respuesta de la API
export interface IApiResponseInstrumentos {
  exito: boolean
  mensaje: string
  datos: InstrumentoQuirurgico[]
}

// Filtros simplificados basados en tu estructura
interface FilterState {
  nombreTipoInstrumento: string
  esterilizacionInstrumental: boolean | null // null = todos, true = esterilizados, false = no esterilizados
}

// ====== CUSTOM HOOK ACTUALIZADO ======

export function useSurgicalInstruments({accessToken}: { accessToken: `${string}.${string}.${string}` | undefined }) {
  // Estado principal con datos de ejemplo basados en tu estructura
  const [instrumentos, setInstrumentos] = useState<InstrumentoQuirurgico[]>([])

  // Estados de UI
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    nombreTipoInstrumento: '',
    esterilizacionInstrumental: null,
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingInstrumento, setEditingInstrumento] = useState<InstrumentoQuirurgico | null>(null)
  const [newInstrumento, setNewInstrumento] = useState<Partial<InstrumentoQuirurgico>>({
    tipoInstrumental: '',
    nombreInstrumental: '',
    esterilizacionInstrumental: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Opciones para filtros (basadas en los datos existentes)
  const tiposInstrumento = useMemo(() => {
    const tipos = new Set(instrumentos.map(inst => inst.tipoInstrumental))
    return Array.from(tipos).sort()
  }, [instrumentos])

  // Instrumentos filtrados
  const filteredInstrumentos = useMemo(() => {
    return instrumentos.filter(instrumento => {
      // Filtro de búsqueda por nombre
      const matchesSearch = 
        instrumento.nombreInstrumental.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrumento.tipoInstrumental.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro por tipo de instrumento
      const matchesTipo = !filters.nombreTipoInstrumento || 
        instrumento.tipoInstrumental === filters.nombreTipoInstrumento

      // Filtro por esterilización
      const matchesEsterilizacion = filters.esterilizacionInstrumental === null || 
        instrumento.esterilizacionInstrumental === filters.esterilizacionInstrumental

      return matchesSearch && matchesTipo && matchesEsterilizacion
    })
  }, [instrumentos, searchTerm, filters])

  // Estadísticas computadas
  const stats = useMemo(() => ({
    total: instrumentos.length,
    esterilizados: instrumentos.filter(i => i.esterilizacionInstrumental).length,
    noEsterilizados: instrumentos.filter(i => !i.esterilizacionInstrumental).length,
    porTipo: tiposInstrumento.reduce((acc, tipo) => {
      acc[tipo] = instrumentos.filter(i => i.tipoInstrumental === tipo).length
      return acc
    }, {} as Record<string, number>)
  }), [instrumentos, tiposInstrumento])

  // ====== FUNCIONES DE UTILIDAD ======

  const getEsterilizacionColor = (esterilizado: boolean) => {
    return esterilizado 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200'
  }

  const getEsterilizacionText = (esterilizado: boolean) => {
    return esterilizado ? 'Esterilizado' : 'No Esterilizado'
  }

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'Monitoreo': 'bg-blue-100 text-blue-800 border-blue-200',
      'Esterilización': 'bg-purple-100 text-purple-800 border-purple-200',
      'Corte': 'bg-orange-100 text-orange-800 border-orange-200',
      'Sujeción': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Validación
  const validateInstrumento = (instrumento: Partial<InstrumentoQuirurgico>): boolean => {
    return !!(
      instrumento.nombreInstrumental?.trim() && 
      instrumento.tipoInstrumental?.trim()
    )
  }

  // ====== API FUNCTIONS ======

  // Función para procesar respuesta de la API
  const processApiResponse = (response: IApiResponseInstrumentos): InstrumentoQuirurgico[] => {
    if (!response.exito) {
      throw new Error(response.mensaje || 'Error al obtener instrumentos')
    }
    return response.datos
  }

  // Simular carga desde API
  const loadInstrumentos = async (): Promise<void> => {
    setLoading(true)
    setError(null)
      try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/instrumentos`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setInstrumentos(res.data.datos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // ====== MANEJADORES DE EVENTOS ======

  const handleCreateInstrumento = async (): Promise<boolean> => {
    if (!validateInstrumento(newInstrumento)) {
      setError('Por favor completa todos los campos requeridos')
      return false
    }

    setLoading(true)
    try {
      const instrumento: InstrumentoQuirurgico = {
        idTipoInstrumento: 0, // ID temporal, deberías obtenerlo de la API o de un select
        id: Math.max(...instrumentos.map(i => i.id), 0) + 1, // ID temporal
        tipoInstrumental: newInstrumento.tipoInstrumental!,
        nombreInstrumental: newInstrumento.nombreInstrumental!,
        esterilizacionInstrumental: newInstrumento.esterilizacionInstrumental || false,
      }

      // Aquí harías la llamada a la API para crear
      // await fetch('/api/instrumentos', { method: 'POST', body: JSON.stringify(instrumento) })
      
      setInstrumentos(prev => [...prev, instrumento])
      resetForm()
      setError(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear instrumento')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInstrumento = async (updatedInstrumento: InstrumentoQuirurgico): Promise<void> => {
    setLoading(true)
    try {
      // Aquí harías la llamada a la API para actualizar
      // await fetch(`/api/instrumentos/${updatedInstrumento.id}`, { method: 'PUT', body: JSON.stringify(updatedInstrumento) })
      
      setInstrumentos(prev =>
        prev.map(inst => (inst.id === updatedInstrumento.id ? updatedInstrumento : inst))
      )
      setEditingInstrumento(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar instrumento')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInstrumento = async (id: number): Promise<void> => {
    setLoading(true)
    try {
      // Aquí harías la llamada a la API para eliminar
      // await fetch(`/api/instrumentos/${id}`, { method: 'DELETE' })
      
      setInstrumentos(prev => prev.filter(inst => inst.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar instrumento')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEsterilizacion = async (id: number): Promise<void> => {
    const instrumento = instrumentos.find(i => i.id === id)
    if (!instrumento) return

    const updated = {
      ...instrumento,
      esterilizacionInstrumental: !instrumento.esterilizacionInstrumental
    }

    await handleUpdateInstrumento(updated)
  }

  // ====== FUNCIONES DE UTILIDAD UI ======

  const resetForm = () => {
    setNewInstrumento({
      tipoInstrumental: '',
      nombreInstrumental: '',
      esterilizacionInstrumental: false,
    })
    setShowCreateModal(false)
    setError(null)
  }

  const clearFilters = () => {
    setFilters({ 
      nombreTipoInstrumento: '', 
      esterilizacionInstrumental: null 
    })
    setSearchTerm('')
  }

  const updateFilters = (key: keyof FilterState, value: string | boolean | null) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const updateNewInstrumento = (key: keyof InstrumentoQuirurgico, value: string | boolean | number) => {
    setNewInstrumento(prev => ({ ...prev, [key]: value }))
  }

    useEffect(() => {
      loadInstrumentos();
    }, []);
  

  // ====== RETURN DEL HOOK ======

  return {
    // Estados principales
    instrumentos,
    filteredInstrumentos,
    searchTerm,
    filters,
    showCreateModal,
    editingInstrumento,
    newInstrumento,
    stats,
    loading,
    error,

    // Opciones
    tiposInstrumento,

    // Funciones de utilidad
    getEsterilizacionColor,
    getEsterilizacionText,
    getTipoColor,
    validateInstrumento,
    processApiResponse,

    // Manejadores principales
    handleCreateInstrumento,
    handleUpdateInstrumento,
    handleDeleteInstrumento,
    handleToggleEsterilizacion,
    loadInstrumentos,

    // Manejadores de UI
    resetForm,
    clearFilters,
    updateFilters,
    updateNewInstrumento,

    // Setters directos
    setFilters,
    setSearchTerm,
    setNewInstrumento,
    setShowCreateModal,
    setEditingInstrumento,
    setError,
  }
}