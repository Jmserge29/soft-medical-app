import { useState, useMemo } from 'react'

// Tipos TypeScript
export interface SurgicalInstrument {
  id: string
  name: string
  category: string
  type: string
  status: 'available' | 'in-use' | 'maintenance' | 'sterilization'
  location: string
  lastMaintenance: string
  nextMaintenance: string
  serialNumber: string
  manufacturer: string
  acquisitionDate: string
  notes?: string
}

interface FilterState {
  category: string
  status: string
  location: string
}

export function useSurgicalInstruments() {
  const [instruments, setInstruments] = useState<SurgicalInstrument[]>([
    {
      id: '1',
      name: 'Bisturí Electrónico',
      category: 'Corte',
      type: 'Electrónico',
      status: 'available',
      location: 'Quirófano 1',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      serialNumber: 'BE-001',
      manufacturer: 'MedTech Pro',
      acquisitionDate: '2023-06-10',
      notes: 'Calibrado recientemente',
    },
    {
      id: '2',
      name: 'Forceps Kelly',
      category: 'Sujeción',
      type: 'Manual',
      status: 'in-use',
      location: 'Quirófano 2',
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-05-01',
      serialNumber: 'FK-045',
      manufacturer: 'SurgicalPro',
      acquisitionDate: '2023-03-20',
    },
    {
      id: '3',
      name: 'Monitor de Signos Vitales',
      category: 'Monitoreo',
      type: 'Electrónico',
      status: 'maintenance',
      location: 'Taller Técnico',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-03-20',
      serialNumber: 'MSV-102',
      manufacturer: 'VitalCare',
      acquisitionDate: '2022-11-05',
      notes: 'Revisión de sensores',
    },
    {
      id: '4',
      name: 'Tijeras Metzenbaum',
      category: 'Corte',
      type: 'Manual',
      status: 'sterilization',
      location: 'Central de Esterilización',
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-05-10',
      serialNumber: 'TM-078',
      manufacturer: 'PrecisionTools',
      acquisitionDate: '2023-08-15',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    status: '',
    location: '',
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingInstrument, setEditingInstrument] = useState<SurgicalInstrument | null>(null)
  const [newInstrument, setNewInstrument] = useState<Partial<SurgicalInstrument>>({
    name: '',
    category: '',
    type: '',
    status: 'available',
    location: '',
    serialNumber: '',
    manufacturer: '',
    acquisitionDate: '',
    notes: '',
  })

  // Opciones para filtros
  const categories = ['Corte', 'Sujeción', 'Monitoreo', 'Aspiración', 'Cauterización']
  const statuses = ['available', 'in-use', 'maintenance', 'sterilization']
  const locations = [
    'Quirófano 1',
    'Quirófano 2',
    'Quirófano 3',
    'Central de Esterilización',
    'Taller Técnico',
    'Almacén',
  ]

  // Instrumentos filtrados
  const filteredInstruments = useMemo(() => {
    return instruments.filter(instrument => {
      const matchesSearch =
        instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instrument.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = !filters.category || instrument.category === filters.category
      const matchesStatus = !filters.status || instrument.status === filters.status
      const matchesLocation = !filters.location || instrument.location === filters.location

      return matchesSearch && matchesCategory && matchesStatus && matchesLocation
    })
  }, [instruments, searchTerm, filters])

  // Estadísticas computadas
  const stats = useMemo(
    () => ({
      total: instruments.length,
      available: instruments.filter(i => i.status === 'available').length,
      inUse: instruments.filter(i => i.status === 'in-use').length,
      maintenance: instruments.filter(i => i.status === 'maintenance').length,
      sterilization: instruments.filter(i => i.status === 'sterilization').length,
    }),
    [instruments],
  )

  // Funciones de utilidad
  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      'in-use': 'bg-blue-100 text-blue-800 border-blue-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      sterilization: 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusText = (status: string) => {
    const texts = {
      available: 'Disponible',
      'in-use': 'En Uso',
      maintenance: 'Mantenimiento',
      sterilization: 'Esterilización',
    }
    return texts[status as keyof typeof texts] || status
  }

  // Validación de instrumento
  const validateInstrument = (instrument: Partial<SurgicalInstrument>): boolean => {
    return !!(instrument.name && instrument.category && instrument.serialNumber)
  }

  // Manejadores de eventos
  const handleCreateInstrument = () => {
    if (!validateInstrument(newInstrument)) {
      return false
    }

    const instrument: SurgicalInstrument = {
      id: Date.now().toString(),
      name: newInstrument.name!,
      category: newInstrument.category!,
      type: newInstrument.type || 'Manual',
      status: (newInstrument.status as SurgicalInstrument['status']) || 'available',
      location: newInstrument.location || '',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      serialNumber: newInstrument.serialNumber!,
      manufacturer: newInstrument.manufacturer || '',
      acquisitionDate: newInstrument.acquisitionDate || new Date().toISOString().split('T')[0],
      notes: newInstrument.notes || '',
    }

    setInstruments(prev => [...prev, instrument])
    resetForm()
    return true
  }

  const handleUpdateInstrument = (updatedInstrument: SurgicalInstrument) => {
    setInstruments(prev =>
      prev.map(inst => (inst.id === updatedInstrument.id ? updatedInstrument : inst)),
    )
    setEditingInstrument(null)
  }

  const handleDeleteInstrument = (id: string) => {
    setInstruments(prev => prev.filter(inst => inst.id !== id))
  }

  const resetForm = () => {
    setNewInstrument({
      name: '',
      category: '',
      type: '',
      status: 'available',
      location: '',
      serialNumber: '',
      manufacturer: '',
      acquisitionDate: '',
      notes: '',
    })
    setShowCreateModal(false)
  }

  const clearFilters = () => {
    setFilters({ category: '', status: '', location: '' })
    setSearchTerm('')
  }

  const updateFilters = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const updateNewInstrument = (key: keyof SurgicalInstrument, value: string) => {
    setNewInstrument(prev => ({ ...prev, [key]: value }))
  }

  return {
    // Estados
    instruments,
    filteredInstruments,
    searchTerm,
    filters,
    showCreateModal,
    editingInstrument,
    newInstrument,
    stats,

    // Opciones
    categories,
    statuses,
    locations,

    // Funciones de utilidad
    getStatusColor,
    getStatusText,
    validateInstrument,

    // Manejadores
    handleCreateInstrument,
    handleUpdateInstrument,
    handleDeleteInstrument,
    resetForm,
    clearFilters,
    updateFilters,
    updateNewInstrument,

    // Setters
    setFilters,
    setSearchTerm,
    setNewInstrument,
    setShowCreateModal,
    setEditingInstrument,
  }
}
