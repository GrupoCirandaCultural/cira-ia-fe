import React from 'react';
import logoFundo from '../assets/logo_fundo.png';
import logoFundoCirandaEscola from '../assets/ciranda_escola_sem_fundo_branco.png';

export default function LogoHeader({ onClick, className = '' }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl bg-white mx-3 mt-3 sm:mx-4 sm:mt-4 px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${className}`}
    >
      <img 
        src={logoFundo} 
        alt="bett Brasil" 
        className="h-7 sm:h-9 w-auto" 
        style={{ 
          filter: 'brightness(0) saturate(100%)',
          opacity: 0.8
        }}
      />
      <img 
        src={logoFundoCirandaEscola} 
        alt="Ciranda na Escola" 
        className="h-12 sm:h-16 w-auto" 
        style={{ 
          filter: 'brightness(0) saturate(100%)',
          opacity: 0.9
        }}
      />
    </div>
  );
}
