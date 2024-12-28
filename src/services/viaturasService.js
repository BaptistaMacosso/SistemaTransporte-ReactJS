import api from '../api/apiConfig';

/**
 * Lista todas as viaturas
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de viaturas
 */
export const listarViatura = async (token) => {
  const response = await api.get('/viaturas/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(response.data?.viaturas) ? response.data.viaturas : [];
};

/**
 * Busca uma viatura por ID
 * @param {string} id - ID da viatura
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados da viatura
 */
export const buscarViaturaPorId = async (id, token) => {
  const response = await api.get(`/viaturas/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
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
  const response = await api.post('/viaturas/novo', viatura, {
    headers: { Authorization: `Bearer ${token}` },
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
  const response = await api.put(`/viaturas/update/${id}`, viatura, {
    headers: { Authorization: `Bearer ${token}` },
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
    const response = await api.delete(`/viaturas/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
