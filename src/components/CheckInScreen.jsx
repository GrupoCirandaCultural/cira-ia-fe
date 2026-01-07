import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { ArrowLeft, MapPin, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function CheckInScreen({ onBack, idEstande, onUserNotFound }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customAlert, setCustomAlert] = useState(null);

  // Formata o ID do estande para exibição (ex: ciranda_bienal -> CIRANDA BIENAL)
  const estandeNome = idEstande ? idEstande.replace(/_/g, ' ').toUpperCase() : "GERAL";

  const formatarTelefone = (valor) => {
    if (!valor) return "";
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleChange = (e) => {
    setPhone(formatarTelefone(e.target.value));
  };

  const isButtonDisabled = loading || phone.length < 14;

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:8008/leads/check-in', {
        telefone: phone,
        id_estande: idEstande 
      });

      if (data.status === 'nao_encontrado') {
        setCustomAlert({
          title: "Visitante não encontrado",
          message: "Ainda não temos seu cadastro. Vamos resolver isso rapidinho?",
          onConfirm: () => onUserNotFound(phone)
        });
      } else {
        setStatus(data);
      }
    } catch (err) {
      setCustomAlert({
        title: "Erro na conexão",
        message: "Não foi possível verificar seu check-in. Tente novamente." + err.message,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    if (customAlert?.onConfirm) {
       customAlert.onConfirm();
    }
    setCustomAlert(null);
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-purple-600 to-pink-500 p-6 flex flex-col text-white animate-in fade-in duration-500">
      
      {/* HEADER */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold mb-6 hover:opacity-80 transition-opacity">
        <ArrowLeft size={20} /> Voltar para o Início
      </button>

      <div className="flex-1 flex flex-col items-center text-center">
        
        {customAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setCustomAlert(null)} 
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-inner ${customAlert.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-pink-100 text-pink-500'}`}>
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-800">{customAlert.title}</h3>
                <p className="text-gray-500 text-sm font-medium px-2">{customAlert.message}</p>
                
                <button 
                  onClick={closeAlert}
                  className={`w-full text-white font-black py-3 rounded-xl shadow-lg mt-4 active:scale-95 transition-all ${customAlert.type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-500 hover:bg-pink-600'}`}
                >
                  {customAlert.type === 'error' ? 'Tentar Novamente' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IDENTIFICAÇÃO DO ESTANDE ATUAL */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30 text-[15px] font-black tracking-widest">
          <MapPin size={28} />
          ESTANDE: {estandeNome}
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-2xl mb-6">
          <QRCode size={120} value={window.location.href} fgColor="#a855f7" />
        </div>

        <h2 className="text-2xl font-black mb-2">Passaporte Ciranda 🎁</h2>
        <p className="text-sm opacity-90 mb-8 px-4 leading-tight">
          Faça check-in em 3 estandes diferentes e ganhe um super brinde exclusivo!
        </p>

        {!status ? (
          <div className="w-full space-y-4">
            <input 
              type="tel"
              placeholder="(00) 00000-0000"
              className="w-full p-4 rounded-2xl bg-white/20 border-2 border-white/30 text-white placeholder:text-white/60 outline-none focus:border-white text-center font-bold text-xl transition-all"
              value={phone}
              onChange={handleChange}
            />
            <button 
              onClick={handleCheckIn}
              disabled={isButtonDisabled}
              className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all text-lg ${
                isButtonDisabled 
                ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                : 'bg-white text-purple-600 active:scale-95'
              }`}
            >
              {loading ? "PROCESSANDO..." : "CONFIRMAR CHECK-IN 📍"}
            </button>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl border-2 border-white/30 w-full animate-bounce-short">
            <CheckCircle2 size={64} className="mx-auto mb-4 text-green-300" />
            <h3 className="text-4xl font-black mb-1">{status.progresso}</h3>
            <p className="font-bold text-sm uppercase tracking-tighter mb-4">Estandes Visitados!</p>
            
            {status.concluido && (
              <div className="mt-2 p-3 bg-green-400 text-green-900 rounded-xl font-black text-[10px] animate-pulse uppercase">
                🎉 ROTA CONCLUÍDA! Retire seu brinde agora!
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}