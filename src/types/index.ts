// Tipos para el sistema de citas (appointment-service)
export interface Appointment {
  id: string;
  id_tutor: string;
  id_alumno: string;
  fecha_cita: string;
  estado_cita: 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'no_asistio';
  to_do: string;
  tareas_completadas?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentRequest {
  id_tutor: string;
  id_alumno: string;
  fecha_cita: string;
  to_do: string;
}

export interface UpdateAppointmentRequest {
  fecha_cita?: string;
  estado_cita?: Appointment['estado_cita'];
  to_do?: string;
  tareas_completadas?: string[];
}

// Tipos para el sistema de chat (chat-service)
export interface ChatMessage {
  id: string;
  mensaje: string;
  estado: 'enviado' | 'entregado' | 'leido' | 'fallido';
  fecha: string;
  usuario_id: string;
  created_at: string;
  updated_at: string;
  is_ai_response: boolean;
  response_to_message_id?: string;
  conversation_id?: string;
  recipient_id?: string;
}

export interface ChatAttempt {
  id: string;
  estudiante_id: string;
  fecha_intento: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  last_message_at?: string;
  last_message?: string;
  message_count: number;
}

export interface SendMessageRequest {
  mensaje: string;
  usuario_id: string;
  estudiante_id?: string;
}

export interface SendMessageResponse {
  mensaje_usuario: ChatMessage;
  respuesta_ia?: ChatMessage;
  tokens_utilizados?: number;
}

// Tipos para el sistema de foro (foro-service)
export interface Post {
  id: string;
  title: string;
  body: string;
  authors: Author[];
  tags: Tag[];
  images?: string[];
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface Tag {
  value: string;
  color: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  authors: Author[];
  tags?: Tag[];
  images?: File[];
}

// Tipos para el sistema de autenticación (auth-service)
export interface User {
  id: string;
  nombre: string;
  correo: string;
  tipo_usuario: 'tutor' | 'alumno';
  codigo_institucion?: string;
  firebase_uid?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AuthRequest {
  correo: string;
  contraseña: string;
  codigo_institucion?: string;
}

export interface FirebaseAuthRequest {
  firebase_token: string;
  nombre: string;
  correo: string;
  codigo_institucion?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string;
    is_new_user: boolean;
  };
}

// Tipos para estadísticas del dashboard
export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  totalConversations: number;
  activeConversations: number;
  totalPosts: number;
  totalTutors: number;
  totalStudents: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'appointment' | 'chat' | 'post' | 'user';
  action: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para formularios
export interface CreateAppointmentForm {
  id_tutor: string;
  id_alumno: string;
  fecha_cita: string;
  to_do: string;
}

export interface CreatePostForm {
  title: string;
  body: string;
  authors: Author[];
  tags: Tag[];
  images?: File[];
}

export interface CreateUserForm {
  nombre: string;
  correo: string;
  contraseña: string;
  codigo_institucion?: string;
  tipo_usuario: 'tutor' | 'alumno';
}

// Tipos para filtros
export interface AppointmentFilters {
  id_tutor?: string;
  id_alumno?: string;
  estado_cita?: Appointment['estado_cita'];
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  limit?: number;
}

export interface ChatFilters {
  estudiante_id?: string;
  usuario_id?: string;
  page?: number;
  limit?: number;
}

export interface PostFilters {
  authorId?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface UserFilters {
  tipo_usuario?: 'tutor' | 'alumno';
  codigo_institucion?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
} 