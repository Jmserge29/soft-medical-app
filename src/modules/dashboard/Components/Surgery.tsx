

import { useState } from 'react';

import { Search, Plus, X, Syringe } from 'lucide-react';

interface Surgery {
    id: number;
    idTipoCirugia: number;
    horaProgramada: string;
    horaInicio: string | null;
    horaFin: string | null;
    numQuirofano: number;
    nombrePaciente: string;
    tipoIdentificacionPaciente: string;
    edadPaciente: number;
    tipoEpsPaciente: string;
    generoPaciente: string;
    tipoCirugia: string;
}

export const Surgery = () => {
    const dummySurgeries: Surgery[] = [
        {
            id: 3,
            idTipoCirugia: 1,
            horaProgramada: '2025-05-27T08:00:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 1,
            nombrePaciente: 'Carlos Ramírez',
            tipoIdentificacionPaciente: 'CC',
            edadPaciente: 35,
            tipoEpsPaciente: 'Contributivo',
            generoPaciente: 'Masculino',
            tipoCirugia: 'Apendicectomía',
        },
        {
            id: 4,
            idTipoCirugia: 2,
            horaProgramada: '2025-05-27T09:00:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 2,
            nombrePaciente: 'Ana Gómez',
            tipoIdentificacionPaciente: 'TI',
            edadPaciente: 19,
            tipoEpsPaciente: 'Subsidiado',
            generoPaciente: 'Femenino',
            tipoCirugia: 'Colecistectomía',
        },
        {
            id: 5,
            idTipoCirugia: 3,
            horaProgramada: '2025-05-27T10:30:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 1,
            nombrePaciente: 'Luis Herrera',
            tipoIdentificacionPaciente: 'CC',
            edadPaciente: 45,
            tipoEpsPaciente: 'Contributivo',
            generoPaciente: 'Masculino',
            tipoCirugia: 'Herniorrafia inguinal',
        },
        {
            id: 6,
            idTipoCirugia: 4,
            horaProgramada: '2025-05-27T13:00:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 3,
            nombrePaciente: 'María Torres',
            tipoIdentificacionPaciente: 'CC',
            edadPaciente: 29,
            tipoEpsPaciente: 'Contributivo',
            generoPaciente: 'Femenino',
            tipoCirugia: 'Cesárea',
        },
        {
            id: 7,
            idTipoCirugia: 5,
            horaProgramada: '2025-05-27T15:00:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 2,
            nombrePaciente: 'Pedro Martínez',
            tipoIdentificacionPaciente: 'CE',
            edadPaciente: 52,
            tipoEpsPaciente: 'Particular',
            generoPaciente: 'Masculino',
            tipoCirugia: 'Laparotomía exploradora',
        },
        {
            id: 8,
            idTipoCirugia: 6,
            horaProgramada: '2025-05-28T08:00:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 1,
            nombrePaciente: 'Lucía Pérez',
            tipoIdentificacionPaciente: 'CC',
            edadPaciente: 60,
            tipoEpsPaciente: 'Contributivo',
            generoPaciente: 'Femenino',
            tipoCirugia: 'Mastectomía',
        },
        {
            id: 9,
            idTipoCirugia: 7,
            horaProgramada: '2025-05-28T09:30:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 2,
            nombrePaciente: 'Jorge Salazar',
            tipoIdentificacionPaciente: 'TI',
            edadPaciente: 17,
            tipoEpsPaciente: 'Subsidiado',
            generoPaciente: 'Masculino',
            tipoCirugia: 'Resección intestinal',
        },
        {
            id: 10,
            idTipoCirugia: 8,
            horaProgramada: '2025-05-28T11:00:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 3,
            nombrePaciente: 'Sofía Díaz',
            tipoIdentificacionPaciente: 'CC',
            edadPaciente: 33,
            tipoEpsPaciente: 'Contributivo',
            generoPaciente: 'Femenino',
            tipoCirugia: 'Amputación supracondílea',
        },
        {
            id: 11,
            idTipoCirugia: 9,
            horaProgramada: '2025-05-28T13:30:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 4,
            nombrePaciente: 'Camilo Rojas',
            tipoIdentificacionPaciente: 'CC',
            edadPaciente: 40,
            tipoEpsPaciente: 'Contributivo',
            generoPaciente: 'Masculino',
            tipoCirugia: 'Craneotomía',
        },
        {
            id: 12,
            idTipoCirugia: 10,
            horaProgramada: '2025-05-28T15:00:00',
            horaInicio: null,
            horaFin: null,
            numQuirofano: 5,
            nombrePaciente: 'Andrea Nieto',
            tipoIdentificacionPaciente: 'CE',
            edadPaciente: 25,
            tipoEpsPaciente: 'Particular',
            generoPaciente: 'Femenino',
            tipoCirugia: 'Cirugía cardíaca abierta',
        },
    ];

    const [surgeries, setSurgeries] = useState<Surgery[]>(dummySurgeries);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [showAddSurgeryDetailsModal, setShowAddSurgeryDetailsModal] = useState(false);
    const [newSurgery, setNewSurgery] = useState<Omit<Surgery, 'id' | 'horaInicio' | 'horaFin'>>({
        idTipoCirugia: 0,
        horaProgramada: '',
        numQuirofano: 0,
        nombrePaciente: '',
        tipoIdentificacionPaciente: '',
        edadPaciente: 0,
        tipoEpsPaciente: '',
        generoPaciente: '',
        tipoCirugia: '',
    });
    const [itemsPerPage] = useState(5);

    const filteredSurgeries = surgeries.filter(
        (surgery) =>
            surgery.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surgery.tipoCirugia.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surgery.numQuirofano.toString().includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredSurgeries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSurgeries = filteredSurgeries.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const handleSurgeryClick = (surgery: Surgery) => {
        setSelectedSurgery(surgery);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedSurgery(null);
    };

    const openAddPatientModal = () => {
        setShowAddPatientModal(true);
    };

    const closeAddPatientModal = () => {
        setShowAddPatientModal(false);
        setNewSurgery({
            idTipoCirugia: 0,
            horaProgramada: '',
            numQuirofano: 0,
            nombrePaciente: '',
            tipoIdentificacionPaciente: '',
            edadPaciente: 0,
            tipoEpsPaciente: '',
            generoPaciente: '',
            tipoCirugia: '',
        });
    };

    const openAddSurgeryDetailsModal = () => {
        if (
            !newSurgery.nombrePaciente ||
            !newSurgery.tipoIdentificacionPaciente ||
            !newSurgery.edadPaciente ||
            !newSurgery.tipoEpsPaciente ||
            !newSurgery.generoPaciente
        ) {
            alert('Por favor, completa todos los campos del paciente');
            return;
        }
        setShowAddPatientModal(false);
        setShowAddSurgeryDetailsModal(true);
    };

    const closeAddSurgeryDetailsModal = () => {
        setShowAddSurgeryDetailsModal(false);
    };

    const handleAddSurgery = () => {
        if (
            !newSurgery.tipoCirugia ||
            !newSurgery.horaProgramada ||
            !newSurgery.numQuirofano ||
            !newSurgery.idTipoCirugia
        ) {
            alert('Por favor, completa todos los campos de la cirugía');
            return;
        }
        const newId = Math.max(...surgeries.map((s) => s.id)) + 1;
        setSurgeries([...surgeries, { id: newId, horaInicio: null, horaFin: null, ...newSurgery }]);
        setShowAddSurgeryDetailsModal(false);
        setNewSurgery({
            idTipoCirugia: 0,
            horaProgramada: '',
            numQuirofano: 0,
            nombrePaciente: '',
            tipoIdentificacionPaciente: '',
            edadPaciente: 0,
            tipoEpsPaciente: '',
            generoPaciente: '',
            tipoCirugia: '',
        });
    };

    return (
        <div className=" max-w-4xl mx-auto mt-8 ">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-[#2253d0] rounded-lg flex items-center justify-center">
                            <Syringe className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Gestión de Cirugías</h2>
                            <p className="text-sm text-gray-500">{filteredSurgeries.length} cirugías programadas</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Buscar cirugía o paciente..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-64 py-2 pl-10 pr-4 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={openAddPatientModal}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2253d0] rounded-lg hover:bg-[#1b429f]"
                        >
                            <Plus className="h-4 w-4" />
                            Nueva Cirugía
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Cargando cirugías...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Paciente</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Cirugía</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Hora Programada</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Quirófano</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSurgeries.map((surgery) => (
                                    <tr
                                        key={surgery.id}
                                        onClick={() => handleSurgeryClick(surgery)}
                                        className="border-b border-gray-100 hover:bg-[#2253d0]/10 cursor-pointer transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{surgery.nombrePaciente}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700 font-medium">{surgery.tipoCirugia}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {new Date(surgery.horaProgramada).toLocaleString('es-CO', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{surgery.numQuirofano}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && filteredSurgeries.length > 0 && (
                    <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredSurgeries.length)} de {filteredSurgeries.length}{' '}
                            cirugías
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-white bg-[#2253d0] border border-[#2253d0] rounded-lg hover:bg-[#1b429f] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="px-3 py-2 text-sm font-medium text-gray-700">
                                {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm font-medium text-white bg-[#2253d0] border border-[#2253d0] rounded-lg hover:bg-[#1b429f] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredSurgeries.length === 0 && (
                    <div className="text-center py-12">
                        <Syringe className="h-12 w-12 text-[#2253d0] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cirugías</h3>
                        <p className="text-gray-500">Intenta con otro término de búsqueda</p>
                    </div>
                )}

                {/* View Surgery Modal */}
                {showViewModal && selectedSurgery && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Detalles de la Cirugía</h3>
                                <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Paciente</label>
                                    <p className="text-sm text-gray-900">{selectedSurgery.nombrePaciente}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Cirugía</label>
                                    <p className="text-sm text-gray-900">{selectedSurgery.tipoCirugia}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hora Programada</label>
                                    <p className="text-sm text-gray-900">
                                        {new Date(selectedSurgery.horaProgramada).toLocaleString('es-CO', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quirófano</label>
                                    <p className="text-sm text-gray-900">{selectedSurgery.numQuirofano}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Identificación</label>
                                    <p className="text-sm text-gray-900">
                                        {selectedSurgery.tipoIdentificacionPaciente} {selectedSurgery.edadPaciente} años
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">EPS</label>
                                    <p className="text-sm text-gray-900">{selectedSurgery.tipoEpsPaciente}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Género</label>
                                    <p className="text-sm text-gray-900">{selectedSurgery.generoPaciente}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Patient Modal */}
                {showAddPatientModal && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Datos del Paciente</h3>
                                <button onClick={closeAddPatientModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre del Paciente</label>
                                    <input
                                        type="text"
                                        value={newSurgery.nombrePaciente}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, nombrePaciente: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese nombre del paciente"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Identificación</label>
                                    <select
                                        value={newSurgery.tipoIdentificacionPaciente}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, tipoIdentificacionPaciente: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Edad del Paciente</label>
                                    <input
                                        type="number"
                                        value={newSurgery.edadPaciente || ''}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, edadPaciente: Number(e.target.value) })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese edad"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de EPS</label>
                                    <select
                                        value={newSurgery.tipoEpsPaciente}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, tipoEpsPaciente: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="Contributivo">Contributivo</option>
                                        <option value="Subsidiado">Subsidiado</option>
                                        <option value="Particular">Particular</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Género</label>
                                    <select
                                        value={newSurgery.generoPaciente}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, generoPaciente: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    onClick={closeAddPatientModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={openAddSurgeryDetailsModal}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#2253d0] rounded-lg hover:bg-[#1b429f]"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Surgery Details Modal */}
                {showAddSurgeryDetailsModal && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Detalles de la Cirugía</h3>
                                <button onClick={closeAddSurgeryDetailsModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Cirugía</label>
                                    <input
                                        type="text"
                                        value={newSurgery.tipoCirugia}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, tipoCirugia: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese tipo de cirugía"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ID Tipo de Cirugía</label>
                                    <input
                                        type="number"
                                        value={newSurgery.idTipoCirugia || ''}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, idTipoCirugia: Number(e.target.value) })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese ID de tipo de cirugía"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hora Programada</label>
                                    <input
                                        type="datetime-local"
                                        value={newSurgery.horaProgramada}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, horaProgramada: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quirófano</label>
                                    <input
                                        type="number"
                                        value={newSurgery.numQuirofano || ''}
                                        onChange={(e) => setNewSurgery({ ...newSurgery, numQuirofano: Number(e.target.value) })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese número de quirófano"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between gap-2">
                                <button
                                    onClick={() => {
                                        setShowAddSurgeryDetailsModal(false);
                                        setShowAddPatientModal(true);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Atrás
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={closeAddSurgeryDetailsModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddSurgery}
                                        className="px-4 py-2 text-sm font-medium text-white bg-[#2253d0] rounded-lg hover:bg-[#1b429f]"
                                    >
                                        Programar
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