import React from 'react';
import { MapPin, Check } from 'lucide-react';

const EventMap = ({ visitados = [], idEstandeAtual }) => {
  // Simulação dos estandes do evento (Pode ser parametrizado via props no futuro)
  const estandes = [
    { id: 'estande_norte', label: 'Pavilhão Norte', x: '15%', y: '20%' },
    { id: 'ciranda_bienal', label: 'Estande Principal', x: '50%', y: '45%' },
    { id: 'estande_sul', label: 'Pavilhão Sul', x: '80%', y: '75%' },
  ];

  return (
    <div className="relative w-full h-56 bg-white/10 rounded-3xl border border-white/20 mb-6 overflow-hidden shadow-inner">
        {/* Placeholder visual da planta do evento */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
        
        {/* Simulação de caminhos/corredores */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mt-4 ml-4">
             <path d="M60 60 Q 180 120 300 190" stroke="white" strokeWidth="4" fill="none" strokeDasharray="8 8" />
             <path d="M190 120 L 190 60" stroke="white" strokeWidth="4" fill="none" strokeDasharray="8 8" />
        </svg>

        {estandes.map((local) => {
            // Verifica se o ID deste estande está na lista de visitados retornados pela API
            const isVisitado = visitados.some(v => v === local.id || v.id_estande === local.id);
            const isAtual = idEstandeAtual === local.id;
            
            let containerClass = "bg-white/90 text-gray-400 border-gray-200 saturate-0"; // Padrão: Não visitado (Cinza/Neutro)
            let iconColor = "text-gray-300";

            // Lógica ajustada: Se já visitou, PRIORIDADE para VERDE, mesmo que seja o atual
            if (isVisitado) {
                 containerClass = "bg-green-500 text-white border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.4)] z-10"; // Visitado (Verde)
                 // Se for o atual E visitado, mantemos um destaque (pulse) mas na cor verde
                 if (isAtual) {
                    containerClass += " ring-4 ring-green-400/50 animate-pulse";
                 }
                 iconColor = "text-white";
            } else if (isAtual) {
                 containerClass = "bg-pink-500 text-white border-pink-300 ring-4 ring-pink-500/30 animate-pulse z-10"; // Atual (Rosa)
                 iconColor = "text-white";
            } else {
                 containerClass = "bg-yellow-100 text-yellow-700 border-yellow-300"; // Disponível para visitar (Amarelo)
                 iconColor = "text-yellow-600";
            }

            return (
                <div 
                    key={local.id}
                    className={`absolute w-20 h-20 -ml-10 -mt-10 rounded-2xl flex flex-col items-center justify-center p-1 text-center transition-all duration-500 border-2 shadow-xl ${containerClass}`}
                    style={{ left: local.x, top: local.y }}
                >
                    <MapPin size={20} className={`mb-1 ${iconColor}`} />
                    <span className="text-[9px] font-black leading-none uppercase max-w-full px-1">{local.label}</span>
                    
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