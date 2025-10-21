import React, { useState, useEffect } from 'react';
import type { UserRole, Professional, ScheduleData, Appointment, AppointmentStatus, UpdatableProfessional } from './types';
import { initialScheduleData } from './constants';
import Header from './components/Header';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ProfessionalDashboard from './components/ProfessionalDashboard';
import PatientView from './components/PatientView';
import { showSuccess, showError } from './utils/toast';
import { supabase } from './services/supabaseService'; // Import supabase
import AuthForm from './components/AuthForm'; // Import AuthForm

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentProfessional, setCurrentProfessional] = useState<Professional | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>(initialScheduleData);
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseSession, setSupabaseSession] = useState<any>(null); // Para armazenar a sessão do Supabase
  const [showAdminAuth, setShowAdminAuth] = useState(false); // Para controlar a visibilidade do AuthForm para admin

  useEffect(() => {
    // Simula o carregamento dos dados iniciais
    const storedData = localStorage.getItem('scheduleData');
    if (storedData) {
      setScheduleData(JSON.parse(storedData));
    }

    // Listener de estado de autenticação do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session);
      if (session) {
        // Se uma sessão existe, e é uma sessão de administrador (assumimos que qualquer usuário logado via AuthForm é admin por enquanto)
        // Para uma solução mais robusta, você verificaria metadados do usuário ou uma tabela de perfis.
        setUserRole('admin');
        setShowAdminAuth(false); // Oculta o formulário de autenticação se o login for bem-sucedido
      } else {
        // Se não houver sessão, garante que a função de administrador seja limpa se foi definida pela autenticação do Supabase
        if (userRole === 'admin' && !showAdminAuth) { // Apenas limpa se não estiver tentando ativamente fazer login como admin
            setUserRole(null);
        }
      }
    });

    // Obtém a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
      if (session) {
        setUserRole('admin'); // Assume que o usuário Supabase logado é admin
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Array de dependência vazio para executar uma vez na montagem

  useEffect(() => {
    // Persiste as alterações de dados
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
  }, [scheduleData]);

  const handleLogin = (role: UserRole, professional?: Professional) => {
    if (role === 'admin') {
      setShowAdminAuth(true); // Exibe o AuthForm para login de administrador
      return;
    }
    setUserRole(role);
    if (role === 'professional' && professional) {
      setCurrentProfessional(professional);
    }
  };

  const handleAdminAuthSuccess = (userId: string) => {
    // O listener de estado de autenticação do Supabase cuidará de definir userRole como 'admin'
    // Precisamos apenas fechar o modal aqui.
    setShowAdminAuth(false);
    showSuccess('Login de administrador bem-sucedido!');
  };

  const handleAdminAuthClose = () => {
    setShowAdminAuth(false);
    // Se o usuário cancelar o login de administrador, garante que a função seja nula
    if (!supabaseSession) {
        setUserRole(null);
    }
  };

  const handleLogout = async () => {
    if (userRole === 'admin' && supabaseSession) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        showError('Erro ao sair: ' + error.message);
      } else {
        showSuccess('Sessão encerrada com sucesso.');
      }
    }
    setUserRole(null);
    setCurrentProfessional(null);
    setSupabaseSession(null); // Limpa o estado da sessão do Supabase
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
      // Usa o consultationPrice do profissional se disponível, caso contrário, usa a lógica padrão
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
    if (showAdminAuth) {
        return <AuthForm onAuthSuccess={handleAdminAuthSuccess} onClose={handleAdminAuthClose} />;
    }

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