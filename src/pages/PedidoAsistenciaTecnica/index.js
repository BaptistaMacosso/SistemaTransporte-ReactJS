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
import { listarTipoServico } from '../../services/tipoServicoService';
import { listarStatusServico } from '../../services/statusServicoService';
import { listarViatura } from '../../services/viaturasService';
import { listarPrestadores } from '../../services/prestadorService';
import { criarPedidosAssistenciaTecnica, listarPedidosAssistenciaTecnica, deletarPedidosAssistenciaTecnica, editarPedidosAssistenciaTecnica } from '../../services/pedidoAssistenciaTecnica';


const PedidoAsistenciaTecnica = () => {
  //States
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [oficinas, setOficinas] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [novoPedido, setNovoPedido] = useState({
        pedidoId: null, viaturaId: '', descricao: '', dataSolicitacao: '', tipoServicoId: '', statusId: '', 
        prestadorId: '',
  });
  const [tipoServico, setTipoServico] = useState([]);
  const [statusServico, setStatusServico] = useState([]);
  const [viaturas, setViaturas] = useState([]);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página
  const navigate = useNavigate();


  const handleClose = () => setOpen(false);
  const handleOpen = (pedido) => {
    if (pedido.pedidoId === undefined) {
      setIsEdit(false);
      setNovoPedido({
        pedidoId: null,
        viaturaId: pedido.viaturaId || '',
        descricao: pedido.descricao || '',
        tipoServicoId: pedido.tipoServicoId || '',
        statusId: 1,
        prestadorId: pedido.prestadorId || '',
      });
    } else {
      setIsEdit(true);
      setNovoPedido({
        pedidoId: pedido.pedidoId,
        viaturaId: pedido.viaturaId,
        descricao: pedido.descricao,
        tipoServicoId: pedido.tipoServicoId,
        statusId: pedido.statusId,
        prestadorId: pedido.prestadorId,
      });
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoPedido({ ...novoPedido, [name]: value });
  };

    const handleSearch = (e) => setFiltro(e.target.value);

    const pedidosFiltradas = Array.isArray(pedido) 
    ? pedido.filter((pedidos) => pedidos.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

    // Dados paginados
    const displayedLicencas = pedidosFiltradas.slice(
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
      handleEditarPedido();
      setIsEdit(false);
      setOpen(false);
    }else{
      handleNovoPedido();
      setOpen(false);
    }
  };

  //Novo Pedido
  const handleNovoPedido = async () => {
    try {
      const response = await criarPedidosAssistenciaTecnica(novoPedido, token);
      if(response.status === 201){
        toast.success(response.data.message);
        ListarTodosPedidos();
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error: Não foi possível criar o pedido de assitência. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Editar Pedido
  const handleEditarPedido = async () => {
    try {
      const response = await editarPedidosAssistenciaTecnica(novoPedido.pedidoId, novoPedido, token);
      if(response.status === 200){
        toast.success(response.data.message);
        ListarTodosPedidos();
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error: Não foi possível editar o pedido de assitência. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Rejeitar Pedido
  const handleDeletePedido = async (pedidos) => {
    try {
      if(window.confirm('Tem certeza que deseja excluir este pedido?')){
        const response = await deletarPedidosAssistenciaTecnica(pedidos.pedidoId, token);
        if(response.status === 200){
          toast.success(response.data.message);
          ListarTodosPedidos();
        }else{
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Error: Não foi possível deletar o pedido de assitência. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Listar Todas as Viaturas
  const ListarViaturas = async () => {
    try {
      const response = await listarViatura(token);
      if(response){
        setViaturas(response);
      }else{
        toast.warn("Nenhuma viatura encontrada ou formato inesperado.");
        setViaturas([]);
      }
    } catch (error) {
      setViaturas([]);
      toast.error("Erro: Não foi possível listar as viaturas. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Listar Oficinas Prestadoras de Serviço
  const ListarOficinas = async () => {
    try {
      const response = await listarPrestadores(token);
      if(response){
        setOficinas(response);
      }else{
        toast.warn("Nenhuma oficina encontrada ou formato inesperado.");
        setOficinas([]);
      }
    }catch(error){
      setOficinas([]);
      toast.error("Erro: Não foi possível listar as oficinas. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Listar Tipo de Serviço
  const ListarTipoServicoPedido = async () => {
    try {
      const response = await listarTipoServico(token);
      if(response){
        setTipoServico(response);
      }else{
        toast.warn("Nenhum tipo de serviço encontrado ou formato inesperado.");
        setTipoServico([]);
      }
    } catch (error) {
      setTipoServico([]);
      toast.error("Erro: Não foi possível listar os tipos de serviço. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Listar Status Serviço
  const ListarStatusServicoPedido = async () => {
    try {
      const response = await listarStatusServico(token);
      if(response){
        setStatusServico(response);
      }else{
        toast.warn("Nenhum status de serviço encontrado ou formato inesperado.");
        setStatusServico([]);
      }
    } catch (error) {
      setStatusServico([]);
      toast.error("Erro: Não foi possível listar os status de serviço. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Listar Todos os Pedidos
  const ListarTodosPedidos = async () => {
    try {
      const response = await listarPedidosAssistenciaTecnica(token);
      if(response){
        setPedido(response);
        setLoading(false);
      }else{
        toast.warn("Nenhum pedido de assitência encontrada ou formato inesperado.");
        setPedido([]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setPedido([]); // Previna erros futuros
      toast.error("Erro: Não foi possível listar os pedidos de assitência. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      Logout();
      navigate('/login');
    }else{
      ListarTodosPedidos();
      ListarTipoServicoPedido();
      ListarStatusServicoPedido();
      ListarViaturas();
      ListarOficinas();
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
                <Button sx={{ marginTop: 1, marginRight: 1}} variant="contained" color="success" startIcon={<AddIcon />} onClick={()=>navigate('/manutencao')}>
                    Nova Manutenção
                  </Button>
                  <Button sx={{marginTop: 1}} variant="contained" color="error" startIcon={<AddIcon />} onClick={handleOpen}>
                    Novo Pedido de Assistência
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
                    <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Pedidos de Assistência</Typography>
                    <TableContainer component={Paper}>
                      <Table aria-label="tabela de manutencao">
                        <TableHead>
                          <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Marca/Modelo</TableCell>
                            <TableCell>Matrícula</TableCell>
                            <TableCell>Oficina</TableCell>
                            <TableCell>Data Pedido</TableCell>
                            <TableCell>Tipo Serviço</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {pedidosFiltradas?.length > 0 ? (
                          pedidosFiltradas.map((pedidos) => {
                            const apenasData = new Date(pedidos.dataSolicitacao).toISOString().split("T")[0];
                            return (
                              <TableRow key={pedidos.pedidoId} >
                                <TableCell>{pedidos.pedidoId}</TableCell>
                                <TableCell>{pedidos.viatura.viaturaMarca+" - "+pedidos.viatura.viaturaModelo}</TableCell>
                                <TableCell>{pedidos.viatura.viaturaMatricula}</TableCell>
                                <TableCell>{pedidos.prestador.prestadorNome}</TableCell>
                                <TableCell>{apenasData}</TableCell>
                                <TableCell>{pedidos.tipoServico.tipoServico}</TableCell>
                                <TableCell>{pedidos.status.descricao}</TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Editar">
                                    <IconButton color="primary" onClick={() => handleOpen(pedidos)}>
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Ver Detalhes">
                                    <IconButton color="success" onClick={() => navigate(`/DetalhesPedidoAsistenciaTecnica/${pedidos.pedidoId}`)}>
                                      <Visibility />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Excluir">
                                    <IconButton color="secondary"  onClick={() => handleDeletePedido(pedidos)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })
                          ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center">Nenhum pedido de assitência encontrada.</TableCell>
                          </TableRow>
                        )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={pedidosFiltradas.length}
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
        <DialogTitle>{isEdit ? 'Editar Pedido de Assistência' : 'Novo Pedido de Assistência' }</DialogTitle>
        <DialogContent>
            <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                <InputLabel id="role-select-label">Escolha a Viatura</InputLabel>
                <Select
                labelId="role-select-label"
                name="viaturaId"
                value={novoPedido.viaturaId}
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
              <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                <InputLabel id="role-select-label">Tipo de Serviço</InputLabel>
                <Select
                labelId="role-select-label"
                name="tipoServicoId"
                value={novoPedido.tipoServicoId}
                label="Tipo de Serviço"
                onChange={handleChange}
                >
                {tipoServico.map((tipo) => (
                    <MenuItem value={tipo.id}>
                    {tipo.tipoServico}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Descrição Pedido"
              name="descricao"
              fullWidth
              value={novoPedido.descricao}
              onChange={handleChange}
            />
            <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                <InputLabel id="role-select-label">Escolha a Oficina</InputLabel>
                <Select
                labelId="role-select-label"
                name="prestadorId"
                value={novoPedido.prestadorId}
                label="Oficina Prestadora de Serviço"
                onChange={handleChange}
                >
                {oficinas.map((oficina) => (
                    <MenuItem value={oficina.prestadorId}>
                    {oficina.prestadorNome}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
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

export default PedidoAsistenciaTecnica;