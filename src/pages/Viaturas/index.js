import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { TextField,Button,Grid2,CircularProgress } from '@mui/material';
import { Add as AddIcon, Check } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { listarViatura, inserirViatura, editarViatura, deletarViatura } from '../../services/viaturasService';
import {listarViaturaCategoria} from '../../services/viaturaCategoriaService';
import {listarViaturaTipo} from '../../services/viaturaTipoService';
import ViaturaDialog from '../../components/Viatura/viaturaDialog';
import ViaturaDatagrid from '../../components/Viatura/viaturaDataGrid';


const Viaturas = () => {
  // Recupera o token do contexto de autenticação ou localStorage
  const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
  const { isAuthenticated, logout  } = useContext(AuthContext);
  const { navigate } = useNavigate();
  const [open, setOpen] = useState(false);
  const [viaturaCategoria, setViaturaCategoria] = useState([]);
  const [tipoViatura, setViaturaTipo] = useState([]);
  const [novaViatura, setNovaViatura] = useState({ 
    viaturaId: null, 
    viaturaTipoId: '',
    viaturaCategoriaId: '',
    viaturaMarca: '',
    viaturaModelo: '',
    viaturaMatricula: '',
    viaturaAnoFabrica: '',
    viaturaCombustivel: '',
    viaturaCor: '',
    quilometragem: ''
  });
  const [filtro, setFiltro] = useState('');
  const [viaturas, setViaturas] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaViatura({ ...novaViatura, [name]: value });
  };

  // Função para abrir o modal para adicionar ou editar
  const handleOpen = (viatura) => {
    if (viatura.viaturaId === undefined) {
      setIsEdit(false);
      setNovaViatura({
        viaturaId: null, 
        viaturaTipoId: viatura.viaturaTipoId || '', 
        viaturaCategoriaId: viatura.viaturaCategoriaId || '', 
        viaturaMarca: viatura.viaturaMarca || '', 
        viaturaModelo: viatura.viaturaModelo || '', 
        viaturaMatricula: viatura.viaturaMatricula || '',
        viaturaAnoFabrica: viatura.viaturaAnoFabrica || '', 
        viaturaCombustivel: viatura.viaturaCombustivel || '', 
        viaturaCor: viatura.viaturaCor || '',
        quilometragem: viatura.quilometragem || ''
      });
    } else {
      setIsEdit(true);
      setNovaViatura({
        viaturaId: viatura.viaturaId, 
        viaturaTipoId: viatura.viaturaTipoId, 
        viaturaCategoriaId: viatura.viaturaCategoriaId, 
        viaturaMarca: viatura.viaturaMarca, 
        viaturaModelo: viatura.viaturaModelo, 
        viaturaMatricula: viatura.viaturaMatricula,
        viaturaAnoFabrica: viatura.viaturaAnoFabrica, 
        viaturaCombustivel: viatura.viaturaCombustivel, 
        viaturaCor: viatura.viaturaCor,
        quilometragem: viatura.quilometragem
      });
    }
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setNovaViatura({ 
      viaturaId: null, 
      viaturaTipoId: '',
      viaturaCategoriaId: '',
      viaturaMarca: '',
      viaturaModelo: '',
      viaturaMatricula: '',
      viaturaAnoFabrica: '',
      viaturaCombustivel: '',
      viaturaCor: '',
      quilometragem: ''
    });
  };

  const handleSearch = (e) => setFiltro(e.target.value);

  const viaturasFiltradas = Array.isArray(viaturas) 
    ? viaturas.filter((carro) => carro.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

  const handleSave = ()=>{
    if(isEdit){ 
      EditarViatura();
      fetchViaturas();
      setIsEdit(false);
      setOpen(false);
    }else{
      CriarViatura();
      fetchViaturas();
      setOpen(false);
    }
  };

  //.....................................API...............................
  //Listar Viaturas
  const fetchViaturas = async() =>{
    try{
      setLoading(true);
      const response = await listarViatura(token);
      console.log(response.data);
      if(response.status === 200){
        setViaturas(response.data.viaturas);
        setLoading(false);
      }else{
        setViaturas([]);
        setLoading(false);
      }
    }catch(error){
        toast.error('erro: Não foi possível carregar a lista de viaturas. Detalhes: '+error);
        setViaturas([]); // Previna erros futuros
    }finally {
      setLoading(false); // Finaliza o carregamento, seja com sucesso ou erro
    };
  };

  //Salvar Viatura
  const CriarViatura = async() =>{
    try{
      const data = await inserirViatura(novaViatura, token);
      if(data.status === 201){
        toast.success(data.data.message);
        fetchViaturas();
      }
      else if(data.status === 400){
        toast.success(data.data.message);
      }
    }catch(error){
      if(error.status === 400){
        toast.error(error.response.data.message+"!");
      }else if(error.status === 500){
        toast.error(error.response.data.message);
      }
    }
    fetchViaturas();
  };

  //Editar Viaturas
  const EditarViatura = async() =>{
    if (!novaViatura.viaturaId) {
      toast.warn('Por favor, selecione uma viatura para editar.');
      return;
    } else {
      try{
        const response = await editarViatura(novaViatura.viaturaId, novaViatura, token);
        if(response.status === 201){
          toast.success(response.data.message);
          fetchViaturas();
        }
      }catch(error){
        if(error.status === 404){
          toast.success(error.response.data.message+"!");
        }else if(error.status === 500){
          toast.error(error.response.data.message);
        }
      }
    }
    fetchViaturas();
  };

  //Excluir Viaturas
  const excluirViatura = async(viatura) =>{
    if(window.confirm('Tem certeza que deseja excluir esta viatura?')){
      try{
        const response = await deletarViatura(viatura.viaturaId, token);
        if(response.status === 200){
          toast.success(response.data.message);
          fetchViaturas();
        }
      }catch(error){
          if (error.status === 404) {
            toast.error(error.response.data.message);
          } else if (error.status === 500) {
            toast.error(error.response.data.message);
          } 
      };
      fetchViaturas();
    }
  };

  //Obter Categoria da Viatura
  const listarCategoriaViatura = async() =>{
    try{
      const response = await listarViaturaCategoria(token);
      if (response.data.viaturaCategoria) {
        setViaturaCategoria(response.data.viaturaCategoria);
        console.log("Obter: "+response.data);
      } else {
        setViaturaCategoria([]); // Previna erros futuros
      }
    }catch(error){
        toast.error('erro: Não foi possível listar a categoria da viatura. Detalhes: '+error);
    }
  };

  //Obter Tipo de Viatura
  const listarTipoViatura = async() =>{
    try{
      const response = await listarViaturaTipo(token);
      if (response.data.viaturatipo) {
        setViaturaTipo(response.data.viaturatipo);
        console.log("Obter Tipo: "+response.data);
      } else {
        setViaturaTipo([]); // Previna erros futuros
      }
    }catch(error){
        toast.error('erro: Não foi possível listar o tipo da viatura. Detalhes: '+error);
        setViaturaTipo([]);
    }
  };

  //Realizar Checklist Viatura
  const checklistViaturas = async() =>{
    try{
      
    }catch(error){
        toast.error('erro: Não foi possível salvar o checklist da viatura. Detalhes: '+error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        logout();
        navigate('/login');
      } else {
        await fetchViaturas();
        await listarCategoriaViatura();
        await listarTipoViatura();
      }
    };
  
    loadData();
  }, [isAuthenticated]);
  
  //.......................................................................

   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }} paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Botão de Adicionar e Campo de Pesquisa */}
          <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              label="Buscar por matrícula"
              variant="outlined"
              value={filtro}
              onChange={handleSearch}
              sx={{ marginBottom: 2 }}
            />
            <Grid2 item xs={12} display="flex" justifyContent="space-between">
              <Button variant="contained" color='success' marginRight={1} startIcon={<Check />} onClick={handleOpen}>
                Realizar Checklist
              </Button>
              <Box sx={{ marginLeft: 1 }} />
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                Nova Viatura
              </Button>
            </Grid2>
          </Grid2>

          {/* Modal de Adicionar Nova Viatura */}
          <ViaturaDialog
            open={open}
            handleClose={handleClose}
            handleSave={handleSave}
            isEdit={isEdit}
            novaViatura={novaViatura}
            handleChange={handleChange}
            tipoViatura={tipoViatura}
            viaturaCategoria={viaturaCategoria}
          />

          <Box marginBottom={3} />
          {/* Tabela de Viaturas */}
          {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
            <ViaturaDatagrid
              viaturasFiltradas={viaturasFiltradas}
              handleOpen={handleOpen}
              excluirViatura={excluirViatura}
            />
          )} {/*Fim do loading*/ }
        </Box>
      </Box>
    </>
  )
}

export default Viaturas;