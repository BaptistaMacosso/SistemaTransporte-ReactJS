import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

/**
 * Lista todos os Licença Transporte
 * @param {string} token - Token de autenticação
 * @returns {Promise<Array>} - Lista de Licença Transporte
 */
export const listarLicencaTransporte = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/licencatransportacao/listar`, {
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
* Insere um novo Licença Transporte
* @param {Object} Transporte - Dados do Licença Transporte a ser inserido
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do Licença Transporte criado
*/
export const inserirLicencaTransporte = async (novaLicencaTransporte, token) => {
    const response = await axios.post(`${API_BASE_URL}/licencatransportacao/novo`, novaLicencaTransporte, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json', 
      },
    });
    return response;
};

 /**
* Edita uma Licença Transporte existente
* @param {string} id - ID da Transporte a ser editada
* @param {Object} Transporte - Dados atualizados da Transporte
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados da Transporte atualizada
*/
export const editarLicencaTransporte = async (id, novaLicencaTransporte, token) => {
    const response = await axios.put(`${API_BASE_URL}/licencatransportacao/update/${id}`, novaLicencaTransporte,{
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    return response;
};

  /**
* Deleta Licença Transporte por ID
* @param {Object} id - Dados do Licença Transporte a ser deletado
* @param {string} token - Token de autenticação
* @returns {Promise<Object>} - Dados do Licença Transporte deletado
*/
export const deletarLicencaTransporte = async (id, token) => {
    const response = await axios.delete(`${API_BASE_URL}/licencatransportacao/delete/${id}`,{
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
    });
    return response;
};