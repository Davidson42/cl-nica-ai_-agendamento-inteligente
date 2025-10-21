import React, { useState } from 'react';
import { showSuccess, showError } from '../utils/toast'; // Importar funções de toast

interface AddProfessionalModalProps {
  onAddProfessional: (name: string, specialty: string, consultationPrice: number) => void;
  onClose: () => void;
}

export default function AddProfessionalModal({ onAddProfessional, onClose }: AddProfessionalModalProps) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultationPrice, setConsultationPrice] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && specialty.trim() && consultationPrice > 0) {
      onAddProfessional(name, specialty, consultationPrice);
      onClose();
    } else {
      showError('Por favor, preencha todos os campos e insira um valor válido para a consulta.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Adicionar Novo Profissional</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="professional-name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                id="professional-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="professional-specialty" className="block text-sm font-medium text-gray-700">Especialidade</label>
              <input
                type="text"
                id="professional-specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="consultation-price" className="block text-sm font-medium text-gray-700">Valor da Consulta (R$)</label>
              <input
                type="number"
                id="consultation-price"
                value={consultationPrice}
                onChange={(e) => setConsultationPrice(parseFloat(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}