import React, { useState } from 'react';
import type { Professional } from '../types';
import { showSuccess, showError } from '../utils/toast'; // Importar funções de toast

interface DeleteProfessionalModalProps {
  professionals: Professional[];
  onDeleteProfessional: (professionalId: string) => void;
  onClose: () => void;
}

export default function DeleteProfessionalModal({ professionals, onDeleteProfessional, onClose }: DeleteProfessionalModalProps) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProfessionalId) {
      if (window.confirm('Tem certeza que deseja excluir este profissional e todas as suas consultas? Esta ação é irreversível.')) {
        onDeleteProfessional(selectedProfessionalId);
        onClose();
      }
    } else {
      showError('Por favor, selecione um profissional para excluir.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Excluir Profissional</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="select-professional" className="block text-sm font-medium text-gray-700">Selecionar Profissional</label>
              <select
                id="select-professional"
                value={selectedProfessionalId}
                onChange={(e) => setSelectedProfessionalId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">-- Selecione um profissional --</option>
                {professionals.map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name} ({prof.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" disabled={!selectedProfessionalId}>
              Excluir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}