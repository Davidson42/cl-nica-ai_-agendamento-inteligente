import React from 'react';
import type { ScheduleData, AppointmentStatus, Professional } from '../types';
import { ChartIcon } from './Icons';
import ProfessionalSchedule from './ProfessionalSchedule';

interface ReportsProps {
  scheduleData: ScheduleData;
  onUpdateNotes: (appointmentId: string, notes: string) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
}

const statusOrder: AppointmentStatus[] = ['concluido', 'confirmado', 'agendado', 'cancelado'];
const statusText: Record<AppointmentStatus, string> = {
    concluido: 'Concluídas',
    confirmado: 'Confirmadas',
    agendado: 'Agendadas',
    cancelado: 'Canceladas'
};

const statusColors: Record<AppointmentStatus, string> = {
    concluido: 'bg-gray-500',
    confirmado: 'bg-green-500',
    agendado: 'bg-blue-500',
    cancelado: 'bg-red-500'
};


export default function Reports({ scheduleData, onUpdateNotes, onUpdateStatus }: ReportsProps) {
  const { professionals, appointments } = scheduleData;

  const totalAppointments = appointments.length;

  const appointmentsByStatus = appointments.reduce((acc, appt) => {
    acc[appt.status] = (acc[appt.status] || 0) + 1;
    return acc;
  }, {} as Record<AppointmentStatus, number>);

  const appointmentsByProfessional = professionals.map(prof => ({
    ...prof,
    count: appointments.filter(appt => appt.professionalId === prof.id).length
  })).sort((a,b) => b.count - a.count);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ChartIcon className="w-6 h-6 text-indigo-600"/>
            Resumo de Atendimentos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-700">Total de Consultas</p>
                <p className="text-3xl font-bold text-indigo-900">{totalAppointments}</p>
            </div>
             {statusOrder.map(status => (
                <div key={status} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-600">{statusText[status]}</p>
                    <p className={`text-3xl font-bold text-gray-800`}>{appointmentsByStatus[status] || 0}</p>
                     <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className={`${statusColors[status]} h-1.5 rounded-full`} style={{width: `${totalAppointments > 0 ? ((appointmentsByStatus[status] || 0) / totalAppointments) * 100 : 0}%`}}></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Agendas dos Profissionais</h3>
        <div className="space-y-6">
            {professionals.map(prof => (
                <ProfessionalSchedule 
                    key={prof.id}
                    professional={prof}
                    appointments={appointments}
                    onUpdateNotes={onUpdateNotes}
                    onUpdateStatus={onUpdateStatus}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
