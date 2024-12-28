import api from '../api/apiConfig';

/**
 * Lista todos os motoristas cadastrados no sistema.
 * @param {string} token - Token de autenticação do usuário.
 * @returns {Promise<Array>} - Retorna uma lista de motoristas ou um array vazio caso nenhum seja encontrado.
 */
export const listar = async (token) => {
  const response = await api.get('/motorista/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(response.data?.motoristas) ? response.data.motoristas : [];
};

/**
 * Busca os dados de um motorista específico por ID.
 * @param {string} id - ID do motorista a ser buscado.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<Object>} - Dados do motorista correspondente ao ID.
 */
export const buscarPorId = async (id, token) => {
  const response = await api.get(`/motorista/listarPorId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Insere um novo motorista no sistema.
 * @param {Object} motorista - Objeto contendo os dados do motorista a ser criado.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<Object>} - Dados do motorista recém-criado.
 */
export const inserir = async (motorista, token) => {
  const response = await api.post('/motorista/novo', motorista, {
    headers: { Authorization: `Bearer ${token}` },
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
export const editar = async (id, motorista, token) => {
  const response = await api.put(`/motorista/update/${id}`, motorista, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Exclui um motorista específico com base no ID.
 * @param {string} id - ID do motorista a ser excluído.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<void>} - Confirmação de exclusão (não retorna dados).
 */
export const deletar = async (id, token) => {
  const response = await api.delete(`/motorista/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
