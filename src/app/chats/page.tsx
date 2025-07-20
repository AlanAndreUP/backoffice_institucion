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
  const [activeTab, setActiveTab] = useState<'history' | 'conversations' | 'attempts' | 'ai'>('history');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ messages: ChatMessage[]; attempts: ChatAttempt[]; pagination: any }>({ messages: [], attempts: [], pagination: {} });
  const [conversations, setConversations] = useState<{ conversations: Conversation[]; pagination: any }>({ conversations: [], pagination: {} });
  const [conversationMessages, setConversationMessages] = useState<{ messages: ChatMessage[]; pagination: any }>({ messages: [], pagination: {} });
  const [chatAttempts, setChatAttempts] = useState<ChatAttempt[]>([]);
  const [aiInfo, setAiInfo] = useState<any>(null);
  const [aiTestMessage, setAiTestMessage] = useState('');
  const [aiTestResult, setAiTestResult] = useState<any>(null);
  const [serviceStatus, setServiceStatus] = useState<any>(null);

  // Mock data para estudiantes (en un caso real vendría de la API de usuarios)
  const mockStudents = [
    { id: 'estudiante1', name: 'Juan Pérez' },
    { id: 'estudiante2', name: 'María García' },
    { id: 'estudiante3', name: 'Carlos López' },
  ];

  useEffect(() => {
    loadServiceStatus();
    loadAIInfo();
  }, []);

  useEffect(() => {
    if (selectedStudent && activeTab === 'history') {
      loadChatHistory();
    }
  }, [selectedStudent, activeTab]);

  useEffect(() => {
    if (selectedConversation && activeTab === 'conversations') {
      loadConversationMessages();
    }
  }, [selectedConversation, activeTab]);

  const loadServiceStatus = async () => {
    try {
      const status = await ChatService.getChatStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Error loading service status:', error);
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

  const loadChatHistory = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const history = await ChatService.getChatHistory(selectedStudent);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async () => {
    if (!selectedConversation) return;
    
    setLoading(true);
    try {
      const messages = await ChatService.getConversationMessages(selectedConversation, 'admin');
      setConversationMessages(messages);
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatAttempts = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const attempts = await ChatService.getChatAttempts(selectedStudent);
      setChatAttempts(attempts);
    } catch (error) {
      console.error('Error loading chat attempts:', error);
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

  const sendTestMessage = async () => {
    if (!selectedStudent || !aiTestMessage.trim()) return;
    
    try {
      const result = await ChatService.sendMessage({
        mensaje: aiTestMessage,
        usuario_id: 'admin',
        estudiante_id: selectedStudent,
      });
      setAiTestMessage('');
      loadChatHistory(); // Recargar historial
    } catch (error) {
      console.error('Error sending test message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.name : studentId;
  };

  if (loading && !serviceStatus) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Chat</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra conversaciones, historial y configuración de IA
          </p>
        </div>

        {/* Service Status */}
        {serviceStatus && (
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado del Servicio</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${serviceStatus.ai?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">IA: {serviceStatus.ai?.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Base de datos: {serviceStatus.database?.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">WebSocket: {serviceStatus.websockets?.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'history', name: 'Historial de Chat', icon: ChatBubbleLeftRightIcon },
                { id: 'conversations', name: 'Conversaciones', icon: UserIcon },
                { id: 'attempts', name: 'Intentos', icon: ClockIcon },
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
            {/* Historial de Chat */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Seleccionar estudiante</option>
                    {mockStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={sendTestMessage}
                    disabled={!selectedStudent || !aiTestMessage.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Enviar Mensaje de Prueba
                  </button>
                </div>

                {selectedStudent && (
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={aiTestMessage}
                        onChange={(e) => setAiTestMessage(e.target.value)}
                        placeholder="Escribe un mensaje de prueba..."
                        className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Historial de {getStudentName(selectedStudent)}
                      </h4>
                      {chatHistory.messages.map((message) => {
                        const StatusIcon = messageStatusIcons[message.estado];
                        return (
                          <div key={message.id} className="mb-4 p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {message.is_ai_response ? 'IA' : 'Usuario'}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${messageStatusColors[message.estado]}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {message.estado}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{message.mensaje}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDate(message.fecha)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conversaciones */}
            {activeTab === 'conversations' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Conversaciones</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {conversations.conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`p-3 rounded-lg cursor-pointer ${
                            selectedConversation === conversation.id
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {conversation.participant1_id} ↔ {conversation.participant2_id}
                              </p>
                              <p className="text-xs text-gray-500">
                                {conversation.message_count} mensajes
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              conversation.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {conversation.is_active ? 'Activa' : 'Inactiva'}
                            </span>
                          </div>
                          {conversation.last_message && (
                            <p className="text-xs text-gray-600 mt-2 truncate">
                              {conversation.last_message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedConversation && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Mensajes de la Conversación</h4>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        {conversationMessages.messages.map((message) => (
                          <div key={message.id} className="mb-3 p-3 bg-white rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {message.usuario_id}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${messageStatusColors[message.estado]}`}>
                                {message.estado}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{message.mensaje}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDate(message.fecha)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Intentos de Chat */}
            {activeTab === 'attempts' && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Seleccionar estudiante</option>
                    {mockStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={loadChatAttempts}
                    disabled={!selectedStudent}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Ver Intentos
                  </button>
                </div>

                {selectedStudent && chatAttempts.length > 0 && (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {chatAttempts.map((attempt) => (
                        <li key={attempt.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {getStudentName(attempt.estudiante_id)}
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