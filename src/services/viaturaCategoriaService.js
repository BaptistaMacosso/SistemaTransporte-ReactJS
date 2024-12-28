import api from '../api/apiConfig';

  /**
   * Lista todas as categorias de viaturas
   * @param {string} token - Token de autenticação
   * @returns {Promise<Array>} - Lista de categorias
   */
  export const listarViaturaCategoria = async(token) =>{
    const response = await api.get('/viaturacategoria/listar', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(response.data?.viaturaCategoria) ? response.data.viaturaCategoria : [];
  };

  /**
   * Busca uma categoria por ID
   * @param {string} id - ID da categoria
   * @param {string} token - Token de autenticação
   * @returns {Promise<Object>} - Dados da categoria
   */
  export const buscarViaturaCategoriaPorId = async(id, token) =>{
    const response = await api.get(`/viaturacategoria/listarPorId/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  /**
   * Insere uma nova categoria
   * @param {Object} categoria - Dados da categoria a serem inseridos
   * @param {string} token - Token de autenticação
   * @returns {Promise<Object>} - Dados da categoria criada
   */
  export const inserirViaturaCategoria = async(categoria, token) =>{
    const response = await api.post('/viaturacategoria/novo', categoria, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  /**
   * Edita uma categoria existente
   * @param {string} id - ID da categoria a ser editada
   * @param {Object} categoria - Dados atualizados da categoria
   * @param {string} token - Token de autenticação
   * @returns {Promise<Object>} - Dados da categoria atualizada
   */
  export const editarViaturaCategoria = async(id, categoria, token) => {
    const response = await api.put(`/viaturacategoria/update/${id}`, categoria, {
      headers: { Authorization: `Bearer ${token}` },
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
    const response = await api.delete(`/viaturacategoria/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

