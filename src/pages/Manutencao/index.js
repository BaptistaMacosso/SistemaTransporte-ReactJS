import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid2, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
//API
import {criarManutencao, deletarManutencao, editarManutencao, listarManutencao} from '../../services/manutencaoService';
import { listarStatusManutencao } from '../../services/statusManutencaoService';
import { listarTipoManutencao } from '../../services/tipoManutencaoService';
import { listarViatura } from '../../services/viaturasService';


const Manutencao = () => {
  //States
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [manutencao, setManutencao] = useState([]);
  const [novaManutencao, setNovaManutencao] = useState({
        id: null, viaturaId: '', tipoManutencaoId: '', descricao: '', quilometragem: 0, responsavel: '', 
        statusManutencaoId: '',
  });
  const [viaturas, setViaturas] = useState([]);
  const [statusManutencao, setStatusManutencao] = useState([]);
  const [tipoManutencao, setTipoManutencao] = useState([]);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página
  const navigate = useNavigate();



  const handleClose = () => setOpen(false);
  const handleOpen = (manutencao) => {
    if (manutencao.id === undefined) {
      setIsEdit(false);
      setNovaManutencao({
        id: null,
        viaturaId: manutencao.viaturaId || '',
        tipoManutencaoId: manutencao.tipoManutencaoId || '',
        descricao: manutencao.descricao || '',
        quilometragem: parseFloat(manutencao.quilometragem) || 0,
        responsavel: manutencao.responsavel || '',
        statusManutencaoId: manutencao.statusManutencaoId || '',
      });
    } else {
      setIsEdit(true);
      setNovaManutencao({
        id: manutencao.id,
        viaturaId: manutencao.viaturaId,
        tipoManutencaoId: manutencao.tipoManutencaoId,
        descricao: manutencao.descricao,
        quilometragem: parseFloat(manutencao.quilometragem),
        responsavel: manutencao.responsavel,
        statusManutencaoId: manutencao.statusManutencaoId,
      });
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaManutencao({ ...novaManutencao, [name]: value });
  };

    const handleSearch = (e) => setFiltro(e.target.value);

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
  const handleSave = () => {
    if(isEdit){ 
      handleEditarManutencao();
      setIsEdit(false);
      setOpen(false);
    }else{
      handleNovaManutencao();
      setOpen(false);
    }
  };

  //Nova Manutenção
  const handleNovaManutencao = async () => {
    try {
      const response = await criarManutencao(novaManutencao, token);
      if(response.status === 201){
        toast.success(response.data.message);
        ListarTodasManutencoes();
      }else if(response.status === 400){
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Editar Manutenção
  const handleEditarManutencao = async () => {
    try {
      const response = await editarManutencao(novaManutencao.id, novaManutencao, token);
      console.log(response);
      if(response.status === 200){
        toast.success(response.data.message);
        ListarTodasManutencoes();
      }else if(response.status === 404){
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Eliminar Manutenção
  const handleEliminarManutencao = async (manutencao) => {
    try {
      const response = await deletarManutencao(manutencao.id, token);
      if(response.status === 200){
        toast.success(response.data.message);
        ListarTodasManutencoes();
      }else if(response.status === 404){
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Listar Todas as Viaturas
  const getViaturas = async () => {
    try {
      const response = await listarViatura(token);
      if(response){
        setViaturas(response);
      }else{
        toast.warn("Nenhuma viatura encontrada ou formato inesperado.");
        setViaturas([]);
      }
    } catch (error) {
      if (error.response.status === 500 || error.response.status === 401) {
        toast.error(error.response.data.message);
      }
    }
  };

  //Listar Status Manutenção
  const getStatusManutencao = async () => {
    try {
      const response = await listarStatusManutencao(token);
      if(response){
        setStatusManutencao(response);
      }else{
        toast.warn("Nenhum status de manutenção encontrado ou formato inesperado.");
        setStatusManutencao([]);
      }
    } catch (error) {
      if (error.response.status === 500) {
        toast.error(error.response.data.message);
      }
    }
  };

  //Listar Tipo Manutenção
  const getTipoManutencao = async () => {
    try {
      const response = await listarTipoManutencao(token);
      if(response){
        setTipoManutencao(response);
      }else{
        toast.warn("Nenhum tipo de manutenção encontrado ou formato inesperado.");
        setTipoManutencao([]);
      }
    } catch (error) {
      if (error.response.status === 500) {
        toast.error(error.response.data.message);
      }
    }
  };

  //Listar Todas as Manutenções
  const ListarTodasManutencoes = async () => {
    setLoading(true);
    try {
      const response = await listarManutencao(token);
      if(response){
        setManutencao(response);
        setLoading(false);
      }else{
        toast.warn("Nenhuma manutenção encontrada ou formato inesperado.");
        setManutencao([]);
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status === 500) {
        setLoading(false);
        setManutencao([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as manutenções. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      Logout();
      navigate('/login');
    }else{
      ListarTodasManutencoes();
      getStatusManutencao();
      getTipoManutencao();
      getViaturas();
    }
  }, [isAuthenticated, Logout]);
  //..............................................................

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
              <Grid2 container spacing={2}>
                <Grid2 sx={{ width: '49%' }}>
                  <TextField
                    label="Pesquisar por Matrícula"
                    variant="outlined"
                    value={filtro}
                    onChange={handleSearch}
                    sx={{ maxWidth: '80%' }}
                  />
                </Grid2>
                <Grid2 sx={{ width: '49%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button sx={{ marginTop: 1, marginRight: 1}} variant="contained" color="success" startIcon={<AddIcon />} onClick={handleOpen}>
                    Lançar Manutenção
                  </Button>
                  <Button sx={{marginTop: 1}} variant="contained" color="error" startIcon={<AddIcon />} onClick={() => navigate('/PedidoAsistenciaTecnica')}>
                    Pedido de Assistência
                  </Button>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Stack>
        <Box height={15} />
              {/* Tabela de Viaturas */}
              {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
                <Grid2 item xs={12}>
                <Box marginBottom={2} />
                  <Card>
                    <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Manutenção</Typography>
                    <TableContainer component={Paper}>
                      <Table aria-label="tabela de manutencao">
                        <TableHead>
                          <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Viatura</TableCell>
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Quilometragem</TableCell>
                            <TableCell>Data Manutenção</TableCell>
                            <TableCell>Tipo Manutenção</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {manutencaoFiltradas?.length > 0 ? (
                          manutencaoFiltradas.map((manutencao) => {
                            const apenasData = new Date(manutencao.dataManutencao).toISOString().split("T")[0];
                            return (
                              <TableRow key={manutencao.id} >
                                <TableCell>{manutencao.id}</TableCell>
                                <TableCell>{manutencao.viatura.viaturaMarca+" - "+manutencao.viatura.viaturaModelo}</TableCell>
                                <TableCell>{manutencao.viatura.viaturaMatricula}</TableCell>
                                <TableCell>{manutencao.quilometragem} KM</TableCell>
                                <TableCell>{apenasData}</TableCell>
                                <TableCell>{manutencao.tipoManutencao.tipoManutencao}</TableCell>
                                <TableCell>{manutencao.statusManutencao.statusManutencao}</TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Editar">
                                    <IconButton color="primary" onClick={() => handleOpen(manutencao)}>
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver Detalhes">
                                    <IconButton color="success" onClick={() => navigate(`/DetalhesManutencao/${manutencao.id}`)}>
                                      <Visibility />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Excluir">
                                    <IconButton color="secondary" onClick={() => handleEliminarManutencao(manutencao)}>
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
      </Box>
    </Box>
    {/* Modal de Adicionar Nova Viatura */}
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? 'Editar Manutenção' : 'Nova Manutenção' }</DialogTitle>
        <DialogContent>
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
          <Grid2 container spacing={2}>
            <Grid2 item size={8}>
            <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                <InputLabel id="role-select-label">Viaturas</InputLabel>
                <Select
                labelId="role-select-label"
                name="viaturaId"
                value={novaManutencao.viaturaId}
                label="Viatura"
                onChange={handleChange}
                >
                {viaturas.map((viatura) => (
                    <MenuItem value={viatura.viaturaId}>
                    {viatura.viaturaMarca+" - "+viatura.viaturaMatricula}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid2>
            <Grid2 item size={4}>
              <TextField
                margin="dense"
                label="Viatura KM"
                name="quilometragem"
                type="number"
                fullWidth
                value={novaManutencao.quilometragem}
                onChange={handleChange}
              />
            </Grid2>
            <TextField
              margin="dense"
              label="Descrição da Manutenção"
              name="descricao"
              type="text"
              fullWidth
              value={novaManutencao.descricao}
              onChange={handleChange}
            />
            <Grid2 item size={8}>
              <TextField
                margin="dense"
                label="Responsável Técnico"
                name="responsavel"
                type="text"
                fullWidth
                value={novaManutencao.responsavel}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item size={4}>
              <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                <InputLabel id="estado-select-label">Estado</InputLabel>
                <Select
                  labelId="estado-select-label"
                  name="statusManutencaoId"
                  value={novaManutencao.statusManutencaoId}
                  label="Status Manutenção"
                  onChange={handleChange}
                >
                  {statusManutencao.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.statusManutencao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 item size={6}>
              <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                <InputLabel id="tipo-select-label">Tipo Manutenção</InputLabel>
                <Select
                  labelId="tipo-select-label"
                  name="tipoManutencaoId"
                  value={novaManutencao.tipoManutencaoId}
                  label="Tipo de Manutenção"
                  onChange={handleChange}
                >
                  {tipoManutencao.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.tipoManutencao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            
          </Grid2>
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">{isEdit ? 'Salvar Alterações' : 'Adicionar' }</Button>
        </DialogActions>
      </Dialog>
    {/**/}
  </>
  )
}

export default Manutencao;


