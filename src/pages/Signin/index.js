import React, { useContext, useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext, useAuth } from '../../contexts/auth';
import axios from 'axios';
import { H7 } from './styles';
import { loginUsuario } from '../../services/userService';

const Signin = () => {
  // Recupera o token do contexto de autenticação ou localStorage
  const token = localStorage.getItem('token');
  const { isTokenExpired } = useContext(AuthContext);
  const navigate = useNavigate();
  const [novoUsuario, setNovoUsuario] = useState({
    userId: null,
    userNome: '',
    userEmail: '',
    userPassword: '',
    tipoUsuarioId: ''
  });
  const { login } = useAuth();

  // Verificação do token na montagem do componente
  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      navigate("/Home"); // Redireciona para a página Home se o token for válido
    }
  }, [token, isTokenExpired, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario({ ...novoUsuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação inicial
    if (!novoUsuario.userEmail || !novoUsuario.userPassword) {
      toast.warn("Todos os campos são de preenchimento obrigatório!");
      return;
    };

    try {
      const response = await loginUsuario(novoUsuario);
      if (response?.token) {
        login(response.token);
        navigate('/Home');
      } 
    } catch (error) {
      if(error.status === 401 || error.status === 404 || error.status === 400){
        toast.warn(error.response.data.message+" Verifica as credenciais e tente novamente.");
        return;
      }else if(error.status === 500){
        toast.error(error.response.data.message);
        console.error("Detalhes do erro: ", error?.response || error);
        return;
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <IconButton>
              <AccountCircleIcon style={{ fontSize: 60, color: '#3f51b5' }} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box marginBottom={2}>
              <TextField
                label="E-mail"
                type="email"
                variant="outlined"
                fullWidth
                name="userEmail"
                autoComplete="off"
                value={novoUsuario.userEmail}
                onChange={handleChange}
              />
            </Box>
            <Box marginBottom={2}>
              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                fullWidth
                name="userPassword"
                autoComplete="off"
                value={novoUsuario.userPassword}
                onChange={handleChange}
              />
            </Box>
            <Box marginBottom={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Entrar</Button>
            </Box>
          </form>
          <Typography variant="body2" color="textSecondary" align="center">
           <H7>&copy;2024 - Todos os direitos reservados.</H7> 
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signin;
