import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, BookOpen, User, Bot, Loader2 } from 'lucide-react';

// Função utilitária para gerar ID de sessão simples
const generateSessionId = () => Math.random().toString(36).substring(7);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const scrollRef = useRef(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      const botMsg = {
        role: 'Cira IA',
        content: data.texto,
        dados: data.dados, // Aqui virão os livros do SQL
        tipo: data.tipo
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Erro ao chamar API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center gap-2 shadow-sm">
        <div className="bg-blue-600 p-2 rounded-lg">
          <BookOpen className="text-white" size={20} />
        </div>
        <h1 className="font-bold text-xl tracking-tight">Cira IA <span className="text-blue-600">Recomendador</span></h1>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {msg.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
                <span className="text-xs font-semibold uppercase">{msg.role}</span>
              </div>
              <p className="text-sm leading-relaxed">{msg.content}</p>

              {/* Renderização dos Livros (se houver) */}
              {msg.dados && msg.dados.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Dentro do map de msg.dados no seu App.jsx */}
                  {msg.dados.map((livro, lIdx) => (
                    <div key={lIdx} className="bg-white border rounded-xl overflow-hidden flex flex-row hover:shadow-lg transition-all border-gray-100 group">
                      {/* Área da Capa */}
                      <div className="w-24 min-w-[96px] bg-gray-100 flex items-center justify-center overflow-hidden">
                        {livro.capa_url ? (
                          <img 
                            src={livro.capa_url} 
                            alt={livro.titulo}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150x200?text=Sem+Capa'; }}
                          />
                        ) : (
                          <BookOpen className="text-gray-300" />
                        )}
                      </div>

                      {/* Área de Texto */}
                      <div className="p-3 flex flex-col flex-1">
                        <h4 className="font-bold text-blue-900 text-sm line-clamp-2 leading-tight mb-1">
                          {livro.titulo}
                        </h4>
                        <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                          {livro.barras}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-snug">
                          {livro.sinopse}
                        </p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-sm font-bold text-green-600">
                            R$ {livro.preco_capa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <button className="text-[10px] font-bold text-blue-600 hover:underline">
                            VER MAIS
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
            <div className="bg-white border p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={18} />
              <span className="text-sm text-gray-500 italic">Pensando...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            placeholder="Ex: Quero um livro de aventura para 14 anos..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
          >
            <Send size={22} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;