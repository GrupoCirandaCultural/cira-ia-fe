import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Search, ShoppingCart, X, Smartphone } from 'lucide-react';
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

export default function DiscountSuccess({ idEstande, eventoId, onExplore, onViewMap, onBack, userName = 'Visitante', userPhone = '', discount = '20% OFF', isKiosk = false }) {
  const eventoConfig = useMemo(() => getEventoConfig(eventoId), [eventoId]);
  const estandeConfig = useMemo(() => getEstandeConfig(eventoId, idEstande), [eventoId, idEstande]);
  const temaEstande = useMemo(() => getTemaEstande(eventoId, idEstande), [eventoId, idEstande]);
  const [showQrModal, setShowQrModal] = useState(false);

  const whatsappUrl = 'https://wa.me/5511978802196?text=Garanti meus 20 por cento de desconto e vim responder a pesquisa para garantir 40 por cento';

  const handleWhatsappClick = () => {
    if (isKiosk) {
      setShowQrModal(true);
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="-mt-1 sm:-mt-3 text-[10px] sm:text-xs text-blue-200/80 italic"
          >
            O desconto não é válido para itens promocionais.
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
              isKiosk={isKiosk}
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
        {!isKiosk && (
        <button
          onClick={handleWhatsappClick}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-3 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition active:scale-[0.98] shadow-lg">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Participe da pesquisa e ganhe 40% off no site</span>
        </button>
        )}

        {isKiosk && (
        <button
          onClick={handleWhatsappClick}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-3 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition active:scale-[0.98] shadow-lg">
          <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Participe da pesquisa e ganhe 40% off no site</span>
        </button>
        )}

        <button
          onClick={onExplore}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-gray-900 transition hover:bg-gray-50 active:scale-[0.98]"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          Consultar nosso estoque
        </button>
      </motion.footer>

      {/* Modal QR Code (Kiosk) */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-800 leading-tight">
                  Aponte a câmera do seu celular
                </h3>
                <p className="text-xs text-gray-500 leading-snug px-2">
                  Escaneie o QR Code abaixo para abrir o WhatsApp e responder a pesquisa.
                  Você ganha <span className="font-bold text-orange-600">40% off no site</span>!
                </p>

                <div className="bg-white p-3 rounded-2xl border-2 border-gray-200 mt-2">
                  <QRCode value={whatsappUrl} size={180} />
                </div>

                <p className="text-[11px] text-gray-400 mt-1">
                  Toque fora ou no X para fechar.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}