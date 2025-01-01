import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os Prestadores
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de Prestadores
 */
  export const listarPrestadores = async (token) => {
      const response = await axios.get(`${API_BASE_URL}/prestadores/listar`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if(response.data && Array.isArray(response.data.prestadores)){
        return response.data.prestadores;
      }else{
        return [];
      }
  };

  /**
 * Insere um novo Prestador
 * @param {Object} prestador - Dados do prestador a ser inserido
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do prestador criado
 */
  export const inserirPrestador = async (novaPrestador, token) => {
      const response = await axios.post(`${API_BASE_URL}/prestadores/novo`, novaPrestador, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json', 
        },
      });
      return response;
  };

   /**
 * Edita uma prestador existente
 * @param {string} id - ID da prestador a ser editada
 * @param {Object} prestador - Dados atualizados da prestador
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados da prestador atualizada
 */
  export const editarPrestador = async (id, prestador, token) => {
      const response = await axios.put(`${API_BASE_URL}/prestadores/update/${id}`, prestador,{
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
      });
      return response;
  };

    /**
 * Deleta Prestador por ID
 * @param {Object} id - Dados do prestador a ser deletado
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do prestador deletado
 */
  export const deletarPrestador = async (id, token) => {
      const response = await axios.delete(`${API_BASE_URL}/prestadores/delete/${id}`,{
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
      });
      return response;
  };