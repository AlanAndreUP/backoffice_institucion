// Configuración de las APIs de los microservicios
export const API_CONFIG = {
  // API Base para endpoints sin autenticación
  BASE_API: {
    baseURL:  process.env.NEXT_PUBLIC_FORO_API_URL || 'http://localhost:3001',
    endpoints: {
      users: '/auth/users',
      user: (id: string) => `/auth/user/${id}`,
      users_s1: (id: string) => `/user/${id}`,
      usersByType: (type: string) => `/auth/user/`,
      tutors: '/auth/tutors',
      codes: '/auth/tutor-codes',
      send: '/auth/tutor-codes/send',
    }
  },
  
  // Servicio de citas
  APPOINTMENT_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_FORO_API_URL || 'http://localhost:3001',
    endpoints: {
      appointments: '/s1/appointments',
      appointment: (id: string) => `/s1/appointments/${id}`,
      updateStatus: (id: string) => `/s1/appointments/${id}/status`,
    }
  },
  
  // Servicio de autenticación
  AUTH_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3002',
    endpoints: {
      validate: '/auth/validate',
      firebase: '/auth/firebase',
      users: '/users',
      user: (id: string) => `/users/${id}`,
    }
  },
  
  // Servicio de chat
  CHAT_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3003',
    endpoints: {
      health: '/s3/health',
      sendMessage: '/s3/chat/message',
      chatHistory: (estudianteId: string) => `/s3/chat/history/${estudianteId}`,
      chatMessages: (estudianteId: string) => `/s3/chat/history/${estudianteId}/messages`,
      chatAttempt: '/s3/chat/attempt',
      chatAttempts: (estudianteId: string) => `/s3/chat/attempts/${estudianteId}`,
      chatStatus: '/s3/chat/status',
      aiInfo: '/s3/chat/ai/info',
      aiTest: '/s3/chat/ai/test',
      sendPrivateMessage: '/s3/conversations/message',
      conversations: (usuarioId: string) => `/s3/conversations/${usuarioId}`,
      conversationMessages: (conversationId: string) => `/s3/conversations/${conversationId}/messages`,
      conversationStatus: '/s3/conversations/status',
      wsInfo: '/s3/ws-info',
      // Endpoints administrativos
      adminConversations: '/s3/admin/conversations',
      adminMessages: '/s3/admin/messages',
      adminAttempts: '/s3/admin/attempts',
      adminStatus: '/s3/admin/status',
    }
  },
  
  // Servicio de foro
  FORO_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_FORO_API_URL || 'http://localhost:3004',
    endpoints: {
      posts: '/s4/api/posts',
      post: (id: string) => `/s4/api/posts/${id}`,
      search: '/s4/api/posts/search',
      postsByAuthor: (authorId: string) => `/s4/api/posts/author/${authorId}`,
      postsByTag: (tag: string) => `/s4/api/posts/tag/${tag}`,
    }
  },
  
  // Servicio de tutores (si existe)
  TUTOR_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_TUTOR_API_URL || 'http://localhost:3005',
    endpoints: {
      tutors: '/api/tutors',
      tutor: (id: string) => `/api/tutors/${id}`,
      generateCode: '/api/tutors/generate-code',
    }
  }
};

// Configuración de headers comunes
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Función para crear headers con autenticación
export const createAuthHeaders = (token?: string) => {
  const headers = { ...DEFAULT_HEADERS };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Configuración de timeout para requests
export const REQUEST_TIMEOUT = 10000; // 10 segundos

// Configuración de reintentos
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000,
}; 