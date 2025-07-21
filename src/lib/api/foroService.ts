import axios from 'axios';
import { API_CONFIG, createAuthHeaders, REQUEST_TIMEOUT } from './config';
import { Post, ApiResponse, PaginatedResponse } from '@/types';

const foroApi = axios.create({
  baseURL: API_CONFIG.FORO_SERVICE.baseURL,
  timeout: REQUEST_TIMEOUT,
});

export class ForoService {
  // Obtener todas las publicaciones
  static async getPosts(token?: string): Promise<{ posts: Post[]; pagination: any }> {
    try {
      const response = await foroApi.get(
        API_CONFIG.FORO_SERVICE.endpoints.posts,
        { headers: createAuthHeaders(token) }
      );
      
      // Manejar la estructura de respuesta del backend
      if (response.data.success && response.data.data) {
        return {
          posts: response.data.data.posts || [],
          pagination: response.data.data.pagination || {}
        };
      }
      
      // Fallback para estructura anterior
      return {
        posts: response.data.data || response.data || [],
        pagination: {}
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  // Obtener publicación por ID
  static async getPostById(id: string, token?: string): Promise<Post> {
    try {
      const response = await foroApi.get(
        API_CONFIG.FORO_SERVICE.endpoints.post(id),
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  // Crear nueva publicación
  static async createPost(postData: {
    title: string;
    body: string;
    authors: {
      id: string;
      name: string;
      email: string;
    }[];
    tags: {
      value: string;
      color: string;
    }[];
    images?: File[];
  }, token?: string): Promise<Post> {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('body', postData.body);
      formData.append('authors', JSON.stringify(postData.authors));
      formData.append('tags', JSON.stringify(postData.tags));
      
      if (postData.images) {
        postData.images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      }

      const response = await foroApi.post(
        API_CONFIG.FORO_SERVICE.endpoints.posts,
        formData,
        { 
          headers: {
            ...createAuthHeaders(token),
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Actualizar publicación
  static async updatePost(id: string, postData: Partial<Post>, token?: string): Promise<Post> {
    try {
      const response = await foroApi.put(
        API_CONFIG.FORO_SERVICE.endpoints.post(id),
        postData,
        { headers: createAuthHeaders(token) }
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Eliminar publicación
  static async deletePost(id: string, token?: string): Promise<void> {
    try {
      await foroApi.delete(
        API_CONFIG.FORO_SERVICE.endpoints.post(id),
        { headers: createAuthHeaders(token) }
      );
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Buscar publicaciones
  static async searchPosts(query: string, token?: string): Promise<{ posts: Post[]; pagination: any }> {
    try {
      const response = await foroApi.get(
        API_CONFIG.FORO_SERVICE.endpoints.search,
        { 
          params: { query: query },
          headers: createAuthHeaders(token) 
        }
      );
      
      // Manejar la estructura de respuesta del backend
      if (response.data.success && response.data.data) {
        return {
          posts: response.data.data.posts || [],
          pagination: response.data.data.pagination || {}
        };
      }
      
      // Fallback para estructura anterior
      return {
        posts: response.data.data || response.data || [],
        pagination: {}
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  // Obtener estadísticas del foro
  static async getForoStats(token?: string): Promise<{
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    recentPosts: number;
  }> {
    try {
      const response = await this.getPosts(token);
      const posts = response.posts;
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const stats = {
        totalPosts: posts.length,
        totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
        totalComments: posts.reduce((sum, post) => sum + (post.comments || 0), 0),
        recentPosts: posts.filter(post => 
          new Date(post.created_at) > oneWeekAgo
        ).length,
      };
      return stats;
    } catch (error) {
      console.error('Error fetching foro stats:', error);
      throw error;
    }
  }
} 