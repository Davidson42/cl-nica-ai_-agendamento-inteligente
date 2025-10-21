import React from 'react';
import type { UserRole } from '../types';
import { LogoIcon, LogoutIcon } from './Icons';

interface HeaderProps {
  userRole: UserRole;
  onLogout: () => void;
}

export default function Header({ userRole, onLogout }: HeaderProps) {
  const roleText = {
    admin: 'Painel do Administrador',
    professional: 'Painel do Profissional',
    patient: 'Área do Paciente',
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 print:hidden">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Clínica AI
            {userRole && <span className="text-base font-normal text-gray-500 hidden sm:inline"> | {roleText[userRole]}</span>}
          </h1>
        </div>
        {userRole && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="hidden md:inline">Sair</span>
          </button>
        )}
      </div>
    </header>
  );
}