import axios from 'axios';
import { API_CONFIG, createAuthHeaders, REQUEST_TIMEOUT } from './config';
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentFilters, ApiResponse, PaginatedResponse } from '@/types';

const appointmentApi = axios.create({
  baseURL: API_CONFIG.APPOINTMENT_SERVICE.baseURL,
  timeout: REQUEST_TIMEOUT,
});

export class AppointmentService {
  // Obtener todas las citas con filtros
  static async getAppointments(filters?: AppointmentFilters, token?: string): Promise<{ data: Appointment[]; pagination: any }> {
    try {
      const response = await appointmentApi.get(
        API_CONFIG.APPOINTMENT_SERVICE.endpoints.appointments,
        { 
          params: filters,
          headers: createAuthHeaders(token) 
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  // Obtener cita por ID
  static async getAppointmentById(id: string, token?: string): Promise<Appointment> {
    try {
      const response = await appointmentApi.get(
        API_CONFIG.APPOINTMENT_SERVICE.endpoints.appointment(id),
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  // Crear nueva cita
  static async createAppointment(appointmentData: CreateAppointmentRequest, token?: string): Promise<Appointment> {
    try {
      const response = await appointmentApi.post(
        API_CONFIG.APPOINTMENT_SERVICE.endpoints.appointments,
        appointmentData,
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  // Actualizar cita
  static async updateAppointment(id: string, appointmentData: UpdateAppointmentRequest, token?: string): Promise<Appointment> {
    try {
      const response = await appointmentApi.put(
        API_CONFIG.APPOINTMENT_SERVICE.endpoints.appointment(id),
        appointmentData,
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  // Actualizar estado de cita
  static async updateAppointmentStatus(id: string, status: Appointment['estado_cita'], token?: string): Promise<Appointment> {
    try {
      const response = await appointmentApi.patch(
        API_CONFIG.APPOINTMENT_SERVICE.endpoints.updateStatus(id),
        { estado_cita: status },
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  // Eliminar cita
  static async deleteAppointment(id: string, token?: string): Promise<void> {
    try {
      await appointmentApi.delete(
        API_CONFIG.APPOINTMENT_SERVICE.endpoints.appointment(id),
        { headers: createAuthHeaders(token) }
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  // Obtener estadísticas de citas
  static async getAppointmentStats(token?: string): Promise<{
    total: number;
    pendiente: number;
    confirmada: number;
    cancelada: number;
    completada: number;
    no_asistio: number;
  }> {
    try {
      const appointments = await this.getAppointments({ limit: 1000 }, token);
      const stats = {
        total: appointments.data.length,
        pendiente: appointments.data.filter(a => a.estado_cita === 'pendiente').length,
        confirmada: appointments.data.filter(a => a.estado_cita === 'confirmada').length,
        cancelada: appointments.data.filter(a => a.estado_cita === 'cancelada').length,
        completada: appointments.data.filter(a => a.estado_cita === 'completada').length,
        no_asistio: appointments.data.filter(a => a.estado_cita === 'no_asistio').length,
      };
      return stats;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  }
} 