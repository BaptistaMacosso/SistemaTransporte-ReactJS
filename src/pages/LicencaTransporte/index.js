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
  TablePagination,
  Stack,
  CardContent,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { differenceInDays, parseISO } from 'date-fns';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { listarLicencaTransporte, inserirLicencaTransporte, editarLicencaTransporte, deletarLicencaTransporte 
} from '../../services/licencaTransporteService';
import { toast } from 'react-toastify';
import { listarViatura } from '../../services/viaturasService';

const LicencaTransporte = () => {
    // Recupera o token do contexto de autenticação ou localStorage
    const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
    const { isAuthenticated, logout  } = useContext(AuthContext);
    const { navigate } = useNavigate();
    const [licencaTransporte, setLicencaTransporte] = useState([]);
    const [novaLicencaTransporte, setNovaLicencaTransporte] = useState({
      id: '',
      viaturaId: '',
      descricao: '',
      observacao: '',
      proprietario: '',
      dataEmissao: '',
      dataVencimento: '',
      licencaStatus: ''
    });
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viaturas, setViaturas] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página
    
    const hoje = new Date();

    const handleSearch = (e) => setFiltro(e.target.value);
    const handleOpen = (licenca) => {
      if (licenca.id === undefined) {
        setIsEdit(false);
        setNovaLicencaTransporte({
          id: null,
          viaturaId: licenca.viaturaId || '',
          descricao: licenca.descricao || '',
          observacao: licenca.observacao || '',
          proprietario: licenca.proprietario || '',
          dataEmissao: licenca.dataEmissao || '',
          dataVencimento: licenca.dataVencimento || '',
          licencaStatus: licenca.licencaStatus || ''
        });
      } else {
        setIsEdit(true);
        setNovaLicencaTransporte({
          id: licenca.id,
          viaturaId: licenca.viaturaId,
          descricao: licenca.descricao,
          observacao: licenca.observacao,
          proprietario: licenca.proprietario,
          dataEmissao: licenca.dataEmissao,
          dataVencimento: licenca.dataVencimento,
          licencaStatus: licenca.licencaStatus
        });
      }
      setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNovaLicencaTransporte({ ...novaLicencaTransporte, [name]: value });
    };

    const licencaTransporteFiltradas = licencaTransporte.filter((licenca) =>
      licenca.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())
    );

    // Dados paginados
    const displayedLicencas = licencaTransporteFiltradas.slice(
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

    //.....................................................................
    //Salvar Licença de Transporte
    const handleSave = () => {
      if(isEdit){ 
        handleEditar();
        setIsEdit(false);
        setOpen(false);
      }else{
        handleInserir();
        setIsEdit(false);
        handleClose();
        setOpen(false);
      }
    };

    //Inserir Licença
    const handleInserir = async() => {
      try {
        const response = await inserirLicencaTransporte(novaLicencaTransporte, token);
        if(response.status === 201){
          toast.success(response.data.message);
          getLicencaTransporte();
        }else if(response.status === 400){
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    //Editar Licença
    const handleEditar = async() => {
      try {
        const response = await editarLicencaTransporte(novaLicencaTransporte.id,novaLicencaTransporte, token);
        if(response.status === 200){
          toast.success(response.data.message);
          getLicencaTransporte();
        }else if(response.status === 400){
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    //Deletar Licença
    const handleDelete = async(transporteLicenca) => {
      try {
        const response = await deletarLicencaTransporte(transporteLicenca.id, token);
        if(response.status === 200){
          toast.success(response.data.message);
          getLicencaTransporte();
        }else if(response.status === 400){
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    //Listar Licenças
    const getLicencaTransporte = async() => {
          setLoading(true);
          try {
            const response = await listarLicencaTransporte(token);
            if (response) {
              setLicencaTransporte(response);
              setLoading(false);
            } else {
              toast.warn("Nenhuma licença de transporte encontrada ou formato inesperado.");
              setLicencaTransporte([]); // Previna erros futuros
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            setLicencaTransporte([]); // Previna erros futuros
            toast.error("Erro: Não foi possível listar as licenças de transporte. Verifique os detalhes no console.");
            console.log("Detalhes: "+error);
          }
    };

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

    useEffect(() => {
      const loadData = async () => {
        if (!isAuthenticated) {
          logout();
          navigate('/login');
        } else {
          await getLicencaTransporte();
          await fetchViaturas();
        }
      };
      loadData();
    }, [isAuthenticated]);
    
    //.....................................................................

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
                      label="Pesquisar por Matrícula"
                      variant="outlined"
                      value={filtro}
                      onChange={handleSearch}
                      sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                      Nova Licença
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
                  <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Licenças de Transporte</Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="tabela de licença de transporte">
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Marca</TableCell>
                          <TableCell>Modelo</TableCell>
                          <TableCell>Matrícula</TableCell>
                          <TableCell>Descrição Licença</TableCell>
                          <TableCell>Data Validade</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {licencaTransporteFiltradas.length > 0 ? (licencaTransporteFiltradas.map((licenca) => {
                          const diasParaVencimento = differenceInDays(parseISO(licenca.dataVencimento), hoje);
                          const highlight = diasParaVencimento <= 15 ? { backgroundColor: '#EEEED1' } : {};

                          return (
                            <TableRow key={licenca.id} style={highlight}>
                              <TableCell>{licenca.id}</TableCell>
                              <TableCell>{licenca.viatura.viaturaMarca}</TableCell>
                              <TableCell>{licenca.viatura.viaturaModelo}</TableCell>
                              <TableCell>{licenca.viatura.viaturaMatricula}</TableCell>
                              <TableCell>{licenca.descricao}</TableCell>
                              <TableCell>{licenca.dataVencimento}</TableCell>
                              <TableCell>{licenca.licencaStatus ? 'Activo' : 'Inactivo'}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="Editar">
                                  <IconButton color="primary" onClick={() => handleOpen(licenca)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton color="secondary" onClick={() => handleDelete(licenca)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })):(
                          <TableRow>
                            <TableCell colSpan={7} align="center">Nenhuma licença de transporte encontrada.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={licencaTransporteFiltradas.length}
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
              <DialogTitle>{isEdit ? "Editar Licença" : "Nova Licença"}</DialogTitle>
              <DialogContent>
              <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
                <Grid2 container spacing={2}>
                <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                    <InputLabel id="role-select-label">Viatura</InputLabel>
                    <Select
                    labelId="role-select-label"
                    name="viaturaId"
                    value={novaLicencaTransporte.viaturaId}
                    label="Viatura"
                    onChange={handleChange}
                    fullWidth
                    >
                    {viaturas.map((viatura) => (
                        <MenuItem value={viatura.viaturaId}>
                        {viatura.viaturaMarca+" - "+viatura.viaturaMatricula}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="Descrição"
                  name="descricao"
                  type="text"
                  fullWidth
                  value={novaLicencaTransporte.descricao}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Observação"
                  name="observacao"
                  type="text"
                  fullWidth
                  value={novaLicencaTransporte.observacao}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Proprietário"
                  name="proprietario"
                  type="text"
                  fullWidth
                  value={novaLicencaTransporte.proprietario}
                  onChange={handleChange}
                /> 
                <Grid2 item size={4}>
                  <TextField
                    margin="dense"
                    label="Data de Emissão"
                    name="dataEmissao"
                    type="date"
                    fullWidth
                    value={novaLicencaTransporte.dataEmissao}
                    onChange={handleChange}
                  />
                </Grid2>
                <Grid2 item size={4}>
                  <TextField
                    margin="dense"
                    label="Data de Vencimento"
                    name="dataVencimento"
                    type="date"
                    fullWidth
                    value={novaLicencaTransporte.dataVencimento}
                    onChange={handleChange}
                  />
                </Grid2>
                <Grid2 item size={4}>
                  <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                    <InputLabel id="tipo-select-label">Estado Licença</InputLabel>
                    <Select
                      labelId="tipo-select-label"
                      name="licencaStatus"
                      value={novaLicencaTransporte.licencaStatus}
                      label="Estado da Licença"
                      onChange={handleChange}
                      fullWidth>
                        <MenuItem key={1} value={true}>Activo</MenuItem>
                        <MenuItem key={2} value={false}>Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>
              </Grid2>
              </Box>
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

export default LicencaTransporte;