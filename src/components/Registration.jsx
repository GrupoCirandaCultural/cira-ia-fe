// src/components/Registration.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Importe o axios

export default function Registration({ onComplete, idEstande, initialPhone }) {
  const [formData, setFormData] = useState({ nome: '', telefone: initialPhone || '', email: '', aceito: false });
  const [loading, setLoading] = useState(false);

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
      const payload = { ...formData, id_estande: idEstande };
      const res = await axios.post('http://localhost:8008/leads', payload);
      const leadIdGerado = res.data.id; 
      onComplete(formData, leadIdGerado);
    } catch (error) {
      console.error("Erro ao salvar cadastro:", error);
      alert("Houve um erro ao salvar seu cadastro. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-pink-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-pink-500">
        <h2 className="text-3xl font-black text-pink-600 mb-2 text-center">Cira IA</h2>
        <p className="text-gray-500 text-center mb-8 font-medium">Cadastre-se para participar!</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required 
            placeholder="Nome Completo *"
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none transition-all"
            onChange={e => setFormData({...formData, nome: e.target.value})}
          />
          <input 
            required 
            type="tel"
            placeholder="WhatsApp *"
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none transition-all"
            value={formData.telefone}
            onChange={handlePhoneChange}
            maxLength={15}
          />
          <input 
            type="email"
            placeholder="E-mail (opcional)"
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-400 outline-none transition-all"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          
          <label className="flex items-start gap-3 p-2 cursor-pointer">
            <input 
              type="checkbox" 
              required 
              className="mt-1 w-5 h-5 accent-pink-500"
              onChange={e => setFormData({...formData, aceito: e.target.checked})}
            />
            <span className="text-xs text-gray-500 leading-tight">
              Aceito compartilhar meus dados para receber novidades da Ciranda Cultural. *
            </span>
          </label>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest ${
              loading ? 'bg-gray-400' : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            {loading ? 'Salvando...' : 'Ir para a Roleta'}
          </button>
        </form>
      </div>
    </div>
  );
}