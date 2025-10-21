import React, { useState } from 'react';
import type { ScheduleData, AppointmentStatus } from '../types';
import Reports from './Reports';
import FinancialReport from './FinancialReport';
import GeminiChat from './GeminiChat';

interface AdminDashboardProps {
  scheduleData: ScheduleData;
  setScheduleData: React.Dispatch<React.SetStateAction<ScheduleData>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateNotes: (appointmentId: string, notes: string) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
}

type Tab = 'reports' | 'financial' | 'ai';

export default function AdminDashboard({ scheduleData, setScheduleData, isLoading, setIsLoading, onUpdateNotes, onUpdateStatus }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('reports');

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
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
}
