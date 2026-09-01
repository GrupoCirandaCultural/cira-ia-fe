import React, { useEffect, useRef, useState } from 'react';
import '../../styles/central-theme.css';
import api from '../../api';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import SuggestionChips from './SuggestionChips';
import BookCarousel from './BookCarousel';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { MOCK_USER_NAME, THEME_CHIPS, REFINEMENT_CHIPS } from './mockData';

const generateSessionId = () => Math.random().toString(36).substring(7);

const LOW_STOCK_THRESHOLD = 3;
const CONNECTION_ERROR_TEXT =
  'Ops! Tive um pequeno problema de conexão ou não entendi bem. Poderia tentar perguntar novamente?';

function buildWelcomeMessage() {
  return {
    id: 'welcome',
    role: 'ai',
    phase: 'done',
    text: `Olá, ${MOCK_USER_NAME}. Sou a Cira. Diga um título, um autor ou um tema — eu confiro o estoque e o preço na hora.`,
    chips: THEME_CHIPS,
    books: null,
  };
}

// Mapeia o formato de livro retornado por POST /chat (mesmo contrato usado
// em ChatInterface.jsx) para o formato consumido pelo BookCard redesenhado.
function mapApiBook(item, index) {
  const eventos = item.estoque_eventos || [];
  const totalEstoque = eventos.reduce((sum, e) => sum + (Number(e.estoque) || 0), 0);

  let estoqueStatus = 'out';
  let estoqueLabel = 'Fora de estoque';
  if (totalEstoque > 0) {
    estoqueStatus = totalEstoque <= LOW_STOCK_THRESHOLD ? 'low' : 'in';
    estoqueLabel =
      estoqueStatus === 'low'
        ? `Últimas ${totalEstoque} ${totalEstoque === 1 ? 'unidade' : 'unidades'}`
        : 'Em estoque';
  }

  return {
    isbn: item.barras || `sem-isbn-${index}`,
    titulo: item.titulo,
    autor: item.autor || null,
    preco: item.preco_capa,
    capaUrl: item.capa_url || null,
    estoqueStatus,
    estoqueLabel,
    blurb: item.sinopse || 'Explore esta obra da Ciranda Cultural.',
  };
}

export default function CiraCentralChat({ onBack }) {
  const [messages, setMessages] = useState(() => [buildWelcomeMessage()]);
  const [input, setInput] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [cartIsbns, setCartIsbns] = useState([]);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [sessionId] = useState(generateSessionId);

  const idRef = useRef(0);
  const nextId = () => `m-${idRef.current++}`;
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSearchMode = () => {
    setSearchMode((s) => !s);
    setInput('');
  };

  const handleAddToCart = (book) => {
    setCartIsbns((prev) => (prev.includes(book.isbn) ? prev : [...prev, book.isbn]));
  };

  const handleSend = async (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text) return;

    const userMsg = { id: nextId(), role: 'user', phase: 'done', text };
    const aiId = nextId();

    setMessages((prev) => [...prev, userMsg, { id: aiId, role: 'ai', phase: 'typing' }]);
    setInput('');

    try {
      const { data } = await api.post('/chat', { session_id: sessionId, message: text });
      const books = (data.dados || []).map(mapApiBook);
      const result = {
        text: data.texto || 'Encontrei algumas informações para você.',
        books,
        chips: books.length > 0 ? REFINEMENT_CHIPS : null,
      };
      setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, phase: 'done', ...result } : m)));
    } catch (error) {
      console.error('Erro na API:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, phase: 'done', text: CONNECTION_ERROR_TEXT, books: [], chips: null } : m
        )
      );
    }
  };

  const handleChipSelect = (chip) => handleSend(chip.value);

  return (
    <div className="cira-central w-full h-full max-w-[448px] mx-auto flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <ChatHeader cartCount={cartIsbns.length} onBack={onBack} onExit={onBack} />

      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.map((msg) => {
          if (msg.role === 'user') {
            return <MessageBubble key={msg.id} role="user" text={msg.text} />;
          }

          if (msg.phase === 'typing') {
            return <TypingIndicator key={msg.id} />;
          }

          return (
            <div key={msg.id} className="flex flex-col gap-3 items-start">
              <MessageBubble
                role="ai"
                text={msg.text}
                expanded={expandedIds.has(msg.id)}
                onToggleExpand={() => toggleExpand(msg.id)}
              />
              {msg.books && msg.books.length > 0 && (
                <BookCarousel books={msg.books} cartIsbns={cartIsbns} onAdd={handleAddToCart} />
              )}
              {msg.chips && msg.chips.length > 0 && (
                <SuggestionChips
                  chips={msg.chips}
                  onSelect={handleChipSelect}
                  ariaLabel={msg.id === 'welcome' ? 'Temas sugeridos' : 'Refinar recomendação'}
                />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => handleSend()}
        searchMode={searchMode}
        onToggleSearchMode={toggleSearchMode}
        disabled={false}
      />
    </div>
  );
}
