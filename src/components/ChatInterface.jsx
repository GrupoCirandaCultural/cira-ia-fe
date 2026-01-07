import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Send, Search, BookOpen, Ticket, ShoppingCart, Loader2, Sparkles, X, Download, Camera, ArrowLeft, RotateCcw } from 'lucide-react';
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

// --- MOCK E FUNÇÕES AUXILIARES DE ESTOQUE ---

const getStockCardStyle = (status) => {
  if (status === 'available_here') return 'border-l-4 border-l-green-500 bg-green-50';
  if (status === 'available_elsewhere') return 'border-l-4 border-l-yellow-500 bg-yellow-50';
  if (status === 'unavailable') return 'border-l-4 border-l-red-500 bg-red-50 opacity-75';
  return 'bg-white/95 border border-pink-100'; // Default do chat normal
};

export default function ChatInterface({ userName, cupom, onBack, initialMode = 'chat', idEstande = 'geral' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  // Lógica de busca de estoque REAL
  const performStockSearch = async (term, genre, onlyBooth) => {
    setLoading(true);
    
    try {
      // 1. Resolver ID do Gênero (se houver filtro de nome selecionado)
      let genreId = null;
      if (genre) {
        const found = genres.find(g => g.nome === genre);
        if (found) genreId = found.id;
      }

      // 2. Parâmetros da Requisição
      const params = {
        q: term,
        //booth_id: idEstande,
        only_local: onlyBooth,
        genre_id: genreId
      };

      const { data } = await api.get('/api/books/search', { params });
      
      // 3. Mapear resposta para o formato esperado pelo componente
      const results = data.map(book => ({
        titulo: book.title,
        barras: book.isbn,
        sinopse: book.synopsis || `Autor: ${book.author}`, // Fallback se não vier sinopse
        preco_capa: book.price,
        capa_url: book.cover_url,
        genre: book.genre_name, // Opcional, apenas para display se precisar
        status: book.status, 
        location: book.location_hint || (book.status === 'available_here' ? `Estande ${idEstande}` : 'Outro Estande')
      }));

      const responseMsg = results.length > 0 
        ? `Encontrei ${results.length} livros correspondentes:` 
        : `Não encontrei livros com esses critérios.`;

      setMessages(prev => [...prev, {
        role: 'Cira IA',
        content: responseMsg,
        dados: results 
      }]);

    } catch (error) {
      console.error("Erro na busca de estoque:", error);
      setMessages(prev => [...prev, {
        role: 'Cira IA',
        content: "Ops! Não consegui consultar o estoque no momento. Tente novamente em instantes.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (overrideMessage = null) => {
    const messageToSend = overrideMessage || input; 
    
    // Se for modo STOCK e não for mensagem de sistema (override), apenas faz a busca
    if (initialMode === 'stock' && !overrideMessage && !messageToSend.trim() && !stockFilterGenre) return;
    if (initialMode !== 'stock' && !messageToSend.trim()) return;

    if (initialMode === 'stock') {
      // MODO ESTOQUE
      const displayMsg = messageToSend || `Filtro: ${stockFilterGenre || 'Todos'}`;
      setMessages(prev => [...prev, { role: 'user', content: displayMsg }]);
      setInput('');
      // Chama a busca mockada
      performStockSearch(messageToSend, stockFilterGenre, stockOnlyBooth);
      return;
    }

    // MODO CHAT NORMAL (Cira)
    const userMsg = { role: 'user', content: messageToSend };
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
    if (currentAge && !isAgeSelection) {
      apiMessage += ` [Contexto: O usuário já informou a faixa etária: ${currentAge}. Não pergunte a idade novamente, apenas recomende livros.]`;
    }

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
        <button onClick={handleResetChat} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Novo Chat">
          <RotateCcw size={20} />
        </button>
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
                        
                        {/* Exibe Localização se for busca de estoque */}
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
                          {item.status !== 'unavailable' && (
                            <span className="text-sm font-black text-pink-600">
                              R$ {item.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          <button className="p-2 bg-pink-500 text-white rounded-lg shadow-sm active:scale-90 transition-transform">
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
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-white border border-pink-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-pink-100 outline-none shadow-sm"
              placeholder={initialMode === 'stock' ? "Busque por título, autor ou ISBN..." : "Qual livro vamos encontrar hoje?"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={() => handleSend()} disabled={loading} className="bg-pink-500 text-white p-4 rounded-2xl shadow-lg active:scale-90 disabled:opacity-50 transition-all">
              {initialMode === 'stock' ? <Search size={22} /> : <Send size={22} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}