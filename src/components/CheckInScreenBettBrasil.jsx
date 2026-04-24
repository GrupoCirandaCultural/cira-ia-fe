import React, { useRef, useState } from 'react';
import { ArrowLeft, MapPin, Download, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import EventMap from './EventMap';
import { EVENTOS_CONFIG } from '../config/events.config';

export default function CheckInScreenBettBrasil({ onBack, eventoId, idEstande, fromDiscount }) {
  const mapRef = useRef(null);
  const [downloaded, setDownloaded] = useState(false);
  // Formata o ID do estande para exibição
  const estandeNome = idEstande ? idEstande.replace(/_/g, ' ').toUpperCase() : "GERAL";
  
  // Obtém o tema do estande a partir da configuração
  const eventoConfig = EVENTOS_CONFIG[eventoId];
  const tema = eventoConfig?.temaPorEstande?.[idEstande];
  const primaryColor = tema?.primaryColor || '#ea580c';
  const darkColor = tema?.darkColor || '#d94a08';

  const handleDownloadMap = async () => {
    if (!mapRef.current) return;
    try {
      const dataUrl = await toPng(mapRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = 'mapa-bett-brasil.png';
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error('Erro ao baixar mapa', e);
    }
  };

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

        {/* MAPA INTERATIVO COM BOTÃO SOBREPOSTO */}
        <div className="relative w-full flex-1 mb-6">
          <div ref={mapRef} className="w-full h-full">
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
        <p className="text-sm opacity-90 px-4 leading-tight">
          Conheça a localização dos estandes da BETT Brasil
        </p>
      </div>
    </div>
  );
}
