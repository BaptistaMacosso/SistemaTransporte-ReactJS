import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

  /**
   * Lista todas as categorias de viaturas
   * @param {string} token - Token de autenticação
   * @returns {Promise<Array>} - Lista de categorias
   */
  export const listarStatusManutencao = async(token) =>{
    const response = await axios.get(`${API_BASE_URL}/statusmanutencao/listar`, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    if(response.data && Array.isArray(response.data.status)){
      return response.data.status;
    }else{
      return [];
    }
  };