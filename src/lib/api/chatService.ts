import axios from 'axios';
import { API_CONFIG, createAuthHeaders, REQUEST_TIMEOUT } from './config';
import { ChatMessage, ChatAttempt, Conversation, SendMessageRequest, SendMessageResponse, ChatFilters, ApiResponse } from '@/types';

const chatApi = axios.create({
  baseURL: API_CONFIG.CHAT_SERVICE.baseURL,
  timeout: REQUEST_TIMEOUT,
});

export class ChatService {
  // Health check del servicio
  static async getHealth(): Promise<any> {
    try {
      const response = await chatApi.get(API_CONFIG.CHAT_SERVICE.endpoints.health);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat health:', error);
      throw error;
    }
  }

  // Enviar mensaje de chat con IA
  static async sendMessage(messageData: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await chatApi.post(
        API_CONFIG.CHAT_SERVICE.endpoints.sendMessage,
        messageData
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Obtener historial de chat de un estudiante
  static async getChatHistory(estudianteId: string, page: number = 1, limit: number = 20): Promise<{ messages: ChatMessage[]; attempts: ChatAttempt[]; pagination: any }> {
    try {
      const response = await chatApi.get(
        API_CONFIG.CHAT_SERVICE.endpoints.chatHistory(estudianteId),
        { params: { page, limit } }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  // Obtener solo mensajes (más rápido)
  static async getChatMessages(estudianteId: string, page: number = 1, limit: number = 20): Promise<{ messages: ChatMessage[]; pagination: any }> {
    try {
      const response = await chatApi.get(
        API_CONFIG.CHAT_SERVICE.endpoints.chatMessages(estudianteId),
        { params: { page, limit } }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  }

  // Registrar intento de chat
  static async registerChatAttempt(estudianteId: string): Promise<ChatAttempt> {
    try {
      const response = await chatApi.post(
        API_CONFIG.CHAT_SERVICE.endpoints.chatAttempt,
        { estudiante_id: estudianteId }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error registering chat attempt:', error);
      throw error;
    }
  }

  // Obtener intentos de chat de un estudiante
  static async getChatAttempts(estudianteId: string): Promise<ChatAttempt[]> {
    try {
      const response = await chatApi.get(
        API_CONFIG.CHAT_SERVICE.endpoints.chatAttempts(estudianteId)
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching chat attempts:', error);
      throw error;
    }
  }

  // Obtener estado del servicio de chat
  static async getChatStatus(): Promise<any> {
    try {
      const response = await chatApi.get(API_CONFIG.CHAT_SERVICE.endpoints.chatStatus);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching chat status:', error);
      throw error;
    }
  }

  // Obtener información de IA
  static async getAIInfo(): Promise<any> {
    try {
      const response = await chatApi.get(API_CONFIG.CHAT_SERVICE.endpoints.aiInfo);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching AI info:', error);
      throw error;
    }
  }

  // Probar el servicio de IA
  static async testAI(mensaje: string): Promise<any> {
    try {
      const response = await chatApi.post(
        API_CONFIG.CHAT_SERVICE.endpoints.aiTest,
        { mensaje }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error testing AI:', error);
      throw error;
    }
  }

  // Enviar mensaje privado
  static async sendPrivateMessage(messageData: {
    mensaje: string;
    usuario_id: string;
    recipient_id: string;
    conversation_id?: string;
  }): Promise<{ message: ChatMessage }> {
    try {
      const response = await chatApi.post(
        API_CONFIG.CHAT_SERVICE.endpoints.sendPrivateMessage,
        messageData
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error sending private message:', error);
      throw error;
    }
  }

  // Obtener conversaciones de un usuario
  static async getConversations(usuarioId: string, page: number = 1, limit: number = 20): Promise<{ conversations: Conversation[]; pagination: any }> {
    try {
      const response = await chatApi.get(
        API_CONFIG.CHAT_SERVICE.endpoints.conversations(usuarioId),
        { params: { page, limit } }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // Obtener mensajes de una conversación
  static async getConversationMessages(conversationId: string, usuarioId: string, page: number = 1, limit: number = 50): Promise<{ messages: ChatMessage[]; pagination: any }> {
    try {
      const response = await chatApi.get(
        API_CONFIG.CHAT_SERVICE.endpoints.conversationMessages(conversationId),
        { params: { usuario_id: usuarioId, page, limit } }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  }

  // Obtener estado del servicio de conversaciones
  static async getConversationStatus(): Promise<any> {
    try {
      const response = await chatApi.get(API_CONFIG.CHAT_SERVICE.endpoints.conversationStatus);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching conversation status:', error);
      throw error;
    }
  }

  // Obtener información de WebSocket
  static async getWSInfo(): Promise<any> {
    try {
      const response = await chatApi.get(API_CONFIG.CHAT_SERVICE.endpoints.wsInfo);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching WebSocket info:', error);
      throw error;
    }
  }

  // Obtener estadísticas de chat
  static async getChatStats(): Promise<{
    totalMessages: number;
    totalAttempts: number;
    totalConversations: number;
    activeConversations: number;
    recentActivity: number;
  }> {
    try {
      // Aquí podrías implementar lógica para obtener estadísticas
      // Por ahora retornamos datos de ejemplo
      return {
        totalMessages: 0,
        totalAttempts: 0,
        totalConversations: 0,
        activeConversations: 0,
        recentActivity: 0,
      };
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  }
} 