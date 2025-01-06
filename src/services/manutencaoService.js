import API_BASE_URL from '../api/apiConfig';
import axios from 'axios';

 /**
   * Cria uma nova manutenção.
   * @param {Object} data - Dados da manutenção a ser criada.
   * @returns {Object} Manutenção criada.
   */
 export const criarManutencao = async (data, token)=> {
    const response = await axios.post(`${API_BASE_URL}/manutencao/novo`, data,{
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
  };

  /**
   * Edita uma manutenção existente.
   * @param {number} id - ID da manutenção a ser editada.
   * @param {Object} manutencao - Dados atualizados da manutenção.
   * @returns {Object} Manutenção atualizada.
   */
  export const editarManutencao = async (id, manutencao, token)=> {
    const response = await axios.put(`${API_BASE_URL}/manutencao/update/${id}`, manutencao,{
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.manutencaoAtualizada;
  };

  /**
   * Lista uma manutenção pelo ID.
   * @param {number} id - ID da manutenção a ser listada.
   * @returns {Object} Dados da manutenção.
   */
  export const listarManutencaoPorId = async(id, token)=> {
    const response = await axios.get(`${API_BASE_URL}/manutencao/listarPeloId/${id}`,{
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.manutencao;
  };

  /**
   * Lista manutenções por matrícula da viatura.
   * @param {number} viaturaId - ID da viatura associada.
   * @returns {Array} Lista de manutenções.
   */
  export const listarManutencaoPorMatricula = async(viaturaMatricula, token)=> {
    const response = await axios.get(`${API_BASE_URL}/manutencao/listarPorMatricula/${viaturaMatricula}`,{
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if(response.data && Array.isArray(response.data.manutencao)){
        return response.data.manutencao;
      }else{
        return [];
      }
  };

  /**
   * Lista todas as manutenções.
   * @returns {Array} Lista de manutenções.
   */
  export const listarManutencao = async(token)=> {
    const response = await axios.get(`${API_BASE_URL}/manutencao/listar`,{
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if(response.data && Array.isArray(response.data.manutencao)){
        return response.data.manutencao;
      }else{
        return [];
      }
  };

  /**
   * Deleta uma manutenção pelo ID.
   * @param {number} id - ID da manutenção a ser deletada.
   * @returns {Object} Dados da manutenção deletada.
   */
  export const deletarManutencao = async (id, token)=> {
    const response = await axios.delete(`${API_BASE_URL}/manutencao/delete/${id}`,{
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
  };

  /**
   * Altera o status de uma manutenção.
   * @param {number} id - ID da manutenção.
   * @param {number} novoStatusId - Novo status da manutenção.
   * @returns {Object} Manutenção com o status atualizado.
   */
  export const alterarManutencaoStatus = async (id, novoStatusId, token)=> {
    const response = await axios.put(`${API_BASE_URL}/manutencao/updateStatus/${id}`, novoStatusId,{
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.manutencaoAtualizada;
  };