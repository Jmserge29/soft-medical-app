import React, { useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User,
  Download,
  ChevronUp,
  ChevronDown,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useReportes, IReporte } from '../../hooks/useReportes'; // Ajusta la ruta
import axios from 'axios';
import { useAuthStore } from '@auth/stores/auth';

const Reports: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    // Estados principales
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
    processApiResponse,

    // Manejadores principales
    handleCreateReporte,
    handleUpdateReporte,
    handleDeleteReporte,
    handleSort,
    loadReportes,
    exportarReportes,

    // Manejadores de UI
    clearFilters,
    updateFilters,
    updateNewReporte,

    // Setters
    setSearchTerm,
    setShowCreateModal,
    setEditingReporte,
    setError,
    setReportes,
  } = useReportes();

  // Función para obtener reportes desde la API
  const fetchReportes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/reportes`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log({res})
      const reportesData = processApiResponse(res.data.datos);
      setReportes(reportesData);
      console.log('Reportes obtenidos:', reportesData);
      
    } catch (error) {
      console.log('Error fetching reports: ', error);
      setError('Error al cargar los reportes');
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  // Crear nuevo reporte con refresh
  const handleCreateNewReporte = async () => {
    const success = await handleCreateReporte();
    if (success) {
      await fetchReportes();
    }
  };

  // Eliminar reporte con refresh
  const handleDeleteReporteWithRefresh = async (id: number) => {
    await handleDeleteReporte(id);
    await fetchReportes();
  };

  // Obtener icono de ordenamiento
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
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
            Gestión de Reportes
          </h1>
          <p className="text-gray-600">
            Administra y monitorea todos los reportes de cirugías del hospital
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
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Reportes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoy</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.hoy}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.estaSemana}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Cirugías Activas
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {cirugiaIds.length}
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
                placeholder="Buscar en descripciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Filtro por Cirugía */}
              <select
                value={filters.idCirugia || ''}
                onChange={(e) => updateFilters('idCirugia', e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las cirugías</option>
                {cirugiaIds.map((id) => (
                  <option key={id} value={id}>
                    Cirugía #{id}
                  </option>
                ))}
              </select>

              {/* Filtro por Instrumentador */}
              <select
                value={filters.idInstrumentador || ''}
                onChange={(e) => updateFilters('idInstrumentador', e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los instrumentadores</option>
                {instrumentadorIds.map((id) => (
                  <option key={id} value={id}>
                    Instrumentador #{id}
                  </option>
                ))}
              </select>

              {/* Filtro por Fecha Inicio */}
              <input
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => updateFilters('fechaInicio', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Fecha inicio"
              />

              {/* Filtro por Fecha Fin */}
              <input
                type="date"
                value={filters.fechaFin}
                onChange={(e) => updateFilters('fechaFin', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Fecha fin"
              />

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 inline mr-2" />
                Limpiar
              </button>
            </div>

            {/* Export and Create Buttons */}
            <div className="flex gap-2">
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      exportarReportes(e.target.value as 'csv' | 'json');
                      e.target.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                >
                  <option value="">Exportar</option>
                  <option value="csv">Exportar CSV</option>
                  <option value="json">Exportar JSON</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('id')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    ID {getSortIcon('id')}
                  </th>
                  <th 
                    onClick={() => handleSort('idCirugia')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    ID Cirugía {getSortIcon('idCirugia')}
                  </th>
                  <th 
                    onClick={() => handleSort('idInstrumentador')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    ID Instrumentador {getSortIcon('idInstrumentador')}
                  </th>
                  <th 
                    onClick={() => handleSort('fecha')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Fecha {getSortIcon('fecha')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReportes.map((reporte) => (
                  <tr key={reporte.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{reporte.id}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-600">
                          Cirugía #{reporte.idCirugia}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-900">
                          Instrumentador #{reporte.idInstrumentador}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatearFechaCorta(reporte.fecha)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {obtenerTiempoTranscurrido(reporte.fecha)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={reporte.descripcion}>
                        {reporte.descripcion}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingReporte(reporte)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Editar reporte"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReporteWithRefresh(reporte.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Eliminar reporte"
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

          {filteredReportes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron reportes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros o crear un nuevo reporte.
              </p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Reportes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reportes por Cirugía */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Reportes por Cirugía</h4>
              <div className="space-y-2">
                {Object.entries(stats.porCirugia).map(([cirugia, count]) => (
                  <div key={cirugia} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cirugía #{cirugia}</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {count} reporte{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reportes por Instrumentador */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Reportes por Instrumentador</h4>
              <div className="space-y-2">
                {Object.entries(stats.porInstrumentador).map(([instrumentador, count]) => (
                  <div key={instrumentador} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Instrumentador #{instrumentador}</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {count} reporte{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Crear Nuevo Reporte
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Cirugía *
                    </label>
                    <select
                      value={newReporte.idCirugia || ''}
                      onChange={(e) => updateNewReporte('idCirugia', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar cirugía</option>
                      {cirugiaIds.map((id) => (
                        <option key={id} value={id}>
                          Cirugía #{id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Instrumentador *
                    </label>
                    <select
                      value={newReporte.idInstrumentador || ''}
                      onChange={(e) => updateNewReporte('idInstrumentador', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar instrumentador</option>
                      {instrumentadorIds.map((id) => (
                        <option key={id} value={id}>
                          Instrumentador #{id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      value={newReporte.descripcion || ''}
                      onChange={(e) => updateNewReporte('descripcion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Escribe una descripción detallada del reporte..."
                    />
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
                    onClick={handleCreateNewReporte}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creando...' : 'Crear Reporte'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingReporte && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Editar Reporte #{editingReporte.id}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Cirugía *
                    </label>
                    <select
                      value={editingReporte.idCirugia}
                      onChange={(e) => setEditingReporte({
                        ...editingReporte,
                        idCirugia: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {cirugiaIds.map((id) => (
                        <option key={id} value={id}>
                          Cirugía #{id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Instrumentador *
                    </label>
                    <select
                      value={editingReporte.idInstrumentador}
                      onChange={(e) => setEditingReporte({
                        ...editingReporte,
                        idInstrumentador: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {instrumentadorIds.map((id) => (
                        <option key={id} value={id}>
                          Instrumentador #{id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      value={editingReporte.descripcion}
                      onChange={(e) => setEditingReporte({
                        ...editingReporte,
                        descripcion: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Creación
                    </label>
                    <input
                      type="text"
                      value={formatearFecha(editingReporte.fecha)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setEditingReporte(null)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleUpdateReporte(editingReporte)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Reporte'}
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

export default Reports;