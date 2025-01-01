import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

export const listarTipoManutencao = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/tipomanutencao/listar`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  console.log("Tipo de manutenção encontrados: "+response.data.tipos);
  return Array.isArray(response.data.tipos) ? response.data.tipos : [];
};

export const buscarTipoManutencaoPorId = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/tipomanutencao/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const inserirTipoManutencao = async (tipo, token) => {
  const response = await axios.post(`${API_BASE_URL}/tipomanutencao/novo`, tipo, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const editarTipoManutencao = async (id, tipo, token) => {
  const response = await axios.put(`${API_BASE_URL}/tipomanutencao/update/${id}`, tipo, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const deletarTipoManutencao = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/tipomanutencao/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};
