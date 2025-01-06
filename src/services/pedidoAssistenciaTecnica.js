import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';


/**
* Insere um novo Pedido de Assistência Técnica
* @param {Object} Pedido - Dados do pedido de assistência técnica a ser inserido
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do pedido de assistência técnica criado
*/
export const criarPedidosAssistenciaTecnica = async (novoPedido, token) => {
    const response = await axios.post(`${API_BASE_URL}/pedidos/novo`, novoPedido, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json', 
      },
    });
    return response;
};

/**
* Editar um Pedido de Assistência Técnica
* @param {Object} Pedido - Dados do pedido de assistência técnica a ser inserido
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do pedido de assistência técnica editado
*/
export const editarPedidosAssistenciaTecnica = async (id, novoPedido, token) => {
    const response = await axios.put(`${API_BASE_URL}/pedidos/update/${id}`, novoPedido, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json', 
      },
    });
    return response;
};

/**
* Editar um Pedido de Assistência Técnica
* @param {Object} PedidoId - Dados do pedido de assistência técnica a ser inserido
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do pedido de assistência técnica editado
*/
export const alterarStatusPedidosAssistenciaTecnica = async (id, novoStatus, token) => {
    const response = await axios.put(`${API_BASE_URL}/pedidos/updateStatus/${id}`, 
      novoStatus, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json', 
      },
    });
    return response;
};

/**
 * Lista todos os pedidos de assitencia tecnica
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de pedidos
 */
export const listarPedidosAssistenciaTecnica = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/pedidos/listar`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if(response.data && Array.isArray(response.data.pedidos)){
      return response.data.pedidos;
    }else{
      return [];
    }
};

/**
 * Lista todos os pedidos de assitencia tecnica
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de pedidos
 */
export const listarPedidoAssistenciaTecnicaPorId = async (id, token) => {
    const response = await axios.get(`${API_BASE_URL}/pedidos/listarPeloId/${id}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.pedido;
};

/**
* Deleta Pedido de Assistência Técnica por ID
* @param {Object} pedidoId - Dados do pedido de assistência técnica a ser deletado
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do pedido de assistência técnica deletado
*/
export const deletarPedidosAssistenciaTecnica = async (pedidoId, token) => {
      const response = await axios.delete(`${API_BASE_URL}/pedidos/delete/${pedidoId}`,{
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
      });
      return response;
};

  