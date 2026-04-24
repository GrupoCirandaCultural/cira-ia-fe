import React, { useRef, useState } from 'react';
import { ArrowLeft, MapPin, Download, Check } from 'lucide-react';
import EventMap from './EventMap';
import { EVENTOS_CONFIG } from '../config/events.config';
import mapaBettBrasil from '../assets/mapa_bett_brasil.jpeg';

const viewportStyle = `
  .checkin-container {
    height: 100vh;
    height: 100dvh;
    min-height: -webkit-fill-available;
    overflow: hidden;
  }
`;

export default function CheckInScreenBettBrasil({ onBack, eventoId, idEstande, fromDiscount }) {
  const [downloaded, setDownloaded] = useState(false);
  // Formata o ID do estande para exibição
  const estandeNome = idEstande ? idEstande.replace(/_/g, ' ').toUpperCase() : "GERAL";
  
  // Obtém o tema do estande a partir da configuração
  const eventoConfig = EVENTOS_CONFIG[eventoId];
  const tema = eventoConfig?.temaPorEstande?.[idEstande];
  const primaryColor = tema?.primaryColor || '#ea580c';
  const darkColor = tema?.darkColor || '#d94a08';

  const handleDownloadMap = async () => {
    try {
      // Safari mobile: usa Web Share API
      if (navigator.share && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const blob = await fetch(mapaBettBrasil).then(r => r.blob());
        const file = new File([blob], 'mapa-bett-brasil.jpeg', { type: 'image/jpeg' });
        await navigator.share({ files: [file], title: 'Mapa BETT Brasil' });
      } else {
        const link = document.createElement('a');
        link.download = 'mapa-bett-brasil.jpeg';
        link.href = mapaBettBrasil;
        link.click();
      }

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error('Erro ao baixar mapa', e);
    }
  };

  return (
    <>
      <style>{viewportStyle}</style>
      <div 
        className="checkin-container w-full flex flex-col text-white animate-in fade-in duration-500"
        style={{
          background: `linear-gradient(180deg, ${primaryColor} 0%, ${darkColor} 100%)`
        }}
      >
      
      {/* HEADER */}
      <button onClick={onBack} className="flex-shrink-0 flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity px-6 pt-6 pb-4">
        <ArrowLeft size={20} /> Voltar {fromDiscount ? 'para o Desconto' : 'para o Início'}
      </button>

      <div className="flex-1 flex flex-col items-center text-center px-6 overflow-y-auto">
        {/* IDENTIFICAÇÃO DO ESTANDE ATUAL */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30 text-[15px] font-black tracking-widest">
          <MapPin size={28} />
          VOCÊ ESTÁ NO:  {estandeNome}
        </div>

        {/* MAPA INTERATIVO COM BOTÃO SOBREPOSTO */}
        <div className="relative w-full flex-1 mb-6">
          <div className="w-full h-full">
            <EventMap 
                visitados={[]} 
                idEstandeAtual={idEstande}
                eventoId={eventoId}
            />
          </div>
          
          {/* BOTÃO SOBREPOSTO NA PARTE INFERIOR */}
          <div className="absolute bottom-12 left-6 ">
            <button
              onClick={handleDownloadMap}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black/30 hover:bg-black/40 px-4 py-3 text-sm font-semibold text-black transition active:scale-[0.98] backdrop-blur-md border border-white/40"
            >
              {downloaded ? (
                <>
                  <Check className="h-4 w-4" /> Mapa baixado
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Baixar mapa
                </>
              )}
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-black mb-2">Mapa BETT Brasil 🗺️</h2>
        <p className="text-sm opacity-90 px-4 leading-tight" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
          Conheça a localização dos estandes da BETT Brasil
        </p>
      </div>
    </div>
    </>
  );
}
