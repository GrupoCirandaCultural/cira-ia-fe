import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import { getEventoConfig, getEstandeConfig, getTemaEstande } from '../config/events.config';
import { CouponCard } from './CouponCard';
import { Stepper } from './Stepper';
import logoFundo from '../assets/logo_fundo.png';
import logoFundoCirandaEscola from '../assets/ciranda_escola_sem_fundo_branco.png';

const scrollbarHideStyle = `
  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  
  .discount-scroll::-webkit-scrollbar {
    display: none;
  }
  .discount-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .discount-container {
    height: 100vh;
    height: 100dvh;
    min-height: -webkit-fill-available;
  }
`;

export default function DiscountSuccess({ idEstande, eventoId, onExplore, onViewMap, onBack, userName = 'Visitante', userPhone = '', discount = '20% OFF' }) {
  const eventoConfig = useMemo(() => getEventoConfig(eventoId), [eventoId]);
  const estandeConfig = useMemo(() => getEstandeConfig(eventoId, idEstande), [eventoId, idEstande]);
  const temaEstande = useMemo(() => getTemaEstande(eventoId, idEstande), [eventoId, idEstande]);

  if (!eventoConfig || !estandeConfig || !temaEstande) {
    return <div className="h-full flex items-center justify-center text-red-500">Configuração não encontrada</div>;
  }

  return (
    <>
      <style>{scrollbarHideStyle}</style>
      <div className="discount-container bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onBack}
        className="flex-shrink-0 flex items-center justify-between rounded-2xl bg-white mx-3 mt-3 sm:mx-4 sm:mt-4 px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      >
        <img src={logoFundo} alt="bett Brasil" className="h-7 sm:h-9 w-auto invert" />
        <img src={logoFundoCirandaEscola} alt="Ciranda na Escola" className="h-12 sm:h-16 w-auto invert" />
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-3 sm:px-4 py-3 sm:py-5 overflow-y-auto discount-scroll">
        <div className="mx-auto w-full max-w-md flex flex-col gap-2 sm:gap-4 my-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-2 text-yellow-300"
          >
            <span className="text-xl sm:text-2xl">🎉</span>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
              Parabéns, {userName.split(' ')[0]}!
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl font-black leading-tight sm:leading-none tracking-tight text-white -mt-1"
          >
            Você ganhou um<br />
            desconto exclusivo
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-xs sm:text-base text-blue-100"
          >
            Use ainda hoje no estande Ciranda na Escola.
          </motion.p>

          {/* Coupon Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
          >
            <CouponCard 
              code="CIRANDA20" 
              discount={discount}
              validUntil="hoje."
              userName={userName.split(' ')[0]}
              userPhone={userPhone}
            />
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-1 sm:mt-2"
          >
            <p className="mb-2 sm:mb-4 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Como usar
            </p>
            <Stepper idEstande={idEstande} eventoId={eventoId} onViewMap={onViewMap} />
          </motion.div>
        </div>
      </div>

      {/* CTAs - Bottom Section */}
      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex-shrink-0 px-3 sm:px-4 pt-2 space-y-2 sm:space-y-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() =>
            window.open(
              "https://wa.me/11978802196?text=Já garanti meus 20% e vim responder a pesquisa para garantir 40%!",
              "_blank",
            )
          }
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-3 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition active:scale-[0.98] shadow-lg">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Participe da pesquisa e ganhe 40% off no site</span>
        </button>

        <button
          onClick={onExplore}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-gray-900 transition hover:bg-gray-50 active:scale-[0.98]"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          Consultar nosso estoque
        </button>
      </motion.footer>
    </div>
    </>
  );
}