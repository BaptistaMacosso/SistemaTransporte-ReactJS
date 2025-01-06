import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
  IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2,
  CircularProgress,
  TablePagination,
  Stack,
  CardContent
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, AirlineStops } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {inserirMotorista, editarMotorista, deletarMotorista, listarMotoristas} from '../../services/motoristaService';


const Motoristas = () => {
    // Recupera o token do contexto de autenticação ou localStorage
    const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
    const { isAuthenticated, logout  } = useContext(AuthContext);
    const [motoristas, setMotoristas] = useState([]);
    const [NovoMotorista, setNovoMotorista] = useState({ motoristaId: null, motoristaNome: '', motoristaEmail: '', motoristaTelefone: '', CartaDeConducaoNr: '', DataValidade: '', numeroBI: ''});
    const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState('');
    const { navigate } = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Número de linhas por página

    const handleOpen = (motoris) => {
      if(motoris.motoristaId === undefined){
        setIsEdit(false);
        setNovoMotorista({ 
          motoristaId: null, 
          motoristaNome: motoris.motoristaNome || '', 
          motoristaEmail: motoris.motoristaEmail || '', 
          motoristaTelefone: motoris.motoristaTelefone || '', 
          CartaDeConducaoNr: motoris.CartaDeConducaoNr || '', 
          DataValidade: motoris.DataValidade || '', 
          numeroBI: motoris.numeroBI || ''});
        }
        else{
          setIsEdit(true);
          setNovoMotorista({ 
            motoristaId: motoris.motoristaId, 
            motoristaNome: motoris.motoristaNome, 
            motoristaEmail: motoris.motoristaEmail, 
            motoristaTelefone: motoris.motoristaTelefone, 
            CartaDeConducaoNr: motoris.CartaDeConducaoNr, 
            DataValidade: motoris.DataValidade, 
            numeroBI: motoris.numeroBI});
          }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNovoMotorista({ ...NovoMotorista, [name]: value });
    };
        
    //Pesquisar Motoristas na tabela.
    const handleSearch = (e) => setFiltro(e.target.value);
        
    /*const motoristaFiltrado = motoristas.filter((moto) =>
       moto.motoristaNome.toLowerCase().includes(filtro.toLowerCase())
    );*/
    const motoristaFiltrado = Array.isArray(motoristas) 
    ? motoristas.filter((moto) => moto.motoristaNome.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

    // Dados paginados
    const displayedLicencas = motoristaFiltrado.slice(
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
      
    //.........................API...............................
    useEffect(()=>{
      if(!isAuthenticated){
        logout();
        navigate('/login');
      }else{
        fetchMotoristas();
      }
    },[isAuthenticated, logout]);

    const fetchMotoristas = async () => {
      setLoading(true);
      try {
        const response = await listarMotoristas(token);
        // Garanta que 'motorista' seja um array antes de setá-lo no estado
        if (response) {
          setMotoristas(response);
          setLoading(false);
        } else {
          toast.warn("Nenhum motorista encontrado ou formato inesperado.");
          setMotoristas([]); // Previna erros futuros
          setLoading(false);
        }
      } catch (error) {
        setMotoristas([]); // Previna erros futuros
        toast.error("Erro: Não foi possível carregar a lista de motoristas. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      }
    };

    const handleSave = async() => {
      if(isEdit){
        handleEdit();
      }else{
        if(!NovoMotorista.motoristaNome && !NovoMotorista.motoristaTelefone && !NovoMotorista.CartaDeConducaoNr &&
           !NovoMotorista.DataValidade && !NovoMotorista.numeroBI){
            toast.error('Por favor, preencha todos os campo antes de salvar.');
        }else{
          try{
            const response = await inserirMotorista(NovoMotorista,token);
            if(response.status === 201){
              toast.success(response.data.message);
              fetchMotoristas();
            }else{
              toast.error(response.data.message);
            }
          }catch(error){
            toast.error('Erro: não foi possível salvar o motorista. Verifique os detalhes no console.');
            console.log("Detalhes: "+error);
          }
        }
      }
      handleClose();
    };

    //Editar Motorista
    const handleEdit = async () =>{
      try{
        const response = await editarMotorista(NovoMotorista,token);
        if(response.status === 201){
          toast.success(response.data.message);
          fetchMotoristas();
        }else{
          toast.error(response.data.message);
        }
      }catch(error){
        toast.error('Erro: não foi possível editar o motorista. Verifique os detalhes no console.');
        console.log("Detalhes: "+error);
      }
    };

    //Delete Motorista
    const handleDelete = async (motorista) => {
      if (window.confirm('Tem certeza que deseja excluir este Motorista?')) {
        try {
          const response = await deletarMotorista(motorista.motoristaId,token);
          if(response.status === 201) {
            toast.success(response.data.message);
            fetchMotoristas();
          }else{
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error('Erro: não foi possível excluir o motorista. Verifica os detalhes no console.');
          console.log("Detalhes: "+error);
        }
      }
    };
    //...........................................................

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
                    label="Pesquisar por Nome"
                    variant="outlined"
                    value={filtro}
                    onChange={handleSearch}
                    sx={{ marginBottom: 2 }}
                  />
                  <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                    Novo Motorista
                  </Button>
              </Grid2>
              </CardContent>
              </Card>
            </Stack>
          {/* Tabela de Viaturas */}
          <Box marginBottom={3}/>
          {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
          <Grid2 item xs={12}>
          <Box marginBottom={2}/>
            <Card>
              <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Motoristas</Typography>
              <TableContainer component={Paper}>
                <Table aria-label="tabela de motoristas">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Nome do Motorista</TableCell>
                      <TableCell>Telemóvel</TableCell>
                      <TableCell>Endereço de e-mail</TableCell>
                      <TableCell>Nrº Bilhete</TableCell>
                      <TableCell>Nrº Carta de Condução</TableCell>
                      <TableCell>Data Validade</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {motoristaFiltrado?.length > 0 ? (
                    motoristaFiltrado.map((motorista) => {
                      return (
                        <TableRow key={motorista.motoristaId}>
                          <TableCell>{motorista.motoristaId}</TableCell>
                          <TableCell>{motorista.motoristaNome}</TableCell>
                          <TableCell>{motorista.motoristaTelefone}</TableCell>
                          <TableCell>{motorista.motoristaEmail}</TableCell>
                          <TableCell>{motorista.numeroBI}</TableCell>
                          <TableCell>{motorista.CartaDeConducaoNr}</TableCell>
                          <TableCell>{motorista.DataValidade}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton color="primary" onClick={() => handleOpen(motorista)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Atribuir Viatura">
                                <IconButton color="sucess" onClick={() => handleOpen(motorista)}>
                                <AirlineStops />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton color="secondary" onClick={() => handleDelete(motorista)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">Nenhum motorista encontrado.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={motoristaFiltrado.length}
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
            <DialogTitle>{isEdit===true ? 'Editar Motorista' : 'Adicionar Novo Motorista' }</DialogTitle>
            <DialogContent>
              <Grid2 item size={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Nome"
                  name="motoristaNome"
                  type="text"
                  fullWidth
                  value={NovoMotorista.motoristaNome}
                  onChange={handleChange}
                />
              </Grid2>
              <Grid2 item size={12}>
                <TextField
                  margin="dense"
                  label="Email"
                  name="motoristaEmail"
                  fullWidth
                  type="email"
                  value={NovoMotorista.motoristaEmail}
                  onChange={handleChange}
                />
              </Grid2>
              <Grid2 item size={4}>
              <TextField
                margin="dense"
                label="Telefone"
                name="motoristaTelefone"
                type="tel"
                fullWidth
                value={NovoMotorista.motoristaTelefone}
                onChange={handleChange}
              />
              </Grid2>
              <Grid2 item size={4}>
                <TextField
                  margin="dense"
                  label="Carta de Condução"
                  name="CartaDeConducaoNr"
                  type="text"
                  fullWidth
                  value={NovoMotorista.CartaDeConducaoNr}
                  onChange={handleChange}
                />
              </Grid2>
              <TextField
                margin="dense"
                label="Data Validade"
                name="DataValidade"
                type="date"
                fullWidth
                value={NovoMotorista.DataValidade}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Número Bilhete"
                name="numeroBI"
                type="text"
                fullWidth
                value={NovoMotorista.numeroBI}
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

export default Motoristas;