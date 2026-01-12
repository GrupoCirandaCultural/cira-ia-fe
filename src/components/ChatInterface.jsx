import React, { useState, useEffect, useRef } from 'react';
import api, { getBookByIsbn } from '../api';
import { Send, Search, BookOpen, Ticket, ShoppingCart, Loader2, Sparkles, X, Download, Camera, ArrowLeft, RotateCcw, Trash2, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import bgChat from '../assets/background-chat.png';

const generateSessionId = () => Math.random().toString(36).substring(7);

const CouponModal = ({ code, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-2 shadow-inner">
            <Ticket size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-800">Seu Cupom Especial!</h3>
          <p className="text-gray-500 text-sm px-4">Apresente este código no caixa para ganhar um brinde exclusivo.</p>
          
          <div className="w-full bg-gradient-to-r from-pink-500 to-rose-500 p-1 rounded-2xl shadow-lg mt-2">
            <div className="bg-white rounded-xl py-4 border-2 border-dashed border-pink-200 flex flex-col items-center justify-center gap-1">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-[0.2em]">Código</span>
              <span className="text-3xl font-black text-gray-800 tracking-wider font-mono selection:bg-pink-100">{code}</span>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 font-medium pt-2">Válido apenas para hoje. Um uso por pessoa.</p>
        </div>
      </div>
    </div>
  );
};

const BookDetailsModal = ({ book, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !book) return null;

  const isChecking = book.checkingStock;
  const status = book.stockStatus;
  const searchUrl = `https://www.cirandacultural.com.br/busca?busca=${book.barras || book.titulo}`;

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
           
           {/* Overlay de carregamento */}
           {isChecking && (
             <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
               <Loader2 className="animate-spin text-pink-500" size={32} />
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verificando Estoque...</span>
             </div>
           )}
        </div>

        <div className="text-center">
            <h3 className="text-lg font-black text-gray-800 leading-tight mb-1">{book.titulo}</h3>
            {book.preco_capa && <p className="text-xl font-bold text-pink-600">R$ {book.preco_capa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>}
        </div>
        
        <div className="max-h-24 overflow-y-auto text-sm text-gray-600 text-center px-2 scrollbar-thin">
            {book.sinopse}
        </div>

        <div className="pt-2">
            {isChecking ? (
               <p className="text-xs text-center text-gray-400 mb-3 font-medium">Aguarde, verificando disponibilidade...</p>
            ) : status === 'unavailable' ? (
               <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                 <p className="text-sm font-bold text-red-600 mb-1">Esgotado no evento</p>
                 <p className="text-xs text-gray-600 mb-3">Você pode adicionar à lista ou comprar online.</p>
                 
                 <div className="flex flex-col gap-2">
                    <button onClick={() => onConfirm(book)} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                        <ShoppingCart size={18} />
                        Adicionar à Lista
                    </button>
                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3 border border-red-200 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                        <Search size={18} />
                        Comprar no Site
                    </a>
                 </div>
               </div>
            ) : status === 'available_elsewhere' ? (
                <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-xl text-center">
                  <p className="text-sm font-bold text-yellow-700 mb-1">Disponível em Outro Estande</p>
                  <p className="text-xs text-yellow-600 mb-3">Localização: <strong>{book.location || 'Consultar Atendente'}</strong></p>
                  <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                        Agora não
                    </button>
                    <button onClick={() => onConfirm(book)} className="flex-1 py-3 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                        <ShoppingCart size={18} />
                        Eu quero!
                    </button>
                  </div>
                </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-3 bg-green-50 p-2 rounded-lg border border-green-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Disponível no Estande</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                        Talvez depois
                    </button>
                    <button onClick={() => onConfirm(book)} className="flex-1 py-3 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
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

const CartModal = ({ isOpen, onClose, cart, onRemove, userPhone, sessionId }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // null, 'success', 'error'
  
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.preco_capa || 0), 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
        const payload = {
            session_id: sessionId,
            user_phone: userPhone,
            total_price: total,
            items: cart.map(item => ({
                isbn: item.barras,
                title: item.titulo,
                price: item.preco_capa
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
            <div className="flex items-center gap-2 text-pink-600">
                <ShoppingCart size={24} />
                <h2 className="text-xl font-black text-gray-800">Seu Carrinho</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                    <ShoppingCart size={48} className="opacity-20" />
                    <p className="text-center font-medium">Seu carrinho está vazio.<br/>Que tal procurar alguns livros?</p>
                </div>
            ) : (
                cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center">
                        <div className="w-12 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                            {item.capa_url && <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight">{item.titulo}</h4>
                            <p className="text-pink-600 font-bold text-sm mt-1">R$ {item.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
                <span className="text-gray-500 font-medium">Total ({cart.length} itens)</span>
                <span className="text-2xl font-black text-gray-800">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <button 
                disabled={cart.length === 0 || loading}
                className="w-full py-4 bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-green-600"
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

// --- MOCK E FUNÇÕES AUXILIARES DE ESTOQUE ---

const getStockCardStyle = (status) => {
  if (status === 'available_here') return 'border-l-4 border-l-green-500 bg-green-50';
  if (status === 'available_elsewhere') return 'border-l-4 border-l-yellow-500 bg-yellow-50';
  if (status === 'unavailable') return 'border-l-4 border-l-red-500 bg-red-50 opacity-75';
  return 'bg-white/95 border border-pink-100'; // Default do chat normal
};

export default function ChatInterface({ userName, userPhone, cupom, onBack, initialMode = 'chat', idEstande = 'geral' }) { // <--- Função principal começa aqui
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // CART & BOOK DETAILS STATES
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const addToCart = (book) => {
    setCart([...cart, book]);
    setSelectedBook(null);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleBookSelection = async (book) => {
    // 1. Abre o modal imediatamente com estado de 'verificando'
    setSelectedBook({ ...book, checkingStock: true, stockStatus: null });
    
    try {
        let found = null;

        // OTIMIZAÇÃO: Se tiver ISBN/Barras, usa o novo endpoint direto
        if (book.barras) {
            const { data } = await getBookByIsbn(book.barras);
            found = data; 
        } else {
            // BACKUP: Busca textual antiga
            const term = book.titulo;
            const { data } = await api.get('/api/books/search', { 
              params: { q: term } 
            });
            
            // Tenta match pelo título
            found = data.find(b => 
              b.title.toLowerCase().trim() === book.titulo.toLowerCase().trim()
            );
        }

        // 4. Atualiza o modal com o resultado real
        if (found) {
           setSelectedBook(prev => ({
               ...prev,
               stockStatus: found.status,
               location: found.location_hint, // <--- Importante: Pega a localização da API
               checkingStock: false
           }));
        } else {
           // Se não achou na busca, assume indisponível
           setSelectedBook(prev => ({
               ...prev,
               stockStatus: 'unavailable',
               checkingStock: false
           }));
        }
    } catch (error) {
        console.error("Erro ao checar estoque:", error);
        // Em caso de erro, define como indisponível para não travar
        setSelectedBook(prev => ({
            ...prev,
            stockStatus: 'unavailable',
            checkingStock: false
        }));
    }
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
        content: `Olá ${userName}! Estou pronta para consultar nosso estoque. 📚\n\nUse os filtros abaixo ou digite o nome do livro.`
      });
    } else {
      msgs.push({
        role: 'Cira IA',
        content: cupom 
          ? `Comece digitando algo, ou selecione a idade do leitor para eu te indicar o livro perfeito!`
          : `Olá ${userName}! Que alegria ter você aqui. 🐑💖\n\nSou a Cira, sua curadora. Para eu te dar as melhores dicas, qual a idade do leitor hoje?`,
        options: ageOptions
      });
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
    }

    let apiMessage = messageToSend;
    // if (currentAge && !isAgeSelection) {
    //   apiMessage += ` [Contexto: O usuário já informou a faixa etária: ${currentAge}. Não pergunte a idade novamente, apenas recomende livros.]`;
    // }

    try {
      const { data } = await api.post('/chat', {
        session_id: sessionId, message: apiMessage,
      });
      
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
      {cupom && <CouponModal code={cupom} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      
      <BookDetailsModal 
        book={selectedBook} 
        isOpen={!!selectedBook} 
        onClose={() => setSelectedBook(null)} 
        onConfirm={addToCart}
      />
      <CartModal 
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemove={removeFromCart}
        userPhone={userPhone}
        sessionId={sessionId}
      />

      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${bgChat})`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />

      <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-pink-100 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="mr-1 p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="bg-pink-500 p-2 rounded-xl text-white shadow-lg"><BookOpen size={20} /></div>
          <div>
            <h1 className="font-black text-lg text-gray-800 leading-none">Cira IA</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {initialMode === 'stock' ? 'Consulta de Estoque' : 'Recomendador Literário'}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors relative" title="Carrinho">
            <ShoppingCart size={20} />
            {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">{cart.length}</span>}
          </button>
          <button onClick={handleResetChat} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Novo Chat">
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            ref={idx === messages.length - 1 ? lastMessageRef : null}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] p-5 rounded-[24px] shadow-lg ${
              msg.role === 'user' ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white/95 text-gray-800 rounded-tl-none border border-white/40'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {userName && msg.content.includes(userName) ? (
                  msg.content.split(userName).map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <strong className={msg.role === 'user' ? 'font-black' : 'font-black text-pink-500'}>{userName}</strong>}
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
                      className="bg-pink-50 hover:bg-pink-500 hover:text-white text-pink-600 border border-pink-200 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* BOTÃO DO CUPOM */}
              {msg.hasCupom && (
                <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-all">
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
                  {msg.dados.map((item, iIdx) => (
                    <div key={iIdx} className={`rounded-xl overflow-hidden flex shadow-sm transition-all ${item.status ? getStockCardStyle(item.status) : 'bg-white/95 border border-pink-100'}`}>
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
                           {item.status === 'available_here' && <p className="text-[10px] font-black text-green-700 uppercase bg-green-100 inline-block px-1 rounded">Disponível Aqui</p>}
                           {item.status === 'available_elsewhere' && <p className="text-[10px] font-black text-yellow-700 uppercase bg-yellow-100 inline-block px-1 rounded">{item.location}</p>}
                           {item.status === 'unavailable' && <p className="text-[10px] font-black text-red-700 uppercase bg-red-100 inline-block px-1 rounded">Esgotado</p>}
                           <p className="text-[9px] text-gray-400 mb-1 ml-1 font-bold">ISBN: {item.barras}</p>
                        </div>

                        
                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-snug mb-2">
                          {item.sinopse || "Explore esta incrível obra da Ciranda Cultural."}
                        </p>

                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-sm font-black text-pink-600">
                            R$ {item.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <button onClick={() => handleBookSelection(item)} className="p-2 bg-pink-500 text-white rounded-lg shadow-sm active:scale-90 transition-transform">
                            <ShoppingCart size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-sm border border-white/40">
              <Loader2 className="animate-spin text-pink-500" size={16} />
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Cira está selecionando...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      <footer className="relative z-10 p-4 bg-white/80 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          
          {/* CONTROLES DE ESTOQUE (Se ativo) */}
          {initialMode === 'stock' && (
            <div className="w-full flex flex-col gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
               <div 
                 ref={filtersRef}
                 onMouseDown={startDragging}
                 onMouseLeave={stopDragging}
                 onMouseUp={stopDragging}
                 onMouseMove={onDrag}
                 className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
               >
                 {genres.length === 0 && <span className="text-xs text-gray-400 p-2">Carregando filtros...</span>}
                 {genres.map(genre => {
                   const isSelected = stockFilterGenre === genre.nome;
                   return (
                    <button 
                      key={genre.id}
                      type="button"
                      // Se estiver arrastando (flag isDragging.current true), não executa o filtro
                      onClick={(e) => {
                         if (isDragging.current) {
                           e.preventDefault();
                           e.stopPropagation();
                           return;
                         }
                         setStockFilterGenre(prev => prev === genre.nome ? null : genre.nome);
                         // Foca no input para abrir o teclado no mobile e facilitar a busca
                         setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className={`px-3 py-1 font-bold text-[10px] uppercase tracking-wide rounded-full whitespace-nowrap transition-colors border shadow-sm ${
                        isSelected 
                          ? 'bg-pink-600 text-white border-pink-600 ring-2 ring-pink-200' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      {genre.nome}
                    </button>
                 )})}
               </div>
               <div className="flex items-center gap-2 pl-1">
                 <input
                   type="checkbox"
                   id="footerBoothFilter"
                   checked={stockOnlyBooth}
                   onChange={(e) => setStockOnlyBooth(e.target.checked)}
                   className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                 />
                 <label htmlFor="footerBoothFilter" className="text-xs text-slate-700 cursor-pointer select-none font-bold flex items-center gap-1">
                   Apenas neste estande <span className="text-[10px] font-normal bg-pink-100 text-pink-700 px-1 rounded uppercase tracking-wider">{idEstande}</span>
                 </label>
               </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button onClick={() => handleSend()} disabled={loading} className="bg-pink-500 text-white p-4 rounded-2xl shadow-lg active:scale-90 disabled:opacity-50 transition-all">
              {initialMode === 'stock' ? <Search size={22} /> : <Send size={22} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-white border border-pink-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-pink-100 outline-none shadow-sm"
              placeholder={initialMode === 'stock' ? "Busque por título, autor ou ISBN..." : "Qual livro vamos encontrar hoje?"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}