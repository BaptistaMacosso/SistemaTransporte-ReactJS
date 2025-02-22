import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Button, Card, CardContent, Grid2, Paper, Stack, TextField, Typography } from '@mui/material';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CadastroMotorista = () => {
  // States
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [motorista, setMotorista] = useState({
    motoristaNome: '',
    numeroBI: '',
    motoristaEmail: '',
    motoristaTelefone: '',
    CartaDeConducaoNr: '',
    DataValidade: '',
    copiaBilheteDeIdentidade: null,
    copiaCartaDeConducao: null,
    foto: null,
    DataEmissaoDaCartaDeConducao: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMotorista({ ...motorista, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setMotorista({ ...motorista, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Cadastro realizado com sucesso!');
    navigate('/motoristas');
  };

  return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }} paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
            <Card sx={{ width: '100%', height: '85vh' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Cadastrar Motorista</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid2 container spacing={2}>
                    <Grid2 item xs={12} md={6}>
                      <TextField fullWidth label="Nome do Motorista" name="motoristaNome" value={motorista.motoristaNome} onChange={handleChange} required />
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <TextField fullWidth label="Número do BI" name="numeroBI" value={motorista.numeroBI} onChange={handleChange} required />
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <TextField fullWidth label="E-mail" name="motoristaEmail" value={motorista.motoristaEmail} onChange={handleChange} />
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <TextField fullWidth label="Telefone" name="motoristaTelefone" value={motorista.motoristaTelefone} onChange={handleChange} required />
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <TextField fullWidth label="Número da Carta de Condução" name="CartaDeConducaoNr" value={motorista.CartaDeConducaoNr} onChange={handleChange} required />
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <TextField fullWidth label="Data de Validade" name="DataValidade" type="date" InputLabelProps={{ shrink: true }} value={motorista.DataValidade} onChange={handleChange} required />
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <Button variant="contained" component="label">
                        Cópia do BI
                        <input hidden type="file" name="copiaBilheteDeIdentidade" onChange={handleFileChange} />
                      </Button>
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <Button variant="contained" component="label">
                        Cópia da Carta de Condução
                        <input hidden type="file" name="copiaCartaDeConducao" onChange={handleFileChange} />
                      </Button>
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <Button variant="contained" component="label">
                        Foto do Motorista
                        <input hidden type="file" name="foto" onChange={handleFileChange} />
                      </Button>
                    </Grid2>
                    <Grid2 item xs={12} md={6}>
                      <TextField fullWidth label="Data de Emissão da Carta de Condução" name="DataEmissaoDaCartaDeConducao" type="date" InputLabelProps={{ shrink: true }} value={motorista.DataEmissaoDaCartaDeConducao} onChange={handleChange} required />
                    </Grid2>
                  </Grid2>
                  <Box mt={2}>
                    <Button type="submit" variant="contained">Salvar</Button>
                    <Button variant="outlined" onClick={() => navigate(-1)} sx={{ ml: 2 }}>Voltar</Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default CadastroMotorista;
