import React, { useState, useMemo } from 'react';
import type { ScheduleData } from '../types';
import { DollarSignIcon, PrintIcon } from './Icons';

interface FinancialReportProps {
  scheduleData: ScheduleData;
}

export default function FinancialReport({ scheduleData }: FinancialReportProps) {
  const { professionals, appointments } = scheduleData;
  const [currentMonth, setCurrentMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);

  const handlePrint = () => {
    window.print();
  };

  const { year, month } = useMemo(() => {
    const [yearStr, monthStr] = currentMonth.split('-');
    return { year: parseInt(yearStr, 10), month: parseInt(monthStr, 10) };
  }, [currentMonth]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
        const apptDate = new Date(appt.start);
        return apptDate.getFullYear() === year && apptDate.getMonth() === month - 1;
    });
  }, [appointments, year, month]);

  const financialData = useMemo(() => {
    return professionals.map(prof => {
      const completedAppointments = filteredAppointments.filter(
        appt => appt.professionalId === prof.id && appt.status === 'concluido'
      );

      const totalRevenue = completedAppointments.reduce(
        (sum, appt) => sum + appt.price,
        0
      );

      const averageTicket =
        completedAppointments.length > 0
          ? totalRevenue / completedAppointments.length
          : 0;

      return {
        ...prof,
        completedCount: completedAppointments.length,
        totalRevenue,
        averageTicket,
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [professionals, filteredAppointments]);
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const formattedMonth = new Date(year, month - 1).toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 print:hidden">
        <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <DollarSignIcon className="w-6 h-6 text-green-600"/>
            Faturamento por Profissional
        </h3>
        <div className="flex items-center gap-2">
            <input 
                type="month"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
            />
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <PrintIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Imprimir Relatório</span>
            </button>
        </div>
      </div>
      
      <div id="financial-report-content">
        <div className="hidden print:block mb-8 text-center">
            <h1 className="text-2xl font-bold">Relatório Financeiro</h1>
            <h2 className="text-lg font-semibold text-gray-700">Clínica AI</h2>
            <p className="text-gray-500">Mês de Referência: {formattedMonth}</p>
        </div>

        <p className="text-sm text-gray-500 mb-4 print:hidden">
            Exibindo dados para <span className="font-semibold">{formattedMonth}</span>. Este relatório considera apenas as consultas com status "Concluído".
        </p>
        <div className="space-y-4">
            {financialData.map(prof => (
                <div key={prof.id} className="p-4 bg-white rounded-lg border border-gray-200 transition-shadow hover:shadow-md print:shadow-none print:border-b">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <p className="font-bold text-lg text-gray-800">{prof.name}</p>
                            <p className="text-sm text-gray-500">{prof.specialty}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                             <p className="text-2xl font-bold text-green-700">{formatCurrency(prof.totalRevenue)}</p>
                        </div>
                    </div>
                     <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
                        <span>Atendimentos concluídos: <strong>{prof.completedCount}</strong></span>
                        <span>Ticket médio: <strong>{formatCurrency(prof.averageTicket)}</strong></span>
                    </div>
                </div>
            ))}
        </div>
        {financialData.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nenhum dado financeiro para exibir no período selecionado.</p>
        )}
      </div>
    </div>
  );
}