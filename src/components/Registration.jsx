// src/components/Registration.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Importe o axios
import { ArrowLeft } from 'lucide-react';

export default function Registration({ onComplete, idEstande, initialPhone, onBack }) {
  const [formData, setFormData] = useState({ nome: '', telefone: initialPhone || '', email: '', aceito: false });
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    setFormData({...formData, telefone: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginMode) {
        const { data } = await axios.post('http://localhost:8008/leads/check-in', {
          telefone: formData.telefone,
          id_estande: idEstande
        });

        if (data.status === 'nao_encontrado') {
          alert("Cadastro não encontrado. Por favor, preencha seus dados para continuar.");
          setIsLoginMode(false);
        } else {
          let nomeUsuario = data.nome;
          
          // Se não veio o nome, tenta buscar pelo telefone
          if (!nomeUsuario) {
            try {
              const resBusca = await axios.get(`http://localhost:8008/leads?telefone=${formData.telefone}`);
              // Assume que retorna um array ou o objeto direto
              const leadEncontrado = Array.isArray(resBusca.data) ? resBusca.data[0] : resBusca.data;
              if (leadEncontrado && leadEncontrado.nome) {
                nomeUsuario = leadEncontrado.nome;
              }
            } catch (err) {
              console.error("Erro ao buscar nome:", err);
            }
          }

          onComplete({ nome: nomeUsuario, telefone: formData.telefone, cupom: data.cupom }, data);
        }
      } else {
        const payload = { ...formData, id_estande: idEstande };
        const res = await axios.post('http://localhost:8008/leads', payload);
        onComplete(formData, res.data);
      }
    } catch (error) {
      console.error("Erro ao processar:", error);
      alert("Houve um erro. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-pink-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-pink-500 relative">
        {onBack && (
          <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-pink-500 transition-colors" title="Voltar">
            <ArrowLeft size={24} />
          </button>
        )}
        <h2 className="text-3xl font-black text-pink-600 mb-2 text-center">Cira IA</h2>
        <p className="text-gray-500 text-center mb-6 font-medium">
          {isLoginMode ? 'Informe seu WhatsApp para entrar' : 'Cadastre-se para participar!'}
        </p>
        
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLoginMode ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Novo Cadastro
          </button>
          <button 
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLoginMode ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Já tenho cadastro
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <input 
              required 
              placeholder="Nome Completo *"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none transition-all"
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
            />
          )}
          
          <input 
            required 
            type="tel"
            placeholder="WhatsApp *"
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none transition-all"
            value={formData.telefone}
            onChange={handlePhoneChange}
            maxLength={15}
          />

          {!isLoginMode && (
            <>
              <input 
                type="email"
                placeholder="E-mail (opcional)"
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              
              <label className="flex items-start gap-3 p-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  required 
                  className="mt-1 w-5 h-5 accent-pink-500"
                  checked={formData.aceito}
                  onChange={e => setFormData({...formData, aceito: e.target.checked})}
                />
                <span className="text-xs text-gray-500 leading-tight">
                  Aceito compartilhar meus dados para receber novidades da Ciranda Cultural. *
                </span>
              </label>
            </>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest ${
              loading ? 'bg-gray-400' : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            {loading ? 'Processando...' : (isLoginMode ? 'Entrar' : 'Ir para a Roleta')}
          </button>
        </form>
      </div>
    </div>
  );
}