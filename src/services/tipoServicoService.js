import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os tipos de serviço
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de tipos de servico
 */
export const listarTipoServico = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/tiposervico/listar`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if(response.data && Array.isArray(response.data.tipoServico)){
      return response.data.tipoServico;
    }else{
      return [];
    }
  };