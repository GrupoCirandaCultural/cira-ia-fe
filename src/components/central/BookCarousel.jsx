import React from 'react';
import BookCard from './BookCard';

export default function BookCarousel({ books = [], cartIsbns = [], onAdd }) {
  if (!books || books.length === 0) return null;

  return (
    <div
      className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1"
      role="list"
      aria-label="Livros recomendados"
    >
      {books.map((book) => (
        <div key={book.isbn} role="listitem" className="w-[17rem] shrink-0 snap-start">
          <BookCard book={book} isAdded={cartIsbns.includes(book.isbn)} onAdd={onAdd} />
        </div>
      ))}
    </div>
  );
}
