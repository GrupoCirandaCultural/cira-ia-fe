import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8008',
});

// Método otimizado para busca direta por ISBN
export const getBookByIsbn = (isbn) => api.get(`/api/books/${isbn}`);

export default api;