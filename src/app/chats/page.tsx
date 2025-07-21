'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { ChatMessage, ChatAttempt, Conversation } from '@/types';
import { ChatService } from '@/lib/api/chatService';
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const messageStatusColors = {
  enviado: 'bg-blue-100 text-blue-800',
  entregado: 'bg-yellow-100 text-yellow-800',
  leido: 'bg-green-100 text-green-800',
  fallido: 'bg-red-100 text-red-800',
};

const messageStatusIcons = {
  enviado: ClockIcon,
  entregado: CheckCircleIcon,
  leido: CheckCircleIcon,
  fallido: XCircleIcon,
};

export default function ChatsPage() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'messages' | 'attempts' | 'ai'>('conversations');
  const [loading, setLoading] = useState(true);
  const [allConversations, setAllConversations] = useState<{ conversations: Conversation[]; pagination: any }>({ conversations: [], pagination: {} });
  const [allMessages, setAllMessages] = useState<{ messages: ChatMessage[]; pagination: any }>({ messages: [], pagination: {} });
  const [allAttempts, setAllAttempts] = useState<{ attempts: ChatAttempt[]; pagination: any }>({ attempts: [], pagination: {} });
  const [aiInfo, setAiInfo] = useState<any>(null);
  const [aiTestMessage, setAiTestMessage] = useState('');
  const [aiTestResult, setAiTestResult] = useState<any>(null);
  const [adminStatus, setAdminStatus] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    loadAdminStatus();
    loadAIInfo();
  }, []);

  useEffect(() => {
    if (activeTab === 'conversations') {
      loadAllConversations();
    } else if (activeTab === 'messages') {
      loadAllMessages();
    } else if (activeTab === 'attempts') {
      loadAllAttempts();
    }
  }, [activeTab, currentPage, pageSize]);

  const loadAdminStatus = async () => {
    try {
      const status = await ChatService.getAdminStatus();
      setAdminStatus(status);
    } catch (error) {
      console.error('Error loading admin status:', error);
    }
  };

  const loadAIInfo = async () => {
    try {
      const info = await ChatService.getAIInfo();
      setAiInfo(info);
    } catch (error) {
      console.error('Error loading AI info:', error);
    }
  };

  const loadAllConversations = async () => {
    setLoading(true);
    try {
      const conversations = await ChatService.getAllConversations(currentPage, pageSize);
      setAllConversations(conversations);
    } catch (error) {
      console.error('Error loading all conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMessages = async () => {
    setLoading(true);
    try {
      const messages = await ChatService.getAllMessages(currentPage, pageSize);
      setAllMessages(messages);
    } catch (error) {
      console.error('Error loading all messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllAttempts = async () => {
    setLoading(true);
    try {
      const attempts = await ChatService.getAllAttempts(currentPage, pageSize);
      setAllAttempts(attempts);
    } catch (error) {
      console.error('Error loading all attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAI = async () => {
    if (!aiTestMessage.trim()) return;
    
    try {
      const result = await ChatService.testAI(aiTestMessage);
      setAiTestResult(result);
    } catch (error) {
      console.error('Error testing AI:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (loading && !adminStatus) {
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
          <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo de Chat</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra todas las conversaciones, mensajes e intentos del sistema
          </p>
        </div>

        {/* Admin Status */}
        {adminStatus && (
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado del Servicio Administrativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Servicio: {adminStatus.service}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Máx. por página: {adminStatus.limits?.maxItemsPerPage}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">Máx. páginas: {adminStatus.limits?.maxPages}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Timestamp: {new Date(adminStatus.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'conversations', name: 'Todas las Conversaciones', icon: UserIcon },
                { id: 'messages', name: 'Todos los Mensajes', icon: ChatBubbleLeftRightIcon },
                { id: 'attempts', name: 'Todos los Intentos', icon: ClockIcon },
                { id: 'ai', name: 'Configuración IA', icon: MagnifyingGlassIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Todas las Conversaciones */}
            {activeTab === 'conversations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Todas las Conversaciones</h4>
                  <div className="flex space-x-2">
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value={10}>10 por página</option>
                      <option value={20}>20 por página</option>
                      <option value={50}>50 por página</option>
                      <option value={100}>100 por página</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {allConversations.conversations.map((conversation) => (
                        <li key={conversation.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {conversation.participant1_id} ↔ {conversation.participant2_id}
                                </p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  conversation.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {conversation.is_active ? 'Activa' : 'Inactiva'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {conversation.message_count} mensajes • Creada: {formatDate(conversation.created_at)}
                              </p>
                              {conversation.last_message && (
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                  Último mensaje: {conversation.last_message}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Paginación */}
                {allConversations.pagination && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, allConversations.pagination.total)} de {allConversations.pagination.total} resultados
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Página {currentPage} de {allConversations.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(allConversations.pagination.totalPages, currentPage + 1))}
                        disabled={currentPage === allConversations.pagination.totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Todos los Mensajes */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Todos los Mensajes</h4>
                  <div className="flex space-x-2">
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value={10}>10 por página</option>
                      <option value={20}>20 por página</option>
                      <option value={50}>50 por página</option>
                      <option value={100}>100 por página</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allMessages.messages.map((message) => {
                      const StatusIcon = messageStatusIcons[message.estado];
                      return (
                        <div key={message.id} className="bg-white shadow rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {message.is_ai_response ? 'IA' : `Usuario: ${message.usuario_id}`}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${messageStatusColors[message.estado]}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {message.estado}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{message.mensaje}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(message.fecha)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Paginación */}
                {allMessages.pagination && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, allMessages.pagination.total)} de {allMessages.pagination.total} resultados
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Página {currentPage} de {allMessages.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(allMessages.pagination.totalPages, currentPage + 1))}
                        disabled={currentPage === allMessages.pagination.totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Todos los Intentos */}
            {activeTab === 'attempts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Todos los Intentos de Chat</h4>
                  <div className="flex space-x-2">
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value={10}>10 por página</option>
                      <option value={20}>20 por página</option>
                      <option value={50}>50 por página</option>
                      <option value={100}>100 por página</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {allAttempts.attempts.map((attempt) => (
                        <li key={attempt.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Estudiante: {attempt.estudiante_id}
                              </p>
                              <p className="text-sm text-gray-500">
                                Intento registrado
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(attempt.fecha_intento)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Paginación */}
                {allAttempts.pagination && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, allAttempts.pagination.total)} de {allAttempts.pagination.total} resultados
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Página {currentPage} de {allAttempts.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(allAttempts.pagination.totalPages, currentPage + 1))}
                        disabled={currentPage === allAttempts.pagination.totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Configuración IA */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                {aiInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Información de IA</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Modelo</p>
                        <p className="text-sm font-medium">{aiInfo.ai?.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Proveedor</p>
                        <p className="text-sm font-medium">{aiInfo.ai?.provider}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Versión</p>
                        <p className="text-sm font-medium">{aiInfo.ai?.version}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estado</p>
                        <p className="text-sm font-medium">{aiInfo.ai?.status}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Probar IA</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mensaje de prueba
                      </label>
                      <textarea
                        value={aiTestMessage}
                        onChange={(e) => setAiTestMessage(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Escribe un mensaje para probar la IA..."
                      />
                    </div>
                    <button
                      onClick={testAI}
                      disabled={!aiTestMessage.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      Probar IA
                    </button>
                  </div>

                  {aiTestResult && (
                    <div className="mt-4 bg-white rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Resultado de la prueba</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Entrada:</p>
                          <p className="text-sm">{aiTestResult.input}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Respuesta:</p>
                          <p className="text-sm">{aiTestResult.response}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tokens utilizados:</p>
                          <p className="text-sm">{aiTestResult.tokensUsed}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 