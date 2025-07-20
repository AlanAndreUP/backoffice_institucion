'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { User } from '@/types';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock data para tutores
  const mockTutors: User[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      tipo_usuario: 'tutor',
      codigo_institucion: 'TUTOR',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      last_login: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      nombre: 'María García',
      correo: 'maria@example.com',
      tipo_usuario: 'tutor',
      codigo_institucion: 'TUTOR',
      is_active: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      last_login: '2024-01-14T15:20:00Z',
    },
    {
      id: '3',
      nombre: 'Carlos López',
      correo: 'carlos@example.com',
      tipo_usuario: 'tutor',
      codigo_institucion: 'TUTOR',
      is_active: false,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ];

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      // Aquí se cargarían los tutores de la API
      setTutors(mockTutors);
    } catch (error) {
      console.error('Error loading tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && tutor.is_active) ||
                         (filterStatus === 'inactive' && !tutor.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const createTutor = async (tutorData: any) => {
    try {
      const newTutor: User = {
        id: Date.now().toString(),
        nombre: tutorData.nombre,
        correo: tutorData.correo,
        tipo_usuario: 'tutor',
        codigo_institucion: 'TUTOR',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTutors(prev => [...prev, newTutor]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating tutor:', error);
    }
  };

  const generateCode = async (tutorId: string) => {
    try {
      // Aquí se generaría el código en la API
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      alert(`Código generado para el tutor: ${code}`);
      setShowCodeModal(false);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const toggleTutorStatus = async (id: string) => {
    try {
      setTutors(prev => prev.map(tutor => 
        tutor.id === id ? { ...tutor, is_active: !tutor.is_active, updated_at: new Date().toISOString() } : tutor
      ));
    } catch (error) {
      console.error('Error toggling tutor status:', error);
    }
  };

  const deleteTutor = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tutor?')) {
      try {
        setTutors(prev => prev.filter(tutor => tutor.id !== id));
      } catch (error) {
        console.error('Error deleting tutor:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tutores</h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra tutores y genera códigos de acceso
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Tutor
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  setFilterStatus('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{tutor.nombre}</h3>
                      <p className="text-sm text-gray-500">{tutor.correo}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tutor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tutor.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Código:</span>
                    <span className="font-medium">{tutor.codigo_institucion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Último login:</span>
                    <span className="font-medium">
                      {tutor.last_login ? formatDate(tutor.last_login) : 'Nunca'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Registrado:</span>
                    <span className="font-medium">{formatDate(tutor.created_at)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedTutor(tutor)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setShowCodeModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                      title="Generar código"
                    >
                      <KeyIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleTutorStatus(tutor.id)}
                      className={`${tutor.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                      title={tutor.is_active ? 'Desactivar' : 'Activar'}
                    >
                      {tutor.is_active ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => deleteTutor(tutor.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tutor Details Modal */}
        {selectedTutor && !showCodeModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Tutor</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <p className="text-sm text-gray-900">{selectedTutor.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedTutor.correo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código de Institución</label>
                    <p className="text-sm text-gray-900">{selectedTutor.codigo_institucion}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <p className="text-sm text-gray-900">{selectedTutor.is_active ? 'Activo' : 'Inactivo'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Registro</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedTutor.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedTutor.updated_at)}</p>
                  </div>
                  {selectedTutor.last_login && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Último Login</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedTutor.last_login)}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedTutor(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Code Modal */}
        {showCodeModal && selectedTutor && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Generar Código de Acceso</h3>
                <p className="text-sm text-gray-600 mb-4">
                  ¿Estás seguro de que quieres generar un nuevo código de acceso para {selectedTutor.nombre}?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCodeModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => generateCode(selectedTutor.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                  >
                    Generar Código
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Tutor Modal */}
        {showCreateModal && (
          <CreateTutorModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={createTutor}
          />
        )}
      </div>
    </Layout>
  );
}

// Componente para crear tutor
function CreateTutorModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Tutor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                required
                value={formData.contraseña}
                onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Crear Tutor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 