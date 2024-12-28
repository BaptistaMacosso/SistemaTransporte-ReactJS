import api from '../api/apiConfig';

/**
 * Lista todos os tipos de viaturas
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de tipos
 */
export const listarViaturaTipo = async(token) =>{
  const response = await api.get('/viaturatipo/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(response.data?.tipos) ? response.data.tipos : [];
};

/**
 * Busca um tipo por ID
 * @param {string} id - ID do tipo
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do tipo
 */
export const buscarViaturaTipoPorId = async(id, token) =>{
  const response = await api.get(`/viaturatipo/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Insere um novo tipo
 * @param {Object} tipo - Dados do tipo a ser inserido
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do tipo criado
 */
export const inserirViaturaTipo = async(tipo, token) =>{
  const response = await api.post('/viaturatipo/novo', tipo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Edita um tipo existente
 * @param {string} id - ID do tipo a ser editado
 * @param {Object} tipo - Dados atualizados do tipo
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do tipo atualizado
 */
export const editarViaturaTipo = async(id, tipo, token) =>{
  const response = await api.put(`/viaturatipo/update/${id}`, tipo, {
    headers: { Authorization: `Bearer ${token}` },
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
  const response =await api.delete(`/viaturatipo/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

