import React, { useState } from 'react';
import axios from 'axios';
import bgImage from '../assets/background-roleta.png';

const getRandomExtraDegrees = () => Math.floor(Math.random() * 360);

export default function PrizeWheel({ userId, onFinish }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const prizes = [
    "10% OFF",
    "BRINDE",
    "LIVRO GRÁTIS",
    "5% OFF",
    "CUPOM SURPRESA",
    "FRETE GRÁTIS"
  ];

  const spin = () => {
    if (isSpinning) return;

    const extraDegrees = getRandomExtraDegrees();
    const newRotation = rotation + 1800 + extraDegrees; 

    setIsSpinning(true);
    setRotation(newRotation);

    setTimeout(async () => {
      setIsSpinning(false);

      const actualDegrees = newRotation % 360;
      const prizeIndex = Math.floor((360 - (actualDegrees % 360)) / (360 / prizes.length)) % prizes.length;
      const wonPrize = prizes[prizeIndex];

      try {
        if (userId) {
          await axios.put('http://localhost:8008/leads/update-coupon', {
            id: userId,
            cupom: wonPrize
          });
        }
      } catch (err) {
        console.error("Erro ao salvar cupom:", err);
      }

      onFinish(wonPrize);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full bg-[#87CEEB] overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-top"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'top center'
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md h-full pt-10">
        <div className="h-40 sm:h-48" />

        <div className="relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-0 h-0 
                          border-l-[15px] border-l-transparent 
                          border-r-[15px] border-r-transparent 
                          border-t-[30px] border-t-red-600 drop-shadow-md"></div>
          <div 
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border-8 border-white shadow-2xl transition-transform duration-[4000ms] ease-out relative flex items-center justify-center overflow-hidden"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(#f472b6 0% 16.6%, #60a5fa 16.6% 33.3%, #f472b6 33.3% 50%, #60a5fa 50% 66.6%, #f472b6 66.6% 83.3%, #60a5fa 83.3% 100%)`
            }}
          >
            {prizes.map((prize, index) => (
              <div
                key={index}
                className="absolute h-1/2 flex items-start justify-center pt-4"
                style={{
                  top: '0',
                  left: '50%',
                  width: '60px',
                  marginLeft: '-30px',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${index * (360 / prizes.length) + (360 / prizes.length / 2)}deg)`
                }}
              >
                <span className="text-[10px] sm:text-[11px] font-black text-white text-center leading-tight uppercase drop-shadow-sm">
                  {prize.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                </span>
              </div>
            ))}

            <div className="absolute z-20 w-16 h-16 bg-white rounded-full shadow-inner flex items-center justify-center">
               <span className="text-pink-500 font-black text-[10px] text-center">Ciranda Cultural</span>
            </div>
          </div>
        </div>

        <button 
          onClick={spin}
          disabled={isSpinning}
          className={`relative z-20 mt-8 px-10 py-4 rounded-full text-white font-black text-lg shadow-xl transition-all uppercase tracking-widest ${
            isSpinning ? 'bg-gray-400' : 'bg-pink-500 hover:scale-105 active:scale-95'
          }`}
        >
          {isSpinning ? 'SORTEANDO...' : 'GIRAR AGORA!'}
        </button>
      </div>
    </div>
  );
}