import axios from 'axios';
import { API_CONFIG, createAuthHeaders, REQUEST_TIMEOUT } from './config';
import { User, Tutor, ApiResponse, PaginatedResponse } from '@/types';

const userApi = axios.create({
  baseURL: API_CONFIG.AUTH_SERVICE.baseURL,
  timeout: REQUEST_TIMEOUT,
});

export class UserService {
  // Obtener todos los usuarios
  static async getUsers(token?: string): Promise<User[]> {
    try {
      const response = await userApi.get(
        API_CONFIG.AUTH_SERVICE.endpoints.users,
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Obtener usuario por ID
  static async getUserById(id: string, token?: string): Promise<User> {
    try {
      const response = await userApi.get(
        API_CONFIG.AUTH_SERVICE.endpoints.user(id),
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Obtener todos los tutores
  static async getTutors(token?: string): Promise<Tutor[]> {
    try {
      const response = await userApi.get(
        API_CONFIG.AUTH_SERVICE.endpoints.tutors,
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  }

  // Obtener todos los estudiantes
  static async getStudents(token?: string): Promise<User[]> {
    try {
      const response = await userApi.get(
        API_CONFIG.AUTH_SERVICE.endpoints.students,
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Crear nuevo tutor
  static async createTutor(tutorData: {
    name: string;
    email: string;
    password: string;
    institutionCode: string;
    specialties: string[];
    availability: {
      days: string[];
      hours: string[];
    };
  }, token?: string): Promise<Tutor> {
    try {
      const response = await userApi.post(
        API_CONFIG.AUTH_SERVICE.endpoints.tutors,
        { ...tutorData, userType: 'tutor' },
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  }

  // Actualizar usuario
  static async updateUser(id: string, userData: Partial<User>, token?: string): Promise<User> {
    try {
      const response = await userApi.put(
        API_CONFIG.AUTH_SERVICE.endpoints.user(id),
        userData,
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Eliminar usuario
  static async deleteUser(id: string, token?: string): Promise<void> {
    try {
      await userApi.delete(
        API_CONFIG.AUTH_SERVICE.endpoints.user(id),
        { headers: createAuthHeaders(token) }
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Generar código de tutor
  static async generateTutorCode(tutorId: string, token?: string): Promise<{ code: string }> {
    try {
      const response = await userApi.post(
        `${API_CONFIG.AUTH_SERVICE.endpoints.user(tutorId)}/generate-code`,
        {},
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error generating tutor code:', error);
      throw error;
    }
  }

  // Obtener estadísticas de usuarios
  static async getUserStats(token?: string): Promise<{
    totalUsers: number;
    totalTutors: number;
    totalStudents: number;
    activeUsers: number;
    recentRegistrations: number;
  }> {
    try {
      const users = await this.getUsers(token);
      const tutors = await this.getTutors(token);
      const students = await this.getStudents(token);
      
      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const stats = {
        totalUsers: users.length,
        totalTutors: tutors.length,
        totalStudents: students.length,
        activeUsers: users.filter(user => user.isActive).length,
        recentRegistrations: users.filter(user => 
          new Date(user.createdAt) > oneMonthAgo
        ).length,
      };
      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
} 