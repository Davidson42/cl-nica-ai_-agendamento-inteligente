import type { ScheduleData } from './types';

export const initialScheduleData: ScheduleData = {
  professionals: [
    { id: 'prof_1', name: 'Dra. Ana Silva', specialty: 'Cardiologia', consultationPrice: 250 },
    { id: 'prof_2', name: 'Dr. João Souza', specialty: 'Fisioterapia', consultationPrice: 150 },
    { id: 'prof_3', name: 'Dr. Carlos Lima', specialty: 'Odontologia', consultationPrice: 300 },
  ],
  patients: [
    { id: 'pat_1', name: 'Fernanda Lima' },
    { id: 'pat_2', name: 'Lucas Pereira' },
    { id: 'pat_3', name: 'Mariana Costa' },
    { id: 'pat_4', name: 'Roberto Almeida' },
  ],
  appointments: [
    { 
      id: 'appt_1', 
      professionalId: 'prof_1', 
      patientId: 'pat_3',
      patientName: 'Mariana Costa', 
      start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9,0,0,0).toString(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9,45,0,0).toString(),
      status: 'confirmado',
      price: 250,
      notes: 'Paciente apresenta quadro estável. Retorno para avaliação de exames.'
    },
    { 
      id: 'appt_2', 
      professionalId: 'prof_2', 
      patientId: 'pat_4',
      patientName: 'Roberto Almeida', 
      start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11,0,0,0).toString(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11,45,0,0).toString(),
      status: 'agendado',
      price: 150
    },
    { 
      id: 'appt_3', 
      professionalId: 'prof_1', 
      patientId: 'pat_1',
      patientName: 'Fernanda Lima', 
      start: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(14,0,0,0).toString(),
      end: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(14,45,0,0).toString(),
      status: 'agendado',
      price: 250
    },
     { 
      id: 'appt_4', 
      professionalId: 'prof_3', 
      patientId: 'pat_2',
      patientName: 'Lucas Pereira', 
      start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15,0,0,0).toString(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16,0,0,0).toString(),
      status: 'confirmado',
      price: 300
    },
    { 
      id: 'appt_5', 
      professionalId: 'prof_1', 
      patientId: 'pat_2',
      patientName: 'Lucas Pereira', 
      start: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(10,0,0,0).toString(),
      end: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(10,45,0,0).toString(),
      status: 'concluido',
      price: 250,
      notes: 'Sessão de acompanhamento. Paciente relatou melhora significativa na mobilidade.'
    },
  ],
};