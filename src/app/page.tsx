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

// Componente de tarjeta de estadística
function StatCard({ title, value, icon: Icon, color = 'blue', change }: {
  title: string;
  value: number;
  icon: any;
  color?: string;
  change?: { value: number; type: 'increase' | 'decrease' };
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
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change.type === 'increase' ? '↑' : '↓'} {change.value}%
                  </div>
                )}
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

  useEffect(() => {
    // Simular carga de datos
    const loadDashboardData = async () => {
      try {
        // Aquí se cargarían los datos reales de las APIs
        // Por ahora usamos datos de ejemplo
        setStats({
          totalAppointments: 156,
          pendingAppointments: 23,
          totalConversations: 89,
          activeConversations: 12,
          totalPosts: 45,
          totalTutors: 34,
          totalStudents: 234,
          recentActivity: [
            {
              id: '1',
              type: 'appointment',
              action: 'created',
              description: 'Nueva cita creada por Juan Pérez',
              timestamp: new Date().toISOString(),
              userId: '1',
              userName: 'Juan Pérez',
            },
            {
              id: '2',
              type: 'chat',
              action: 'message',
              description: 'Mensaje enviado en conversación #123',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              userId: '2',
              userName: 'María García',
            },
            {
              id: '3',
              type: 'post',
              action: 'created',
              description: 'Nueva publicación en el foro',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              userId: '3',
              userName: 'Carlos López',
            },
          ],
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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
            change={{ value: 12, type: 'increase' }}
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
            change={{ value: 8, type: 'increase' }}
          />
          <StatCard
            title="Total Usuarios"
            value={stats.totalStudents + stats.totalTutors}
            icon={UserGroupIcon}
            color="purple"
            change={{ value: 5, type: 'increase' }}
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
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Crear Nueva Cita
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  Agregar Tutor
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  Crear Publicación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 