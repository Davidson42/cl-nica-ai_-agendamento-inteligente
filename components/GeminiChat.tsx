
import React, { useState } from 'react';
import type { ScheduleData, UserRole } from '../types';
import { manageScheduleWithAI } from '../services/geminiService';
import { SendIcon, SparklesIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface GeminiChatProps {
  scheduleData: ScheduleData;
  setScheduleData: React.Dispatch<React.SetStateAction<ScheduleData>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: UserRole;
}

const examplePrompts = {
    admin: [
        "Cancele a consulta de Roberto Almeida",
        "Qual a agenda da Dra. Ana Silva para amanhã?",
        "Marque uma consulta para 'Juliana Paes' com Dr. Carlos na sexta-feira às 10h."
    ],
    professional: [
        "Confirme todas as minhas consultas de hoje.",
        "Adicione um bloqueio na minha agenda amanhã das 12h às 13h para almoço.",
        "Qual é meu primeiro paciente de amanhã?"
    ],
    patient: [
        "Gostaria de marcar uma consulta com a Dra. Ana Silva.",
        "Quais os horários disponíveis para Fisioterapia na próxima semana?",
        "Preciso remarcar minha consulta para a próxima terça."
    ]
};

export default function GeminiChat({ scheduleData, setScheduleData, isLoading, setIsLoading, userRole }: GeminiChatProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const updatedSchedule = await manageScheduleWithAI(prompt, scheduleData);
    
    if (updatedSchedule) {
      setScheduleData(updatedSchedule);
      setPrompt('');
    } else {
      setError('Não foi possível processar o pedido. A IA pode ter retornado um formato inesperado. Tente novamente.');
    }

    setIsLoading(false);
  };
  
  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-purple-500" />
        Assistente AI
      </h3>

      <div className="flex-grow mb-4 overflow-y-auto">
        <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
          Use linguagem natural para gerenciar a agenda.
        </p>
        <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">Exemplos:</h4>
            <div className="flex flex-col gap-2">
                {(userRole && examplePrompts[userRole] || examplePrompts.patient).map((ex, i) => (
                    <button key={i} onClick={() => handleExampleClick(ex)} className="text-left text-xs text-blue-600 hover:underline bg-blue-50 p-2 rounded">
                        "{ex}"
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Fale com a IA..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? <LoadingSpinner /> : <SendIcon className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
