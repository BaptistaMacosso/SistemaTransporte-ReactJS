import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os checklists
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de checklists
 */
export const listarChecklist = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/checklist/listar`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if(response.data && Array.isArray(response.data.RetornoChecklist)){
    return response.data.RetornoChecklist;
  }else{
    return [];
  }
};

/**
 * Insere um novo checklist
 * @param {Object} checklist - Dados do checklist a ser inserido
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do checklist criado
 */
export const inserirChecklist = async (novaChecklist, token) => {
  const response = await axios.post(`${API_BASE_URL}/checklist/novo`, novaChecklist, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
  });
  return response;
};

/**
 * Deleta um checklist por ID
 * @param {string} id - ID do checklist a ser deletado
 * @param {string} token - Token de autenticação
 * @returns {Promise<void>} - Confirmação da exclusão
 */
export const deletarChecklist = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/checklist/delete/${id}`, {
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    },
  });
  return response;
};
