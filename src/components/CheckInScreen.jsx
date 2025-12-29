import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react';

export default function CheckInScreen({ onBack, idEstande, onUserNotFound }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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
        id_estande: idEstande // Envia o ID técnico capturado da URL
      });

      if (data.status === 'nao_encontrado') {
        alert("Ops! Não te encontramos. Vamos fazer seu cadastro rapidinho?");
        onUserNotFound(phone); // Redireciona para o cadastro enviando o número
      } else {
        setStatus(data);
      }
    } catch (err) {
      alert("Erro na conexão: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-purple-600 to-pink-500 p-6 flex flex-col text-white animate-in fade-in duration-500">
      
      {/* HEADER */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold mb-6 hover:opacity-80 transition-opacity">
        <ArrowLeft size={20} /> Voltar para o Início
      </button>

      <div className="flex-1 flex flex-col items-center text-center">
        
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