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
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Badge } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


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
        
  const usuarioFiltrado = users.filter((user) =>
     user.userNome.toLowerCase().includes(filtro.toLowerCase())
  );

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

  //............................API...............................................
  // Função para buscar dados da API
  const fetchUsers = async () => {
      try {
        setLoading(true); // Inicia o carregamento
        const response = await axios.get('http://localhost:3050/api/auth/listar', {
          headers: {
            'Authorization': `Bearer ${token}`, // Passa o token no cabeçalho
          },
        }); // Substitua pela sua URL de API
        setUsers(response.data.allUsers); // Armazena a lista de usuários no estado.
      } catch (error) {
        toast.error("Erro: Não foi possível carregar a lista de usuários. Verifique os parametros da API."+error);
      } finally {
        setLoading(false); // Finaliza o carregamento, seja com sucesso ou erro
    };
  };

  // Função para lidar com a mudança no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario({ ...novoUsuario, [name]: value });
  };

  // Função para salvar ou editar usuário
  const handleSave = async() => {
    if (isEdit) {
      // Edição de usuário
      try {
        if (!novoUsuario.userNome && !novoUsuario.userEmail) {
          toast.warning("Preencha todos os campos");
          return;
        }else{
            const response = await axios.put(`http://localhost:3050/api/auth/update/${novoUsuario.userId}`, 
              novoUsuario,
              {
                headers:{
                  'Authorization': `Bearer ${token}`
                }
              });
            if(response.status === 201) {
                toast.success(response.data.message);
            }
        }  
      } catch (err) {
        toast.error('Erro: não foi possível salvar o usuário. Detalhes: '+err);
      }
  
    } else {
      // Adição de novo usuário
      try {
        if (!novoUsuario.userNome && !novoUsuario.userEmail && !novoUsuario.userPassword && !novoUsuario.tipoUsuarioId) {
          toast.warning("Preencha todos os campos");
          return;
        }else{
            const response = await axios.post('http://localhost:3050/api/auth/register', 
              {
                userNome: novoUsuario.userNome,
                userEmail: novoUsuario.userEmail,
                userPassword: novoUsuario.userPassword,
                tipoUsuarioId: novoUsuario.tipoUsuarioId
              });
            if(response.status === 201) {
                toast.success(response.data.message);
            }
        }  
      } catch (err) {
        toast.error('Erro: não foi possível salvar o usuário. Detalhes: '+err);
      }
    }
    handleClose();
    fetchUsers();
  }; 

  //Delete Usuários
  const handleDelete = async (user) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const response = await axios.delete(`http://localhost:3050/api/auth/delete/${user.userId}`);
        if(response.status === 201) {
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error('Erro: não foi possível excluir o usuário.'+error);
      }
      fetchUsers();
    }
  };

  //Perfíl do Usuário.
  const handlePerfil = async (user)=>{
    toast.info('Carregando o perfíl do usuário. '+user.userNome);
  };

  //...........................................................................

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
            {/* Tabela de Viaturas */}
            <Box marginBottom={3} />
            {loading ? ( <CircularProgress /> ) : (
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
                      {usuarioFiltrado.map((user) => {
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
                                <IconButton color="success" onClick={() => handlePerfil(user)}>
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
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid2>
            )} {/*Fim do loading*/ }


            {/* Modal de Adicionar Nova Viatura */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{isEdit===true ? 'Editar Usuário' : 'Adicionar Usuário' }</DialogTitle>
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
                <Button onClick={handleSave} color="primary">{isEdit===true ? 'Salvar Alterações' : 'Adicionar' }</Button>
              </DialogActions>
            </Dialog>        

        </Box>
      </Box>
    </>
  )
  };

export default Usuarios;