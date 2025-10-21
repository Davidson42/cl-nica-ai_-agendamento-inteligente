import React, { useState, useEffect } from 'react';
import type { UserRole, Professional, ScheduleData, Appointment, AppointmentStatus, UpdatableProfessional } from './types';
import { initialScheduleData } from './constants';
import Header from './components/Header';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import PatientView from './components/PatientView';
import { showSuccess, showError } from './utils/toast'; // Importar funções de toast

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentProfessional, setCurrentProfessional] = useState<Professional | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>(initialScheduleData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading initial data
    const storedData = localStorage.getItem('scheduleData');
    if (storedData) {
      setScheduleData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // Persist data changes
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
  }, [scheduleData]);

  const handleLogin = (role: UserRole, professional?: Professional) => {
    setUserRole(role);
    if (role === 'professional' && professional) {
      setCurrentProfessional(professional);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentProfessional(null);
  };

  const handleBookAppointment = (professionalId: string, patientName: string, start: Date, end: Date) => {
    setScheduleData(prevData => {
      let patient = prevData.patients.find(p => p.name.toLowerCase() === patientName.toLowerCase().trim());
      
      let newPatientsList = [...prevData.patients];
      if (!patient) {
        const newPatientId = `pat_${prevData.patients.length + 1}_${Date.now()}`;
        patient = { id: newPatientId, name: patientName.trim() };
        newPatientsList.push(patient);
      }

      const professional = prevData.professionals.find(p => p.id === professionalId);
      // Use the professional's consultationPrice if available, otherwise fallback to default logic
      const price = professional?.consultationPrice || 150; 
      
      const newAppointment: Appointment = {
        id: `appt_${prevData.appointments.length + 1}_${Date.now()}`,
        professionalId,
        patientId: patient.id,
        patientName: patient.name,
        start: start.getTime().toString(),
        end: end.getTime().toString(),
        status: 'agendado',
        price: price,
      };

      return {
        ...prevData,
        patients: newPatientsList,
        appointments: [...prevData.appointments, newAppointment],
      };
    });
    showSuccess(`Consulta para ${patientName} agendada com sucesso!`);
  };

  const handleUpdateAppointmentNotes = (appointmentId: string, notes: string) => {
    setScheduleData(prevData => {
        const updatedAppointments = prevData.appointments.map(appt => {
            if (appt.id === appointmentId) {
                return { ...appt, notes };
            }
            return appt;
        });
        return { ...prevData, appointments: updatedAppointments };
    });
    showSuccess('Notas da consulta atualizadas!');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setScheduleData(prevData => {
      const updatedAppointments = prevData.appointments.map(appt => {
        if (appt.id === appointmentId) {
          return { ...appt, status: 'cancelado' as 'cancelado' };
        }
        return appt;
      });
      return { ...prevData, appointments: updatedAppointments };
    });
    showSuccess('Consulta cancelada com sucesso.');
  };

  const handleUpdateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setScheduleData(prevData => {
      const updatedAppointments = prevData.appointments.map(appt => {
        if (appt.id === appointmentId) {
          return { ...appt, status };
        }
        return appt;
      });
      return { ...prevData, appointments: updatedAppointments };
    });
    showSuccess('Status da consulta atualizado!');
  };

  const handleUpdateProfessionalProfile = (professionalId: string, data: UpdatableProfessional) => {
    setScheduleData(prevData => {
      const updatedProfessionals = prevData.professionals.map(prof => {
        if (prof.id === professionalId) {
          return { ...prof, ...data };
        }
        return prof;
      });
      return { ...prevData, professionals: updatedProfessionals };
    });
    showSuccess('Perfil atualizado com sucesso!');
  };

  const handleAddProfessional = (name: string, specialty: string, consultationPrice: number) => {
    setScheduleData(prevData => {
      const newProfessional: Professional = {
        id: `prof_${prevData.professionals.length + 1}_${Date.now()}`,
        name,
        specialty,
        consultationPrice,
      };
      return {
        ...prevData,
        professionals: [...prevData.professionals, newProfessional],
      };
    });
    showSuccess(`Profissional ${name} adicionado com sucesso!`);
  };

  const handleDeleteProfessional = (professionalId: string) => {
    setScheduleData(prevData => {
      const updatedProfessionals = prevData.professionals.filter(
        prof => prof.id !== professionalId
      );
      const updatedAppointments = prevData.appointments.filter(
        appt => appt.professionalId !== professionalId
      );
      return {
        ...prevData,
        professionals: updatedProfessionals,
        appointments: updatedAppointments,
      };
    });
    showSuccess('Profissional e suas consultas foram excluídos com sucesso.');
  };


  const renderContent = () => {
    if (!userRole) {
      return <Login onLogin={handleLogin} professionals={scheduleData.professionals} />;
    }

    switch (userRole) {
      case 'admin':
        return (
          <AdminDashboard 
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onUpdateNotes={handleUpdateAppointmentNotes}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onAddProfessional={handleAddProfessional}
            onDeleteProfessional={handleDeleteProfessional}
          />
        );
      case 'professional':
        if (currentProfessional) {
          return (
            <ProfessionalDashboard
              professional={currentProfessional}
              scheduleData={scheduleData}
              setScheduleData={setScheduleData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onUpdateNotes={handleUpdateAppointmentNotes}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onUpdateProfile={handleUpdateProfessionalProfile}
            />
          );
        }
        return <p>Erro: Profissional não encontrado.</p>;
      case 'patient':
        return <PatientView scheduleData={scheduleData} onBookAppointment={handleBookAppointment} onCancelAppointment={handleCancelAppointment} />;
      default:
        return <Login onLogin={handleLogin} professionals={scheduleData.professionals} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Header userRole={userRole!} onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
}