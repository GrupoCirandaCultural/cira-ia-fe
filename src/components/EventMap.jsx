import React, { useCallback, useEffect, useRef } from 'react';
import { MapPin, Check } from 'lucide-react';
import mapaBettBrasil from '../assets/mapa_bett_brasil.jpeg';
import api from '../api';
import { getEventoConfig } from '../config/events.config';

const getReadableTextColor = (hexColor = '#000000') => {
  const hex = hexColor.replace('#', '');
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 150 ? '#111827' : '#FFFFFF';
};

const EventMap = ({ visitados = [], idEstandeAtual, eventoId, userName = '', userPhone = '', userState = '', userActivity = '' }) => {
  const hasTrackedEntry = useRef(false);
  const sessionIdRef = useRef('');

  const trackEvent = useCallback(async (eventName, label, metaData = {}) => {
    try {
      if (!sessionIdRef.current) {
        sessionIdRef.current = Math.random().toString(36).substring(7);
      }

      const payload = {
        event_name: eventName,
        user_phone: userPhone || '',
        user_name: userName || '',
        session_id: sessionIdRef.current,
        label,
        metadata: JSON.stringify(metaData),
        timestamp: new Date().toISOString(),
      };

      api.post('/api/analytics', payload).catch((err) => {
        console.warn('Falha ao registrar analytics do mapa:', err);
      });
    } catch (e) {
      console.error(e);
    }
  }, [userName, userPhone]);

  useEffect(() => {
    if (hasTrackedEntry.current) return;
    hasTrackedEntry.current = true;

    trackEvent('map_enter', 'event_map', {
      evento_id: eventoId || '',
      id_estande: idEstandeAtual || '',
      estado: userState || '',
      atividade: userActivity || '',
    });
  }, [eventoId, idEstandeAtual, userState, userActivity, trackEvent]);

  const eventoConfig = getEventoConfig(eventoId);
  const locaisMapa = eventoConfig?.mapaEstandes || eventoConfig?.estandes || [];
  const estandes = locaisMapa.map((estande, index) => ({
    ...estande,
    x: `${25 + (index % 4) * 16.66}%`,
    y: `${34 + Math.floor(index / 4) * 36}%`,
    color: estande.cor,
  }));

  // Layout especial para bett_brasil
  if (eventoId === 'bett_brasil') {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Mapa da rota */}
        <div className="flex-1 min-h-0 bg-white/10 rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-inner p-2 sm:p-4 flex items-center justify-center">
          <img
            src={mapaBettBrasil}
            alt="Mapa BETT Brasil"
            className="max-w-full max-h-full w-auto h-auto rounded-xl object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 bg-white/10 rounded-3xl border border-white/20 mb-6 overflow-hidden shadow-inner">
        {/* Placeholder visual da planta do evento */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
        
           {/* Simulação de caminhos/corredores */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
             <path d="M40 88 H 320" stroke="white" strokeWidth="4" fill="none" strokeDasharray="8 8" />
             <path d="M40 178 H 320" stroke="white" strokeWidth="4" fill="none" strokeDasharray="8 8" />
             <path d="M180 58 V 212" stroke="white" strokeWidth="4" fill="none" strokeDasharray="8 8" />
        </svg>

        {estandes.map((local) => {
            // Verifica se o ID deste estande está na lista de visitados retornados pela API
            const isVisitado = visitados.some(v => v === local.id || v.id_estande === local.id);
            const isAtual = idEstandeAtual === local.id;
            
            let containerClass = "bg-white/90 text-gray-400 border-gray-200 saturate-0"; // Padrão: Não visitado (Cinza/Neutro)
            let iconColor = "text-gray-300";
            let containerStyle = {};

            // Lógica ajustada: Se já visitou, PRIORIDADE para VERDE, mesmo que seja o atual
            if (isVisitado) {
                 containerClass = "bg-green-500 text-white border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.4)] z-10"; // Visitado (Verde)
                 // Se for o atual E visitado, mantemos um destaque (pulse) mas na cor verde
                 if (isAtual) {
                    containerClass += " ring-4 ring-green-400/50 animate-pulse";
                 }
                 iconColor = "text-white";
            } else if (isAtual) {
                containerClass = "ring-4 animate-pulse z-10"; // Atual (cor do estande)
                 iconColor = "text-white";
                containerStyle = {
                backgroundColor: local.color,
                borderColor: local.color,
                color: getReadableTextColor(local.color),
                '--tw-ring-color': `${local.color}55`,
                };
            } else {
                containerClass = "border-white/70"; // Disponível para visitar (cor do estande)
                iconColor = "text-current";
                containerStyle = {
                backgroundColor: `${local.color}dd`,
                borderColor: local.color,
                color: getReadableTextColor(local.color),
                };
            }

            return (
                <div 
                    key={local.id}
                  className={`absolute w-[72px] h-[72px] -ml-9 -mt-9 rounded-2xl flex flex-col items-center justify-center p-1 text-center transition-all duration-500 border-2 shadow-xl ${containerClass}`}
                    style={{ left: local.x, top: local.y, ...containerStyle }}
                >
                  <MapPin size={18} className={`mb-1 ${iconColor}`} />
                  <span className="text-[8px] font-black leading-none uppercase max-w-full px-1">{local.label}</span>
                  {local.numero && <span className="text-[8px] font-black leading-none mt-0.5 opacity-90">{local.numero}</span>}
                    
                    {isVisitado && (
                        <span className="absolute -top-2 -right-2 bg-white text-green-600 rounded-full p-1 border-2 border-green-500 shadow-sm transform scale-100 animate-in zoom-in">
                            <Check size={10} strokeWidth={4} />
                        </span>
                    )}
                </div>
            )
        })}
        
        <div className="absolute bottom-2 left-0 w-full text-center">
             <span className="inline-block bg-black/20 backdrop-blur-md text-[9px] text-white px-3 py-1 rounded-full border border-white/10 uppercase font-medium tracking-widest">
                Mapa da Rota
             </span>
        </div>
    </div>
  );
};

export default EventMap;