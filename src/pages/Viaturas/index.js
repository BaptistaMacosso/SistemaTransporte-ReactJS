import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,
         Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2,
         CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Check, AirlineStops } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Viaturas = () => {
  //
  // Recupera o token do contexto de autenticação ou localStorage
  const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
  const { isAuthenticated, logout  } = useContext(AuthContext);
  const { navigate } = useNavigate();
  const [open, setOpen] = useState(false);
  const [novaViatura, setNovaViatura] = useState({ viaturaId: null, viaturaMarca: '', viaturaModelo: '', viaturaMatricula: '',
                                                   viaturaAnoFabrica: '', viaturaCombustivel: '', viaturaCor: '',
                                                   viaturaNumeroChassi: '', viaturaNumeroLugar: '', viaturaNumeroMotor: '', quilometragem: ''});
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
        viaturaMarca: viatura.viaturaMarca || '', 
        viaturaModelo: viatura.viaturaModelo || '', 
        viaturaMatricula: viatura.viaturaMatricula || '',
        viaturaAnoFabrica: viatura.viaturaAnoFabrica || '', 
        viaturaCombustivel: viatura.viaturaCombustivel || '', 
        viaturaCor: viatura.viaturaCor || '',
        viaturaNumeroChassi: viatura.viaturaNumeroChassi || '', 
        viaturaNumeroLugar: viatura.viaturaNumeroLugar || '', 
        viaturaNumeroMotor: viatura.viaturaNumeroMotor || '', 
        quilometragem: viatura.quilometragem || ''
      });
    } else {
      setIsEdit(true);
      setNovaViatura({
        viaturaId: viatura.viaturaId, 
        viaturaMarca: viatura.viaturaMarca, 
        viaturaModelo: viatura.viaturaModelo, 
        viaturaMatricula: viatura.viaturaMatricula,
        viaturaAnoFabrica: viatura.viaturaAnoFabrica, 
        viaturaCombustivel: viatura.viaturaCombustivel, 
        viaturaCor: viatura.viaturaCor,
        viaturaNumeroChassi: viatura.viaturaNumeroChassi, 
        viaturaNumeroLugar: viatura.viaturaNumeroLugar, 
        viaturaNumeroMotor: viatura.viaturaNumeroMotor, 
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
      viaturaId: null, viaturaMarca: '', viaturaModelo: '', viaturaMatricula: '',
      viaturaAnoFabrica: '', viaturaCombustivel: '', viaturaCor: '',
      viaturaNumeroChassi: '', viaturaNumeroLugar: '', viaturaNumeroMotor: '', quilometragem: '' 
    });
  };

  const handleSearch = (e) => setFiltro(e.target.value);

 /*const viaturasFiltradas = viaturas.filter((carro) =>
    carro.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())
  );*/

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
  useEffect(()=>{
    if(!isAuthenticated){
      logout();
      navigate('/login');
    }
    else{
      fetchViaturas();
    }
  },[isAuthenticated, logout]);
  //Listar Viaturas
  const fetchViaturas = async() =>{
    try{
      setLoading(true);
      const response = await axios.get('sistema-transporte-backend.vercel.app/api/viatura/listar',{
        headers:{
          'Authorization': `Bearer ${token}`,
        }
      });
      // Garanta que 'users' seja um array antes de setá-lo no estado
      if (Array.isArray(response.data.viatura)) {
        setViaturas(response.data.viatura);
        console.log(response.data.viatura);
      } else {
        setViaturas([]); // Previna erros futuros
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
      const response = await axios.post('sistema-transporte-backend.vercel.app/api/viatura/registar',novaViatura,{
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if(response.status === 201){
        toast.success(response.data.message);
      }
      else if(response.status === 400){
        toast.success(response.data.message);
      }
    }catch(error){
      if(error.status === 400){
        toast.success(error.response.data.message+"!");
      }else if(error.status === 500){
        toast.error(error.response.data.message);
      }
    }
    fetchViaturas();
  };

  //Realizar Checklist Viatura
  const checklistViaturas = async() =>{
    try{
      
    }catch(error){
        toast.error('erro: Não foi possível salvar o checklist da viatura. Detalhes: '+error);
    }
  };

  //Editar Viaturas
  const EditarViatura = async() =>{
    if (!novaViatura.viaturaId) {
      toast.warn('Por favor, selecione uma viatura para editar.');
      return;
    } else {
      try{
        const response = await axios.put(`sistema-transporte-backend.vercel.app/api/viatura/update/${novaViatura.viaturaId}`,
          novaViatura,{
          headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if(response.status === 201){
          toast.success(response.data.message);
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
        const response = await axios.delete(`sistema-transporte-backend.vercel.app/api/viatura/delete/${viatura.viaturaId}`,{
          headers:{
            'Authorization': `Bearer ${token}`,
          }
        });
        if(response.status === 200){
          toast.success(response.data.message);
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
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEdit===true ? 'Editar Viatura' : 'Adicionar Viatura' }</DialogTitle>
            <DialogContent>
            <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
            <Grid2 container spacing={4}>
              <Grid2 item xs={12} sm={6}>
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
                <Grid2 item xs={12} sm={6}>
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
                <Grid2 item xs={12} sm={6}>
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
                <Grid2 item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Ano de Fabrico"
                  name="viaturaAnoFabrica"
                  type="text"
                  fullWidth
                  value={novaViatura.viaturaAnoFabrica}
                  onChange={handleChange}
                />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
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
                <Grid2 item xs={12} sm={6}>
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
                <Grid2 item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Número Chassi"
                  name="viaturaNumeroChassi"
                  type="text"
                  fullWidth
                  value={novaViatura.viaturaNumeroChassi}
                  onChange={handleChange}
                />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Número de Lugares"
                  name="viaturaNumeroLugar"
                  type="number"
                  fullWidth
                  value={novaViatura.viaturaNumeroLugar}
                  onChange={handleChange}
                />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Número do Motor"
                  name="viaturaNumeroMotor"
                  type="text"
                  fullWidth
                  value={novaViatura.viaturaNumeroMotor}
                  onChange={handleChange}
                />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
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
            </Grid2>
            </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancelar</Button>
              <Button onClick={handleSave} color="primary">{isEdit===true ? 'Salvar Alterações' : 'Adicionar' }</Button>
            </DialogActions>
          </Dialog>
          <Box marginBottom={3} />
          {/* Tabela de Viaturas */}
          {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
          <Grid2 item xs={12}>
          <Box marginBottom={2}/>
            <Card>
              <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Listagem de viaturas</Typography>
              <TableContainer component={Paper}>
                <Table aria-label="tabela de viaturas">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell>Matrícula</TableCell>
                      <TableCell>Modelo</TableCell>
                      <TableCell>Kilometragem</TableCell>
                      <TableCell>Combustível</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {viaturasFiltradas?.length > 0 ? (
                    viaturasFiltradas.map((viatura) => {
                      return (
                        <TableRow key={viatura.viaturaId}>
                          <TableCell>{viatura.viaturaId}</TableCell>
                          <TableCell>{viatura.viaturaMarca}</TableCell>
                          <TableCell>{viatura.viaturaMatricula}</TableCell>
                          <TableCell>{viatura.viaturaModelo}</TableCell>
                          <TableCell>{viatura.quilometragem} km</TableCell>
                          <TableCell>{viatura.viaturaCombustivel}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton color="primary" onClick={() => handleOpen(viatura)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Atribuir Viatura">
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
            </Card>
          </Grid2>
          )} {/*Fim do loading*/ }
        </Box>
      </Box>
    </>
  )
}

export default Viaturas;