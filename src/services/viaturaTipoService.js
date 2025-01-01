import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os tipos de viaturas
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de tipos
 */
export const listarViaturaTipo = async(token) =>{
  const response = await axios.get(`${API_BASE_URL}/viaturatipo/listar`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  if(response.data && Array.isArray(response.data.viaturatipo)){
    return response.data.viaturatipo;
  }else{
    return [];
  }
};

/**
 * Insere um novo tipo
 * @param {Object} tipo - Dados do tipo a ser inserido
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do tipo criado
 */
export const inserirViaturaTipo = async(tipo, token) =>{
  const response = await axios.post(`${API_BASE_URL}/viaturatipo/novo`, tipo, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json'
     },
  });
  return response.data;
};

/**
 * Deleta um tipo por ID
 * @param {string} id - ID do tipo a ser deletado
 * @param {string} token - Token de autenticação
 * @returns {Promise<void>} - Confirmação da exclusão
 */
export const deletarViaturaTipo = async(id, token) =>{
  const response =await axios.delete(`${API_BASE_URL}/viaturatipo/delete/${id}`, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
  });
  return response.data;
};

