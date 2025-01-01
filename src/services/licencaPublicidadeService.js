import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os Licença Publicidade
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de Prestadores
 */
export const listarLicencaPublicidades = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/licencapublicidade/listar`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if(response.data && Array.isArray(response.data.licencas)){
      return response.data.licencas;
    }else{
      return [];
    }
};

/**
* Insere um novo Licença Publicidade
* @param {Object} publicidade - Dados do publicidade a ser inserido
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do publicidade criado
*/
export const inserirLicencaPublicidade = async (novaLicencaPublicidade, token) => {
    const response = await axios.post(`${API_BASE_URL}/licencapublicidade/novo`, novaLicencaPublicidade, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json', 
      },
    });
    return response;
};

 /**
* Edita uma publicidade existente
* @param {string} id - ID da publicidade a ser editada
* @param {Object} publicidade - Dados atualizados da publicidade
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados da publicidade atualizada
*/
export const editarLicencaPublicidade = async (id, novaLicencaPublicidade, token) => {
    const response = await axios.put(`${API_BASE_URL}/licencapublicidade/update/${id}`, novaLicencaPublicidade,{
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    return response;
};

  /**
* Deleta publicidade por ID
* @param {Object} id - Dados do publicidade a ser deletado
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do publicidade deletado
*/
export const deletarLicencaPublicidade = async (id, token) => {
  console.log("Codigo recebido: "+id);
    const response = await axios.delete(`${API_BASE_URL}/licencapublicidade/delete/${id}`,{
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    return response;
};