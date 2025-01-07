import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { TextField,Button,Grid2,CircularProgress, Card, Typography, TableContainer, 
  Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton, Dialog, 
  DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, DialogActions,
  TablePagination,
  Stack,
  CardContent
 } from '@mui/material';
import { Add as AddIcon, Check, Edit as EditIcon, Delete as DeleteIcon, AirlineStops } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { listarViatura, inserirViatura, editarViatura, deletarViatura } from '../../services/viaturasService';
import {listarViaturaCategoria} from '../../services/viaturaCategoriaService';
import {listarViaturaTipo} from '../../services/viaturaTipoService';


const Viaturas = () => {
  // Recupera o token do contexto de autenticação ou localStorage
  const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
  const { isAuthenticated, logout  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [viaturaCategoria, setViaturaCategoria] = useState([]);
  const [tipoViatura, setTipoViatura] = useState([]);
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página

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

  // Dados paginados
  const displayedLicencas = viaturasFiltradas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetar para a primeira página
  };

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
        if (response) {
          setViaturas(response);
          setLoading(false);
        } else {
          toast.warn("Nenhuma viatura encontrado ou formato inesperado.");
          setViaturas([]); // Previna erros futuros
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setViaturas([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as viaturas. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      }
  };

  //Salvar Viatura
  const CriarViatura = async() =>{
    try{
      const response = await inserirViatura(novaViatura, token);
      if(response){
        toast.success(response.message);
        fetchViaturas();
      }
      else if(response.status === 400){
        toast.success(response.message);
      }
    }catch(error){
      if(error.status === 400){
        toast.error(error.response.message+"!");
      }else if(error.status === 500){
        toast.error(error.response.message);
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
        if(response){
          toast.success(response.message);
          fetchViaturas();
        }
      }catch(error){
        if(error.status === 404){
          toast.success(error.response.message+"!");
        }else if(error.status === 500){
          toast.error(error.response.message);
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
        if(response){
          toast.success(response.message);
          fetchViaturas();
        }
      }catch(error){
          if (error.status === 404) {
            toast.error(error.response.message);
          } else if (error.status === 500) {
            toast.error(error.response.message);
          } 
      };
      fetchViaturas();
    }
  };

  //Obter Categoria da Viatura
  const listarCategoriaViatura = async() =>{
    try{
      const response = await listarViaturaCategoria(token);
      if (response) {
        setViaturaCategoria(response);
      } else {
        setViaturaCategoria([]); // Previna erros futuros
      }
    }catch(error){
        toast.error('erro: Não foi possível listar a categoria da viatura. Detalhes: '+error);
        setViaturaCategoria([]);
    }
  };

  //Obter Tipo de Viatura
  const listarTipoViatura = async() =>{
    try{
      const response = await listarViaturaTipo(token);
      if (response) {
        setTipoViatura(response);
      } else {
        setTipoViatura([]); // Previna erros futuros
      }
    }catch(error){
        toast.error('erro: Não foi possível listar o tipo da viatura. Detalhes: '+error);
        setTipoViatura([]);
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
        <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
          <Card sx={{ width: '100%', height: 90 }}>
            <CardContent>
              {/* Botão de Adicionar e Campo de Pesquisa */}
                <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                  <TextField
                    label="Buscar por Matrícula"
                    variant="outlined"
                    value={filtro}
                    onChange={handleSearch}
                    sx={{ marginBottom: 2 }}
                  />
                  <Grid2 item xs={12} display="flex" justifyContent="space-between">
                    <Button variant="contained" color='success' marginRight={1} startIcon={<Check />} onClick={()=>navigate('/CheckViatura')}>
                      Realizar Checklist
                    </Button>
                    <Box sx={{ marginLeft: 1 }} />
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                      Nova Viatura
                    </Button>
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          </Stack>
          {/* Modal de Adicionar Nova Viatura */}
            <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEdit ? "Editar Viatura" : "Nova Viatura"}</DialogTitle>
            <DialogContent>
              <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
                <Grid2 container spacing={2}>
                  <Grid2 item size={8}>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Marca"
                      name="viaturaMarca"
                      type="text"
                      fullWidth
                      value={novaViatura.viaturaMarca}
                      onChange={handleChange}
                    />
                  </Grid2>
                  <Grid2 item size={4}>
                    <TextField
                      margin="dense"
                      label="Modelo"
                      name="viaturaModelo"
                      type="text"
                      fullWidth
                      value={novaViatura.viaturaModelo}
                      onChange={handleChange}
                    />
                  </Grid2>
                  <Grid2 item size={8}>
                    <TextField
                      margin="dense"
                      label="Matrícula"
                      name="viaturaMatricula"
                      type="text"
                      fullWidth
                      value={novaViatura.viaturaMatricula}
                      onChange={handleChange}
                    />
                  </Grid2>
                  <Grid2 item size={4}>
                    <TextField
                      margin="dense"
                      label="Ano de Fabrico"
                      name="viaturaAnoFabrica"
                      type="number"
                      fullWidth
                      value={novaViatura.viaturaAnoFabrica}
                      onChange={handleChange}
                    />
                  </Grid2>
                  <Grid2 item size={8}>
                    <TextField
                      margin="dense"
                      label="Combustível"
                      name="viaturaCombustivel"
                      type="text"
                      fullWidth
                      value={novaViatura.viaturaCombustivel}
                      onChange={handleChange}
                    />
                  </Grid2>
                  <Grid2 item size={4}>
                    <TextField
                      margin="dense"
                      label="Viatura Cor"
                      name="viaturaCor"
                      type="text"
                      fullWidth
                      value={novaViatura.viaturaCor}
                      onChange={handleChange}
                    />
                  </Grid2>
                  <Grid2 item size={8}>
                    <TextField
                      margin="dense"
                      label="Quilometragem"
                      name="quilometragem"
                      type="number"
                      fullWidth
                      value={novaViatura.quilometragem}
                      onChange={handleChange}
                    />
                  </Grid2>
                  <Grid2 item size={4}>
                    <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                      <InputLabel id="tipo-select-label">Tipo</InputLabel>
                      <Select
                        labelId="tipo-select-label"
                        name="viaturaTipoId"
                        value={novaViatura.viaturaTipoId}
                        label="Tipo de Viatura"
                        onChange={handleChange}
                      >
                        {tipoViatura.map((tipo) => (
                          <MenuItem key={tipo.id} value={tipo.id}>
                            {tipo.viaturaTipo}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid2>
                  <Grid2 item size={4}>
                    <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                      <InputLabel id="categoria-select-label">Categoria</InputLabel>
                      <Select
                        labelId="categoria-select-label"
                        name="viaturaCategoriaId"
                        value={novaViatura.viaturaCategoriaId}
                        label="Categoria"
                        onChange={handleChange}
                      >
                        {viaturaCategoria.map((categoria) => (
                            console.log(categoria.id),
                          <MenuItem key={categoria.id} value={categoria.id}>
                            {categoria.viaturaCategoria}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid2>
                </Grid2>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleSave} color="primary">
                {isEdit ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogActions>
          </Dialog>
  
          <Box marginBottom={3} />
          {/* Tabela de Viaturas */}
          {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
            <Grid2 item xs={12}>
            <Box marginBottom={2}/>
            <Card>
                <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Viaturas</Typography>
                <TableContainer component={Paper}>
                <Table aria-label="tabela de viaturas">
                    <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Marca</TableCell>
                        <TableCell>Modelo</TableCell>
                        <TableCell>Matrícula</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Combustível</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {viaturasFiltradas?.length > 0 ? (viaturasFiltradas.map((viatura) => {
                        return (
                        <TableRow key={viatura.viaturaId}>
                            <TableCell>{viatura.viaturaId}</TableCell>
                            <TableCell>{viatura.viaturaMarca}</TableCell>
                            <TableCell>{viatura.viaturaModelo}</TableCell>
                            <TableCell>{viatura.viaturaMatricula}</TableCell>
                            <TableCell>{viatura.viaturaCategoria.viaturaCategoria}</TableCell>
                            <TableCell>{viatura.viaturaCombustivel}</TableCell>
                            <TableCell align="center">
                            <Tooltip title="Editar">
                                <IconButton color="primary" onClick={() => handleOpen(viatura)}>
                                <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Atribuir Motorista">
                                <IconButton color="sucess" onClick={() => handleOpen(viatura)}>
                                <AirlineStops />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                                <IconButton color="secondary" onClick={() => excluirViatura(viatura)}>
                                <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            </TableCell>
                        </TableRow>
                        );
                    })
                    ) : (
                        <TableRow>
                        <TableCell colSpan={6} align="center">Nenhuma viatura encontrada.</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={viaturasFiltradas.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Linhas por página"
                />
            </Card>
            </Grid2>
          )} {/*Fim do loading*/ }
        </Box>
      </Box>
    </>
  )
}

export default Viaturas;