import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { showSuccess, showError, showLoading, updateToast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';

interface AuthFormProps {
  onAuthSuccess: (userId: string) => void;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthForm({ onAuthSuccess, onClose, initialMode = 'login' }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = showLoading(mode === 'login' ? 'Entrando...' : 'Registrando...');

    try {
      let response;
      if (mode === 'login') {
        response = await supabase.auth.signInWithPassword({ email, password });
      } else {
        response = await supabase.auth.signUp({ email, password });
      }

      if (response.error) {
        throw response.error;
      }

      if (response.data.user) {
        updateToast(toastId, mode === 'login' ? 'Login bem-sucedido!' : 'Registro bem-sucedido! Verifique seu e-mail para confirmar.', 'success');
        onAuthSuccess(response.data.user.id);
      } else {
        // Este caso pode ocorrer para o registro se a verificação de e-mail for necessária e nenhuma sessão for criada imediatamente.
        updateToast(toastId, 'Registro bem-sucedido! Verifique seu e-mail para confirmar.', 'success');
        onClose(); // Fecha o modal, o usuário precisa verificar o e-mail
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      updateToast(toastId, error.message || 'Ocorreu um erro na autenticação.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-center">
          {mode === 'login' ? 'Entrar como Administrador' : 'Registrar Administrador'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : (mode === 'login' ? 'Entrar' : 'Registrar')}
            </button>
          </div>
        </form>
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="mt-4 w-full text-center text-blue-600 hover:underline text-sm"
          disabled={isLoading}
        >
          {mode === 'login' ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
        </button>
      </div>
    </div>
  );
}