export type UserRole = 'admin' | 'professional' | 'patient';

export type AppointmentStatus = 'agendado' | 'confirmado' | 'concluido' | 'cancelado';

export interface Professional {
  id: string;
  name: string;
  specialty: string;
}

export interface UpdatableProfessional {
  name: string;
  specialty: string;
}

export interface Patient {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  professionalId: string;
  patientId: string;
  patientName: string;
  start: string;
  end: string;
  status: AppointmentStatus;
  price: number;
  notes?: string;
}

export interface ScheduleData {
  professionals: Professional[];
  patients: Patient[];
  appointments: Appointment[];
}
