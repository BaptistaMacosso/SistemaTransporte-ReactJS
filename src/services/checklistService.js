import api from '../api/apiConfig';

/**
 * Lista todos os checklists
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de checklists
 */
export const listarChecklist = async (token) => {
  const response = await api.get('/checklist/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Dados encontrados: "+response.data.checklist);
  return Array.isArray(response.data?.checklist) ? response.data.checklist : [];
};

/**
 * Busca um checklist por ID
 * @param {string} id - ID do checklist
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do checklist
 */
export const buscarChecklistPorId = async (id, token) => {
  const response = await api.get(`/checklist/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Insere um novo checklist
 * @param {Object} checklist - Dados do checklist a ser inserido
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do checklist criado
 */
export const inserirChecklist = async (checklist, token) => {
  const response = await api.post('/checklist/novo', checklist, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Edita um checklist existente
 * @param {string} id - ID do checklist a ser editado
 * @param {Object} checklist - Dados atualizados do checklist
 * @param {string} token - Token de autenticação
 * @returns {Promise<Object>} - Dados do checklist atualizado
 */
export const editarChecklist = async (id, checklist, token) => {
  const response = await api.put(`/checklist/editar/${id}`, checklist, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Deleta um checklist por ID
 * @param {string} id - ID do checklist a ser deletado
 * @param {string} token - Token de autenticação
 * @returns {Promise<void>} - Confirmação da exclusão
 */
export const deletarChecklist = async (id, token) => {
  const response = await api.delete(`/checklist/deletar/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
