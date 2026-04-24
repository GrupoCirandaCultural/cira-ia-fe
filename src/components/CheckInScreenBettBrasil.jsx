import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import EventMap from './EventMap';
import { EVENTOS_CONFIG } from '../config/events.config';

export default function CheckInScreenBettBrasil({ onBack, eventoId, idEstande, fromDiscount }) {
  // Formata o ID do estande para exibição
  const estandeNome = idEstande ? idEstande.replace(/_/g, ' ').toUpperCase() : "GERAL";
  
  // Obtém o tema do estande a partir da configuração
  const eventoConfig = EVENTOS_CONFIG[eventoId];
  const tema = eventoConfig?.temaPorEstande?.[idEstande];
  const primaryColor = tema?.primaryColor || '#ea580c';
  const darkColor = tema?.darkColor || '#d94a08';

  return (
    <div 
      className="h-full w-full p-6 flex flex-col text-white animate-in fade-in duration-500"
      style={{
        background: `linear-gradient(180deg, ${primaryColor} 0%, ${darkColor} 100%)`
      }}
    >
      
      {/* HEADER */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold mb-6 hover:opacity-80 transition-opacity">
        <ArrowLeft size={20} /> Voltar {fromDiscount ? 'para o Desconto' : 'para o Início'}
      </button>

      <div className="flex-1 flex flex-col items-center text-center">
        {/* IDENTIFICAÇÃO DO ESTANDE ATUAL */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30 text-[15px] font-black tracking-widest">
          <MapPin size={28} />
          VOCÊ ESTÁ NO:  {estandeNome}
        </div>

        {/* MAPA INTERATIVO */}
        <EventMap 
            visitados={[]} 
            idEstandeAtual={idEstande}
            eventoId={eventoId}
        />

        <h2 className="text-2xl font-black mb-2">Mapa BETT Brasil 🗺️</h2>
        <p className="text-sm opacity-90 mb-8 px-4 leading-tight">
          Conheça a localização dos estandes da BETT Brasil e encontre tudo que você precisa!
        </p>

        <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 w-full">
          <p className="text-sm font-bold text-white/90">
            Explore o mapa para encontrar os estandes que você deseja visitar
          </p>
        </div>
      </div>
    </div>
  );
}
