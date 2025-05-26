
import { useState, useEffect } from 'react';
import { Users, Search, Plus, X } from 'lucide-react';

interface User {
    id: string;
    cedula: string;
    nombre: string;
    apellido: string;
    correo: string;
}

export const Profiles = () => {

    const dummyUsers: User[] = [
        {
            id: '1',
            cedula: '12345678',
            nombre: 'Juan',
            apellido: 'Pérez',
            correo: 'juan.perez@example.com',
        },
        {
            id: '2',
            cedula: '87654321',
            nombre: 'María',
            apellido: 'Gómez',
            correo: 'maria.gomez@example.com',
        },
        {
            id: '3',
            cedula: '11223344',
            nombre: 'Carlos',
            apellido: 'López',
            correo: 'carlos.lopez@example.com',
        },
    ];

    const [users, setUsers] = useState<User[]>(dummyUsers);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ cedula: '', nombre: '', apellido: '', correo: '' });
    const [itemsPerPage] = useState(2);

    const filteredUsers = users.filter(
        (user) =>
            user.cedula.includes(searchTerm) ||
            user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedUser(null);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setNewUser({ cedula: '', nombre: '', apellido: '', correo: '' });
    };

    const handleAddUser = () => {
        if (!newUser.cedula || !newUser.nombre || !newUser.apellido || !newUser.correo) {
            alert('Por favor, completa todos los campos');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.correo)) {
            alert('Por favor, ingresa un correo válido');
            return;
        }
        const newId = (users.length + 1).toString();
        setUsers([...users, { id: newId, ...newUser }]);
        closeAddModal();
    };

    return (
        <div className="   max-w-4xl mx-auto mt-8 ">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-[#2253d0] rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
                            <p className="text-sm text-gray-500">{filteredUsers.length} usuarios registrados</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Buscar usuario..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-64 py-2 pl-10 pr-4 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2253d0] rounded-lg hover:bg-[#1b429f]"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo Usuario
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Cargando usuarios...</p>
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
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Cédula</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Nombre Completo</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Correo Electrónico</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        onClick={() => handleUserClick(user)}
                                        className={`border-b border-gray-100 hover:bg-[#2253d0]/10 cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                            }`}
                                    >
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{user.cedula}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                                            {user.nombre} {user.apellido}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{user.correo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && filteredUsers.length > 0 && (
                    <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
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
                {!loading && !error && filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-[#2253d0] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
                        <p className="text-gray-500">Intenta con otro término de búsqueda</p>
                    </div>
                )}

                {/* View User Modal */}
                {showViewModal && selectedUser && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Detalles del Usuario</h3>
                                <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cédula</label>
                                    <p className="text-sm text-gray-900">{selectedUser.cedula}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                    <p className="text-sm text-gray-900">{selectedUser.nombre} {selectedUser.apellido}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                    <p className="text-sm text-gray-900">{selectedUser.correo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Usuario</h3>
                                <button onClick={closeAddModal} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cédula</label>
                                    <input
                                        type="text"
                                        value={newUser.cedula}
                                        onChange={(e) => setNewUser({ ...newUser, cedula: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese cédula"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        value={newUser.nombre}
                                        onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese nombre Completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        value={newUser.correo}
                                        onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
                                        className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2253d0] focus:border-transparent"
                                        placeholder="Ingrese correo"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    onClick={handleAddUser}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#2253d0] rounded-lg hover:bg-[#1b429f]"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};