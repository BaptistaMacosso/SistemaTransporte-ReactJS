import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
  IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2,
  TablePagination,
  Stack,
  CardContent,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { listarPrestadores, inserirPrestador, editarPrestador, deletarPrestador } from '../../services/prestadorService';
import { toast } from 'react-toastify';


const Oficinas = () => {
  // Recupera o token do contexto de autenticação ou localStorage
    const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
    const { isAuthenticated, logout  } = useContext(AuthContext);
    const { navigate } = useNavigate();
    const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
    const [oficinas, setOficinas] = useState([]);
    const [open, setOpen] = useState(false);
    const [novaOficina, setNovaOficina] = useState({ 
          prestadorId: null,prestadorNome: '',especialidade: '',contato: '',endereco: ''});
    const [filtro, setFiltro] = useState('');
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento.
    const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página

    const handleOpen = (oficina) => {
      if (oficina.prestadorId === undefined) {
        setIsEdit(false);
        setNovaOficina({
          prestadorId: null, 
          prestadorNome: oficina.prestadorNome || '', 
          especialidade: oficina.especialidade || '', 
          contato: oficina.contato || '', 
          endereco: oficina.endereco || ''
        });
      } else {
        setIsEdit(true);
        setNovaOficina({
          prestadorId: oficina.prestadorId, 
          prestadorNome: oficina.prestadorNome, 
          especialidade: oficina.especialidade, 
          contato: oficina.contato, 
          endereco: oficina.endereco
        });
      }
      setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNovaOficina({ ...novaOficina, [name]: value });
    };

    const handleSearch = (e) => setFiltro(e.target.value);

    const oficinasFiltradas = oficinas.filter((oficina) =>
      oficina.prestadorNome.toLowerCase().includes(filtro.toLowerCase())
    );

    // Dados paginados
    const displayedLicencas = oficinasFiltradas.slice(
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

    //.................................................................
    const handleSave = () => {
      if(isEdit){ 
        EditarOficina();
        listarOficinas();
        setIsEdit(false);
        setOpen(false);
      }else{
        CriarOficinaa();
        listarOficinas();
        setOpen(false);
      }
    };

    //Editar Prestadores
    const EditarOficina = async() => {
      try {
        const response = await editarPrestador(novaOficina.prestadorId, novaOficina, token);
        if(response.status === 201){
          toast.success(response.data.message);
          listarOficinas();
        }
        else if(response.status === 400){
          toast.success(response.message);
        }
      } catch (error) {
        toast.error(error.response.message);
      }
    };

    //Criar Prestadores
    const CriarOficinaa = async() => {
      try {
        const response = await inserirPrestador(novaOficina, token);
        if(response.status === 201){
          toast.success(response.message);
          listarOficinas();
        }
        else if(response.status === 400){
          toast.success(response.message);
        }
      } catch (error) {
        toast.error(error.response.message);
      }
    };

    //Deletar Prestador
    const handleDelete = async(oficina) => {
      try {
        if (window.confirm('Tem certeza que deseja excluir esta oficina?')) {
          const response = await deletarPrestador(oficina.prestadorId, token);
          if(response.status === 200){
            toast.success(response.data.message);
            listarOficinas();
          }
          else if(response.status === 400){
            toast.success(response.data.message);
          }
        };
      } catch (error) {
        toast.error(error.response.message);
      }
    };

    //Listar Oficinas
    const listarOficinas = async() => {
      setLoading(true); 
      try {
        const response = await listarPrestadores(token);
        if (response) {
          setOficinas(response);
          setLoading(false);
        } else {
          toast.warn("Nenhuma oficina encontrada ou formato inesperado.");
          setOficinas([]); // Previna erros futuros
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setNovaOficina([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as oficinas. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      }
    };

    useEffect(() => {
      const loadData = async () => {
        if (!isAuthenticated) {
          logout();
          navigate('/login');
        } else {
          await listarOficinas();
        }
      };
      loadData();
    }, [isAuthenticated]);
    //.................................................................

   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }}  paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
          <Card sx={{ width: '100%', height: 90 }}>
            <CardContent>
                {/* Botão de Adicionar e Campo de Pesquisa */}
                <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                    <TextField
                      label="Pesquisar por Nome"
                      variant="outlined"
                      value={filtro}
                      onChange={handleSearch}
                      sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                      Nova Oficina
                    </Button>
                </Grid2>
                </CardContent>
              </Card>
            </Stack>
            {/* Tabela de Publicidade */}
            <Box marginBottom={3} />
            {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
              <Grid2 item xs={12}>
              <Box marginBottom={2} />
                <Card>
                  <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Oficinas</Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="tabela de publicidade">
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Nome da Oficina</TableCell>
                          <TableCell>Especialização</TableCell>
                          <TableCell>Contacto de Atendimento</TableCell>
                          <TableCell>Endereço de Oficina</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {oficinasFiltradas?.length > 0 ? (oficinasFiltradas.map((oficina) => {
                          return (
                            <TableRow key={oficina.prestadorId} >
                              <TableCell>{oficina.prestadorId}</TableCell>
                              <TableCell>{oficina.prestadorNome}</TableCell>
                              <TableCell>{oficina.especialidade}</TableCell>
                              <TableCell>{oficina.contato}</TableCell>
                              <TableCell>{oficina.endereco}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="Editar">
                                  <IconButton color="primary" onClick={() => handleOpen(oficina)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton color="secondary" onClick={() => handleDelete(oficina)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                          })) : (
                              <TableRow>
                              <TableCell colSpan={6} align="center">Nenhuma oficina encontrada.</TableCell>
                              </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={oficinasFiltradas.length}
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
              <DialogTitle>{isEdit ? "Editar Oficina" : "Nova Oficina"}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="prestador Nome"
                  name="prestadorNome"
                  type="text"
                  fullWidth
                  value={novaOficina.prestadorNome}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Especialidade"
                  name="especialidade"
                  type="text"
                  fullWidth
                  value={novaOficina.especialidade}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Contacto"
                  name="contato"
                  type="text"
                  fullWidth
                  value={novaOficina.contato}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Endereço"
                  name="endereco"
                  type="text"
                  fullWidth
                  value={novaOficina.endereco}
                  onChange={handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSave} color="primary">{isEdit ? "Salvar Alterações" : "Adicionar"}</Button>
              </DialogActions>
            </Dialog>
          {/**/}

        </Box>
      </Box>
    </>
  )
}

export default Oficinas;