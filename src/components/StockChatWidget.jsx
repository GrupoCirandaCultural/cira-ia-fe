import React, { useState } from 'react';
import { Search, MapPin, XCircle } from 'lucide-react';

export default function StockChatWidget({ idEstande = 'geral' }) {
  const [query, setQuery] = useState('');
  const [onlyThisBooth, setOnlyThisBooth] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filtros rápidos
  const QUICK_FILTERS = ["Infantil", "Romance", "Terror", "Autoajuda", "HQ"];

  const fetchStock = async (term, genre, booth) => {
    setLoading(true);
    
    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // DADOS MOCKADOS (Enriquecidos com Gênero para teste)
    const mockData = [
      {
        id: 1, title: "Dom Casmurro", author: "Machado de Assis", genre: "Romance",
        cover: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 49,90", status: "available_here", location: `Estande ${idEstande}`
      },
      {
        id: 2, title: "Memórias Póstumas", author: "Machado de Assis", genre: "Romance",
        cover: "https://m.media-amazon.com/images/I/817esPjlwdL._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 55,00", status: "available_elsewhere", location: "Estande B15"
      },
      {
        id: 3, title: "O Alienista", author: "Machado de Assis", genre: "Romance",
        cover: null, price: "R$ 35,00", status: "unavailable", location: "Indisponível"
      },
      {
        id: 4, title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", genre: "Infantil",
        cover: "https://m.media-amazon.com/images/I/71On+S-u+3L._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 29,90", status: "available_here", location: `Estande ${idEstande}`
      },
      {
        id: 5, title: "Turma da Mônica", author: "Mauricio de Sousa", genre: "HQ",
        cover: "https://m.media-amazon.com/images/I/91+1XX-8G-L._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 15,90", status: "available_here", location: `Estande ${idEstande}`
      }
    ];

    let filtered = mockData;

    // 1. Filtro por Título/Autor
    if (term) {
      const t = term.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(t) ||
        b.author.toLowerCase().includes(t)
      );
    }

    // 2. Filtro por Gênero (Exato)
    if (genre) {
      filtered = filtered.filter(b => b.genre && b.genre.toLowerCase() === genre.toLowerCase());
    }

    // 3. Filtro por Estande
    if (booth) {
      filtered = filtered.filter(b => b.status === 'available_here');
    }

    setResults(filtered);
    setHasSearched(true);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStock(query, selectedGenre, onlyThisBooth);
  };

  const handleFilterClick = (filter) => {
    const newGenre = selectedGenre === filter ? null : filter;
    setSelectedGenre(newGenre);
    fetchStock(query, newGenre, onlyThisBooth);
  };

  // Funções auxiliares de estilo (Compactas)
  const getStatusStyle = (status) => {
    if (status === 'available_here') return 'border-l-4 border-green-500 bg-green-50/50';
    if (status === 'available_elsewhere') return 'border-l-4 border-yellow-500 bg-yellow-50/50';
    return 'border-l-4 border-red-500 bg-red-50/50';
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden my-2">
      {/* Header do Widget */}
      <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Search size={12} /> Consulta Rápida
        </span>
      </div>

      {/* Corpo do Buscador */}
      <div className="p-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Livro ou autor..."
              className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"/> : <Search size={20} />}
            </button>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1">
            {QUICK_FILTERS.map(filter => {
              const isSelected = selectedGenre === filter;
              return (
               <button 
                 key={filter}
                 type="button"
                 onClick={() => handleFilterClick(filter)}
                 className={`px-3 py-1 font-medium text-[10px] uppercase tracking-wide rounded-full whitespace-nowrap transition-colors border ${
                   isSelected 
                     ? 'bg-pink-600 text-white border-pink-600' 
                     : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-pink-100 hover:text-pink-600'
                 }`}
               >
                 {filter}
               </button>
            )})}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="chatBoothFilter"
              checked={onlyThisBooth}
              onChange={(e) => setOnlyThisBooth(e.target.checked)}
              className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
            />
            <label htmlFor="chatBoothFilter" className="text-xs text-slate-600 cursor-pointer select-none font-medium">
              Apenas neste estande
            </label>
          </div>
        </form>

        {/* Lista de Resultados (Scrollável dentro do card) */}
        {hasSearched && (
          <div className="mt-3 flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {results.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-2">Nada encontrado.</p>
            ) : (
              results.map(book => (
                <div key={book.id} className={`p-2 rounded-lg flex gap-3 ${getStatusStyle(book.status)}`}>
                   {/* Mini Capa */}
                   <div className="w-12 h-16 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                     {book.cover ? <img src={book.cover} className="w-full h-full object-cover" alt={book.title}/> : null}
                   </div>
                   
                   {/* Infos */}
                   <div className="flex-1 min-w-0 flex flex-col justify-center">
                     <p className="font-bold text-sm truncate leading-tight">{book.title}</p>
                     <p className="text-xs text-slate-500 truncate mb-1">{book.author}</p>
                     
                     <div className="flex items-center gap-1">
                        {book.status === 'available_here' ? (
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <MapPin size={8} /> Aqui
                          </span>
                        ) : book.status === 'available_elsewhere' ? (
                          <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <MapPin size={8} /> {book.location}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <XCircle size={8} /> Esgotado
                          </span>
                        )}
                        {book.status !== 'unavailable' && <span className="text-xs font-bold ml-auto">{book.price}</span>}
                     </div>
                   </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
