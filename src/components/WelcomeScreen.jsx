import React from 'react';
import QRCode from 'react-qr-code';
import { Sparkles, MessageCircle, Search, MapPin } from 'lucide-react';
import ciraWelcomeLimpa from '../assets/cira-welcome.png';

export default function WelcomeScreen({ onStart, qrLink }) {
  return (
    <div className="relative h-full w-full flex flex-col items-center overflow-hidden">
      {/* Imagem de Fundo Limpa */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-center"
        style={{ 
          backgroundImage: `url(${ciraWelcomeLimpa})`,
          backgroundSize: 'cover'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full pb-12 px-8 gap-4">
        
        {/* OPÇÃO 1: Roleta */}
        <button
          onClick={() => onStart('wheel')}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Sparkles size={24} />
          Ganhar Desconto e Brindes 🎡
        </button>

        {/* OPÇÃO 2: Chat Direto (Curadoria) */}
        <button
          onClick={() => onStart('chat')}
          className="w-full py-4 bg-white/90 backdrop-blur-sm text-pink-600 border-2 border-pink-500 font-black text-xl rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <MessageCircle size={24} />
          Qual Livro combina com Você
        </button>

        {/* NOVO - OPÇÃO 3: Consulta de Estoque */}
        <button
          onClick={() => onStart('chat')}
          className="w-full py-4 bg-white/90 backdrop-blur-sm text-pink-600 border-2 border-pink-500 font-black text-xl rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Search size={24} />
          Consulte nosso estoque
        </button>

      {/* BOTÃO CHECK-IN (CENTRALIZADO EM BAIXO) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
        <button 
          onClick={() => onStart('checkin')}
          className="bg-white/20 backdrop-blur-md border border-white/40 text-white text-[12px] font-black px-10 py-2 rounded-full flex items-center gap-2 hover:bg-white/40 transition-all animate-[bounce_3s_infinite]"
        >
          <MapPin size={40} /> CHECK-IN (ROTA DE BRINDES)
        </button>
      </div>

      {/* QR CODE (FIXO NO CANTO DIREITO) */}
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded-xl shadow-xl border border-pink-100 flex flex-col items-center z-20">
        <span className="text-[8px] font-black text-pink-500 mb-1 uppercase tracking-tighter">No Celular</span>
        <QRCode size={55} value={qrLink} fgColor="#db2777" />
      </div>
      </div>
    </div>
  );
}