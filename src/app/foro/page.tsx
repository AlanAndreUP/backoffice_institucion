'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Post, Author, Tag, CreatePostForm } from '@/types';
import { ForoService } from '@/lib/api/foroService';
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

export default function ForoPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts();
  }, [currentPage, filterAuthor, filterTag]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: 10,
        ...(filterAuthor && { authorId: filterAuthor }),
        ...(filterTag && { tag: filterTag }),
      };
      
      const response = await ForoService.getPosts();
      // Si response tiene la forma { data, pagination }, úsala; si es un array, úsalo directamente
      let postsData: Post[] = [];
      let totalPagesValue = 1;

      if (Array.isArray(response)) {
        postsData = response;
        totalPagesValue = 1;
        // Corregido: Añadimos comprobación de tipos para evitar errores de TypeScript
      } else if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        Array.isArray((response as { data: unknown }).data)
      ) {
        const respObj = response as { data: Post[]; pagination?: { totalPages?: number } };
        postsData = respObj.data || [];
        totalPagesValue = respObj.pagination?.totalPages || 1;
      }

      setPosts(postsData);
      setTotalPages(totalPagesValue);
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async () => {
    if (!searchTerm.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      const response = await ForoService.searchPosts(searchTerm);
      // Por ahora usamos datos mock hasta que el servicio esté implementado
      setPosts(response as Post[]);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreatePostForm) => {
    try {
      const newPost = await ForoService.createPost(postData as any);
      setPosts(prev => [newPost, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updatePost = async (id: string, postData: Partial<Post>) => {
    try {
      const updatedPost = await ForoService.updatePost(id, postData);
      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post));
      setShowEditModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        await ForoService.deletePost(id);
        setPosts(prev => prev.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading && posts.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-900">Gestión del Foro</h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra publicaciones y contenido del foro
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nueva Publicación
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPosts()}
                  placeholder="Buscar publicaciones..."
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <select
                value={filterAuthor}
                onChange={(e) => setFilterAuthor(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todos los autores</option>
                {/* Aquí se cargarían los autores únicos */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todos los tags</option>
                {/* Aquí se cargarían los tags únicos */}
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={searchPosts}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Buscar
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterAuthor('');
                  setFilterTag('');
                  loadPosts();
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
              {post.images && post.images.length > 0 && (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {post.body}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {post.authors.map(author => author.name).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {post.likes}
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      {post.comments}
                    </div>
                  </div>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      >
                        {tag.value}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(post.created_at)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowEditModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}

        {/* Post Details Modal */}
        {selectedPost && !showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-xl font-medium text-gray-900 mb-4">{selectedPost.title}</h3>
                
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={selectedPost.images[0]}
                      alt={selectedPost.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.body}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Autores:</strong> {selectedPost.authors.map(author => author.name).join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {selectedPost.authors.map(author => author.email).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {selectedPost.likes} me gusta
                    </div>
                    <div className="flex items-center">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      {selectedPost.comments} comentarios
                    </div>
                  </div>
                </div>

                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          {tag.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Creado: {formatDate(selectedPost.created_at)}</span>
                  <span>Actualizado: {formatDate(selectedPost.updated_at)}</span>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <CreatePostModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={createPost}
          />
        )}

        {/* Edit Post Modal */}
        {showEditModal && selectedPost && (
          <EditPostModal
            post={selectedPost}
            onClose={() => {
              setShowEditModal(false);
              setSelectedPost(null);
            }}
            onSubmit={updatePost}
          />
        )}
      </div>
    </Layout>
  );
}

// Componente para crear publicación
function CreatePostModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: CreatePostForm) => void }) {
  const [formData, setFormData] = useState<CreatePostForm>({
    title: '',
    body: '',
    authors: [{ id: '1', name: 'Admin', email: 'admin@example.com' }],
    tags: [],
    images: [],
  });

  const [newTag, setNewTag] = useState({ value: '', color: '#3B82F6' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.value.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, { ...newTag }]
      }));
      setNewTag({ value: '', color: '#3B82F6' });
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nueva Publicación</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contenido</label>
              <textarea
                required
                rows={8}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag.value}
                  onChange={(e) => setNewTag({ ...newTag, value: e.target.value })}
                  placeholder="Nuevo tag"
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <input
                  type="color"
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  >
                    {tag.value}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
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
                Crear Publicación
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Componente para editar publicación
function EditPostModal({ post, onClose, onSubmit }: { post: Post; onClose: () => void; onSubmit: (id: string, data: Partial<Post>) => void }) {
  const [formData, setFormData] = useState<Partial<Post>>({
    title: post.title,
    body: post.body,
    authors: post.authors,
    tags: post.tags,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(post.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Publicación</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contenido</label>
              <textarea
                required
                rows={8}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
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
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 