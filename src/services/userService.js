// Service para interagir com a API relacionada ao modelo User
import api from '../api/apiConfig';

export const listarUsuarios = async (token) => {
  const response = await api.get('/usuario/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(response.data?.usuarios) ? response.data.usuarios : [];
};

export const loginUsuario = async (usuario) => {
  const response = await api.post('/auth/login', usuario, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const buscarUsuarioPorId = async (id, token) => {
  const response = await api.get(`/usuario/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const inserirUsuario = async (usuario, token) => {
  const response = await api.post('/usuario/novo', usuario, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const editarUsuario = async (id, usuario, token) => {
  const response = await api.put(`/usuario/update/${id}`, usuario, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletarUsuario = async (id, token) => {
  await api.delete(`/usuario/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

