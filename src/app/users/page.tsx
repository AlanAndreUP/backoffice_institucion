'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { User } from '@/types';
import { TutorService } from '@/lib/api/tutorService';
import {
  UserGroupIcon,
  UserIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// Mapeo de colores de triaje a colores visuales
const triajeColorMap: Record<string, string> = {
  verde: '#22c55e', // Tailwind green-500
  amarillo: '#eab308', // Tailwind yellow-500
  rojo: '#ef4444', // Tailwind red-500
};

const triajeBgMap: Record<string, string> = {
  verde: 'bg-green-100',
  amarillo: 'bg-yellow-100',
  rojo: 'bg-red-100',
};

const triajeTextMap: Record<string, string> = {
  verde: 'text-green-800',
  amarillo: 'text-yellow-800',
  rojo: 'text-red-800',
};

// Función para determinar si el triaje es válido (no es solo error de datos)
function isTriajeValido(triaje?: { razones: string[] }) {
  if (!triaje) return false;
  if (!triaje.razones || triaje.razones.length === 0) return false;
  const razonesLower = triaje.razones.map(r => r.toLowerCase().trim());
  return !(
    razonesLower.length === 1 &&
    (razonesLower[0] === 'error al obtener datos' || razonesLower[0] === 'no se pudo analizar')
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tutor' | 'alumno'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalTutors: number;
    totalStudents: number;
    activeUsers: number;
    inactiveUsers: number;
  }>({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await TutorService.getAllUsers_triaje();
      setUsers(usersData);
      // Calcular estadísticas en el frontend
      const totalUsers = usersData.length;
      const totalTutors = usersData.filter((u: User) => u.tipo_usuario === 'tutor').length;
      const totalStudents = usersData.filter((u: User) => u.tipo_usuario === 'alumno').length;
      const activeUsers = usersData.filter((u: User) => u.is_active).length;
      const inactiveUsers = usersData.filter((u: User) => !u.is_active).length;
      setStats({ totalUsers, totalTutors, totalStudents, activeUsers, inactiveUsers });
    } catch (error: any) {
      console.error('Error loading users:', error);
      setError(error.message || 'Error al cargar usuarios');
      setUsers([]); 
      setStats({ totalUsers: 0, totalTutors: 0, totalStudents: 0, activeUsers: 0, inactiveUsers: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || user.tipo_usuario === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'No disponible' : date.toLocaleString('es-ES');
  };

  const getUserIcon = (userType: string) => {
    switch (userType) {
      case 'tutor':
        return <AcademicCapIcon className="h-6 w-6 text-blue-600" />;
      case 'alumno':
        return <UserIcon className="h-6 w-6 text-green-600" />;
      default:
        return <UserGroupIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'tutor':
        return 'Tutor';
      case 'alumno':
        return 'Estudiante';
      default:
        return userType;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar usuarios</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadUsers}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra todos los usuarios del sistema
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tutores</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTutors}</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Estudiantes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <XCircleIcon className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Inactivos</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.inactiveUsers}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre o email..."
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuario
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">Todos</option>
                <option value="tutor">Tutores</option>
                <option value="alumno">Estudiantes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Usuarios ({filteredUsers.length} de {users.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Triaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getUserIcon(user.tipo_usuario)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                          <div className="text-sm text-gray-500">{user.correo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.tipo_usuario === 'tutor' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {getUserTypeLabel(user.tipo_usuario)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     {user.triaje && isTriajeValido(user.triaje) ? (
                       <div className={`flex items-center space-x-2 ${triajeBgMap[user.triaje.color] || ''} px-2 py-1 rounded-md`}>
                         <span
                           className="inline-block w-3 h-3 rounded-full border border-gray-300"
                           style={{ backgroundColor: triajeColorMap[user.triaje.color] || user.triaje.color }}
                           title={`Color: ${user.triaje.color}`}
                         ></span>
                         <span
                           className={`text-xs font-semibold capitalize ${triajeTextMap[user.triaje.color] || ''}`}
                           title={user.triaje.razones && user.triaje.razones.length > 0 ? user.triaje.razones.join('\n') : ''}
                           style={{ cursor: user.triaje.razones && user.triaje.razones.length > 0 ? 'help' : 'default' }}
                         >
                           {user.triaje.prioridad}
                         </span>
                         {/* Alerta visual para rojo o prioridad alta */}
                         {(user.triaje.color === 'rojo' || user.triaje.prioridad?.toLowerCase() === 'alta') && (
                           <>
                             <ExclamationCircleIcon className="h-4 w-4 text-red-500" title="¡Alerta!" />
                             <span className="text-xs font-bold text-red-600 ml-1">¡Alerta!</span>
                           </>
                         )}
                       </div>
                     ) : (
                       <span className="text-xs text-gray-400">Sin triaje</span>
                     )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Usuario</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <p className="text-sm text-gray-900">{selectedUser.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedUser.correo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
                    <p className="text-sm text-gray-900">{getUserTypeLabel(selectedUser.tipo_usuario)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código de Institución</label>
                    <p className="text-sm text-gray-900">{selectedUser.codigo_institucion}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <p className="text-sm text-gray-900">{selectedUser.is_active ? 'Activo' : 'Inactivo'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Registro</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.updated_at)}</p>
                  </div>
                  {selectedUser.last_login && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Último Login</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedUser.last_login)}</p>
                    </div>
                  )}
                  {selectedUser.triaje && isTriajeValido(selectedUser.triaje) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Triaje</label>
                      <div className={`flex items-center space-x-2 ${triajeBgMap[selectedUser.triaje.color] || ''} px-2 py-1 rounded-md`}>
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: triajeColorMap[selectedUser.triaje.color] || selectedUser.triaje.color }}
                          title={`Color: ${selectedUser.triaje.color}`}
                        ></span>
                        <span className={`text-xs font-semibold capitalize ${triajeTextMap[selectedUser.triaje.color] || ''}`}>{selectedUser.triaje.prioridad}</span>
                        {(selectedUser.triaje.color === 'rojo' || selectedUser.triaje.prioridad?.toLowerCase() === 'alta') && (
                          <>
                            <ExclamationCircleIcon className="h-4 w-4 text-red-500" title="¡Alerta!" />
                            <span className="text-xs font-bold text-red-600 ml-1">¡Alerta!</span>
                          </>
                        )}
                      </div>
                      {selectedUser.triaje.razones && selectedUser.triaje.razones.length > 0 && (
                        <ul className="mt-1 list-disc list-inside text-xs text-gray-600">
                          {selectedUser.triaje.razones.map((razon, idx) => (
                            <li key={idx}>{razon}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 