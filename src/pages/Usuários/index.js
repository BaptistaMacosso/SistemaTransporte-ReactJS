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
  Stack,
  CardContent
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Badge } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deletarUsuario, editarUsuario, inserirUsuario, listarUsuarios } from '../../services/userService';


const Usuarios = () => {
  // Recupera o token do contexto de autenticação ou localStorage
  const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
  const [novoUsuario, setNovoUsuario] = useState({userId: null, userNome: '', userEmail: '', userPassword: '', tipoUsuarioId: '' });
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]); // Estado para armazenar a lista de usuários.
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento.
  const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
  const [filtro, setFiltro] = useState(''); // Lista de usuários filtrada.
  const nagivate = useNavigate();


  // Função para abrir o modal para adicionar ou editar
  const handleOpen = (user) => {
    if (user.userId === undefined) {
      setIsEdit(false);
      setNovoUsuario({
        id: user.id || null,
        userNome: user.userNome || '',
        userEmail: user.userEmail || '',
        userPassword: user.userPassword || '',
        tipoUsuarioId: user.tipoUsuarioId || ''
      });
    } else {
      setIsEdit(true);
      setNovoUsuario({
        userId: user.userId,
        userNome: user.userNome,
        userEmail: user.userEmail,
        userPassword: user.userPassword,
        tipoUsuarioId: user.tipoUsuarioId
      });
    }
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setNovoUsuario({ id: null, nome: '', email: '', senha: '', tipo: '' });
  };

  //Pesquisar Motoristas
  const handleSearch = (e) => setFiltro(e.target.value);
        
  /*const usuarioFiltrado = users.filter((user) =>
     user.userNome.toLowerCase().includes(filtro.toLowerCase())
  );*/

  const usuarioFiltrado = Array.isArray(users) 
    ? users.filter((user) => user.userNome.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

  // Função para lidar com a mudança no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario({ ...novoUsuario, [name]: value });
  };

  //............................API...............................................
  // Função para buscar dados da API
  const fetchUsers = async () => {
      try {
        setLoading(true); // Inicia o carregamento
        const response = await listarUsuarios(token); 
        if(response){
          setUsers(response);
          setLoading(false);
        }else{
          setUsers([]);
          toast.warn("Nenhum usuário encontrado ou formato inesperado.");
        }
      } catch (error) {
        setUsers([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar os usuários. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      } 
  };

  // Função para salvar ou editar usuário
  const handleSave = () => {
    if(isEdit){ 
      handleEditarUsuario();
      setIsEdit(false);
      setOpen(false);
    }else{
      handleNovoUsuario();
      setOpen(false);
    }
  }; 

  //Criar Usuários
  const handleNovoUsuario = async () => {
    try {
          const response = await inserirUsuario(novoUsuario, token);
          if(response.status === 201){
            toast.success(response.message);
            fetchUsers();
          }else{
            toast.success(response.message);
          }
        } catch (error) {
          toast.error("Erro: Não foi possível criar o usuário. Verifique os detalhes no console.");
          console.log("Detalhes: "+error);
        }
  };

  //Editar Usuários
  const handleEditarUsuario = async () => {
    try {
      const response = await editarUsuario(novoUsuario.userId, novoUsuario, token);
      if(response.status === 201){
        toast.success(response.message);
        fetchUsers();
      }else{
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Erro: Não foi possível editar o usuário. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Delete Usuários
  const handleDelete = async (user) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const response = await deletarUsuario(user.userId, token);
        if(response.status === 201) {
          toast.success(response.data.message);
          fetchUsers();
        }else{
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Erro: Não foi possível excluir o usuário. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      }
    }
  };

  //UseEffect
  useEffect(() => {
    if (!isAuthenticated) {
      logout(); // Remove o token
      // Redirecionamento para página de login
      nagivate('/login');
    }else{
      fetchUsers();
    }
  }, [isAuthenticated, logout]);

  //...........................................................................

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
                      label="Pesquisar por nome"
                      variant="outlined"
                      value={filtro}
                      onChange={handleSearch}
                      sx={{ marginBottom: 2 }}
                    />
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                      Novo Usuário
                    </Button>
                </Grid2>
                </CardContent>
              </Card>
            </Stack>
            {/* Tabela de Viaturas */}
            <Box marginBottom={3} />
            {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
            <Grid2 item xs={12}>
              <Box marginBottom={2}/>
                <Card>
                  <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Usuários</Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="tabela de usuários">
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Nome Usuário</TableCell>
                          <TableCell>Endereço de E-mail</TableCell>
                          <TableCell>Tipo de Usuário</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {usuarioFiltrado?.length > 0 ? (
                        usuarioFiltrado.map((user) => {
                          return (
                            <TableRow key={user.userId}>
                              <TableCell>{user.userId}</TableCell>
                              <TableCell>{user.userNome}</TableCell>
                              <TableCell>{user.userEmail}</TableCell>
                              <TableCell>{user.tipoUser.descricaoTipo}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="Editar">
                                  <IconButton color="primary" onClick={() => handleOpen(user)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Perfíl do Usuário">
                                  <IconButton color="success" onClick={() => nagivate(`/DetalhePerfilUsuario/${user.userId}`)}>
                                    <Badge/>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton color="secondary" onClick={() => handleDelete(user)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} align="center">Nenhum usuário encontrado.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid2>
            )} {/*Fim do loading*/ }

            {/* Modal de Adicionar Nova Viatura */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{isEdit ? 'Editar Usuário' : 'Adicionar Usuário' }</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Nome de Usuário"
                  name="userNome"
                  type="text"
                  fullWidth
                  value={novoUsuario.userNome}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="E-mail"
                  name="userEmail"
                  type="email"
                  fullWidth
                  value={novoUsuario.userEmail}
                  onChange={handleChange}
                />
                {/* Renderiza os campos de senha e tipo de usuário somente para criar */}
                {!isEdit && (
                <>
                  <TextField
                    margin="dense"
                    label="Password"
                    name="userPassword"
                    type="password"
                    fullWidth
                    value={novoUsuario.userPassword}
                    onChange={handleChange}
                  />
                  <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                  <InputLabel id="role-select-label">Tipo de Usuário</InputLabel>
                  <Select
                    labelId="role-select-label"
                    name="tipoUsuarioId"
                    value={novoUsuario.tipoUsuarioId}
                    label="Tipo de Usuário"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>Administrador</MenuItem>
                    <MenuItem value={2}>Motorista</MenuItem>
                    <MenuItem value={3}>Mecânico</MenuItem>
                  </Select>
                </FormControl>
              </>)}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSave} color="primary">{isEdit ? 'Salvar Alterações' : 'Adicionar' }</Button>
              </DialogActions>
            </Dialog>        

        </Box>
      </Box>
    </>
  )
  };

export default Usuarios;