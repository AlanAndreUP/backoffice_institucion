import React from 'react';

interface ConversationDetailProps {
  conversation: any;
  messages: any[];
  analysis: any;
  getUserName: (userId: string) => string;
  formatDate: (date: string) => string;
  onClose: () => void;
}

const statusColor = (ok: boolean) => ok ? 'text-green-600' : 'text-red-600';
const statusIcon = (ok: boolean) => ok ? '✅' : '⚠️';

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversation,
  messages,
  analysis,
  getUserName,
  formatDate,
  onClose,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded shadow-inner">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">Detalles de la Conversación</h3>
        <p className="text-sm text-gray-700 mb-1">
          Participantes: <span className="font-semibold">{getUserName(conversation.participant1_id)}</span> ↔ <span className="font-semibold">{getUserName(conversation.participant2_id)}</span>
        </p>
        <p className="text-xs text-gray-500">Creada: {formatDate(conversation.created_at)}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Mensajes</h4>
        <ul className="space-y-2">
          {messages.length === 0 ? (
            <li className="text-gray-500 text-sm">No hay mensajes en esta conversación.</li>
          ) : (
            messages.map((msg) => (
              <li key={msg.id} className="border-b pb-2">
                <span className="font-semibold">{msg.is_ai_response ? 'IA' : getUserName(msg.usuario_id)}:</span>
                <span className="ml-2">{msg.mensaje}</span>
                <span className="ml-4 text-xs text-gray-400">{formatDate(msg.fecha)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Análisis de la IA</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span>{statusIcon(!analysis?.bullying)}</span>
            <span className={statusColor(!analysis?.bullying)}>
              {analysis?.bullying ? 'Posible bullying detectado' : 'Sin bullying'}
            </span>
            <span className="ml-2 text-xs text-gray-500">{analysis?.bullying_explanation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{statusIcon(!analysis?.concern)}</span>
            <span className={statusColor(!analysis?.concern)}>
              {analysis?.concern ? 'Preocupación detectada' : 'Sin preocupación'}
            </span>
            <span className="ml-2 text-xs text-gray-500">{analysis?.concern_explanation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{statusIcon(analysis?.academic_constructive)}</span>
            <span className={statusColor(analysis?.academic_constructive)}>
              {analysis?.academic_constructive ? 'Conversación académica constructiva' : 'No es académica constructiva'}
            </span>
            <span className="ml-2 text-xs text-gray-500">{analysis?.academic_explanation}</span>
          </div>
        </div>
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-700">
          <span className="font-semibold">Texto analizado:</span>
          <pre className="whitespace-pre-wrap">{analysis?.raw}</pre>
        </div>
      </div>
      <button
        className="mt-2 text-blue-600 hover:underline text-sm"
        onClick={onClose}
      >
        Cerrar conversación
      </button>
    </div>
  );
};

export default ConversationDetail; 