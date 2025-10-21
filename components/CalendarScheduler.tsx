import React, { useState, useMemo } from 'react';
import type { Professional, Appointment } from '../types';
import { generateCalendarDays, getAvailableTimeSlots } from '../utils/calendar';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { showError } from '../utils/toast'; // Importar showError

interface CalendarSchedulerProps {
  professional: Professional;
  appointments: Appointment[];
  onBookAppointment: (professionalId: string, patientName: string, start: Date, end: Date) => void;
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarScheduler({ professional, appointments, onBookAppointment }: CalendarSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [patientName, setPatientName] = useState('');

  const calendarDays = useMemo(() => generateCalendarDays(currentDate), [currentDate]);
  
  const appointmentsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(a => new Date(a.start).toDateString() === selectedDate.toDateString());
  }, [selectedDate, appointments]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableTimeSlots(selectedDate, appointmentsOnSelectedDate);
  }, [selectedDate, appointmentsOnSelectedDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedTime(null);
  };
  
  const handleTimeClick = (time: Date) => {
      setSelectedTime(time);
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTime && patientName.trim()) {
      const endTime = new Date(selectedTime.getTime() + 45 * 60000); // Assume 45 min duration
      onBookAppointment(professional.id, patientName, selectedTime, endTime);
      setPatientName('');
      setSelectedTime(null);
      // We keep the selectedDate to show the updated schedule
    } else {
      showError('Por favor, insira seu nome completo para agendar.');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-lg text-gray-700">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day.date)}
            disabled={!day.isCurrentMonth}
            className={`
              w-full aspect-square text-sm rounded-lg transition-colors
              ${!day.isCurrentMonth ? 'text-gray-300' : ''}
              ${day.isToday ? 'font-bold text-blue-600' : ''}
              ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
            `}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold text-center mb-4">
            Horários disponíveis para {selectedDate.toLocaleDateString('pt-BR')}
          </h4>
          {availableSlots.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot.toISOString()}
                  onClick={() => handleTimeClick(slot)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedTime?.getTime() === slot.getTime() ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhum horário disponível para esta data.</p>
          )}

          {selectedTime && (
            <form onSubmit={handleBookingSubmit} className="mt-6 max-w-sm mx-auto bg-gray-50 p-4 rounded-lg border">
                <p className="text-center font-semibold mb-2">
                    Confirmar agendamento às {selectedTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={patientName} 
                        onChange={e => setPatientName(e.target.value)} 
                        placeholder="Seu nome completo"
                        className="flex-grow p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                        Agendar
                    </button>
                </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}