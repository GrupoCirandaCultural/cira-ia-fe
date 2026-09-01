import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';

// Mapa lúdico da Bienal com pins/etiquetas plotados via código sobre a imagem em public/mapa-bienal.png
export default function BienalMapModal({ isOpen, onClose, targets = [], locations = [] }) {
  const [imageAvailable, setImageAvailable] = useState(true);

  if (!isOpen) return null;

  const mapLocations = locations.length ? locations : targets;
  const isTargetLocation = (item) => targets.some((target) => (
    target.codigo === item.codigo || (target.nome === item.nome && target.estande === item.estande)
  ));
  const targetLabel = targets.length
    ? targets.map((target) => `${target.nome} - ${target.estande}`).join(', ')
    : 'os estandes marcados no mapa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-4 w-full max-w-2xl relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 p-2 bg-white/90 rounded-full text-gray-500 hover:text-gray-700 shadow-md transition-colors">
          <X size={20} />
        </button>

        <div className="pr-10 mb-3">
          <h3 className="text-lg font-black text-gray-800">Mapa da Bienal</h3>
          <p className="text-xs font-bold text-gray-500">
            Vá até {targetLabel}
          </p>
        </div>

        <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl border border-gray-200 bg-slate-100">
          {imageAvailable ? (
            <img
              src="/mapa-bienal.png"
              alt="Mapa da Bienal"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setImageAvailable(false)}
            />
          ) : (
            <div className="absolute inset-0 bg-white">
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gray-100 border-t border-gray-200" />
              <div className="absolute left-[2%] top-[10%] h-[70%] w-[60%] rounded-xl bg-slate-100 border border-slate-200" />
              <div className="absolute right-[2%] top-[5%] h-[84%] w-[34%] rounded-xl bg-slate-50 border border-slate-200" />
            </div>
          )}

          {mapLocations.map((item) => {
            const isTarget = isTargetLocation(item);
            const pinColor = isTarget ? '#DC2626' : item.color || '#F59E0B';
            const align = item.align || 'center';
            const wrapperAlignClass = align === 'left'
              ? 'left-1/2 items-start'
              : align === 'right'
                ? 'right-1/2 items-end'
                : 'left-1/2 -translate-x-1/2 items-center';

            return (
              <div
                key={`${item.codigo || item.nome}-${item.estande}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: item.x, top: item.y }}
              >
                {/* marca o ponto exato no mapa */}
                {isTarget && (
                  <div className="absolute inset-0 -m-2 rounded-full border-4 border-red-500 bg-red-500/10 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                )}
                <div
                  className="relative z-10 h-2.5 w-2.5 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: pinColor }}
                />

                {/* etiqueta deslocada abaixo, ligada ao ponto por uma setinha */}
                <div className={`absolute top-full pt-2 flex flex-col ${wrapperAlignClass}`}>
                  <div
                    className="h-2 w-2 -mb-[5px] rotate-45"
                    style={{ backgroundColor: pinColor }}
                  />
                  <div
                    className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[9px] font-black text-white shadow-md ${isTarget ? 'ring-2 ring-red-300 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]' : ''}`}
                    style={{ backgroundColor: pinColor }}
                  >
                    {isTarget && <MapPin size={10} fill="currentColor" />}
                    <span>{item.nome}</span>
                    <span className="opacity-85">{item.estande}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
