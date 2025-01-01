import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
  IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { differenceInDays, parseISO } from 'date-fns';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { listarLicencaPublicidades, inserirLicencaPublicidade, 
         editarLicencaPublicidade, deletarLicencaPublicidade 
} from '../../services/licencaPublicidadeService';
import { toast } from 'react-toastify';


const LicencaPublicidade = () => {
    // Recupera o token do contexto de autenticação ou localStorage
    const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
    const { isAuthenticated, logout  } = useContext(AuthContext);
    const { navigate } = useNavigate();
    const [licencaPublicidade, setLicencaPublicidade] = useState([]);
    const [novaLicencaPublicidade, setNovalicencaPublicidade] = useState(
      { 
        id: null,
        descricao: '',
        licencaNumero: '',
        dataEmissao: '', 
        dataVencimento: '',
        licencaStatus: '',
      });
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página

    const hoje = new Date();

    const handleOpen = (licenca) => {
      if (licenca.id === undefined) {
        setIsEdit(false);
        setNovalicencaPublicidade({
          id: null, 
          descricao: licenca.descricao || '', 
          licencaNumero: licenca.licencaNumero || '', 
          dataEmissao: licenca.dataEmissao || '', 
          dataVencimento: licenca.dataVencimento || '',
          licencaStatus: licenca.licencaStatus || ''
        });
      } else {
        setIsEdit(true);
        setNovalicencaPublicidade({
          id: licenca.id, 
          descricao: licenca.descricao, 
          licencaNumero: licenca.licencaNumero, 
          dataEmissao: licenca.dataEmissao, 
          dataVencimento: licenca.dataVencimento,
          licencaStatus: licenca.licencaStatus
        });
      }
      setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNovalicencaPublicidade({ ...novaLicencaPublicidade, [name]: value });
    };

    const handleSearch = (e) => setFiltro(e.target.value);

    const licencaPublicidadeFiltradas = licencaPublicidade.filter((licenca) =>
      licenca.licencaNumero.toLowerCase().includes(filtro.toLowerCase())
    );

    // Dados paginados
    const displayedLicencas = licencaPublicidadeFiltradas.slice(
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

    //......................................................................
    const handleSave = () => {
      if(isEdit){ 
        editarPublicidade();
        setIsEdit(false);
        setOpen(false);
      }else{
        inserirPublicidade();
        setOpen(false);
      }
    };

    //Salvar Licença de Publicidade
    const inserirPublicidade = async() => {
      try {
        const response = await inserirLicencaPublicidade(novaLicencaPublicidade, token);
        if(response.status === 201){
          toast.success(response.message);
          listarPublicidades();
        }
        else if(response.status === 400){
          toast.success(response.message);
        }
      } catch (error) {
        toast.error(error.response.message);
      }
    };

    //Editar Licença de Publicidade
    const editarPublicidade = async() => {
      try {
        const response = await editarLicencaPublicidade(novaLicencaPublicidade.id, novaLicencaPublicidade, token);
        if(response.status === 200){
          toast.success(response.data.message);
          listarPublicidades();
        }
        else if(response.status === 400){
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    //Deletar Licença de Publicidade
    const deletarPublicidade = async(licencaDelete) => {
      try {
        if (window.confirm('Tem certeza que deseja excluir está licença de publicidade?')) {
          const response = await deletarLicencaPublicidade(licencaDelete.id, token);
          if(response.status === 200){
            toast.success(response.data.message);
            listarPublicidades();
          }
          else if(response.status === 400){
            toast.success(response.message);
          }
        };
      } catch (error) {
        toast.error(error.response.message);
      }
    };

    //Listar todas as licenças de publicidade
    const listarPublicidades = async() => {
      setLoading(true);
      try {
        const response = await listarLicencaPublicidades(token);
        if (response) {
          setLicencaPublicidade(response);
          setLoading(false);
        } else {
          toast.warn("Nenhuma licença de publicidade encontrada ou formato inesperado.");
          setLicencaPublicidade([]); // Previna erros futuros
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setLicencaPublicidade([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as licenças de publicidade. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      }
    };

    useEffect(() => {
      const loadData = async () => {
        if (!isAuthenticated) {
          logout();
          navigate('/login');
        } else {
          await listarPublicidades();
        }
      };
      loadData();
    }, [isAuthenticated]);
    //......................................................................

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
                  label="Pesquisar por licença"
                  variant="outlined"
                  value={filtro}
                  onChange={handleSearch}
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                  Nova Licença
                </Button>
            </Grid2>
            {/* Tabela de Publicidade */}
            <Box marginBottom={3} />
            {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
            <Grid2 item xs={12}>
            <Box marginBottom={2} />
              <Card>
                <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Licenças de Publicidade</Typography>
                <TableContainer component={Paper}>
                  <Table aria-label="tabela de publicidade">
                    <TableHead>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Descrição Licença</TableCell>
                        <TableCell>Nrº Licença</TableCell>
                        <TableCell>Data Emissão</TableCell>
                        <TableCell>Data Validade</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {licencaPublicidadeFiltradas.length > 0 ? (licencaPublicidadeFiltradas.map((licenca) => {
                        const diasParaVencimento = differenceInDays(parseISO(licenca.dataVencimento), hoje);
                        const highlight = diasParaVencimento <= 15 ? { backgroundColor: '#EEEED1' } : {};

                        return (
                          <TableRow key={licenca.id} style={highlight}>
                            <TableCell>{licenca.id}</TableCell>
                            <TableCell>{licenca.descricao}</TableCell>
                            <TableCell>{licenca.licencaNumero}</TableCell>
                            <TableCell>{licenca.dataEmissao}</TableCell>
                            <TableCell>{licenca.dataVencimento}</TableCell>
                            <TableCell>{licenca.licencaStatus ? 'Activo' : 'Inactivo'}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Editar">
                                <IconButton color="primary" onClick={()=>handleOpen(licenca)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton color="secondary" onClick={() => deletarPublicidade(licenca)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">Nenhuma licença de publicidade encontrada.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={licencaPublicidadeFiltradas.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Linhas por página"
                />
              </Card>
            </Grid2>
            )} {/*Fim do loading*/ }
            {/**/}
            {/* Modal de Adicionar Nova Viatura */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{isEdit ? "Editar Licença" : "Nova Licença"}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Descrição"
                  name="descricao"
                  type="text"
                  fullWidth
                  value={novaLicencaPublicidade.descricao}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Número da Licença"
                  name="licencaNumero"
                  type="text"
                  fullWidth
                  value={novaLicencaPublicidade.licencaNumero}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Data de Emissão"
                  name="dataEmissao"
                  type="date"
                  fullWidth
                  value={novaLicencaPublicidade.dataEmissao}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Data de Vencimento"
                  name="dataVencimento"
                  type="date"
                  fullWidth
                  value={novaLicencaPublicidade.dataVencimento}
                  onChange={handleChange}
                />
                <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                  <InputLabel id="tipo-select-label">Estado da Licença</InputLabel>
                  <Select
                    labelId="tipo-select-label"
                    name="licencaStatus"
                    value={novaLicencaPublicidade.licencaStatus}
                    label="Estado da Licença"
                    onChange={handleChange}
                    fullWidth
                  >
                      <MenuItem key={1} value={true}>Activo</MenuItem>
                      <MenuItem key={2} value={false}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
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

export default LicencaPublicidade;
