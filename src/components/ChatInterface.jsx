import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Send, Search, BookOpen, Ticket, ShoppingCart, Loader2, Sparkles, X, Download, Camera, ArrowLeft, RotateCcw, Trash2, MessageCircle, CheckCircle, AlertCircle, ChevronUp, ChevronDown, Eye } from 'lucide-react';

// Mapeamento de ID do estande para código RPA
const ESTANDE_TO_RPA = {
  'estande_azul': '000324',
  'estande_laranja': '000316',
};
import bgChat from '../assets/background-chat.png';
import bgChatBett from '../assets/background-chat-bett.png';
import iconeEscola from '../assets/icone_ciranda_escola.png';
import { getEstandeTheme } from '../theme';

const generateSessionId = () => Math.random().toString(36).substring(7);

const CouponModal = ({ code, isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }} className="w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <Ticket size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-800">Seu Cupom Especial!</h3>
          <p className="text-gray-500 text-sm px-4">Apresente este código no caixa para ganhar um brinde exclusivo.</p>
          
          <div style={{ background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})` }} className="w-full p-1 rounded-2xl shadow-lg mt-2">
            <div className="bg-white rounded-xl py-4 border-2 border-dashed flex flex-col items-center justify-center gap-1" style={{ borderColor: `${theme.primaryColor}40` }}>
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.primaryColor }}>Código</span>
              <span className="text-3xl font-black text-gray-800 tracking-wider font-mono">{code}</span>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 font-medium pt-2">Válido apenas para hoje. Um uso por pessoa.</p>
        </div>
      </div>
    </div>
  );
};

const BookDetailsModal = ({ book, isOpen, onClose, onConfirm, theme }) => {
  if (!isOpen || !book) return null;

  const status = book.stockStatus;
  const stockDisplay = book.stockDisplay || 'Fora de estoque';
  const estoqueEventos = book.estoqueEventos || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200 flex flex-col gap-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-10">
          <X size={20} />
        </button>
        
        <div className="w-full aspect-[2/3] max-h-60 bg-gray-100 rounded-xl overflow-hidden mx-auto shadow-md relative">
           {book.capa_url ? (
             <img src={book.capa_url} alt={book.titulo} className="w-full h-full object-cover" />
           ) : (
             <div className="flex items-center justify-center h-full text-gray-400"><BookOpen size={48} /></div>
           )}
        </div>

        <div className="text-center">
            <h3 className="text-lg font-black text-gray-800 leading-tight mb-1">{book.titulo}</h3>
            {book.preco_capa && <p className="text-xl font-bold" style={{ color: theme.primaryColor }}>R$ {book.preco_capa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>}
        </div>
        
        <div className="max-h-24 overflow-y-auto text-sm text-gray-600 text-center px-2 scrollbar-thin">
            {book.sinopse}
        </div>

        <div className="pt-2">
            {status === 'unavailable' ? (
               <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                 <p className="text-sm font-bold text-red-600 mb-1">Fora de estoque</p>
                 <p className="text-xs text-gray-600 mb-3">Desculpe, este livro não está disponível no momento. Você pode adicionar à lista ou comprar online.</p>
                 
                 <div className="flex flex-col gap-2">
                    <button onClick={() => onConfirm(book)} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                        <ShoppingCart size={18} />
                        Adicionar à Lista
                    </button>
                 </div>
               </div>
            ) : (
              <>
                {/* Exibe os eventos onde o livro está disponível */}
                <div className="bg-green-50 border border-green-100 p-3 rounded-xl mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Disponível</span>
                  </div>
                  
                  {estoqueEventos.length > 0 ? (
                    <div className="space-y-2">
                      {estoqueEventos.map((evento, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          <p className="font-bold">{getEventDisplayName(evento.nome_evento)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{stockDisplay}</p>
                  )}
                </div>

                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                        Talvez depois
                    </button>
                    <button onClick={() => onConfirm(book)} className="flex-1 py-3 rounded-xl text-white font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2" style={{ backgroundColor: theme.primaryColor }}>
                        <ShoppingCart size={18} />
                        Sim, eu quero!
                    </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

const CartModal = ({ isOpen, onClose, cart, onRemove, onUpdateQuantity, userPhone, sessionId, userName, onAnalytics, theme }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // null, 'success', 'error'
  
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.preco_capa || 0) * (item.quantity || 1), 0);
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleCheckout = async () => {
    setLoading(true);

    if (onAnalytics) {
        onAnalytics('conversion_whatsapp', 'full_cart_checkout', { 
            total_value: total, 
            items_count: totalItems 
        });
    }

    try {
        const payload = {
            session_id: sessionId,
            user_phone: userPhone,
            user_name: userName,
            total_price: total,
            cart_total: `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            cart_link: 'https://www.cirandacultural.com.br',
            items: cart.map(item => ({
                isbn: item.barras,
                title: ((item.quantity || 1) > 1 ? `(${item.quantity}x) ` : '') + (item.titulo || '').replace(/[\n\t\r]/g, ' ').replace(/\s{2,}/g, ' ').trim(),
                price: item.preco_capa,
                cover: item.capa_url,
                link: `${item.barras || item.titulo}`
            }))
        };
        
        // Dispara para o backend que processa e envia via WhatsApp Cloud API
        await api.post('/api/checkout', payload);
        setFeedback('success');
    } catch (error) {
        console.error("Erro no checkout:", error);
        setFeedback('error');
    } finally {
        setLoading(false);
    }
  };
  
  // TELA DE SUCESSO / ERRO (SUBSTITUI O CARRINHO QUANDO HÁ FEEDBACK)
  if (feedback) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${feedback === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                {feedback === 'success' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
            </div>
            
            <h2 className="text-2xl font-black text-gray-800">
                {feedback === 'success' ? 'Tudo Pronto!' : 'Algo deu errado'}
            </h2>
            
            <p className="text-gray-500">
                {feedback === 'success' 
                    ? 'A lista de livros e os links de compra foram enviados para o seu WhatsApp. 📱' 
                    : 'Não conseguimos enviar a lista agora. Tente novamente mais tarde.'}
            </p>

            <button 
                onClick={onClose}
                className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors mt-4"
            >
                Fechar
            </button>
          </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md h-[80vh] flex flex-col relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2" style={{ color: theme.primaryColor }}>
                <ShoppingCart size={24} />
                <h2 className="text-xl font-black text-gray-800">Seu Carrinho</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                    <ShoppingCart size={48} className="opacity-20" />
                    <p className="text-center font-medium">Seu carrinho está vazio.<br/>Que tal procurar alguns livros?</p>
                </div>
            ) : (
                cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center">
                        <div className="w-12 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                            {item.capa_url && <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />}
                            {(item.quantity || 1) > 1 && (
                               <span className="absolute -top-2 -right-2 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
                                 {item.quantity}
                               </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight">{item.titulo}</h4>
                            <div className="flex items-center gap-2 mt-1 justify-between pr-2">
                                <p className="font-bold text-sm" style={{ color: theme.primaryColor }}>R$ {item.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                    <button onClick={() => onUpdateQuantity(idx, -1)} className="w-5 h-5 flex items-center justify-center bg-gray-50 rounded text-gray-600 font-bold hover:bg-gray-100 disabled:opacity-40" disabled={(item.quantity || 1) <= 1}>-</button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity || 1}</span>
                                    <button onClick={() => onUpdateQuantity(idx, 1)} className="w-5 h-5 flex items-center justify-center bg-gray-50 rounded text-gray-600 font-bold hover:bg-gray-100">+</button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => onRemove(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))
            )}
        </div>

        <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500 font-medium">Total ({totalItems} itens)</span>
                <span className="text-2xl font-black text-gray-800">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <button 
                disabled={cart.length === 0 || loading}
                style={{ backgroundColor: theme.primaryColor }}
                className="w-full py-4 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:opacity-90"
                onClick={handleCheckout}
            >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <MessageCircle size={24} />}
                {loading ? "Enviando..." : "Receber no WhatsApp"}
            </button>
        </div>
      </div>
    </div>
  );
};


