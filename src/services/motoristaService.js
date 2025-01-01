import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os motoristas cadastrados no sistema.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Array>} - Retorna uma lista de motoristas ou um array vazio caso nenhum seja encontrado.
 */
export const listarMotoristas = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/motoristas/listar`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  if(response.data && Array.isArray(response.data.motoristas)){
    return response.data.motoristas;
  }else{
    return [];
  }
};

/**
 * Busca os dados de um motorista específico por ID.
 * @param {string} id - ID do motorista a ser buscado.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<Object>} - Dados do motorista correspondente ao ID.
 */
export const buscarMotoristaPorId = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/motoristas/listarPorId/${id}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  if(response.data && Array.isArray(response.data.motorista)){
    return response.data.motorista;
  }else{
    return [];
  }
};

/**
 * Insere um novo motorista no sistema.
 * @param {Object} motorista - Objeto contendo os dados do motorista a ser criado.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<Object>} - Dados do motorista recém-criado.
 */
export const inserirMotorista = async (motorista, token) => {
  const response = await axios.post(`${API_BASE_URL}/motoristas/novo`, motorista, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  return response.data;
};

/**
 * Edita um motorista existente com base no ID.
 * @param {string} id - ID do motorista a ser atualizado.
 * @param {Object} motorista - Dados atualizados do motorista.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<Object>} - Dados do motorista atualizado.
 */
export const editarMotorista = async (id, motorista, token) => {
  const response = await axios.put(`${API_BASE_URL}/motoristas/update/${id}`, motorista, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  return response.data;
};

/**
 * Exclui um motorista específico com base no ID.
 * @param {string} id - ID do motorista a ser excluído.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<void>} - Confirmação de exclusão (não retorna dados).
 */
export const deletarMotorista = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/motoristas/delete/${id}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  return response.data;
};
