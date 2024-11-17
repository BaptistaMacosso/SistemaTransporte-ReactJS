// client/src/services/api.js
import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:3050/api', // URL da sua API
});

