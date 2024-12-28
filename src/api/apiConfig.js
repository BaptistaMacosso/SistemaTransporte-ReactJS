import axios from 'axios';

// URLs base para diferentes ambientes
export const API_BASE_URL = 'https://sistema-transporte-backend.vercel.app/api';
export const API_LOCAL = 'http://localhost:3050/api';

// Configuração padrão do Axios
const api = axios.create({
  baseURL: API_BASE_URL, // Altere para API_LOCAL em ambiente de desenvolvimento, se necessário
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exportação padrão
export default api;