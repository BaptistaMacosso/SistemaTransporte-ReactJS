// Service para interagir com a API relacionada ao modelo User
import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

export const listarUsuarios = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/usuario/listar`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if(response.data && Array.isArray(response.data.allUsers)){
    return response.data.allUsers;
  }else{
    return [];
  }
};

export const loginUsuario = async (usuario) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, usuario, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const buscarUsuarioPorId = async (userId, token) => {
  const response = await axios.get(`${API_BASE_URL}/usuario/listarPeloId/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const inserirUsuario = async (usuario, token) => {
  const response = await axios.post(`${API_BASE_URL}/usuario/novo`, usuario, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const editarUsuario = async (id, usuario, token) => {
  const response = await axios.put(`${API_BASE_URL}/usuario/update/${id}`, usuario, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deletarUsuario = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/usuario/delete/${id}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
};

