import React, { useState } from 'react';
import { BookOpen, Plus, Check } from 'lucide-react';

const STOCK_BADGE_STYLES = {
  in: 'bg-[var(--stock-in-bg)] text-[var(--stock-in)]',
  low: 'bg-[var(--stock-low-bg)] text-[var(--stock-low)]',
  out: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
};

function formatBRL(value) {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function BookCard({ book, isAdded, onAdd }) {
  const isOut = book.estoqueStatus === 'out';
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {book.capaUrl && !coverFailed ? (
        <img
          src={book.capaUrl}
          alt={`Capa do livro ${book.titulo}`}
          className="w-full aspect-[4/3] object-cover bg-[var(--accent)]"
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={`Capa do livro ${book.titulo}`}
          className="w-full aspect-[4/3] flex items-center justify-center bg-[var(--accent)]"
        >
          <BookOpen size={40} className="text-[var(--primary)]" aria-hidden="true" />
        </div>
      )}

      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <h3 className="font-editorial text-base leading-snug text-[var(--card-foreground)] line-clamp-2">
          {book.titulo}
        </h3>
        {book.autor && <p className="text-sm text-[var(--muted-foreground)] line-clamp-1">{book.autor}</p>}
        <p className="text-lg font-bold text-[var(--foreground)] mt-0.5">{formatBRL(book.preco)}</p>
        <p className="text-[11px] tracking-wide text-[var(--muted-foreground)]">ISBN {book.isbn}</p>
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{book.blurb}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              STOCK_BADGE_STYLES[book.estoqueStatus] || STOCK_BADGE_STYLES.out
            }`}
          >
            {book.estoqueLabel}
          </span>

          <button
            type="button"
            onClick={() => !isAdded && !isOut && onAdd(book)}
            disabled={isOut}
            aria-label={
              isOut
                ? `${book.titulo} fora de estoque`
                : isAdded
                ? `${book.titulo} adicionado ao carrinho`
                : `Adicionar ${book.titulo} ao carrinho`
            }
            className={`h-9 px-3 inline-flex items-center gap-1.5 rounded-full text-xs font-bold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--primary)] disabled:opacity-60 disabled:cursor-not-allowed ${
              isAdded
                ? 'bg-[var(--stock-in-bg)] text-[var(--stock-in)]'
                : 'bg-[var(--primary)] text-[var(--primary-foreground)]'
            }`}
          >
            {isOut ? (
              'Indisponível'
            ) : isAdded ? (
              <>
                <Check size={14} aria-hidden="true" /> Adicionado
              </>
            ) : (
              <>
                <Plus size={14} aria-hidden="true" /> Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
