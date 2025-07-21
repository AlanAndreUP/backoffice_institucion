import axios from 'axios';
import { API_CONFIG, DEFAULT_HEADERS, REQUEST_TIMEOUT } from './config';
import { User } from '@/types';

const tutorApi = axios.create({
  baseURL: API_CONFIG.BASE_API.baseURL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Interfaces para las respuestas de la API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CodeGenerationRequest {
  emails: string[];
}

interface CodeGenerationResponse {
  success: boolean;
  data: {
    codes: Array<{
      email: string;
      code: string;
    }>;
  };
  message?: string;
}

interface SendCodesRequest {
  emails: string[];
}

interface SendCodesResponse {
  success: boolean;
  data: {
    sent: string[];
    failed: string[];
  };
  message?: string;
}

export class TutorService {
  // 1. Obtener Todos los Usuarios
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await tutorApi.get<ApiResponse<User[]>>(API_CONFIG.BASE_API.endpoints.users);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor al obtener usuarios');
      }
      throw new Error('Error al obtener usuarios');
    }
  }

  // 2. Obtener Todos los Tutores
  static async getAllTutors(): Promise<User[]> {
    try {
      const response = await tutorApi.get<ApiResponse<{ tutors: User[]; total: number }>>(API_CONFIG.BASE_API.endpoints.tutors);
      return response.data.data?.tutors || [];
    } catch (error: any) {
      console.error('Error fetching all tutors:', error);
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor al obtener tutores');
      }
      throw new Error('Error al obtener tutores');
    }
  }

  // 3. Obtener Usuario por ID
  static async getUserById(userId: string): Promise<User> {
    try {
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }
      
      const response = await tutorApi.get<ApiResponse<User>>(API_CONFIG.BASE_API.endpoints.user(userId));
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user by ID:', error);
      if (error.response?.status === 400) {
        throw new Error('ID de usuario requerido');
      }
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor al obtener usuario');
      }
      throw new Error('Error al obtener usuario');
    }
  }

  // 4. Obtener Usuarios por Tipo
  static async getUsersByType(userType: 'tutor' | 'alumno'): Promise<User[]> {
    try {
      if (!userType || !['tutor', 'alumno'].includes(userType)) {
        throw new Error('Tipo de usuario inválido (debe ser "tutor" o "alumno")');
      }
      
      const response = await tutorApi.get<ApiResponse<User[]>>(API_CONFIG.BASE_API.endpoints.usersByType(userType));
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching users by type:', error);
      if (error.response?.status === 400) {
        throw new Error('Tipo de usuario inválido (debe ser "tutor" o "alumno")');
      }
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor al obtener usuarios por tipo');
      }
      throw new Error('Error al obtener usuarios por tipo');
    }
  }

  // 5. Crear Códigos de Tutores
  static async createTutorCodes(emails: string[]): Promise<Array<{ email: string; code: string }>> {
    try {
      if (!emails || emails.length === 0) {
        throw new Error('Lista de emails requerida');
      }
      
      const requestData: CodeGenerationRequest = { emails };
      const response = await tutorApi.post<CodeGenerationResponse>(API_CONFIG.BASE_API.endpoints.codes, requestData);
      return response.data.data.codes;
    } catch (error: any) {
      console.error('Error creating tutor codes:', error);
      if (error.response?.status === 400) {
        throw new Error('Lista de emails requerida');
      }
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor al crear códigos');
      }
      throw new Error('Error al crear códigos de tutores');
    }
  }

  // 6. Enviar Códigos de Tutores
  static async sendTutorCodes(emails: string[]): Promise<{ sent: string[]; failed: string[] }> {
    try {
      if (!emails || emails.length === 0) {
        throw new Error('Lista de emails requerida');
      }
      
      const requestData: SendCodesRequest = { emails };
      const response = await tutorApi.post<SendCodesResponse>(API_CONFIG.BASE_API.endpoints.send, requestData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error sending tutor codes:', error);
      if (error.response?.status === 400) {
        throw new Error('Lista de emails requerida');
      }
      if (error.response?.status === 500) {
        throw new Error('Error interno del servidor al enviar códigos');
      }
      throw new Error('Error al enviar códigos de tutores');
    }
  }

  // Método combinado: Crear y enviar códigos en una sola operación
  static async createAndSendTutorCodes(emails: string[]): Promise<{
    codes: Array<{ email: string; code: string }>;
    sent: string[];
    failed: string[];
  }> {
    try {
      // Primero crear los códigos
      const codes = await this.createTutorCodes(emails);
      
      // Luego enviar los códigos
      const sendResult = await this.sendTutorCodes(emails);
      
      return {
        codes,
        sent: sendResult.sent,
        failed: sendResult.failed,
      };
    } catch (error) {
      console.error('Error in create and send tutor codes:', error);
      throw error;
    }
  }

  // Método para obtener estadísticas generales
  static async getGeneralStats(): Promise<{
    totalUsers: number;
    totalTutors: number;
    totalStudents: number;
    activeUsers: number;
    inactiveUsers: number;
  }> {
    try {
      const [allUsers, tutors, students] = await Promise.all([
        this.getAllUsers(),
        this.getAllTutors(),
        this.getUsersByType('alumno'),
      ]);

      const activeUsers = (allUsers || []).filter(user => user.is_active).length;
      const inactiveUsers = (allUsers || []).filter(user => !user.is_active).length;

      return {
        totalUsers: allUsers?.length || 0,
        totalTutors: tutors?.length || 0,
        totalStudents: students?.length || 0,
        activeUsers,
        inactiveUsers,
      };
    } catch (error) {
      console.error('Error fetching general stats:', error);
      // Retornar estadísticas vacías en caso de error
      return {
        totalUsers: 0,
        totalTutors: 0,
        totalStudents: 0,
        activeUsers: 0,
        inactiveUsers: 0,
      };
    }
  }

  // Método para validar email
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para validar lista de emails
  static validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    emails.forEach(email => {
      if (this.validateEmail(email)) {
        valid.push(email);
      } else {
        invalid.push(email);
      }
    });

    return { valid, invalid };
  }
} 