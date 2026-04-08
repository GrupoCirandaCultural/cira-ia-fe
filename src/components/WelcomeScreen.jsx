import React, { useMemo } from 'react';
import QRCode from 'react-qr-code';
import { Sparkles, MessageCircle, Search, MapPin, BookOpen } from 'lucide-react';
import { getEventoConfig, getEstandeConfig, getTemaEstande } from '../config/events.config';
import ciraWelcomeLimpa from '../assets/cira-welcome.png';
import logoFundo from '../assets/logo_fundo.png';

export default function WelcomeScreen({ onStart, idEstande, eventoId = 'bett_educar' }) {
  const eventoConfig = useMemo(() => getEventoConfig(eventoId), [eventoId]);
  const estandeConfig = useMemo(() => getEstandeConfig(eventoId, idEstande), [eventoId, idEstande]);
  const temaEstande = useMemo(() => getTemaEstande(eventoId, idEstande), [eventoId, idEstande]);
  
  // Fallback para dados inválidos
  if (!eventoConfig || !estandeConfig || !temaEstande) {
    return <div className="h-full flex items-center justify-center text-red-500">Configuração não encontrada</div>;
  }

  const primaryColor = temaEstande.primaryColor;
  const secondaryColor = temaEstande.secondaryColor || primaryColor;
  const buttonColor = temaEstande.buttonColor || primaryColor;

  // QR link (apenas para Bienal)
  const qrLink = `https://bienal.example.com?estande=${idEstande}`;

  // LAYOUT PARA BETT EDUCAR (padrão anterior)
  if (eventoId === 'bett_educar') {
    const config = {
      id: estandeConfig.numero,
      nome: estandeConfig.label,
      primaryColor: primaryColor,
      buttonColor: buttonColor,
      cor: estandeConfig.cor,
      footerText: `Vá até o ${estandeConfig.label} para resgatar`
    };

    return (
      <div className="relative h-full w-full flex flex-col items-center justify-between p-6 overflow-hidden" style={{ background: `linear-gradient(to bottom, ${config.primaryColor}, ${config.primaryColor}dd)` }}>
        {/* Header com nome do estande */}
        <div className="pt-4 text-center z-10">
          <p className="text-sm font-medium text-white/70 uppercase tracking-widest mb-2">Estande</p>
          <h1 className="text-4xl font-black text-white/80">{config.id}</h1>
        </div>

        {/* Logo Placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <img src={logoFundo} alt="logo" className="w-32 h-32 object-contain opacity-100" />
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md z-10">
          {/* Texto Principal */}
          <div className="text-center">
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Cadastre-se e libere <br />20% de desconto
            </h2>
          </div>

          {/* Botão Principal - QUERO DESCONTO (apenas se tem roleta) */}
          {eventoConfig.temRoleta && (
            <button
              onClick={() => onStart('wheel')}
              className="w-full py-5 text-white font-black text-xl rounded-3xl shadow-2xl active:scale-95 transition-all border-2 flex items-center justify-center gap-2"
              style={{ backgroundColor: config.primaryColor, borderColor: config.primaryColor }}
            >
              <Sparkles size={24} />
              QUERO DESCONTO
            </button>
          )}

          {/* Se não tem roleta, vai direto para chat */}
          {!eventoConfig.temRoleta && (
            <button
              onClick={() => onStart('chat')}
              className="w-full py-5 text-white font-black text-xl rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white/40 flex items-center justify-center gap-2"
              style={{ backgroundColor: config.buttonColor }}
            >
              <BookOpen size={24} />
              QUERO DESCONTO
            </button>
          )}

          {/* Texto Secundário */}
          <div className="text-center">
            <p className="text-white font-black mb-2 text-lg">Não sabe o que escolher?</p>
            <p className="text-white/80 font-medium">Encontre o seu livro favorito aqui</p>
          </div>

          {/* Botão Secundário - CONSULTE ESTOQUE */}
          <button
            onClick={() => onStart('chat')}
            className="w-full text-white font-black text-md py-3 rounded-2xl border-2 border-white/40 bg-black/20 shadow-lg hover:scale-105 active:scale-95 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <Search size={24} />
            Consulte o nosso estoque
          </button>

          {/* Footer com rota */}
          <div className="text-center pt-6 flex flex-col items-center">
            <p className="text-white/80 font-medium">
              {config.footerText}
            </p>
            <button 
              onClick={() => onStart('checkin')}
              className="text-yellow-300 font-black text-lg mt-2 hover:text-yellow-200 transition-colors underline inline-flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              Veja no mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT PARA BIENAL 2026 (novo com imagem de fundo)
  return (
    <div className="relative h-full w-full flex flex-col items-center overflow-hidden">
      {/* Imagem de Fundo */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat"
        style={{ 
          backgroundImage: `url(${ciraWelcomeLimpa})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      />
      
      {/* Overlay gradiente na base para melhor leitura */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full pb-12 px-8 gap-4">
        
        {/* OPÇÃO 1: Roleta/Desconto */}
        <button
          onClick={() => onStart('wheel')}
          className="w-full py-4 text-white font-black text-xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
        >
          <Sparkles size={24} />
          Ganhar Desconto e Brindes 🎡
        </button>

        {/* OPÇÃO 2: Chat/Curadoria */}
        <button
          onClick={() => onStart('chat')}
          className="w-full py-4 bg-white/90 backdrop-blur-sm border-2 font-black text-xl rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ color: primaryColor, borderColor: primaryColor }}
        >
          <MessageCircle size={24} />
          Qual Livro combina com Você
        </button>

        {/* OPÇÃO 3: Consulta de Estoque */}
        <button
          onClick={() => onStart('chat_stock')}
          className="w-full py-4 bg-white/90 backdrop-blur-sm border-2 font-black text-xl rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          style={{ color: primaryColor, borderColor: primaryColor }}
        >
          <Search size={24} />
          Consulte nosso estoque
        </button>

        {/* BOTÃO CHECK-IN (CENTRALIZADO EM BAIXO) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
          <button 
            onClick={() => onStart('checkin')}
            className="backdrop-blur-md border-2 text-[12px] font-black px-10 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all animate-[bounce_3s_infinite]"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: primaryColor,
              color: primaryColor
            }}
          >
            <MapPin size={24} /> CHECK-IN (ROTA DE BRINDES)
          </button>
        </div>

        {/* QR CODE (FIXO NO CANTO DIREITO) */}
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-xl shadow-xl border flex flex-col items-center z-20" style={{ borderColor: primaryColor }}>
          <span className="text-[8px] font-black mb-1 uppercase tracking-tighter" style={{ color: primaryColor }}>No Celular</span>
          <QRCode size={55} value={qrLink} fgColor={primaryColor} />
        </div>
      </div>
    </div>
  );
}