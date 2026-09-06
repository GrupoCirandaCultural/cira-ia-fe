import React from 'react';
import QRCode from 'react-qr-code';
import { ArrowLeft, MapPin } from 'lucide-react';
import EventMap from './EventMap';
import CheckInScreenBettBrasil from './CheckInScreenBettBrasil';
import BienalMapModal from './BienalMapModal';
import { getEstandeConfig, getEventoConfig } from '../config/events.config';

export default function CheckInScreen({ onBack, eventoId, idEstande, fromDiscount, isKiosk = false, userName = '', userPhone = '', userState = '', userActivity = '' }) {
  const estandeConfig = getEstandeConfig(eventoId, idEstande);
  const estandeNome = estandeConfig?.label || (idEstande ? idEstande.replace(/_/g, ' ').toUpperCase() : "GERAL");

  // Layout especial para BETT Brasil (sem check-in)
  if (eventoId === 'bett_brasil') {
    return <CheckInScreenBettBrasil onBack={onBack} eventoId={eventoId} idEstande={idEstande} fromDiscount={fromDiscount} isKiosk={isKiosk} userName={userName} userPhone={userPhone} userState={userState} userActivity={userActivity} />;
  }

  if (eventoId === 'bienal_2026') {
    const mapaPorCodigoEvento = getEventoConfig(eventoId)?.mapaPorCodigoEvento || {};

    return (
      <BienalMapModal
        isOpen
        onClose={onBack}
        targets={[]}
        locations={Object.entries(mapaPorCodigoEvento).map(([codigo, info]) => ({ codigo, ...info }))}
      />
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-purple-600 to-pink-500 p-6 flex flex-col text-white animate-in fade-in duration-500">
      
      {/* HEADER */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold mb-6 hover:opacity-80 transition-opacity">
        <ArrowLeft size={20} /> Voltar {fromDiscount ? 'para o Desconto' : 'para o Início'}
      </button>

      <div className="flex-1 flex flex-col items-center text-center">
        
        {/* IDENTIFICAÇÃO DO ESTANDE ATUAL */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30 text-[15px] font-black tracking-widest">
          <MapPin size={28} />
          ESTANDE: {estandeNome.toUpperCase()}
        </div>

        {/* MAPA INTERATIVO */}
        <EventMap 
            visitados={[]} 
            idEstandeAtual={idEstande}
            eventoId={eventoId}
        />

        <h2 className="text-2xl font-black mb-2">Passaporte Ciranda 🎁</h2>
        <p className="text-sm opacity-90 mb-8 px-4 leading-tight">
          Faça check-in em 3 estandes diferentes e ganhe um super brinde exclusivo!
        </p>

        <div className="w-full space-y-4">
          <p className="text-sm opacity-90 px-4 leading-tight">
            Check-in indisponível no momento.
          </p>
          <button 
            onClick={onBack}
            className="w-full font-black py-4 rounded-2xl shadow-xl transition-all text-lg bg-white text-purple-600 active:scale-95"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}