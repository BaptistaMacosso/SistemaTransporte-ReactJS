import api from '../api/apiConfig';

export const listarTiposUsuarios = async (token) => {
  const response = await api.get('/viaturatipo/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(response.data?.tipos) ? response.data.tipos : [];
};

export const buscarTipoUsuarioPorId = async (id, token) => {
  const response = await api.get(`/viaturatipo/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const inserirTipoUsuario = async (tipo, token) => {
  const response = await api.post('/viaturatipo/novo', tipo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const editarTipoUsuario = async (id, tipo, token) => {
  const response = await api.put(`/viaturatipo/update/${id}`, tipo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletarTipoUsuario = async (id, token) => {
  await api.delete(`/viaturatipo/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
