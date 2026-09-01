import React from 'react';
import { Search, Send, X } from 'lucide-react';

export default function ChatInput({ value, onChange, onSubmit, searchMode, onToggleSearchMode, disabled }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-2 px-3 py-3 bg-[var(--background)] border-t border-[var(--border)]"
    >
      {!searchMode && (
        <button
          type="button"
          aria-label="Buscar por título, autor ou ISBN"
          onClick={onToggleSearchMode}
          className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        >
          <Search size={20} aria-hidden="true" />
        </button>
      )}

      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={searchMode ? 'Título, autor ou ISBN…' : 'Pergunte à Cira…'}
          aria-label={searchMode ? 'Buscar no catálogo' : 'Escreva sua mensagem para a Cira'}
          className="w-full h-11 rounded-full bg-[var(--card)] border border-[var(--border)] px-4 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        />
        {searchMode && (
          <button
            type="button"
            aria-label="Sair do modo de busca"
            onClick={onToggleSearchMode}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled}
        aria-label={searchMode ? 'Buscar' : 'Enviar mensagem'}
        className="w-11 h-11 shrink-0 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-sm active:scale-95 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
      >
        {searchMode ? <Search size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
      </button>
    </form>
  );
}
