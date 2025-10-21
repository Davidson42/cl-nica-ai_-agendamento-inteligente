import React, { useState, useMemo } from 'react';
import type { Professional, Appointment, ScheduleData } from '../types';
import CalendarScheduler from './CalendarScheduler';
import { ProfessionalIcon, TrashIcon } from './Icons';

interface PatientViewProps {
  scheduleData: ScheduleData;
  onBookAppointment: (professionalId: string, patientName: string, start: Date, end: Date) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

export default function PatientView({ scheduleData, onBookAppointment, onCancelAppointment }: PatientViewProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchedAppointments, setSearchedAppointments] = useState<Appointment[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      const found = scheduleData.appointments.filter(
        appt => appt.patientName.toLowerCase() === searchName.trim().toLowerCase()
      ).sort((a,b) => Number(b.start) - Number(a.start));
      setSearchedAppointments(found);
    }
  };
  
  const { futureAppointments, pastAppointments } = useMemo(() => {
    if (!searchedAppointments) return { futureAppointments: [], pastAppointments: [] };
    const now = new Date().getTime();
    const future = searchedAppointments.filter(a => Number(a.start) >= now);
    const past = searchedAppointments.filter(a => Number(a.start) < now);
    return { futureAppointments: future, pastAppointments: past };
  }, [searchedAppointments]);

  const getProfessionalName = (id: string) => {
      return scheduleData.professionals.find(p => p.id === id)?.name || 'Profissional não encontrado';
  }

  const getStatusChip = (status: Appointment['status']) => {
    const styles: { [key in Appointment['status']]: string } = {
        agendado: 'bg-blue-100 text-blue-800',
        confirmado: 'bg-green-100 text-green-800',
        concluido: 'bg-gray-200 text-gray-700',
        cancelado: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
  };


  if (selectedProfessional) {
    return (
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedProfessional(null)} 
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Voltar para a lista de profissionais
        </button>
        <h2 className="text-2xl font-bold mb-4">Agendar com {selectedProfessional.name}</h2>
        <CalendarScheduler 
          professional={selectedProfessional}
          appointments={scheduleData.appointments.filter(a => a.professionalId === selectedProfessional.id)}
          onBookAppointment={onBookAppointment}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Agendar uma Consulta</h2>
        <div className="space-y-4">
          {scheduleData.professionals.map(prof => (
            <div key={prof.id} className="p-4 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                      <ProfessionalIcon className="w-6 h-6 text-blue-700"/>
                  </div>
                  <div>
                      <p className="font-semibold text-lg text-gray-800">{prof.name}</p>
                      <p className="text-sm text-gray-500">{prof.specialty}</p>
                  </div>
              </div>
              <button
                onClick={() => setSelectedProfessional(prof)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Ver Agenda
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Minhas Consultas</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input 
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Digite seu nome completo para buscar"
                className="flex-grow p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                Buscar
            </button>
        </form>

        {searchedAppointments && (
            <div className="space-y-6">
                {futureAppointments.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2 text-gray-700">Consultas Futuras</h3>
                        <ul className="space-y-3">
                           {futureAppointments.map(appt => (
                               <li key={appt.id} className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                                   <div>
                                       <p className="font-semibold">{getProfessionalName(appt.professionalId)}</p>
                                       <p className="text-sm text-gray-600">{new Date(Number(appt.start)).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        {getStatusChip(appt.status)}
                                        {(appt.status === 'agendado' || appt.status === 'confirmado') && (
                                            <button 
                                                onClick={() => onCancelAppointment(appt.id)} 
                                                title="Cancelar consulta"
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        )}
                                   </div>
                               </li>
                           ))}
                        </ul>
                    </div>
                )}
                {pastAppointments.length > 0 && (
                     <div>
                        <h3 className="font-semibold mb-2 text-gray-700">Consultas Passadas</h3>
                        <ul className="space-y-3">
                           {pastAppointments.map(appt => (
                               <li key={appt.id} className="p-3 bg-gray-50 border rounded-md opacity-70">
                                   <div>
                                       <p className="font-semibold">{getProfessionalName(appt.professionalId)}</p>
                                       <p className="text-sm text-gray-600">{new Date(Number(appt.start)).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        {getStatusChip(appt.status)}
                                   </div>
                               </li>
                           ))}
                        </ul>
                    </div>
                )}
                 {searchedAppointments.length === 0 && (
                    <p className="text-center text-gray-500">Nenhuma consulta encontrada para "{searchName}".</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
}