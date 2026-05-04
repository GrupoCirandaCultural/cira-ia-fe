import React, { useRef, useState } from 'react';
import { Check, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';

const dataUrlToFile = async (dataUrl, filename) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: 'image/png' });
};

export function CouponCard({ code, discount, validUntil, userName = 'Visitante', userPhone = '', isKiosk = false }) {
  const [downloaded, setDownloaded] = useState(false);
  const couponRef = useRef(null);

  const handleDownload = async () => {
    if (!couponRef.current) return;
    try {
      const dataUrl = await toPng(couponRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const fileName = `cupom-${code}.png`;

      // Em mobile, tenta abrir o menu nativo para salvar a imagem na galeria.
      if (navigator.share) {
        const imageFile = await dataUrlToFile(dataUrl, fileName);
        if (!navigator.canShare || navigator.canShare({ files: [imageFile] })) {
          await navigator.share({ files: [imageFile], title: `Cupom ${code}` });
        } else {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        }
      } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error('Erro ao gerar imagem do cupom', e);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.15 }}
      className="relative w-full"
    >
      <div
        ref={couponRef}
        className="rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg p-1"
      >
        <div className="bg-yellow-300 rounded-xl px-6 text-blue-900 relative">
          {/* Top section with label and name */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                Seu desconto
              </p>
            </div>
            <div className="mt-2 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                Para
              </p>
              <p className="font-bold text-sm">{userName}</p>
              <p className="font-bold text-xs">{userPhone}</p>
            </div>
          </div>

          {/* Main discount */}
          <p className="font-bold text-6xl leading-none tracking-tight mb-3">
            {discount}
          </p>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-blue-900/30 my-3" />

          {/* Code section */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80 mb-1">
              Código
            </p>
            <p className="font-mono text-2xl font-bold tracking-wider mb-2">
              {code}
            </p>
            <p className="text-xs font-medium opacity-75 pb-2">
              Válido até {validUntil}
            </p>
          </div>
        </div>
      </div>

      {!isKiosk && (
      <button
        onClick={handleDownload}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
      >
        {downloaded ? (
          <>
            <Check className="h-4 w-4" /> Imagem baixada
          </>
        ) : (
          <>
            <Download className="h-4 w-4" /> Baixar imagem do cupom
          </>
        )}
      </button>
      )}
    </motion.div>
  );
}
