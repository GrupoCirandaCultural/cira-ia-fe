import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, BookOpen, User, Bot, Loader2, Ticket, ShoppingCart } from 'lucide-react';
import bgChat from '../assets/background-chat.png';

const generateSessionId = () => Math.random().toString(36).substring(7);

export default function ChatInterface({ userName, cupom }) {
  const saudacaoInicial = cupom 
    ? `Olá ${userName}! Que alegria ter você aqui. Vi que você ganhou o cupom: **${cupom}**! 🐑💖 Como posso te ajudar a encontrar o livro perfeito hoje?`
    : `Olá ${userName}! Que alegria ter você aqui. 🐑💖 Eu sou a Cira, sua curadora literária. Como posso te ajudar a encontrar o livro ou brinquedo perfeito hoje?`;
  const [messages, setMessages] = useState([
    { role: 'Cira IA', content: saudacaoInicial }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]); // Rola para baixo também quando o loading aparece

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8008/chat', {
        session_id: sessionId,
        message: input,
      });
      setMessages((prev) => [...prev, {
        role: 'Cira IA',
        content: data.texto,
        dados: data.dados, 
        tipo: data.tipo
      }]);
    } catch (error) {
      console.error("Erro na API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#87CEEB] relative overflow-hidden font-sans">
      
      {/* BACKGROUND VERTICAL */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat"
        style={{ 
          backgroundImage: `url(${bgChat})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top' 
        }}
      />

      {/* HEADER CORRIGIDO (TEXTO NA MESMA LINHA) */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-pink-500 p-2 rounded-xl text-white">
            <BookOpen size={20} />
          </div>
          <h1 className="font-black text-lg text-gray-800">
            Cira IA <span className="text-pink-500 font-bold ml-1 text-sm uppercase tracking-widest">Curadoria</span>
          </h1>
        </div>
        {cupom && (
          <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 shadow-lg">
            <Ticket size={12} /> {cupom}
          </div>
        )}
      </header>

      {/* ÁREA DE MENSAGENS */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-pink-500 text-white rounded-tr-none' 
                : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-tl-none border border-white/40'
            }`}>
              <p className="text-sm leading-relaxed mb-2">{msg.content}</p>

              {/* GRID DE PRODUTOS */}
              {msg.dados && msg.dados.length > 0 && (
                <div className="grid grid-cols-1 gap-3 mt-4">
                  {msg.dados.map((item, iIdx) => (
                    <div key={iIdx} className="bg-white/95 rounded-xl overflow-hidden flex border border-pink-100 hover:shadow-md transition-all">
                      <div className="w-24 min-w-[96px] bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.capa_url || 'https://via.placeholder.com/150x200?text=Sem+Capa'} 
                          alt={item.titulo} 
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150x200?text=Sem+Capa'; }}
                        />
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

        {/* INDICADOR DE CARREGAMENTO RESTAURADO */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-white/40">
              <Loader2 className="animate-spin text-pink-500" size={18} />
              <span className="text-xs text-gray-500 font-bold italic">Pensando...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 p-4 bg-white/90 backdrop-blur-md border-t">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-pink-400 outline-none shadow-inner"
            placeholder="O que vamos ler hoje?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend} 
            disabled={loading}
            className="bg-pink-500 text-white p-3 rounded-full shadow-lg active:scale-95 disabled:opacity-50 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}