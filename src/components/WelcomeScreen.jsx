import React, { useMemo } from 'react';
import QRCode from 'react-qr-code';
import { Sparkles, MessageCircle, Search, MapPin, BookOpen } from 'lucide-react';
import { getEventoConfig, getEstandeConfig, getTemaEstande } from '../config/events.config';
import ciraWelcomeLimpa from '../assets/cira-welcome.png';
import logoFundo from '../assets/logo_fundo.png';
import '../styles/WelcomeScreen.css';

export default function WelcomeScreen({ onStart, idEstande, eventoId = 'bett_brasil' }) {
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

  // Botões amarelos para estande azul
  const effectiveButtonColor = idEstande === 'estande_azul' ? '#FCD34D' : buttonColor;

  // QR link (apenas para Bienal)
  const qrLink = `https://bienal.example.com?estande=${idEstande}`;

  // LAYOUT PARA BETT EDUCAR COM GLASSMORPHISM
  if (eventoId === 'bett_brasil') {
    const config = {
      id: estandeConfig.numero,
      nome: estandeConfig.label,
      primaryColor: primaryColor,
      buttonColor: buttonColor,
      cor: estandeConfig.cor,
      footerText: `Vá até o ${estandeConfig.label} para resgatar`
    };

    return (
      <div
        className="relative h-full w-full overflow-y-auto overflow-x-hidden backdrop-blur-md"
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor}, ${config.primaryColor}cc)`,
        }}
      >
        <div className="absolute inset-0 shimmer pointer-events-none" />
        {/* Wrapper full-height: header em cima, conteúdo no meio, footer embaixo */}
        <div className="relative z-10 min-h-full w-full flex justify-center px-3 py-4 sm:px-6 sm:py-8">
        {/* Main card */}
        <div className="w-full max-w-md flex flex-col min-h-full">

          {/* HEADER (topo) */}
          <header className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-600">
            <p className="text-[10px] sm:text-xs font-medium text-white/60 uppercase tracking-widest">
              Estande
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white/90 tracking-tight leading-none">
              {config.id}
            </h1>
          </header>

          {/* MAIN (centro - cresce e centraliza verticalmente) */}
          <main className="flex-1 flex flex-col items-center justify-center text-center gap-4 sm:gap-8 py-6 sm:py-10">

            {/* Logo com animação float */}
            <div
              className="w-36 h-20 sm:w-60 sm:h-36 rounded-2xl animate-float flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${config.primaryColor}40`,
                backdropFilter: "blur(10px)",
              }}
            >
              <img
                src={logoFundo}
                alt="logo"
                className="w-full h-full object-contain opacity-100"
              />
            </div>

            {/* Texto Principal */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-3 duration-700 delay-150">
              <h2 className="font-display text-xl sm:text-4xl font-black text-white leading-tight">
                Cadastre-se e libere <br />
                <span style={{ color: effectiveButtonColor }}>20% de desconto</span>
              </h2>
            </div>

            {/* Botão Principal - QUERO DESCONTO */}
            {eventoConfig.temRoleta && (
              <button
                onClick={() => onStart("wheel")}
                className="w-full py-3.5 sm:py-5 font-display font-black text-base sm:text-xl rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 animate-in fade-in zoom-in-75 duration-700 delay-300"
                style={{ backgroundColor: config.buttonColor, color: "white" }}
              >
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                QUERO DESCONTO
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
              </button>
            )}

            {/* Se não tem roleta, vai direto para chat */}
            {!eventoConfig.temRoleta && (
              <button
                onClick={() => onStart("wheel")}
                className="w-full py-3.5 sm:py-5 font-display font-black text-base sm:text-xl rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 animate-in fade-in zoom-in-75 duration-700 delay-300"
                style={{ backgroundColor: config.buttonColor, color: "white" }}
              >
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                QUERO DESCONTO
              </button>
            )}

            {/* Divider */}
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <Search className="w-4 h-4 text-white/30" />
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Texto Secundário */}
            <div className="text-center space-y-1 sm:space-y-2">
              <p className="font-display font-black text-base sm:text-xl text-white">
                Não sabe o que escolher?
              </p>
              <p className="text-xs sm:text-base text-white/70">
                Encontre o seu livro favorito aqui
              </p>
            </div>

            {/* Botão Secundário - CONSULTE ESTOQUE */}
            <button
              onClick={() => onStart("chat_stock")}
              className="w-full py-3 sm:py-4 font-display font-black text-sm sm:text-base rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-in fade-in duration-700 delay-500"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(20px)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              Consulte o nosso estoque
            </button>
          </main>

          {/* FOOTER (rodapé) */}
          <footer className="text-center flex flex-col items-center gap-1.5 sm:gap-2 animate-in fade-in duration-700 delay-700 pt-2">
            <p className="text-xs sm:text-sm text-white/70">{config.footerText}</p>
            <button
              onClick={() => onStart("checkin")}
              className="flex items-center gap-1.5 font-display font-black text-sm sm:text-base hover:scale-110 transition-transform duration-200"
              style={{ color: effectiveButtonColor}}
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Veja no mapa
            </button>
          </footer>
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