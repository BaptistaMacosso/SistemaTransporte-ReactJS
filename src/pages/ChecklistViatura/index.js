import React, { useContext, useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { TextField,Button,Grid2,CircularProgress } from '@mui/material';
import ChecklistDialog from '../../components/Checklist/checklistDialog';
import ChecklistDatagrid from '../../components/Checklist/checklistDatagrid';
import { Add as AddIcon } from '@mui/icons-material';
import { listarChecklist, inserirChecklist, deletarChecklist } from '../../services/checklistService';
import {listarTipoManutencao} from '../../services/tipoManutencaoService';
import { listarViatura } from '../../services/viaturasService';
import { AuthContext } from '../../contexts/auth';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckViatura = () => {
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento.
  const [checkViatura, setCheckViatura] = useState([]);
  const [tipoManutencao, setTipoManutencao] = useState([]);
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const [novoCheckViatura, setNovoCheckViatura] = useState({
    id: null, 
    viaturaId: '',
    tipoManutencaoId: '',
    quilometragem: 0,
    itemsVerificados: '',
    observacao: '',
    tecnicoResponsavel: ''
  });
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
  const [viaturas, setViaturas] = useState([]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCheckViatura({ ...novoCheckViatura, [name]: value });
  };
  
  const handleSearch = (e) => setFiltro(e.target.value);

  const checklistViaturaFiltradas = Array.isArray(checkViatura) 
    ? checkViatura.filter((viaturaCheck) => viaturaCheck.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

  // Função para abrir o modal para adicionar ou editar
  const handleOpen = (check) => {
    if (check.id === undefined) {
      setIsEdit(false);
      setNovoCheckViatura({ 
        id: null, 
        viaturaId: novoCheckViatura.viaturaId,
        tipoManutencaoId: novoCheckViatura.tipoManutencaoId,
        quilometragem: parseFloat(novoCheckViatura.quilometragem),
        itemsVerificados: novoCheckViatura.itemsVerificados,
        observacao: novoCheckViatura.observacao,
        tecnicoResponsavel: novoCheckViatura.tecnicoResponsavel
      });
    } 
    setOpen(true);
  };

  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
    setNovoCheckViatura({ id: null, viaturaId: '', tipoManutencaoId: '', quilometragem: 0, itemsVerificados: '', observacao: '', tecnicoResponsavel: ''});
  }
    //................................API.............................
   
    //Deletar Checklist
    const handleDelete = async (checkViatura) => {   
      try {
        if (window.confirm('Tem certeza que deseja excluir este verificação?')) {
          const response = await deletarChecklist(checkViatura.id, token);
          if(response.status === 201){
            toast.success(response.data.message);
            listagemCheckListViaturas();
          }
        };
      } catch (error) {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);       
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message); 
        }
      }
    };

    //Criar Checklist
    const handleSave = async () =>{
      if (isEdit) {
        //Editar
        handleClose();
        listagemCheckListViaturas();
      } else {
        //Salvar
        try {
          const response = await inserirChecklist(novoCheckViatura, token);
          if(response.status === 201){
            toast.success("Verificação criado com sucesso!");
            listagemCheckListViaturas();
          }
          handleClose();
        } catch (error) {
          if(error.response.status === 500){
            toast.error(error.response.data.message);
          }else if(error.response.status === 400){
            toast.error(error.response.data.message);
          }
        };
      }
    };

    //Listagem de checklist de viaturas
    const listagemCheckListViaturas = async () =>{
      setLoading(true);
      try {
        const response = await listarChecklist(token);
        if (response.data.checklist) {
          setCheckViatura(response.data.checklist);
        } else {
          setCheckViatura([]); // Previna erros futuros
        }
        setLoading(false);
      } catch (error) {
        setCheckViatura([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as viaturas. Detalhes: "+error);
      }
    };

    //Listagem Tipo de Manutenção
    const listagemTipoManutencao = async () =>{
      try {
        const response = await listarTipoManutencao(token);

        if (Array.isArray(response.data.tipos)) {
          setTipoManutencao(response.data.tipos);
        } else {
          setTipoManutencao([]); // Previna erros futuros
        }
      } catch (error) {
        setTipoManutencao([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar o tipo de manutenção. Detalhes: "+error);
      }
    };

    //Listagem Tipo de Manutenção
    const listagemViaturas = async () =>{
      try {
        const response = await listarViatura(token);
        if (response.data.viaturas) {
          setViaturas(response.data.viaturas);
        } else {
          setViaturas([]); // Previna erros futuros
        }
      } catch (error) {
        setViaturas([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as viaturas. Detalhes: "+error);
      }
    };

    const listagemDados = useCallback(async () => {
      try {
        await Promise.all([
          listagemCheckListViaturas(),
          listagemTipoManutencao(),
          listagemViaturas(),
        ]);
      } catch (error) {
        console.error('Erro ao listar dados:', error);
      }
    }, []);
  
    useEffect(() => {
      if (!isAuthenticated) {
        Logout();
        Navigate('/login');
      } else {
        listagemDados();
      }
    }, [isAuthenticated, Logout, listagemDados]);

  //................................................................
   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }} paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/**/}
          {/* Botão de Adicionar e Campo de Pesquisa */}
          <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              label="Pesquisar por Matrícula"
              variant="outlined"
              value={filtro}
              onChange={handleSearch}
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
              Nova Verificação
            </Button>
          </Grid2>
          <Box marginBottom={3} />
          {/* Tabela de Viaturas */}
          {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
            <ChecklistDatagrid
              checkViaturaFiltradas={checklistViaturaFiltradas}
              handleDelete={handleDelete}
            />
          )} {/*Fim do loading*/ }
        {/* Modal de Adicionar Nova Viatura */}
        <ChecklistDialog
          open={open}
          handleClose={handleClose}
          handleSave={handleSave}
          isEdit={isEdit}
          novoCheckViatura={novoCheckViatura}
          tipoManutencao={tipoManutencao}
          viaturas={viaturas}
          handleChange={handleChange}
        />
        </Box>
      </Box>
    </>
  )
}

export default CheckViatura;