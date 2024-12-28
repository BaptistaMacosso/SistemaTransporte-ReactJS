import api from '../api/apiConfig';

export const listarTipoManutencao = async (token) => {
  const response = await api.get('/tipos-manutencao/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(response.data?.tipos) ? response.data.tipos : [];
};

export const buscarTipoManutencaoPorId = async (id, token) => {
  const response = await api.get(`/tipos-manutencao/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const inserirTipoManutencao = async (tipo, token) => {
  const response = await api.post('/tipos-manutencao/novo', tipo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const editarTipoManutencao = async (id, tipo, token) => {
  const response = await api.put(`/tipos-manutencao/update/${id}`, tipo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletarTipoManutencao = async (id, token) => {
  const response = await api.delete(`/tipos-manutencao/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
