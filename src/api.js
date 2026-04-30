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
export const getBookByIsbn = (isbn, idEstande = null) => {
  const params = {};
  if (idEstande && ESTANDE_TO_RPA[idEstande]) {
    params.codigo_loja = ESTANDE_TO_RPA[idEstande];
  }
  return api.get(`/api/books/${isbn}`, { params });
};

export default api;