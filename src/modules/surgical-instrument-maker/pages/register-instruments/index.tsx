import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Package,
  AlertCircle,
} from 'lucide-react';
import {
  SurgicalInstrument,
  useSurgicalInstruments,
} from '../../hooks/useSurgical';
import axios from 'axios';
import { useAuthStore } from '@auth/stores/auth';

const RegisterInstruments: React.FC = () => {
  const [instruments2, setInstruments2] = useState<[]>([]);
  console.log(instruments2);
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    categories,
    clearFilters,
    filteredInstruments,
    filters,
    getStatusColor,
    getStatusText,
    handleCreateInstrument,
    handleDeleteInstrument,
    instruments,
    showCreateModal,
    setShowCreateModal,
    setFilters,
    setNewInstrument,
    setEditingInstrument,
    setSearchTerm,
    statuses,
    searchTerm,
    locations,
    newInstrument,
  } = useSurgicalInstruments();

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
      setInstruments2(res.data.datos);
    } catch (error) {
      console.log('Error fetching instruments: ', error);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-4">
      {/* Blur */}
      <div className="absolute right-10 z-10 blur-[100px] bg-purple-500 rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>
      <div className="absolute bottom-2 z-10 blur-[100px] bg-blue-500 rounded-full w-32 h-32 shadow-2xl shadow-black/50"></div>

      <div className="relative max-w-7xl mx-auto z-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Instrumentos Quirúrgicos
          </h1>
          <p className="text-gray-600">
            Gestiona y monitorea todos los instrumentos quirúrgicos del hospital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Instrumentos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {instruments.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">
                  {instruments.filter((i) => i.status === 'available').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Uso</p>
                <p className="text-2xl font-bold text-blue-600">
                  {instruments.filter((i) => i.status === 'in-use').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Mantenimiento
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {instruments.filter((i) => i.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </div>
        </div>
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
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>

              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las ubicaciones</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
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
                    Instrumento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próximo Mantenimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstruments.map((instrument) => (
                  <tr key={instrument.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {instrument.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          S/N: {instrument.serialNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {instrument.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(instrument.status)}`}
                      >
                        {getStatusText(instrument.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instrument.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(
                        instrument.nextMaintenance
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingInstrument(instrument)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInstrument(instrument.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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

          {filteredInstruments.length === 0 && (
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Crear Nuevo Instrumento
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Instrumento *
                    </label>
                    <input
                      type="text"
                      value={newInstrument.name || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: Bisturí Electrónico"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={newInstrument.category || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={newInstrument.type || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Electrónico">Electrónico</option>
                      <option value="Neumático">Neumático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Serie *
                    </label>
                    <input
                      type="text"
                      value={newInstrument.serialNumber || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          serialNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: BE-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fabricante
                    </label>
                    <input
                      type="text"
                      value={newInstrument.manufacturer || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          manufacturer: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: MedTech Pro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación
                    </label>
                    <select
                      value={newInstrument.location || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar ubicación</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Adquisición
                    </label>
                    <input
                      type="date"
                      value={newInstrument.acquisitionDate || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          acquisitionDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={newInstrument.status || 'available'}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          status: e.target
                            .value as SurgicalInstrument['status'],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {getStatusText(status)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      value={newInstrument.notes || ''}
                      onChange={(e) =>
                        setNewInstrument({
                          ...newInstrument,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Información adicional..."
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
                    onClick={handleCreateInstrument}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Crear Instrumento
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
