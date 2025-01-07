import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

export const listarTipoUsuario = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/usuariotipo/listar`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if(response.data && Array.isArray(response.data.listaUser)){
    return response.data.listaUser;
  }else{
    return [];
  }
};


export const inserirTipoUsuario = async (tipoUsuario, token) => {
  const response = await axios.post(`${API_BASE_URL}/usuariotipo/novo`, tipoUsuario, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deletarTipoUsuario = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/usuariotipo/delete/${id}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
