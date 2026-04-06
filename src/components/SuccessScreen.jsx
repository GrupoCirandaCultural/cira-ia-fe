import React, { useState } from 'react';
import api from '../api';
import { Ticket, MessageCircle, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function SuccessScreen({ userData, cupom, idEstande, onContinue }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSendWhatsApp = async () => {
    setLoading(true);
    try {
      const payload = {
        user_phone: userData.telefone,
        user_name: userData.nome,
        cupom: cupom,
        estande: idEstande,
        message: `🎉 Parabéns ${userData.nome}! Você ganhou ${cupom} de desconto! Apresente este código no caixa. 🎁`
      };
      
      await api.post('/api/send-coupon', payload);
      setFeedback('success');
      
      setTimeout(() => {
        onContinue();
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar cupom:", error);
      setFeedback('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onContinue();
  };

  if (feedback) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${feedback === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
            {feedback === 'success' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
          </div>
          
          <h2 className="text-2xl font-black text-gray-800">
            {feedback === 'success' ? 'Cupom Enviado!' : 'Erro ao Enviar'}
          </h2>
          
          <p className="text-gray-500">
            {feedback === 'success' 
              ? 'Seu cupom foi enviado para o WhatsApp. Aproveite seu desconto! 🎁' 
              : 'Não conseguimos enviar agora. Tente novamente mais tarde.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white p-6 gap-6">
      {/* Ícone de Sucesso */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 shadow-lg">
        <CheckCircle size={48} />
      </div>

      {/* Título e Mensagem */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-gray-800">Parabéns!</h1>
        <p className="text-gray-600 font-medium">Você ganhou um desconto especial!</p>
      </div>

      {/* Cupom Card */}
      <div className="w-full max-w-sm bg-gradient-to-r from-pink-500 to-rose-500 p-1 rounded-2xl shadow-lg">
        <div className="bg-white rounded-xl py-6 border-2 border-dashed border-pink-200 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-pink-600">
            <Ticket size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.1em]">Seu Cupom</span>
          </div>
          <span className="text-4xl font-black text-gray-800 tracking-wider font-mono">{cupom}</span>
          <p className="text-[11px] text-gray-400 font-medium mt-2">Apresente no caixa do {
            idEstande === 'estande_laranja' ? 'Estande Laranja' : 'Estande Azul'
          }</p>
        </div>
      </div>

      {/* Dados do Usuário */}
      <div className="w-full max-w-sm bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Nome</span>
          <span className="text-sm font-bold text-gray-800 text-right">{userData.nome}</span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between items-start">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">WhatsApp</span>
          <span className="text-sm font-bold text-gray-800 text-right">{userData.telefone}</span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between items-start">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Estado</span>
          <span className="text-sm font-bold text-gray-800 text-right">{userData.estado}</span>
        </div>
      </div>

      {/* Botões */}
      <div className="w-full max-w-sm space-y-3 pt-4">
        <button 
          onClick={handleSendWhatsApp}
          disabled={loading}
          className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <MessageCircle size={24} />}
          {loading ? "Enviando..." : "Receber no WhatsApp"}
        </button>

        <button 
          onClick={handleSkip}
          disabled={loading}
          className="w-full py-4 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 text-gray-700 rounded-2xl font-black text-lg shadow-sm active:scale-95 transition-all"
        >
          Continuar sem enviar
        </button>
      </div>

      {/* Info Message */}
      <p className="text-xs text-gray-400 text-center max-w-xs mt-4">
        ✨ Válido apenas para hoje. Um uso por pessoa. Aproveite seu desconto!
      </p>
    </div>
  );
}
