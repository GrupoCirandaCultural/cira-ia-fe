import React from 'react';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { listarEventos } from '../config/events.config';

export default function EventSelector({ onSelectEvent }) {
  const eventos = listarEventos();

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex flex-col items-center justify-center overflow-y-auto">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/10 rounded-full border border-white/20 mb-6">
            <Calendar size={40} className="text-blue-400" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2">Ciranda Cultural</h1>
          <p className="text-gray-400 text-sm">Selecione o evento para continuar</p>
        </div>

        {/* Lista de Eventos */}
        <div className="space-y-3 mb-12">
          {eventos.map((evento) => (
            <button
              key={evento.id}
              onClick={() => onSelectEvent(evento.id)}
              className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors mb-1">
                    {evento.nome}
                  </h3>
                  <p className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                    <MapPin size={14} />
                    {evento.numEstandes} estandes disponíveis
                  </p>
                  <p className="text-gray-400 text-xs line-clamp-1">
                    {evento.descricao}
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-600 group-hover:text-blue-300 transition-colors mt-1 ml-3 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>

        {/* Info Footer */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
          <p className="text-gray-500 text-xs">
            <strong>Primeira vez?</strong> Selecione o evento em que você está para começar a explorar nossos livros incríveis!
          </p>
        </div>
      </div>

      {/* Background decorativo */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
