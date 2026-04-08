import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { getEventoConfig, getEstandeConfig, getTemaEstande } from '../config/events.config';
import logoFundo from '../assets/logo_fundo.png';

export default function DiscountSuccess({ idEstande, eventoId, onExplore }) {
  const eventoConfig = useMemo(() => getEventoConfig(eventoId), [eventoId]);
  const estandeConfig = useMemo(() => getEstandeConfig(eventoId, idEstande), [eventoId, idEstande]);
  const temaEstande = useMemo(() => getTemaEstande(eventoId, idEstande), [eventoId, idEstande]);

  if (!eventoConfig || !estandeConfig || !temaEstande) {
    return <div className="h-full flex items-center justify-center text-red-500">Configuração não encontrada</div>;
  }

  return (
    <div className="relative h-full w-full flex flex-col overflow-y-auto" style={{ background: `linear-gradient(to bottom, #003D82, #003D82dd)` }}>
      {/* Header com logos */}
      <div className="pt-2 pb-3 flex items-center justify-center gap-4 z-10">
        <img src={logoFundo} alt="logo" className="h-18 object-contain opacity-100" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-2 z-10">
        {/* Título */}
        <h1 className="text-5xl font-black text-white text-center leading-tight mb-1">
          Parabéns!
        </h1>

        {/* Subtítulo */}
        <div className="text-center mb-4">
          <p className="text-4xl text-white font-bold mb">Você ganhou</p>
          <p className="text-4xl font-black text-yellow-300">20% de desconto</p>
        </div>

        {/* Instruções */}
        <div className="w-full max-w-sm mb-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
          <p className="text-white font-black text-lg mb-3">Como resgatar?</p>
          
          <div className="space-y-2 text-white/90 text-md font-medium">
            <div>
              <p className="font-black text-white mb-0.5">1. Vá até o próximo estande</p>
              <p>Ciranda Cultural</p>
            </div>
            
            <div>
              <p className="font-black text-white mb-0.5">2. Escolha os seus produtos</p>
              <p>no estande Ciranda Cultural</p>
            </div>
            
            <div>
              <p className="font-black text-white mb-0.5">3. Printe esta tela e apresente</p>
              <p>no caixa</p>
            </div>
          </div>
        </div>

        {/* Pesquisa */}
        <p className="text-center text-white/70 text-sm font-medium px-2 mb-3">
          Preencha a nossa pesquisa e ganhe o dobro de desconto em nosso site! <span className="text-yellow-300 font-black">40% off</span>
        </p>

        {/* Botão Quero Participar */}
        <button
          onClick={() => window.open('https://wa.me/11978802196?text=Já garanti meus 20% e vim responder a pesquisa para garantir 40%!', '_blank')}
          className="w-full max-w-sm py-3 text-white font-black text-lg rounded-3xl border-2 border-blue-400 bg-transparent shadow-lg hover:scale-105 active:scale-95 transition-all mb-3"
        >
          Quero participar
        </button>
      </div>

      {/* Seção Orange */}
      <div 
        className="px-4 py-10 z-10"
        style={{ backgroundColor: '#FF8C42' }}
      >
        <div className="text-center mb-2">
          <p className="text-white font-black text-2xl mb-1">Não sabe o que escolher?</p>
          <p className="text-white/90 font-medium text-md">Encontre o seu livro favorito aqui</p>
        </div>
        
        <button
          onClick={onExplore}
          className="w-full text-white font-black text-md py-3 rounded-2xl border-2 border-white/40 bg-black/20 shadow-lg hover:scale-105 active:scale-95 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <Search size={24} />
            Consulte o nosso estoque
        </button>
      </div>
    </div>
  );
}