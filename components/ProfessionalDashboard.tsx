import React, { useState } from 'react';
import type { Professional, ScheduleData, AppointmentStatus, UpdatableProfessional } from '../types';
import ProfessionalSchedule from './ProfessionalSchedule';
import GeminiChat from './GeminiChat';
import { PencilIcon } from './Icons';

interface ProfessionalDashboardProps {
  professional: Professional;
  scheduleData: ScheduleData;
  setScheduleData: React.Dispatch<React.SetStateAction<ScheduleData>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateNotes: (appointmentId: string, notes: string) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onUpdateProfile: (professionalId: string, data: UpdatableProfessional) => void;
}

export default function ProfessionalDashboard({ professional, scheduleData, setScheduleData, isLoading, setIsLoading, onUpdateNotes, onUpdateStatus, onUpdateProfile }: ProfessionalDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(professional.name);
  const [editedSpecialty, setEditedSpecialty] = useState(professional.specialty);
  const [editedConsultationPrice, setEditedConsultationPrice] = useState(professional.consultationPrice || 0);
  
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(professional.id, { name: editedName, specialty: editedSpecialty, consultationPrice: editedConsultationPrice });
    setIsEditing(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Minha Agenda</h2>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border rounded-lg">
                  <PencilIcon className="w-4 h-4" />
                  Editar Perfil
              </button>
          </div>
          <ProfessionalSchedule 
            professional={professional} 
            appointments={scheduleData.appointments}
            onUpdateNotes={onUpdateNotes}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
        <div>
          <GeminiChat 
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            userRole="professional"
          />
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Editar Perfil</h3>
            <form onSubmit={handleProfileSave}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Especialidade</label>
                  <input
                    type="text"
                    id="specialty"
                    value={editedSpecialty}
                    onChange={(e) => setEditedSpecialty(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="consultation-price" className="block text-sm font-medium text-gray-700">Valor da Consulta (R$)</label>
                  <input
                    type="number"
                    id="consultation-price"
                    value={editedConsultationPrice}
                    onChange={(e) => setEditedConsultationPrice(parseFloat(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}