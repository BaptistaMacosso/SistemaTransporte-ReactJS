import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os status de serviço
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de status de serviço
 */
export const listarStatusServico = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/statusservico/listar`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if(response.data && Array.isArray(response.data.statusServico)){
      return response.data.statusServico;
    }else{
      return [];
    }
  };