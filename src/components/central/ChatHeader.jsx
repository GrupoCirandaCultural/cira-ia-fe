import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, MoreVertical, History, LogOut } from 'lucide-react';

export default function ChatHeader({ cartCount, onBack, onExit }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center gap-2 px-3 py-3 bg-[var(--background)] border-b border-[var(--border)]">
      <button
        type="button"
        aria-label="Voltar"
        onClick={onBack}
        className="w-11 h-11 -ml-1 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] shrink-0"
      >
        <ArrowLeft size={20} aria-hidden="true" />
      </button>

      <div
        className="w-9 h-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <span className="font-editorial text-base font-semibold">C</span>
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="font-editorial text-lg font-semibold leading-none text-[var(--foreground)] truncate">
          Cira
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">Assistente literária</p>
      </div>

      <button
        type="button"
        aria-label={`Carrinho, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
        className="relative w-11 h-11 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] shrink-0"
      >
        <ShoppingCart size={20} aria-hidden="true" />
        {cartCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-bold flex items-center justify-center"
            aria-hidden="true"
          >
            {cartCount}
          </span>
        )}
      </button>

      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="Mais opções"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="w-11 h-11 flex items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        >
          <MoreVertical size={20} aria-hidden="true" />
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Fechar menu"
              className="fixed inset-0 z-30 cursor-default"
              onClick={() => setMenuOpen(false)}
            />
            <div
              role="menu"
              className="absolute right-0 top-12 z-40 w-44 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-lg overflow-hidden py-1"
            >
              <button
                role="menuitem"
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--card-foreground)] hover:bg-[var(--accent)] text-left"
              >
                <History size={16} aria-hidden="true" /> Histórico
              </button>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onExit?.();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--card-foreground)] hover:bg-[var(--accent)] text-left"
              >
                <LogOut size={16} aria-hidden="true" /> Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
