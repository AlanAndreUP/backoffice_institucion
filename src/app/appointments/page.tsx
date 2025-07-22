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
import { AppointmentService } from '@/lib/api/appointmentService';
import { UserService } from '@/lib/api/userService';
import { User } from '@/types';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const PAGE_SIZE = 10;
  const [userMap, setUserMap] = useState<Record<string, User>>({});

  useEffect(() => {
    loadAppointments();
  }, [filter, currentPage]);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || undefined;
    }
    return undefined;
  };

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const filters = filter !== 'all' ? { estado_cita: filter as Appointment['estado_cita'] } : {};
      const params = { ...filters, page: currentPage, limit: PAGE_SIZE };
      const result = await AppointmentService.getAppointments(params, token);
      const citas = Array.isArray(result) ? result : result.data;
      setAppointments(citas);
      setPagination(result.pagination || null);
      setTotalPages(result.pagination?.totalPages || 1);

      const userIds = Array.from(new Set([
        ...citas.map((c: any) => c.id_tutor),
        ...citas.map((c: any) => c.id_alumno),
      ]));
      console.log('IDs de usuarios a buscar:', userIds);

      const userResults = await Promise.all(
        userIds.map(async (id) => {
          try {
            const user = await UserService.getUserById(id, token);
            return [id, user];
          } catch (e) {
            console.log('No se encontró usuario para', id, e);
            return [id, undefined];
          }
        })
      );

      const userDict: Record<string, User> = {};
      userResults.forEach(([id, user]) => {
        if (user) userDict[id] = user.user;
      });
      setUserMap(userDict);
    } catch (error) {
      console.error('Error al cargar las citas:', error);
      setAppointments([]);
      setPagination(null);
      setTotalPages(1);
      setUserMap({});
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['estado_cita']) => {
    try {
      const token = getToken();
      await AppointmentService.updateAppointmentStatus(id, status, token);
      setAppointments(prev =>
        prev.map(app =>
          app.id === id ? { ...app, estado_cita: status, updated_at: new Date().toISOString() } : app
        )
      );
      // Opcional: recargar toda la lista
      // await loadAppointments();
    } catch (error) {
      console.error('Error al actualizar el estado de la cita:', error);
      alert('No se pudo actualizar el estado de la cita.');
    }
  };

  const deleteAppointment = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        const token = getToken();
        await AppointmentService.deleteAppointment(id, token);
        setAppointments(prev => prev.filter(app => app.id !== id));
        // Opcional: recargar toda la lista
        // await loadAppointments();
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
        alert('No se pudo eliminar la cita.');
      }
    }
  };

  // Cuando cambie el filtro, regresa a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

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
                {(appointments || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No hay citas para mostrar.
                    </td>
                  </tr>
                ) : (
                  (appointments || []).map((appointment) => {
                    const StatusIcon = statusIcons[appointment.estado_cita];
                    const alumno = userMap[appointment.id_alumno];
                    const tutor = userMap[appointment.id_tutor];
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {alumno ? `${alumno.nombre}${alumno.correo ? ' (' + alumno.correo + ')' : ''}` : `Estudiante ${appointment.id_alumno}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tutor ? `${tutor.nombre}${tutor.correo ? ' (' + tutor.correo + ')' : ''}` : `Tutor ${appointment.id_tutor}`}
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
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          {pagination && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-3 bg-gray-50 border-t space-y-2 md:space-y-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Anterior
                </button>
                {/* Botones de página */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      page === currentPage
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    disabled={page === currentPage}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  Siguiente
                </button>
              </div>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
            </div>
          )}
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