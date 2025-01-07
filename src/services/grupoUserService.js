import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

export const listarGrupoUsuario = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/grupousuario/listar`, {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
  });
  if(response.data && Array.isArray(response.data.grupoUser)){
    return response.data.grupoUser;
  }else{
    return [];
  }
};


export const inserirGrupoUsuario = async (grupoUsuario, token) => {
  const response = await axios.post(`${API_BASE_URL}/grupousuario/novo`, grupoUsuario, {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
  });
  return response.data;
};

export const deletarGrupoUsuario = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/grupousuario/delete/${id}`, {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
  });
  return response.data;
};