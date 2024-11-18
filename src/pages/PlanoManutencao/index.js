import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
         IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2,
         FormControl,
         InputLabel,
         Select,
         MenuItem,
         CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { differenceInDays, parseISO, set } from 'date-fns';
import axios from 'axios';
import { AuthContext } from '../../contexts/auth';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlanoManutencao = () => {
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento.
  const [planoManutencao, setPlanoManutencao] = useState([]);
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const [novoPlanManutencao, setNovoPlanoManutencao] = useState({
    id: null, 
    viaturaId: '',
    dataManutencao: '', 
    descricao: '', 
    custoPrevisto: '', 
    status: '' 
  });
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const hoje = new Date();
  const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
  const [viaturas, setViaturas] = useState([]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoPlanoManutencao({ ...novoPlanManutencao, [name]: value });
  };
  
  const handleSearch = (e) => setFiltro(e.target.value);
  
 /* const planoManutencaoFiltradas = planoManutencao.filter((plano) =>
    plano.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())
  );*/

  const planoManutencaoFiltradas = Array.isArray(planoManutencao) 
    ? planoManutencao.filter((plano) => plano.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

  // Função para abrir o modal para adicionar ou editar
  const handleOpen = (planos) => {
    if (planos.id === undefined) {
      setIsEdit(false);
      setNovoPlanoManutencao({ 
        id: null, 
        viaturaId: novoPlanManutencao.viaturaId || '',
        dataManutencao: novoPlanManutencao.dataManutencao || '', 
        descricao: novoPlanManutencao.descricao || '', 
        custoPrevisto: novoPlanManutencao.custoPrevisto || '', 
        status: novoPlanManutencao.status || '' 
      });
    } else {
      setIsEdit(true);
      setNovoPlanoManutencao({ 
        id: novoPlanManutencao.id, 
        viaturaId: novoPlanManutencao.viaturaId,
        dataManutencao: novoPlanManutencao.dataManutencao, 
        descricao: novoPlanManutencao.descricao, 
        custoPrevisto: novoPlanManutencao.custoPrevisto, 
        status: novoPlanManutencao.status
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
    setNovoPlanoManutencao({ id: null, viaturaId: '', dataManutencao: '', descricao: '', custoPrevisto: '', status: ''});
  }
    //................................API.............................
    useEffect(() => {
      if (!isAuthenticated) {
        Logout();
        Navigate('/login');
      }else{
        fetchPlanoManutencao();
        listagemViaturas();
      }
    }, [isAuthenticated, Logout]);


    //Listagem de Planos de Manutenção.
    const fetchPlanoManutencao = async () => {
      try {
        setLoading(true);
        const response = await axios.get('sistema-transporte-backend.vercel.app/api/planomanutencao/listar',{
          headers:{ 'Authorization': `Bearer ${token}`, }
        });
        
        // Garanta que 'users' seja um array antes de setá-lo no estado
        if (Array.isArray(response.data.allplanos)) {
          setPlanoManutencao(response.data.allplanos);
          console.log(response.data.allplanos);
        } else {
          setPlanoManutencao([]); // Previna erros futuros
        }
      }catch(error) {
        setPlanoManutencao([]); // Previna erros futuros
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        }else if (error.response.status === 401) {
          toast.error(error.response.data.message);
        }
      }finally {
        setLoading(false); // Finaliza o carregamento, seja com sucesso ou erro
      };
    };

    //Update Planos
    const handleEdit = async (plano) => {
      try {

        handleClose();
      } catch (error) {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        }
      }
    };

    //Deletar Planos
    const handleDelete = async (plano) => {
      
      try {
        if (window.confirm('Tem certeza que deseja excluir este plano de manutenção?')) {
          const response = await axios.delete(`sistema-transporte-backend.vercel.app/api/planomanutencao/delete/${plano.id}`,{
            headers:{ 'Authorization': `Bearer ${token}`, }
          });
          if(response.status === 201){
            toast.success(response.data.message);
            fetchPlanoManutencao();
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

    //Criar Planos
    const handleSave = async () =>{
      if (isEdit) {
        //Editar
        handleEdit();
        handleClose();
        fetchPlanoManutencao();
      } else {
        //Salvar
        try {
          const response = await axios.post('sistema-transporte-backend.vercel.app/api/planomanutencao/registar',
          novoPlanManutencao, 
          {
            headers:{ 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,  
            }
          });
          if(response.status === 201){
            toast.success("Plano de manutenção criado com sucesso!");
          }
          handleClose();
        } catch (error) {
          if(error.response.status === 500){
            toast.error(error.response.data.message);
          }else if(error.response.status === 400){
            toast.error(error.response.data.message);
          }
        };
        handleClose();
        fetchPlanoManutencao();
      }
    };

    //Listagem de viaturas
    const listagemViaturas = async () =>{
      try {
        const response = await axios.get('sistema-transporte-backend.vercel.app/api/viatura/listar',{
          headers:{ 'Authorization': `Bearer ${token}`, }
        });
        setViaturas(response.data.viatura);
      } catch (error) {
        toast.error("Erro: Não foi possível listar as viaturas. Detalhes: "+error);
      }
    };
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
              Novo Plano
            </Button>
          </Grid2>
          <Box marginBottom={3} />
          {/* Tabela de Viaturas */}
          {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
          <Grid2 item xs={12}>
          <Box marginBottom={2} />
            <Card>
              <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Plano de Manutenção</Typography>
              <TableContainer component={Paper}>
                <Table aria-label="tabela de viaturas">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Marca Viatura</TableCell>
                      <TableCell>Modelo Viatura</TableCell>
                      <TableCell>Matrícula</TableCell>
                      <TableCell>Descrição do Plano de Manutenção</TableCell>
                      <TableCell>Custo Previsto</TableCell>
                      <TableCell>Data de Manutenção</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {planoManutencaoFiltradas?.length > 0 ? (
                    planoManutencaoFiltradas.map((planos) => {
                      const diasParaManutencao = differenceInDays(parseISO(planos.dataManutencao), hoje);
                      const highlight = diasParaManutencao <= 10 ? { backgroundColor: '#EEEED1' } : {};

                      return (
                        <TableRow key={planos.id} style={highlight}>
                          <TableCell>{planos.id}</TableCell>
                          <TableCell>{planos.viatura.viaturaMarca}</TableCell>
                          <TableCell>{planos.viatura.viaturaModelo}</TableCell>
                          <TableCell>{planos.viatura.viaturaMatricula}</TableCell>
                          <TableCell>{planos.descricao}</TableCell>
                          <TableCell>{planos.custoPrevisto}</TableCell>
                          <TableCell>{planos.dataManutencao}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar" onClick={() =>handleOpen(planos)}>
                              <IconButton color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir" onClick={() =>handleDelete(planos)}>
                              <IconButton color="secondary">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                    ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">Nenhum plano de manutenção encontrado.</TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid2>
          )} {/*Fim do loading*/ }
        {/**/}
        {/* Modal de Adicionar Nova Viatura */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEdit===true ? 'Editar Plano de Manutenção' : 'Novo Plano de Manutenção' }</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
              <InputLabel id="role-select-label">Escolha a Viatura</InputLabel>
              <Select
                labelId="role-select-label"
                name="viaturaId"
                value={novoPlanManutencao.viaturaId}
                label="Viatura"
                onChange={handleChange}
              >
                {viaturas.map((viatura) => (
                  <MenuItem value={viatura.viaturaId}>
                    {viatura.viaturaMarca}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Descrição do Plano"
              name="descricao"
              type="text"
              fullWidth
              value={novoPlanManutencao.descricao}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Custos da Manutenção"
              name="custoPrevisto"
              type="number"
              fullWidth
              value={novoPlanManutencao.custoPrevisto}
              onChange={handleChange}
            />
            <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
              <InputLabel id="role-select-label">Estado</InputLabel>
              <Select
                labelId="role-select-label"
                name="status"
                value={novoPlanManutencao.status}
                label="Estado do Plano"
                onChange={handleChange}
              >
                <MenuItem value={true}>Activo</MenuItem>
                <MenuItem value={false}>Inactivo</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Data de Manutenção"
              name="dataManutencao"
              type="date"
              fullWidth
              value={novoPlanManutencao.dataManutencao}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancelar</Button>
            <Button onClick={handleSave} color="primary">{isEdit===true ? 'Salvar Alterações' : 'Adicionar' }</Button>
          </DialogActions>
        </Dialog>
        </Box>
      </Box>
    </>
  )
}

export default PlanoManutencao;