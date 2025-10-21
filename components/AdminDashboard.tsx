import React, { useState } from 'react';
import type { ScheduleData, AppointmentStatus } from '../types';
import Reports from './Reports';
import FinancialReport from './FinancialReport';
import GeminiChat from './GeminiChat';
import AddProfessionalModal from './AddProfessionalModal';
import DeleteProfessionalModal from './DeleteProfessionalModal';
import { PlusIcon, TrashIcon } from './Icons'; // Assuming you have PlusIcon and TrashIcon in Icons.tsx

interface AdminDashboardProps {
  scheduleData: ScheduleData;
  setScheduleData: React.Dispatch<React.SetStateAction<ScheduleData>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateNotes: (appointmentId: string, notes: string) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onAddProfessional: (name: string, specialty: string) => void;
  onDeleteProfessional: (professionalId: string) => void;
}

type Tab = 'reports' | 'financial' | 'ai' | 'professionals';

export default function AdminDashboard({ 
  scheduleData, 
  setScheduleData, 
  isLoading, 
  setIsLoading, 
  onUpdateNotes, 
  onUpdateStatus,
  onAddProfessional,
  onDeleteProfessional
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('reports');
  const [showAddProfessionalModal, setShowAddProfessionalModal] = useState(false);
  const [showDeleteProfessionalModal, setShowDeleteProfessionalModal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'reports':
        return <Reports scheduleData={scheduleData} onUpdateNotes={onUpdateNotes} onUpdateStatus={onUpdateStatus} />;
      case 'financial':
        return <FinancialReport scheduleData={scheduleData} />;
      case 'ai':
        return (
            <div className="max-w-lg mx-auto h-[70vh]">
                 <GeminiChat 
                    scheduleData={scheduleData}
                    setScheduleData={setScheduleData}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    userRole="admin"
                />
            </div>
        );
      case 'professionals':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Gerenciar Profissionais</h3>
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setShowAddProfessionalModal(true)} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Adicionar Profissional
              </button>
              <button 
                onClick={() => setShowDeleteProfessionalModal(true)} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                Excluir Profissional
              </button>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Profissionais Atuais:</h4>
              <ul className="divide-y divide-gray-200 border rounded-md">
                {scheduleData.professionals.length > 0 ? (
                  scheduleData.professionals.map(prof => (
                    <li key={prof.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">{prof.name}</p>
                        <p className="text-sm text-gray-500">{prof.specialty}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-gray-500 text-center">Nenhum profissional cadastrado.</li>
                )}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getTabClass = (tab: Tab) => {
    return `px-4 py-2 font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`;
  }

  return (
    <div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('reports')} className={getTabClass('reports')}>
            Relatórios Gerais
          </button>
          <button onClick={() => setActiveTab('financial')} className={getTabClass('financial')}>
            Financeiro
          </button>
           <button onClick={() => setActiveTab('ai')} className={getTabClass('ai')}>
            Assistente AI
          </button>
          <button onClick={() => setActiveTab('professionals')} className={getTabClass('professionals')}>
            Profissionais
          </button>
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>

      {showAddProfessionalModal && (
        <AddProfessionalModal 
          onAddProfessional={onAddProfessional} 
          onClose={() => setShowAddProfessionalModal(false)} 
        />
      )}

      {showDeleteProfessionalModal && (
        <DeleteProfessionalModal 
          professionals={scheduleData.professionals}
          onDeleteProfessional={onDeleteProfessional} 
          onClose={() => setShowDeleteProfessionalModal(false)} 
        />
      )}
    </div>
  );
}