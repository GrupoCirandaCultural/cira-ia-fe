import React, { useMemo } from 'react';
import { Search, MapPin, ShoppingCart } from 'lucide-react';
import { getEventoConfig, getEstandeConfig, getTemaEstande } from '../config/events.config';
import logoFundo from '../assets/logo_fundo.png';

export default function DiscountSuccess({ idEstande, eventoId, onExplore, userName = 'Visitante' }) {
  const eventoConfig = useMemo(() => getEventoConfig(eventoId), [eventoId]);
  const estandeConfig = useMemo(() => getEstandeConfig(eventoId, idEstande), [eventoId, idEstande]);
  const temaEstande = useMemo(() => getTemaEstande(eventoId, idEstande), [eventoId, idEstande]);

  if (!eventoConfig || !estandeConfig || !temaEstande) {
    return <div className="h-full flex items-center justify-center text-red-500">Configuração não encontrada</div>;
  }

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden" style={{ background: `linear-gradient(to bottom, #003D82, #003D82dd)` }}>
      {/* Header */}
      <div className="pt-3 flex items-center justify-center z-10">
        <img src={logoFundo} alt="logo" className="h-28 object-contain opacity-100" />
      </div>

      {/* Content - Centro */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 z-10 overflow-y-auto">
        {/* Parabéns */}
        <h1 className="text-5xl font-black text-white text-center leading-tight">
          Parabéns
        </h1>
        
        {/* Nome em cinza menor */}
        <p className="text-2xl font-black text-gray-300 text-center mb-6">
          {userName}
        </p>

        {/* Desconto */}
        <div className="text-center mb-8">
          <p className="text-3xl text-yellow-300 font-black leading-tight">
            Você ganhou<br />20% de desconto
          </p>
        </div>

        {/* Tutorial Centralizado */}
        <div className="w-full max-w-sm space-y-3 text-white">
          {/* Passo 1 */}
          <div className="text-center">
            <p className="text-sm font-black mb-1">1. Printe esta tela</p>
          </div>

          {/* Passo 2 */}
          <div className="text-center">
            <p className="text-sm font-black mb-1">1. Vá até o próximo estande</p>
            <p className="text-xs font-medium">Ciranda na Escola</p>
            <p className="text-xs text-yellow-300 font-medium underline flex items-center justify-center gap-1">
              <MapPin size={14} />
              Veja no mapa como chegar
            </p>
          </div>

          {/* Passo 3 */}
          <div className="text-center">
            <p className="text-sm font-black mb-1">1. Escolha os seus produtos e</p>
            <p className="text-xs font-medium">aplique o seu desconto no caixa</p>
          </div>
        </div>

        {/* Pesquisa */}
        <p className="text-center text-white/70 text-xs font-medium px-2 mt-8">
          Preencha a nossa pesquisa e ganhe o dobro de desconto em nosso site! <span className="text-yellow-300 font-black">40% off</span>
        </p>
      </div>

      {/* Footer com dois botões */}
      <div 
        className="grid grid-cols-2 gap-0 z-10"
        style={{ backgroundColor: '#FF8C42' }}
      >
        {/* Botão Esquerdo - Estoque */}
        <button
          onClick={onExplore}
          className="py-6 px-4 text-white font-black text-center border-r border-white/20 hover:bg-black/10 active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
        >
          <ShoppingCart size={28} />
          <span className="text-xs leading-tight">Consulte o<br />nosso estoque</span>
        </button>

        {/* Botão Direito - Pesquisa */}
        <button
          onClick={() => window.open('https://wa.me/11978802196?text=Já garanti meus 20% e vim responder a pesquisa para garantir 40%!', '_blank')}
          className="py-6 px-4 text-white font-black text-center hover:bg-black/10 active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
        >
          <span className="text-2xl">📋</span>
          <span className="text-xs leading-tight">Quero<br />participar</span>
        </button>
      </div>
    </div>
  );
}