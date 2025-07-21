'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { User } from '@/types';
import { TutorService } from '@/lib/api/tutorService';
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
  ExclamationTriangleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function TutorsPage() {
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showBulkCodeModal, setShowBulkCodeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [codeGenerationStatus, setCodeGenerationStatus] = useState<{
    loading: boolean;
    success: boolean;
    message: string;
    codes?: Array<{ email: string; code: string }>;
    sent?: string[];
    failed?: string[];
  } | null>(null);

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      setLoading(true);
      setError(null);
      const tutorsData = await TutorService.getAllTutors();
      setTutors(tutorsData);
    } catch (error: any) {
      console.error('Error loading tutors:', error);
      setError(error.message || 'Error al cargar tutores');
      setTutors([]); // Asegurar que tutors sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = (tutors || []).filter(tutor => {
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
    if (!selectedTutor) return;
    
    try {
      setCodeGenerationStatus({
        loading: true,
        success: false,
        message: 'Generando código...',
      });
      
      const result = await TutorService.createAndSendTutorCodes([selectedTutor.correo]);
      
      setCodeGenerationStatus({
        loading: false,
        success: true,
        message: `Código generado y enviado exitosamente a ${selectedTutor.correo}`,
        codes: result.codes,
        sent: result.sent,
        failed: result.failed,
      });
      
      setTimeout(() => {
        setShowCodeModal(false);
        setCodeGenerationStatus(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error generating code:', error);
      setCodeGenerationStatus({
        loading: false,
        success: false,
        message: error.message || 'Error al generar código',
      });
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

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar tutores</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadTutors}
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
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tutores</h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra tutores y genera códigos de acceso
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBulkCodeModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <KeyIcon className="h-4 w-4 mr-2" />
              Generar Códigos Masivos
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Tutor
            </button>
          </div>
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
                
                {codeGenerationStatus && (
                  <div className={`p-3 rounded-md mb-4 ${
                    codeGenerationStatus.success 
                      ? 'bg-green-50 border border-green-200' 
                      : codeGenerationStatus.loading
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {codeGenerationStatus.loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      )}
                      {codeGenerationStatus.success && (
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      {!codeGenerationStatus.success && !codeGenerationStatus.loading && (
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${
                        codeGenerationStatus.success 
                          ? 'text-green-800' 
                          : codeGenerationStatus.loading
                          ? 'text-blue-800'
                          : 'text-red-800'
                      }`}>
                        {codeGenerationStatus.message}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCodeModal(false);
                      setCodeGenerationStatus(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => generateCode(selectedTutor.id)}
                    disabled={codeGenerationStatus?.loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {codeGenerationStatus?.loading ? 'Generando...' : 'Generar Código'}
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

        {/* Bulk Code Generation Modal */}
        {showBulkCodeModal && (
          <BulkCodeGenerationModal
            onClose={() => setShowBulkCodeModal(false)}
            onSubmit={async (emails) => {
              try {
                setCodeGenerationStatus({
                  loading: true,
                  success: false,
                  message: 'Generando códigos...',
                });
                
                const result = await TutorService.createAndSendTutorCodes(emails);
                
                setCodeGenerationStatus({
                  loading: false,
                  success: true,
                  message: `Códigos generados y enviados exitosamente. ${result.sent.length} enviados, ${result.failed.length} fallidos.`,
                  codes: result.codes,
                  sent: result.sent,
                  failed: result.failed,
                });
                
                setTimeout(() => {
                  setShowBulkCodeModal(false);
                  setCodeGenerationStatus(null);
                }, 5000);
              } catch (error: any) {
                setCodeGenerationStatus({
                  loading: false,
                  success: false,
                  message: error.message || 'Error al generar códigos',
                });
              }
            }}
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

// Componente para generar códigos masivos
function BulkCodeGenerationModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (emails: string[]) => void }) {
  const [emails, setEmails] = useState('');
  const [validation, setValidation] = useState<{ valid: string[]; invalid: string[] }>({ valid: [], invalid: [] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emails.split('\n').map(email => email.trim()).filter(email => email);
    const { valid } = TutorService.validateEmails(emailList);
    
    if (valid.length === 0) {
      alert('Por favor ingresa al menos un email válido');
      return;
    }
    
    onSubmit(valid);
  };

  const handleEmailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const emailList = e.target.value.split('\n').map(email => email.trim()).filter(email => email);
    const validationResult = TutorService.validateEmails(emailList);
    setValidation(validationResult);
    setEmails(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generar Códigos Masivos</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emails de Tutores (uno por línea)
              </label>
              <textarea
                required
                value={emails}
                onChange={handleEmailsChange}
                placeholder="tutor1@example.com&#10;tutor2@example.com&#10;tutor3@example.com"
                rows={8}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ingresa un email por línea. Se validarán automáticamente.
              </p>
            </div>
            
            {validation.valid.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  Emails válidos ({validation.valid.length}):
                </h4>
                <div className="text-xs text-green-700 space-y-1">
                  {validation.valid.map((email, index) => (
                    <div key={index} className="flex items-center">
                      <CheckIcon className="h-3 w-3 mr-1" />
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {validation.invalid.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Emails inválidos ({validation.invalid.length}):
                </h4>
                <div className="text-xs text-red-700 space-y-1">
                  {validation.invalid.map((email, index) => (
                    <div key={index} className="flex items-center">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      {email}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
                disabled={validation.valid.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generar y Enviar Códigos ({validation.valid.length})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 