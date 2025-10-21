import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { Professional, Appointment, AppointmentStatus } from '../types';
import { CalendarIcon, NoteIcon, DotsVerticalIcon } from './Icons';

interface ProfessionalScheduleProps {
  professional: Professional;
  appointments: Appointment[];
  onUpdateNotes: (appointmentId: string, notes: string) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
}

const statusOptions: { label: string; value: AppointmentStatus }[] = [
    { label: 'Confirmar', value: 'confirmado' },
    { label: 'Marcar como Concluído', value: 'concluido' },
    { label: 'Cancelar', value: 'cancelado' },
    { label: 'Reagendar', value: 'agendado' },
];

export default function ProfessionalSchedule({ professional, appointments, onUpdateNotes, onUpdateStatus }: ProfessionalScheduleProps) {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const professionalAppointments = useMemo(() => {
    return appointments
      .filter(appt => appt.professionalId === professional.id)
      .sort((a, b) => Number(a.start) - Number(b.start));
  }, [appointments, professional.id]);

  const groupedAppointments = useMemo(() => {
    const groups: { [key: string]: Appointment[] } = {};
    professionalAppointments.forEach(appt => {
      const date = new Date(Number(appt.start)).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appt);
    });
    return groups;
  }, [professionalAppointments]);

  const handleToggleNotes = (appointment: Appointment) => {
    if (expandedNoteId === appointment.id) {
      setExpandedNoteId(null);
    } else {
      setActiveMenuId(null);
      setExpandedNoteId(appointment.id);
      setNoteContent(appointment.notes || '');
    }
  };

  const handleSaveNotes = (appointmentId: string) => {
    onUpdateNotes(appointmentId, noteContent);
    setExpandedNoteId(null);
  };
  
  const handleStatusChange = (appointmentId: string, status: AppointmentStatus) => {
    onUpdateStatus(appointmentId, status);
    setActiveMenuId(null);
  };

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

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CalendarIcon className="w-6 h-6 text-blue-600"/>
        Agenda de {professional.name}
      </h3>
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {Object.keys(groupedAppointments).length > 0 ? (
          Object.entries(groupedAppointments).map(([date, appts]) => (
            <div key={date}>
              <h4 className="font-semibold text-gray-600 bg-gray-100 p-2 rounded-t-md border-b sticky top-0">{date}</h4>
              <ul className="divide-y divide-gray-200">
                {appts.map(appt => (
                  <li key={appt.id} className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{appt.patientName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(Number(appt.start)).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(Number(appt.end)).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2 relative">
                        {getStatusChip(appt.status)}
                        <button onClick={() => handleToggleNotes(appt)} className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors">
                            <NoteIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={() => setActiveMenuId(activeMenuId === appt.id ? null : appt.id)} className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors">
                            <DotsVerticalIcon className="w-5 h-5" />
                        </button>
                        {activeMenuId === appt.id && (
                            <div ref={menuRef} className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                                <ul className="py-1 text-sm text-gray-700">
                                    {statusOptions.filter(opt => opt.value !== appt.status).map(option => (
                                        <li key={option.value}>
                                            <button onClick={() => handleStatusChange(appt.id, option.value)} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                                {option.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                      </div>
                    </div>
                    {expandedNoteId === appt.id && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md border">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Notas Internas</h5>
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Adicione notas sobre a consulta..."
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <button onClick={() => setExpandedNoteId(null)} className="px-3 py-1 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md">
                                    Cancelar
                                </button>
                                <button onClick={() => handleSaveNotes(appt.id)} className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                                    Salvar Notas
                                </button>
                            </div>
                        </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">Nenhuma consulta agendada.</p>
        )}
      </div>
    </div>
  );
}
