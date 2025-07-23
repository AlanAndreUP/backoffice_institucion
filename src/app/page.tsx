'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { DashboardStats } from '@/types';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { AppointmentService } from '@/lib/api/appointmentService';
import { ChatService } from '@/lib/api/chatService';
import { TutorService } from '@/lib/api/tutorService';
import { ForoService } from '@/lib/api/foroService';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { CreateTutorModal } from '@/components/tutors/CreateTutorModal';
import { CreatePostModal } from '@/components/foro/CreatePostModal';

// Componente de tarjeta de estadística
function StatCard({ title, value, icon: Icon, color = 'blue' }: {
  title: string;
  value: number;
  icon: any;
  color?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-white ${colorClasses[color as keyof typeof colorClasses]}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de actividad reciente
function RecentActivity({ activities }: { activities: any[] }) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <UserGroupIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={activity.timestamp}>
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Modal simple para crear cita
function CreateAppointmentModal({ onClose, onSubmit, tutors, students }: { onClose: () => void; onSubmit: (data: any) => void; tutors: User[]; students: User[] }) {
  const [formData, setFormData] = useState({
    id_alumno: '',
    id_tutor: '',
    fecha_cita: '',
    to_do: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nueva Cita</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estudiante</label>
              <select
                required
                value={formData.id_alumno}
                onChange={e => setFormData({ ...formData, id_alumno: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecciona un estudiante</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre} ({s.correo})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tutor</label>
              <select
                required
                value={formData.id_tutor}
                onChange={e => setFormData({ ...formData, id_tutor: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecciona un tutor</option>
                {tutors.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre} ({t.correo})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha y hora</label>
              <input
                type="datetime-local"
                required
                value={formData.fecha_cita}
                onChange={e => setFormData({ ...formData, fecha_cita: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Asunto</label>
              <input
                type="text"
                required
                value={formData.to_do}
                onChange={e => setFormData({ ...formData, to_do: e.target.value })}
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
                Crear Cita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal para enviar código de tutor
function SendTutorCodeModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enviar Código de Tutor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
              >
                Enviar Código
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalConversations: 0,
    activeConversations: 0,
    totalPosts: 0,
    totalTutors: 0,
    totalStudents: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [showSendTutorCodeModal, setShowSendTutorCodeModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [tutors, setTutors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appointmentsRes, tutorsRes, studentsRes, postsRes, conversationsRes] = await Promise.all([
          AppointmentService.getAppointments({ limit: 100 }),
          TutorService.getAllTutors(),
          TutorService.getAllUsers(),
          ForoService.getPosts(),
          ChatService.getAllConversations(1, 100),
        ]);
        const appointments = appointmentsRes.data || [];
        const pendingAppointments = appointments.filter((a: any) => a.estado_cita === 'pendiente');
        const conversations = conversationsRes.conversations || [];
        const activeConversations = conversations.filter((c: any) => c.is_active);

        // Unifica todos los usuarios en un solo diccionario
        const userDict: Record<string, User> = {};
        [...studentsRes, ...tutorsRes].forEach(u => {
          userDict[u.id] = u;
        });

        setStats({
          totalAppointments: appointments.length,
          pendingAppointments: pendingAppointments.length,
          totalConversations: conversations.length,
          activeConversations: activeConversations.length,
          totalPosts: postsRes.posts.length,
          totalTutors: tutorsRes.length,
          totalStudents: studentsRes.length,
          recentActivity: [
            ...appointments.slice(0, 3).map((a: any) => ({
              id: a.id,
              type: 'appointment' as const,
              action: 'created',
              description: `Nueva cita creada por ${userDict[a.id_alumno]?.nombre}`,
              timestamp: a.created_at,
              userId: a.id_alumno,
              userName: userDict[a.id_alumno]?.nombre || '',
            })),
            ...postsRes.posts.slice(0, 3).map((p: any) => ({
              id: p.id,
              type: 'post' as const,
              action: 'created',
              description: `Nueva publicación: ${p.title}`,
              timestamp: p.created_at,
              userId: p.authors?.[0]?.id || '',
              userName: userDict[p.authors?.[0]?.id || '']?.nombre || p.authors?.[0]?.name || '',
            })),
            ...conversations.slice(0, 3).map((c: any) => ({
              id: c.id,
              type: 'chat' as const,
              action: 'message',
              description: `Conversación entre ${userDict[c.participant1_id]?.nombre || c.participant1_id} y ${userDict[c.participant2_id]?.nombre || c.participant2_id}`,
              timestamp: c.created_at,
              userId: c.participant1_id,
              userName: userDict[c.participant1_id]?.nombre || '',
            })),
          ],
        });
        setTutors(tutorsRes);
        setStudents(studentsRes);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Handlers para crear
  const handleCreateAppointment = async (data: any) => {
    try {
      await AppointmentService.createAppointment(data);
      setShowAppointmentModal(false);
      setLoading(true);
      router.refresh();
    } catch (error) {
      alert('Error al crear la cita');
    }
  };
  const handleSendTutorCode = async (email: string) => {
    try {
      await TutorService.createAndSendTutorCodes([email]);
      setShowSendTutorCodeModal(false);
      setLoading(true);
      router.refresh();
    } catch (error) {
      alert('Error al enviar el código de tutor');
    }
  };
  const handleCreatePost = async (data: any) => {
    try {
      await ForoService.createPost(data);
      setShowPostModal(false);
      setLoading(true);
      router.refresh();
    } catch (error) {
      alert('Error al crear la publicación');
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Resumen general del sistema de administración
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Citas"
            value={stats.totalAppointments}
            icon={CalendarIcon}
            color="blue"
          />
          <StatCard
            title="Citas Pendientes"
            value={stats.pendingAppointments}
            icon={ClockIcon}
            color="yellow"
          />
          <StatCard
            title="Conversaciones Activas"
            value={stats.activeConversations}
            icon={ChatBubbleLeftRightIcon}
            color="green"
          />
          <StatCard
            title="Total Usuarios"
            value={stats.totalStudents + stats.totalTutors}
            icon={UserGroupIcon}
            color="purple"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Tutores"
            value={stats.totalTutors}
            icon={UserGroupIcon}
            color="green"
          />
          <StatCard
            title="Total Estudiantes"
            value={stats.totalStudents}
            icon={UserGroupIcon}
            color="blue"
          />
          <StatCard
            title="Publicaciones del Foro"
            value={stats.totalPosts}
            icon={DocumentTextIcon}
            color="purple"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={stats.recentActivity} />
          
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <button onClick={() => setShowAppointmentModal(true)} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Crear Nueva Cita
                </button>
                <button onClick={() => setShowSendTutorCodeModal(true)} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  Enviar Código de Tutor
                </button>
                <button onClick={() => setShowPostModal(true)} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  Crear Publicación
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Modales */}
        {showAppointmentModal && (
          <CreateAppointmentModal
            onClose={() => setShowAppointmentModal(false)}
            onSubmit={handleCreateAppointment}
            tutors={tutors}
            students={students}
          />
        )}
        {showSendTutorCodeModal && (
          <SendTutorCodeModal
            onClose={() => setShowSendTutorCodeModal(false)}
            onSubmit={handleSendTutorCode}
          />
        )}
        {showPostModal && (
          <CreatePostModal
            onClose={() => setShowPostModal(false)}
            onSubmit={handleCreatePost}
          />
        )}
      </div>
    </Layout>
  );
} 