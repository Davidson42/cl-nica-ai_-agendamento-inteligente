
import React, { useState } from 'react';
import type { UserRole, Professional } from '../types';
import { AdminIcon, PatientIcon, ProfessionalIcon } from './Icons';

interface LoginProps {
  onLogin: (role: UserRole, professional?: Professional) => void;
  professionals: Professional[];
}

export default function Login({ onLogin, professionals }: LoginProps) {
    const [showProfessionalSelection, setShowProfessionalSelection] = useState(false);

    if (showProfessionalSelection) {
        return (
             <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Selecionar Profissional</h2>
                <div className="space-y-4">
                     {professionals.map(prof => (
                        <button
                            key={prof.id}
                            onClick={() => onLogin('professional', prof)}
                            className="w-full flex items-center gap-4 text-left p-4 bg-gray-50 hover:bg-blue-100 border border-gray-200 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <div className="bg-blue-200 p-3 rounded-full">
                               <ProfessionalIcon className="w-6 h-6 text-blue-700" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg text-gray-700">{prof.name}</p>
                                <p className="text-sm text-gray-500">{prof.specialty}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={() => setShowProfessionalSelection(false)} className="mt-6 w-full text-center text-blue-600 hover:underline">Voltar</button>
            </div>
        )
    }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Bem-vindo à Clínica AI</h2>
      <p className="text-center text-gray-500 mb-8">Selecione seu perfil para continuar.</p>
      <div className="space-y-4">
        <button
          onClick={() => onLogin('admin')}
          className="w-full flex items-center gap-4 text-left p-4 bg-gray-50 hover:bg-indigo-100 border border-gray-200 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="bg-indigo-200 p-3 rounded-full"><AdminIcon className="w-6 h-6 text-indigo-700" /></div>
          <div>
            <p className="font-semibold text-lg text-gray-700">Administrador</p>
            <p className="text-sm text-gray-500">Visão geral da clínica e gerenciamento.</p>
          </div>
        </button>
        <button
          onClick={() => setShowProfessionalSelection(true)}
          className="w-full flex items-center gap-4 text-left p-4 bg-gray-50 hover:bg-blue-100 border border-gray-200 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="bg-blue-200 p-3 rounded-full"><ProfessionalIcon className="w-6 h-6 text-blue-700" /></div>
          <div>
            <p className="font-semibold text-lg text-gray-700">Profissional</p>
            <p className="text-sm text-gray-500">Acesse e gerencie sua agenda pessoal.</p>
          </div>
        </button>
        <button
          onClick={() => onLogin('patient')}
          className="w-full flex items-center gap-4 text-left p-4 bg-gray-50 hover:bg-green-100 border border-gray-200 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <div className="bg-green-200 p-3 rounded-full"><PatientIcon className="w-6 h-6 text-green-700" /></div>
          <div>
            <p className="font-semibold text-lg text-gray-700">Paciente</p>
            <p className="text-sm text-gray-500">Visualize profissionais e agendas.</p>
          </div>
        </button>
      </div>
    </div>
  );
}
