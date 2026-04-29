import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const CONFIG_PASSWORD = import.meta.env?.VITE_CONFIG_PASSWORD || '';

export default function ConfigGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!CONFIG_PASSWORD) {
      setError('Senha de configuração não definida (VITE_CONFIG_PASSWORD).');
      return;
    }
    if (password === CONFIG_PASSWORD) {
      setError('');
      onUnlock?.();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-900 to-gray-800 p-6 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-6 p-4 bg-white/10 rounded-full border border-white/20">
          <Lock size={40} className="text-blue-400" />
        </div>

        <h1 className="text-2xl font-black mb-2 text-center">Acesso restrito</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">
          Informe a senha para configurar este terminal.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full p-3 pr-12 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!password}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-black uppercase tracking-widest text-sm transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