const CartDrawer = ({ cart, onRemove, onClear, onUpdateQuantity, userPhone, sessionId, userName, onAnalytics, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // null, 'success', 'error'
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  
  if (!cart || cart.length === 0) return null;

  const total = cart.reduce((acc, item) => acc + (item.preco_capa || 0) * (item.quantity || 1), 0);
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleCheckout = async () => {
    setLoading(true);

    if (onAnalytics) {
        onAnalytics('conversion_whatsapp', 'minicart_checkout', { 
            total_value: total, 
            items_count: totalItems 
        });
    }

    try {
        const payload = {
            session_id: sessionId,
            user_phone: userPhone,
            user_name: userName,
            total_price: total,
            cart_total: `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            cart_link: 'https://www.cirandacultural.com.br',
            items: cart.map(item => ({
                isbn: item.barras,
                title: ((item.quantity || 1) > 1 ? `(${item.quantity}x) ` : '') + (item.titulo || '').replace(/[\n\t\r]/g, ' ').replace(/\s{2,}/g, ' ').trim(),
                price: item.preco_capa,
                cover: item.capa_url,
                link: `${item.barras || item.titulo}`
            }))
        };
        
        await api.post('/api/checkout', payload);
        setFeedback('success');
    } catch (error) {
        console.error("Erro no checkout:", error);
        setFeedback('error');
    } finally {
        setLoading(false);
    }
  };
  // RENDERIZAÇÃO DO MODAL DE CONFIRMAÇÃO
  if (isConfirmingClear) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl scale-100 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2">
                <Trash2 size={32} />
            </div>
            
            <h3 className="text-xl font-black text-gray-800 leading-tight">Limpar Carrinho?</h3>
            <p className="text-sm text-gray-500">Tem certeza que deseja remover todos os itens? Essa ação não pode ser desfeita.</p>

            <div className="flex gap-3 w-full mt-2">
                <button 
                    onClick={() => setIsConfirmingClear(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={() => {
                        onClear();
                        setIsConfirmingClear(false);
                    }}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-md transition-all active:scale-95"
                >
                    Sim, Limpar
                </button>
            </div>
          </div>
        </div>
    );
  }

  if (feedback) {
     return (
        <div className="absolute bottom-full left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col z-30 animate-in slide-in-from-bottom-5 duration-300 pb-2 mx-2 mb-2" style={{ borderTopColor: `${theme.primaryColor}20`, borderTopWidth: '1px' }}>
           <div className="w-full p-2 flex justify-end px-4">
              <button 
                onClick={() => {
                   setFeedback(null);
                   setIsOpen(false); // fecha o drawer ao fechar o feedback
                }} 
                className="p-1 bg-gray-100 rounded-full text-gray-400"
              >
                  <X size={16} />
              </button>
           </div>
           <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${feedback === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {feedback === 'success' ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                </div>
                <h3 className="text-xl font-black text-gray-800">
                    {feedback === 'success' ? 'Enviado!' : 'Erro'}
                </h3>
                <p className="text-sm text-gray-500">
                    {feedback === 'success' ? 'Sua lista foi enviada para o WhatsApp!' : 'Não conseguimos enviar agora.'}
                </p>
           </div>
        </div>
     );
  }

  return (
    <div 
        className={`absolute bottom-full left-0 right-0 bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] z-30 flex flex-col rounded-t-[32px] ${isOpen ? 'h-[75vh] rounded-t-[32px]' : 'h-auto rounded-t-[24px]'} mx-0 mb-0 overflow-hidden`}
        style={{ borderTopColor: `${theme.primaryColor}20`, borderTopWidth: '1px' }}
    >
        {/* Handle */}
        <div 
            className="w-full flex items-center justify-center py-3 cursor-pointer active:bg-gray-50 rounded-t-[32px] touch-none shrink-0"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={`w-12 h-1.5 rounded-full transition-colors ${isOpen ? 'bg-gray-300' : 'bg-gray-200'}`} />
        </div>

        {/* Content Container */}
        <div className="flex-1 min-h-0 flex flex-col px-5 pb-2">
            
            <div className={`flex items-center justify-between shrink-0 transition-all duration-300 ${isOpen ? 'mb-4 py-5' : 'mb-1'}`}>
                 <div className="flex items-center gap-3 cursor-pointer" onClick={() => !isOpen && setIsOpen(true)}>
                      <div className="relative">
                           <div className="p-2.5 rounded-2xl shadow-sm" style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor, borderColor: `${theme.primaryColor}30`, borderWidth: '1px' }}>
                               <ShoppingCart size={24} />
                           </div>
                           <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">{cart.length}</span>
                      </div>
                      <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total do carrinho</span>
                           <span className="text-xl font-black text-gray-800">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                 </div>

                 {!isOpen && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleCheckout(); }}
                        disabled={loading}
                        className="text-white pl-4 pr-5 py-2.5 rounded-xl font-bold active:scale-95 transition-all text-sm flex items-center gap-2" style={{ backgroundColor: theme.primaryColor }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <MessageCircle size={20} />}
                        <span>Receber</span>
                    </button>
                 )}
                 
                 {isOpen && (
                     <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                         <ChevronDown size={20} />
                     </button>
                 )}
            </div>

            {/* Expanded Content */}
            {isOpen && (
                <div className="flex-1 min-h-0 flex flex-col animate-in fade-in duration-300 slide-in-from-bottom-2">
                     <div className="h-px w-full bg-gray-100 mb-4 shrink-0" />

                     <div className="flex items-center justify-between mb-3 shrink-0">
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Itens selecionados ({totalItems})</h3>
                        {cart.length > 0 && (
                            <button 
                                onClick={() => setIsConfirmingClear(true)}
                                className="text-[10px] font-bold text-red-400 hover:text-red-600 bg-red-50 px-2 py-1 rounded-md transition-colors uppercase tracking-wide"
                            >
                                Limpar Carrinho
                            </button>
                        )}
                     </div>
                     
                     <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 scrollbar-thin pb-4">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex gap-3 p-3 bg-white rounded-2xl border border-gray-100 items-center shadow-sm">
                                <div className="w-14 h-[84px] bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-inner relative">
                                    {item.capa_url && <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />}
                                    {(item.quantity || 1) > 1 && (
                                       <span className="absolute -top-2 -right-2 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
                                          {item.quantity}
                                       </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight mb-1">{item.titulo}</h4>
                                    <div className="flex items-center gap-2 justify-between pr-2">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-sm" style={{ color: theme.primaryColor }}>R$ {item.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">ISBN: {item.barras}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                                            <button onClick={() => onUpdateQuantity(idx, -1)} className="w-5 h-5 flex items-center justify-center bg-white rounded text-gray-600 font-bold shadow-sm disabled:opacity-40" disabled={(item.quantity || 1) <= 1} onMouseEnter={(e) => e.target.style.color = theme.primaryColor} onMouseLeave={(e) => e.target.style.color = 'rgb(75, 85, 99)'}>-</button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity || 1}</span>
                                            <button onClick={() => onUpdateQuantity(idx, 1)} className="w-5 h-5 flex items-center justify-center bg-white rounded text-gray-600 font-bold shadow-sm" onMouseEnter={(e) => e.target.style.color = theme.primaryColor} onMouseLeave={(e) => e.target.style.color = 'rgb(75, 85, 99)'}>+</button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(idx)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                     </div>
                     
                     <div className="mt-auto pt-4 border-t border-gray-100 shrink-0">
                        <button 
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full py-4 text-white rounded-2xl font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: theme.primaryColor }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <MessageCircle size={24} />}
                            {loading ? "Enviando lista..." : "Receber no WhatsApp"}
                        </button>
                     </div>
                </div>
            )}
        </div>
    </div>
  );
};

// --- FUNÇÕES AUXILIARES DE ESTOQUE ---

const getStockCardStyle = (status) => {
  if (status === 'available_here') return 'border-l-4 border-l-green-500 bg-green-50';
  if (status === 'available_elsewhere') return 'border-l-4 border-l-yellow-500 bg-yellow-50';
  if (status === 'unavailable') return 'border-l-4 border-l-red-500 bg-red-50 opacity-75';
  return 'bg-white/95'; // Default do chat normal
};

const getEventDisplayName = (nomeEvento) => {
  if (!nomeEvento) return 'Evento';
  return String(nomeEvento).split('-')[0].trim();
};

// Função para formatar a exibição de estoque por evento
const formatStockDisplay = (estoque_eventos) => {
  if (!estoque_eventos || !Array.isArray(estoque_eventos) || estoque_eventos.length === 0) {
    return { text: 'Fora de estoque', status: 'unavailable' };
  }

  const disponibilidades = estoque_eventos.map(
    e => `${getEventDisplayName(e.nome_evento)} (${e.estoque} ${e.estoque === 1 ? 'unidade' : 'unidades'})`
  ).join(' e ');

  return {
    text: `Disponível em: ${disponibilidades}`,
    status: 'available_here',
    eventos: estoque_eventos
  };
};

export default function ChatInterface({ userName: userNameProp, userPhone, cupom, onBack, initialMode = 'chat', idEstande = 'estande_laranja', eventoId = 'bett_brasil' }) { // <--- Função principal começa aqui
  const userName = (userNameProp && String(userNameProp).trim()) ? String(userNameProp).trim().split(' ')[0] : 'Visitante';
  const theme = getEstandeTheme(idEstande);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- FUNÇÃO CENTRAL DE ANALYTICS ---
  const trackEvent = async (eventName, label, metaData = {}) => {
      try {
          const payload = {
              event_name: eventName,
              user_phone: userPhone,
              user_name: userName,
              session_id: sessionId,
              label: label,
              metadata: JSON.stringify(metaData),
              timestamp: new Date().toISOString()
          };
          api.post('/api/analytics', payload).catch(err => console.warn("Analytics fail:", err));
      } catch (e) {
          console.error(e);
      }
  };

  // CART & BOOK DETAILS STATES
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const addToCart = (book) => {
    setCart(prev => {
        const existingIndex = prev.findIndex(item => (item.barras && item.barras === book.barras) || (item.titulo === book.titulo));
        if (existingIndex >= 0) {
            const newCart = [...prev];
            newCart[existingIndex] = { ...newCart[existingIndex], quantity: (newCart[existingIndex].quantity || 1) + 1 };
            return newCart;
        }
        return [...prev, { ...book, quantity: 1 }];
    });
    setSelectedBook(null);
    trackEvent('add_to_cart', book.barras || 'SEM_ISBN', { title: book.titulo, price: book.preco_capa });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => {
        const newCart = [...prev];
        const item = newCart[index];
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        newCart[index] = { ...item, quantity: newQty };
        return newCart;
    });
  };

  const clearCart = () => setCart([]);
  
  const handleBookSelection = (book) => {
    // Abre o modal com as informações de estoque já vindo da resposta inicial
    const stockInfo = formatStockDisplay(book.estoque_eventos);
    
    setSelectedBook({
      ...book,
      checkingStock: false,
      stockStatus: stockInfo.status,
      stockDisplay: stockInfo.text,
      estoqueEventos: book.estoque_eventos || []
    });

    // Registra a visualização do detalhe do livro
    trackEvent('stock_check', book.barras || 'SEM_ISBN', { 
      title: book.titulo,
      status: stockInfo.status,
      eventos_disponiveis: book.estoque_eventos?.length || 0
    });
  };
  
  // ESTADOS DO MODO ESTOQUE
  const [genres, setGenres] = useState([]);
  const [stockFilterGenre, setStockFilterGenre] = useState(null);
  const [stockOnlyBooth, setStockOnlyBooth] = useState(false);
  
  // Refs para controle de drag sem re-renderização
  const filtersRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const startDragging = (e) => {
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - filtersRef.current.offsetLeft;
    scrollLeft.current = filtersRef.current.scrollLeft;
  };

  const stopDragging = () => {
    isDown.current = false;
    // O flag isDragging será usado no click para prevenir seleção acidental
    setTimeout(() => { isDragging.current = false; }, 0);
  };

  const onDrag = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - filtersRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Velocidade do scroll
    
    // Se moveu mais que 5 pixels, considera que está arrastando
    if (Math.abs(walk) > 5) {
      isDragging.current = true;
    }
    
    filtersRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    if (initialMode === 'stock') {
      const fetchGenres = async () => {
        try {
          const response = await api.get('/api/genres');
          setGenres(response.data);
        } catch (error) {
          console.error("Erro ao buscar gêneros:", error);
        }
      };
      fetchGenres();
    }
  }, [initialMode]);

  const scrollRef = useRef(null);
  const lastMessageRef = useRef(null);
  const inputRef = useRef(null); // Ref para o input de busca
  
  const ageOptions = [
    { label: "0 a 3 anos", value: "Tenho um bebê de 0 a 3 anos" },
    { label: "4 a 7 anos", value: "Para uma criança de 4 a 7 anos" },
    { label: "8 a 12 anos", value: "Público juvenil de 8 a 12 anos" },
    { label: "13 a 17 anos", value: "Para adolescentes de 13 a 17 anos" },
    { label: "Adulto", value: "Estou procurando para um Adulto" }
  ];

  const tagOptions = [
    { label: "Socioemocional", value: "Recomende livros sobre Socioemocional" },
    { label: "Inclusão", value: "Gostaria de conhecer livros sobre Inclusão" },
    { label: "Indígena", value: "Mostre-me livros com temática Indígena" },
    { label: "Alfabetização", value: "Procuro livros de Alfabetização" },
    { label: "Sustentabilidade", value: "Recomende livros sobre Sustentabilidade" }
  ];

  const getInitialMessages = () => {
    const msgs = [];
    if (cupom) {
      msgs.push({
        role: 'Cira IA',
        content: `Olá ${userName}! Que alegria ter você aqui. 🎁\n\nPreparei um presente especial para você!`,
        hasCupom: true
      });
    }

    if (initialMode === 'stock') {
      msgs.push({
        role: 'Cira IA',
        content: `Olá ${userName}! Estou pronta para consultar nosso estoque. 📚\n\nUse os filtros abaixo ou digite o nome do livro.`, options: tagOptions
      });
    } else {
      // Mostra tags apenas para bett_brasil
      if (eventoId === 'bett_brasil') {
        msgs.push({
          role: 'Cira IA',
          content: cupom 
            ? `Comece digitando algo, ou selecione uma tag para explorar livros especiais!`
            : `Olá ${userName}! Que alegria ter você aqui. 🐑💖\n\nSou a Cira, sua curadora. Qual tema você gostaria de explorar?`,
          options: tagOptions
        });
      } else {
        // Para outros eventos, mostra as opções de idade
        msgs.push({
          role: 'Cira IA',
          content: cupom 
            ? `Comece digitando algo, ou selecione a idade do leitor para eu te indicar o livro perfeito!`
            : `Olá ${userName}! Que alegria ter você aqui. 🐑💖\n\nSou a Cira, sua curadora. Para eu te dar as melhores dicas, qual a idade do leitor hoje?`,
          options: ageOptions
        });
      }
    }
    return msgs;
  };

  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [selectedAge, setSelectedAge] = useState(null);

  useEffect(() => {
    if (loading) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages, loading]);

  const handleResetChat = () => {
    setMessages(getInitialMessages());
    setInput('');
    setSessionId(generateSessionId());
    setSelectedAge(null);
    setStockFilterGenre(null);
    setStockOnlyBooth(false);
  };

  const handleSend = async (overrideMessage = null) => {
    let messageToSend = overrideMessage || input; 
    
    if (!messageToSend.trim() && !stockFilterGenre) return;

    // Adaptação para filtros de estoque interagirem com a IA
    let displayMsg = messageToSend;
    if (initialMode === 'stock' && stockFilterGenre && !messageToSend.trim()) {
       messageToSend = `Gostaria de ver opções de livros sobre ${stockFilterGenre}`;
       displayMsg = `Categoria: ${stockFilterGenre}`;
    }

    const userMsg = { role: 'user', content: displayMsg };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Verifica se a mensagem enviada foi uma seleção de idade
    const ageOption = ageOptions.find(opt => opt.value === messageToSend);
    const isAgeSelection = !!ageOption;
    
    let currentAge = selectedAge;
    if (isAgeSelection) {
      currentAge = ageOption.label;
      setSelectedAge(currentAge);
      trackEvent('select_age', currentAge, { full_text: messageToSend });
    } else {
      if (initialMode === 'stock' || messageToSend.length > 3) {
         trackEvent('search_query', messageToSend, { mode: initialMode, context_age: currentAge });
      }
    }

    let apiMessage = messageToSend;
    // if (currentAge && !isAgeSelection) {
    //   apiMessage += ` [Contexto: O usuário já informou a faixa etária: ${currentAge}. Não pergunte a idade novamente, apenas recomende livros.]`;
    // }

    try {
      const payload = {
        session_id: sessionId, 
        message: apiMessage,
      };

      // Adiciona filtros de estoque se o modo é 'stock'
      if (initialMode === 'stock') {
        if (stockOnlyBooth) {
          payload.only_local = true;
          payload.booth_id = ESTANDE_TO_RPA[idEstande];
        }
        if (stockFilterGenre) {
          payload.genre = stockFilterGenre;
        }
      }

      const { data } = await api.post('/chat', payload);
      
      let responseContent = data.texto;
      let responseOptions = null;

      // Se foi seleção de idade, adiciona pergunta de filtro e opções
      if (isAgeSelection) {
        responseContent += "\n\nGostaria de filtrar por algum tema específico?";
        responseOptions = [
          { label: "Educativo", value: "Prefiro livros educativos" },
          { label: "Interativo", value: "Gosto de livros interativos/sonoros" },
          { label: "Histórias", value: "Prefiro histórias e contos" },
          { label: "Atividades", value: "Busco livros de atividades/colorir" },
          { label: "Bíblico", value: "Tenho interesse em temas bíblicos" },
          { label: "Me surpreenda", value: "Pode me mostrar os destaques" }
        ];
      }

      // AQUI ADICIONAMOS A RESPOSTA COM OS DADOS (LIVROS)
      setMessages((prev) => [...prev, { 
        role: 'Cira IA', 
        content: responseContent, 
        dados: data.dados, // Aqui é onde os livros entram
        tipo: data.tipo,
        options: responseOptions
      }]);
    } catch (error) {
      console.error("Erro na API:", error);
      setMessages((prev) => [...prev, { 
        role: 'Cira IA', 
        content: "Ops! Tive um pequeno problema de conexão ou não entendi bem. Poderia tentar perguntar novamente? 😓",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#87CEEB] relative overflow-hidden">
      {cupom && <CouponModal code={cupom} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} theme={theme} />}
      
      <BookDetailsModal 
        book={selectedBook} 
        isOpen={!!selectedBook} 
        onClose={() => setSelectedBook(null)} 
        onConfirm={addToCart}
        onAnalytics={trackEvent}
        theme={theme}
      />
      <CartModal 
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        userPhone={userPhone}
        sessionId={sessionId}
        userName={userName}
        onAnalytics={trackEvent}
        theme={theme}
      />

      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${eventoId === 'bett_brasil' ? bgChatBett : bgChat})`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />

      <header className="relative z-10 bg-white/90 backdrop-blur-md p-4 flex justify-between items-center shadow-sm" style={{ borderBottomColor: `${theme.primaryColor}20`, borderBottomWidth: '1px' }}>
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="mr-1 p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <img src={iconeEscola} alt="Escola" className="h-12 w-auto" />
          <div>
            <h1 className="font-black text-lg text-gray-800 leading-none">Ciranda na Escola</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {initialMode === 'stock' ? 'Consulta de Estoque' : 'Recomendador Literário'}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors relative" title="Carrinho">
            <ShoppingCart size={20} />
            {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">{cart.reduce((acc, item) => acc + (item.quantity || 1), 0)}</span>}
          </button>
          <button onClick={handleResetChat} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Novo Chat">
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <main className={`relative z-10 flex-1 overflow-y-auto p-4 space-y-6 ${cart.length > 0 ? 'mb-[7vh]' : ''}`}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            ref={idx === messages.length - 1 ? lastMessageRef : null}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] p-5 rounded-[24px] shadow-lg rounded-tl-none border border-white/40 ${
              msg.role === 'user' ? 'text-white rounded-tr-none' : 'bg-white/95 text-gray-800'
            }`}
            style={msg.role === 'user' ? { backgroundColor: theme.primaryColor } : {}}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {userName && msg.content.toLowerCase().includes(userName.toLowerCase()) ? (
                  msg.content.split(new RegExp(`(\\b${userName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b)`, 'gi')).map((part, i) => (
                    <React.Fragment key={i}>
                      {part.toLowerCase() === userName.toLowerCase() ? (
                        <strong className='font-black' style={msg.role === 'user' ? {} : { color: theme.primaryColor }}>{part}</strong>
                      ) : (
                        part
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  msg.content
                )}
              </p>

              {/* BOTÕES DE OPÇÕES (IDADE / TEMAS) */}
              {msg.options && msg.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {msg.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSend(opt.value)} // Envia o valor do botão para a API
                      className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 border"
                      style={{ 
                        backgroundColor: `${theme.primaryColor}15`,
                        color: theme.primaryColor,
                        borderColor: `${theme.primaryColor}30`
                      }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = theme.primaryColor; e.target.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = `${theme.primaryColor}15`; e.target.style.color = theme.primaryColor; }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* BOTÃO DO CUPOM */}
              {msg.hasCupom && (
                <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full text-white p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-all" style={{ background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})` }}>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg"><Ticket size={20} /></div>
                    <div className="flex flex-col items-start">
                      <span className="font-black text-sm uppercase">{cupom}</span>
                      <span className="text-[10px] font-medium opacity-90">Clique para pegar o código de resgate</span>
                    </div>
                  </div>
                  <Sparkles size={18} className="animate-bounce" />
                </button>
              )}

              {msg.dados && msg.dados.length > 0 && (
                <div className="grid grid-cols-1 gap-3 mt-4">
                  {msg.dados.map((item, iIdx) => {
                    const stockInfo = formatStockDisplay(item.estoque_eventos);
                    return (
                    <div key={iIdx} className={`rounded-xl overflow-hidden flex shadow-sm transition-all ${stockInfo.status ? getStockCardStyle(stockInfo.status) : 'bg-white/95 border'}`} style={!stockInfo.status ? { borderColor: `${theme.primaryColor}30` } : {}}>
                      <div className="w-24 min-w-[96px] bg-gray-300 flex items-center justify-center overflow-hidden">
                        {item.capa_url && (
                          <img 
                            src={item.capa_url} 
                            alt={item.titulo} 
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>

                      <div className="p-3 flex flex-col flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-[12px] line-clamp-1 leading-tight mb-1">
                          {item.titulo}
                        </h4>
                        
                        <div className="mb-2">
                           {stockInfo.status === 'available_here' && (
                             <div className="text-[9px] font-bold text-green-700 bg-green-100 inline-block px-1.5 py-0.5 rounded mb-1">
                               {item.estoque_eventos?.length === 1 
                                 ? `${String(item.estoque_eventos[0].nome_evento || '').split('-')[0].trim()}`
                                 : `Disponível em ${item.estoque_eventos?.length || 0} evento(s)`
                               }
                             </div>
                           )}
                           {stockInfo.status === 'unavailable' && (
                             <p className="text-[10px] font-black text-red-700 uppercase bg-red-100 inline-block px-1 rounded">Fora de estoque</p>
                           )}
                           <p className="text-[9px] text-gray-400 mb-1 ml-1 font-bold">ISBN: {item.barras}</p>
                        </div>

                        
                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-snug mb-2">
                          {item.sinopse || "Explore esta incrível obra da Ciranda Cultural."}
                        </p>

                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-sm font-black" style={{ color: theme.primaryColor }}>
                            R$ {item.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          
                          <div className="flex gap-1.5">
                            {/* Botão de Detalhes do Livro */}
                            <button 
                              onClick={() => handleBookSelection(item)} 
                              className="px-2 py-2 rounded-lg shadow-sm active:scale-90 transition-all flex items-center gap-1"
                              style={{ 
                                backgroundColor: `${theme.primaryColor}15`,
                                color: theme.primaryColor
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = `${theme.primaryColor}30`}
                              onMouseLeave={(e) => e.target.style.backgroundColor = `${theme.primaryColor}15`}
                              title="Ver detalhes"
                            >
                              <Eye size={14} />
                              <span className="text-[10px] font-black uppercase tracking-wide">DETALHE</span>
                            </button>

                            {/* Botão de Adicionar ao Carrinho Direto */}
                            <button 
                              onClick={() => addToCart(item)} 
                              className="p-2 text-white rounded-lg shadow-sm active:scale-90 transition-all"
                              style={{ backgroundColor: theme.primaryColor }}
                              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                              onMouseLeave={(e) => e.target.style.opacity = '1'}
                              title="Adicionar ao Carrinho"
                            >
                              <ShoppingCart size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-sm border border-white/40">
              <Loader2 className="animate-spin" size={16} style={{ color: theme.primaryColor }} />
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Cira está selecionando...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      <div className="relative z-20">
      <CartDrawer cart={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onClear={clearCart} userPhone={userPhone} sessionId={sessionId} userName={userName} onAnalytics={trackEvent} theme={theme} />
      <footer className="relative z-10 p-4 bg-white/80 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          
          {/* CONTROLES DE ESTOQUE (Se ativo) */}
          {initialMode === 'stock' && (
            <div className="w-full flex flex-col gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
               <div className="flex items-center gap-2 pl-1">
                 <input
                   type="checkbox"
                   id="footerBoothFilter"
                   checked={stockOnlyBooth}
                   onChange={(e) => setStockOnlyBooth(e.target.checked)}
                   className="rounded w-4 h-4 cursor-pointer"
                   style={{ accentColor: theme.primaryColor }}
                 />
                 <label htmlFor="footerBoothFilter" className="text-xs text-slate-700 cursor-pointer select-none font-bold flex items-center gap-1">
                   Apenas neste estande <span className="text-[10px] font-normal bg-pink-100 text-pink-700 px-1 rounded uppercase tracking-wider">{idEstande}</span>
                 </label>
               </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button onClick={() => handleSend()} disabled={loading} className="text-white p-4 rounded-2xl shadow-lg active:scale-90 disabled:opacity-50 transition-all" style={{ backgroundColor: theme.primaryColor }}>
              {initialMode === 'stock' ? <Search size={22} /> : <Send size={22} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-white rounded-2xl px-5 py-4 text-base outline-none shadow-sm border focus:ring-4 transition-all"
              style={{
                borderColor: `${theme.primaryColor}30`,
                '--tw-ring-color': `${theme.primaryColor}20`
              }}
              placeholder={initialMode === 'stock' ? "Busque por título, autor ou ISBN..." : "Qual livro vamos encontrar hoje?"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}