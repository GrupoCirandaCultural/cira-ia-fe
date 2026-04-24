import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { getOutroEstande } from '../config/events.config';

export function Stepper({ idEstande, eventoId, onViewMap }) {
  const outroEstande = getOutroEstande(eventoId, idEstande);
  const estandeName = outroEstande?.label || 'Ciranda na Escola';
  const estandeNumero = outroEstande?.numero || 'B12';

  const steps = [
    {
      title: 'Mostre o cupom no caixa',
      description: 'Apresente o código acima.',
    },
    {
      title: `Vá até o estande ${estandeName}`,
      description: `Estande ${estandeNumero}`,
      action: { label: 'Ver no mapa', icon: MapPin },
    },
    {
      title: 'Aproveite seus produtos com 20% off',
      description: 'Desconto aplicado direto no caixa.',
    },
  ];

  return (
    <ol className="relative space-y-5">
      {steps.map((step, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.08 }}
          className="relative flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-300 font-bold text-sm text-blue-900 ring-4 ring-white/10">
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="mt-1 h-full w-px flex-1 bg-white/15" />
            )}
          </div>
          <div className="flex-1 pb-1">
            <p className="text-[15px] font-semibold text-white">
              {step.title}
            </p>
            <p className="mt-0.5 text-sm text-white/70">{step.description}</p>
            {step.action && (
              <button 
                onClick={onViewMap}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-300 underline-offset-4 hover:underline">
                <step.action.icon className="h-3.5 w-3.5" />
                {step.action.label}
              </button>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
