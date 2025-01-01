import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todas as viaturas
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de viaturas
 */
export const listarViatura = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/viaturas/listar`, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
  });
  if(response.data && Array.isArray(response.data.viaturas)){
    return response.data.viaturas;
  }else{
    return [];
  }
};

/**
 * Busca uma viatura por ID
 * @param {string} id - ID da viatura
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados da viatura
 */
export const buscarViaturaPorId = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/viaturas/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

/**
 * Insere uma nova viatura
 * @param {Object} viatura - Dados da viatura a serem inseridos
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados da viatura criada
 */
export const inserirViatura = async (viatura, token) => {
  const response = await axios.post(`${API_BASE_URL}/viaturas/novo`, viatura, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

/**
 * Edita uma viatura existente
 * @param {string} id - ID da viatura a ser editada
 * @param {Object} viatura - Dados atualizados da viatura
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados da viatura atualizada
 */
export const editarViatura = async (id, viatura, token) => {
  const response = await axios.put(`${API_BASE_URL}/viaturas/update/${id}`, viatura, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};

/**
 * Deleta uma viatura por ID
 * @param {string} id - ID da viatura a ser deletada
 * @param {string} token - Token de autenticação
 * @returns {Promise<void>} - Confirmação da exclusão
 */
export const deletarViatura = async (id, token) => {
    const response = await axios.delete(`${API_BASE_URL}/viaturas/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  return response.data;
};
