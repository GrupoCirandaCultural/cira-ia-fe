import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8008',
});

// Mapeamento de ID do estande para código RPA
const ESTANDE_TO_RPA = {
  'estande_azul': '000324',
  'estande_laranja': '000316',
};

// Método otimizado para busca direta por ISBN
export const getBookByIsbn = (isbn, idEstande = null, includeStock = true, stockFilters = {}) => {
  const params = {};
  if (idEstande && ESTANDE_TO_RPA[idEstande]) {
    params.booth_id = ESTANDE_TO_RPA[idEstande];
  }
  params.include_stock = includeStock;
  if (stockFilters.event_codes?.length) {
    params.event_codes = stockFilters.event_codes;
  }
  if (stockFilters.empresa) {
    params.empresa = stockFilters.empresa;
  }
  return api.get(`/api/books/${isbn}`, { params });
};

export const getBookDetails = (isbn) => api.get(`/api/books/${isbn}/details`);

export default api;