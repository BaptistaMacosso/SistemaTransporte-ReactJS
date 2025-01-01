import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

  /**
   * Lista todas as categorias de viaturas
   * @param {string} token - Token de autenticação
   * @returns {Promise<Array>} - Lista de categorias
   */
  export const listarViaturaCategoria = async(token) =>{
    const response = await axios.get(`${API_BASE_URL}/viaturacategoria/listar`, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    if(response.data && Array.isArray(response.data.Categorias)){
      return response.data.Categorias;
    }else{
      return [];
    }
  };

  /**
   * Insere uma nova categoria
   * @param {Object} categoria - Dados da categoria a serem inseridos
   * @param {string} token - Token de autenticação
   * @returns {Promise<Object>} - Dados da categoria criada
   */
  export const inserirViaturaCategoria = async(categoria, token) =>{
    const response = await axios.post(`${API_BASE_URL}/viaturacategoria/novo`, categoria, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
    });
    return response.data;
  };

  /**
   * Deleta uma categoria por ID
   * @param {string} id - ID da categoria a ser deletada
   * @param {string} token - Token de autenticação
   * @returns {Promise<void>} - Confirmação da exclusão
   */
  export const deletarViaturaCategoria = async(id, token) =>{
    const response = await axios.delete(`${API_BASE_URL}/viaturacategoria/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

