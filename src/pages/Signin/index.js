import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/auth';
import axios from 'axios';
import { H7 } from './styles';

const Signin = () => {
  const navigate = useNavigate();
  const [novoUsuario, setNovoUsuario] = useState({
    userId: null,
    userNome: '',
    userEmail: '',
    userPassword: '',
    tipoUsuarioId: ''
  });
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario({ ...novoUsuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!novoUsuario.userEmail || !novoUsuario.userPassword) {
        toast.warn("O preenchamento de todos os campos é obrigatório!");
        return;
      };
      const response = await axios.post('https://sistema-transporte-backend.vercel.app/api/auth/login',
        novoUsuario,{
          headers: {
            'Content-Type': 'application/json',
          },
        });
      if(response.status === 201) {
          login(response.data.token);
          navigate('/Home');
      }else if(response.status === 400 || response.status === 401 || response.status === 404){
        toast.error(response.data.message);
      }
    } catch (err) {
      if(err.response.status === 500){
        toast.error(err.response.data.message);
      }
    };
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
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Entrar
              </Button>
            </Box>
          </form>
          <Typography variant="body2" color="textSecondary" align="center">
           <H7>&copy; Desenvolvido por: Fluente Systems.</H7> 
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signin;
