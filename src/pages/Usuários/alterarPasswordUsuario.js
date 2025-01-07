import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Button, Card, CardContent, Grid2, Paper, Stack, TextField, Typography } from '@mui/material';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
//API
import { buscarUsuarioPorId, alterarPasswordUsuario } from '../../services/userService';
import { Group } from '@mui/icons-material';


const AlterarPasswordUsuario = () => {
  //States
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usuario, setUsuario] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  //
  

  //...................................API........................
  // Busca os detalhes do pedido ao carregar a página.
  const fetchPerfilUsuario = async () => {
    try {
      const response = await buscarUsuarioPorId(id, token);
      if(response){
        setUsuario(response.user);
      }else{
        toast.warn("Nenhum detalhe do usuário encontrada ou formato inesperado.");
        setUsuario([]);
      } 
    } catch (error) {
      setUsuario([]); // Previna erros futuros
      toast.error("Error: Não foi possível listar os detalhes do usuário. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Submeter as informações
  const handlePasswordChange = async() => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Todos os campos são de preenchimento obrigatório.');
      return;
    };

    if (newPassword !== confirmPassword) {
        toast.error("As novas senhas não coincidem.");
      return;
    };

    // Simulação de envio para API
    try {
      const response = await alterarPasswordUsuario(id, newPassword, oldPassword, token);
      if(response.status === 200){
        toast.success(response.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }else{
        toast.error(response.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
       if(error.response.status === 404){
        toast.warn(error.response.data.message);
       }else if(error.response.status === 500 || error.response.status === 401){
        toast.error("Error: Não foi possível alterar a senha. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
       }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      Logout();
      navigate('/login');
    }else{
      fetchPerfilUsuario();
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
          <Card sx={{ width: '100%', height: 85+"vh" }}>
            <CardContent>
                <Grid2 container spacing={2} direction={'row'}>
                    <Group sx={{marginTop: 0.5, marginLeft: 0, color: 'text.secondary'}} />
                    <Typography sx={{ color: 'text.secondary', marginBottom: 1 }} gutterBottom variant="h6" component="div">Detalhes do Usuário</Typography>
                </Grid2>
                <Box p={3}>
                <Card sx={{ mt: 1 }}>
                    <CardContent>
                    <Paper sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>Código Interno #{usuario.userId}</Typography>
                    <Typography><strong>Nome de Usuário:</strong> {usuario.userNome}</Typography>
                    <Typography><strong>E-mail:</strong> {usuario.userEmail}</Typography>
                    <Typography><strong>Perfíl do Usuário:</strong> {usuario.tipoUser?.descricaoTipo}</Typography>
                    <Typography><strong>Grupo do Usuário:</strong> {usuario.grupoUser?.grupoName}</Typography>
                    <Box mt={1} />
                    <Box mt={1}>
                        <TextField
                        label="Senha Antiga"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <TextField
                        label="Nova Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                        label="Confirmar Nova Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={12}>
                                <Button variant="contained" color="warning" sx={{ mt: 2 }} fullWidth onClick={handlePasswordChange}>Confirmar</Button>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={() => navigate(-1)}>Voltar</Button>
                            </Grid2>
                        </Grid2>
                    </Box>         
                    </Paper>
                    </CardContent>
                </Card>
                </Box>
            </CardContent>
            </Card>
        </Stack>
      </Box>
    </Box>
  </>
  )
}

export default AlterarPasswordUsuario;