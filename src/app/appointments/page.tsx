'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Appointment } from '@/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
  completada: 'bg-blue-100 text-blue-800',
  no_asistio: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  pendiente: ClockIcon,
  confirmada: CheckCircleIcon,
  cancelada: XCircleIcon,
  completada: CheckCircleIcon,
  no_asistio: XCircleIcon,
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // Aquí se cargarían los datos reales de la API
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          id_tutor: 'tutor1',
          id_alumno: 'alumno1',
          fecha_cita: '2024-01-15T14:00:00Z',
          estado_cita: 'confirmada',
          to_do: 'Clase de álgebra - Matemáticas',
          tareas_completadas: [],
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
        },
        {
          id: '2',
          id_tutor: 'tutor2',
          id_alumno: 'alumno2',
          fecha_cita: '2024-01-16T16:00:00Z',
          estado_cita: 'pendiente',
          to_do: 'Mecánica clásica - Física',
          tareas_completadas: [],
          created_at: '2024-01-11T09:00:00Z',
          updated_at: '2024-01-11T09:00:00Z',
        },
        {
          id: '3',
          id_tutor: 'tutor1',
          id_alumno: 'alumno3',
          fecha_cita: '2024-01-14T10:00:00Z',
          estado_cita: 'completada',
          to_do: 'Reacciones químicas - Química',
          tareas_completadas: ['Teoría básica', 'Ejercicios prácticos'],
          created_at: '2024-01-09T14:00:00Z',
          updated_at: '2024-01-14T10:00:00Z',
        },
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.estado_cita === filter;
  });

  const updateAppointmentStatus = async (id: string, status: Appointment['estado_cita']) => {
    try {
      // Aquí se actualizaría el estado en la API
      setAppointments(prev => 
        prev.map(app => 
          app.id === id ? { ...app, estado_cita: status, updated_at: new Date().toISOString() } : app
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        // Aquí se eliminaría de la API
        setAppointments(prev => prev.filter(app => app.id !== id));
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra todas las citas del sistema
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nueva Cita
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('pendiente')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('confirmada')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'confirmada' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setFilter('completada')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'completada' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completadas
            </button>
            <button
              onClick={() => setFilter('cancelada')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === 'cancelada' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Canceladas
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asunto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => {
                  const StatusIcon = statusIcons[appointment.estado_cita];
                  return (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Estudiante {appointment.id_alumno}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Tutor {appointment.id_tutor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(appointment.fecha_cita).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(appointment.fecha_cita).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.to_do}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.estado_cita]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {appointment.estado_cita}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Cita</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estudiante</label>
                    <p className="text-sm text-gray-900">Estudiante {selectedAppointment.id_alumno}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tutor</label>
                    <p className="text-sm text-gray-900">Tutor {selectedAppointment.id_tutor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <p className="text-sm text-gray-900">{new Date(selectedAppointment.fecha_cita).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hora</label>
                    <p className="text-sm text-gray-900">{new Date(selectedAppointment.fecha_cita).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Asunto</label>
                    <p className="text-sm text-gray-900">{selectedAppointment.to_do}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tareas Completadas</label>
                    <p className="text-sm text-gray-900">{selectedAppointment.tareas_completadas?.join(', ') || 'Ninguna'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      value={selectedAppointment.estado_cita}
                      onChange={(e) => updateAppointmentStatus(selectedAppointment.id, e.target.value as Appointment['estado_cita'])}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedAppointment(null)}
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