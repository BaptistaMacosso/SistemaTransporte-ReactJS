import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
  IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2,
  CircularProgress,
  TablePagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Navigate } from 'react-router-dom';


const Manutencao = () => {
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento.
  const [manutencao, setManutencao] = useState([]);
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const [novaManutencao, setNovaManutencao] = useState({
    id: null, 
    viaturaId: '',
    tipoId: '',
    data: '',
    quilometragem: '',
    descricao: '',
    servicos: '',
    responsavel: '',
  });
  const { isAuthenticated, Logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página

    const hoje = new Date();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNovaManutencao({ ...novaManutencao, [name]: value });
    };

    const handleSearch = (e) => setFiltro(e.target.value);

    /*const manutencaoFiltradas = manutencao.filter((manutencao) =>
      manutencao.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())
    );*/

    const manutencaoFiltradas = Array.isArray(manutencao) 
    ? manutencao.filter((manutencao) => manutencao.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

    // Dados paginados
    const displayedLicencas = manutencaoFiltradas.slice(
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

    //...................................API........................
    useEffect(() => {
      if (!isAuthenticated) {
        Logout();
        Navigate('/login');
      }else{
        fetchManutencao();
      }
    }, [isAuthenticated, Logout]);

    const handleSave = async () => {
      if (isEdit) {
        //Editar
        handleEdit();
        handleClose();
        fetchManutencao();
      } else {
        //Salvar
        try {
        
        } catch (error) {
          if(error.response.status === 500){
            toast.error(error.response.data.message);
          }else if(error.response.status === 400){
            toast.error(error.response.data.message);
          }
        }
      }
      handleClose();
      fetchManutencao();
    };

    const handleEdit = async (manutencao) => {
      try {
        
      } catch (error) {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        }
      }
    };

    const fetchManutencao = async () =>{
      try {
        setLoading(true);
        const response = await axios.get('https://sistema-transporte-backend.vercel.app/api/manutencao/listar',{
          headers:{ 'Authorization': `Bearer ${token}`, }
        });
        // Garanta que 'users' seja um array antes de setá-lo no estado
        if (Array.isArray(response.data.allmanutencao)) {
          setManutencao(response.data.allmanutencao);
          console.log(response.data.allmanutencao);
        } else {
          setManutencao([]); // Previna erros futuros
        }
      }catch(error) {
        setManutencao([]); // Previna erros futuros
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        }
        else if (error.response.status === 401) {
          toast.error(error.response.data.message);
        }
      }finally {
        setLoading(false); // Finaliza o carregamento, seja com sucesso ou erro
    };
    };
    //..............................................................

   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }}  paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {/* Botão de Adicionar e Campo de Pesquisa */}
            <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <TextField
                  label="Pesquisar por viatura"
                  variant="outlined"
                  value={filtro}
                  onChange={handleSearch}
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                  Nova Manutenção
                </Button>
            </Grid2>
            <Box marginBottom={3} />
            {/* Tabela de Viaturas */}
            {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
              <Grid2 item xs={12}>
              <Box marginBottom={2} />
                <Card>
                  <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Manutenção</Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="tabela de manutencao">
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Marca Viatura</TableCell>
                          <TableCell>Modelo Viatura</TableCell>
                          <TableCell>Matrícula</TableCell>
                          <TableCell>Descrição</TableCell>
                          <TableCell>Data da Manutenção</TableCell>
                          <TableCell>Quilometragem Prevista</TableCell>
                          <TableCell>Tipo</TableCell>
                          <TableCell>Responsável</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {manutencaoFiltradas?.length > 0 ? (
                        manutencaoFiltradas.map((manutencao) => {
                          return (
                            <TableRow key={manutencao.id} >
                              <TableCell>{manutencao.id}</TableCell>
                              <TableCell>{manutencao.viatura.viaturaMarca}</TableCell>
                              <TableCell>{manutencao.viatura.viaturaModelo}</TableCell>
                              <TableCell>{manutencao.viatura.viaturaMatricula}</TableCell>
                              <TableCell>{manutencao.descricao}</TableCell>
                              <TableCell>{manutencao.data}</TableCell>
                              <TableCell>{manutencao.quilometragem}</TableCell>
                              <TableCell>{manutencao.tipo.nome}</TableCell>
                              <TableCell>{manutencao.responsavel}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="Editar">
                                  <IconButton color="primary">
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
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
                          <TableCell colSpan={6} align="center">Nenhuma manutenção encontrada.</TableCell>
                        </TableRow>
                      )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={manutencaoFiltradas.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por página"
                />
                </Card>
              </Grid2>
            )} {/*Fim do loading*/ }
            {/* Modal de Adicionar Nova Viatura */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{isEdit===true ? 'Editar Manutenção' : 'Nova Manutenção' }</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Placa"
                  name="placa"
                  fullWidth
                  value={novaManutencao.placa}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Modelo"
                  name="modelo"
                  fullWidth
                  value={novaManutencao.modelo}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Kilometragem"
                  name="km"
                  type="number"
                  fullWidth
                  value={novaManutencao.km}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Data de Manutenção"
                  name="dataManutencao"
                  type="date"
                  fullWidth
                  value={novaManutencao.dataManutencao}
                  onChange={handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSave} color="primary">{isEdit===true ? 'Salvar Alterações' : 'Adicionar' }</Button>
              </DialogActions>
            </Dialog>
          {/**/}

        </Box>
      </Box>
    </>
  )
}

export default Manutencao;