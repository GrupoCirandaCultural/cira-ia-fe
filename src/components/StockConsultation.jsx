import React, { useState } from 'react';
import { Search, MapPin, BookOpen, Filter, ArrowLeft } from 'lucide-react';

export default function StockConsultation({ idEstande, onBack }) {
  const [query, setQuery] = useState('');
  const [onlyThisBooth, setOnlyThisBooth] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // MOCK DO BACK-END
  // Essa função simula a chamada que você fará ao servidor.
  // A resposta deve vir com o campo 'status' para definir a cor.
  // status: 'available_here' (verde), 'available_elsewhere' (amarelo), 'unavailable' (vermelho)
  const fetchStock = async (searchTerm, filterBooth) => {
    setLoading(true);
    
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    // DADOS MOCKADOS PARA TESTE
    const mockData = [
      {
        id: 1,
        title: "Dom Casmurro",
        author: "Machado de Assis",
        cover: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 49,90",
        status: "available_here", // VERDE: Disponível neste estande
        location: `Estande ${idEstande === 'geral' ? 'A1' : idEstande}`
      },
      {
        id: 2,
        title: "Memórias Póstumas de Brás Cubas",
        author: "Machado de Assis",
        cover: "https://m.media-amazon.com/images/I/817esPjlwdL._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 55,00",
        status: "available_elsewhere", // AMARELO: Em outro estande
        location: "Estande B15"
      },
      {
        id: 3,
        title: "O Alienista",
        author: "Machado de Assis",
        cover: "https://m.media-amazon.com/images/I/81y8jC5f2VL._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 35,00",
        status: "unavailable", // VERMELHO: Esgotado / Não tem
        location: "Indisponível no evento"
      },
      {
        id: 4,
        title: "Quincas Borba",
        author: "Machado de Assis",
        cover: "https://m.media-amazon.com/images/I/91OplG+6yBL._AC_UF1000,1000_QL80_.jpg",
        price: "R$ 42,90",
        status: "available_here",
        location: `Estande ${idEstande === 'geral' ? 'A1' : idEstande}`
      }
    ];

    // Filtragem simples simulando o back-end
    let filtered = mockData.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterBooth) {
      filtered = filtered.filter(book => book.status === 'available_here');
    }

    setResults(filtered);
    setHasSearched(true);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchStock(query, onlyThisBooth);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available_here':
        return 'bg-green-50 border-green-500 text-green-900';
      case 'available_elsewhere':
        return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'unavailable':
        return 'bg-red-50 border-red-500 text-red-900';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-900';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-pink-600" />
          Consulta de Estoque
        </h1>
      </div>

      {/* Área de Busca */}
      <div className="p-4 bg-white shadow-sm z-10">
        <form onSubmit={handleSearch} className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Título, autor ou ISBN..."
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-pink-500 transition-all outline-none text-slate-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="boothFilter"
              checked={onlyThisBooth}
              onChange={(e) => setOnlyThisBooth(e.target.checked)}
              className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300"
            />
            <label htmlFor="boothFilter" className="text-sm font-medium text-slate-600 select-none cursor-pointer">
              Livros apenas deste estande
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 hover:scale-[1.02] active:scale-95 transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? 'Consultando...' : 'Buscar Livros'}
          </button>
        </form>
      </div>

      {/* Lista de Resultados */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60 mt-10">
            <Search size={64} className="mb-4" />
            <p className="text-center">Digite o nome do livro ou autor<br/>para verificar a disponibilidade.</p>
          </div>
        )}

        {hasSearched && results.length === 0 && !loading && (
          <div className="text-center p-8 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">Nenhum livro encontrado com esses termos.</p>
          </div>
        )}

        {results.map((book) => (
          <div 
            key={book.id}
            className={`p-4 rounded-xl border-l-[6px] shadow-sm flex gap-4 ${getStatusColor(book.status)}`}
          >
            {/* Capa do Livro (Skeleton/Placeholder se não tiver) */}
            <div className="w-20 h-28 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden shadow-inner">
              {book.cover ? (
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <BookOpen size={24} />
                </div>
              )}
            </div>

            {/* Detalhes */}
            <div className="flex flex-col justify-between flex-1 py-1">
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1">{book.title}</h3>
                <p className="text-sm opacity-90 font-medium mb-2">{book.author}</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase tracking-wider opacity-60">Status</span>
                <div className="flex items-center gap-2 font-bold text-sm">
                   {book.status === 'available_here' && (
                     <>
                      <MapPin size={16} /> Disponível aqui
                     </>
                   )}
                   {book.status === 'available_elsewhere' && (
                     <>
                      <MapPin size={16} /> Em outro: {book.location}
                     </>
                   )}
                   {book.status === 'unavailable' && (
                     <>
                      <span className="text-xl leading-none">×</span> Sem estoque
                     </>
                   )}
                </div>
                {book.status !== 'unavailable' && (
                  <p className="text-sm font-bold mt-1 opacity-100">{book.price}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
