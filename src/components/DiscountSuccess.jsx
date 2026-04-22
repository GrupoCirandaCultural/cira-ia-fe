import React, { useMemo } from 'react';
import { Search, MapPin, ShoppingCart } from 'lucide-react';
import { getEventoConfig, getEstandeConfig, getTemaEstande } from '../config/events.config';
import logoFundo from '../assets/logo_fundo.png';
import logoFundoCirandaEscola from '../assets/ciranda_escola_sem_fundo_branco.png';
import bookIcon from '../assets/book_icon.png';
import cartIcon from '../assets/cart_icon.png';

export default function DiscountSuccess({ idEstande, eventoId, onExplore, userName = 'Visitante' }) {
  const eventoConfig = useMemo(() => getEventoConfig(eventoId), [eventoId]);
  const estandeConfig = useMemo(() => getEstandeConfig(eventoId, idEstande), [eventoId, idEstande]);
  const temaEstande = useMemo(() => getTemaEstande(eventoId, idEstande), [eventoId, idEstande]);

  if (!eventoConfig || !estandeConfig || !temaEstande) {
    return <div className="h-full flex items-center justify-center text-red-500">Configuração não encontrada</div>;
  }

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden"
      style={{ background: `linear-gradient(to bottom, #003D82, #003D82dd)` }}
    >
      {/* Header */}
      <div className="flex items-center justify-center z-10">
        <div
          style={{ backgroundColor: "#F9B334" }}
          className="w-full p-5 flex items-center justify-center gap-2"
        >
          <img src={logoFundo} alt="logo" className="h-20" />
          <img src={logoFundoCirandaEscola} alt="logo" className="h-14" />
        </div>
      </div>

      {/* Content - Centro */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 z-10 overflow-y-auto">
        {/* Parabéns */}
        <h1 className="text-7xl font-black text-white text-center leading-tight">
          Parabéns
        </h1>

        {/* Nome em cinza menor */}
        <p className="text-2xl font-black text-gray-300 text-center mb-6">
          {userName}
        </p>

        {/* Desconto */}
        <div className="text-center mb-8">
          <p className="text-3xl text-yellow-300 font-black leading-tight">
            Você ganhou
            <br />
            20% de desconto
          </p>
        </div>

        {/* Tutorial Centralizado */}
        <div className="w-full max-w-sm space-y-3 text-white">
          {/* Passo 1 */}
          <div className="text-center">
            <p className="text-lg font-black mb-1">1. Printe esta tela</p>
          </div>

          {/* Passo 2 */}
          <div className="text-center">
            <p className="text-lg font-black mb-1">
              2. Vá até o próximo estande
            </p>
            <p className="text-base font-medium">Ciranda na Escola</p>
            <p className="text-base text-yellow-300 font-medium underline flex items-center justify-center gap-1">
              <MapPin size={14} />
              Veja no mapa como chegar
            </p>
          </div>

          {/* Passo 3 */}
          <div className="text-center">
            <p className="text-lg font-black mb-1">
              3. Escolha os seus produtos e
            </p>
            <p className="text-base font-medium">
              aplique o seu desconto no caixa
            </p>
          </div>
        </div>
      </div>

      {/* Footer com dois botões */}
      <div
        className="w-full grid grid-cols-2 gap-0 z-10"
        style={{ backgroundColor: "#F9B334" }}
      >
        {/* Botão Esquerdo - Estoque */}
        <button
          onClick={onExplore}
          className="flex-1 py-8 px-1 text-white font-black text-center border-r-4 hover:bg-black/10 active:scale-95 transition-all flex flex-col items-center gap-2 min-h-48"
          style={{ borderRightColor: "#003D82" }}
        >
          <span className="text-center text-black text-base font-medium px-2">
            Quer ajuda virtual para esclarecer dúvidas?
          </span>
          <div className="bg-orange-400 rounded-lg p-3 flex items-center justify-center min-h-18">
            <div className="rounded-lg p-3 flex items-center justify-center">
              <img src={bookIcon} alt="book" className="h-7 w-7" />
            </div>
            <span className="text-sm leading-tight">
              CONSULTE O<br />
              NOSSO ESTOQUE
            </span>
          </div>
        </button>

        {/* Botão Direito - Pesquisa */}
        <button
          onClick={() =>
            window.open(
              "https://wa.me/11978802196?text=Já garanti meus 20% e vim responder a pesquisa para garantir 40%!",
              "_blank",
            )
          }
          className="flex-1 py-4 px-1 text-white font-black text-center hover:bg-black/10 active:scale-95 transition-all flex flex-col items-center gap-2 min-h-48"
        >
          <p className="text-center text-black text-base font-medium mt-4">
            Preencha a pesquisa e ganhe{" "}
            <span className="text-red-500 font-black">40% off</span> em nosso
            site!
          </p>
          <div className="bg-orange-400 rounded-lg flex p-3 items-center justify-center min-w-45 h-19">
            <div className="rounded-lg p-3 flex items-center justify-center">
              <img src={cartIcon} alt="cart" className="h-7 w-7" />
            </div>
            <span className="text-sm leading-tight">
              QUERO
              <br />
              PARTICIPAR
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}