import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, BookOpen, Ticket, ShoppingCart, Loader2, Sparkles, X, Download, Camera, ArrowLeft, RotateCcw } from 'lucide-react';
import bgChat from '../assets/background-chat.png';

const generateSessionId = () => Math.random().toString(36).substring(7);

// --- MODAL DE CUPOM (PARA PRINT) ---
const CouponModal = ({ code, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pink-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-8 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/40"><X size={20} /></button>
          <div className="bg-white w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 rotate-3">
            <Ticket size={32} className="text-pink-500 -rotate-12" />
          </div>
          <h2 className="text-xl font-black italic">SEU PRESENTE!</h2>
        </div>
        <div className="p-8 text-center bg-white">
          <div className="border-4 border-dashed border-pink-100 rounded-2xl py-6 px-4 bg-pink-50/30">
            <span className="text-4xl font-black text-gray-800 tracking-[0.2em] font-mono uppercase">{code} BR403KTJ</span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-pink-600 font-bold animate-pulse">
              <Camera size={18} /> <span className="text-sm">Tire um print da tela!</span>
            </div>
            <button onClick={() => window.print()} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl">
              <Download size={20} /> SALVAR CUPOM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChatInterface({ userName, cupom, onBack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef(null);
  
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
    msgs.push({
      role: 'Cira IA',
      content: cupom 
        ? `Comece digitando algo, ou selecione a idade do leitor para eu te indicar o livro perfeito!`
        : `Olá ${userName}! Que alegria ter você aqui. 🐑💖\n\nSou a Cira, sua curadora. Para eu te dar as melhores dicas, qual a idade do leitor hoje?`,
      options: ageOptions
    });
    return msgs;
  };

  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [selectedAge, setSelectedAge] = useState(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleResetChat = () => {
    setMessages(getInitialMessages());
    setInput('');
    setSessionId(generateSessionId());
    setSelectedAge(null);
  };

  const handleSend = async (overrideMessage = null) => {
    const messageToSend = overrideMessage || input; 
    if (!messageToSend.trim()) return;

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
      const { data } = await axios.post('http://localhost:8008/chat', {
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
          <h1 className="font-black text-lg text-gray-800">Cira IA</h1>
        </div>
        <button onClick={handleResetChat} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Novo Chat">
          <RotateCcw size={20} />
        </button>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-5 rounded-[24px] shadow-lg ${
              msg.role === 'user' ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white/95 text-gray-800 rounded-tl-none border border-white/40'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
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
                    <div key={iIdx} className="bg-white/95 rounded-xl overflow-hidden flex border border-pink-100 hover:shadow-md transition-all">
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
                        <p className="text-[9px] text-gray-400 mb-1 font-bold">ISBN: {item.barras}</p>
                        
                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-snug mb-2">
                          {item.sinopse || "Explore esta incrível obra da Ciranda Cultural."}
                        </p>

                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-sm font-black text-pink-600">
                            R$ {item.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
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
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            className="flex-1 bg-white border border-pink-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-pink-100 outline-none shadow-sm"
            placeholder="Qual livro vamos encontrar hoje?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={loading} className="bg-pink-500 text-white p-4 rounded-2xl shadow-lg active:scale-90 disabled:opacity-50 transition-all">
            <Send size={22} />
          </button>
        </div>
      </footer>
    </div>
  );
}