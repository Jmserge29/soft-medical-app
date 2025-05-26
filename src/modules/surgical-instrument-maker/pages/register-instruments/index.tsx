import React, { useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  useSurgicalInstruments,
} from '../../hooks/useSurgical';
import axios from 'axios';
import { useAuthStore } from '@auth/stores/auth';

const RegisterInstruments: React.FC = () => {
 const accessToken = useAuthStore((state) => state.accessToken);

  const {
    filteredInstrumentos,
    searchTerm,
    filters,
    showCreateModal,
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
    processApiResponse,

    // Manejadores principales
    handleCreateInstrumento,
    handleDeleteInstrumento,
    handleToggleEsterilizacion,

    // Manejadores de UI
    clearFilters,
    updateFilters,
    updateNewInstrumento,

    // Setters
    setSearchTerm,
    setShowCreateModal,
    setError,
  } = useSurgicalInstruments({accessToken});

  // Función para obtener instrumentos desde la API
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

      // Procesar la respuesta usando la función del hook
      const instrumentosData = processApiResponse(res.data);
      console.log('Instrumentos obtenidos:', instrumentosData);
      
      // Aquí deberías actualizar el estado de instrumentos en el hook
      // Si necesitas una función setInstrumentos en el hook, agrégala
      
    } catch (error) {
      console.log('Error fetching instruments: ', error);
      setError('Error al cargar los instrumentos');
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  const handleCreateNewInstrument = async () => {
    const success = await handleCreateInstrumento();
    if (success) {
      await fetchInstruments();
    }
  };

  const handleDeleteInstrumentWithRefresh = async (id: number) => {
    await handleDeleteInstrumento(id);
    await fetchInstruments();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando instrumentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-4">
      {/* Blur Effects */}
      <div className="absolute right-10 z-10 blur-[100px] bg-purple-500 rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>
      <div className="absolute bottom-2 z-10 blur-[100px] bg-blue-500 rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>

      <div className="relative max-w-7xl mx-auto z-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Instrumentos Quirúrgicos
          </h1>
          <p className="text-gray-600">
            Gestiona y monitorea todos los instrumentos quirúrgicos del hospital
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Instrumentos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Esterilizados</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.esterilizados}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">No Esterilizados</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.noEsterilizados}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tipos Disponibles
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tiposInstrumento.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar instrumentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Filtro por Tipo de Instrumento */}
              <select
                value={filters.nombreTipoInstrumento}
                onChange={(e) => updateFilters('nombreTipoInstrumento', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                {tiposInstrumento.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>

              {/* Filtro por Esterilización */}
              <select
                value={
                  filters.esterilizacionInstrumental === null 
                    ? "" 
                    : filters.esterilizacionInstrumental.toString()
                }
                onChange={(e) => {
                  const value = e.target.value === "" 
                    ? null 
                    : e.target.value === "true";
                  updateFilters('esterilizacionInstrumental', value);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="true">Esterilizados</option>
                <option value="false">No Esterilizados</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 inline mr-2" />
                Limpiar
              </button>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Instrumento
            </button>
          </div>
        </div>

        {/* Instruments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del Instrumento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Instrumento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado de Esterilización
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstrumentos.map((instrumento) => (
                  <tr key={instrumento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {instrumento.id}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {instrumento.nombreInstrumental}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTipoColor(instrumento.tipoInstrumental)}`}
                      >
                        {instrumento.tipoInstrumental}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleEsterilizacion(instrumento.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border transition-colors ${getEsterilizacionColor(instrumento.esterilizacionInstrumental)}`}
                      >
                        {getEsterilizacionText(instrumento.esterilizacionInstrumental)}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex">
                        <button
                          onClick={() => handleDeleteInstrumentWithRefresh(instrumento.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Eliminar instrumento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInstrumentos.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron instrumentos
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros o crear un nuevo instrumento.
              </p>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Crear Nuevo Instrumento
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Instrumento *
                    </label>
                    <input
                      type="text"
                      value={newInstrumento.nombreInstrumental || ''}
                      onChange={(e) =>
                        updateNewInstrumento('nombreInstrumental', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Bisturí Electrónico"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Instrumento *
                    </label>
                    <select
                      value={newInstrumento.tipoInstrumental || ''}
                      onChange={(e) =>
                        updateNewInstrumento('tipoInstrumental', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposInstrumento.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                      {/* Opción para agregar nuevo tipo */}
                      <option value="Corte">Corte</option>
                      <option value="Sujeción">Sujeción</option>
                      <option value="Aspiración">Aspiración</option>
                      <option value="Cauterización">Cauterización</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado de Esterilización
                    </label>
                    <select
                      value={newInstrumento.esterilizacionInstrumental ? 'true' : 'false'}
                      onChange={(e) =>
                        updateNewInstrumento('esterilizacionInstrumental', e.target.value === 'true')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">No Esterilizado</option>
                      <option value="true">Esterilizado</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateNewInstrument}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creando...' : 'Crear Instrumento'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterInstruments;
